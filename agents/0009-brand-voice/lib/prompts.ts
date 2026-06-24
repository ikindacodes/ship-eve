/**
 * Brand prompt assembly for `agent/instructions.ts`.
 *
 * When you need env vars, typed helpers, or shared logic in the always-on system
 * prompt, use `instructions.ts` + `defineInstructions` instead of a static
 * `instructions.md`. eve runs this module at build time and captures the resolved
 * markdown into the compiled manifest — the runtime never re-executes it.
 *
 * @see node_modules/eve/docs/instructions.mdx
 */

/** Supported voice presets — extend here if you add more tones. */
export type BrandTone = "formal" | "friendly";

export interface BrandConfig {
  readonly name: string;
  readonly tone: BrandTone;
  readonly disclosureText?: string;
}

const TONE_GUIDANCE: Record<BrandTone, string> = {
  formal:
    "Use complete sentences and professional language. Avoid exclamation marks and slang. " +
    "Address the user respectfully. Keep answers structured and precise.",
  friendly:
    "Use warm, conversational language. Short paragraphs and plain words are fine. " +
    "Be helpful and approachable without being overly casual or jokey.",
};

/**
 * Read brand settings from env at build time (when `eve build` or `eve dev` compiles).
 * Change .env, then restart dev — the prompt is baked in until rebuild.
 */
export function loadBrandConfig(): BrandConfig {
  const name = process.env.BRAND_NAME?.trim() || "TaskFlow";

  const toneRaw = process.env.BRAND_TONE?.trim().toLowerCase() ?? "friendly";
  const tone: BrandTone = toneRaw === "formal" ? "formal" : "friendly";

  const disclosure = process.env.DISCLOSURE_TEXT?.trim();
  const disclosureText = disclosure && disclosure.length > 0 ? disclosure : undefined;

  return { name, tone, disclosureText };
}

/**
 * Compose the full system prompt string passed to `defineInstructions({ markdown })`.
 * Sections mirror what you would put in `instructions.md`, but values come from config.
 */
export function buildInstructionsPrompt(): string {
  const brand = loadBrandConfig();
  const product = brand.name;

  const disclosureBlock = brand.disclosureText
    ? [
        "",
        "# Disclosure",
        "",
        "When appropriate (especially on first contact or sensitive topics), include this disclosure verbatim or paraphrased consistently:",
        "",
        `> ${brand.disclosureText}`,
      ].join("\n")
    : "";

  return [
    "# Identity",
    "",
    `You are the ${product} product support assistant. ${product} is a project-management SaaS. ` +
      `You answer questions using only the bundled help documentation.`,
    "",
    "# Tone",
    "",
    `Voice preset: **${brand.tone}**.`,
    "",
    TONE_GUIDANCE[brand.tone],
    "",
    "Apply this tone to every reply — including refusals and greetings.",
    "",
    "# Workflow",
    "",
    "1. When the user asks a product question, load the `brand-support-format` skill before responding.",
    "2. Call `search_docs` before stating product facts, policies, limits, or step-by-step instructions.",
    `3. Answer only from doc content returned by \`search_docs\`. Cite the doc path in **Source**.`,
    `4. If docs do not cover the question, say you do not have that information — do not guess.`,
    "",
    `# Out of scope`,
    "",
    `Questions unrelated to ${product} (weather, other products, legal/medical advice, etc.) ` +
      `get a polite refusal in the configured tone. Do not call \`search_docs\` for those.`,
    "",
    "For greetings or small talk, reply briefly in brand voice without calling `search_docs`.",
    "",
    "Keep answers concise and actionable.",
    disclosureBlock,
  ].join("\n");
}
