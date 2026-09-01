import { SiteFooter } from "@/components/site/site-footer";
import { SiteNav } from "@/components/site/site-nav";

export function HomePage() {
  return (
    <main className="site-shell">
      <SiteNav />
      <div className="site-container" />
      <SiteFooter />
    </main>
  );
}
