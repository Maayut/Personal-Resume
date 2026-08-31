# Public Four-Project Showcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a refined, animated, public portfolio containing four evidence-backed AI Agent projects and no resume-copy section.

**Architecture:** Keep the existing vinext single-page application and its typed project data. Add the intelligent application-assistant case to the shared data model, remove the resume-copy feature, and use one server-rendered progressive-enhancement component for motion so the page remains readable without JavaScript and avoids React hydration instability.

**Tech Stack:** React 19, TypeScript, vinext, Tailwind CSS, CSS animations, browser IntersectionObserver, OpenAI Sites.

---

### Task 1: Lock the four-project content contract

**Files:**
- Modify: `scripts/content-contract.test.mjs`
- Modify: `lib/projects.ts`

- [ ] Change the content test to require exactly four project objects and the title `FillResume｜智能网申助手`.
- [ ] Require four occurrences of Situation, Task, Action, Result, human role, Agent role, tools and boundary fields; remove the `resumeCopy` requirement.
- [ ] Add assertions for `42/42 单元测试`, `个人秋招`, `不自动提交` and `Chrome E2E`.
- [ ] Run `npm run test:content` and confirm it fails because the fourth project is missing.
- [ ] Extend the project ID union with `resume-autofill`, remove `resumeCopy`, and add the evidence-bounded intelligent application-assistant project object.
- [ ] Run `npm run test:content` and confirm all content tests pass.

### Task 2: Remove the resume-copy surface and render four cases

**Files:**
- Modify: `scripts/ui-contract.test.mjs`
- Modify: `app/page.tsx`
- Modify: `components/project-case.tsx`
- Delete: `components/showcase-actions.tsx`

- [ ] Add UI assertions that the page has `04`, says `四个项目`, renders all four project cases, and contains no `ShowcaseActions`, `可直接放进简历`, copy action or print action.
- [ ] Run `npm run test:ui` and confirm the new assertions fail against the existing three-project page.
- [ ] Remove the resume section and action component import, update the hero/index copy and four-card grid, and add the fourth accent mapping.
- [ ] Delete the obsolete action component.
- [ ] Run `npm run test:ui` and confirm the structural assertions pass.

### Task 3: Build the editorial evidence-dossier motion system

**Files:**
- Create: `components/motion-enhancer.tsx`
- Modify: `app/page.tsx`
- Modify: `components/project-case.tsx`
- Modify: `app/globals.css`
- Modify: `scripts/ui-contract.test.mjs`

- [ ] Add UI assertions for a scroll-progress element, reveal markers, a motion enhancer, project spotlight variables and a `prefers-reduced-motion` fallback.
- [ ] Run `npm run test:ui` and confirm the motion assertions fail.
- [ ] Add server-rendered progressive enhancement that marks motion-ready state, reveals observed sections, updates scroll progress and card pointer coordinates.
- [ ] Add `data-reveal` and spotlight hooks to the page and project components.
- [ ] Refine tokens, typography, background texture, asymmetrical spacing, cards, responsive layouts, staggered entrance and hover states in CSS.
- [ ] Ensure base styles remain visible without JavaScript and reduced-motion CSS disables transitions and transforms.
- [ ] Run `npm run test:ui` and confirm all UI tests pass.

### Task 4: Verify and publish publicly

**Files:**
- Verify: `app/**`, `components/**`, `lib/**`, `public/**`
- Commit: all requested changes

- [ ] Run `npm run test:content`, `npm run test:ui`, `npm run build`, and `git diff --check`; require zero failures.
- [ ] Start the local server, request `/`, modify the progressive-enhancement component timestamp, request `/` again, and require HTTP 200 without runtime warnings.
- [ ] Commit the exact validated source and push `main` to GitHub.
- [ ] Package the validated build and push the same source revision to the Sites repository.
- [ ] Change the existing Site access mode to `public` as explicitly requested by the user.
- [ ] Save and publicly deploy the new Sites version, poll to `succeeded`, then open the public URL in the existing browser tab.
