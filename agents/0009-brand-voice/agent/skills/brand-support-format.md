<!-- Eve surface: skills (`agent/skills/brand-support-format.md`)
     Skills are on-demand procedures. The model calls `load_skill` only when a turn
     needs this workflow — unlike instructions, which are always on every turn.
     Filename `brand-support-format.md` → skill name `brand-support-format`.
     @see node_modules/eve/docs/skills.mdx -->

Use when the user asks about product features, billing, plans, integrations, SSO, exports, team setup, or troubleshooting — any product-support question for the brand named in your system instructions.

# Support response workflow

Apply this procedure for every substantive support request. Match the **tone** described in your system instructions (`formal` or `friendly`).

## Step 1 — Search documentation

Call `search_docs` with keywords from the user's question before answering factual product questions.

Use only content returned by the tool. Never invent plans, prices, limits, or UI paths.

## Step 2 — Decide coverage

| Situation | Action |
|-----------|--------|
| Docs clearly answer the question | Answer from doc excerpts |
| Docs partially answer | Answer what is documented; note gaps |
| Docs do not cover the topic | Refuse to speculate; suggest contacting the product's support channel |
| Question is not about this product | Politely decline in brand voice; do not call `search_docs` |

Refusal examples (adapt wording to tone):

- **Formal:** "That topic falls outside the scope of this support channel. I can only assist with questions covered in our product documentation."
- **Friendly:** "I'm only set up to help with product docs — I don't have info on that one!"

## Step 3 — Output format

Use this markdown shape:

```md
## Answer

[Direct answer in 1–3 short paragraphs or a numbered list for steps]

## Source

- `data/product-docs/[file].md` — [article title]

## Next steps

[Optional: one or two concrete follow-ups]
```

Omit **Next steps** when nothing useful to add.

## Guardrails

- Always call `search_docs` before product how-to or policy answers.
- Do not answer AWS, legal, medical, or unrelated topics as if product support covers them.
- Do not create, cancel, or modify customer accounts — explain self-serve steps from docs only.
- For simple greetings ("hi", "hello"), respond warmly in brand voice without calling `search_docs`.
