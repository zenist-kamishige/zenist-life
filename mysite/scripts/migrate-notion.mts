import { Client } from "@notionhq/client";
import * as fs from "node:fs/promises";
import * as path from "node:path";

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;
if (!NOTION_TOKEN || !NOTION_DATABASE_ID) {
  console.error("NOTION_TOKEN or NOTION_DATABASE_ID is missing in .env.local");
  process.exit(1);
}

const notion = new Client({ auth: NOTION_TOKEN });

const args = process.argv.slice(2);
const slugFilter = args.find((a) => a.startsWith("--slug="))?.split("=")[1];
const OUT_DIR = "content/posts";

function yamlString(s: string): string {
  if (!s) return '""';
  return `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function convertRichText(richText: any[]): string {
  return richText
    .map((t) => {
      let text = t.plain_text;
      if (t.annotations?.bold) text = `**${text}**`;
      if (t.annotations?.color === "red")
        text = `<span style={{color:'#C0392B'}}>${text}</span>`;
      if (t.annotations?.color === "blue")
        text = `<span style={{color:'#2980B9'}}>${text}</span>`;
      if (t.href) text = `[${text}](${t.href})`;
      return text;
    })
    .join("");
}

function blockToMdx(block: any): string {
  switch (block.type) {
    case "paragraph": {
      const text = convertRichText(block.paragraph.rich_text);
      if (text.trim() === "目次") return "<TableOfContents />";
      return text;
    }
    case "heading_2":
      return `## ${convertRichText(block.heading_2.rich_text)}`;
    case "heading_3":
      return `### ${convertRichText(block.heading_3.rich_text)}`;
    case "image": {
      const url =
        block.image.type === "external"
          ? block.image.external.url
          : block.image.file.url;
      return `![](${url})`;
    }
    case "divider":
      return "---";
    case "bulleted_list_item":
      return `- ${convertRichText(block.bulleted_list_item.rich_text)}`;
    default:
      return "";
  }
}

async function fetchAllBlocks(pageId: string): Promise<any[]> {
  const blocks: any[] = [];
  let cursor: string | undefined;
  do {
    const res: any = await notion.blocks.children.list({
      block_id: pageId,
      start_cursor: cursor,
    });
    blocks.push(...res.results);
    cursor = res.has_more ? res.next_cursor ?? undefined : undefined;
  } while (cursor);
  return blocks;
}

async function fetchAllPages(): Promise<any[]> {
  const pages: any[] = [];
  let cursor: string | undefined;
  do {
    const res: any = await notion.databases.query({
      database_id: NOTION_DATABASE_ID!,
      start_cursor: cursor,
      page_size: 100,
    });
    pages.push(...res.results);
    cursor = res.has_more ? res.next_cursor ?? undefined : undefined;
  } while (cursor);
  return pages;
}

async function migratePage(page: any): Promise<boolean> {
  const props = page.properties;
  const title = props.Title?.title?.[0]?.plain_text ?? "";
  const slug = props.Slug?.rich_text?.[0]?.plain_text ?? "";
  const description = props.Description?.rich_text?.[0]?.plain_text ?? "";
  const category = props.Category?.select?.name ?? "";
  const thumbnail = props.Thumbnail?.url ?? "";
  const date = props.Date?.date?.start ?? "";
  const updatedAt = props.UpdatedAt?.date?.start ?? "";
  const series = props.Series?.rich_text?.[0]?.plain_text ?? "";
  const published = props.Published?.checkbox ?? false;

  if (!slug) {
    console.warn(`  skip (no slug): "${title}"`);
    return false;
  }

  const fmLines = [
    "---",
    `title: ${yamlString(title)}`,
    `slug: ${slug}`,
    `category: ${yamlString(category)}`,
    `date: "${date}"`,
  ];
  if (updatedAt) fmLines.push(`updatedAt: "${updatedAt}"`);
  fmLines.push(`description: ${yamlString(description)}`);
  if (thumbnail) fmLines.push(`thumbnail: ${yamlString(thumbnail)}`);
  if (series) fmLines.push(`series: ${yamlString(series)}`);
  fmLines.push(`published: ${published}`);
  fmLines.push("---");
  const frontmatter = fmLines.join("\n");

  const blocks = await fetchAllBlocks(page.id);
  const body = blocks.map(blockToMdx).filter(Boolean).join("\n\n");

  const content = `${frontmatter}\n\n${body}\n`;
  const outPath = path.join(OUT_DIR, `${slug}.md`);
  await fs.writeFile(outPath, content, "utf8");
  console.log(`  ✓ ${slug} (${title})`);
  return true;
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  console.log("Fetching pages from Notion...");
  const pages = await fetchAllPages();
  console.log(`Found ${pages.length} pages`);

  const targets = slugFilter
    ? pages.filter(
        (p: any) =>
          p.properties?.Slug?.rich_text?.[0]?.plain_text === slugFilter,
      )
    : pages;
  console.log(`Migrating ${targets.length} page(s)...`);

  let count = 0;
  for (const page of targets) {
    if (await migratePage(page)) count++;
  }
  console.log(`Done: ${count} file(s) written to ${OUT_DIR}/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
