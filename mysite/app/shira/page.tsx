export const revalidate = 60;

import { getPostsByCategory } from "@/lib/markdown";
import Link from "next/link";
import ArticleFooter from "@/app/components/ArticleFooter";
export const metadata = {
  title: "調う| zenist-life",
  description: "息を吐く、深呼吸をする、姿勢をただす、食べるものを選ぶ。そんな当たり前のがあなたの人生をつくっています。そんな当たり前をととのえるヒントを紹介しています。",
};
export default async function ShiraPage() {
  const posts = await getPostsByCategory("調");
  return (
    <main>
      <section id="category-hero">
        <div className="hero-inner">
          <span className="site-name">zenist-life</span>
          <h1 className="category-title">調</h1>
          <p className="category-yomi">ととのえる</p>
          <p className="category-desc">息を吐く、深呼吸をする、姿勢をただす、食べるものを選ぶ。そんな当たり前のがあなたの人生をつくっています。そんな当たり前をととのえるヒントを紹介しています。</p>
        </div>
      </section>
      <section id="latest-posts">
        <h2 className="latest-title">記事一覧</h2>
        <div className="posts-card-grid">
          {posts.map((post) => (
            <Link key={post.slug} href={`/posts/${post.slug}`} className="posts-card">
              <span className="posts-card-cat cat-shira">調</span>
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
