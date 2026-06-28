import { listResource } from "#lib/jsonplaceholder.js";
import { defineTool } from "eve/tools";
import { z } from "zod";
import { idSchema } from "#lib/schemas.js";

export default defineTool({
  description: "List all photos from JSONPlaceholder, with optional query filters.",
  inputSchema: z.object({
    albumId: idSchema.optional().describe("Filter by albumId"),
  }),
  async execute(input) {
    const query: Record<string, string | number | boolean> = {};
    if (input.albumId !== undefined) query.albumId = input.albumId;
    return listResource("photos", Object.keys(query).length ? query : undefined);
  },
});
