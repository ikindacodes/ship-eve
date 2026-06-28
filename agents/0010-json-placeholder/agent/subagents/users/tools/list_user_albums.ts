import { listNestedResource } from "#lib/jsonplaceholder.js";
import { idSchema } from "#lib/schemas.js";
import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description: "List albums nested under a user (equivalent to /albums?userId=<id>).",
  inputSchema: z.object({ userId: idSchema }),
  async execute({ userId }) {
    return listNestedResource("users", userId, "albums");
  },
});
