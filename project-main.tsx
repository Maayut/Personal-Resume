import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { ProjectDetailPage } from '@/components/site/project-detail-page';
import { projects, type ProjectCase } from '@/lib/projects';
import { homeHref } from '@/site/routes';
import '@/site/site.css';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Missing #root element');
}

const projectId: ProjectCase['id'] = document.body.dataset
  .projectId as ProjectCase['id'];
const project = projects.find(({ id }) => id === projectId);

createRoot(root).render(
  <StrictMode>
    {project ? (
      <ProjectDetailPage project={project} />
    ) : (
      <main>
        <a href={homeHref()}>项目不存在，返回主页</a>
      </main>
    )}
  </StrictMode>,
);
