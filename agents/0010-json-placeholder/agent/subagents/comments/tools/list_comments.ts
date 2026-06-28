import { listResource } from "#lib/jsonplaceholder.js";
import { defineTool } from "eve/tools";
import { z } from "zod";
import { idSchema } from "#lib/schemas.js";

export default defineTool({
  description: "List all comments from JSONPlaceholder, with optional query filters.",
  inputSchema: z.object({
    postId: idSchema.optional().describe("Filter by postId"),
  }),
  async execute(input) {
    const query: Record<string, string | number | boolean> = {};
    if (input.postId !== undefined) query.postId = input.postId;
    return listResource("comments", Object.keys(query).length ? query : undefined);
  },
});
