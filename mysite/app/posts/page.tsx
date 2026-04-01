import { getPosts } from "@/lib/notion";
import Link from "next/link";

export const metadata = {
  title: "記事一覧 | zenist-life",
  description: "zenist-lifeの全記事一覧です。",
};

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <main>
      <section style={{ maxWidth: "800px", margin: "0 auto", padding: "4rem 1.5rem" }}>
        <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>記事一覧</h1>
        <div className="posts-grid">
          {posts.map((post: any) => {
            const title = post.properties.Title?.title?.[0]?.plain_text ?? "Untitled";
            const slug = post.properties.Slug?.rich_text?.[0]?.plain_text ?? "";
            const date = post.properties.Date?.date?.start;
            const category = post.properties.Category?.select?.name ?? "";
            return (
              <Link key={post.id} href={`/${slug}`} className="post-card">
                {category && <span className="post-category">{category}</span>}
                <h3 className="post-title">{title}</h3>
                {date && <time className="post-date">{date}</time>}
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
