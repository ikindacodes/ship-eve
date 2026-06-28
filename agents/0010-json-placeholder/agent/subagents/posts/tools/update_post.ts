import { updateResource } from "#lib/jsonplaceholder.js";
import { idSchema, postFieldsSchema } from "#lib/schemas.js";
import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description: "Replace a post via PUT. JSONPlaceholder fakes persistence — the resource is not stored.",
  inputSchema: z.object({ id: idSchema }).merge(postFieldsSchema),
  async execute({ id, ...body }) {
    return updateResource("posts", id, { id, ...body });
  },
});
