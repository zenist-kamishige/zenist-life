"use client";
import { useState } from "react";
import Link from "next/link";

type Post = {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
};

export default function ArticleSearch({ posts }: { posts: Post[] }) {
  const [query, setQuery] = useState("");

  const results = query.trim()
    ? posts.filter(
        (p) =>
          p.title.includes(query) ||
          p.description.includes(query)
      )
    : [];

  return (
    <section id="article-search">
      <p className="search-lead">記事を検索する</p>
      <input
        type="text"
        className="search-input"
        placeholder="キーワードを入力..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {query.trim() && (
        <div className="search-results">
          {results.length > 0 ? (
            results.map((post) => (
              <Link key={post.id} href={`/${post.slug}`} className="search-result-item">
                <span className="search-result-category">{post.category}</span>
                <span className="search-result-title">{post.title}</span>
              </Link>
            ))
          ) : (
            <p className="search-no-result">見つかりませんでした</p>
          )}
        </div>
      )}
    </section>
  );
}