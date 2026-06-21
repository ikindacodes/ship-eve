Use when the user asks about eve — the framework, its docs, project layout, tools, skills, channels, subagents, durability, or how to build agents.

# Eve docs orchestration

Apply this procedure for every eve documentation question.

## Step 1 — Delegate research

Call the `researcher` subagent with:

- The user's full question in `message`
- An explicit instruction: *"Call fetch_url first for the live SOURCE_URL (default: eve introduction). Use bundled eve doc summaries for supplementary detail. Answer only from source material — this is about the eve framework, not unrelated topics."*
- `outputSchema` matching:

```json
{
  "type": "object",
  "properties": {
    "findings": {
      "type": "array",
      "items": { "type": "string" }
    },
    "sources": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": { "type": "string" },
          "url": { "type": "string" }
        },
        "required": ["name"]
      }
    }
  },
  "required": ["findings", "sources"]
}
```

Wait for the structured result before continuing.

## Step 2 — Delegate writing

Call the `writer` subagent with a `message` that includes:

- The original user question
- The full JSON result from `researcher`

Use this `outputSchema`:

```json
{
  "type": "object",
  "properties": {
    "summary": { "type": "string" },
    "findings": {
      "type": "array",
      "items": { "type": "string" }
    },
    "sources": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": { "type": "string" },
          "url": { "type": "string" }
        },
        "required": ["name"]
      }
    }
  },
  "required": ["summary", "findings", "sources"]
}
```

## Step 3 — Render for the user

Format the writer output as markdown:

```md
## Summary
{summary}

## Findings
- {finding 1}
- {finding 2}

## Sources
- {name} — {url if present}
```

Keep the writer's wording. Do not add claims beyond the writer output.

## Example questions

| User asks | Researcher should |
|-----------|-------------------|
| *What is eve?* | fetch_url + `introduction.md` |
| *How does eve name tools?* | fetch_url + `tools-and-skills.md` |
| *When do I add subagents/?* | fetch_url + `project-layout.md` |
| *What makes sessions durable?* | fetch_url + `introduction.md` |

## Guardrails

- Always load this skill before delegating.
- Never read sources directly — that is the researcher's job.
- Never skip `researcher` or `writer`.
- Do not use the built-in `agent` tool.
- Do not run subagents in parallel.
- Decline or redirect questions unrelated to eve documentation.
