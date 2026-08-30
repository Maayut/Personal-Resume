# AI Agent Project Showcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and publish a one-page, recruiter-friendly STAR showcase for the labor-compliance, MockInterview, and Career Pathfinder projects in `Maayut/Personal-Resume`.

**Architecture:** Scaffold a single-route OpenAI Site in the empty repository. Keep verified project copy in one typed data module, render it through reusable case-study components, and isolate client-only copy/print behavior in a small action component. Use a content-contract test plus production build as the main automated gates.

**Tech Stack:** React, TypeScript, OpenAI Sites scaffold, Tailwind CSS, shadcn primitives, Lucide icons, Node built-in test runner.

---

## File map

- `app/page.tsx`: one-page composition, hero, project index, STAR sections, closing summary.
- `app/layout.tsx`: title, description, social metadata, language.
- `app/globals.css`: theme tokens, responsive layout helpers, print rules, reduced-motion behavior.
- `lib/projects.ts`: typed and evidence-bounded content for the three projects.
- `components/project-case.tsx`: reusable STAR case renderer.
- `components/showcase-actions.tsx`: copy-resume and print buttons with accessible feedback.
- `components/ui/*`: scaffolded shadcn primitives reused by showcase components.
- `scripts/content-contract.test.mjs`: verifies all cases and required disclosure language are present.
- `public/og.png`: generated social preview for shared links.
- `.openai/hosting.json`: Sites deployment declaration.
- `docs/superpowers/specs/2026-08-31-agent-project-showcase-design.md`: approved design.
- `docs/superpowers/plans/2026-08-31-agent-project-showcase.md`: this implementation plan.

### Task 1: Initialize the empty GitHub repository as a Site

**Files:**
- Create: `work/Personal-Resume/*`
- Verify: `work/Personal-Resume/.git/config`
- Verify: `work/Personal-Resume/.openai/hosting.json`

- [ ] **Step 1: Clone the exact repository**

Run:

```bash
git clone https://github.com/Maayut/Personal-Resume.git work/Personal-Resume
git -C work/Personal-Resume remote -v
```

Expected: origin points to `https://github.com/Maayut/Personal-Resume.git`; the checkout has no tracked files.

- [ ] **Step 2: Scaffold the Site with the required component add-on**

Run from `work/Personal-Resume`:

```bash
npm create --yes @openai/sites@0.3.0 . -- --yes --add-ons shadcn --install
```

Expected: the scaffold creates `app/page.tsx`, `app/layout.tsx`, `app/globals.css`, `.openai/hosting.json`, and a lockfile without overwriting unrelated files.

- [ ] **Step 3: Copy the approved design and implementation plan into the repository**

Create the two exact repository files with the already-approved contents:

```text
docs/superpowers/specs/2026-08-31-agent-project-showcase-design.md
docs/superpowers/plans/2026-08-31-agent-project-showcase.md
```

Expected: both documents are versioned beside the implementation.

- [ ] **Step 4: Inspect the generated project contract**

Run:

```bash
sed -n '1,220p' package.json
sed -n '1,220p' .openai/hosting.json
sed -n '1,240p' app/page.tsx
```

Expected: scripts and framework paths match the generated scaffold. If the scaffold uses equivalent paths, update later file paths without changing architecture.

- [ ] **Step 5: Commit initialization**

```bash
git add .
git commit -m "chore: initialize personal resume showcase"
```

Expected: one initialization commit and a clean working tree.

### Task 2: Add the typed project evidence model

**Files:**
- Create: `lib/projects.ts`
- Create: `scripts/content-contract.test.mjs`
- Modify: `package.json`

- [ ] **Step 1: Write the failing content-contract test**

Create `scripts/content-contract.test.mjs`:

```js
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("../lib/projects.ts", import.meta.url), "utf8");

test("contains exactly the three approved projects", () => {
  for (const name of ["用工合规智能系统", "MockInterview", "Career Pathfinder"]) {
    assert.match(source, new RegExp(name));
  }
  assert.doesNotMatch(source, /FastTranslate|标准引用网络数据集/);
});

test("each project exposes the required STAR and collaboration fields", () => {
  for (const field of [
    "situation:",
    "task:",
    "actions:",
    "result:",
    "humanRole:",
    "agentRole:",
    "tools:",
    "boundary:",
    "resumeCopy:",
  ]) {
    assert.equal(source.match(new RegExp(field, "g"))?.length, 3, field);
  }
});

test("preserves evidence boundaries", () => {
  assert.match(source, /未确认 WeKnora 底层具体 LLM/);
  assert.match(source, /238 项测试通过/);
  assert.match(source, /不等同于 95% 的统计准确率/);
});
```

- [ ] **Step 2: Add the exact test script**

Add this script to `package.json`:

```json
{
  "scripts": {
    "test:content": "node --test scripts/content-contract.test.mjs"
  }
}
```

Preserve all scaffolded scripts and dependencies.

- [ ] **Step 3: Run the test and verify RED**

Run:

```bash
npm run test:content
```

Expected: FAIL because `lib/projects.ts` does not exist.

- [ ] **Step 4: Create the project data types and three evidence-bounded cases**

Create `lib/projects.ts` with this public interface:

```ts
export type ToolChoice = {
  name: string;
  reason: string;
};

export type ProjectCase = {
  id: "compliance" | "mock-interview" | "career-pathfinder";
  index: string;
  title: string;
  subtitle: string;
  audience: string;
  metric: string;
  tags: string[];
  situation: string;
  task: string;
  actions: string[];
  result: string[];
  humanRole: string[];
  agentRole: string[];
  collaborationLoop: string;
  tools: ToolChoice[];
  boundary: string;
  resumeCopy: string;
};

export const projects: ProjectCase[] = [
  {
    id: "compliance",
    index: "01",
    title: "用工合规智能系统",
    subtitle: "将企业制度、法规知识与 Agent 风险诊断连接成可溯源工作流",
    audience: "企业 HR 与法务",
    metric: "88 次提交 · 26 份真实材料 · Go 后端测试通过",
    tags: ["RAG", "Agent Trace", "Go + Vue", "企业合规"],
    situation: "企业制度、合同和访谈材料分散，人工审查慢，生成式结论又容易缺少法律依据与过程证据。",
    task: "定义从企业建档、材料上传、风险分级到整改报告的业务闭环，并让每条风险能够回查知识库来源。",
    actions: [
      "先审核 Agent 工作计划，再明确 UI 对齐、后端边界和验收要求。",
      "通过 HTTP 复用 WeKnora RAG，将知识片段写入风险依据和报告溯源。",
      "真实材料首测零风险后补失败测试与劳动合规种子规则。",
      "为法规 JSONL 建立 Prompt、校验脚本、质量报告和 Agent trace。",
    ],
    result: [
      "形成 Go、Vue 3、PostgreSQL 与 WeKnora 的全栈系统。",
      "真实处理 26 份企业制度、合同和访谈材料。",
      "首轮零风险经规则修复后识别出 2 项风险。",
      "本轮 Go 后端所有有测试的包均通过。",
    ],
    humanRole: ["定义业务问题与验收标准", "提供企业材料和法律知识", "审核计划并约束技术边界", "判断真实风险结果是否合理"],
    agentRole: ["拆解数据、RAG、前后端任务", "实现接口、规则、报告和测试", "批量处理文档并做质量检查", "建立可观测 trace 与数据闸门"],
    collaborationLoop: "真实企业材料首测 risk_count=0 → 我判断结果不可信 → Agent 增加失败测试和规则 → 复测识别 2 项风险。",
    tools: [
      { name: "Codex gpt-5.5", reason: "处理复杂跨栈规划、编码和系统调试。" },
      { name: "DeepSeek v4 Flash", reason: "用于部分低成本快速迭代任务。" },
      { name: "WeKnora + RAG", reason: "复用既有知识库能力，保留 Go 服务边界并支持证据溯源。" },
    ],
    boundary: "已确认 WeKnora 承载运行时 Agent，但未确认 WeKnora 底层具体 LLM；真实 RAG 复测当时也未传实际知识库 ID。",
    resumeCopy: "用工合规智能系统｜定义企业材料治理、知识库检索、风险诊断和报告生成闭环；与 AI Agent 协作完成 Go + Vue + PostgreSQL + WeKnora 全栈系统，为风险结论加入知识片段溯源和运行 trace；真实处理 26 份企业材料，本轮后端测试通过。",
  },
  {
    id: "mock-interview",
    index: "02",
    title: "MockInterview",
    subtitle: "围绕简历与回答动态追问的中文电话模拟面试 Agent",
    audience: "产品经理求职者",
    metric: "238 项测试通过 · 77 份面经 · 267 道问题",
    tags: ["Voice Agent", "LangGraph", "DeepSeek", "混合检索"],
    situation: "传统题库式模拟面试与候选人简历脱节，RAG 生硬抽题，难以形成真实、连续的追问体验。",
    task: "建立从面经采集、结构化、检索到语音面试的完整链路，并让系统根据简历、回答和阶段状态动态追问。",
    actions: [
      "真实试用后推翻“知识库直接决定问题”的早期方向。",
      "将知识库降为流程与风格证据，重写简历中心的阶段状态机。",
      "用 FunASR、Edge TTS 和 DeepSeek 构建中文语音闭环。",
      "逐项修复代理、预热、锁竞争、浏览器播放、静音与状态持久化问题。",
    ],
    result: [
      "形成采集、结构化、混合检索、状态机和电话模式闭环。",
      "历史结构化抽取 F1 达 0.9186。",
      "一次实测链路约 2.1 秒，常态记录约 4–6 秒。",
      "本轮 238 项测试通过，1 项外部真实环境 E2E 跳过。",
    ],
    humanRole: ["提供建设计划与目标用户", "确定模型环境和产品约束", "持续进行真实语音试用", "纠正 RAG 与面试角色的产品关系"],
    agentRole: ["设计数据与 Prompt 契约", "实现采集、检索和语音链路", "分析 15 份真实面试记录", "把用户报错固化为代码与测试"],
    collaborationLoop: "真实试用发现问题与简历无关 → 我重新定义 LLM、知识库与简历的关系 → Agent 重写 Prompt、图状态和持久化 → 面试转为上下文驱动。",
    tools: [
      { name: "Codex gpt-5.6-sol", reason: "承担跨数据、后端和语音链路的系统工程。" },
      { name: "DeepSeek v4 Flash", reason: "OpenAI 兼容、中文能力和成本适合多轮面试。" },
      { name: "LangGraph", reason: "显式管理阶段推进、追问分支与 checkpoint。" },
      { name: "FunASR + Edge TTS", reason: "本地中文识别与低成本自然语音输出。" },
    ],
    boundary: "知识库规模仍低于原定 2000 份面经和 3000 道问题；外部平台真实 E2E 和移动端音频仍需继续验证。",
    resumeCopy: "MockInterview｜从真实面经构建可追溯知识库与中文电话面试 Agent；通过真实试用将“RAG 抽题”纠正为“LLM 围绕简历和回答动态追问”，使用 LangGraph、DeepSeek、FunASR、Edge TTS 完成语音闭环；本轮 238 项测试通过。",
  },
  {
    id: "career-pathfinder",
    index: "03",
    title: "Career Pathfinder",
    subtitle: "有证据、可反证、保护隐私的职业决策 Agent",
    audience: "面临职业路径选择的中国学生",
    metric: "行为契约 PASS · 6 个重要问题修复 · 模块化 Skill",
    tags: ["Decision Agent", "Evidence", "Safety", "Evaluation"],
    situation: "职业推荐容易过早下结论、使用人格标签和伪精确分数，也常把制度事实与个人体验混为一谈。",
    task: "设计一个在证据不足时持续追问、能呈现反证与不确定性、并给出可逆验证实验的职业决策 Agent。",
    actions: [
      "把画像改为连续维度、行为证据和置信度，不使用 MBTI 式标签。",
      "建立官方制度事实与从业者体验双轨证据。",
      "以 RED 基线、GREEN 复测和独立审查验证 Agent 行为。",
      "把 AI 岗位冲击拆成可自动化、被增强和需人负责的任务组合。",
    ],
    result: [
      "形成单入口、按需加载的模块化 Career Pathfinder skill。",
      "基线测试暴露过早推荐、伪评分与默认大厂更优等问题并完成修复。",
      "独立审查发现并修复 6 个 Important 问题，复审无 Critical/Important。",
      "本轮结构、链接、元数据与跨文件契约校验 PASS。",
    ],
    humanRole: ["定义中国学生决策情境", "提出行为锚点与持续追问要求", "拒绝标签化人格结论", "补充长期回报和 AI 韧性视角"],
    agentRole: ["审阅并识别 demo 结构缺陷", "设计证据、画像与安全协议", "运行 RED/GREEN 行为评测", "根据独立审查修正规则"],
    collaborationLoop: "基线场景暴露伪评分和过早推荐 → 我补充证据充分度与长期韧性要求 → Agent 将约束写入模块和测试 → 独立复审清除高等级问题。",
    tools: [
      { name: "Codex gpt-5.6-sol", reason: "适合长上下文规则设计、反例推理和评测脚本实现。" },
      { name: "模块化 Agent Skill", reason: "单入口、按需读取规则，控制上下文和维护成本。" },
      { name: "RED/GREEN + 独立审查", reason: "验证 Agent 实际行为，而不只检查文件存在。" },
    ],
    boundary: "当前 PASS 是结构和行为夹具合同通过，不等同于大规模真实学生效果；证据充分度门槛也不等同于 95% 的统计准确率。",
    resumeCopy: "Career Pathfinder｜设计面向中国学生的职业决策 Agent，以行为证据、置信度、反证和可逆实验替代人格标签与伪精确评分；使用模块化 Skill、RED/GREEN 场景测试和独立审查约束 Agent 行为，修复 6 个重要问题并通过结构与契约校验。",
  },
];
```

- [ ] **Step 5: Run the content test and verify GREEN**

Run:

```bash
npm run test:content
```

Expected: 3 tests pass.

- [ ] **Step 6: Commit the evidence model**

```bash
git add package.json lib/projects.ts scripts/content-contract.test.mjs
git commit -m "feat: add verified STAR project content"
```

### Task 3: Build the first meaningful recruiter preview

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`
- Create: `components/project-case.tsx`

- [ ] **Step 1: Apply the visual tokens**

Define these shared decisions in `app/globals.css`:

```css
:root {
  --background: #f6f3ec;
  --foreground: #13283a;
  --surface: #fffdf8;
  --muted: #607080;
  --line: #d9d9d2;
  --compliance: #137b75;
  --interview: #c86b32;
  --career: #7456a6;
  --radius-card: 20px;
}
```

Add a 1200px centered container, desktop two-column hero, mobile single-column layout, 15px minimum body text, visible focus rings, and reduced-motion rules.

- [ ] **Step 2: Create the reusable STAR renderer**

Export this component contract from `components/project-case.tsx`:

```tsx
import type { ProjectCase as Project } from "@/lib/projects";

export function ProjectCase({ project }: { project: Project }) {
  return (
    <article id={project.id} aria-labelledby={`\${project.id}-title`}>
      <header>
        <span>{project.index}</span>
        <p>{project.audience}</p>
        <h2 id={`\${project.id}-title`}>{project.title}</h2>
        <p>{project.subtitle}</p>
        <strong>{project.metric}</strong>
      </header>
      <section aria-label="STAR 项目描述">
        <div><b>S</b><h3>Situation</h3><p>{project.situation}</p></div>
        <div><b>T</b><h3>Task</h3><p>{project.task}</p></div>
        <div><b>A</b><h3>Action</h3><ul>{project.actions.map((item) => <li key={item}>{item}</li>)}</ul></div>
        <div><b>R</b><h3>Result</h3><ul>{project.result.map((item) => <li key={item}>{item}</li>)}</ul></div>
      </section>
      <section aria-label="人机协作分工">
        <div><h3>我负责</h3><ul>{project.humanRole.map((item) => <li key={item}>{item}</li>)}</ul></div>
        <div><h3>AI Agent 负责</h3><ul>{project.agentRole.map((item) => <li key={item}>{item}</li>)}</ul></div>
      </section>
      <p><strong>协作闭环：</strong>{project.collaborationLoop}</p>
      <section aria-label="工具选择">
        {project.tools.map((tool) => <div key={tool.name}><h3>{tool.name}</h3><p>{tool.reason}</p></div>)}
      </section>
      <aside><strong>诚实边界</strong><p>{project.boundary}</p></aside>
    </article>
  );
}
```

Use shadcn `Badge`, `Card`, and `Separator` primitives where the generated exports support them; do not recreate equivalent controls.

- [ ] **Step 3: Replace the starter page with the bounded first slice**

In `app/page.tsx`, render:

- navigation with “项目案例 / 能力总结”;
- hero headline “把真实问题变成可验证的 Agent 产品”;
- positioning statement from the spec;
- three metric chips;
- three project index cards;
- the first full `ProjectCase` and compact summary cards for the remaining two.

Expected first viewport: positioning, project scope, and at least one useful metric are visible without scrolling.

- [ ] **Step 4: Set site metadata**

In `app/layout.tsx`, set:

```ts
export const metadata = {
  title: "AI Agent 项目案例集",
  description: "三个真实 Agent 项目的 STAR 复盘：用工合规、模拟面试与职业决策。",
};
```

Set `<html lang="zh-CN">`.

- [ ] **Step 5: Start the retained development server**

Run:

```bash
npm run dev
```

Expected: retain the session and record the exact Local URL printed by the server.

- [ ] **Step 6: Verify the route without visual QA and hand off the first preview**

Request the exact Local URL once with `curl`.

Expected: HTTP success and no blocking compile error. Open this exact URL in Codex once; reuse the same browser tab for later HMR updates.

- [ ] **Step 7: Commit the first meaningful preview**

```bash
git add app components lib
git commit -m "feat: add recruiter-facing showcase preview"
```

### Task 4: Complete all project sections and recruiter actions

**Files:**
- Modify: `app/page.tsx`
- Modify: `components/project-case.tsx`
- Create: `components/showcase-actions.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Add the client-only action component**

Create `components/showcase-actions.tsx`:

```tsx
"use client";

import { useState } from "react";
import { projects } from "@/lib/projects";

export function ShowcaseActions() {
  const [status, setStatus] = useState("");
  const copy = async () => {
    await navigator.clipboard.writeText(projects.map((project) => project.resumeCopy).join("\n\n"));
    setStatus("三段简历描述已复制");
  };
  return (
    <div>
      <button type="button" onClick={copy}>复制简历描述</button>
      <button type="button" onClick={() => window.print()}>打印 / 保存 PDF</button>
      <span role="status" aria-live="polite">{status}</span>
    </div>
  );
}
```

Use scaffolded `Button` if available and catch clipboard rejection by setting `status` to “复制失败，请手动选择文本”.

- [ ] **Step 2: Render all three complete case studies**

Replace the two compact summary cards with:

```tsx
{projects.map((project) => (
  <ProjectCase key={project.id} project={project} />
))}
```

Add a sticky but non-obstructive project navigation on desktop and a horizontally scrollable project selector on mobile.

- [ ] **Step 3: Add the closing capability summary and resume copy surface**

Render these three capability statements:

```ts
[
  ["领域抽象", "把法律、面试与职业决策知识转成 Agent 可执行的结构。"],
  ["工作流设计", "为模型配置检索、状态、工具、证据与失败降级。"],
  ["真实验证", "用测试、trace、真实材料和用户反馈判断是否真正可用。"],
]
```

Render each `resumeCopy` as selectable text and mount `ShowcaseActions` above it.

- [ ] **Step 4: Add print and responsive rules**

In `app/globals.css`:

```css
@media print {
  nav,
  [data-screen-only="true"] {
    display: none !important;
  }
  article {
    break-inside: avoid;
    box-shadow: none !important;
  }
  body {
    background: white;
    color: black;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 5: Run content tests**

Run:

```bash
npm run test:content
```

Expected: 3 tests pass.

- [ ] **Step 6: Commit the complete experience**

```bash
git add app components
git commit -m "feat: complete STAR case studies and resume actions"
```

### Task 5: Add the social preview and final metadata

**Files:**
- Create: `public/og.png`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Generate one branded social card**

Request one landscape image with the exact title “AI Agent 项目案例集” and supporting copy “真实问题 · 人机协作 · 可验证结果”, using the site’s warm-white, ink-blue, teal, orange, and purple palette. Exclude names, credentials, private data, people, and decorative technology clichés.

Expected: one usable image with correct Chinese text.

- [ ] **Step 2: Save and wire the preview**

Save it as `public/og.png`. Add Open Graph and X metadata using a trusted deployment origin, title, description, and `/og.png`.

- [ ] **Step 3: Commit the share card**

```bash
git add public/og.png app/layout.tsx
git commit -m "feat: add social preview metadata"
```

### Task 6: Final verification, push, and publish

**Files:**
- Verify: all changed files
- Modify only if a real build failure is found

- [ ] **Step 1: Run automated content validation**

```bash
npm run test:content
```

Expected: all 3 tests pass.

- [ ] **Step 2: Run the production build**

```bash
npm run build
```

Expected: exit 0 with no type or compilation errors.

- [ ] **Step 3: Scan for unfinished markers and private data**

```bash
rg -n "TODO|TBD|马玉婷|手机号|电话：|邮箱|@qq\\.com|@163\\.com|@gmail\\.com" app components lib public || true
```

Expected: no matches.

- [ ] **Step 4: Verify repository scope**

```bash
git status --short
git diff --check
git log --oneline -6
```

Expected: only intended Site files are tracked, no whitespace errors, and the task commits are present.

- [ ] **Step 5: Push the default branch**

```bash
git push -u origin HEAD
```

Expected: `Maayut/Personal-Resume` receives the commits.

- [ ] **Step 6: Publish with Sites**

Use the Sites hosting workflow against the validated checkout.

Expected: a deployed URL that renders the same one-page showcase.

- [ ] **Step 7: Final handoff**

Return:

- the deployed URL as the primary deliverable;
- the GitHub repository URL;
- a concise verification summary;
- the three copy-ready resume descriptions.
