import { createResource } from "#lib/jsonplaceholder.js";
import { todoFieldsSchema } from "#lib/schemas.js";
import { defineTool } from "eve/tools";

export default defineTool({
  description: "Create a todo via POST. JSONPlaceholder fakes persistence — the resource is not stored.",
  inputSchema: todoFieldsSchema,
  async execute(body) {
    return createResource("todos", body);
  },
});
