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
        <a href="https://iroironoiro.info/l/c/fVqZsCq2/7d6fReGZ" target="_blank" rel="noopener noreferrer" className="materials-btn"></a>