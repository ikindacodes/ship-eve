import { deleteResource } from "#lib/jsonplaceholder.js";
import { idSchema } from "#lib/schemas.js";
import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description: "Delete a photo via DELETE. JSONPlaceholder fakes persistence — the resource is not stored.",
  inputSchema: z.object({ id: idSchema }),
  async execute({ id }) {
    return deleteResource("photos", id);
  },
});
