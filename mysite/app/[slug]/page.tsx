export const revalidate = 60;

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
function generateJsonLd(post: {
  title: string;
  description: string;
  slug: string;
  date: string;
  updatedAt: string;
  thumbnail: string;
  category: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "OpinionNewsArticle",
    "headline": post.title,
    "description": post.description,
    "url": `https://zenist-life.net/${post.slug}`,
    "datePublished": post.date,
    "dateModified": post.updatedAt || post.date,
    "image": post.thumbnail || "https://zenist-life.net/hero-main.png",
    "author": {
      "@type": "Person",
      "name": "カミシゲ",
      "url": "https://zenist-life.net/about",
      "sameAs": [
        "https://www.instagram.com/tamasora_kamishige/",
        "https://note.com/sora_nagaru"
      ],
      "description": "福岡県古賀市を拠点に日土水むらの活動、たまにはSoraでもながめましょというお店で活動中。資本主義への違和感から社会の枠をはずれ、ハイブリッドな縄文時代の暮らしを提案する実践者。"
    },
    "publisher": {
      "@type": "Organization",
      "name": "zenist-life",
      "url": "https://zenist-life.net"
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "トップ", "item": "https://zenist-life.net" },
        { "@type": "ListItem", "position": 2, "name": post.category, "item": `https://zenist-life.net/${post.category === "調" ? "shira" : post.category === "解" ? "toku" : post.category === "遊" ? "asobu" : "nagomu"}` },
        { "@type": "ListItem", "position": 3, "name": post.title, "item": `https://zenist-life.net/${post.slug}` }
      ]
    }
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateJsonLd(postData)) }}
      />
      <header id="article-hero" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="article-hero-overlay">
          <h1 className="article-hero-title">{postData.title}</h1>
        </div>
      </header>

      <article id="article" aria-label={postData.title}>
        <nav className="article-breadcrumb" aria-label="パンくずリスト">
          <Link href="/">トップ</Link>
          <span> / </span>
          <Link href={`/${category === "調" ? "shira" : category === "解" ? "toku" : category === "遊" ? "asobu" : "nagomu"}`}>
            {category}
          </Link>
        </nav>

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

          <section className="article-body" aria-label="本文">
            {blocks.results.map((block: any) => {
              if (block.type === "paragraph") {
                const plainText = block.paragraph.rich_text[0]?.plain_text ?? "";
                if (plainText === "目次") {
                  const headings = blocks.results.filter(
                    (b: any) => b.type === "heading_2"
                  );
                  return (
                    <nav key={block.id} className="article-toc" aria-label="目次">
                      <p className="article-toc-title">目次</p>
                      <ol className="article-toc-list">
                        {headings.map((b: any) => {
                          const label = b.heading_2.rich_text[0]?.plain_text ?? "";
                          return (
                            <li key={b.id}>
                              <a href={`#h2-${b.id}`}>{label}</a>
                            </li>
                          );
                        })}
                      </ol>
                    </nav>
                  );
                }
                return (
                  <p key={block.id} className="article-paragraph">
                    {block.paragraph.rich_text.map((text: any, i: number) => {
                      if (text.annotations.bold) return <strong key={i}>{text.plain_text}</strong>;
                      if (text.annotations.color === "red") return <span key={i} style={{ color: "#C0392B" }}>{text.plain_text}</span>;
                      if (text.annotations.color === "blue") return <span key={i} style={{ color: "#2980B9" }}>{text.plain_text}</span>;
                      if (text.href) return <a key={i} href={text.href} target="_blank" rel="noopener noreferrer">{text.plain_text}</a>;
                      return <span key={i}>{text.plain_text}</span>;
                    })}
                  </p>
                );
              }
              if (block.type === "heading_2") {
                return (
                  <h2 key={block.id} id={`h2-${block.id}`} className="article-heading2">
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
                const url = block.image.type === "external"
                  ? block.image.external.url
                  : block.image.file.url;
                return (
                  <figure key={block.id} className="article-image-wrap">
                    <Image src={url} alt="" width={800} height={450} className="article-thumbnail-img" />
                  </figure>
                );
              }
              if (block.type === "divider") {
                return <hr key={block.id} className="article-divider" />;
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
