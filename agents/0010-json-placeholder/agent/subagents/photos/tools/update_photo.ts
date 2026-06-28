import { updateResource } from "#lib/jsonplaceholder.js";
import { idSchema, photoFieldsSchema } from "#lib/schemas.js";
import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description: "Replace a photo via PUT. JSONPlaceholder fakes persistence — the resource is not stored.",
  inputSchema: z.object({ id: idSchema }).merge(photoFieldsSchema),
  async execute({ id, ...body }) {
    return updateResource("photos", id, { id, ...body });
  },
});
