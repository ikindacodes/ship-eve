import { createResource } from "#lib/jsonplaceholder.js";
import { albumFieldsSchema } from "#lib/schemas.js";
import { defineTool } from "eve/tools";

export default defineTool({
  description: "Create a album via POST. JSONPlaceholder fakes persistence — the resource is not stored.",
  inputSchema: albumFieldsSchema,
  async execute(body) {
    return createResource("albums", body);
  },
});
