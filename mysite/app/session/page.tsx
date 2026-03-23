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