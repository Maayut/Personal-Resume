import type { ProjectCase } from '@/lib/projects';

import { SiteFooter } from '@/components/site/site-footer';
import { SiteNav } from '@/components/site/site-nav';

export function ProjectDetailPage({ project }: { project: ProjectCase }) {
  return (
    <main className="site-shell">
      <SiteNav projectMode />
      <article className="site-container project-detail-content">
        <h1>{project.title}</h1>
      </article>
      <SiteFooter />
    </main>
  );
}
