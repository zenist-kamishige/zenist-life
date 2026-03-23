import Link from "next/link";

export default function ArticleFooter() {
  return (
    <>
      {/* おすすめ教材 */}
      <section id="materials">
        <p className="materials-lead">もっと深めたい方へ</p>
        <a href="https://iroironoiro.info/l/c/fVqZsCq2/7d6fReGZ" target="_blank" rel="noopener noreferrer" className="materials-btn">
          諸富祥彦のフォーカシング講座プロジェクト →
        </a>
      </section>

      {/* セッションメニュー＋LINE */}
      <section id="session-cta">
        <p className="session-lead">一緒に話してみませんか？</p>
        <Link href="/session" className="session-btn">
          セッションメニューを見る →
        </Link>
        <a href="https://lin.ee/o1SPEu5O" target="_blank" rel="noopener noreferrer" className="line-btn">
          <span className="line-btn-icon">＋</span>
          LINEで話しかけてみる
        </a>
        <p className="line-cta-sub">古賀・宗像・福津を中心に活動しています</p>
      </section>
    </>
  );
}