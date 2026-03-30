import { getPosts } from "@/lib/notion";

export default async function sitemap() {
  const posts = await getPosts();

  const postUrls = posts.map((post: any) => {
    const slug = post.properties.Slug?.rich_text?.[0]?.plain_text ?? "";
    const date = post.properties.Date?.date?.start ?? new Date().toISOString();
    return {
      url: `https://zenist-life.net/${slug}`,
      lastModified: date,
    };
  });

  return [
    { url: "https://zenist-life.net", lastModified: new Date() },
    { url: "https://zenist-life.net/about", lastModified: new Date() },
    { url: "https://zenist-life.net/session", lastModified: new Date() },
    { url: "https://zenist-life.net/shira", lastModified: new Date() },
    { url: "https://zenist-life.net/toku", lastModified: new Date() },
    { url: "https://zenist-life.net/asobu", lastModified: new Date() },
    { url: "https://zenist-life.net/nagomu", lastModified: new Date() },
    ...postUrls,
  ];
}