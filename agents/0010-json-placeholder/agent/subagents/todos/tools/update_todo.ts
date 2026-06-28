import { updateResource } from "#lib/jsonplaceholder.js";
import { idSchema, todoFieldsSchema } from "#lib/schemas.js";
import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description: "Replace a todo via PUT. JSONPlaceholder fakes persistence — the resource is not stored.",
  inputSchema: z.object({ id: idSchema }).merge(todoFieldsSchema),
  async execute({ id, ...body }) {
    return updateResource("todos", id, { id, ...body });
  },
});
