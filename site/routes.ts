/// <reference types="vite/client" />

import type { ProjectCase } from '@/lib/projects';
import type { Experience } from '@/lib/resume';

export const basePath = import.meta.env.BASE_URL;

export function homeHref(hash = '') {
  return `${basePath}${hash}`;
}

export function projectHref(id: ProjectCase['id']) {
  return `${basePath}projects/${id}/`;
}

export function experienceHref(id: NonNullable<Experience['detailId']>) {
  return `${basePath}experience/${id}/`;
}
