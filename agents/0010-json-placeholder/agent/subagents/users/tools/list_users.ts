import { listResource } from "#lib/jsonplaceholder.js";
import { defineTool } from "eve/tools";
import { z } from "zod";


export default defineTool({
  description: "List all users from JSONPlaceholder.",
  inputSchema: z.object({

  }),
  async execute(input) {
    const query: Record<string, string | number | boolean> = {};

    return listResource("users", Object.keys(query).length ? query : undefined);
  },
});
