# 0006-research-router

An eve agent that answers questions about **eve documentation** by delegating to researcher and writer subagents, returning a structured brief with Summary, Findings, and Sources.

## What it does

Answers eve doc questions like *"What is eve?"* or *"When should I add a subagent?"* The root agent loads the `eve-docs-orchestration` skill, delegates to the `researcher` subagent (live introduction URL + bundled doc summaries), then to the `writer` subagent, and renders **Summary / Findings / Sources**.

## Eve surfaces

- `agent/agent.ts` — root model config (orchestrator, no root tools)
- `agent/instructions.md` — delegation workflow
- `agent/skills/eve-docs-orchestration.md` — eve doc research procedure and example questions
- `agent/channels/eve.ts` — HTTP channel
- `agent/subagents/researcher/` — doc reading specialist with `read_bundled_source` and `fetch_url`
- `agent/subagents/writer/` — brief formatter with `brief-format` skill
- `lib/sources.ts` — bundled source I/O and live URL fetch (HTML → plain text)
- `data/sources/` — bundled eve doc summaries

## Environment

```bash
cp .env.example .env
```

| Variable | Required | Purpose |
|----------|----------|---------|
| `AI_GATEWAY_API_KEY` | Yes | [Vercel AI Gateway](https://vercel.com/docs/ai-gateway) — model inference |
| `SOURCE_URL` | No | Live doc URL for `fetch_url` (default: `https://eve.dev/docs/introduction`) |

Set `SOURCE_URL=none` to skip live fetch and use bundled summaries only.

Get a key from your Vercel dashboard → AI Gateway → API Keys.

## Run locally

### Copy this agent

```bash
mkdir my-research-router && cp -R agents/0006-research-router/. my-research-router/
cd my-research-router
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
cd agents/0006-research-router
cp .env.example .env
# Add your AI_GATEWAY_API_KEY to .env
pnpm dev
```

Or from the repo root:

```bash
pnpm dev --filter @ship-eve/0006-research-router
```

## Try it

In the dev TUI, ask any of these:

- *What is eve?*
- *How does eve discover tool names?*
- *What's the difference between tools and skills in eve?*
- *When should I add subagents/ to my project?*
- *What makes eve sessions durable?*

Or over HTTP:

```bash
curl -X POST http://127.0.0.1:3000/eve/v1/session \
  -H 'content-type: application/json' \
  -d '{"message":"What is eve?"}'
```

Swap the live doc page:

```bash
SOURCE_URL=https://eve.dev/docs/tools pnpm dev
```

## Example Q&A

| Question | Expected focus |
|----------|----------------|
| What is eve? | Filesystem-first agent framework, durable sessions, beta status |
| How are tools named? | Path-derived from `agent/tools/<name>.ts` |
| Tools vs skills? | Tools = typed runtime actions; skills = load-on-demand procedures |
| When add subagents/? | Specialist roles, narrower tool surface, different prompt |
| What is durable? | Multi-turn sessions, tool/subagent calls, pause/resume, Workflow SDK |

## Subagent architecture

| Subagent | Role | Tools / skills |
|----------|------|----------------|
| `researcher` | Read eve doc sources, extract findings | `read_bundled_source`, `fetch_url` |
| `writer` | Format user-facing brief | `brief-format` skill |

The root agent calls each subagent in task mode with `outputSchema` for structured handoff.

## Bundled sources

| File | Content |
|------|---------|
| `introduction.md` | What eve is, filesystem-first design, durability |
| `tools-and-skills.md` | Tools vs skills, path-derived names |
| `project-layout.md` | Agent folders, subagents, when to add each slot |

Live fetch defaults to [eve introduction](https://eve.dev/docs/introduction).

## Troubleshooting

**Researcher returns empty findings**

Confirm `data/sources/` exists relative to the agent working directory. Run from the agent package root (`agents/0006-research-router`).

**Live fetch fails**

Check network access and the URL. Bundled summaries still answer most eve questions. Restart `pnpm dev` after changing `.env`.

**Answer drifts off-topic**

Ask explicitly about eve — e.g. *"According to eve docs, what are skills?"* The agent declines unrelated topics.

**Subagent errors in dev**

Watch the dev terminal for child session logs. The parent stream shows `subagent.called` / `subagent.completed` events only.
