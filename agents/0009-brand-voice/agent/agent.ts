/**
 * Eve surface: agent config (`agent/agent.ts`)
 *
 * This file is the root runtime config slot. eve discovers it automatically and
 * reads model choice, compaction, and other `defineAgent` options before a session
 * starts. Unlike tools or skills, nothing here is callable by the model — it shapes
 * how every turn runs.
 *
 * @see node_modules/eve/docs/agent-config.md
 */
import { defineAgent } from "eve";

export default defineAgent({
  // All agents in ship-eve route inference through Vercel AI Gateway.
  // Set AI_GATEWAY_API_KEY in .env before running `pnpm dev`.
  model: "openai/gpt-4.1-mini",
});
