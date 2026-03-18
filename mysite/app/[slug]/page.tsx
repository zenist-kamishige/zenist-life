import { getPosts, notion } from "@/lib/notion";

export default async function PostPage({ params }: any) {
  const posts = await getPosts();
  
  // デバッグ用：全記事のslugを表示
  const slugList = posts.map((p: any) => p.properties.Slug.rich_text[0]?.plain_text);

  const post = posts.find(
    (p: any) => p.properties.Slug.rich_text[0]?.plain_text === params.slug
  );

  return (
    <main>
      <p>URLのslug: {params.slug}</p>
      <p>DBのslug一覧: {JSON.stringify(slugList)}</p>
      <p>一致した記事: {post ? "あり" : "なし"}</p>
    </main>
  );
}