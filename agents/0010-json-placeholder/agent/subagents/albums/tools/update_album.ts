import { updateResource } from "#lib/jsonplaceholder.js";
import { idSchema, albumFieldsSchema } from "#lib/schemas.js";
import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description: "Replace a album via PUT. JSONPlaceholder fakes persistence — the resource is not stored.",
  inputSchema: z.object({ id: idSchema }).merge(albumFieldsSchema),
  async execute({ id, ...body }) {
    return updateResource("albums", id, { id, ...body });
  },
});
