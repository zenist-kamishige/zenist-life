export const revalidate = 60;
import { getSessionPage, notion } from "@/lib/notion";
import Link from "next/link";

export default async function SessionPage() {
  const post = await getSessionPage();

  if (!post) return <div>準備中です</div>;

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
  const texts = block.paragraph.rich_text;
  return (
    <p key={block.id} className="article-paragraph">
      {texts.map((t: any, i: number) =>
        t.annotations.bold
          ? <strong key={i}>{t.plain_text}</strong>
          : t.plain_text
      )}
    </p>
  );
}
        if (block.type === "heading_1") {
          return <h1 key={block.id}>{block.heading_1.rich_text[0]?.plain_text}</h1>;
            }
        if (block.type === "heading_2") {
          return <h2 key={block.id}>{block.heading_2.rich_text[0]?.plain_text}</h2>;
            }
        if (block.type === "heading_3") {
          return <h3 key={block.id}>{block.heading_3.rich_text[0]?.plain_text}</h3>;
            }
        if (block.type === "bulleted_list_item") {
          return <li key={block.id}>{block.bulleted_list_item.rich_text[0]?.plain_text}</li>;
            }   
              return null;
            })}
          </div>
        </div>
      </section>

      <section id="line-cta">
        <p className="line-cta-lead">
          もう少し、話を聞いてみたいと思ったら。
        </p>
        <a href="https://lin.ee/o1SPEu5O" target="_blank" rel="noopener noreferrer" className="line-btn">
          <span className="line-btn-icon">＋</span>
          LINEで話しかけてみる
        </a>
        <p className="line-cta-sub">古賀・宗像・福津を中心に活動しています</p>
      </section>

      <footer>
        <p className="footer-site">zenist-life</p>
        <Link href="/" className="footer-back">← トップへ戻る</Link>
      </footer>
    </main>
  );
}