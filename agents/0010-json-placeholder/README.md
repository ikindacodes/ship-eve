# 0010-json-placeholder

An eve agent that routes [JSONPlaceholder](https://jsonplaceholder.typicode.com/) REST requests to six resource specialists — posts, comments, albums, photos, todos, and users — each with typed CRUD tools and nested collection routes.

## What it does

Answers API tasks like *"Get post 1 and its comments"* or *"Create a todo for user 2"*. The root agent loads the `json-placeholder-routing` skill, identifies the target resource, and delegates to the matching subagent. Specialists call live JSONPlaceholder endpoints and return summarized results.

The root agent never calls API tools directly — it only routes and synthesizes multi-resource answers.

## Eve surfaces

- `agent/agent.ts` — root model config (orchestrator, no root tools)
- `agent/instructions.md` — routing workflow and delegation rules
- `agent/skills/json-placeholder-routing.md` — resource → subagent mapping and multi-resource procedure
- `agent/channels/eve.ts` — HTTP channel
- `agent/subagents/posts/` — posts CRUD + nested comments
- `agent/subagents/comments/` — comments CRUD
- `agent/subagents/albums/` — albums CRUD + nested photos
- `agent/subagents/photos/` — photos CRUD
- `agent/subagents/todos/` — todos CRUD
- `agent/subagents/users/` — users CRUD + nested posts, albums, todos
- `lib/jsonplaceholder.ts` — shared fetch helpers for all resources
- `lib/schemas.ts` — Zod field schemas for create/update payloads

## Environment

```bash
cp .env.example .env
```

| Variable | Required | Purpose |
|----------|----------|---------|
| `AI_GATEWAY_API_KEY` | Yes | [Vercel AI Gateway](https://vercel.com/docs/ai-gateway) — model inference |

Get a key from your Vercel dashboard → AI Gateway → API Keys.

## Run locally

### Copy this agent

```bash
mkdir my-json-placeholder && cp -R agents/0010-json-placeholder/. my-json-placeholder/
cd my-json-placeholder
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
cd agents/0010-json-placeholder
cp .env.example .env
# Add your AI_GATEWAY_API_KEY to .env
pnpm dev
```

Or from the repo root:

```bash
pnpm dev --filter 0010-json-placeholder
```

## Try it

In the dev TUI, ask any of these:

- *Get post 1*
- *List comments on post 5*
- *Show user 2 and their albums*
- *Create a todo titled "Buy milk" for user 1*
- *Mark todo 3 as completed*

Or over HTTP:

```bash
curl -X POST http://127.0.0.1:3000/eve/v1/session \
  -H 'content-type: application/json' \
  -d '{"message":"Get post 1 and summarize its comments."}'
```

## Example Q&A

| Question | Expected focus |
|----------|----------------|
| Get post 1 | Title, body, userId from `/posts/1` |
| Comments on post 5 | Nested route or comments filtered by postId |
| User 2's albums | Nested `/users/2/albums` |
| Create a todo | POST to `/todos`; remind user writes are faked |
| List all users | 10 users from `/users` |

## Subagent architecture

| Subagent | Resource | Tools |
|----------|----------|-------|
| `posts` | `/posts` (100) | list, get, create, update, patch, delete, `list_post_comments` |
| `comments` | `/comments` (500) | list, get, create, update, patch, delete |
| `albums` | `/albums` (100) | list, get, create, update, patch, delete, `list_album_photos` |
| `photos` | `/photos` (5000) | list, get, create, update, patch, delete |
| `todos` | `/todos` (200) | list, get, create, update, patch, delete |
| `users` | `/users` (10) | list, get, create, update, patch, delete, nested posts/albums/todos |

Each subagent owns its resource's HTTP verbs. The root calls subagents sequentially when a request spans multiple resources.

## JSONPlaceholder notes

- Base URL: `https://jsonplaceholder.typicode.com`
- No API key required — the agent calls the public API directly.
- POST, PUT, PATCH, and DELETE return realistic responses but **do not persist** data.

## Troubleshooting

**Wrong resource answered**

Ask explicitly — e.g. *"Using JSONPlaceholder, get comments for post 3."* The routing skill maps intent to the primary resource subagent.

**Empty or unexpected API data**

JSONPlaceholder returns fixed sample data. List endpoints support query filters (`userId`, `postId`, `albumId`, `completed`).

**Subagent errors in dev**

Watch the dev terminal for child session logs. The parent stream shows `subagent.called` / `subagent.completed` events only.

**Network failures**

Confirm outbound HTTPS access to `jsonplaceholder.typicode.com`.
