# 0008-budget-guard

An eve agent that answers orders data questions with a per-turn query budget enforced via `defineState` and a `turn.started` hook.

## What it does

Answers data questions like *"What's total revenue by region?"* The agent loads the `query-analysis` skill, previews the bundled dataset via `preview_dataset` (free), runs in-process queries via `run_query` (budget-gated), and returns **Answer**, **Evidence**, and **Budget** sections. Each turn allows a limited number of `run_query` calls (default 3); further calls in the same turn are refused.

## Eve surfaces

- `agent/agent.ts` — model config
- `agent/instructions.md` — system prompt
- `agent/tools/preview_dataset.ts` — schema and sample rows (no budget cost)
- `agent/tools/run_query.ts` — filter / group / aggregate (budget-gated)
- `agent/hooks/reset-budget.ts` — resets counter on `turn.started`
- `agent/skills/query-analysis.md` — workflow, budget rules, output format
- `agent/channels/eve.ts` — HTTP channel
- `lib/budget.ts` — `defineState` budget handle
- `lib/orders.ts` — dataset loading and query engine
- `data/orders.json` — bundled e-commerce orders (135 rows)

## Environment

```bash
cp .env.example .env
```

| Variable | Required | Purpose |
|----------|----------|---------|
| `AI_GATEWAY_API_KEY` | Yes | [Vercel AI Gateway](https://vercel.com/docs/ai-gateway) — model inference |
| `QUERY_BUDGET_CAP` | No | Max `run_query` calls per turn (default `3`) |
| `DATA_PATH` | No | Path to orders JSON (default `./data/orders.json`) |

Get a key from your Vercel dashboard → AI Gateway → API Keys.

## Run locally

### Copy this agent

```bash
mkdir my-budget-guard && cp -R agents/0008-budget-guard/. my-budget-guard/
cd my-budget-guard
pnpm install
cp .env.example .env
# Add your AI_GATEWAY_API_KEY to .env
pnpm dev
```

### From the monorepo

```bash
git clone https://github.com/ikindacodes/ship-eve.git
cd ship-eve
pnpm install
cd agents/0008-budget-guard
cp .env.example .env
# Add your AI_GATEWAY_API_KEY to .env
pnpm dev
```

Or from the repo root:

```bash
pnpm dev --filter 0008-budget-guard
```

## Try it

In the dev TUI, ask: *What's total revenue by region?*

Then ask a question that needs several queries in one turn to hit the budget, e.g. *"For each region, show order count, total revenue, and average unit price."*

Or over HTTP:

```bash
curl -X POST http://127.0.0.1:3000/eve/v1/session \
  -H 'content-type: application/json' \
  -d '{"message":"What is total revenue by region?"}'
```

## How budget works

1. `defineState` tracks `{ count, cap }` per session in `lib/budget.ts`.
2. Each `run_query` call increments `count` before executing.
3. When `count >= cap`, `run_query` throws — the agent should stop querying and explain the limit.
4. The `reset-budget` hook listens for `turn.started` and resets `count` to 0, giving each new user message a fresh budget.

Set a lower cap to demo refusal quickly:

```bash
QUERY_BUDGET_CAP=1 pnpm dev
```

## Troubleshooting

**Budget exhausted mid-turn**

Expected behavior. Send a new message to reset the counter via the `turn.started` hook.

**Empty or invalid dataset**

Confirm `DATA_PATH` points at a JSON array of order objects with `order_id`, `region`, `product`, `quantity`, `unit_price`, and `order_date`.

**Model errors**

Provide `AI_GATEWAY_API_KEY` in `.env`.
