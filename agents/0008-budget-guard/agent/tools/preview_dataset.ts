import { previewDataset } from "#lib/orders.js";
import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description:
    "Preview the orders dataset: column names, inferred types, row count, and sample rows. Does not consume query budget.",
  inputSchema: z.object({}),
  async execute() {
    return previewDataset();
  },
});
