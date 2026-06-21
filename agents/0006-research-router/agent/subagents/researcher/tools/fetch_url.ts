import { fetchSourceUrl } from "#lib/sources.js";
import { defineTool } from "eve/tools";
import { z } from "zod";

const PREVIEW_CHARS = 12_000;

export default defineTool({
  description:
    "Required first call. Fetches SOURCE_URL (default https://eve.dev/docs/introduction). Returns configured=false only when SOURCE_URL=none.",
  inputSchema: z.object({}),
  async execute() {
    const result = await fetchSourceUrl();

    if (!result.configured) {
      return {
        configured: false,
        url: null,
        title: null,
        contentPreview: null,
        contentType: null,
        truncated: false,
      };
    }

    const content = result.content ?? "";
    const truncated = content.length > PREVIEW_CHARS;
    const contentPreview = truncated ? content.slice(0, PREVIEW_CHARS) : content;

    return {
      configured: true,
      url: result.url,
      title: result.title,
      contentPreview,
      contentType: result.contentType,
      truncated,
    };
  },
});
