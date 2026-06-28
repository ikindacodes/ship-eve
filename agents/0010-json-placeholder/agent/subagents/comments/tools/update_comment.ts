import { updateResource } from "#lib/jsonplaceholder.js";
import { idSchema, commentFieldsSchema } from "#lib/schemas.js";
import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description: "Replace a comment via PUT. JSONPlaceholder fakes persistence — the resource is not stored.",
  inputSchema: z.object({ id: idSchema }).merge(commentFieldsSchema),
  async execute({ id, ...body }) {
    return updateResource("comments", id, { id, ...body });
  },
});
