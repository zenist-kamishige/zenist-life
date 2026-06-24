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
  content: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    "name": entry.title,
    "url": `https://zenist-life.net/kb/${entry.slug}`,
    "inDefinedTermSet": {
      "@type": "DefinedTermSet",
      "name": "zenist-life AIナレッジベース",
      "url": "https://zenist-life.net/kb",
      "author": kamishigePerson,
    },
    "dateCreated": entry.date,
    "creator": kamishigePerson,
    "author": kamishigePerson,
    "publisher": {
      "@type": "Organization",
      "name": "zenist-life",
      "url": "https://zenist-life.net",
    },
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
