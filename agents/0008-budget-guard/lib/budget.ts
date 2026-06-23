import { defineState } from "eve/context";

export function resolveBudgetCap(): number {
  const raw = process.env.QUERY_BUDGET_CAP?.trim();
  if (!raw) return 3;

  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 3;
}

export const queryBudget = defineState("budget-guard.query-budget", () => ({
  count: 0,
  cap: resolveBudgetCap(),
}));

export function budgetSnapshot() {
  const { count, cap } = queryBudget.get();
  return {
    used: count,
    cap,
    remaining: Math.max(0, cap - count),
    exhausted: count >= cap,
  };
}

export function assertBudgetAvailable() {
  const snapshot = budgetSnapshot();
  if (snapshot.exhausted) {
    throw new Error(
      `Query budget exhausted for this turn (${snapshot.cap} queries max). Ask a follow-up message to get a fresh budget, or answer from prior query results.`,
    );
  }
}

export function consumeBudgetUnit() {
  assertBudgetAvailable();
  queryBudget.update((state) => ({ ...state, count: state.count + 1 }));
  return budgetSnapshot();
}

export function resetBudgetForTurn() {
  queryBudget.update(() => ({ count: 0, cap: resolveBudgetCap() }));
}
