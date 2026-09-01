import type { ProjectCase } from '@/lib/projects';

export function ProjectDetailPage({ project }: { project: ProjectCase }) {
  return (
    <main>
      <h1>{project.title}</h1>
      <p>{project.subtitle}</p>
    </main>
  );
}
