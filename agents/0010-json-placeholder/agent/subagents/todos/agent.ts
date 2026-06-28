import { defineAgent } from "eve";

export default defineAgent({
  description: "CRUD for JSONPlaceholder todos (200 todos); filter by userId or completed.",
  model: "openai/gpt-4.1-mini",
});
