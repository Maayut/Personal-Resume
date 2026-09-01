import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const repositoryRoot = new URL('../', import.meta.url);
const distRoot = new URL('dist-pages/', repositoryRoot);
const basePath = '/Personal-Resume/';
const siteOrigin = 'https://maayut.github.io/Personal-Resume/';

const projects = [
  {
    route: 'projects/compliance/',
    id: 'compliance',
    title: '用工合规智能系统｜马毓廷',
    description: '将企业制度、法规知识与 Agent 风险诊断连接成可溯源工作流。',
  },
  {
    route: 'projects/mock-interview/',
    id: 'mock-interview',
    title: 'MockInterview｜马毓廷',
    description: '围绕简历与回答动态追问的中文电话模拟面试 Agent。',
  },
  {
    route: 'projects/career-pathfinder/',
    id: 'career-pathfinder',
    title: 'Career Pathfinder｜马毓廷',
    description: '有证据、可反证、保护隐私的职业决策 Agent。',
  },
  {
    route: 'projects/resume-autofill/',
    id: 'resume-autofill',
    title: 'FillResume 智能网申助手｜马毓廷',
    description: '从个人秋招重复填表痛点出发的本地自动化工具。',
  },
];

function read(path) {
  return fs.readFileSync(new URL(path, repositoryRoot), 'utf8');
}

function readBuilt(path) {
  const file = new URL(path, repositoryRoot);

  assert.equal(fs.existsSync(file), true, `expected built page: ${path}`);
  return fs.readFileSync(file, 'utf8');
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function localUrls(html) {
  return [...html.matchAll(/(?:src|href)=["']([^"']+)["']/gi)]
    .map(([, url]) => url)
    .filter((url) => url.startsWith('/') && !url.startsWith('//'));
}

function assertBuiltAssetsResolve(html, pageLabel) {
  const urls = localUrls(html);
  assert.ok(urls.length > 0, `${pageLabel} should reference local assets`);

  for (const url of urls) {
    assert.ok(
      url.startsWith(basePath),
      `${pageLabel} local URL must use ${basePath}: ${url}`,
    );
    const relativePath = url.slice(basePath.length).split(/[?#]/, 1)[0];
    assert.ok(
      fs.existsSync(new URL(relativePath, distRoot)),
      `${pageLabel} local asset should exist: ${url}`,
    );
  }

  for (const extension of ['.js', '.css', '/favicon.svg']) {
    assert.ok(
      urls.some((url) => url.split(/[?#]/, 1)[0].endsWith(extension)),
      `${pageLabel} should include a local ${extension} asset`,
    );
  }
}

test('every project source and built page preserves its route contract', () => {
  for (const project of projects) {
    const source = read(`${project.route}index.html`);
    const built = readBuilt(`dist-pages/${project.route}index.html`);
    const canonical = `${siteOrigin}${project.route}`;

    assert.match(
      source,
      new RegExp(`data-project-id=["']${escapeRegExp(project.id)}["']`),
    );
    assert.match(
      source,
      /<script type="module" src="\/project-main\.tsx"><\/script>/,
    );

    assert.match(
      built,
      new RegExp(
        `<body[^>]*data-project-id=["']${escapeRegExp(project.id)}["']`,
      ),
    );
    assert.match(
      built,
      new RegExp(`<title>${escapeRegExp(project.title)}</title>`),
    );
    assert.match(
      built,
      new RegExp(`content=["']${escapeRegExp(project.description)}["']`),
    );
    assert.match(built, new RegExp(`href=["']${escapeRegExp(canonical)}["']`));
    assertBuiltAssetsResolve(built, project.route);
  }
});

test('homepage output uses base-prefixed local assets that resolve', () => {
  const homepage = readBuilt('dist-pages/index.html');

  assertBuiltAssetsResolve(homepage, 'homepage');
});

test('route helpers preserve the configured base path and URL shapes', () => {
  const routes = read('site/routes.ts');

  assert.match(routes, /import\.meta\.env\.BASE_URL/);
  assert.match(routes, /homeHref\(hash = ['"]['"]\)/);
  assert.match(routes, /`\$\{basePath\}\$\{hash\}`/);
  assert.match(routes, /projectHref\(id: ProjectCase\[['"]id['"]\]\)/);
  assert.match(routes, /`\$\{basePath\}projects\/\$\{id\}\/`/);
});
