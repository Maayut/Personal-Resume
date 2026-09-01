import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const publicSourceFiles = [
  "../app/layout.tsx",
  "../app/page.tsx",
  "../components/project-case.tsx",
  "../components/motion-enhancer.tsx",
  "../components/ui/card.tsx",
  "../lib/projects.ts",
  "../lib/resume.ts",
];

const countMatches = (source, pattern) => source.match(pattern)?.length ?? 0;

const challengeCounts = (source) => ({
  blocks: countMatches(source, /^\s{4}challenges: \[$/gm),
  titles: countMatches(source, /^\s{8}title:/gm),
  problems: countMatches(source, /^\s{8}problem:/gm),
  solutions: countMatches(source, /^\s{8}solution:/gm),
});

const expectedChallengeCounts = {
  blocks: 4,
  titles: 8,
  problems: 8,
  solutions: 8,
};

const assertChallengeCounts = (source) =>
  assert.deepEqual(challengeCounts(source), expectedChallengeCounts);

test("locks the approved resume profile and experience facts", async () => {
  const source = await readFile(new URL("../lib/resume.ts", import.meta.url), "utf8");

  for (const fact of [
    "马毓廷",
    "AI 产品经理",
    "166-4356-2796",
    "3188901755@qq.com",
    "湖北武汉",
    "千寻智能",
    "京东科技",
    "网易云音乐",
    "科大讯飞",
    "featured: false",
    "约 5s",
    "540 万",
  ]) {
    assert.match(source, new RegExp(fact));
  }

  for (const forbidden of ["pdfUrl", "downloadResume", "下载 PDF"]) {
    assert.doesNotMatch(source, new RegExp(forbidden));
  }
});

test("locks the approved project challenge structure", async () => {
  const source = await readFile(new URL("../lib/projects.ts", import.meta.url), "utf8");

  assertChallengeCounts(source);

  for (const id of [
    "compliance",
    "mock-interview",
    "career-pathfinder",
    "resume-autofill",
  ]) {
    assert.match(source, new RegExp(`^    id: "${id}",$`, "m"));
  }
});

test("challenge count assertions catch a reduced inline source fixture", () => {
  const completeFixture = Array.from({ length: 4 }, (_, index) => {
    return [
      "  {",
      `    id: "fixture-${index}",`,
      "    challenges: [",
      "      {",
      '        title: "first",',
      '        problem: "first problem",',
      '        solution: "first solution",',
      "      },",
      "      {",
      '        title: "second",',
      '        problem: "second problem",',
      '        solution: "second solution",',
      "      },",
      "    ],",
      "  },",
    ].join("\n");
  }).join("\n");

  assertChallengeCounts(completeFixture);
  const reducedFixture = completeFixture.replace('        solution: "second solution",', "");
  assert.throws(() => assertChallengeCounts(reducedFixture));
});

test("current public entry/component TypeScript sources and resume data contain no PDF download surface", async () => {
  const forbiddenPdfPattern = /\.pdf\b|下载 PDF|pdfUrl|downloadResume/i;
  const sources = await Promise.all(
    publicSourceFiles.map(async (path) => [
      path,
      await readFile(new URL(path, import.meta.url), "utf8"),
    ]),
  );

  for (const [path, source] of sources) {
    assert.doesNotMatch(source, forbiddenPdfPattern, path);
  }
});
