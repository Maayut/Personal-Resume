import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { HomePage } from '@/components/site/home-page';
import '@/site/site.css';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Missing #root element');
}

createRoot(root).render(
  <StrictMode>
    <HomePage />
  </StrictMode>,
);
