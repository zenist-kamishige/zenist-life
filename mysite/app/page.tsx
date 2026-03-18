import { getPosts } from "@/lib/notion";

export default async function Home() {
  const posts = await getPosts();

  return (
    <main>
      <h1>zenist-life</h1>
      <ul>
        {posts.map((post: any) => (
          <li key={post.id}>
            {post.properties.Title.title[0]?.plain_text}
          </li>
        ))}
      </ul>
    </main>
  );
}