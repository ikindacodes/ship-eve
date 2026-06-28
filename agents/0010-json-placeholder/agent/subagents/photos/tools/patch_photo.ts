import { patchResource } from "#lib/jsonplaceholder.js";
import { idSchema, photoFieldsSchema } from "#lib/schemas.js";
import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description: "Partially update a photo via PATCH. JSONPlaceholder fakes persistence — the resource is not stored.",
  inputSchema: z.object({ id: idSchema }).merge(photoFieldsSchema.partial()),
  async execute({ id, ...body }) {
    return patchResource("photos", id, body);
  },
});
