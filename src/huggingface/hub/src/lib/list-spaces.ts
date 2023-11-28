import { HUB_URL } from "../consts";
import { createApiError } from "../error";
import type { ApiSpaceInfo } from "../types/api/api-space";
import type { Credentials, SpaceSdk } from "../types/public";
import { checkCredentials } from "../utils/checkCredentials";
import { parseLinkHeader } from "../utils/parseLinkHeader";
import { pick } from "../utils/pick";

const EXPAND_KEYS = ["sdk", "likes", "private", "lastModified"];

export type SpaceEntry = {
	id: string;
	name: string;
	sdk?: SpaceSdk;
	likes: number;
	private: boolean;
	updatedAt: Date;
	// Use additionalFields to fetch the fields from ApiSpaceInfo
} & Partial<Omit<ApiSpaceInfo, "updatedAt">>;

export async function* listSpaces(params?: {
	search?: {
		owner?: string;
	};
	credentials?: Credentials;
	hubUrl?: string;
	/**
	 * Custom fetch function to use instead of the default one, for example to use a proxy or edit headers.
	 */
	fetch?: typeof fetch;
	/**
	 * Additional fields to fetch from huggingface.co.
	 */
	additionalFields?: Array<keyof ApiSpaceInfo>;
}): AsyncGenerator<SpaceEntry> {
	checkCredentials(params?.credentials);
	const search = new URLSearchParams([
		...Object.entries({ limit: "500", ...(params?.search?.owner ? { author: params.search.owner } : undefined) }),
		...[...EXPAND_KEYS, ...(params?.additionalFields ?? [])].map((val) => ["expand", val] satisfies [string, string]),
	]).toString();
	let url: string | undefined = `${params?.hubUrl || HUB_URL}/api/spaces?${search}`;

	while (url) {
		const res: Response = await (params?.fetch ?? fetch)(url, {
			headers: {
				accept: "application/json",
				...(params?.credentials ? { Authorization: `Bearer ${params.credentials.accessToken}` } : undefined),
			},
		});

		if (!res.ok) {
			throw createApiError(res);
		}

		const items: ApiSpaceInfo[] = await res.json();

		for (const item of items) {
			yield {
				...(params?.additionalFields && pick(item, params.additionalFields)),
				id: item._id,
				name: item.id,
				sdk: item.sdk,
				likes: item.likes,
				private: item.private,
				updatedAt: new Date(item.lastModified),
			};
		}

		const linkHeader = res.headers.get("Link");

		url = linkHeader ? parseLinkHeader(linkHeader).next : undefined;
	}
}
