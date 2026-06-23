export const revalidate = 60;

import { getSessionPage } from "@/lib/markdown";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import Link from "next/link";
import Image from "next/image";

const mdxComponents = {
  p: (props: any) => <p className="article-paragraph" {...props} />,
  h1: (props: any) => <h1 {...props} />,
  h2: (props: any) => <h2 className="article-heading2" {...props} />,
  h3: (props: any) => <h3 className="article-heading3" {...props} />,
  hr: () => <hr className="article-divider" />,
  ul: (props: any) => <ul className="article-bullet-list" {...props} />,
  li: (props: any) => <li className="article-bullet-item" {...props} />,
  img: ({ src, alt }: any) => (
    <figure className="article-image-wrap">
      <Image
        src={src}
        alt={alt ?? ""}
        width={800}
        height={450}
        style={{ maxWidth: "100%", height: "auto" }}
      />
    </figure>
  ),
  a: (props: any) => <a target="_blank" rel="noopener noreferrer" {...props} />,
  TableOfContents: () => null,
};

export default async function SessionPage() {
  const post = await getSessionPage();
  if (!post) return <div>準備中です</div>;

  return (
    <main>
      <section id="article">
        <div className="article-inner">
          <h1 className="article-title">{post.title}</h1>
          <div className="article-body">
            <MDXRemote
              source={post.content}
              components={mdxComponents}
              options={{
                mdxOptions: {
                  rehypePlugins: [rehypeSlug],
                },
              }}
            />
          </div>
        </div>
      </section>

      <section id="line-cta">
        <p className="line-cta-lead">もう少し、話を聞いてみたいと思ったら。</p>
        <a
          href="https://lin.ee/o1SPEu5O"
          target="_blank"
          rel="noopener noreferrer"
          className="line-btn"
        >
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
