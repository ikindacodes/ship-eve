Use when the user asks questions about orders data — totals, averages, rankings, filters, or trends that require querying the dataset.

# Query analysis workflow

Apply this procedure for every data question about the orders dataset.

## Step 1 — Preview before querying

Call `preview_dataset` before the first `run_query` on a new question. Use the returned columns, dtypes, row count, and sample rows to confirm field names and value shapes.

**Important:** `preview_dataset` is free — it does not consume query budget.

Known columns: `order_id`, `region`, `product`, `quantity`, `unit_price`, `order_date`, `revenue`.

`revenue` is `quantity * unit_price` (computed when the dataset loads).

## Step 2 — Query with budget awareness

Call `run_query` for computations. Each call consumes **one** query from the per-turn budget (default 3).

Filter operators: `eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `contains`.

Aggregate operations: `count`, `sum`, `avg`, `min`, `max`. Use `count` without a field; other aggregates require a numeric field such as `quantity`, `unit_price`, or `revenue`.

Examples:

- Orders per region: `groupBy: "region"`, `aggregate: { op: "count" }`
- Total revenue by region: `groupBy: "region"`, `aggregate: { op: "sum", field: "revenue" }`
- Average unit price in the West: `filters: [{ field: "region", op: "eq", value: "West" }]`, `aggregate: { op: "avg", field: "unit_price" }`

Plan queries to stay within budget. Prefer one grouped aggregate over many row scans.

If `run_query` throws a budget error, stop calling it. Tell the user the turn limit is reached and they can send a new message for a fresh budget.

## Step 3 — Answer format

Structure every response as:

### Answer
One or two sentences with the direct conclusion.

### Evidence
Bullets or a compact markdown table with numbers from tool output only.

### Budget
State queries used and remaining this turn (from the latest `run_query` result).

## Guardrails

- Never invent statistics not present in tool output.
- Never skip `preview_dataset` on the first analysis pass for a question.
- Do not call `run_query` after the budget is exhausted.
- Do not join external files or accept uploads.
