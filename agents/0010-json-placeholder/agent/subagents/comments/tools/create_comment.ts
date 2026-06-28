import { createResource } from "#lib/jsonplaceholder.js";
import { commentFieldsSchema } from "#lib/schemas.js";
import { defineTool } from "eve/tools";

export default defineTool({
  description: "Create a comment via POST. JSONPlaceholder fakes persistence — the resource is not stored.",
  inputSchema: commentFieldsSchema,
  async execute(body) {
    return createResource("comments", body);
  },
});
