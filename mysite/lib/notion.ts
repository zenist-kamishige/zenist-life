import { Client } from "@notionhq/client";

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export async function getPosts() {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    page_size: 20,
    sorts: [{ property: "Date", direction: "descending" }],
    filter: {
      and: [
        {
          property: "Published",
          checkbox: { equals: true },
        },
        {
          property: "Category",
          select: { does_not_equal: "セッション" },
        },
      ],
    },
  });
  return response.results;
}

export async function getSessionPage() {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: {
      and: [
        {
          property: "Published",
          checkbox: { equals: true },
        },
        {
          property: "Category",
          select: { equals: "セッション" },
        },
      ],
    },
  });
  return response.results[0] ?? null;
}
export async function getPost(slug: string) {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: {
      property: "Slug",
      rich_text: { equals: slug },
    },
  });
  const page = response.results[0];
  if (!page || !("properties" in page)) return null;
  const props = page.properties as Record<string, any>;
  const title = props["Title"]?.title?.[0]?.plain_text ?? "";
  const description = props["Description"]?.rich_text?.[0]?.plain_text ?? "";
  const category = props["Category"]?.select?.name ?? "";
  const thumbnail = props["Thumbnail"]?.url ?? "";
  const date = props["Date"]?.date?.start ?? "";
  const updatedAt = props["UpdatedAt"]?.date?.start ?? "";

  const series = props["Series"]?.rich_text?.[0]?.plain_text ?? "";
  return { id: page.id, title, description, category, thumbnail, slug, date, updatedAt, series };
}

export async function getPostsBySeries(seriesName: string) {
  if (!seriesName) return [];
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: {
      and: [
        { property: "Published", checkbox: { equals: true } },
        { property: "Series", rich_text: { equals: seriesName } },
      ],
    },
    sorts: [{ property: "Date", direction: "ascending" }],
  });

  return response.results
    .filter((page) => "properties" in page)
    .map((page: any) => {
      const props = page.properties as Record<string, any>;
      return {
        id: page.id,
        title: props["Title"]?.title?.[0]?.plain_text ?? "",
        slug: props["Slug"]?.rich_text?.[0]?.plain_text ?? "",
        category: props["Category"]?.select?.name ?? "",
      };
    });
}