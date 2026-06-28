import { defineAgent } from "eve";

export default defineAgent({
  description: "CRUD and nested photos for JSONPlaceholder albums (100 albums).",
  model: "openai/gpt-4.1-mini",
});
