import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { ProjectApp } from '@/components/site/project-app';
import '@/site/site.css';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Missing #root element');
}

createRoot(root).render(
  <StrictMode>
    <ProjectApp projectId={document.body.dataset.projectId} />
  </StrictMode>,
);
