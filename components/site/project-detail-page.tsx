import type { CSSProperties } from 'react';

import { Reveal } from '@/components/site/reveal';
import { SectionHeading } from '@/components/site/section-heading';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteNav } from '@/components/site/site-nav';
import { projects, type ProjectCase } from '@/lib/projects';
import { projectAccents } from '@/site/project-accents';
import { homeHref, projectHref } from '@/site/routes';

function getNeighbors(project: ProjectCase) {
  const currentIndex = projects.findIndex(({ id }) => id === project.id);
  const previous = projects.at(
    (currentIndex - 1 + projects.length) % projects.length,
  )!;
  const next = projects.at((currentIndex + 1) % projects.length)!;
  return { previous, next };
}

type StoryCardProps = {
  letter: string;
  label: string;
  values: string[];
};

function StoryCard({ letter, label, values }: StoryCardProps) {
  const headingId = `project-star-${letter.toLowerCase()}`;

  return (
    <article className="project-star-card" aria-labelledby={headingId}>
      <h3 className="project-story-label" id={headingId}>
        <span aria-hidden="true">{letter}</span>
        {label}
      </h3>
      <ul>
        {values.map((value) => (
          <li key={value}>{value}</li>
        ))}
      </ul>
    </article>
  );
}

export function ProjectDetailPage({ project }: { project: ProjectCase }) {
  const { previous, next } = getNeighbors(project);

  return (
    <main
      className="site-shell project-shell"
      style={
        { '--project-accent': projectAccents[project.id] } as CSSProperties
      }
    >
      <SiteNav projectMode />
      <article aria-labelledby="project-title">
        <header className="project-hero">
          <Reveal className="site-container project-hero-grid">
            <div className="project-hero-meta">
              <p className="section-label">PROJECT / {project.index}</p>
              <a className="project-back-link" href={homeHref('#projects')}>
                <span aria-hidden="true">←</span> 返回主页
              </a>
            </div>
            <div className="project-hero-copy">
              <p className="project-audience">{project.audience}</p>
              <h1 id="project-title">{project.title}</h1>
              <p className="project-hero-subtitle">{project.subtitle}</p>
              <p className="project-hero-metric">{project.metric}</p>
              <ul
                className="project-tag-list"
                aria-label={`${project.title} 标签`}
              >
                {project.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        </header>

        <section
          className="project-section project-overview"
          id="project-overview"
          aria-labelledby="project-overview-title"
        >
          <Reveal className="site-container">
            <SectionHeading
              label="00 / OVERVIEW"
              title="为什么做，以及做到哪里"
              id="project-overview-title"
            />
            <div className="project-overview-grid">
              <div>
                <p className="project-content-label">问题背景</p>
                <p>{project.situation}</p>
              </div>
              <div>
                <p className="project-content-label">产品任务</p>
                <p>{project.task}</p>
              </div>
              <div>
                <p className="project-content-label">当前完成度</p>
                <p>{project.result[0]}</p>
              </div>
            </div>
          </Reveal>
        </section>

        <section
          className="project-section project-star"
          id="project-star"
          aria-labelledby="project-star-title"
        >
          <Reveal className="site-container">
            <SectionHeading
              label="01 / STAR"
              title="从问题判断到可验证结果"
              id="project-star-title"
            />
            <div className="project-star-grid">
              <StoryCard
                letter="S"
                label="SITUATION"
                values={[project.situation]}
              />
              <StoryCard letter="T" label="TASK" values={[project.task]} />
              <StoryCard letter="A" label="ACTION" values={project.actions} />
              <StoryCard letter="R" label="RESULT" values={project.result} />
            </div>
          </Reveal>
        </section>

        <section
          className="project-section project-collaboration"
          id="project-collaboration"
          aria-labelledby="project-collaboration-title"
        >
          <Reveal className="site-container">
            <SectionHeading
              label="02 / HUMAN × AGENT"
              title="我与 AI 的分工"
              id="project-collaboration-title"
            />
            <div className="project-collaboration-grid">
              <article>
                <h3>我负责</h3>
                <ul>
                  {project.humanRole.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
              <article>
                <h3>AI Agent 负责</h3>
                <ul>
                  {project.agentRole.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </div>
            <aside className="project-loop" aria-label="人机协作循环">
              <p className="project-content-label">COLLABORATION LOOP</p>
              <p>{project.collaborationLoop}</p>
            </aside>
          </Reveal>
        </section>

        <section
          className="project-section project-decisions"
          id="project-decisions"
          aria-labelledby="project-decisions-title"
        >
          <Reveal className="site-container">
            <SectionHeading
              label="03 / DECISIONS"
              title="核心挑战与解决方案"
              id="project-decisions-title"
            />
            <div className="project-challenge-list">
              {project.challenges.map((challenge) => (
                <article className="project-challenge" key={challenge.title}>
                  <h3>{challenge.title}</h3>
                  <div>
                    <p className="project-content-label">PROBLEM</p>
                    <p>{challenge.problem}</p>
                  </div>
                  <div>
                    <p className="project-content-label">SOLUTION</p>
                    <p>{challenge.solution}</p>
                  </div>
                </article>
              ))}
            </div>
          </Reveal>
        </section>

        <section
          className="project-section project-tooling"
          id="project-tooling"
          aria-labelledby="project-tooling-title"
        >
          <Reveal className="site-container">
            <SectionHeading
              label="04 / TOOLING"
              title="工具与模型为什么这样选"
              id="project-tooling-title"
            />
            <div className="project-tool-grid">
              {project.tools.map((tool) => (
                <article className="project-tool" key={tool.name}>
                  <h3>{tool.name}</h3>
                  <p>{tool.reason}</p>
                </article>
              ))}
            </div>
          </Reveal>
        </section>

        <section
          className="project-section project-boundary"
          id="project-boundary"
          aria-labelledby="project-boundary-title"
        >
          <Reveal className="site-container">
            <SectionHeading
              label="05 / EVIDENCE BOUNDARY"
              title="诚实边界"
              id="project-boundary-title"
            />
            <div className="project-boundary-note">
              <p>{project.boundary}</p>
            </div>
          </Reveal>
        </section>

        <nav
          className="site-container project-pagination"
          aria-label="项目翻页"
        >
          <a
            href={projectHref(previous.id)}
            aria-label={`上一项目 ${previous.title}`}
          >
            <span>上一项目</span>
            <strong>{previous.title}</strong>
          </a>
          <a href={projectHref(next.id)} aria-label={`下一项目 ${next.title}`}>
            <span>下一项目</span>
            <strong>{next.title}</strong>
          </a>
        </nav>
      </article>
      <SiteFooter />
    </main>
  );
}
