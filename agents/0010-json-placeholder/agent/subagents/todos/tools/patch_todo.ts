import { patchResource } from "#lib/jsonplaceholder.js";
import { idSchema, todoFieldsSchema } from "#lib/schemas.js";
import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description: "Partially update a todo via PATCH. JSONPlaceholder fakes persistence — the resource is not stored.",
  inputSchema: z.object({ id: idSchema }).merge(todoFieldsSchema.partial()),
  async execute({ id, ...body }) {
    return patchResource("todos", id, body);
  },
});
