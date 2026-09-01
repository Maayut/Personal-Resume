import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function read(path) {
  return readFile(new URL(path, import.meta.url), "utf8").catch(() => "");
}

const [css, nav, home, project] = await Promise.all([
  read("../site/site.css"),
  read("../components/site/site-nav.tsx"),
  read("../components/site/home-page.tsx"),
  read("../components/site/project-detail-page.tsx"),
]);

test("shared page shells include the site navigation and footer", () => {
  assert.match(home, /<SiteNav\s*\/>/);
  assert.match(home, /<SiteFooter\s*\/>/);
  assert.match(project, /<SiteNav\s+projectMode\s*\/>/);
  assert.match(project, /<SiteFooter\s*\/>/);
});

test("shared CSS exposes the site design tokens", () => {
  for (const token of ["--ink", "--signal", "--paper", "--grid-line", "--ease-field"]) {
    assert.match(css, new RegExp(token));
  }
});

test("public shared shells do not offer a PDF download", () => {
  assert.doesNotMatch(`${home}${nav}`, /下载 PDF|\.pdf/i);
});

test("navigation supports reduced motion and accessible mobile disclosure", () => {
  assert.match(css, /prefers-reduced-motion/);
  assert.match(nav, /AnimatePresence/);
  assert.match(nav, /aria-expanded/);
});
