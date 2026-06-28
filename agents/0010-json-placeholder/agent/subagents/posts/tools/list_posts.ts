import { listResource } from "#lib/jsonplaceholder.js";
import { defineTool } from "eve/tools";
import { z } from "zod";
import { idSchema } from "#lib/schemas.js";

export default defineTool({
  description: "List all posts from JSONPlaceholder, with optional query filters.",
  inputSchema: z.object({
    userId: idSchema.optional().describe("Filter by userId"),
  }),
  async execute(input) {
    const query: Record<string, string | number | boolean> = {};
    if (input.userId !== undefined) query.userId = input.userId;
    return listResource("posts", Object.keys(query).length ? query : undefined);
  },
});
