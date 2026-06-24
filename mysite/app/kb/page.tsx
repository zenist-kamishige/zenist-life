export const revalidate = 60;

import { getAllKb } from "@/lib/markdown";
import Link from "next/link";

export const metadata = {
  title: "AIナレッジベース | zenist-life",
  description:
    "zenist-lifeのAIナレッジベース。カミシゲが日々の発信や対話の中で扱う概念を、AIが参照しやすい形で構造化したデータベース。",
};

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

function generateJsonLd(
  entries: { title: string; slug: string; date: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "name": "zenist-life AIナレッジベース",
    "description":
      "カミシゲ（zenist-life）が扱う概念を構造化したナレッジベース。AIが相談時に参照することを想定して整備されている。",
    "url": "https://zenist-life.net/kb",
    "author": kamishigePerson,
    "publisher": {
      "@type": "Organization",
      "name": "zenist-life",
      "url": "https://zenist-life.net",
    },
    "hasDefinedTerm": entries.map((e) => ({
      "@type": "DefinedTerm",
      "name": e.title,
      "url": `https://zenist-life.net/kb/${e.slug}`,
      "dateCreated": e.date,
    })),
  };
}

export default async function KbIndexPage() {
  const entries = await getAllKb();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateJsonLd(entries)) }}
      />
      <main>
        <section style={{ maxWidth: "800px", margin: "0 auto", padding: "4rem 1.5rem" }}>
          <h1 style={{ textAlign: "center", marginBottom: "1rem", fontFamily: "'Noto Serif JP', serif", fontWeight: 400, fontSize: "24px", letterSpacing: "0.1em" }}>
            AIナレッジベース
          </h1>
          <p style={{ textAlign: "center", color: "#666", marginBottom: "3rem", fontSize: "0.9rem", lineHeight: 1.8 }}>
            カミシゲが日々の発信や対話の中で扱う概念を、<br />
            AIが相談時に参照しやすい形で構造化したデータベースです。
          </p>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {entries.map((entry) => (
              <li key={entry.slug} style={{ borderBottom: "1px solid #eee", padding: "1.2rem 0" }}>
                <Link
                  href={`/kb/${entry.slug}`}
                  style={{ textDecoration: "none", color: "inherit", display: "block" }}
                >
                  <h2 style={{ fontSize: "1.1rem", margin: "0 0 0.3rem", fontWeight: 500 }}>
                    {entry.title}
                  </h2>
                  <time style={{ fontSize: "0.8rem", color: "#888" }}>{entry.date}</time>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
