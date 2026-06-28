import { listNestedResource } from "#lib/jsonplaceholder.js";
import { idSchema } from "#lib/schemas.js";
import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description: "List photos nested under a album (equivalent to /photos?albumId=<id>).",
  inputSchema: z.object({ albumId: idSchema }),
  async execute({ albumId }) {
    return listNestedResource("albums", albumId, "photos");
  },
});
