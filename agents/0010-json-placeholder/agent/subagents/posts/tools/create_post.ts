import { createResource } from "#lib/jsonplaceholder.js";
import { postFieldsSchema } from "#lib/schemas.js";
import { defineTool } from "eve/tools";

export default defineTool({
  description: "Create a post via POST. JSONPlaceholder fakes persistence — the resource is not stored.",
  inputSchema: postFieldsSchema,
  async execute(body) {
    return createResource("posts", body);
  },
});
