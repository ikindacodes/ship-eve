import { defineAgent } from "eve";

export default defineAgent({
  description: "CRUD and nested posts, albums, and todos for JSONPlaceholder users (10 users).",
  model: "openai/gpt-4.1-mini",
});
