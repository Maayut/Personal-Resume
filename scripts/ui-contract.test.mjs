import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function read(path) {
  return readFile(new URL(path, import.meta.url), "utf8").catch(() => "");
}

const [page, projectCase, actions, css, layout] = await Promise.all([
  read("../app/page.tsx"),
  read("../components/project-case.tsx"),
  read("../components/showcase-actions.tsx"),
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
});

test("the complete page renders every approved case", () => {
  assert.match(page, /projects\.map[\s\S]*<ProjectCase/);
  for (const phrase of ["领域抽象", "工作流设计", "真实验证"]) {
    assert.match(page, new RegExp(phrase));
  }
});

test("recruiter actions support copy, feedback, and print", () => {
  assert.match(actions, /navigator\.clipboard\.writeText/);
  assert.match(actions, /window\.print/);
  assert.match(actions, /role="status"/);
  assert.match(actions, /复制失败，请手动选择文本/);
});

test("print output hides screen-only controls and keeps cases together", () => {
  assert.match(css, /@media print/);
  assert.match(css, /data-screen-only/);
  assert.match(css, /break-inside:\s*avoid/);
});
