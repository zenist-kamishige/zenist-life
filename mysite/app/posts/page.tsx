import { getPosts } from "@/lib/notion";
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
  const posts = await getPosts();

  return (
    <main>
      <section style={{ maxWidth: "800px", margin: "0 auto", padding: "4rem 1.5rem" }}>
        <h1 style={{ textAlign: "center", marginBottom: "2rem", fontFamily: "'Noto Serif JP', serif", fontWeight: 400, fontSize: "24px", letterSpacing: "0.1em" }}>記事一覧</h1>
        <div className="posts-card-grid">
          {posts.map((post: any) => {
            const title = post.properties.Title?.title?.[0]?.plain_text ?? "Untitled";
            const slug = post.properties.Slug?.rich_text?.[0]?.plain_text ?? "";
            const date = post.properties.Date?.date?.start;
            const category = post.properties.Category?.select?.name ?? "";
            const colorClass = categoryColors[category] ?? "";
            return (
              <Link key={post.id} href={`/${slug}`} className="posts-card">
                {category && <span className={`posts-card-cat ${colorClass}`}>{category}</span>}
                <h3 className="posts-card-title">{title}</h3>
                {date && <time className="posts-card-date">{date}</time>}
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
