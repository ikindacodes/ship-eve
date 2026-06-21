import { readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

export type DocArticle = {
  id: string;
  title: string;
  source: string;
  excerpt: string;
};

const DEFAULT_DOCS_DIR = resolve(process.cwd(), "data/product-docs");

function docsDir(): string {
  return process.env.DOCS_PATH
    ? resolve(process.env.DOCS_PATH)
    : DEFAULT_DOCS_DIR;
}

function extractTitle(content: string, fallback: string): string {
  const match = content.match(/^#\s+(.+)/m);
  return match?.[1]?.trim() ?? fallback;
}

function excerpt(content: string, maxLength = 900): string {
  const trimmed = content.replace(/^#\s+.+\n+/m, "").trim();
  if (trimmed.length <= maxLength) {
    return trimmed;
  }

  return `${trimmed.slice(0, maxLength).trimEnd()}…`;
}

let cachedArticles: DocArticle[] | null = null;
let cachedDir: string | null = null;

function loadArticles(): DocArticle[] {
  const dir = docsDir();
  if (cachedArticles && cachedDir === dir) {
    return cachedArticles;
  }

  const files = readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .sort();

  cachedDir = dir;
  cachedArticles = files.map((file) => {
    const content = readFileSync(join(dir, file), "utf8");
    const id = file.replace(/\.md$/, "");

    return {
      id,
      title: extractTitle(content, id),
      source: `data/product-docs/${file}`,
      excerpt: excerpt(content),
    };
  });

  return cachedArticles;
}

function scoreArticle(article: DocArticle, terms: string[]): number {
  const haystack = `${article.title} ${article.excerpt} ${article.id}`.toLowerCase();
  return terms.reduce(
    (score, term) => (haystack.includes(term) ? score + 1 : score),
    0,
  );
}

export function searchDocs(query: string, limit = 5): DocArticle[] {
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  if (terms.length === 0) {
    return [];
  }

  return loadArticles()
    .map((article) => ({ article, score: scoreArticle(article, terms) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ article }) => article);
}

export function listDocSources(): string[] {
  return loadArticles().map((article) => article.source);
}
