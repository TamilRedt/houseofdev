"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { BlogPost } from "@/lib/data";
import { blogCategories } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export function BlogExplorer({ posts }: { posts: BlogPost[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return posts.filter((post) => {
      const matchesCategory = category === "All" || post.category === category;
      const matchesQuery =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.tags.some((tag) => tag.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [category, posts, query]);

  return (
    <div>
      <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-xl shadow-slate-950/5 lg:flex-row lg:items-center">
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="min-h-11 w-full rounded-md border border-slate-300 bg-white pl-10 pr-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/10"
            placeholder="Search articles, tags, or topics"
          />
        </label>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {blogCategories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`h-10 whitespace-nowrap rounded-md px-3 text-sm font-semibold transition ${
                category === item
                  ? "bg-slate-950 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-blue-500 hover:text-blue-700"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {filtered.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-950/8"
          >
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
              <span>{post.category}</span>
              <span className="text-slate-300">/</span>
              <span>{post.readTime}</span>
            </div>
            <h3 className="mt-4 text-xl font-semibold text-slate-950 group-hover:text-blue-700">
              {post.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{post.excerpt}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                  {tag}
                </span>
              ))}
            </div>
            <p className="mt-5 text-sm text-slate-500">{formatDate(post.date)}</p>
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500">
          No articles matched your search.
        </div>
      ) : null}
    </div>
  );
}

