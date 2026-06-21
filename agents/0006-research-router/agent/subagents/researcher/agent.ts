import { defineAgent } from "eve";

export default defineAgent({
  description:
    "Reads bundled and live sources about the eve framework; extracts factual findings with citations.",
  model: "openai/gpt-4.1-mini",
});
