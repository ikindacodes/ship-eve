# Eve project layout

As an agent grows, each concern has a predictable home under `agent/`:

| Path | Add when you need… |
|------|---------------------|
| `tools/` | Typed actions the model calls |
| `skills/` | Load-on-demand procedures |
| `channels/` | HTTP, Slack, Discord, and other entry points |
| `connections/` | Tools from external MCP servers |
| `hooks/` | Code reacting to lifecycle and stream events |
| `sandbox/` | A controlled workspace for files and commands |
| `subagents/` | Specialist agents the root can delegate to |
| `schedules/` | Recurring or scheduled work (root-only) |
| `lib/` | Shared code imported by agent files |

The directory tells you what the agent can do before you run it.

## Subagents

Declared subagents live under `agent/subagents/<id>/` with their own `agent.ts`, instructions, tools, skills, and optional sandbox. They inherit nothing from the root's authored slots — duplicate what each child needs or share helpers via `lib/`.

The parent calls a subagent like a tool named after the directory (e.g. `researcher`). Subagents accept `{ message, outputSchema? }`; set `outputSchema` for structured task-mode output.

## Channels and schedules

Channels are root-only. Schedules are also root-only — not supported inside declared subagents.

Source: https://eve.dev/docs/introduction and https://eve.dev/docs/subagents
