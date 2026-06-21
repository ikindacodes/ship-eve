# EVE-BRIEF

## Summary

Orchestrates eve documentation research by delegating to two declared subagents, then returns a structured brief with Summary, Findings, and Sources.

## Users & channels

- **Who:** Developer on localhost (TUI or HTTP client)
- **Channel(s):** HTTP via `agent/channels/eve.ts` (same auth pattern as sibling agents)

## Core loop

1. User: *"What is eve?"*
2. Root agent: Loads `eve-docs-orchestration` skill → calls `researcher` subagent (live introduction URL + bundled summaries) → calls `writer` subagent → renders **Summary / Findings / Sources**.
3. User sees: Markdown brief grounded in eve documentation.

## Eve surfaces

| Surface | Used | Notes |
|---------|------|-------|
| tools | yes | Authored under `researcher` subagent only — root has no tools |
| skills | yes | Root: `eve-docs-orchestration`; writer subagent: `brief-format` |
| channels | yes | HTTP eve channel |
| connections | no | — |
| subagents | yes | `researcher` (read sources), `writer` (format brief) |
| schedules | no | — |
| hooks | no | — |
| sandbox | no | — |
| evals | no | — |

## Tools & connections

| File | Purpose | Inputs | Returns | Data source | Fallback reason (if mock) |
|------|---------|--------|---------|-------------|---------------------------|
| `subagents/researcher/tools/read_bundled_source.ts` | Read a bundled eve doc summary by filename | `filename` (string) | `{ filename, title, content }` | bundled `data/sources/*.md` | — |
| `subagents/researcher/tools/fetch_url.ts` | Fetch live doc URL | none (reads `SOURCE_URL` env) | `{ url, title, contentPreview, … }` | live HTTP (default introduction URL) | — |

### Subagent contracts

**`researcher`** (`agent/subagents/researcher/`)

- **Description:** Reads bundled and live sources about the eve framework; extracts factual findings with citations.
- **Tools:** `read_bundled_source`, `fetch_url`
- **Task output (`outputSchema`):** `{ findings: string[], sources: { name: string, url?: string }[] }`

**`writer`** (`agent/subagents/writer/`)

- **Description:** Formats eve documentation research into a user-facing brief.
- **Tools:** none
- **Skill:** `brief-format.md` — section layout, tone, citation rules
- **Task output (`outputSchema`):** `{ summary: string, findings: string[], sources: { name: string, url?: string }[] }`

### Bundled sources (`data/sources/`)

| File | Role |
|------|------|
| `introduction.md` | What eve is, filesystem-first, durability |
| `tools-and-skills.md` | Tools vs skills, naming |
| `project-layout.md` | Agent folders, subagents, growth path |

Default live URL: `https://eve.dev/docs/introduction`

## Instructions highlights

- **Root identity:** Eve documentation research orchestrator — delegate, do not read sources directly
- **Root must do:** Load `eve-docs-orchestration` skill; call `researcher` then `writer`; render **Summary / Findings / Sources**
- **Root must not:** Invent findings; answer off-topic questions; use built-in `agent` tool
- **Researcher must do:** Call `fetch_url` first; read relevant bundled eve summaries; cite sources
- **Researcher must not:** Answer about non-eve topics; fabricate doc URLs or API names
- **Writer must do:** Load `brief-format` skill; synthesize eve doc findings only
- **Writer must not:** Add claims not present in researcher output

## Model & secrets

- **Model:** `openai/gpt-4.1-mini`
- **Secrets:** `AI_GATEWAY_API_KEY` (required); `SOURCE_URL` (optional — default introduction URL; set `none` to skip live fetch)

## Scope

### In v1

- Two declared subagents with distinct prompts and tool surfaces
- Structured subagent returns via `outputSchema` (task mode)
- Bundled eve doc summary trio + live introduction fetch (HTML stripped to text)
- Sequential flow: one researcher pass, one writer pass
- HTTP on-demand only

### Out of v1

- Web search or multi-page crawling
- Nested subagents or parallel fan-out
- Root-level tools
- Schedules, hooks, sandbox, evals
- Brief persistence or export

## Project location

- **Path:** `agents/0006-research-router/`
- **Package name:** `@ship-eve/0006-research-router`

## Open questions

- none
