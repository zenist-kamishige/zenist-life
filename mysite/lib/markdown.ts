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
  for (const file of files.filter((f) => f.endsWith(".mdx"))) {
    const raw = await fs.readFile(path.join(POSTS_DIR, file), "utf8");
    const { data, content } = matter(raw);
    posts.push({
      title: String(data.title ?? ""),
      slug: String(data.slug ?? file.replace(/\.mdx$/, "")),
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
    .filter((p) => p.published && p.category !== "セッション")
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
