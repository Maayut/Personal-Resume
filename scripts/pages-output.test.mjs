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

function builtAssetContents(html, extension) {
  return localUrls(html)
    .filter((url) => url.split(/[?#]/, 1)[0].endsWith(extension))
    .map((url) => {
      const relativePath = url.slice(basePath.length).split(/[?#]/, 1)[0];
      return readBuilt(`dist-pages/${relativePath}`);
    });
}

function builtPublicPath(url) {
  assert.ok(url.startsWith(basePath), `expected base-prefixed URL: ${url}`);
  return url.slice(basePath.length).split(/[?#]/, 1)[0];
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

test('homepage output exposes the recruiter-facing metadata and case links', () => {
  const homepage = readBuilt('dist-pages/index.html');
  const scripts = builtAssetContents(homepage, '.js').join('\n');

  assert.match(homepage, /<title>马毓廷｜AI 产品经理<\/title>/);
  assert.match(
    homepage,
    /content=["']马毓廷的 AI 产品经理个人主页：多模态交互、语音 Agent、AIoT 实习实践与四个 Agent 项目案例。["']/,
  );
  assert.match(
    homepage,
    /href=["']https:\/\/maayut\.github\.io\/Personal-Resume\/["']/,
  );
  assert.match(
    homepage,
    /property=["']og:title["'][\s\S]*content=["']马毓廷｜AI 产品经理["']/,
  );
  assert.match(
    homepage,
    /property=["']og:description["'][\s\S]*content=["']从需求判断、交互策略到现场交付的 AI 产品实践。["']/,
  );
  assert.match(
    homepage,
    /https:\/\/maayut\.github\.io\/Personal-Resume\/og\.png/,
  );
  assert.match(
    scripts,
    /我的实践从智能座舱数据、IoT 商业化延伸到语音 Agent 与具身机器人：先确认人在什么场景下遇到什么阻力，再定义交互策略、协作边界和上线验收。/,
  );
  for (const project of projects) {
    assert.match(scripts, new RegExp(`id:["'\\\`]${project.id}["'\\\`]`));
    assert.equal(
      `${basePath}projects/${project.id}/`,
      `/Personal-Resume/projects/${project.id}/`,
    );
  }
  assert.match(scripts, /`\$\{[^}]+\}projects\/\$\{[^}]+\}\//);
  const portrait = '/Personal-Resume/media/mayuting-portrait.jpg';
  assert.match(scripts, new RegExp(escapeRegExp(portrait)));
  assert.ok(fs.existsSync(new URL(builtPublicPath(portrait), distRoot)));
  assert.doesNotMatch(
    `${homepage}\n${scripts}`,
    /下载 PDF|href=["'][^"']+\.pdf/i,
  );
});

test('homepage bundle deploys the resume hero through shared site assets', () => {
  const homepage = readBuilt('dist-pages/index.html');
  const scripts = builtAssetContents(homepage, '.js').join('\n');
  const styles = builtAssetContents(homepage, '.css').join('\n');
  const fallbackUrl = styles.match(
    /url\(["']?(\/Personal-Resume\/media\/hero-fallback\.svg)["']?\)/,
  )?.[1];

  assert.match(scripts, /AI PRODUCT MANAGER · EMBODIED INTELLIGENCE/);
  assert.match(scripts, /hf_20260601_110537/);
  assert.ok(fallbackUrl, 'homepage CSS should include the fallback URL');
  assert.ok(
    fs.existsSync(new URL(builtPublicPath(fallbackUrl), distRoot)),
    `fallback asset should exist: ${fallbackUrl}`,
  );
  assert.doesNotMatch(
    `${homepage}\n${scripts}`,
    /AI Agent 项目案例集|四个真实 Agent 项目/,
  );
});

test('route helpers preserve the configured base path and URL shapes', () => {
  const routes = read('site/routes.ts');

  assert.match(routes, /import\.meta\.env\.BASE_URL/);
  assert.match(routes, /homeHref\(hash = ['"]['"]\)/);
  assert.match(routes, /`\$\{basePath\}\$\{hash\}`/);
  assert.match(routes, /projectHref\(id: ProjectCase\[['"]id['"]\]\)/);
  assert.match(routes, /`\$\{basePath\}projects\/\$\{id\}\/`/);
});
