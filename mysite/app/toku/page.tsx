import { getPosts } from "@/lib/notion";
import Link from "next/link";
import ArticleFooter from "@/app/components/ArticleFooter";
export const metadata = {
  title: "解く| zenist-life",
  description: "脳・言葉・マインドについての記録です",
};
export default async function TokuPage() {
  const allPosts = await getPosts();
  const posts = allPosts.filter(
    (post: any) => post.properties.Category?.select?.name === "解"
  );
  return (
    <main>
      <section id="category-hero">
        <div className="hero-inner">
          <span className="site-name">zenist-life</span>
          <h1 className="category-title">解</h1>
          <p className="category-yomi">ほどく</p>
          <p className="category-desc">脳・言葉・マインドについての記録です</p>
        </div>
      </section>
      <section id="latest-posts">
        <h2 className="latest-title">記事一覧</h2>
        <div className="posts-card-grid">
          {posts.map((post: any) => {
            const title = post.properties.Title?.title?.[0]?.plain_text ?? "Untitled";
            const slug = post.properties.Slug?.rich_text?.[0]?.plain_text ?? "";
            const date = post.properties.Date?.date?.start;
            return (
              <Link key={post.id} href={`/${slug}`} className="posts-card">
                <span className="posts-card-cat cat-toku">解</span>
                <h3 className="posts-card-title">{title}</h3>
                {date && <time className="posts-card-date">{date}</time>}
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
