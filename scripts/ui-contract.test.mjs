import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function read(path) {
  return readFile(new URL(path, import.meta.url), "utf8").catch(() => "");
}

const [page, projectCase, motion, css, layout] = await Promise.all([
  read("../app/page.tsx"),
  read("../components/project-case.tsx"),
  read("../components/motion-enhancer.tsx"),
  read("../app/globals.css"),
  read("../app/layout.tsx"),
]);

test("first viewport states the recruiter-facing positioning", () => {
  assert.match(page, /把真实问题[\s\S]*变成[\s\S]*可验证[\s\S]*Agent 产品/);
  assert.match(page, /我定义真实问题和验收标准/);
  assert.match(page, /项目案例/);
});

test("the case component renders STAR and collaboration evidence", () => {
  for (const label of ["Situation", "Task", "Action", "Result", "我负责", "AI Agent 负责", "协作闭环", "诚实边界"]) {
    assert.match(projectCase, new RegExp(label));
  }
});

test("the visual system uses the approved project palette", () => {
  for (const token of ["--compliance", "--interview", "--career", "--surface"]) {
    assert.match(css, new RegExp(token));
  }
});

test("metadata is localized and specific", () => {
  assert.match(layout, /AI Agent 项目案例集/);
  assert.match(layout, /lang="zh-CN"/);
  assert.match(layout, /四个真实 Agent 项目/);
  assert.match(layout, /网申自动化/);
  assert.match(layout, /openGraph/);
  assert.match(layout, /raw\.githubusercontent\.com\/Maayut\/Personal-Resume\/main\/public\/og\.png/);
});

test("the complete page renders every approved case", () => {
  assert.match(page, /projects\.map[\s\S]*<ProjectCase/);
  assert.match(page, /\["04", "真实场景"\]/);
  assert.match(page, /四个项目/);
  assert.match(projectCase, /"resume-autofill": "accent-autofill"/);
  for (const phrase of ["领域抽象", "工作流设计", "真实验证"]) {
    assert.match(page, new RegExp(phrase));
  }
});

test("the resume-copy surface is removed", () => {
  assert.doesNotMatch(page, /ShowcaseActions/);
  assert.doesNotMatch(page, /可直接放进简历/);
  assert.doesNotMatch(page, /复制简历描述|打印 \/ 保存 PDF/);
});

test("rendered showcase components avoid Base UI client boundaries", () => {
  assert.doesNotMatch(page, /@\/components\/ui\/badge/);
  assert.doesNotMatch(projectCase, /@\/components\/ui\/(badge|separator)/);
});

test("server-rendered showcase avoids client-only icon packages", () => {
  assert.doesNotMatch(page, /lucide-react/);
  assert.doesNotMatch(projectCase, /lucide-react/);
});

test("the editorial motion system progressively enhances the page", () => {
  assert.match(page, /scroll-progress/);
  assert.match(page, /<MotionEnhancer/);
  assert.match(projectCase, /data-reveal/);
  assert.match(projectCase, /data-spotlight/);
  assert.match(motion, /IntersectionObserver/);
  assert.match(motion, /--scroll-progress/);
  assert.match(motion, /--pointer-x/);
  assert.match(css, /\.motion-ready[\s\S]*\[data-reveal\]/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
});

test("print output hides screen-only controls and keeps cases together", () => {
  assert.match(css, /@media print/);
  assert.match(css, /data-screen-only/);
  assert.match(css, /break-inside:\s*avoid/);
});
