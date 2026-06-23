import { readFileSync } from "node:fs";
import { isAbsolute, resolve } from "node:path";

export type OrderRecord = {
  order_id: number;
  region: string;
  product: string;
  quantity: number;
  unit_price: number;
  order_date: string;
  revenue: number;
};

type FilterOp = "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "contains";

type QueryFilter = {
  field: keyof OrderRecord;
  op: FilterOp;
  value: string | number;
};

type AggregateOp = "count" | "sum" | "avg" | "min" | "max";

export function resolveDataPath(envPath = process.env.DATA_PATH): string {
  const relative = envPath?.trim() || "./data/orders.json";
  return isAbsolute(relative) ? relative : resolve(process.cwd(), relative);
}

export function loadOrders(): OrderRecord[] {
  const path = resolveDataPath();
  const raw = readFileSync(path, "utf8");
  const parsed = JSON.parse(raw) as Omit<OrderRecord, "revenue">[];

  if (!Array.isArray(parsed)) {
    throw new Error(`Expected JSON array in ${path}`);
  }

  return parsed.map((row) => ({
    ...row,
    revenue: row.quantity * row.unit_price,
  }));
}

function inferColumnTypes(orders: OrderRecord[]): Record<string, string> {
  if (orders.length === 0) return {};

  const sample = orders[0]!;
  const dtypes: Record<string, string> = {};

  for (const key of Object.keys(sample) as (keyof OrderRecord)[]) {
    const values = orders.map((row) => row[key]).slice(0, 20);
    if (values.every((value) => typeof value === "number")) {
      dtypes[key] = Number.isInteger(values[0] as number) ? "integer" : "float";
    } else {
      dtypes[key] = "string";
    }
  }

  return dtypes;
}

export function previewDataset(sampleSize = 5) {
  const path = resolveDataPath();
  const orders = loadOrders();
  const columns = orders[0] ? (Object.keys(orders[0]) as (keyof OrderRecord)[]) : [];

  return {
    path,
    columns,
    dtypes: inferColumnTypes(orders),
    rowCount: orders.length,
    sampleRows: orders.slice(0, sampleSize),
  };
}

function compareValues(left: string | number, op: FilterOp, right: string | number): boolean {
  if (op === "contains") {
    return String(left).toLowerCase().includes(String(right).toLowerCase());
  }

  const a = typeof left === "number" ? left : Number(left);
  const b = typeof right === "number" ? right : Number(right);

  if (op === "eq") return left === right || (!Number.isNaN(a) && !Number.isNaN(b) && a === b);
  if (op === "neq") return left !== right && (Number.isNaN(a) || Number.isNaN(b) || a !== b);
  if (op === "gt") return a > b;
  if (op === "gte") return a >= b;
  if (op === "lt") return a < b;
  if (op === "lte") return a <= b;

  return false;
}

function applyFilters(orders: OrderRecord[], filters: QueryFilter[] | undefined) {
  if (!filters?.length) return orders;

  return orders.filter((row) =>
    filters.every((filter) => compareValues(row[filter.field], filter.op, filter.value)),
  );
}

function aggregateRows(
  rows: OrderRecord[],
  groupBy: keyof OrderRecord | undefined,
  aggregate: { op: AggregateOp; field?: keyof OrderRecord },
) {
  if (!groupBy) {
    const value = computeAggregate(rows, aggregate.op, aggregate.field);
    return [{ aggregate: aggregate.op, field: aggregate.field ?? null, value }];
  }

  const groups = new Map<string, OrderRecord[]>();

  for (const row of rows) {
    const key = String(row[groupBy]);
    const bucket = groups.get(key) ?? [];
    bucket.push(row);
    groups.set(key, bucket);
  }

  return [...groups.entries()]
    .map(([group, groupRows]) => ({
      [groupBy]: group,
      aggregate: aggregate.op,
      field: aggregate.field ?? null,
      value: computeAggregate(groupRows, aggregate.op, aggregate.field),
    }))
    .sort((a, b) => String(a[groupBy]).localeCompare(String(b[groupBy])));
}

function computeAggregate(
  rows: OrderRecord[],
  op: AggregateOp,
  field: keyof OrderRecord | undefined,
): number {
  if (op === "count") return rows.length;

  if (!field) {
    throw new Error(`Aggregate "${op}" requires a field.`);
  }

  const numbers = rows
    .map((row) => row[field])
    .filter((value): value is number => typeof value === "number");

  if (numbers.length === 0) return 0;

  if (op === "sum") return numbers.reduce((sum, n) => sum + n, 0);
  if (op === "min") return Math.min(...numbers);
  if (op === "max") return Math.max(...numbers);
  if (op === "avg") return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;

  return 0;
}

export function runOrdersQuery(input: {
  filters?: QueryFilter[];
  groupBy?: keyof OrderRecord;
  aggregate?: { op: AggregateOp; field?: keyof OrderRecord };
  limit?: number;
}) {
  const orders = loadOrders();
  const filtered = applyFilters(orders, input.filters);

  if (input.aggregate) {
    const rows = aggregateRows(filtered, input.groupBy, input.aggregate);
    return {
      mode: "aggregate" as const,
      matchedRows: filtered.length,
      rows: input.limit ? rows.slice(0, input.limit) : rows,
    };
  }

  const rows = input.limit ? filtered.slice(0, input.limit) : filtered;
  return {
    mode: "rows" as const,
    matchedRows: filtered.length,
    rows,
  };
}

export const orderFields = [
  "order_id",
  "region",
  "product",
  "quantity",
  "unit_price",
  "order_date",
  "revenue",
] as const satisfies readonly (keyof OrderRecord)[];
