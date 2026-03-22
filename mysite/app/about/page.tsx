import Link from "next/link";

export default function AboutPage() {
  return (
    <main>

      <section id="about-hero">
        <div className="about-inner">
          <span className="site-name">zenist-life</span>
          <h1 className="about-title">もう少し、詳しく。</h1>
        </div>
      </section>

      <section className="about-section">
        <p className="about-text">
          {/* ① ここに来た人へのメッセージ */}
        </p>
      </section>

      <section className="about-section">
        <p className="about-text">
          {/* ② zenist-lifeがどんな場所か */}
        </p>
      </section>

      <section className="about-section">
        <p className="about-text">
          {/* ③ あなた自身のストーリー */}
        </p>
      </section>

      <section id="about-cta">
        <p className="line-cta-lead">話を聞いてみたいと思ったら。</p>
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
