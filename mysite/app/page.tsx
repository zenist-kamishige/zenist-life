import { getPosts } from "@/lib/notion";
import Link from "next/link";

export default async function Home() {
  const posts = await getPosts();
  return (
    <main>
      <h1>zenist-life</h1>
      <ul>
        {posts.map((post: any) => (
          <li key={post.id}>
            <Link href={`/${post.properties.Slug.rich_text[0]?.plain_text}`}>
              {post.properties.Title.title[0]?.plain_text}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}