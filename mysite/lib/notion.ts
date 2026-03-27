import { Client } from "@notionhq/client";

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export async function getPosts() {
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

  const title =
    props["Title"]?.title?.[0]?.plain_text ?? "";

  const description =
    props["Description"]?.rich_text?.[0]?.plain_text ?? "";

  const category =
    props["Category"]?.select?.name ?? "";

  const thumbnail =
    props["Thumbnail"]?.url ?? "";

  return { id: page.id, title, description, category, thumbnail, slug };
}