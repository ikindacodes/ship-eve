/**
 * Eve surface: tools (`agent/tools/search_docs.ts`)
 *
 * Tool identity is path-derived: this file becomes the `search_docs` tool with no
 * separate name field. The model sees `description` + Zod `inputSchema` and calls
 * `execute` when it needs help-doc search results.
 *
 * @see node_modules/eve/docs/tools/overview.mdx
 */
import { defineTool } from "eve/tools";
import { loadBrandConfig } from "#lib/prompts.js";
import { searchDocs } from "#lib/docs.js";
import { z } from "zod";

// Read brand name at module load (build time) so the tool description matches instructions.
const brandName = loadBrandConfig().name;

export default defineTool({
  description:
    `Search ${brandName} help documentation by keywords. ` +
    "Use before answering product questions.",
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
