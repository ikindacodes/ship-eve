# 0009-brand-voice

An eve agent that answers TaskFlow product-support questions with a **white-label persona** assembled at build time via `instructions.ts`.

## What it does

Answers support questions like *"How do I invite a teammate?"* The agent loads the `brand-support-format` skill, searches bundled help articles via `search_docs`, and returns **Answer**, **Source**, and optional **Next steps** sections.

Unlike a static `instructions.md`, identity and tone come from env vars compiled into the system prompt:

- `BRAND_NAME` — product name spoken as support (default `TaskFlow`)
- `BRAND_TONE` — `formal` or `friendly`
- `DISCLOSURE_TEXT` — optional AI disclosure copy appended to instructions

Change `.env` and restart `pnpm dev` to see a different voice without editing markdown.

## How this agent is structured

| File | Eve surface | Read first? |
|------|-------------|-------------|
| `agent/instructions.ts` | instructions (`defineInstructions`) | **Start here** |
| `lib/prompts.ts` | (helper) brand config → prompt markdown | **Start here** |
| `agent/tools/search_docs.ts` | tools | After instructions |
| `agent/skills/brand-support-format.md` | skills | Instructions vs skills split |
| `agent/channels/eve.ts` | channels | HTTP entry |
| `agent/agent.ts` | agent config | Model choice |
| `lib/docs.ts` | (helper) doc search | Tool backing logic |
| `data/product-docs/` | data | Fictional TaskFlow corpus |

## Eve surfaces

- `agent/instructions.ts` — `defineInstructions` + env-driven persona (replaces `instructions.md`)
- `agent/agent.ts` — model config
- `agent/tools/search_docs.ts` — keyword search over bundled docs
- `agent/skills/brand-support-format.md` — workflow, output format, tone hints
- `agent/channels/eve.ts` — HTTP channel
- `lib/prompts.ts` — `loadBrandConfig`, `buildInstructionsPrompt`
- `lib/docs.ts` — doc loading and search helpers
- `data/product-docs/` — fictional TaskFlow help articles (same corpus as 0007)

## Environment

```bash
cp .env.example .env
```

| Variable | Required | Purpose |
|----------|----------|---------|
| `AI_GATEWAY_API_KEY` | Yes | [Vercel AI Gateway](https://vercel.com/docs/ai-gateway) — model inference |
| `BRAND_NAME` | No | Product name in instructions and tool copy (default `TaskFlow`) |
| `BRAND_TONE` | No | `formal` or `friendly` (default `friendly`) |
| `DISCLOSURE_TEXT` | No | AI disclosure paragraph injected into instructions |
| `DOCS_PATH` | No | Path to help docs (default `./data/product-docs`) |

Get a key from your Vercel dashboard → AI Gateway → API Keys.

## Run locally

### Copy this agent

```bash
mkdir my-brand-voice && cp -R agents/0009-brand-voice/. my-brand-voice/
cd my-brand-voice
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
cd agents/0009-brand-voice
cp .env.example .env
# Add your AI_GATEWAY_API_KEY to .env
pnpm dev
```

Or from the repo root:

```bash
pnpm dev --filter 0009-brand-voice
```

## Try it

**Default friendly TaskFlow voice** — in the dev TUI:

> How do I invite a teammate to TaskFlow?

**Formal white-label** — set in `.env` and restart dev:

```bash
BRAND_NAME=Acme Projects
BRAND_TONE=formal
DISCLOSURE_TEXT=You are chatting with an automated assistant, not a human agent.
```

Then ask the same question and compare tone.

**Out-of-scope refusal:**

> What's the weather in Austin?

Or over HTTP:

```bash
curl -X POST http://127.0.0.1:3000/eve/v1/session \
  -H 'content-type: application/json' \
  -d '{"message":"How much does TaskFlow Pro cost per user?"}'
```

## How `instructions.ts` works

1. `lib/prompts.ts` reads `BRAND_NAME`, `BRAND_TONE`, and `DISCLOSURE_TEXT` from env.
2. `buildInstructionsPrompt()` returns the full system prompt markdown.
3. `agent/instructions.ts` passes that string to `defineInstructions({ markdown })`.
4. eve captures the result at build time — the runtime serves the same prompt every session.

Procedures that should not bloat every turn (search workflow, output sections) live in `brand-support-format` skill instead.

## Bundled docs

Fictional TaskFlow articles in `data/product-docs/`:

| File | Topics |
|------|--------|
| `getting-started.md` | Invites, plans overview, projects, workspace deletion |
| `billing.md` | Pro pricing, Free limits, refunds, invoices |
| `integrations.md` | Slack, GitHub, webhooks |
| `sso.md` | Enterprise SAML SSO |
| `exports.md` | Project/workspace export, API rate limits |

## Troubleshooting

**Persona did not change after editing `.env`**

Restart `pnpm dev`. Instructions are resolved at build/compile time, not per request.

**Empty search results**

Confirm `DOCS_PATH` points at a directory of `.md` files. Default is `./data/product-docs`.

**Model errors**

Provide `AI_GATEWAY_API_KEY` in `.env`.
