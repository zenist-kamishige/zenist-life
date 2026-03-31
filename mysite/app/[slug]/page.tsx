import { getPost, notion } from "@/lib/notion";
import Link from "next/link";
import Image from "next/image";
import ArticleFooter from "@/app/components/ArticleFooter";

export async function generateMetadata({ params }: any) {
  const { slug } = await params;
  const post = await getPost(slug);
  return {
    title: post?.title ?? "zenist-life",
    description: post?.description ?? "",
  };
}

const categoryImages: Record<string, string> = {
  "調": "/cat-shira.png",
  "解": "/cat-toku.png",
  "遊": "/cat-asobu.png",
  "和": "/cat-nagomu.png",
};

export default async function PostPage({ params }: any) {
  const { slug } = await params;
  const postData = await getPost(slug);

  if (!postData) return <div>記事が見つかりません</div>;

  const category = postData.category;
  const thumbnail = postData.thumbnail;
  const bgImage = categoryImages[category] ?? "/hero-main.png";

  const blocks = await notion.blocks.children.list({
    block_id: postData.id,
  });

  return (
    <>
      {/* ヒーロー画像はarticleの外 */}
      <header id="article-hero" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="article-hero-overlay">
          <h1 className="article-hero-title">{postData.title}</h1>
        </div>
      </header>

      {/* article要素：AIが「ここが本文」と判断する核心 */}
      <article id="article" aria-label={postData.title}>

        <header className="article-meta">
          <p className="article-category">{category}</p>
        </header>

        <div className="article-inner">
          {thumbnail && (
            <figure className="article-thumbnail">
              <Image
                src={thumbnail}
                alt={postData.title}
                width={800}
                height={450}
                className="article-thumbnail-img"
              />
            </figure>
          )}

          {/* ここがAIに「核心」と伝わるsection */}
          <section className="article-body" aria-label="本文">
            {blocks.results.map((block: any) => {
              if (block.type === "paragraph") {
                return (
                  <p key={block.id} className="article-paragraph">
                    {block.paragraph.rich_text.map((text: any, i: number) => {
                      if (text.annotations.bold) {
                        return <strong key={i}>{text.plain_text}</strong>;
                      }
                      if (text.annotations.color === "red") {
                        return <span key={i} style={{ color: "#C0392B" }}>{text.plain_text}</span>;
                      }
                      if (text.annotations.color === "blue") {
                        return <span key={i} style={{ color: "#2980B9" }}>{text.plain_text}</span>;
                      }
                      if (text.href) {
                        return (
                          <a key={i} href={text.href} target="_blank" rel="noopener noreferrer">
                            {text.plain_text}
                          </a>
                        );
                      }
                      return <span key={i}>{text.plain_text}</span>;
                    })}
                  </p>
                );
              }
              if (block.type === "heading_2") {
                return (
                  <h2 key={block.id} className="article-heading2">
                    {block.heading_2.rich_text[0]?.plain_text}
                  </h2>
                );
              }
              if (block.type === "heading_3") {
                return (
                  <h3 key={block.id} className="article-heading3">
                    {block.heading_3.rich_text[0]?.plain_text}
                  </h3>
                );
              }
              if (block.type === "image") {
                const url =
                  block.image.type === "external"
                    ? block.image.external.url
                    : block.image.file.url;
                return (
                  <figure key={block.id} className="article-image-wrap">
                    <Image
                      src={url}
                      alt=""
                      width={800}
                      height={450}
                      className="article-thumbnail-img"
                    />
                  </figure>
                );
              }
              return null;
            })}
          </section>
        </div>
      </article>

      <ArticleFooter />

      <footer>
        <p className="footer-site">zenist-life</p>
        <Link href="/" className="footer-back">← トップへ戻る</Link>
      </footer>
    </>
  );
}