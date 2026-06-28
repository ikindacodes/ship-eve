import { updateResource } from "#lib/jsonplaceholder.js";
import { idSchema, userFieldsSchema } from "#lib/schemas.js";
import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description: "Replace a user via PUT. JSONPlaceholder fakes persistence — the resource is not stored.",
  inputSchema: z.object({ id: idSchema }).merge(userFieldsSchema),
  async execute({ id, ...body }) {
    return updateResource("users", id, { id, ...body });
  },
});
