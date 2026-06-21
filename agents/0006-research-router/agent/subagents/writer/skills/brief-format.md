Use when formatting eve documentation research into a Summary / Findings / Sources brief for the user.

# Brief format

Apply when you receive research findings about **eve** from the orchestrator.

## Summary

- 2–4 sentences answering the user's eve question directly.
- Explain concepts plainly — assume the reader is new to eve.
- No hype; practical, doc-grounded tone.

## Findings

- Return 4–8 strings, each one factual claim supported by the research input.
- One idea per string — the orchestrator renders them as bullets.
- Prefer concrete facts (folder paths, tool naming, session behavior) over vague praise.

## Sources

- Pass through every source from the research input.
- Each entry: `{ name, url? }` — `name` is required; include `url` when the source was fetched live.

## Guardrails

- Never invent findings, API names, or doc URLs.
- Do not copy long passages — synthesize.
- Stay on eve documentation — do not drift to unrelated topics.
- Do not add sections beyond summary, findings, and sources in the structured output.
