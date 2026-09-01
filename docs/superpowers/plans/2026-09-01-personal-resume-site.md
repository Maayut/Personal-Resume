# Personal Resume Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and publish a recruiter-facing AI product manager resume site with an interactive video homepage and four visually consistent static project detail pages.

**Architecture:** Keep GitHub Pages as the production target and turn the current single-entry Vite export into a five-entry static site. Structured resume and project data feed shared React components; the homepage and project pages import one design system and motion layer so their visual language cannot drift.

**Tech Stack:** React 19, TypeScript, Vite 8 multi-page build, Tailwind/PostCSS foundation, `motion/react`, Node test runner, GitHub Pages (`gh-pages` branch)

---

## File map

**Data**

- Create `lib/resume.ts`: public profile, selected experiences, education, capabilities and honors.
- Modify `lib/projects.ts`: retain evidence boundaries and add explicit challenge/solution items for the detail template.

**Shared site UI**

- Create `components/site/site-nav.tsx`: shared desktop and mobile navigation.
- Create `components/site/section-heading.tsx`: English label plus Chinese section heading.
- Create `components/site/site-footer.tsx`: consistent contact/footer surface.
- Create `components/site/interactive-hero.tsx`: background video, typewriter and capability pills.
- Create `components/site/home-page.tsx`: complete resume homepage composition.
- Create `components/site/project-detail-page.tsx`: shared project detail template and previous/next navigation.
- Create `hooks/use-background-video.ts`: desktop scrub, mobile autoplay, reduced-motion and error state.
- Create `hooks/use-typewriter.ts`: one-shot headline typewriter.
- Create `site/site.css`: all shared tokens, layout, typography, motion and responsive rules.
- Create `site/routes.ts`: base-path-safe homepage and project URLs.

**Static entries**

- Modify `pages-main.tsx`: render the new homepage.
- Create `project-main.tsx`: resolve `data-project-id` and render the common project page.
- Create `projects/compliance/index.html`.
- Create `projects/mock-interview/index.html`.
- Create `projects/career-pathfinder/index.html`.
- Create `projects/resume-autofill/index.html`.
- Modify `vite.pages.config.ts`: configure all five HTML inputs.

**Assets and metadata**

- Create `public/media/mayuting-portrait.jpg`: optimized copy of the approved portrait.
- Create `public/media/hero-fallback.svg`: local fallback for remote video failure/reduced motion.
- Modify `index.html` and project HTML files: page-specific metadata, favicon and entry scripts.

**Tests**

- Create `scripts/resume-content-contract.test.mjs`.
- Modify `scripts/ui-contract.test.mjs`.
- Create `scripts/pages-output.test.mjs`.
- Modify `package.json`: add `motion`, test scripts and typecheck script.

---

### Task 1: Lock resume facts and project detail data with tests

**Files:**
- Create: `scripts/resume-content-contract.test.mjs`
- Create: `lib/resume.ts`
- Modify: `lib/projects.ts`
- Modify: `package.json`

- [ ] **Step 1: Write the failing resume content contract**

Create `scripts/resume-content-contract.test.mjs`:

```js
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const resume = await readFile(new URL("../lib/resume.ts", import.meta.url), "utf8");
const projects = await readFile(new URL("../lib/projects.ts", import.meta.url), "utf8");

test("publishes the approved AI product manager identity", () => {
  assert.match(resume, /AI 产品经理/);
  assert.match(resume, /166-4356-2796/);
  assert.match(resume, /3188901755@qq\.com/);
  assert.match(resume, /湖北武汉/);
});

test("contains three featured experiences and one compact experience", () => {
  for (const company of ["千寻智能", "京东科技", "网易云音乐", "科大讯飞"]) {
    assert.match(resume, new RegExp(company));
  }
  assert.match(resume, /featured: false/);
  assert.match(resume, /约 5s/);
  assert.match(resume, /540 万/);
});

test("does not advertise a PDF download", () => {
  assert.doesNotMatch(resume, /pdfUrl|downloadResume|下载 PDF/);
});

test("every project defines explicit challenges", () => {
  assert.match(projects, /challenges: \[/);
  assert.match(projects, /problem:/);
  assert.match(projects, /solution:/);
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run:

```bash
node --test scripts/resume-content-contract.test.mjs
```

Expected: FAIL because `lib/resume.ts` and the `challenges` property do not exist.

- [ ] **Step 3: Add the structured resume data**

Create `lib/resume.ts` with these public interfaces and values:

```ts
export type Experience = {
  company: string;
  role: string;
  period: string;
  domain: string;
  featured: boolean;
  summary: string;
  highlights: string[];
  metrics: string[];
};

export const profile = {
  name: "马毓廷",
  role: "AI 产品经理",
  phone: "166-4356-2796",
  email: "3188901755@qq.com",
  city: "湖北武汉",
  age: "23 岁",
  gender: "男",
  height: "180 cm",
  weight: "67 kg",
  ethnicity: "汉族",
  headline: "让 AI 从能力走向真实交互",
  introduction:
    "聚焦多模态交互、语音 Agent 与 AIoT 产品，具备从需求定义、策略设计、跨团队推进到上线验证的完整实践。",
};

export const experiences: Experience[] = [
  {
    company: "千寻智能",
    role: "机器人产品实习生（多模态）",
    period: "2026.08 — 至今",
    domain: "EMBODIED AI",
    featured: true,
    summary: "负责展会问答链路优化、前台迎宾 MVP 需求设计与 WRC 现场交付。",
    highlights: [
      "基于后端日志定位 Agent/RAG 链路耗时并精简知识上下文。",
      "沉淀 8 组多模态需求与验收关键点，持续维护 PRD 与 Feature List。",
      "协调 3 台 Moz2 展机的遥操 Demo、问题排查与客户联调。",
    ],
    metrics: ["问答响应耗时：约 5s → 约 2s", "3 台展机现场交付"],
  },
  {
    company: "京东科技",
    role: "AIoT 产品实习生",
    period: "2025.03 — 2025.08",
    domain: "VOICE AGENT / AIOT",
    featured: true,
    summary: "参与炒菜机器人从 0 到 1 的语音交互与内容体验设计，并通过日志分析推动问题闭环。",
    highlights: [
      "分析 100+ 条真实交互日志，归因识别、播报、流程与内容体验问题。",
      "设计口头禅去重、菜谱内容评测与语音交互优化策略并推动研发落地。",
      "协同算法、研发和业务团队跟进版本验证，将问题沉淀为可复用验收项。",
    ],
    metrics: ["90% 体验问题一周内解决", "口头禅重复率：40% → 10%", "菜谱满意度：90%+"],
  },
  {
    company: "网易云音乐",
    role: "商业化产品实习生",
    period: "2024.06 — 2024.09",
    domain: "ECOSYSTEM GROWTH",
    featured: true,
    summary: "参与小米生态会员合作与 TV 音乐频道集成，连接内容权益、设备入口与用户增长。",
    highlights: [
      "梳理会员权益、频道入口和跨端使用链路，输出合作方案与产品需求。",
      "协同商务、研发、设计及小米生态团队推进联调、验收与上线。",
      "围绕设备覆盖与活跃目标跟踪上线表现，支持后续资源配置判断。",
    ],
    metrics: ["TV 端 MAU：540 万 → 900 万", "覆盖约 6000 万台电视设备"],
  },
  {
    company: "科大讯飞",
    role: "数据产品实习生",
    period: "2023.07 — 2023.09",
    domain: "DATA PRODUCT",
    featured: false,
    summary: "制定标注规范并设计三类平台原型，改善数据任务的分发、验收与交付流程。",
    highlights: ["整理标注规范与异常案例", "输出任务、质检与交付三类平台原型"],
    metrics: ["交付效率提升约 100%"],
  },
];

export const education = [
  { degree: "信息资源管理 硕士", school: "武汉大学 信息管理学院", period: "2025.09 — 2027.06" },
  { degree: "电子商务 本科", school: "武汉大学 信息管理学院", period: "2021.09 — 2025.06" },
];

export const capabilityGroups = [
  { title: "AI 产品方法", items: ["需求分析", "PRD", "产品评测", "跨团队推进"] },
  { title: "Agent 与模型", items: ["Prompt Engineering", "RAG", "Workflow", "LLM 评测"] },
  { title: "数据与工程", items: ["Python", "SQL", "Claude Code", "OpenAI Codex"] },
  { title: "多模态与 IoT", items: ["语音交互", "Function Calling", "设备控制", "智能硬件"] },
];

export const honors = ["GPA 3.7 / 4.0", "CET-6 535", "优秀学生干部", "互联网+校级三等奖", "国家二级运动员（三级跳远）"];
```

- [ ] **Step 4: Extend project types and add challenge/solution data**

Modify `lib/projects.ts`:

```ts
export type ProjectChallenge = {
  title: string;
  problem: string;
  solution: string;
};

export type ProjectCase = {
  id: "compliance" | "mock-interview" | "career-pathfinder" | "resume-autofill";
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
  challenges: ProjectChallenge[];
};
```

Insert the following `challenges` arrays before `tools` in the matching project objects:

```ts
challenges: [
  {
    title: "首轮真实材料未识别风险",
    problem: "26 份企业材料跑通后 risk_count 为 0，结果与业务常识不符。",
    solution: "将异常固化为失败测试，补充劳动合规种子规则后复测识别出 2 项风险。",
  },
  {
    title: "生成结论缺少证据链",
    problem: "单纯依赖模型结论无法满足 HR 与法务的复核需求。",
    solution: "通过 WeKnora RAG 返回知识片段，并写入风险依据和报告溯源字段。",
  },
],
```

```ts
// mock-interview
challenges: [
  {
    title: "知识库抽题破坏面试连续性",
    problem: "早期方案让 RAG 直接决定问题，真实试用中追问与候选人简历和回答脱节。",
    solution: "把知识库降为流程与风格证据，以简历、当前回答和面试阶段驱动 LangGraph 状态机。",
  },
  {
    title: "语音链路同时受延迟与稳定性影响",
    problem: "代理、预热、锁竞争、浏览器播放和静音会叠加放大等待时间。",
    solution: "逐层记录耗时并修复并发与播放问题，用 238 项测试保护回归。",
  },
],

// career-pathfinder
challenges: [
  {
    title: "推荐系统过早给出伪精确结论",
    problem: "基线会使用人格标签、分数和默认大厂更优等捷径掩盖证据不足。",
    solution: "改用连续维度、行为证据与置信度，并在证据不足时强制继续追问。",
  },
  {
    title: "制度事实与个人体验混为一谈",
    problem: "职业建议若不区分证据类型，用户无法判断结论能否迁移到自己。",
    solution: "建立官方制度事实与从业者体验双轨证据，并要求输出反证和可逆验证实验。",
  },
],

// resume-autofill
challenges: [
  {
    title: "同一字段在不同网申系统中实现不同",
    problem: "原生 input、React/Vue 受控组件和动态表单不能只靠赋值完成填写。",
    solution: "组合语义分类、原生 setter、事件触发与动态重扫，并对未知控件安全降级。",
  },
  {
    title: "效率提升不能牺牲投递安全",
    problem: "自动提交、云端保存资料或重复留痕都可能带来不可逆风险。",
    solution: "坚持本地存储、人工终审、零自动提交，并用 Chrome E2E 验证边界。",
  },
],
```

- [ ] **Step 5: Update the content test script and run it**

Modify `package.json`:

```json
"test:content": "node --test scripts/content-contract.test.mjs scripts/resume-content-contract.test.mjs"
```

Run:

```bash
npm run test:content
```

Expected: all content tests PASS.

- [ ] **Step 6: Commit the data contract**

```bash
git add lib/resume.ts lib/projects.ts scripts/resume-content-contract.test.mjs package.json
git commit -m "feat: add structured resume content"
```

---

### Task 2: Add base-path-safe routes and static multi-page outputs

**Files:**
- Create: `site/routes.ts`
- Create: `site/site.css`
- Create: `project-main.tsx`
- Create: `projects/compliance/index.html`
- Create: `projects/mock-interview/index.html`
- Create: `projects/career-pathfinder/index.html`
- Create: `projects/resume-autofill/index.html`
- Modify: `vite.pages.config.ts`
- Create: `scripts/pages-output.test.mjs`
- Modify: `package.json`

- [ ] **Step 1: Write the failing Pages output test**

Create `scripts/pages-output.test.mjs`:

```js
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const routes = [
  "index.html",
  "projects/compliance/index.html",
  "projects/mock-interview/index.html",
  "projects/career-pathfinder/index.html",
  "projects/resume-autofill/index.html",
];

test("build emits every public page", async () => {
  for (const route of routes) await access(new URL(`../dist-pages/${route}`, import.meta.url));
});

test("project pages use the shared project entry", async () => {
  const source = await readFile(new URL("../projects/compliance/index.html", import.meta.url), "utf8");
  assert.match(source, /data-project-id="compliance"/);
  assert.match(source, /project-main\.tsx/);
});
```

- [ ] **Step 2: Run the output test and verify it fails**

Run:

```bash
npm run build:pages && node --test scripts/pages-output.test.mjs
```

Expected: FAIL because project HTML outputs do not exist.

- [ ] **Step 3: Add route helpers**

Create `site/routes.ts`:

```ts
import type { ProjectCase } from "@/lib/projects";

export const basePath = import.meta.env.BASE_URL;
export const homeHref = (hash = "") => `${basePath}${hash}`;
export const projectHref = (id: ProjectCase["id"]) => `${basePath}projects/${id}/`;
```

Create the compile-safe initial `site/site.css`; Task 3 expands this same file into the design system:

```css
@import "tailwindcss";

body { margin: 0; }
```

- [ ] **Step 4: Add the shared project entry with a safe fallback**

Create `project-main.tsx`:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ProjectDetailPage } from "@/components/site/project-detail-page";
import { projects, type ProjectCase } from "@/lib/projects";
import "@/site/site.css";

const root = document.getElementById("root");
const id = document.body.dataset.projectId as ProjectCase["id"] | undefined;
const project = projects.find((item) => item.id === id);

if (!root) throw new Error("Missing #root element");

createRoot(root).render(
  <StrictMode>
    {project ? <ProjectDetailPage project={project} /> : <a href={import.meta.env.BASE_URL}>项目不存在，返回主页</a>}
  </StrictMode>,
);
```

Create `components/site/project-detail-page.tsx` at the same time so the entry compiles:

```tsx
import type { ProjectCase } from "@/lib/projects";

export function ProjectDetailPage({ project }: { project: ProjectCase }) {
  return <main><h1>{project.title}</h1><p>{project.subtitle}</p></main>;
}
```

- [ ] **Step 5: Add four project HTML entries**

Create `projects/compliance/index.html`:

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>用工合规智能系统｜马毓廷</title>
    <meta name="description" content="将企业制度、法规知识与 Agent 风险诊断连接成可溯源工作流。" />
    <link rel="canonical" href="https://maayut.github.io/Personal-Resume/projects/compliance/" />
    <link rel="icon" type="image/svg+xml" href="/Personal-Resume/favicon.svg" />
  </head>
  <body data-project-id="compliance">
    <div id="root"></div>
    <script type="module" src="/project-main.tsx"></script>
  </body>
</html>
```

Create `projects/mock-interview/index.html`:

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MockInterview｜马毓廷</title>
    <meta name="description" content="围绕简历与回答动态追问的中文电话模拟面试 Agent。" />
    <link rel="canonical" href="https://maayut.github.io/Personal-Resume/projects/mock-interview/" />
    <link rel="icon" type="image/svg+xml" href="/Personal-Resume/favicon.svg" />
  </head>
  <body data-project-id="mock-interview">
    <div id="root"></div>
    <script type="module" src="/project-main.tsx"></script>
  </body>
</html>
```

Create `projects/career-pathfinder/index.html`:

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Career Pathfinder｜马毓廷</title>
    <meta name="description" content="有证据、可反证、保护隐私的职业决策 Agent。" />
    <link rel="canonical" href="https://maayut.github.io/Personal-Resume/projects/career-pathfinder/" />
    <link rel="icon" type="image/svg+xml" href="/Personal-Resume/favicon.svg" />
  </head>
  <body data-project-id="career-pathfinder">
    <div id="root"></div>
    <script type="module" src="/project-main.tsx"></script>
  </body>
</html>
```

Create `projects/resume-autofill/index.html`:

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>FillResume 智能网申助手｜马毓廷</title>
    <meta name="description" content="从个人秋招重复填表痛点出发的本地自动化工具。" />
    <link rel="canonical" href="https://maayut.github.io/Personal-Resume/projects/resume-autofill/" />
    <link rel="icon" type="image/svg+xml" href="/Personal-Resume/favicon.svg" />
  </head>
  <body data-project-id="resume-autofill">
    <div id="root"></div>
    <script type="module" src="/project-main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Configure Vite multi-page inputs**

Modify `vite.pages.config.ts`:

```ts
const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  base: "/Personal-Resume/",
  css: { postcss: { plugins: [tailwindcss()] } },
  plugins: [react()],
  resolve: { alias: { "@": root } },
  build: {
    outDir: "dist-pages",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        home: fileURLToPath(new URL("index.html", import.meta.url)),
        compliance: fileURLToPath(new URL("projects/compliance/index.html", import.meta.url)),
        interview: fileURLToPath(new URL("projects/mock-interview/index.html", import.meta.url)),
        career: fileURLToPath(new URL("projects/career-pathfinder/index.html", import.meta.url)),
        autofill: fileURLToPath(new URL("projects/resume-autofill/index.html", import.meta.url)),
      },
    },
  },
});
```

- [ ] **Step 7: Add and run the Pages output script**

Modify `package.json`:

```json
"test:pages-output": "node --test scripts/pages-output.test.mjs"
```

Run:

```bash
npm run build:pages && npm run test:pages-output
```

Expected: all five HTML outputs exist and both tests PASS.

- [ ] **Step 8: Commit the multi-page skeleton**

```bash
git add site/routes.ts site/site.css project-main.tsx components/site/project-detail-page.tsx projects vite.pages.config.ts scripts/pages-output.test.mjs package.json
git commit -m "feat: add static project page routes"
```

---

### Task 3: Build the shared design system, navigation and footer

**Files:**
- Modify: `site/site.css`
- Create: `components/site/site-nav.tsx`
- Create: `components/site/section-heading.tsx`
- Create: `components/site/site-footer.tsx`
- Modify: `scripts/ui-contract.test.mjs`
- Modify: `package.json`

- [ ] **Step 1: Replace the old UI contract with a cross-page contract**

Modify `scripts/ui-contract.test.mjs` to read the shared components and CSS:

```js
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");
const [css, nav, home, project] = await Promise.all([
  read("../site/site.css"),
  read("../components/site/site-nav.tsx"),
  read("../components/site/home-page.tsx"),
  read("../components/site/project-detail-page.tsx"),
]);

test("home and project pages share the visual system", () => {
  assert.match(home, /SiteNav/);
  assert.match(project, /SiteNav/);
  assert.match(home, /SiteFooter/);
  assert.match(project, /SiteFooter/);
  for (const token of ["--ink", "--signal", "--paper", "--grid-line", "--ease-field"]) {
    assert.match(css, new RegExp(token));
  }
});

test("does not expose a PDF download", () => {
  assert.doesNotMatch(`${home}${nav}`, /下载 PDF|\.pdf/);
});

test("supports reduced motion and mobile navigation", () => {
  assert.match(css, /prefers-reduced-motion/);
  assert.match(nav, /AnimatePresence/);
  assert.match(nav, /aria-expanded/);
});
```

- [ ] **Step 2: Run the UI test and verify it fails**

Run:

```bash
npm run test:ui
```

Expected: FAIL because the new shared site files do not exist.

- [ ] **Step 3: Add `motion/react` and typecheck scripts**

Run:

```bash
npm install motion
```

Modify `package.json` scripts:

```json
"typecheck": "tsc --noEmit",
"test": "npm run test:content && npm run test:ui"
```

- [ ] **Step 4: Create the shared token and layout stylesheet**

Replace `site/site.css` with this opening token set and the shared selectors below:

```css
@import "tailwindcss";

:root {
  --paper: #f7f7f3;
  --paper-deep: #eceee9;
  --ink: #111915;
  --muted-ink: #5f6962;
  --signal: #4d6d47;
  --signal-soft: #dfe8dd;
  --grid-line: rgb(17 25 21 / 0.075);
  --project-accent: var(--signal);
  --radius-sm: 0.65rem;
  --radius-lg: 1.1rem;
  --ease-field: cubic-bezier(0.22, 1, 0.36, 1);
  --font-display: "Iowan Old Style", "Songti SC", "STSong", serif;
  --font-body: "Avenir Next", "PingFang SC", "Hiragino Sans GB", sans-serif;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; background: var(--paper); color: var(--ink); font-family: var(--font-body); }
a { color: inherit; }
button { font: inherit; }
.site-shell { min-height: 100vh; overflow: clip; }
.site-container { width: min(100% - 3rem, 78rem); margin-inline: auto; }
.section-label { font: 700 0.69rem/1.2 ui-monospace, monospace; letter-spacing: 0.15em; text-transform: uppercase; }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; scroll-behavior: auto !important; }
}
```

Append the shared navigation, heading, footer and focus styles below; page-specific selectors are added in Tasks 4–6. Do not import `app/globals.css` from the new entries.

```css
:focus-visible { outline: 2px solid var(--signal); outline-offset: 4px; }
.site-nav { position: fixed; z-index: 40; inset: 0 0 auto; display: flex; align-items: center; justify-content: space-between; min-height: 4.5rem; padding: 0 3rem; border-bottom: 1px solid var(--grid-line); background: rgb(247 247 243 / 0.82); backdrop-filter: blur(18px); }
.site-brand { font-family: var(--font-display); font-size: 1.15rem; text-decoration: none; }
.desktop-nav { display: flex; align-items: center; gap: 1.5rem; }
.desktop-nav a, .mobile-nav a { text-decoration: none; }
.menu-button { display: none; min-width: 44px; min-height: 44px; border: 1px solid var(--grid-line); background: transparent; }
.mobile-nav { position: fixed; z-index: 39; inset: 4.5rem 0 0; display: grid; align-content: center; gap: 1.2rem; padding: 3rem; background: var(--ink); color: var(--paper); }
.mobile-nav a { min-height: 44px; font: 500 clamp(1.7rem, 7vw, 3rem)/1.1 var(--font-display); }
.section-heading { display: grid; grid-template-columns: 1fr minmax(16rem, 0.7fr); gap: 2rem; align-items: end; margin-bottom: 3rem; }
.section-heading h2 { margin: 0.55rem 0 0; font: 500 clamp(2.4rem, 5vw, 5.6rem)/0.94 var(--font-display); letter-spacing: -0.045em; }
.section-heading p { margin: 0; color: var(--muted-ink); line-height: 1.7; }
.site-footer { display: grid; grid-template-columns: 1.2fr repeat(2, auto); gap: 1rem 2rem; align-items: end; padding: 5rem max(1.5rem, calc((100vw - 78rem) / 2)); background: var(--ink); color: var(--paper); }
.site-footer h2 { grid-column: 1; margin: 0.5rem 0 0; font: 500 clamp(2.4rem, 6vw, 5.5rem)/1 var(--font-display); }
.site-footer a { text-underline-offset: 0.3em; }
.site-footer p { grid-column: 1 / -1; margin: 1rem 0 0; color: rgb(247 247 243 / 0.62); }
@media (max-width: 860px) {
  .site-container { width: min(100% - 2rem, 78rem); }
  .site-nav { min-height: 4rem; padding: 0 1rem; }
  .desktop-nav { display: none; }
  .menu-button { display: inline-grid; place-items: center; }
  .mobile-nav { inset-block-start: 4rem; }
  .section-heading { grid-template-columns: 1fr; gap: 1rem; }
  .site-footer { grid-template-columns: 1fr; padding: 4rem 1rem; }
  .site-footer h2, .site-footer p { grid-column: 1; }
}
```

- [ ] **Step 5: Create shared navigation and section components**

Create `components/site/section-heading.tsx`:

```tsx
export function SectionHeading({ label, title, note }: { label: string; title: string; note?: string }) {
  return (
    <header className="section-heading">
      <div><span className="section-label">{label}</span><h2>{title}</h2></div>
      {note ? <p>{note}</p> : null}
    </header>
  );
}
```

Create `components/site/site-nav.tsx`:

```tsx
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { homeHref } from "@/site/routes";

const links = [
  ["经历", "#experience"],
  ["项目", "#projects"],
  ["教育", "#education"],
  ["关于", "#about"],
  ["联系", "#contact"],
] as const;

export function SiteNav({ projectMode = false }: { projectMode?: boolean }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  const href = (hash: string) => projectMode ? homeHref(hash) : hash;
  return (
    <header className="site-nav">
      <a className="site-brand" href={homeHref()} aria-label="马毓廷个人主页">MAYUTING / AI PM</a>
      <nav className="desktop-nav" aria-label="主导航">
        {links.map(([label, hash]) => <a key={hash} href={href(hash)}>{label}</a>)}
      </nav>
      <button className="menu-button" type="button" aria-label="打开导航" aria-expanded={open} onClick={() => setOpen((value) => !value)}>MENU</button>
      <AnimatePresence>
        {open ? (
          <motion.nav className="mobile-nav" aria-label="移动导航" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            {links.map(([label, hash]) => <a key={hash} href={href(hash)} onClick={() => setOpen(false)}>{label}</a>)}
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
```

The homepage labels are `经历 / 项目 / 教育 / 关于 / 联系`; project mode changes only their destination base, while previous/next project navigation remains in the project body.

- [ ] **Step 6: Create the shared footer**

Create `components/site/site-footer.tsx`:

```tsx
import { profile } from "@/lib/resume";

export function SiteFooter() {
  return (
    <footer id="contact" className="site-footer">
      <span className="section-label">CONTACT / WUHAN</span>
      <h2>保持联系</h2>
      <a href={`tel:${profile.phone.replaceAll("-", "")}`}>{profile.phone}</a>
      <a href={`mailto:${profile.email}`}>{profile.email}</a>
      <p>{profile.city} · {profile.age} · {profile.gender} · {profile.height} · {profile.weight} · {profile.ethnicity}</p>
    </footer>
  );
}
```

- [ ] **Step 7: Run UI tests and typecheck**

Create `components/site/home-page.tsx` as the Task 3 compile-safe shell:

```tsx
import { SiteFooter } from "@/components/site/site-footer";
import { SiteNav } from "@/components/site/site-nav";

export function HomePage() {
  return <main className="site-shell"><SiteNav /><div className="site-container" /><SiteFooter /></main>;
}
```

Replace the Task 2 `ProjectDetailPage` shell with:

```tsx
import { SiteFooter } from "@/components/site/site-footer";
import { SiteNav } from "@/components/site/site-nav";
import type { ProjectCase } from "@/lib/projects";

export function ProjectDetailPage({ project }: { project: ProjectCase }) {
  return <main className="site-shell"><SiteNav projectMode /><article className="site-container"><h1>{project.title}</h1></article><SiteFooter /></main>;
}
```

Then run:

```bash
npm run test:ui
npm run typecheck
```

Expected: both commands PASS.

- [ ] **Step 8: Commit the shared design system**

```bash
git add site components/site scripts/ui-contract.test.mjs package.json package-lock.json
git commit -m "feat: add shared resume site design system"
```

---

### Task 4: Implement the interactive video hero and approved portrait

**Files:**
- Create: `hooks/use-typewriter.ts`
- Create: `hooks/use-background-video.ts`
- Create: `components/site/interactive-hero.tsx`
- Create: `public/media/mayuting-portrait.jpg`
- Create: `public/media/hero-fallback.svg`
- Modify: `site/site.css`
- Modify: `scripts/ui-contract.test.mjs`

- [ ] **Step 1: Add failing hero interaction assertions**

Append to `scripts/ui-contract.test.mjs`:

```js
const [hero, videoHook] = await Promise.all([
  read("../components/site/interactive-hero.tsx"),
  read("../hooks/use-background-video.ts"),
]);

test("hero has video, typewriter and graceful fallbacks", () => {
  assert.match(hero, /hf_20260601_110537/);
  assert.match(hero, /hero-fallback\.svg/);
  assert.match(hero, /AI PRODUCT MANAGER · EMBODIED INTELLIGENCE/);
  assert.match(videoHook, /prefers-reduced-motion/);
  assert.match(videoHook, /innerWidth < 1024/);
  assert.match(videoHook, /Math\.max\(0/);
});
```

- [ ] **Step 2: Run the UI test and verify it fails**

Run `npm run test:ui`.

Expected: FAIL because the hero and hooks do not exist.

- [ ] **Step 3: Optimize the approved portrait**

Run:

```bash
mkdir -p public/media
sips -Z 1800 -s format jpeg -s formatOptions 84 '/Users/mayuting/Downloads/116334.JPG' --out public/media/mayuting-portrait.jpg
```

Verify:

```bash
sips -g pixelWidth -g pixelHeight public/media/mayuting-portrait.jpg
```

Expected: longest edge is at most 1800 px and the file is a readable JPEG.

- [ ] **Step 4: Create the local video fallback**

Create `public/media/hero-fallback.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" role="img" aria-label="抽象具身智能环境背景">
  <defs>
    <linearGradient id="field" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f7f7f3"/><stop offset="0.52" stop-color="#dfe8dd"/><stop offset="1" stop-color="#758a72"/></linearGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0H0V48" fill="none" stroke="#111915" stroke-opacity=".075"/></pattern>
    <radialGradient id="sensor"><stop stop-color="#f7f7f3" stop-opacity=".9"/><stop offset="1" stop-color="#4d6d47" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#field)"/>
  <rect width="1600" height="900" fill="url(#grid)"/>
  <circle cx="1210" cy="430" r="360" fill="url(#sensor)"/>
  <g fill="none" stroke="#f7f7f3" stroke-opacity=".55" stroke-width="2"><path d="M890 430a320 320 0 0 1 640 0"/><path d="M970 430a240 240 0 0 1 480 0"/></g>
</svg>
```

- [ ] **Step 5: Implement the one-shot typewriter hook**

Create `hooks/use-typewriter.ts`:

```ts
import { useEffect, useState } from "react";

export function useTypewriter(text: string, speed = 42, delay = 450) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setDisplayed(text); setDone(true); return; }
    let index = 0;
    let interval = 0;
    const start = window.setTimeout(() => {
      interval = window.setInterval(() => {
        index += 1;
        setDisplayed(text.slice(0, index));
        if (index >= text.length) { window.clearInterval(interval); setDone(true); }
      }, speed);
    }, delay);
    return () => { window.clearTimeout(start); window.clearInterval(interval); };
  }, [delay, speed, text]);
  return { displayed, done };
}
```

- [ ] **Step 6: Implement background video behavior**

Create `hooks/use-background-video.ts`:

```ts
import { useEffect, useRef, useState } from "react";

export function useBackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      video.pause();
      video.currentTime = 0;
      return;
    }
    if (window.innerWidth < 1024) {
      void video.play().catch(() => undefined);
      return;
    }
    let previousX: number | null = null;
    let targetTime = 0;
    const scrub = (event: MouseEvent) => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;
      if (previousX === null) { previousX = event.clientX; return; }
      const delta = event.clientX - previousX;
      previousX = event.clientX;
      targetTime = Math.min(video.duration, Math.max(0, targetTime + (delta / window.innerWidth) * 0.8 * video.duration));
      video.currentTime = targetTime;
    };
    window.addEventListener("mousemove", scrub, { passive: true });
    return () => window.removeEventListener("mousemove", scrub);
  }, []);
  return { videoRef, failed, markFailed: () => setFailed(true) };
}
```

- [ ] **Step 7: Build the interactive hero component**

Create `components/site/interactive-hero.tsx`:

```tsx
import { motion } from "motion/react";
import { useBackgroundVideo } from "@/hooks/use-background-video";
import { useTypewriter } from "@/hooks/use-typewriter";
import { profile } from "@/lib/resume";

export function InteractiveHero() {
  const { displayed, done } = useTypewriter(profile.headline);
  const { videoRef, failed, markFailed } = useBackgroundVideo();
  return (
    <section className={`resume-hero ${failed ? "has-video-fallback" : ""}`}>
      <video ref={videoRef} muted playsInline preload="metadata" poster={`${import.meta.env.BASE_URL}media/hero-fallback.svg`} onError={markFailed}>
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260601_110537_3a579fa0-7bbc-4d94-9d25-0e816c7840f5.mp4" type="video/mp4" />
      </video>
      <div className="hero-wash" aria-hidden="true" />
      <motion.div className="hero-content" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <span className="section-label">AI PRODUCT MANAGER · EMBODIED INTELLIGENCE</span>
        <h1>{displayed}<span className={done ? "type-cursor is-done" : "type-cursor"} aria-hidden="true" /></h1>
        <p>{profile.introduction}</p>
      </motion.div>
      <p className="scrub-hint">桌面端：左右移动，观察环境变化</p>
    </section>
  );
}
```

- [ ] **Step 8: Add hero and reduced-motion styles**

Append:

```css
.resume-hero { position: relative; min-height: 100svh; display: grid; align-items: center; overflow: hidden; padding: 8rem max(1.5rem, calc((100vw - 78rem) / 2)) 4rem; background: var(--paper) url("/Personal-Resume/media/hero-fallback.svg") center/cover; }
.resume-hero video { position: absolute; z-index: 0; inset: 0 0 0 auto; width: 68%; height: 100%; object-fit: cover; object-position: 66% center; }
.resume-hero.has-video-fallback video { display: none; }
.hero-wash { position: absolute; z-index: 1; inset: 0; background: linear-gradient(90deg, var(--paper) 0%, rgb(247 247 243 / 0.96) 37%, rgb(247 247 243 / 0.18) 72%, transparent 100%); }
.hero-content { position: relative; z-index: 2; width: min(53%, 42rem); }
.hero-content h1 { max-width: 10ch; min-height: 2.05em; margin: 1rem 0 1.5rem; font: 500 clamp(4rem, 8vw, 8.4rem)/0.88 var(--font-display); letter-spacing: -0.065em; }
.hero-content p { max-width: 34rem; color: var(--muted-ink); font-size: clamp(1rem, 1.6vw, 1.2rem); line-height: 1.8; }
.type-cursor { display: inline-block; width: 0.08em; height: 0.82em; margin-left: 0.08em; background: currentColor; animation: cursor-blink 0.8s steps(1) infinite; }
.type-cursor.is-done { animation-iteration-count: 3; opacity: 0; }
.scrub-hint { position: absolute; z-index: 2; right: 3rem; bottom: 2rem; margin: 0; padding-top: 0.65rem; border-top: 1px solid currentColor; font: 600 0.68rem/1 ui-monospace, monospace; letter-spacing: 0.12em; }
@keyframes cursor-blink { 50% { opacity: 0; } }
@media (max-width: 1023px) {
  .resume-hero { min-height: auto; grid-template-rows: auto auto; padding: 7rem 1rem 0; }
  .resume-hero video { position: relative; grid-row: 2; width: calc(100% + 2rem); height: auto; aspect-ratio: 4 / 3; margin: 3rem -1rem 0; object-position: center; }
  .hero-wash { background: linear-gradient(180deg, var(--paper) 0%, var(--paper) 49%, transparent 74%); }
  .hero-content { grid-row: 1; width: 100%; }
  .hero-content h1 { font-size: clamp(3.8rem, 18vw, 7rem); }
  .scrub-hint { display: none; }
}
```

- [ ] **Step 9: Run interaction contracts and typecheck**

Run:

```bash
npm run test:ui
npm run typecheck
```

Expected: both PASS.

- [ ] **Step 10: Commit the hero**

```bash
git add hooks components/site/interactive-hero.tsx public/media site/site.css scripts/ui-contract.test.mjs
git commit -m "feat: add embodied interactive resume hero"
```

---

### Task 5: Build the complete personal homepage

**Files:**
- Modify: `components/site/home-page.tsx`
- Modify: `pages-main.tsx`
- Modify: `index.html`
- Modify: `site/site.css`
- Modify: `scripts/ui-contract.test.mjs`

- [ ] **Step 1: Add failing homepage structure assertions**

Append:

```js
test("homepage follows the approved resume narrative", () => {
  for (const label of ["HUMAN IN THE LOOP", "FIELD EXPERIENCE", "SELECTED AGENT WORK", "EDUCATION", "CAPABILITY"]) {
    assert.match(home, new RegExp(label));
  }
  for (const anchor of ["about", "experience", "projects", "education"]) {
    assert.match(home, new RegExp(`id=[\\\"']${anchor}[\\\"']`));
  }
  assert.match(home, /SiteFooter/);
  assert.match(home, /mayuting-portrait\.jpg/);
  assert.match(home, /experiences\.map/);
  assert.match(home, /projects\.map/);
});
```

- [ ] **Step 2: Run the UI test and verify it fails**

Run `npm run test:ui`.

Expected: FAIL because the Task 3 `HomePage` shell does not yet contain the approved sections.

- [ ] **Step 3: Implement the homepage composition**

Replace `components/site/home-page.tsx` with:

```tsx
import { InteractiveHero } from "@/components/site/interactive-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteNav } from "@/components/site/site-nav";
import { capabilityGroups, education, experiences, honors, profile } from "@/lib/resume";
import { projects } from "@/lib/projects";
import { projectHref } from "@/site/routes";

export function HomePage() {
  return (
    <main className="site-shell">
      <SiteNav />
      <InteractiveHero />
      <section id="about" className="about-section">
        <div className="site-container about-grid">
          <figure className="portrait-frame"><img src={`${import.meta.env.BASE_URL}media/mayuting-portrait.jpg`} alt="马毓廷个人照片" /></figure>
          <div className="about-copy">
            <SectionHeading label="00 / HUMAN IN THE LOOP" title="把技术能力组织成可被使用的产品" />
            <p>我的实践从智能座舱数据、IoT 商业化延伸到语音 Agent 与具身机器人：先确认人在什么场景下遇到什么阻力，再定义交互策略、协作边界和上线验收。</p>
            <dl className="fact-list">
              <div><dt>EDUCATION</dt><dd>武汉大学 · 信息资源管理硕士</dd></div>
              <div><dt>LOCATION</dt><dd>{profile.city}</dd></div>
              <div><dt>DISCIPLINE</dt><dd>国家二级运动员 · 三级跳远</dd></div>
            </dl>
          </div>
        </div>
      </section>
      <section id="experience" className="experience-section">
        <div className="site-container">
          <SectionHeading label="01 / FIELD EXPERIENCE" title="从需求判断到现场交付" note="三段重点经历展开产品对象、关键行动与对应结果；早期数据产品经历以摘要保留。" />
          <div className="experience-list">
            {experiences.map((experience) => (
              <article key={experience.company} className={`experience-item ${experience.featured ? "is-featured" : "is-compact"}`}>
                <div className="experience-meta"><span>{experience.period}</span><span>{experience.domain}</span></div>
                <div className="experience-body"><h3>{experience.company}</h3><p className="experience-role">{experience.role}</p><p>{experience.summary}</p>{experience.featured ? <ul>{experience.highlights.map((item) => <li key={item}>{item}</li>)}</ul> : null}</div>
                <ul className="metric-list">{experience.metrics.map((metric) => <li key={metric}>{metric}</li>)}</ul>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section id="projects" className="projects-section">
        <div className="site-container">
          <SectionHeading label="02 / SELECTED AGENT WORK" title="我与 Agent 共同完成的产品" note="每个案例都保留问题判断、人机分工、关键转折、验证结果与诚实边界。" />
          <div className="project-card-grid">
            {projects.map((project) => <a className={`project-card project-${project.id}`} href={projectHref(project.id)} key={project.id}><span className="section-label">PROJECT / {project.index}</span><h3>{project.title}</h3><p>{project.subtitle}</p><strong>{project.metric}</strong><span className="project-link">查看完整案例 →</span></a>)}
          </div>
        </div>
      </section>
      <section id="education" className="education-section">
        <div className="site-container">
          <SectionHeading label="03 / EDUCATION & CAPABILITY" title="研究、产品与工程之间" />
          <div className="education-capability-grid">
            <div className="education-list"><h3>EDUCATION</h3>{education.map((item) => <article key={item.degree}><span>{item.period}</span><h4>{item.degree}</h4><p>{item.school}</p></article>)}</div>
            <div className="capability-list"><h3>CAPABILITY</h3>{capabilityGroups.map((group) => <article key={group.title}><h4>{group.title}</h4><p>{group.items.join(" · ")}</p></article>)}</div>
            <div className="honor-list"><h3>HONORS</h3><ul>{honors.map((honor) => <li key={honor}>{honor}</li>)}</ul></div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
```

- [ ] **Step 4: Replace the static entry**

Modify `pages-main.tsx`:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HomePage } from "@/components/site/home-page";
import "@/site/site.css";

const root = document.getElementById("root");
if (!root) throw new Error("Missing #root element");
createRoot(root).render(<StrictMode><HomePage /></StrictMode>);
```

- [ ] **Step 5: Update homepage metadata**

Set these entries inside `index.html` `<head>` and remove any PDF metadata or legacy casebook description:

```html
<title>马毓廷｜AI 产品经理</title>
<meta name="description" content="马毓廷的 AI 产品经理个人主页：多模态交互、语音 Agent、AIoT 实习实践与四个 Agent 项目案例。" />
<link rel="canonical" href="https://maayut.github.io/Personal-Resume/" />
<meta property="og:title" content="马毓廷｜AI 产品经理" />
<meta property="og:description" content="从需求判断、交互策略到现场交付的 AI 产品实践。" />
<meta property="og:image" content="https://maayut.github.io/Personal-Resume/og.png" />
```

- [ ] **Step 6: Add complete responsive homepage styles**

Append:

```css
.about-section { padding: 8rem 0; background: var(--ink); color: var(--paper); }
.about-grid { display: grid; grid-template-columns: minmax(18rem, 0.8fr) 1.2fr; gap: clamp(3rem, 8vw, 8rem); align-items: center; }
.portrait-frame { margin: 0; aspect-ratio: 4 / 5; overflow: hidden; border-radius: var(--radius-lg); }
.portrait-frame img { width: 100%; height: 100%; object-fit: cover; object-position: 52% 58%; }
.about-copy > p { max-width: 42rem; color: rgb(247 247 243 / 0.72); font-size: 1.08rem; line-height: 1.9; }
.fact-list { display: grid; gap: 0; margin-top: 3rem; }
.fact-list div { display: grid; grid-template-columns: 9rem 1fr; gap: 1rem; padding: 1rem 0; border-top: 1px solid rgb(247 247 243 / 0.16); }
.fact-list dt { font: 700 0.65rem/1.4 ui-monospace, monospace; letter-spacing: 0.12em; }
.fact-list dd { margin: 0; }
.experience-section, .projects-section, .education-section { padding: 8rem 0; }
.experience-list { border-top: 1px solid var(--grid-line); }
.experience-item { display: grid; grid-template-columns: 0.72fr 1.5fr 0.78fr; gap: 2.5rem; padding: 3rem 0; border-bottom: 1px solid var(--grid-line); }
.experience-item.is-compact { padding-block: 1.8rem; }
.experience-meta { display: grid; align-content: start; gap: 0.5rem; color: var(--muted-ink); font: 700 0.68rem/1.4 ui-monospace, monospace; letter-spacing: 0.08em; }
.experience-body h3 { margin: 0; font: 500 clamp(2rem, 4vw, 4rem)/1 var(--font-display); }
.experience-role { color: var(--signal); font-weight: 700; }
.experience-body p, .experience-body li { color: var(--muted-ink); line-height: 1.75; }
.experience-body ul { padding-left: 1.2rem; }
.metric-list { display: grid; align-content: start; gap: 0.65rem; margin: 0; padding: 0; list-style: none; }
.metric-list li { padding: 0.8rem 1rem; border-radius: var(--radius-sm); background: var(--signal-soft); font-size: 0.9rem; font-weight: 700; }
.projects-section { background: var(--paper-deep); }
.project-card-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1px; background: var(--grid-line); border: 1px solid var(--grid-line); }
.project-card { min-height: 25rem; display: flex; flex-direction: column; padding: clamp(1.5rem, 4vw, 3rem); background: var(--paper); text-decoration: none; transition: transform 0.4s var(--ease-field), background 0.4s var(--ease-field); }
.project-card:hover { z-index: 1; transform: translateY(-0.45rem); background: white; }
.project-card h3 { margin: 3rem 0 1rem; font: 500 clamp(2rem, 4vw, 4rem)/0.95 var(--font-display); }
.project-card p { max-width: 32rem; color: var(--muted-ink); line-height: 1.7; }
.project-card strong { margin-top: auto; padding-top: 2rem; }
.project-link { margin-top: 1.25rem; color: var(--signal); }
.education-capability-grid { display: grid; grid-template-columns: 1fr 1.15fr 0.85fr; gap: 1px; background: var(--grid-line); border: 1px solid var(--grid-line); }
.education-capability-grid > div { padding: 2rem; background: var(--paper); }
.education-capability-grid h3 { font: 700 0.7rem/1.2 ui-monospace, monospace; letter-spacing: 0.14em; }
.education-capability-grid article, .honor-list li { padding: 1rem 0; border-top: 1px solid var(--grid-line); }
.education-capability-grid h4, .education-capability-grid p { margin: 0.35rem 0; }
.education-capability-grid span, .education-capability-grid p { color: var(--muted-ink); }
.honor-list ul { margin: 0; padding: 0; list-style: none; }
@media (max-width: 860px) {
  .about-section, .experience-section, .projects-section, .education-section { padding: 5rem 0; }
  .about-grid, .experience-item, .education-capability-grid { grid-template-columns: 1fr; }
  .portrait-frame { max-height: 70vh; }
  .project-card-grid { grid-template-columns: 1fr; }
  .project-card { min-height: 20rem; }
  .project-card, .site-nav a, .site-footer a { min-height: 44px; }
}
```

- [ ] **Step 7: Run homepage contracts, content tests and typecheck**

```bash
npm run test
npm run typecheck
npm run build:pages
```

Expected: all commands PASS and homepage output includes the optimized portrait.

- [ ] **Step 8: Commit the homepage**

```bash
git add components/site/home-page.tsx pages-main.tsx index.html site/site.css scripts/ui-contract.test.mjs
git commit -m "feat: build AI product manager resume homepage"
```

---

### Task 6: Build one consistent project detail template

**Files:**
- Modify: `components/site/project-detail-page.tsx`
- Modify: `project-main.tsx`
- Modify: `site/site.css`
- Modify: `scripts/ui-contract.test.mjs`

- [ ] **Step 1: Add failing project template assertions**

Append:

```js
test("project pages expose evidence without visual drift", () => {
  for (const text of ["SITUATION", "TASK", "ACTION", "RESULT", "我负责", "AI Agent 负责", "核心挑战", "工具与模型", "诚实边界"]) {
    assert.match(project, new RegExp(text));
  }
  assert.match(project, /project\.challenges\.map/);
  assert.match(project, /projectHref/);
  assert.match(project, /--project-accent/);
});
```

- [ ] **Step 2: Run UI tests and verify failure**

Run `npm run test:ui`.

Expected: FAIL because the Task 3 project shell lacks the evidence sections.

- [ ] **Step 3: Implement project accent and neighbors**

Inside `components/site/project-detail-page.tsx`, define:

```ts
const accents: Record<ProjectCase["id"], string> = {
  compliance: "#137b75",
  "mock-interview": "#c86b32",
  "career-pathfinder": "#7456a6",
  "resume-autofill": "#2d5ea8",
};

function getNeighbors(project: ProjectCase) {
  const index = projects.findIndex((item) => item.id === project.id);
  return {
    previous: projects[(index - 1 + projects.length) % projects.length],
    next: projects[(index + 1) % projects.length],
  };
}
```

- [ ] **Step 4: Implement the shared project page**

Replace the component body with the following and keep `accents`/`getNeighbors` directly above it:

```tsx
import type { CSSProperties } from "react";
import { SectionHeading } from "@/components/site/section-heading";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteNav } from "@/components/site/site-nav";
import { projects, type ProjectCase } from "@/lib/projects";
import { projectHref } from "@/site/routes";

export function ProjectDetailPage({ project }: { project: ProjectCase }) {
  const { previous, next } = getNeighbors(project);
  return (
    <main className="site-shell project-shell" style={{ "--project-accent": accents[project.id] } as CSSProperties}>
      <SiteNav projectMode />
      <article aria-labelledby="project-title">
        <header className="project-hero site-container">
          <span className="section-label">PROJECT / {project.index}</span>
          <p>{project.audience}</p>
          <h1 id="project-title">{project.title}</h1>
          <p className="project-subtitle">{project.subtitle}</p>
          <strong>{project.metric}</strong>
          <ul>{project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
        </header>
        <section className="project-overview"><div className="site-container"><SectionHeading label="00 / OVERVIEW" title="为什么做，以及做到哪里" /><div className="overview-grid"><p>{project.situation}</p><p>{project.task}</p><p>{project.result[0]}</p></div></div></section>
        <section className="project-evidence site-container" aria-labelledby="star-title">
          <SectionHeading label="01 / STAR" title="从问题判断到可验证结果" />
          <div className="star-grid" id="star-title">
            <article><span>S / SITUATION</span><p>{project.situation}</p></article>
            <article><span>T / TASK</span><p>{project.task}</p></article>
            <article><span>A / ACTION</span><ul>{project.actions.map((item) => <li key={item}>{item}</li>)}</ul></article>
            <article><span>R / RESULT</span><ul>{project.result.map((item) => <li key={item}>{item}</li>)}</ul></article>
          </div>
        </section>
        <section className="collaboration-section"><div className="site-container"><SectionHeading label="02 / HUMAN × AGENT" title="我与 AI 的分工" /><div className="collaboration-grid"><article><h3>我负责</h3><ul>{project.humanRole.map((item) => <li key={item}>{item}</li>)}</ul></article><article><h3>AI Agent 负责</h3><ul>{project.agentRole.map((item) => <li key={item}>{item}</li>)}</ul></article></div><p className="collaboration-loop">{project.collaborationLoop}</p></div></section>
        <section className="challenge-section site-container"><SectionHeading label="03 / DECISIONS" title="核心挑战与解决方案" /><div className="challenge-list">{project.challenges.map((challenge) => <article key={challenge.title}><h3>{challenge.title}</h3><div><span>PROBLEM</span><p>{challenge.problem}</p></div><div><span>SOLUTION</span><p>{challenge.solution}</p></div></article>)}</div></section>
        <section className="tool-section"><div className="site-container"><SectionHeading label="04 / TOOLING" title="工具与模型为什么这样选" /><div className="tool-grid">{project.tools.map((tool) => <article key={tool.name}><h3>{tool.name}</h3><p>{tool.reason}</p></article>)}</div></div></section>
        <aside className="boundary-note site-container"><span className="section-label">05 / EVIDENCE BOUNDARY</span><h2>诚实边界</h2><p>{project.boundary}</p></aside>
        <nav className="project-pagination site-container" aria-label="项目翻页"><a href={projectHref(previous.id)}>← {previous.title}</a><a href={projectHref(next.id)}>{next.title} →</a></nav>
      </article>
      <SiteFooter />
    </main>
  );
}
```

- [ ] **Step 5: Add project page styles using shared tokens**

Append:

```css
.project-shell { --signal: var(--project-accent); }
.project-hero { min-height: 78svh; display: grid; align-content: end; padding-top: 9rem; padding-bottom: 5rem; border-bottom: 1px solid var(--grid-line); }
.project-hero > p:first-of-type { justify-self: end; margin: 0; color: var(--muted-ink); }
.project-hero h1 { max-width: 12ch; margin: 1rem 0; font: 500 clamp(4rem, 10vw, 9rem)/0.86 var(--font-display); letter-spacing: -0.06em; }
.project-subtitle { max-width: 48rem; font-size: clamp(1.1rem, 2vw, 1.45rem); line-height: 1.6; }
.project-hero strong { color: var(--project-accent); }
.project-hero ul { display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 2rem 0 0; padding: 0; list-style: none; }
.project-hero li { padding: 0.5rem 0.75rem; border: 1px solid var(--grid-line); border-radius: 999px; }
.project-overview, .collaboration-section, .tool-section { padding: 7rem 0; background: var(--paper-deep); }
.project-evidence, .challenge-section { padding-block: 7rem; }
.overview-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
.overview-grid p { margin: 0; padding-top: 1rem; border-top: 2px solid var(--project-accent); line-height: 1.8; }
.star-grid, .collaboration-grid, .tool-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1px; background: var(--grid-line); border: 1px solid var(--grid-line); }
.star-grid article, .collaboration-grid article, .tool-grid article { padding: 2rem; background: var(--paper); }
.star-grid span, .challenge-list span { color: var(--project-accent); font: 700 0.68rem/1.4 ui-monospace, monospace; letter-spacing: 0.12em; }
.star-grid p, .star-grid li, .collaboration-grid li, .tool-grid p { color: var(--muted-ink); line-height: 1.75; }
.collaboration-loop { margin: 2rem 0 0; padding: 1.5rem; border-left: 3px solid var(--project-accent); background: var(--paper); line-height: 1.8; }
.challenge-list { display: grid; gap: 1px; background: var(--grid-line); border: 1px solid var(--grid-line); }
.challenge-list > article { display: grid; grid-template-columns: 0.8fr 1fr 1fr; gap: 2rem; padding: 2rem; background: var(--paper); }
.challenge-list h3 { margin: 0; font: 500 1.8rem/1.05 var(--font-display); }
.challenge-list p { color: var(--muted-ink); line-height: 1.7; }
.tool-grid { grid-template-columns: repeat(3, 1fr); }
.boundary-note { margin-block: 7rem; padding-block: 2rem; border-block: 1px solid var(--project-accent); }
.boundary-note h2 { margin: 0.75rem 0; font: 500 2.5rem/1 var(--font-display); }
.boundary-note p { max-width: 55rem; color: var(--muted-ink); line-height: 1.8; }
.project-pagination { display: grid; grid-template-columns: 1fr 1fr; margin-bottom: 7rem; border: 1px solid var(--grid-line); }
.project-pagination a { min-height: 7rem; display: flex; align-items: center; padding: 1.5rem; text-decoration: none; }
.project-pagination a:last-child { justify-content: flex-end; border-left: 1px solid var(--grid-line); }
.project-pagination a:hover { color: var(--project-accent); }
@media (max-width: 860px) {
  .project-hero { min-height: 66svh; padding-top: 7rem; }
  .project-overview, .collaboration-section, .tool-section, .project-evidence, .challenge-section { padding-block: 5rem; }
  .overview-grid, .star-grid, .collaboration-grid, .tool-grid, .challenge-list > article { grid-template-columns: 1fr; }
  .project-pagination { grid-template-columns: 1fr; }
  .project-pagination a { min-height: 5rem; }
  .project-pagination a:last-child { justify-content: flex-start; border-left: 0; border-top: 1px solid var(--grid-line); }
}
```

- [ ] **Step 6: Run all tests, typecheck and build**

```bash
npm run test
npm run typecheck
npm run build:pages
npm run test:pages-output
```

Expected: all commands PASS and every project output references shared CSS/JS assets.

- [ ] **Step 7: Commit project pages**

```bash
git add components/site/project-detail-page.tsx project-main.tsx site/site.css scripts/ui-contract.test.mjs
git commit -m "feat: build consistent Agent project pages"
```

---

### Task 7: Accessibility, copy quality and responsive visual verification

**Files:**
- Modify: `components/site/*.tsx`
- Modify: `site/site.css`
- Modify: `scripts/ui-contract.test.mjs`

- [ ] **Step 1: Add final accessibility and copy assertions**

Append:

```js
test("public interactions are accessible", () => {
  assert.match(nav, /aria-label/);
  assert.match(nav, /aria-expanded/);
  assert.match(home, /alt="马毓廷/);
  assert.match(project, /aria-labelledby/);
  assert.match(css, /:focus-visible/);
});

test("supporting copy stays concrete", () => {
  assert.doesNotMatch(home, /真实日志、场景约束和用户反馈/);
  assert.match(home, /先确认人在什么场景下遇到什么阻力/);
});
```

- [ ] **Step 2: Run the accessibility and copy contracts**

Run `npm run test:ui`.

Expected: PASS because labels, alt text, `aria-labelledby` relationships, focus rules and concrete copy were implemented in Tasks 3–6.

- [ ] **Step 3: Start a local production preview**

```bash
npm run build:pages
npx vite preview --config vite.pages.config.ts --host 127.0.0.1 --port 4173
```

Verify these URLs:

```text
http://127.0.0.1:4173/Personal-Resume/
http://127.0.0.1:4173/Personal-Resume/projects/compliance/
http://127.0.0.1:4173/Personal-Resume/projects/mock-interview/
http://127.0.0.1:4173/Personal-Resume/projects/career-pathfinder/
http://127.0.0.1:4173/Personal-Resume/projects/resume-autofill/
```

- [ ] **Step 4: Inspect desktop, tablet and mobile layouts**

Use browser screenshots at 1440×1000, 1024×768 and 390×844. Confirm:

- hero text remains readable over video/fallback;
- video scrubbing is desktop-only;
- mobile menu opens, remains keyboard-operable and closes on selection/Escape;
- portrait crop preserves the face;
- experience metrics remain attached to the correct company;
- all four project cards and all project evidence sections fit without horizontal overflow;
- homepage and project pages visibly share navigation, typography, grid and footer.

- [ ] **Step 5: Run the complete local verification suite**

```bash
npm run test
npm run typecheck
npm run build:pages
npm run test:pages-output
git diff --check
```

Expected: every command exits 0.

- [ ] **Step 6: Record visual verification evidence**

Save the 1440 px homepage, 390 px homepage and 390 px compliance-page screenshots under `tmp/visual-checks/` (ignored by Git), and write the verified viewport list into the execution log. Source changes are not expected in this verification-only task; if a visual defect appears, return to the owning task, add a failing contract where practical, patch it, rerun Step 5 and commit that focused fix.

---

### Task 8: Publish and verify GitHub Pages

**Files:**
- No source files expected after Task 7.
- Generated deployment target: `gh-pages` branch.

- [ ] **Step 1: Verify the source branch before publication**

```bash
git status --short --branch
git log -1 --oneline
npm run test
npm run typecheck
npm run build:pages
npm run test:pages-output
```

Expected: clean `main`, all tests PASS, typecheck PASS, build PASS.

- [ ] **Step 2: Push source commits**

```bash
git push origin main
```

- [ ] **Step 3: Replace the static deployment branch with the verified build**

Use an explicit temporary worktree:

```bash
pages_stage=$(mktemp -d /tmp/personal-resume-pages.XXXXXX)
case "$pages_stage" in /tmp/personal-resume-pages.*) ;; *) echo "Unsafe staging path: $pages_stage" >&2; exit 1 ;; esac
git worktree add -B gh-pages "$pages_stage" origin/gh-pages
find "$pages_stage" -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
cp -R dist-pages/. "$pages_stage"/
git -C "$pages_stage" add -A
git -C "$pages_stage" commit -m "deploy: publish personal resume site"
git -C "$pages_stage" push origin gh-pages
git worktree remove "$pages_stage"
```

The `case` guard must succeed before the `find` command; otherwise the deployment stops without deleting anything.

- [ ] **Step 4: Wait for Pages deployment**

```bash
gh run list --repo Maayut/Personal-Resume --branch gh-pages --limit 1
pages_run_id=$(gh run list --repo Maayut/Personal-Resume --branch gh-pages --limit 1 --json databaseId --jq '.[0].databaseId')
test -n "$pages_run_id"
gh run watch "$pages_run_id" --repo Maayut/Personal-Resume --exit-status
```

Expected: `pages build and deployment` concludes successfully.

- [ ] **Step 5: Verify every public route and asset**

```bash
for path in \
  '' \
  'projects/compliance/' \
  'projects/mock-interview/' \
  'projects/career-pathfinder/' \
  'projects/resume-autofill/'; do
  curl -fsS -o /dev/null "https://maayut.github.io/Personal-Resume/$path"
done
curl -fsS -o /dev/null "https://maayut.github.io/Personal-Resume/media/mayuting-portrait.jpg"
curl -fsS -o /dev/null "https://maayut.github.io/Personal-Resume/media/hero-fallback.svg"
```

Expected: every request exits 0 with HTTP 200.

- [ ] **Step 6: Open the final homepage and report evidence**

Open `https://maayut.github.io/Personal-Resume/` in the Codex browser. Report the deployed source commit, Pages run conclusion, passing test counts and the five verified public URLs. Do not claim the remote video is locally controlled; report its fallback behavior separately.

---

## Final acceptance checklist

- [ ] Personal identity, selected resume facts and approved public contact details are correct.
- [ ] No PDF is copied, linked or offered for download.
- [ ] Three internships are expanded and iFlytek is compact.
- [ ] Metrics appear only beside their corresponding experience.
- [ ] English micro-labels remain; Chinese supporting copy is concrete.
- [ ] Homepage uses interactive video and the approved portrait in separate sections.
- [ ] Four project cards link to four shareable static project URLs.
- [ ] All project pages use the shared design system and evidence template.
- [ ] Video failure and reduced-motion states keep the site usable.
- [ ] Desktop, tablet and mobile layouts have been visually inspected.
- [ ] Tests, typecheck, static build and Pages output contracts pass.
- [ ] GitHub Pages routes and local assets return HTTP 200.
