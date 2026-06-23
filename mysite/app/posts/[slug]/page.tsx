export const revalidate = 60;

import { getPostBySlug, getPostsBySeries } from "@/lib/markdown";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import Link from "next/link";
import Image from "next/image";
import ArticleFooter from "@/app/components/ArticleFooter";

export async function generateMetadata({ params }: any) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
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
  updatedAt?: string;
  thumbnail?: string;
  category: string;
}) {
  const catSlug = categoryToSlug[post.category] ?? "";
  return {
    "@context": "https://schema.org",
    "@type": "OpinionNewsArticle",
    "headline": post.title,
    "description": post.description,
    "url": `https://zenist-life.net/posts/${post.slug}`,
    "datePublished": post.date,
    "dateModified": post.updatedAt || post.date,
    "image": post.thumbnail || "https://zenist-life.net/hero-main.png",
    "author": {
      "@type": "Person",
      "name": "カミシゲ",
      "url": "https://zenist-life.net/about",
      "sameAs": [
        "https://www.instagram.com/tamasora_kamishige/",
        "https://note.com/sora_nagaru",
      ],
      "description":
        "福岡県古賀市を拠点に日土水むらの活動、たまにはSoraでもながめましょというお店で活動中。資本主義への違和感から社会の枠をはずれ、ハイブリッドな縄文時代の暮らしを提案する実践者。",
    },
    "publisher": {
      "@type": "Organization",
      "name": "zenist-life",
      "url": "https://zenist-life.net",
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "トップ", "item": "https://zenist-life.net" },
        { "@type": "ListItem", "position": 2, "name": post.category, "item": `https://zenist-life.net/${catSlug}` },
        { "@type": "ListItem", "position": 3, "name": post.title, "item": `https://zenist-life.net/posts/${post.slug}` },
      ],
    },
  };
}

const categoryImages: Record<string, string> = {
  "調": "/cat-shira.png",
  "解": "/cat-toku.png",
  "遊": "/cat-asobu.png",
  "和": "/cat-nagomu.png",
};

const categoryToSlug: Record<string, string> = {
  "調": "shira",
  "解": "toku",
  "遊": "asobu",
  "和": "nagomu",
};

const mdxComponents = {
  p: (props: any) => <p className="article-paragraph" {...props} />,
  h2: (props: any) => <h2 className="article-heading2" {...props} />,
  h3: (props: any) => <h3 className="article-heading3" {...props} />,
  hr: () => <hr className="article-divider" />,
  ul: (props: any) => <ul className="article-bullet-list" {...props} />,
  li: (props: any) => <li className="article-bullet-item" {...props} />,
  img: ({ src, alt }: any) => (
    <figure className="article-image-wrap">
      <Image
        src={src}
        alt={alt ?? ""}
        width={800}
        height={450}
        className="article-thumbnail-img"
      />
    </figure>
  ),
  a: (props: any) => <a target="_blank" rel="noopener noreferrer" {...props} />,
  TableOfContents: () => null,
};

export default async function PostPage({ params }: any) {
  const { slug } = await params;
  const postData = await getPostBySlug(slug);

  if (!postData) return <div>記事が見つかりません</div>;

  const category = postData.category;
  const thumbnail = postData.thumbnail;
  const bgImage = categoryImages[category] ?? "/hero-main.png";
  const catSlug = categoryToSlug[category] ?? "";

  const seriesPosts = postData.series
    ? await getPostsBySeries(postData.series)
    : [];

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
          <Link href={`/${catSlug}`}>{category}</Link>
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
            <MDXRemote
              source={postData.content}
              components={mdxComponents}
              options={{
                mdxOptions: {
                  rehypePlugins: [rehypeSlug],
                },
              }}
            />
          </section>
        </div>
      </article>

      {seriesPosts.length > 1 && (
        <aside className="series-nav" aria-label="シリーズ">
          <p className="series-nav-title">📚 シリーズ：{postData.series}</p>
          <ol className="series-nav-list">
            {seriesPosts.map((p, i) => (
              <li key={p.slug} className={p.slug === slug ? "series-nav-current" : ""}>
                {p.slug === slug ? (
                  <span>{i + 1}. {p.title}</span>
                ) : (
                  <Link href={`/posts/${p.slug}`}>{i + 1}. {p.title}</Link>
                )}
              </li>
            ))}
          </ol>
        </aside>
      )}
      <ArticleFooter />

      <footer>
        <p className="footer-site">zenist-life</p>
        <Link href="/" className="footer-back">← トップへ戻る</Link>
      </footer>
    </>
  );
}
