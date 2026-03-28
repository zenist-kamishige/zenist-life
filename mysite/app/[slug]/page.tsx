import { getPost, notion } from "@/lib/notion";
import Link from "next/link";
import Image from "next/image";
import ArticleFooter from "@/app/components/ArticleFooter";

export async function generateMetadata({ params }: any) {
  const { slug } = await params;
  const post = await getPost(slug);
  return {
    title: post?.title ?? "zenist-life",
    description: post?.description ?? "",
  };
}

const categoryImages: Record<string, string> = {
  "調": "/cat-shira.png",
  "解": "/cat-toku.png",
  "遊": "/cat-asobu.png",
  "和": "/cat-nagomu.png",
};

export default async function PostPage({ params }: any) {
  const { slug } = await params;
  const postData = await getPost(slug);

  if (!postData) return <div>記事が見つかりません</div>;

  const category = postData.category;
  const thumbnail = postData.thumbnail;
  const bgImage = categoryImages[category] ?? "/hero-main.png";

  const blocks = await notion.blocks.children.list({
    block_id: postData.id,
  });

  return (
    <main>
      <section id="article-hero" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="article-hero-overlay">
          <h1 className="article-hero-title">
            {postData.title}
          </h1>
        </div>
      </section>

      <section id="article">
        <div className="article-inner">
          {thumbnail && (
            <div className="article-thumbnail">
              <Image src={thumbnail} alt="" width={800} height={450} className="article-thumbnail-img" />
            </div>
          )}
          <div className="article-body">
            {blocks.results.map((block: any) => {
              if (block.type === "paragraph") {
                return (
                  <p key={block.id} className="article-paragraph">
                    {block.paragraph.rich_text.map((text: any, i: number) => {
                      if (text.annotations.bold) {
                        return <strong key={i}>{text.plain_text}</strong>;
                      }
                      if (text.annotations.color === "red") {
                        return <span key={i} style={{ color: "#C0392B" }}>{text.plain_text}</span>;
                      }
                      if (text.annotations.color === "blue") {
                        return <span key={i} style={{ color: "#2980B9" }}>{text.