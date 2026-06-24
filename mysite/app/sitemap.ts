import { getAllPosts, getAllKb } from "@/lib/markdown";

export default async function sitemap() {
  const posts = await getAllPosts();
  const kbEntries = await getAllKb();

  const postUrls = posts.map((post) => ({
    url: `https://zenist-life.net/${post.slug}`,
    lastModified: post.updatedAt || post.date || new Date().toISOString(),
  }));

  const kbUrls = kbEntries.map((entry) => ({
    url: `https://zenist-life.net/kb/${entry.slug}`,
    lastModified: entry.date || new Date().toISOString(),
  }));

  return [
    { url: "https://zenist-life.net", lastModified: new Date() },
    { url: "https://zenist-life.net/about", lastModified: new Date() },
    { url: "https://zenist-life.net/session", lastModified: new Date() },
    { url: "https://zenist-life.net/shira", lastModified: new Date() },
    { url: "https://zenist-life.net/toku", lastModified: new Date() },
    { url: "https://zenist-life.net/asobu", lastModified: new Date() },
    { url: "https://zenist-life.net/nagomu", lastModified: new Date() },
    ...postUrls,
    ...kbUrls,
  ];
}
