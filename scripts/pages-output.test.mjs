import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const root = new URL('../', import.meta.url);

test('static pages build to every expected output path', () => {
  const outputPaths = [
    'dist-pages/index.html',
    'dist-pages/projects/compliance/index.html',
    'dist-pages/projects/mock-interview/index.html',
    'dist-pages/projects/career-pathfinder/index.html',
    'dist-pages/projects/resume-autofill/index.html',
  ];

  for (const outputPath of outputPaths) {
    assert.equal(
      fs.existsSync(new URL(outputPath, root)),
      true,
      `expected built page: ${outputPath}`,
    );
  }
});

test('compliance source entry identifies its project and app entrypoint', () => {
  const source = fs.readFileSync(
    new URL('projects/compliance/index.html', root),
    'utf8',
  );

  assert.match(source, /data-project-id=["']compliance["']/);
  assert.match(source, /project-main\.tsx/);
});
