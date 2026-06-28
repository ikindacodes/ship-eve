import { createResource } from "#lib/jsonplaceholder.js";
import { userFieldsSchema } from "#lib/schemas.js";
import { defineTool } from "eve/tools";

export default defineTool({
  description: "Create a user via POST. JSONPlaceholder fakes persistence — the resource is not stored.",
  inputSchema: userFieldsSchema,
  async execute(body) {
    return createResource("users", body);
  },
});
