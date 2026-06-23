export const revalidate = 60;

import { getAllPosts } from "@/lib/markdown";
import Link from "next/link";

export const metadata = {
  title: "記事一覧 | zenist-life",
  description: "zenist-lifeの全記事一覧です。",
};

const categoryColors: Record<string, string> = {
  "調": "cat-shira",
  "解": "cat-toku",
  "遊": "cat-asobu",
  "和": "cat-nagomu",
};

export default async function PostsPage() {
  const posts = await getAllPosts();

  return (
    <main>
      <section style={{ maxWidth: "800px", margin: "0 auto", padding: "4rem 1.5rem" }}>
        <h1 style={{ textAlign: "center", marginBottom: "2rem", fontFamily: "'Noto Serif JP', serif", fontWeight: 400, fontSize: "24px", letterSpacing: "0.1em" }}>記事一覧</h1>
        <div className="posts-card-grid">
          {posts.map((post) => {
            const colorClass = categoryColors[post.category] ?? "";
            return (
              <Link key={post.slug} href={`/posts/${post.slug}`} className="posts-card">
                {post.category && <span className={`posts-card-cat ${colorClass}`}>{post.category}</span>}
                <h3 className="posts-card-title">{post.title || "Untitled"}</h3>
                {post.date && <time className="posts-card-date">{post.date}</time>}
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
