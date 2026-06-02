import { BlogExplorer } from "@/components/blog-explorer";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { blogPosts } from "@/lib/data";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Blog",
  description:
    "Read HouseOfDev insights on web development, business growth, AI, SEO, cloud computing, automation, and startups.",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Strategy notes for businesses going online and growing faster"
        description="Search by category, topic, or tag. Every article is written to help founders and operators make clearer digital decisions."
      />
      <section className="premium-gradient py-20">
        <Container>
          <BlogExplorer posts={blogPosts} />
        </Container>
      </section>
    </>
  );
}

