import { Client } from "@notionhq/client";

export const notion = new Client({  // ← exportを追加
  auth: process.env.NOTION_TOKEN,
});

export async function getPosts() {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: {
      property: "Published",
      checkbox: {
        equals: true,
      },
    },
  });
  return response.results;
}