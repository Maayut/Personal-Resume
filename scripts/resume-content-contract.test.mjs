import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("locks the approved resume profile and experience facts", async () => {
  const source = await readFile(new URL("../lib/resume.ts", import.meta.url), "utf8");

  for (const fact of [
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

  assert.match(source, /challenges: \[/);
  assert.match(source, /problem:/);
  assert.match(source, /solution:/);
});
