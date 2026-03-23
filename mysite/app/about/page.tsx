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
        なにかをしたい。<br />
        でも、それがなんだかわからない。<br />
        というか、そもそも自分になにができるんだろう？<br />
        そんな答えのない悩みをかかえていませんか？
        </p>
      </section>

      <section className="about-section">
        <p className="about-text">
          その悩みは、じつは宇宙最先端なのです。<br />
          そんな悩みを解決するには行動することです。<br />
          大事なのは自分の内側と対話しながら行動すること。<br />
          自分と対話をすると自然と行動できるようになります。
        </p>
      </section>

      <section className="about-section">
        <p className="about-text">
          そんな悩みを解決するためにスピリチュアルなことを20年ちかく探求をし続けました。<br />
          このサイトは僕が20年かけて集めてきた情報をあつめたものです。<br />
          テーマは「社会不適合者になるためのデータベース」 です。
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
