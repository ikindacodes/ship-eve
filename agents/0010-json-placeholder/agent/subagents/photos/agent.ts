import { defineAgent } from "eve";

export default defineAgent({
  description: "CRUD for JSONPlaceholder photos (5000 photos); filter by albumId.",
  model: "openai/gpt-4.1-mini",
});
