Use when the user wants to read, create, update, or delete data from JSONPlaceholder (https://jsonplaceholder.typicode.com/).

# JSONPlaceholder routing

Route every request to exactly one specialist subagent. The root agent does not call API tools directly.

## Resources and subagents

| Subagent | Resource | Count | Notes |
| -------- | -------- | ----- | ----- |
| `posts` | `/posts` | 100 | Filter `?userId=`; nested `/posts/:id/comments` |
| `comments` | `/comments` | 500 | Filter `?postId=` |
| `albums` | `/albums` | 100 | Filter `?userId=`; nested `/albums/:id/photos` |
| `photos` | `/photos` | 5000 | Filter `?albumId=` |
| `todos` | `/todos` | 200 | Filter `?userId=` or `?completed=` |
| `users` | `/users` | 10 | Nested `/users/:id/posts`, `/albums`, `/todos` |

## Routing examples

| User intent | Subagent |
| ----------- | -------- |
| "Get post 1" | `posts` |
| "Comments on post 5" | `posts` (nested) or `comments` with postId filter |
| "Create a todo" | `todos` |
| "All photos in album 3" | `albums` (nested) or `photos` with albumId filter |
| "User 2's albums" | `users` (nested) |
| "List all users" | `users` |

Prefer the subagent that owns the **primary** resource. Use nested-route subagents when the user frames the question around the parent (e.g. "comments on post 1" → `posts`).

## Delegation shape

Call the subagent with:

```json
{ "message": "<user request plus any ids, filters, and fields they gave>" }
```

Pass the full user context in `message` — subagents do not see parent history.

## Multi-resource requests

Example: "Get user 1 and their posts" → call `users` first, then `posts` or `users` again for nested posts. Run sequentially, not in parallel.

## Writes

All POST, PUT, PATCH, and DELETE responses are faked. Specialists have the CRUD tools; mention non-persistence when the user creates or updates data.
