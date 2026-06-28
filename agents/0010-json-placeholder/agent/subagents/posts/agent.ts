import { defineAgent } from "eve";

export default defineAgent({
  description: "CRUD and nested comments for JSONPlaceholder posts (100 posts).",
  model: "openai/gpt-4.1-mini",
});
