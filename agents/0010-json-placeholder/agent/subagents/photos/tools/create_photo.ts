import { createResource } from "#lib/jsonplaceholder.js";
import { photoFieldsSchema } from "#lib/schemas.js";
import { defineTool } from "eve/tools";

export default defineTool({
  description: "Create a photo via POST. JSONPlaceholder fakes persistence — the resource is not stored.",
  inputSchema: photoFieldsSchema,
  async execute(body) {
    return createResource("photos", body);
  },
});
