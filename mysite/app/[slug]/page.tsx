import { getPosts, getPost, notion } from "@/lib/notion";
import Link from "next/link";
import ArticleFooter from "@/app/components/ArticleFooter";

export async function generateMetadata({ params }: any) {
  const { slug } = await params;
  const post = await getPost(slug);
  return {
    title: post?.title ?? "zenist-life",
    description: post?.description ?? "",
  };
}

export default async function PostPage({ params }: any) {
  const { slug } = await params;
  const posts = await getPosts();

  const post = posts.find(
    (p: any) => p.properties.Slug.rich_text[0]?.plain_text === slug
  );

  if (!post) return <div>記事が見つかりません</div>;

  const blocks = await notion.blocks.children.list({
    block_id: post.id,
  });

  return (
    <main>
      <section id="article">
        <div className="article-inner">
          <h1 className="article-title">
            {(post as any).properties.Title.title[0]?.plain_text}
          </h1>
          <div className="article-body">
            {blocks.results.map((block: any) => {
              if (block.type === "paragraph") {
                return (
                  <p key={block.id} className="article-paragraph">
                    {block.paragraph.rich_text[0]?.plain_text}
                  </p>
                );
              }
              return null;
            })}
          </div>
        </div>
      </section>

      <ArticleFooter />

      <footer>
        <p className="footer-site">zenist-life</p>
        <Link href="/" className="footer-back">
          ← トップへ戻る
        </Link>
      </footer>
    </main>
  );
}