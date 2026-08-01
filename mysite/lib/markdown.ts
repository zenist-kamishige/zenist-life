import * as fs from "node:fs/promises";
import * as path from "node:path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content/posts");

function toDateString(v: unknown): string {
  if (!v) return "";
  if (v instanceof Date) {
    const yyyy = v.getUTCFullYear();
    const mm = String(v.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(v.getUTCDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }
  return String(v);
}

export type Post = {
  title: string;
  slug: string;
  category: string;
  date: string;
  updatedAt?: string;
  description: string;
  thumbnail?: string;
  series?: string;
  published: boolean;
  content: string;
};

async function readAllPostFiles(): Promise<Post[]> {
  const files = await fs.readdir(POSTS_DIR);
  const posts: Post[] = [];
  for (const file of files.filter((f) => f.endsWith(".md"))) {
    const raw = await fs.readFile(path.join(POSTS_DIR, file), "utf8");
    const { data, content } = matter(raw);
    posts.push({
      title: String(data.title ?? ""),
      slug: String(data.slug ?? file.replace(/\.md$/, "")),
      category: String(data.category ?? ""),
      date: toDateString(data.date),
      updatedAt: data.updatedAt ? toDateString(data.updatedAt) : undefined,
      description: String(data.description ?? ""),
      thumbnail: data.thumbnail ? String(data.thumbnail) : undefined,
      series: data.series ? String(data.series) : undefined,
      published: Boolean(data.published ?? false),
      content,
    });
  }
  return posts;
}

export async function getAllPosts(): Promise<Post[]> {
  const all = await readAllPostFiles();
  return all
    .filter((p) => p.published && p.category !== "セッション" && p.category !== "寺子屋")
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const all = await readAllPostFiles();
  return all.find((p) => p.slug === slug && p.published) ?? null;
}

export async function getSessionPage(): Promise<Post | null> {
  const all = await readAllPostFiles();
  return all.find((p) => p.published && p.category === "セッション") ?? null;
}

export async function getTerakoyaPage(): Promise<Post | null> {
  const all = await readAllPostFiles();
  return all.find((p) => p.published && p.category === "寺子屋") ?? null;
}

export async function getPostsBySeries(seriesName: string): Promise<Post[]> {
  if (!seriesName) return [];
  const all = await readAllPostFiles();
  return all
    .filter((p) => p.published && p.series === seriesName)
    .sort((a, b) => (a.date > b.date ? 1 : -1));
}

export async function getPostsByCategory(categoryName: string): Promise<Post[]> {
  const all = await readAllPostFiles();
  return all
    .filter((p) => p.published && p.category === categoryName)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

const KB_DIR = path.join(process.cwd(), "content/kb");

export type KbFaqItem = { q: string; a: string };

export type KbEntry = {
  title: string;
  slug: string;
  date: string;
  updated?: string;
  status: string;
  related: string[];
  published: boolean;
  content: string;
  faq: KbFaqItem[];
};

function extractFAQ(content: string): KbFaqItem[] {
  const marker = "## よくある質問（FAQ）";
  const idx = content.indexOf(marker);
  if (idx === -1) return [];
  const rest = content.slice(idx + marker.length);
  const endMatch = rest.match(/\n##\s/);
  const section = endMatch ? rest.slice(0, endMatch.index) : rest;

  const items: KbFaqItem[] = [];
  const blocks = section.split(/\n### Q:\s*/).slice(1);
  for (const block of blocks) {
    const nlIdx = block.indexOf("\n");
    const q = (nlIdx === -1 ? block : block.slice(0, nlIdx)).trim();
    const afterQ = nlIdx === -1 ? "" : block.slice(nlIdx + 1);
    const aMatch = afterQ.match(/A:\s*/);
    if (!aMatch || aMatch.index === undefined) continue;
    const a = afterQ.slice(aMatch.index + aMatch[0].length).trim();
    if (q && a) items.push({ q, a });
  }
  return items;
}

async function readAllKbFiles(): Promise<KbEntry[]> {
  const files = await fs.readdir(KB_DIR);
  const entries: KbEntry[] = [];
  for (const file of files.filter((f) => f.endsWith(".md"))) {
    const raw = await fs.readFile(path.join(KB_DIR, file), "utf8");
    const { data, content } = matter(raw);
    entries.push({
      title: String(data.title ?? ""),
      slug: String(data.slug ?? file.replace(/\.md$/, "")),
      date: toDateString(data.date),
      updated: data.updated ? toDateString(data.updated) : undefined,
      status: String(data.status ?? ""),
      related: Array.isArray(data.related) ? data.related.map(String) : [],
      published: Boolean(data.published ?? false),
      content,
      faq: extractFAQ(content),
    });
  }
  return entries;
}

export async function getAllKb(): Promise<KbEntry[]> {
  const all = await readAllKbFiles();
  return all
    .filter((e) => e.published)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getKbBySlug(slug: string): Promise<KbEntry | null> {
  const all = await readAllKbFiles();
  return all.find((e) => e.slug === slug && e.published) ?? null;
}
