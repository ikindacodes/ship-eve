# EVE-BRIEF

## Summary

White-label TaskFlow support agent whose always-on persona is assembled at build time via `instructions.ts` from env-driven brand config.

## Users & channels

- **Who:** Developer on localhost (TUI or HTTP client)
- **Channel(s):** HTTP via `agent/channels/eve.ts`

## Core loop

1. User: *"How do I invite a teammate to my workspace?"*
2. Agent: Loads `brand-support-format` skill → calls `search_docs` → answers from doc excerpts in the configured brand tone.
3. User sees: **Answer**, **Source**, and optional **Next steps** citing `data/product-docs/…`, with identity shaped by `BRAND_NAME` / `BRAND_TONE`.

## Eve surfaces

| Surface | Used | Notes |
|---------|------|-------|
| tools | yes | `search_docs` — keyword search over bundled TaskFlow docs |
| skills | yes | `brand-support-format` — workflow, output shape, tone hints |
| channels | yes | HTTP eve channel |
| instructions | yes | `instructions.ts` — `defineInstructions` + `lib/prompts.ts` |
| connections | no | — |
| subagents | no | — |
| schedules | no | — |
| hooks | no | — |
| sandbox | no | — |
| evals | no | — |

## Tools & connections

| File | Purpose | Inputs | Returns | Data source | Fallback reason (if mock) |
|------|---------|--------|---------|-------------|---------------------------|
| `search_docs.ts` | Search help documentation by keywords | `query` (string), `limit` (optional) | Matching articles with id, title, source path, excerpt | bundled `data/product-docs/` | Fictional TaskFlow corpus keeps agent clone-and-run with zero extra secrets |

## Instructions highlights

- Identity: `{BRAND_NAME}` product support assistant (default TaskFlow), tone from `BRAND_TONE`
- Must do: Load `brand-support-format` before product answers; call `search_docs` before factual answers; cite doc paths; refuse out-of-scope topics in brand voice
- Must not: Invent policies or features; answer non-product topics as if authoritative; skip search for product how-to questions

## Model & secrets

- **Model:** `openai/gpt-4.1-mini`
- **Secrets:** `AI_GATEWAY_API_KEY`; optional `BRAND_NAME`, `BRAND_TONE` (`formal` | `friendly`), `DISCLOSURE_TEXT`, `DOCS_PATH`

## Scope

### In v1

- `instructions.ts` with `defineInstructions` and `lib/prompts.ts` brand assembly
- Bundled TaskFlow docs (same corpus as 0007)
- `search_docs` keyword search
- `brand-support-format` skill with refusal guidance and tone hints
- HTTP on-demand only

### Out of v1

- `defineDynamic` runtime persona switching
- Eval suite
- Live help-center API or CMS
- Connections (Zendesk, Intercom, etc.)
- Escalation email env var

## Project location

- **Path:** `agents/0009-brand-voice/`
- **Package name:** `0009-brand-voice` (unscoped — matches sibling agents until [vercel/eve#168](https://github.com/vercel/eve/pull/168) ships)

## Teaching comments

- **Mode:** verbose — scaffolded code includes educational comments
- **Surfaces to annotate:** `agent/instructions.ts` (primary), `lib/prompts.ts`, `agent/tools/search_docs.ts`, `agent/skills/brand-support-format.md`, `agent/channels/eve.ts`, `agent/agent.ts`

## Open questions

- none
