# EVE-BRIEF

## Summary

Answers questions about a bundled orders dataset with a per-turn query budget enforced via `defineState` and reset by a `turn.started` hook.

## Users & channels

- **Who:** Developer on localhost (TUI or HTTP client)
- **Channel(s):** HTTP via `agent/channels/eve.ts`

## Core loop

1. User: *"What's total revenue by region?"*
2. Agent: Loads `query-analysis` skill → calls `preview_dataset` (free) → calls `run_query` one or more times (each counts against the turn budget) → formats **Answer**, **Evidence**, **Budget**.
3. User sees: A data answer with remaining query budget; a fourth `run_query` in the same turn is refused with a clear limit message.

## Eve surfaces

| Surface | Used | Notes |
|---------|------|-------|
| tools | yes | `preview_dataset`, `run_query` |
| skills | yes | `query-analysis` — workflow, output shape, budget rules |
| channels | yes | HTTP eve channel |
| connections | no | — |
| subagents | no | — |
| schedules | no | — |
| hooks | yes | `reset-budget` — resets counter on `turn.started` |
| sandbox | no | — |
| evals | no | — |

## Eve capabilities demonstrated

- durable state (`defineState`)
- hooks
- session context (`ctx.session` in tool responses)

## Tools & connections

| File | Purpose | Inputs | Returns | Data source | Fallback reason (if mock) |
|------|---------|--------|---------|-------------|---------------------------|
| `preview_dataset.ts` | Schema peek: fields, types, row count, samples | none | columns, dtypes, rowCount, sampleRows | bundled `data/orders.json` | Fictional commerce dataset keeps agent clone-and-run with zero extra secrets |
| `run_query.ts` | Filter / group / aggregate orders (budget-gated) | filter, groupBy, aggregate | rows or grouped metrics + budget status | same bundled JSON | — |

## Instructions highlights

- Identity: Orders data analyst with a strict per-turn query budget
- Must do: Load `query-analysis` skill for data questions; call `preview_dataset` before first query on a new question; call `run_query` for computations; report budget remaining after queries; refuse gracefully when budget is exhausted
- Must not: Invent statistics; bypass budget by repeating failed queries endlessly; use tools for greetings

## Model & secrets

- **Model:** `openai/gpt-4.1-mini`
- **Secrets:** `AI_GATEWAY_API_KEY`; optional `QUERY_BUDGET_CAP` (default 3), `DATA_PATH` (default `./data/orders.json`)

## Scope

### In v1

- Bundled `data/orders.json` (135 fictional e-commerce orders)
- In-process `run_query` with filter, groupBy, aggregate
- `defineState` budget counter + `turn.started` hook reset
- `preview_dataset` free of budget cost
- HTTP on-demand only

### Out of v1

- Sandbox or SQL engine
- Eval suite
- HITL / `needsApproval`
- `defineDynamic` per-tenant tools
- External warehouse or live API

## Project location

- **Path:** `agents/0008-budget-guard/`
- **Package name:** `0008-budget-guard` (unscoped — matches `0007-support-bot` until [vercel/eve#168](https://github.com/vercel/eve/pull/168) ships)

## Open questions

- none
