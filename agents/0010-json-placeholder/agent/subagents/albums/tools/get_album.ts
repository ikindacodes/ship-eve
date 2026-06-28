import { getResource } from "#lib/jsonplaceholder.js";
import { idSchema } from "#lib/schemas.js";
import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description: "Fetch a single album by id from JSONPlaceholder.",
  inputSchema: z.object({ id: idSchema }),
  async execute({ id }) {
    return getResource("albums", id);
  },
});
