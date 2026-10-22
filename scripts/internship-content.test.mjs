import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

function literalValue(node) {
  if (ts.isStringLiteral(node)) return node.text;
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(literalValue);
  if (ts.isObjectLiteralExpression(node)) {
    return Object.fromEntries(
      node.properties.map((property) => {
        assert.ok(ts.isPropertyAssignment(property));
        return [property.name.text, literalValue(property.initializer)];
      }),
    );
  }
  throw new Error(`Unexpected non-literal content: ${node.getText()}`);
}

async function readContent(path, name) {
  const source = await readFile(new URL(path, import.meta.url), 'utf8');
  const ast = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true);
  for (const statement of ast.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (declaration.name.getText(ast) === name) {
        return literalValue(declaration.initializer);
      }
    }
  }
  throw new Error(`Missing content collection: ${name}`);
}

const [internships, experiences] = await Promise.all([
  readContent('../lib/internships.ts', 'internships'),
  readContent('../lib/resume.ts', 'experiences'),
]);

test('keeps the latest latency and ASR figures in their correct internship', () => {
  const qianxun = internships.find((item) => item.id === 'qianxun');
  const jd = internships.find((item) => item.id === 'jd');
  assert.match(JSON.stringify(qianxun), /2\.5s → 1\.6s/);
  assert.match(JSON.stringify(qianxun), /5s → 2\.5s/);
  assert.match(JSON.stringify(jd), /92% → 95%/);
  assert.match(JSON.stringify(jd), /200 道/);

  for (const id of ['qianxun', 'jd']) {
    const homepage = experiences.find((item) => item.detailId === id);
    const detail = internships.find((item) => item.id === id);
    const figures =
      id === 'qianxun' ? ['2.5s → 1.6s', '5s → 2.5s'] : ['92% → 95%'];
    for (const figure of figures) {
      assert.ok(JSON.stringify(homepage).includes(figure));
      assert.ok(JSON.stringify(detail).includes(figure));
    }
  }
});

test('does not reintroduce superseded achievements absent from the latest resume', () => {
  const content = JSON.stringify([internships, experiences]);
  assert.doesNotMatch(content, /5s → (?:约 )?2s|8 组|3 台|7 模块/);
  assert.doesNotMatch(content, /90%.*?一周|40% → 10%|60% → 90%|↓ 50%|下降 50%/);
  assert.doesNotMatch(content, /540 万|900 万|6000 万|效率提升约 100%/);
  assert.doesNotMatch(content, /双端离线队列|设备绑定复用|银河通用|华为客户/);
});

test('states perception distances as stage targets rather than measured results', () => {
  const story = internships
    .find((item) => item.id === 'qianxun')
    .stories.find((item) => item.id === 'perception');
  const content = JSON.stringify(story);
  for (const distance of ['1.5m', '2m', '3m'])
    assert.ok(content.includes(distance));
  assert.match(content, /阶段指标/);
  assert.match(story.result, /并非实测达标结果/);
});

test('does not present the future internship end date as already completed', () => {
  const experience = experiences.find((item) => item.detailId === 'qianxun');
  assert.equal(experience.period, '2026.08 — 2026.11（预计）');
});
