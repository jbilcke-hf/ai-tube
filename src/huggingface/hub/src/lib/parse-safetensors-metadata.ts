import type { SetRequired } from "type-fest";
import type { Credentials, RepoDesignation } from "../types/public";
import { checkCredentials } from "../utils/checkCredentials";
import { omit } from "../utils/omit";
import { toRepoId } from "../utils/toRepoId";
import { typedEntries } from "../utils/typedEntries";
import { downloadFile } from "./download-file";
import { fileExists } from "./file-exists";
import { promisesQueue } from "../utils/promisesQueue";

const SINGLE_FILE = "model.safetensors";
const INDEX_FILE = "model.safetensors.index.json";
const PARALLEL_DOWNLOADS = 5;
const MAX_HEADER_LENGTH = 25_000_000;

class SafetensorParseError extends Error {}

type FileName = string;

export type TensorName = string;
export type Dtype = "F64" | "F32" | "F16" | "BF16" | "I64" | "I32" | "I16" | "I8" | "U8" | "BOOL";

export interface TensorInfo {
	dtype: Dtype;
	shape: number[];
	data_offsets: [number, number];
}

export type SafetensorsFileHeader = Record<TensorName, TensorInfo> & {
	__metadata__: Record<string, string>;
};

export interface SafetensorsIndexJson {
	dtype?: string;
	/// ^there's sometimes a dtype but it looks inconsistent.
	metadata?: Record<string, string>;
	/// ^ why the naming inconsistency?
	weight_map: Record<TensorName, FileName>;
}

export type SafetensorsShardedHeaders = Record<FileName, SafetensorsFileHeader>;

export type SafetensorsParseFromRepo =
	| {
			sharded: false;
			header: SafetensorsFileHeader;
			parameterCount?: Partial<Record<Dtype, number>>;
	  }
	| {
			sharded: true;
			index: SafetensorsIndexJson;
			headers: SafetensorsShardedHeaders;
			parameterCount?: Partial<Record<Dtype, number>>;
	  };

async function parseSingleFile(
	path: string,
	params: {
		repo: RepoDesignation;
		revision?: string;
		credentials?: Credentials;
		hubUrl?: string;
		/**
		 * Custom fetch function to use instead of the default one, for example to use a proxy or edit headers.
		 */
		fetch?: typeof fetch;
	}
): Promise<SafetensorsFileHeader> {
	const firstResp = await downloadFile({
		...params,
		path,
		range: [0, 7],
	});

	if (!firstResp) {
		throw new SafetensorParseError(`Failed to parse file ${path}: failed to fetch safetensors header length.`);
	}

	const bufLengthOfHeaderLE = await firstResp.arrayBuffer();
	const lengthOfHeader = new DataView(bufLengthOfHeaderLE).getBigUint64(0, true);
	// ^little-endian
	if (lengthOfHeader <= 0) {
		throw new SafetensorParseError(`Failed to parse file ${path}: safetensors header is malformed.`);
	}
	if (lengthOfHeader > MAX_HEADER_LENGTH) {
		throw new SafetensorParseError(
			`Failed to parse file ${path}: safetensor header is too big. Maximum supported size is ${MAX_HEADER_LENGTH} bytes.`
		);
	}

	const secondResp = await downloadFile({ ...params, path, range: [8, 7 + Number(lengthOfHeader)] });

	if (!secondResp) {
		throw new SafetensorParseError(`Failed to parse file ${path}: failed to fetch safetensors header.`);
	}

	try {
		// no validation for now, we assume it's a valid FileHeader.
		const header: SafetensorsFileHeader = await secondResp.json();
		return header;
	} catch (err) {
		throw new SafetensorParseError(`Failed to parse file ${path}: safetensors header is not valid JSON.`);
	}
}

async function parseShardedIndex(
	path: string,
	params: {
		repo: RepoDesignation;
		revision?: string;
		credentials?: Credentials;
		hubUrl?: string;
		/**
		 * Custom fetch function to use instead of the default one, for example to use a proxy or edit headers.
		 */
		fetch?: typeof fetch;
	}
): Promise<{ index: SafetensorsIndexJson; headers: SafetensorsShardedHeaders }> {
	const indexResp = await downloadFile({
		...params,
		path,
	});

	if (!indexResp) {
		throw new SafetensorParseError(`Failed to parse file ${path}: failed to fetch safetensors index.`);
	}

	// no validation for now, we assume it's a valid IndexJson.
	const index: SafetensorsIndexJson = await indexResp.json();

	const filenames = [...new Set(Object.values(index.weight_map))];
	const shardedMap: SafetensorsShardedHeaders = Object.fromEntries(
		await promisesQueue(
			filenames.map(
				(filename) => async () =>
					[filename, await parseSingleFile(filename, params)] satisfies [string, SafetensorsFileHeader]
			),
			PARALLEL_DOWNLOADS
		)
	);
	return { index, headers: shardedMap };
}

/**
 * Analyze model.safetensors.index.json or model.safetensors from a model hosted
 * on Hugging Face using smart range requests to extract its metadata.
 */
export async function parseSafetensorsMetadata(params: {
	/** Only models are supported */
	repo: RepoDesignation;
	/**
	 * Will include SafetensorsParseFromRepo["parameterCount"], an object containing the number of parameters for each DType
	 *
	 * @default false
	 */
	computeParametersCount: true;
	hubUrl?: string;
	credentials?: Credentials;
	revision?: string;
	/**
	 * Custom fetch function to use instead of the default one, for example to use a proxy or edit headers.
	 */
	fetch?: typeof fetch;
}): Promise<SetRequired<SafetensorsParseFromRepo, "parameterCount">>;
export async function parseSafetensorsMetadata(params: {
	/** Only models are supported */
	repo: RepoDesignation;
	/**
	 * Will include SafetensorsParseFromRepo["parameterCount"], an object containing the number of parameters for each DType
	 *
	 * @default false
	 */
	computeParametersCount?: boolean;
	hubUrl?: string;
	credentials?: Credentials;
	revision?: string;
	/**
	 * Custom fetch function to use instead of the default one, for example to use a proxy or edit headers.
	 */
	fetch?: typeof fetch;
}): Promise<SafetensorsParseFromRepo>;
export async function parseSafetensorsMetadata(params: {
	repo: RepoDesignation;
	computeParametersCount?: boolean;
	hubUrl?: string;
	credentials?: Credentials;
	revision?: string;
	/**
	 * Custom fetch function to use instead of the default one, for example to use a proxy or edit headers.
	 */
	fetch?: typeof fetch;
}): Promise<SafetensorsParseFromRepo> {
	checkCredentials(params.credentials);
	const repoId = toRepoId(params.repo);

	if (repoId.type !== "model") {
		throw new TypeError("Only model repos should contain safetensors files.");
	}

	if (await fileExists({ ...params, path: SINGLE_FILE })) {
		const header = await parseSingleFile(SINGLE_FILE, params);
		return {
			sharded: false,
			header,
			...(params.computeParametersCount && {
				parameterCount: computeNumOfParamsByDtypeSingleFile(header),
			}),
		};
	} else if (await fileExists({ ...params, path: INDEX_FILE })) {
		const { index, headers } = await parseShardedIndex(INDEX_FILE, params);
		return {
			sharded: true,
			index,
			headers,
			...(params.computeParametersCount && {
				parameterCount: computeNumOfParamsByDtypeSharded(headers),
			}),
		};
	} else {
		throw new Error("model id does not seem to contain safetensors weights");
	}
}

function computeNumOfParamsByDtypeSingleFile(header: SafetensorsFileHeader): Partial<Record<Dtype, number>> {
	const counter: Partial<Record<Dtype, number>> = {};
	const tensors = omit(header, "__metadata__");

	for (const [, v] of typedEntries(tensors)) {
		if (v.shape.length === 0) {
			continue;
		}
		counter[v.dtype] = (counter[v.dtype] ?? 0) + v.shape.reduce((a, b) => a * b);
	}
	return counter;
}

function computeNumOfParamsByDtypeSharded(shardedMap: SafetensorsShardedHeaders): Partial<Record<Dtype, number>> {
	const counter: Partial<Record<Dtype, number>> = {};
	for (const header of Object.values(shardedMap)) {
		for (const [k, v] of typedEntries(computeNumOfParamsByDtypeSingleFile(header))) {
			counter[k] = (counter[k] ?? 0) + (v ?? 0);
		}
	}
	return counter;
}
