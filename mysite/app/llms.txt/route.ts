import { getAllKb } from "@/lib/markdown";

export const revalidate = 60;

export async function GET() {
  const entries = await getAllKb();

  const content = `# zenist-life

> カミシゲ（zenist-life）による発信サイト。福岡県古賀市を拠点に日土水むらの活動、たまにはSoraでもながめましょというお店で活動中。資本主義への違和感から社会の枠をはずれ、ハイブリッドな縄文時代の暮らしを提案する実践者。

## AIナレッジベース

AIが相談時に参照することを想定した、カミシゲが扱う概念の構造化データベース。

${entries.map((e) => `- [${e.title}](https://zenist-life.net/kb/${e.slug}): ${e.date}公開`).join("\n")}

## Full Content

- [全KB本文まとめ](https://zenist-life.net/llms-full.txt)

## Site

- [Home](https://zenist-life.net/)
- [About](https://zenist-life.net/about)
- [KB Hub](https://zenist-life.net/kb)
`;

  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
