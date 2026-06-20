# ship-eve

A growing collection of runnable eve agents — clone them, run them locally, and learn from real-world examples that grow in complexity over time.

## Agents

| # | Slug | Summary | Eve surfaces |
|---|------|---------|--------------|
| 0001 | [weather](./agents/0001-weather/) | Weather assistant with a typed tool | tools, channels |

## Prerequisites

- Node 24+
- [pnpm](https://pnpm.io/)
- A [Vercel AI Gateway](https://vercel.com/docs/ai-gateway) API key (`AI_GATEWAY_API_KEY`)

All agents in this repo use the AI Gateway for model inference. Direct provider keys are not supported here.

## Quick start

```bash
git clone https://github.com/ikindacodes/ship-eve.git
cd ship-eve
pnpm install
cd agents/0001-weather
cp .env.example .env
# Add AI_GATEWAY_API_KEY to .env
pnpm dev
```

### Copy a single agent

Each agent is self-contained. Copy its folder into your own project:

```bash
cp -R agents/0001-weather/ ~/my-agent/
cd ~/my-agent
pnpm install
cp .env.example .env
pnpm dev
```

## Monorepo layout

```
ship-eve/
├── agents/       # Runnable eve agents (NNNN-slug)
├── apps/         # Future Next.js gallery and integrations
└── packages/     # Shared TypeScript config and tooling
```

## Scripts

```bash
pnpm typecheck              # Typecheck all packages
pnpm build                  # Build all agents
pnpm dev --filter @ship-eve/0001-weather
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT — see [LICENSE](./LICENSE).
