import { LocalBusinessHome } from "@/components/local-business-home";
import { getHomepageContent } from "@/lib/homepage-content";

export const revalidate = 300;

export default async function Home() {
  const content = await getHomepageContent();

  return <LocalBusinessHome content={content} />;
}
