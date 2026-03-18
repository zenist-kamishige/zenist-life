import { getPosts, notion } from "@/lib/notion";

export default async function PostPage({ params }: any) {
  const { slug } = await params;  // ← awaitを追加
  const posts = await getPosts();

  const post = posts.find(
    (p: any) => p.properties.Slug.rich_text[0]?.plain_text === slug
  );

  if (!post) return <div>記事が見つかりません</div>;

  const blocks = await notion.blocks.children.list({
    block_id: post.id,
  });

  return (
    <main>
      <h1>{(post as any).properties.Title.title[0]?.plain_text}</h1>
      <div>
        {blocks.results.map((block: any) => {
          if (block.type === "paragraph") {
            return (
              <p key={block.id}>
                {block.paragraph.rich_text[0]?.plain_text}
              </p>
            );
          }
          return null;
        })}
      </div>
    </main>
  );
}