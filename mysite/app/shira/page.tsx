import { getPosts } from "@/lib/notion";
import Link from "next/link";
import ArticleFooter from "@/app/components/ArticleFooter";

export const metadata = {
  title: "ととのえる| zenist-life",
  description: "呼吸や姿勢、そして習慣をととのえるためのヒントをお届けしています。",
};

export default async function TotonoePage() {
  const allPosts = await getPosts();
  const posts = allPosts.filter(
    (post: any) => post.properties.Category?.select?.name === "調"
  );
  return (
    <main>
      <section id="category-hero">
        <div className="hero-inner">
          <span className="site-name">zenist-life</span>
          <h1 className="category-title">調</h1>
          <p className="category-yomi">ととのえる</p>
          <p className="category-desc">呼吸や姿勢、そして習慣をととのえるためのヒントをお届けしています。</p>
        </div>
      </section>
      <section id="latest-posts">
        <h2 className="latest-title">記事一覧</h2>
        <div className="posts-grid">
          {posts.map((post: any) => {
            const title = post.properties.Title?.title?.[0]?.plain_text ?? "Untitled";
            const slug = post.properties.Slug?.rich_text?.[0]?.plain_text ?? "";
            const date = post.properties.Date?.date?.start;
            return (
              <Link key={post.id} href={`/${slug}`} className="post-card">
                <h3 className="post-title">{title}</h3>
                {date && <time className="post-date">{date}</time>}
              </Link>
            );
          })}
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