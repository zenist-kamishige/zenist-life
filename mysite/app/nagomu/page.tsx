export const revalidate = 60;

import { getPostsByCategory } from "@/lib/markdown";
import Link from "next/link";
import ArticleFooter from "@/app/components/ArticleFooter";
export const metadata = {
  title: "和む| zenist-life",
  description: "日土水むら・田んぼでの活動記録です",
};
export default async function NagomuPage() {
  const posts = await getPostsByCategory("和");
  return (
    <main>
      <section id="category-hero">
        <div className="hero-inner">
          <span className="site-name">zenist-life</span>
          <h1 className="category-title">和</h1>
          <p className="category-yomi">なごむ</p>
          <p className="category-desc">日土水むら・田んぼでの活動記録です</p>
        </div>
      </section>
      <section id="latest-posts">
        <h2 className="latest-title">記事一覧</h2>
        <div className="posts-card-grid">
          {posts.map((post) => (
            <Link key={post.slug} href={`/posts/${post.slug}`} className="posts-card">
              <span className="posts-card-cat cat-nagomu">和</span>
              <h3 className="posts-card-title">{post.title || "Untitled"}</h3>
              {post.date && <time className="posts-card-date">{post.date}</time>}
            </Link>
          ))}
        </div>
      </section>
      <ArticleFooter />
      <footer>
        <p className="footer-site">zenist-life</p>
        <Link href="/" className="footer-back">← トップへ戻る</Link>
      </footer>
    </main>
  );
}
