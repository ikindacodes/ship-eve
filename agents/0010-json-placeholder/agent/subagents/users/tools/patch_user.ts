import { patchResource } from "#lib/jsonplaceholder.js";
import { idSchema, userFieldsSchema } from "#lib/schemas.js";
import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description: "Partially update a user via PATCH. JSONPlaceholder fakes persistence — the resource is not stored.",
  inputSchema: z.object({ id: idSchema }).merge(userFieldsSchema.partial()),
  async execute({ id, ...body }) {
    return patchResource("users", id, body);
  },
});
