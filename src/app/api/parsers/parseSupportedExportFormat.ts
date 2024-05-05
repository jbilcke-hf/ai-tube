import { defaultExportFormat, SupportedExportFormat } from "@aitube/client"

export function parseSupportedExportFormat(
    input?: any,
    defaultFormat: SupportedExportFormat = defaultExportFormat
  ): SupportedExportFormat {

  let format: SupportedExportFormat = defaultFormat
  try {
    format = decodeURIComponent(`${input || ""}` || defaultFormat).trim() as SupportedExportFormat
    if (format !== "mp4" && format !== "webm") {
      format = defaultFormat
    }
  } catch (err) {}
  return format
}