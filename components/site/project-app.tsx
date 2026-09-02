import { ProjectDetailPage } from '@/components/site/project-detail-page';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteNav } from '@/components/site/site-nav';
import { projects } from '@/lib/projects';
import { homeHref } from '@/site/routes';

export function ProjectApp({ projectId }: { projectId: string | undefined }) {
  const project = projects.find(({ id }) => id === projectId);

  if (project) return <ProjectDetailPage project={project} />;

  return (
    <main className="site-shell project-fallback-shell">
      <SiteNav projectMode />
      <section
        className="site-container project-fallback"
        aria-labelledby="project-fallback-title"
      >
        <p className="section-label">PROJECT / NOT FOUND</p>
        <h1 id="project-fallback-title">项目不存在</h1>
        <p>请返回主页查看已发布的项目案例。</p>
        <a className="project-back-link" href={homeHref()}>
          <span aria-hidden="true">←</span> 返回主页
        </a>
      </section>
      <SiteFooter />
    </main>
  );
}
