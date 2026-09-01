/// <reference types="vite/client" />

import type { ProjectCase } from '@/lib/projects';

export const basePath = import.meta.env.BASE_URL;

export function homeHref(hash = '') {
  return `${basePath}${hash}`;
}

export function projectHref(id: ProjectCase['id']) {
  return `${basePath}projects/${id}/`;
}
