import { patchResource } from "#lib/jsonplaceholder.js";
import { idSchema, postFieldsSchema } from "#lib/schemas.js";
import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description: "Partially update a post via PATCH. JSONPlaceholder fakes persistence — the resource is not stored.",
  inputSchema: z.object({ id: idSchema }).merge(postFieldsSchema.partial()),
  async execute({ id, ...body }) {
    return patchResource("posts", id, body);
  },
});
