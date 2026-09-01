import { SiteFooter } from '@/components/site/site-footer';
import { InteractiveHero } from '@/components/site/interactive-hero';
import { SiteNav } from '@/components/site/site-nav';

export function HomePage() {
  return (
    <main className="site-shell">
      <SiteNav />
      <InteractiveHero />
      <SiteFooter />
    </main>
  );
}
