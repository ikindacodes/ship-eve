/**
 * Eve surface: instructions (`agent/instructions.ts`)
 *
 * Instructions are the always-on system prompt — prepended to every model call.
 * Use `instructions.md` for static text; switch to `instructions.ts` when the
 * prompt must be assembled from env vars, typed helpers, or `lib/` code.
 *
 * `defineInstructions` accepts one field: `markdown` (the resolved prompt string).
 * eve runs this module at build time and bakes the result into the manifest.
 * You cannot author both `instructions.md` and `instructions.ts` at the agent root.
 *
 * For runtime persona switching (per user/tenant), use `defineDynamic` instead —
 * that is out of scope for this agent.
 *
 * @see node_modules/eve/docs/instructions.mdx
 */
import { defineInstructions } from "eve/instructions";
import { buildInstructionsPrompt } from "#lib/prompts.js";

export default defineInstructions({
  // Resolved once at build; restart dev after changing BRAND_* or DISCLOSURE_TEXT in .env.
  markdown: buildInstructionsPrompt(),
});
