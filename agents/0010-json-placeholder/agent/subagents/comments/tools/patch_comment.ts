import { patchResource } from "#lib/jsonplaceholder.js";
import { idSchema, commentFieldsSchema } from "#lib/schemas.js";
import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description: "Partially update a comment via PATCH. JSONPlaceholder fakes persistence — the resource is not stored.",
  inputSchema: z.object({ id: idSchema }).merge(commentFieldsSchema.partial()),
  async execute({ id, ...body }) {
    return patchResource("comments", id, body);
  },
});
