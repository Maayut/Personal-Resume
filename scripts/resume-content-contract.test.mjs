import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const publicSourceFiles = [
  "../app/layout.tsx",
  "../app/page.tsx",
  "../components/project-case.tsx",
  "../components/motion-enhancer.tsx",
  "../components/ui/card.tsx",
  "../lib/projects.ts",
  "../lib/resume.ts",
];

const requiredProjectIds = [
  "compliance",
  "mock-interview",
  "career-pathfinder",
  "resume-autofill",
];
const requiredChallengeFields = ["problem", "solution", "title"];

function findProjectsArray(source) {
  const sourceFile = ts.createSourceFile(
    "projects.ts",
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  let projectsArray;

  function visit(node) {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === "projects" &&
      node.initializer &&
      ts.isArrayLiteralExpression(node.initializer)
    ) {
      projectsArray = { sourceFile, initializer: node.initializer };
      return;
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  assert.ok(projectsArray, "projects must be initialized with an array");
  return projectsArray;
}

function propertyName(property) {
  if (!property.name) return undefined;
  if (
    ts.isIdentifier(property.name) ||
    ts.isStringLiteral(property.name) ||
    ts.isNumericLiteral(property.name)
  ) {
    return property.name.text;
  }
  return undefined;
}

function namedProperties(object, name, context) {
  const matches = object.properties.filter(
    (property) => propertyName(property) === name,
  );
  assert.equal(matches.length, 1, `${context} must have exactly one ${name}`);
  return matches[0];
}

function parseProjectChallenges(source) {
  const { sourceFile, initializer } = findProjectsArray(source);
  assert.equal(
    initializer.elements.length,
    requiredProjectIds.length,
    "projects must contain exactly four objects",
  );

  const projects = initializer.elements.map((element, projectIndex) => {
    const context = `project ${projectIndex + 1}`;
    assert.ok(ts.isObjectLiteralExpression(element), `${context} must be an object`);

    const idProperty = namedProperties(element, "id", context);
    assert.ok(ts.isPropertyAssignment(idProperty), `${context}.id must be assigned`);
    assert.ok(
      ts.isStringLiteral(idProperty.initializer),
      `${context}.id must be a string literal`,
    );

    const challengesProperty = namedProperties(element, "challenges", context);
    assert.ok(
      ts.isPropertyAssignment(challengesProperty),
      `${context}.challenges must be assigned`,
    );
    assert.ok(
      ts.isArrayLiteralExpression(challengesProperty.initializer),
      `${context}.challenges must be an array`,
    );
    assert.equal(
      challengesProperty.initializer.elements.length,
      2,
      `${context}.challenges must contain exactly two records`,
    );

    challengesProperty.initializer.elements.forEach((challenge, challengeIndex) => {
      const challengeContext = `${context}.challenges[${challengeIndex}]`;
      assert.ok(
        ts.isObjectLiteralExpression(challenge),
        `${challengeContext} must be an object`,
      );
      assert.equal(
        challenge.properties.length,
        requiredChallengeFields.length,
        `${challengeContext} must not have extra properties`,
      );

      const fields = challenge.properties.map((property) => {
        assert.ok(
          ts.isPropertyAssignment(property),
          `${challengeContext} must contain property assignments`,
        );
        const name = propertyName(property);
        assert.ok(name, `${challengeContext} contains an unnamed property`);
        assert.ok(
          requiredChallengeFields.includes(name),
          `${challengeContext} contains unexpected property ${name}`,
        );
        assert.ok(
          ts.isStringLiteral(property.initializer),
          `${challengeContext}.${name} must be a string literal`,
        );
        assert.ok(
          property.initializer.text.trim(),
          `${challengeContext}.${name} must be non-empty`,
        );
        return name;
      });

      assert.deepEqual(
        fields.sort(),
        [...requiredChallengeFields].sort(),
        `${challengeContext} must contain title, problem, and solution exactly once`,
      );
    });

    return idProperty.initializer.text;
  });

  assert.deepEqual(
    projects.slice().sort(),
    requiredProjectIds.slice().sort(),
    "projects must contain exactly the four required IDs",
  );
  return { sourceFile, projects };
}

const fixtureProjectIds = requiredProjectIds;
function projectFixture(challengeCounts, incompleteRecord = false) {
  return `const projects = [${challengeCounts
    .map((count, projectIndex) => {
      const records = Array.from({ length: count }, (_, challengeIndex) => {
        const fields = [
          `title: "title-${projectIndex}-${challengeIndex}"`,
          `problem: "problem-${projectIndex}-${challengeIndex}"`,
          `solution: "solution-${projectIndex}-${challengeIndex}"`,
        ];
        if (incompleteRecord && projectIndex === 0 && challengeIndex === 0) {
          fields.pop();
        }
        return `{ ${fields.join(", ")} }`;
      });
      return `{ id: "${fixtureProjectIds[projectIndex]}", challenges: [${records.join(", ")}] }`;
    })
    .join(", ")}];`;
}

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

  parseProjectChallenges(source);
});

test("the AST contract rejects uneven and incomplete inline challenge fixtures", () => {
  assert.throws(() => parseProjectChallenges(projectFixture([1, 1, 1, 5])));
  assert.throws(() => parseProjectChallenges(projectFixture([2, 2, 2, 2], true)));
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
