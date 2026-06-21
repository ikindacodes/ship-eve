import { defineTool } from "eve/tools";
import { searchDocs } from "#lib/docs.js";
import { z } from "zod";

export default defineTool({
  description:
    "Search TaskFlow help documentation by keywords. Use before answering product questions.",
  inputSchema: z.object({
    query: z
      .string()
      .min(1)
      .describe("Keywords such as invite, billing, Slack, SSO, or export"),
    limit: z
      .number()
      .int()
      .min(1)
      .max(10)
      .optional()
      .describe("Maximum articles to return (default 5)"),
  }),
  async execute({ query, limit = 5 }) {
    const articles = searchDocs(query, limit);

    return {
      query,
      count: articles.length,
      articles: articles.map((article) => ({
        id: article.id,
        title: article.title,
        source: article.source,
        excerpt: article.excerpt,
      })),
    };
  },
});
