export const revalidate = 60;

import { getPosts } from "@/lib/notion";
import Link from "next/link";
import KanjiMenu from "@/app/components/KanjiMenu";
import Image from "next/image";

export const metadata = {
  title: "Zenist Life（ゼニストライフ） | 福岡のスピリチュアルカウンセリング・コーチング",
  description: "古賀・宗像・福津を中心に活動。占い・スピリチュアルカウンセリング・コーチングを通じて、あなたの「なりたい自分」へのヒントをお届けします。",
};

export default async function Home() {
  const posts = await getPosts();

  return (
    <main>

      <section id="hero" className="fade-in delay-1">
        <div className="hero-inner">
          <span className="site-name">
          Zenist-Life<br />
          <span style={{ fontSize: "0.65em" }}>ゼニストライフ</span>
          </span>
          <Image src="/hero-main.png" alt="zenist-life hero" width={1200} height={630} className="hero-image" />
          <div className="hero-content">
          <p className="catchcopy">
        
              なにかをしたい。<br />
              でも、それがわからない。<br />
              そもそも、なにができるかもわからない。
            </p>
            <Link href="/about" className="catchcopy-btn">
            もう少し詳しく →
            </Link>
          </div>
          <div className="scroll-hint">↓</div>
        </div>
      </section>

      <KanjiMenu />
      <section id="all-posts-link" className="fade-in delay-2" style={{ textAlign: "center", padding: "2rem 0" }}>
        <Link href="/posts" className="all-posts-btn">
          記事一覧はこちら →
        </Link>
      </section>
       <section id="how-to-use" className="fade-in delay-2">
        <h2 className="how-to-use-title">このサイトのつかいかた</h2>
        <p className="how-to-use-text">このサイトで気になった記事をnotebookLMにいれてみてください。アナタの悩みにカミシゲがお答えします。</p>
      </section>
      <section id="line-cta">
        <p className="line-cta-lead">
          もう少し、話を聞いてみたいと思ったら。
        </p>
       <a href="https://lin.ee/o1SPEu5O" target="_blank" rel="noopener noreferrer" className="line-btn">
        <span className="line-btn-icon">＋</span>
       LINEで話しかけてみる
      </a>
        <p className="line-cta-sub">
          古賀・宗像・福津を中心に活動しています
        </p>
      </section>
      <section id="latest-posts" className="fade-in delay-2">
        <h2 className="latest-title">Latest</h2>
        <div className="posts-grid">
          {posts.map((post: any) => {
            const title = post.properties.Title?.title?.[0]?.plain_text ?? "Untitled";
            const slug = post.properties.Slug?.rich_text?.[0]?.plain_text ?? "";
            const date = post.properties.Date?.date?.start;
            const category = post.properties.Category?.select?.name ?? "";
            return (
              <Link key={post.id} href={`/${slug}`} className="post-card">
                {category && <span className="post-category">{category}</span>}
                <h3 className="post-title">{title}</h3>
                {date && <time className="post-date">{date}</time>}
              </Link>
            );
          })}
        </div>
      </section>

      <section id="dome-banner" className="fade-in delay-3">
        <span className="dome-sub">coming soon</span>
        <h2 className="dome-title">ドームハウス建立プロジェクト</h2>
        <p className="dome-copy">日土水むらに、みんなが元気になる場所をつくります。</p>
        <Link href="/dome" className="dome-btn">詳しく見る →</Link>
      </section>

      <footer>
        <p className="footer-site">zenist-life</p>
        <p className="footer-copy">© 2025 zenist-life</p>
      </footer>

    </main>
  );
}