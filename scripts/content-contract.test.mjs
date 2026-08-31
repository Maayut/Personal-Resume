import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("../lib/projects.ts", import.meta.url), "utf8");

test("contains exactly the four approved projects", () => {
  for (const name of [
    "用工合规智能系统",
    "MockInterview",
    "Career Pathfinder",
    "FillResume｜CVMax 网申助手复刻",
  ]) {
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
  ]) {
    assert.equal(source.match(new RegExp(`^    ${field}`, "gm"))?.length, 4, field);
  }
  assert.doesNotMatch(source, /resumeCopy:/);
});

test("preserves evidence boundaries", () => {
  assert.match(source, /未确认 WeKnora 底层具体 LLM/);
  assert.match(source, /238 项测试通过/);
  assert.match(source, /不等同于 95% 的统计准确率/);
  assert.match(source, /42\/42 单元测试/);
  assert.match(source, /clean-room/);
  assert.match(source, /不自动提交/);
  assert.match(source, /Chrome E2E/);
});
