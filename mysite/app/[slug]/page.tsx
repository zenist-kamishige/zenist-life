import { getPosts } from "@/lib/notion";
import Link from "next/link";
import KanjiMenu from "@/app/components/KanjiMenu";

export default async function Home() {
  const posts = await getPosts();

  return (
    <main>

      <section id="hero" className="fade-in delay-1">
        <div className="hero-inner">
          <span className="site-name">zenist-life</span>
          <div className="hero-content">
            <div className="illustration-placeholder">イラスト</div>
            <p className="catchcopy">
              なにかをしたい。<br />
              でも、それがわからない。<br />
              そもそも、なにができるかもわからない。
            </p>
          </div>
          <div className="scroll-hint">↓</div>
        </div>
      </section>

      <KanjiMenu />

      <section id="line-cta">
        <p className="line-cta-lead">
          もう少し、話を聞いてみたいと思ったら。
        </p>
        
          href="https://lin.ee/o1SPEu5O"
          target="_blank"
          rel="noopener noreferrer"
          className="line-btn"
        >
          <span className="line-btn-icon">＋</span>
          LINEで話しかけてみる
        </a>
        <p className="line-cta-sub">
          古賀・宗像・福津を中心に活動しています