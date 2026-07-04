export const revalidate = 60;

import { getKbBySlug } from "@/lib/markdown";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import Link from "next/link";

export async function generateMetadata({ params }: any) {
  const { slug } = await params;
  const entry = await getKbBySlug(slug);
  return {
    title: entry ? `${entry.title} | AIナレッジベース` : "AIナレッジベース",
    description: entry?.content?.replace(/\n/g, " ").slice(0, 120) ?? "",
  };
}

const kamishigePerson = {
  "@type": "Person",
  "name": "カミシゲ",
  "url": "https://zenist-life.net/about",
  "sameAs": [
    "https://www.instagram.com/tamasora_kamishige/",
    "https://note.com/sora_nagaru",
  ],
  "description":
    "福岡県古賀市を拠点に日土水むらの活動、たまにはSoraでもながめましょというお店で活動中。資本主義への違和感から社会の枠をはずれ、ハイブリッドな縄文時代の暮らしを提案する実践者。",
};

function generateJsonLd(entry: {
  title: string;
  slug: string;
  date: string;
  updated?: string;
  content: string;
  faq: { q: string; a: string }[];
}) {
  const url = `https://zenist-life.net/kb/${entry.slug}`;
  const publisher = {
    "@type": "Organization",
    "name": "zenist-life",
    "url": "https://zenist-life.net",
  };

  const graph: Record<string, unknown>[] = [
    {
      "@type": "DefinedTerm",
      "@id": `${url}#definedterm`,
      "name": entry.title,
      "url": url,
      "inDefinedTermSet": {
        "@type": "DefinedTermSet",
        "name": "zenist-life AIナレッジベース",
        "url": "https://zenist-life.net/kb",
        "author": kamishigePerson,
      },
      "dateCreated": entry.date,
      "creator": kamishigePerson,
      "author": kamishigePerson,
      "publisher": publisher,
    },
    {
      "@type": "Article",
      "@id": `${url}#article`,
      "headline": entry.title,
      "url": url,
      "datePublished": entry.date,
      "dateModified": entry.updated || entry.date,
      "author": kamishigePerson,
      "publisher": publisher,
      "mainEntityOfPage": url,
    },
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      "url": url,
      "name": entry.title,
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": [".article-hero-title", ".article-body h2"],
      },
      "isPartOf": {
        "@type": "WebSite",
        "name": "zenist-life",
        "url": "https://zenist-life.net",
      },
    },
  ];

  if (entry.faq && entry.faq.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      "mainEntity": entry.faq.map((f) => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.a,
        },
      })),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

const mdxComponents = {
  p: (props: any) => <p className="article-paragraph" {...props} />,
  h2: (props: any) => <h2 className="article-heading2" {...props} />,
  h3: (props: any) => <h3 className="article-heading3" {...props} />,
  hr: () => <hr className="article-divider" />,
  ul: (props: any) => <ul className="article-bullet-list" {...props} />,
  li: (props: any) => <li className="article-bullet-item" {...props} />,
  a: (props: any) => <a target="_blank" rel="noopener noreferrer" {...props} />,
};

export default async function KbPage({ params }: any) {
  const { slug } = await params;
  const entry = await getKbBySlug(slug);

  if (!entry) return <div>エントリが見つかりません</div>;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateJsonLd(entry)) }}
      />
      <article id="article" aria-label={entry.title}>
        <div className="article-inner">
          <h1 className="article-hero-title" style={{ marginBottom: "0.5rem" }}>{entry.title}</h1>
          <p style={{ fontSize: "0.85rem", color: "#888", marginBottom: "2rem" }}>
            zenist-life AIナレッジベース / {entry.date}
          </p>
          <section className="article-body" aria-label="本文">
            <MDXRemote
              source={entry.content}
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

      <footer>
        <p className="footer-site">zenist-life</p>
        <Link href="/" className="footer-back">← トップへ戻る</Link>
      </footer>
    </>
  );
}
