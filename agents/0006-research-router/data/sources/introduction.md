# Introduction to eve

eve is a framework for building durable agents as ordinary files in a TypeScript project.

Instead of one large configuration object, each part of your agent gets a clear home. Instructions go in one file, tools in one folder, channels in another. eve discovers that structure and turns it into an agent that runs locally, serves HTTP, connects to other platforms, and keeps working across many turns.

eve is currently in beta and subject to the Vercel beta terms.

## Filesystem-first

eve is filesystem-first. A file's location says what it does, and its path usually gives it a name. For example, `agent/tools/get_weather.ts` defines a tool named `get_weather`. There is no separate registry to keep in sync — add the file and eve discovers it.

## Minimum project

Start with only `instructions.md` and `agent.ts`. Add other folders when the agent needs them:

- `instructions.md` — who the agent is and how it behaves
- `agent.ts` — model and runtime options
- `tools/` — typed functions the model can call
- `skills/` — longer procedures loaded on demand
- `channels/` — HTTP, Slack, Discord, and other entry points

## Message flow

When a message arrives (web app, terminal, or Slack), eve turns platform input into a message, gives the model instructions, skills, tools, and history, runs work (tools and subagents), saves the session, streams events, and delivers the result back in the form the platform expects.

## Durable sessions

An eve session is more than one request and response. It can stream progress, call tools and subagents, pause for approval or a human answer, resume after that answer, and keep durable state across turns. eve uses the Workflow SDK for durable, resumable, crash-safe sessions.

Source: https://eve.dev/docs/introduction
