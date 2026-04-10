import Link from "next/link";
import { getPosts } from "@/lib/notion";
import ArticleSearch from "./ArticleSearch";

export default async function ArticleFooter() {
  const allPosts = await getPosts();
  const posts = allPosts.map((post: any) => ({
    id: post.id,
    title: post.properties.Title?.title?.[0]?.plain_text ?? "",
    slug: post.properties.Slug?.rich_text?.[0]?.plain_text ?? "",
    description: post.properties.Description?.rich_text?.[0]?.plain_text ?? "",
    category: post.properties.Category?.select?.name ?? "",
  }));

  return (
    <>
      {/* カテゴリーナビ */}
      <section id="category-nav">
        <p className="category-nav-lead">他のカテゴリーを見る</p>
        <div className="category-nav-buttons">
          <Link href="/shira" className="category-nav-btn">調</Link>
          <Link href="/toku" className="category-nav-btn">解</Link>
          <Link href="/asobu" className="category-nav-btn">遊</Link>
          <Link href="/nagomu" className="category-nav-btn">和</Link>
        </div>
      </section>

      {/* 内部検索 */}
      <ArticleSearch posts={posts} />

      {/* おすすめ教材 */}
      <section id="materials">
        <p className="materials-lead">自分との対話を深めたいかたへ</p>
        <a href="https://iroironoiro.info/l/c/fVqZsCq2/7d6fReGZ" target="_blank" rel="noopener noreferrer" className="materials-btn">
          諸富祥彦のフォーカシング講座プロジェクト →
        </a>
        <br />
         <a href="https://iroironoiro.info/l/c/NWsKNCNg/7d6fReGZ" target="_blank" rel="noopener noreferrer" className="materials-btn">
          クリアランスメソッドを学ぶ →
        </a>
      </section>

      {/* セッションメニュー＋LINE */}
      <section id="session-cta">
        <p className="session-lead">一緒に話してみませんか？</p>
        <Link href="/session" className="session-btn">
          セッションメニューを見る →
        </Link>
        <a href="https://lin.ee/o1SPEu5O" target="_blank" rel="noopener noreferrer" className="line-btn">
          <span className="line-btn-icon">＋</span>
          LINEで話しかけてみる
        </a>
        <p className="line-cta-sub">古賀・宗像・福津を中心に活動しています</p>
      </section>
    </>
  );
}