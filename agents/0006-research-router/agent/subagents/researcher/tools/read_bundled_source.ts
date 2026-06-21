import { readBundledSource } from "#lib/sources.js";
import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description:
    "Read a bundled eve documentation summary from data/sources/ by filename (e.g. introduction.md).",
  inputSchema: z.object({
    filename: z
      .string()
      .min(1)
      .describe("Markdown filename in data/sources/, e.g. introduction.md"),
  }),
  async execute({ filename }) {
    return readBundledSource(filename);
  },
});
