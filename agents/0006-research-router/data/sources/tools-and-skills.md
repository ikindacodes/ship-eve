# Tools and skills in eve

## Tools

A tool is a typed action the agent can call — hitting an API, running a query, writing a file. Tools run in your app runtime with full access to `process.env`, not in the sandbox.

Define tools under `agent/tools/`. The filename is the tool name the model sees. `agent/tools/get_weather.ts` is exposed as `get_weather`.

Each tool needs:

- a `description` for the model
- an `inputSchema` (Zod or JSON Schema; use `z.object({})` for no input)
- an `execute(input, ctx)` implementation

Tools can require human approval via `needsApproval` before running sensitive actions.

## Skills

A skill is a model-loadable procedure in markdown (or `defineSkill` in TypeScript). eve advertises each skill's description; the model loads the full body on demand via `load_skill` — progressive disclosure.

Skills add instructions, not new execution surfaces. Tools stay visible whether a skill is loaded or not. If you need typed runtime behavior, use a tool.

Flat markdown skills live at `agent/skills/forecast.md`. Packaged skills are directories with `SKILL.md` and optional sibling files.

## Skills are scoped per agent

A subagent's `skills/` are invisible to the root agent. Put shared executable helpers in `lib/` instead.

Source: https://eve.dev/docs/tools and https://eve.dev/docs/skills
