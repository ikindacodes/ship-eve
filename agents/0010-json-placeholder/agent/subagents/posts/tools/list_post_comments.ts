import { listNestedResource } from "#lib/jsonplaceholder.js";
import { idSchema } from "#lib/schemas.js";
import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description: "List comments nested under a post (equivalent to /comments?postId=<id>).",
  inputSchema: z.object({ postId: idSchema }),
  async execute({ postId }) {
    return listNestedResource("posts", postId, "comments");
  },
});
