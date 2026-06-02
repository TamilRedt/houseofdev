import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageSquareText } from "lucide-react";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { blogPosts } from "@/lib/data";
import { createMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);

  return createMetadata({
    title: post?.title || "Blog",
    description: post?.excerpt,
    path: `/blog/${slug}`,
    keywords: post?.tags || [],
  });
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  const related = blogPosts.filter((item) => item.slug !== post.slug).slice(0, 3);

  return (
    <>
      <PageHero eyebrow={post.category} title={post.title} description={post.excerpt}>
        <p className="text-sm text-slate-300">
          {formatDate(post.date)} / {post.readTime} / {post.author}
        </p>
      </PageHero>
      <section className="bg-white py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
            <article className="prose prose-slate max-w-none">
              {post.body.map((paragraph) => (
                <p key={paragraph} className="text-lg leading-8 text-slate-700">
                  {paragraph}
                </p>
              ))}
              <div className="mt-10 rounded-lg border border-slate-200 bg-slate-50 p-6">
                <div className="flex items-center gap-3">
                  <MessageSquareText className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-semibold text-slate-950">Comments</h2>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Comments are schema-ready in the database. Connect Supabase auth to enable moderated public discussion.
                </p>
                <form className="mt-5 grid gap-3">
                  <input className="min-h-11 rounded-md border border-slate-300 px-3 text-sm" placeholder="Name" />
                  <textarea className="min-h-28 rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Comment" />
                  <button type="button" className="h-11 w-fit rounded-md bg-slate-950 px-5 text-sm font-semibold text-white">
                    Preview Comment
                  </button>
                </form>
              </div>
            </article>
            <aside>
              <div className="rounded-lg border border-slate-200 p-5">
                <h2 className="font-semibold text-slate-950">Tags</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-5 rounded-lg border border-slate-200 p-5">
                <h2 className="font-semibold text-slate-950">Related Posts</h2>
                <div className="mt-4 grid gap-3">
                  {related.map((item) => (
                    <Link key={item.slug} href={`/blog/${item.slug}`} className="text-sm font-medium leading-6 text-slate-600 hover:text-blue-700">
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}

