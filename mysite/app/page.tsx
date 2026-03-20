import { getPosts } from "@/lib/notion";
import Link from "next/link";
import KanjiMenu from "@/app/components/KanjiMenu";

export default async function Home() {
  const posts = await getPosts();

  return (
    <main>
      <section id="hero" className="fade-in delay-1">
        <div className="hero-inner">
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "12px", letterSpacing: "0.35em", color: "var(--color-ink-muted)", textTransform: "lowercase" }}>
            zenist-life
          </span>
          <div className="hero-content">
            <div className="illustration-placeholder">手書きイラストをここに配置</div>
            <p className="catchcopy">呼吸を調え、自分を愛おしむ。</p>
          </div>
          <div className="scroll-hint">↓</div>
        </div>
      </section>

      <KanjiMenu />

      <section id="latest-posts" className="fade-in delay-2">
        <h2 className="latest-title">最新のことば</h2>
        <div className="posts-grid">
          {posts.map((post: any) => {
            const title = post.properties.Title?.title?.[0]?.plain_text ?? "Untitled";
            const slug = post.properties.Slug?.rich_text?.[0]?.plain_text ?? "";
            const date = post.properties.Date?.date?.start;
            const category = post.properties.Category?.select?.name ?? "言葉";

            return (
              <Link key={post.id} href={`/${slug}`} className="post-card">
                <span className="post-category">{category}</span>
                <h3 className="post-title">{title}</h3>
                {date ? <time className="post-date">{date}</time> : null}
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