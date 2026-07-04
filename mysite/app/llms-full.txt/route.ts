import { getAllKb } from "@/lib/markdown";

export const revalidate = 60;

export async function GET() {
  const entries = await getAllKb();

  const parts = entries.map(
    (e) => `# ${e.title}

URL: https://zenist-life.net/kb/${e.slug}
公開日: ${e.date}

${e.content}
`,
  );

  const content = `# zenist-life AIナレッジベース - Full Content

> カミシゲ（zenist-life）が扱う概念を構造化したナレッジベース。以下、全KB本文。

${parts.join("\n---\n\n")}
`;

  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
