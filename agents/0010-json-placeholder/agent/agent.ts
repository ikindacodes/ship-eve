import { defineAgent } from "eve";

export default defineAgent({
  description:
    "Routes JSONPlaceholder REST requests to posts, comments, albums, photos, todos, or users subagents.",
  model: "openai/gpt-4.1-mini",
});
