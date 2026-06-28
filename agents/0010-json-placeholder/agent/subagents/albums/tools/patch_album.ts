import { patchResource } from "#lib/jsonplaceholder.js";
import { idSchema, albumFieldsSchema } from "#lib/schemas.js";
import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description: "Partially update a album via PATCH. JSONPlaceholder fakes persistence — the resource is not stored.",
  inputSchema: z.object({ id: idSchema }).merge(albumFieldsSchema.partial()),
  async execute({ id, ...body }) {
    return patchResource("albums", id, body);
  },
});
