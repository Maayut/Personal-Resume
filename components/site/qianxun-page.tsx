import { Reveal } from '@/components/site/reveal';
import { SiteNav } from '@/components/site/site-nav';
import type { InternshipCase } from '@/lib/internships';
import type { Experience } from '@/lib/resume';
import { basePath, experienceHref, homeHref } from '@/site/routes';

function WorkFigure({ id }: { id: string }) {
  if (id === 'reception')
    return (
      <figure className="q-work-figure q-flow-figure">
        <figcaption>茶点 / 接待 · 服务流程</figcaption>
        <ol className="q-service-flow">
          {['迎宾', '对话选品', '澄清确认', '拿取递交', '服务收尾'].map(
            (step, index) => (
              <li key={step}>
                <span>0{index + 1}</span>
                <strong>{step}</strong>
                <span aria-hidden="true">↓</span>
              </li>
            ),
          )}
        </ol>
        <p className="q-figure-note">
          语音与视觉一期 PRD · 能力分层 · 需求优先级
        </p>
      </figure>
    );
  if (id === 'response')
    return (
      <figure className="q-work-figure q-latency-figure">
        <figcaption>语音方案 · 端到端延迟</figcaption>
        <div className="q-latency-number">
          <span>
            2.5<small>s</small>
          </span>
          <span aria-hidden="true">↘</span>
          <strong>
            1.6<small>s</small>
          </strong>
        </div>
        <div className="q-architecture">
          <span>云侧 omni</span>
          <span aria-hidden="true">+</span>
          <span>本地 ASR</span>
        </div>
        <p className="q-figure-note">替代 ASR + VAD 级联方案</p>
        <div className="q-capability-list">
          <span>全双工对话</span>
          <span>短期记忆</span>
          <span>指代澄清</span>
        </div>
      </figure>
    );
  if (id === 'perception')
    return (
      <figure className="q-work-figure q-range-figure">
        <figcaption>视觉能力 · 阶段目标</figcaption>
        <div className="q-range-ruler" aria-hidden="true">
          <span>0</span>
          <span>1</span>
          <span>2</span>
          <span>3m</span>
        </div>
        <dl className="q-distance-list">
          <div>
            <dt>人脸识别</dt>
            <dd>
              1.5<small>m</small>
            </dd>
          </div>
          <div>
            <dt>人数 / 动作识别</dt>
            <dd>
              2<small>m</small>
            </dd>
          </div>
          <div>
            <dt>接近检测</dt>
            <dd>
              3<small>m</small>
            </dd>
          </div>
        </dl>
        <p className="q-figure-note">以上为需求规划中的阶段指标。</p>
      </figure>
    );
  if (id === 'validation')
    return (
      <figure className="q-work-figure q-test-figure">
        <figcaption>评测设计 · 测试条件</figcaption>
        <div className="q-test-row">
          <strong>语音</strong>
          <p>
            距离 · 性别与音色 · 说话方向
            <br />
            办公室人声 · 机械噪声
          </p>
        </div>
        <div className="q-test-row">
          <strong>视觉</strong>
          <p>
            距离 · 方向 · 光照
            <br />
            遮挡 · 目标位置变化
          </p>
        </div>
        <div className="q-test-levels">
          <span>单项模型能力</span>
          <span aria-hidden="true">↓</span>
          <strong>机器人端到端交互</strong>
        </div>
      </figure>
    );
  if (id === 'delivery')
    return (
      <figure className="q-work-figure q-delivery-figure">
        <figcaption>WRC · 问答链路优化</figcaption>
        <div className="q-latency-number">
          <span>
            5<small>s</small>
          </span>
          <span aria-hidden="true">↘</span>
          <strong>
            2.5<small>s</small>
          </strong>
        </div>
        <p className="q-figure-note">端到端延迟</p>
        <div className="q-channel">
          <span>远程任务方案 / 飞书 Channel</span>
          <p>
            任务入口 <b aria-hidden="true">→</b> 交互卡片{' '}
            <b aria-hidden="true">→</b> 状态反馈
          </p>
        </div>
      </figure>
    );
  return null;
}

export function QianxunPage({
  detail,
  experience,
}: {
  detail: InternshipCase;
  experience: Experience;
}) {
  return (
    <main className="site-shell qianxun-page">
      <SiteNav projectMode />
      <article aria-labelledby="internship-title">
        <header className="q-hero">
          <div className="q-container q-breadcrumb">
            <a href={homeHref('#experience')}>
              <span aria-hidden="true">← </span>返回实习经历
            </a>
            <span>马毓廷 / 实习记录 01</span>
          </div>
          <div className="q-container q-hero-grid">
            <div className="q-hero-copy">
              <div className="q-brand">
                <span className="q-brand-mark" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
                <strong>Spirit AI</strong>
                <span>千寻智能</span>
              </div>
              <p className="q-eyebrow">EMBODIED INTELLIGENCE</p>
              <h1 id="internship-title">
                {detail.headline[0]}
                <br />
                <span>{detail.headline[1]}</span>
              </h1>
              <p className="q-introduction">{detail.introduction}</p>
              <a className="q-primary-link" href={`#${detail.stories[0].id}`}>
                查看工作内容 <span aria-hidden="true">↗</span>
              </a>
            </div>
            <figure className="q-robot-figure">
              <span className="q-figure-tag">SPIRIT AI / ROBOTICS</span>
              <div className="q-robot-stage">
                <span className="q-stage-word" aria-hidden="true">
                  SPIRIT
                </span>
                {/* oxlint-disable-next-line next/no-img-element -- GitHub Pages serves this optimized 36 KB WebP directly. */}
                <img
                  src={`${basePath}media/spirit-robot.webp`}
                  alt="千寻智能官网机器人产品形象"
                  width="638"
                  height="900"
                  fetchPriority="high"
                />
                <span className="q-stage-axis" aria-hidden="true">
                  +
                </span>
              </div>
              <figcaption>
                <span>产品视觉</span>
                <a
                  href="https://www.spirit-ai.com/product"
                  target="_blank"
                  rel="noreferrer"
                >
                  千寻智能官网 ↗
                </a>
              </figcaption>
            </figure>
          </div>
          <dl className="q-container q-role">
            <div>
              <dt>我的角色</dt>
              <dd>{experience.role}</dd>
            </div>
            <div>
              <dt>实习时间</dt>
              <dd>{experience.period}</dd>
            </div>
            <div>
              <dt>主要工作</dt>
              <dd>{detail.scope}</dd>
            </div>
          </dl>
        </header>

        <section className="q-results" aria-labelledby="q-results-title">
          <div className="q-container">
            <div className="q-section-heading">
              <p className="q-eyebrow">AT A GLANCE</p>
              <h2 id="q-results-title">关键进展</h2>
            </div>
            <dl className="q-metrics">
              {detail.metrics.map((metric) => (
                <div key={metric.label}>
                  <dt>{metric.label}</dt>
                  <dd className="q-metric-value">{metric.value}</dd>
                  <dd className="q-metric-note">{metric.note}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <div className="q-container q-work">
          <div className="q-work-heading">
            <p className="q-eyebrow">SELECTED WORK / 工作内容</p>
            <nav aria-label="实习案例章节">
              {detail.stories.map((story, index) => (
                <a key={story.id} href={`#${story.id}`}>
                  <span>0{index + 1}</span>
                  {story.navTitle}
                </a>
              ))}
            </nav>
          </div>
          {detail.stories.map((story, index) => (
            <section
              key={story.id}
              id={story.id}
              className="q-story"
              aria-labelledby={`${story.id}-title`}
            >
              <Reveal>
                <div className="q-story-heading">
                  <span className="q-story-number">0{index + 1}</span>
                  <div>
                    <p className="q-eyebrow">{story.label.split(' / ')[1]}</p>
                    <h2 id={`${story.id}-title`}>{story.title}</h2>
                  </div>
                </div>
                <div className="q-story-grid">
                  <div className="q-story-copy">
                    <p className="q-problem">{story.problem}</p>
                    <h3>我负责的工作</h3>
                    <ul>
                      {story.actions.map((action) => (
                        <li key={action}>{action}</li>
                      ))}
                    </ul>
                    <div className="q-result">
                      <span>进展与产出</span>
                      <p>{story.result}</p>
                    </div>
                    <p className="q-artifacts">{story.artifact}</p>
                  </div>
                  <WorkFigure id={story.id} />
                </div>
              </Reveal>
            </section>
          ))}
        </div>

        <section className="q-summary" aria-labelledby="q-summary-title">
          <div className="q-container q-summary-grid">
            <p className="q-eyebrow">WORKING NOTES</p>
            <div>
              <h2 id="q-summary-title">{detail.reflectionTitle}</h2>
              <p>{detail.reflection}</p>
            </div>
          </div>
        </section>
      </article>
      <footer className="q-footer">
        <div className="q-container">
          <a className="internship-next q-next" href={experienceHref('jd')}>
            <span>下一段实习 / NEXT</span>
            <strong>
              京东科技 <span aria-hidden="true">↗</span>
            </strong>
            <p>JOYINSIDE × 京造炒菜机器人</p>
          </a>
          <div className="q-footer-bottom">
            <a href={homeHref('#experience')}>← 返回个人主页</a>
            <p>马毓廷的实习作品集 · 产品图来自千寻智能官网</p>
            <a href={homeHref('#contact')}>联系我 ↗</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
