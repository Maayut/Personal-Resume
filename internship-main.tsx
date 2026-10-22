import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { InternshipPage } from '@/components/site/internship-page';
import '@/site/site.css';
import '@/site/internship.css';
import '@/site/internship-diagrams.css';
import '@/site/qianxun.css';

const root = document.getElementById('root');
if (!root) throw new Error('Missing #root element');

createRoot(root).render(
  <StrictMode>
    <InternshipPage internshipId={document.body.dataset.internshipId} />
  </StrictMode>,
);
