import { budgetSnapshot, consumeBudgetUnit } from "#lib/budget.js";
import { orderFields, runOrdersQuery } from "#lib/orders.js";
import { defineTool } from "eve/tools";
import { z } from "zod";

const fieldSchema = z.enum(orderFields);
const filterOpSchema = z.enum(["eq", "neq", "gt", "gte", "lt", "lte", "contains"]);
const aggregateOpSchema = z.enum(["count", "sum", "avg", "min", "max"]);

export default defineTool({
  description:
    "Run a read-only query against the orders dataset. Each call consumes one query from the per-turn budget.",
  inputSchema: z.object({
    filters: z
      .array(
        z.object({
          field: fieldSchema,
          op: filterOpSchema,
          value: z.union([z.string(), z.number()]),
        }),
      )
      .optional()
      .describe("Optional row filters applied before grouping or limiting"),
    groupBy: fieldSchema.optional().describe("Group results by this column when aggregating"),
    aggregate: z
      .object({
        op: aggregateOpSchema,
        field: fieldSchema.optional(),
      })
      .optional()
      .describe("Aggregate operation; use count without a field, sum/avg/min/max require a numeric field"),
    limit: z
      .number()
      .int()
      .min(1)
      .max(100)
      .optional()
      .describe("Maximum rows to return (default: all matching rows, capped at 100)"),
  }),
  async execute(input, ctx) {
    const budget = consumeBudgetUnit();
    const result = runOrdersQuery({
      filters: input.filters,
      groupBy: input.groupBy,
      aggregate: input.aggregate,
      limit: input.limit ?? 100,
    });

    return {
      sessionId: ctx.session.id,
      turnSequence: ctx.session.turn.sequence,
      ...result,
      budget,
    };
  },
});
