import { useLayoutEffect } from 'react';

import {
  KitchenVoice,
  StoryVisual,
} from '@/components/site/internship-visuals';
import { QianxunPage } from '@/components/site/qianxun-page';
import { Reveal } from '@/components/site/reveal';
import { SiteNav } from '@/components/site/site-nav';
import { getInternship } from '@/lib/internships';
import { experienceHref, homeHref } from '@/site/routes';

export function InternshipPage({
  internshipId,
}: {
  internshipId: string | undefined;
}) {
  const internship = getInternship(internshipId);

  useLayoutEffect(() => {
    // The browser may resolve the fragment before React mounts the chapters.
    const targetId = window.location.hash.slice(1);
    if (targetId)
      document.getElementById(targetId)?.scrollIntoView({
        behavior: 'instant',
        block: 'start',
      });
  }, [internshipId]);

  if (!internship)
    return (
      <main className="site-shell project-fallback-shell">
        <SiteNav projectMode />
        <section className="site-container project-fallback">
          <h1>实习经历不存在</h1>
          <a href={homeHref('#experience')}>返回实习经历</a>
        </section>
      </main>
    );

  const { detail, experience } = internship;
  if (detail.id === 'qianxun')
    return <QianxunPage detail={detail} experience={experience} />;

  return (
    <main className={`site-shell internship-shell internship-${detail.id}`}>
      <SiteNav projectMode />
      <article aria-labelledby="internship-title">
        <header className="internship-hero">
          <div className="internship-container internship-breadcrumb">
            <a href={homeHref('#experience')}>
              <span aria-hidden="true">←</span> 返回实习经历
            </a>
            <span>马毓廷 / 实习记录 02</span>
          </div>
          <div className="internship-container internship-hero-grid">
            <div className="internship-hero-copy">
              <div className="internship-brand">
                <span>{detail.wordmark}</span>
                <span>{experience.company}</span>
              </div>
              <p className="internship-eyebrow">{detail.eyebrow}</p>
              <h1 id="internship-title">
                {detail.headline[0]}
                <br />
                <em>{detail.headline[1]}</em>
              </h1>
              <p className="internship-introduction">{detail.introduction}</p>
              <a
                className="internship-primary-link"
                href={`#${detail.stories[0].id}`}
              >
                查看工作内容 <span aria-hidden="true">↓</span>
              </a>
            </div>
            <KitchenVoice />
          </div>
          <dl className="internship-container internship-role">
            <div>
              <dt>我的角色</dt>
              <dd>{experience.role}</dd>
            </div>
            <div>
              <dt>实习时间</dt>
              <dd>{experience.period}</dd>
            </div>
            <div>
              <dt>负责范围</dt>
              <dd>{detail.scope}</dd>
            </div>
          </dl>
        </header>

        <section
          className="internship-results"
          aria-labelledby="internship-results-title"
        >
          <div className="internship-container">
            <div className="internship-section-topline">
              <h2 id="internship-results-title">工作概览</h2>
              <span>AT A GLANCE</span>
            </div>
            <dl className="internship-metrics">
              {detail.metrics.map((metric) => (
                <div key={metric.label}>
                  <dt>{metric.label}</dt>
                  <dd className="metric-value">{metric.value}</dd>
                  <dd className="metric-note">{metric.note}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <div className="internship-container internship-work">
          <aside className="internship-index" aria-label="本页工作目录">
            <p>工作内容</p>
            <nav aria-label="实习案例章节">
              {detail.stories.map((story, index) => (
                <a href={`#${story.id}`} key={story.id}>
                  <span>0{index + 1}</span>
                  {story.navTitle}
                </a>
              ))}
            </nav>
          </aside>
          <div className="internship-stories">
            {detail.stories.map((story) => (
              <section
                key={story.id}
                id={story.id}
                className="internship-story"
                aria-labelledby={`${story.id}-title`}
              >
                <Reveal>
                  <p className="internship-eyebrow">{story.label}</p>
                  <h2 id={`${story.id}-title`}>{story.title}</h2>
                  <p className="story-problem">{story.problem}</p>
                  <StoryVisual id={story.id} />
                  <div className="story-actions">
                    <h3>具体工作</h3>
                    <ol>
                      {story.actions.map((action) => (
                        <li key={action}>{action}</li>
                      ))}
                    </ol>
                  </div>
                  <div className="story-result">
                    <span>进展与产出</span>
                    <p>{story.result}</p>
                  </div>
                  <p className="story-artifacts">
                    <span>工作产出</span>
                    {story.artifact}
                  </p>
                </Reveal>
              </section>
            ))}
          </div>
        </div>

        <section
          className="internship-reflection"
          aria-labelledby="reflection-title"
        >
          <div className="internship-container reflection-grid">
            <p className="internship-eyebrow">工作总结</p>
            <div>
              <h2 id="reflection-title">{detail.reflectionTitle}</h2>
              <p>{detail.reflection}</p>
              <span className="reflection-signature">马毓廷 / AI 产品经理</span>
            </div>
          </div>
        </section>
      </article>

      <footer className="internship-footer">
        <div className="internship-container">
          <a className="internship-next" href={experienceHref('qianxun')}>
            <span>继续阅读 / NEXT EXPERIENCE</span>
            <strong>
              千寻智能 <span aria-hidden="true">↗</span>
            </strong>
            <p>茶点服务与接待机器人的多模态交互</p>
          </a>
          <div className="internship-footer-bottom">
            <a href={homeHref('#experience')}>← 返回个人主页</a>
            <p>个人实习作品集 · 内容依据本人简历整理，非公司官方页面。</p>
            <a href={homeHref('#contact')}>联系我 ↗</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
