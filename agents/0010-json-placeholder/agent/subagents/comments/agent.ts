import { defineAgent } from "eve";

export default defineAgent({
  description: "CRUD for JSONPlaceholder comments (500 comments); filter by postId.",
  model: "openai/gpt-4.1-mini",
});
