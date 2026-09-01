import { InteractiveHero } from '@/components/site/interactive-hero';
import { SectionHeading } from '@/components/site/section-heading';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteNav } from '@/components/site/site-nav';
import {
  capabilityGroups,
  education,
  experiences,
  honors,
  profile,
  type Experience,
} from '@/lib/resume';
import { projects, type ProjectCase } from '@/lib/projects';
import { projectHref } from '@/site/routes';

function ExperienceItem({ experience }: { experience: Experience }) {
  return (
    <article
      className={`experience-item ${
        experience.featured ? 'is-featured' : 'is-compact'
      }`}
    >
      <div className="experience-meta">
        <p>{experience.period}</p>
        <p>{experience.domain}</p>
      </div>
      <div className="experience-body">
        <h3>{experience.company}</h3>
        <p className="experience-role">{experience.role}</p>
        <p className="experience-summary">{experience.summary}</p>
        {experience.featured ? (
          <ul className="experience-highlights">
            {experience.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        ) : null}
      </div>
      <ul className="metric-list" aria-label={`${experience.company} 结果`}>
        {experience.metrics.map((metric) => (
          <li key={metric}>{metric}</li>
        ))}
      </ul>
    </article>
  );
}

function ProjectCard({ project }: { project: ProjectCase }) {
  return (
    <article className={`project-card project-accent-${project.id}`}>
      <p className="project-index">PROJECT / {project.index}</p>
      <h3>{project.title}</h3>
      <p className="project-subtitle">{project.subtitle}</p>
      <p className="project-metric">{project.metric}</p>
      <a className="project-link" href={projectHref(project.id)}>
        查看完整案例 <span aria-hidden="true">→</span>
      </a>
    </article>
  );
}

export function HomePage() {
  return (
    <main className="site-shell">
      <SiteNav />
      <InteractiveHero />
      <section className="about-section" id="about">
        <div className="site-container about-grid">
          <figure className="portrait-frame">
            {/* oxlint-disable-next-line next/no-img-element -- deployed Vite pages use a base-safe public asset. */}
            <img
              src={`${import.meta.env.BASE_URL}media/mayuting-portrait.jpg`}
              alt="马毓廷个人照片"
            />
          </figure>
          <div className="about-copy">
            <SectionHeading
              label="00 / HUMAN IN THE LOOP"
              title="把技术能力组织成可被使用的产品"
            />
            <p className="about-introduction">
              {
                '我的实践从智能座舱数据、IoT 商业化延伸到语音 Agent 与具身机器人：先确认人在什么场景下遇到什么阻力，再定义交互策略、协作边界和上线验收。'
              }
            </p>
            <dl className="about-facts">
              <div>
                <dt>EDUCATION</dt>
                <dd>武汉大学 · 信息资源管理硕士</dd>
              </div>
              <div>
                <dt>LOCATION</dt>
                <dd>{profile.city}</dd>
              </div>
              <div>
                <dt>DISCIPLINE</dt>
                <dd>国家二级运动员 · 三级跳远</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
      <section className="experience-section" id="experience">
        <div className="site-container">
          <SectionHeading
            label="01 / FIELD EXPERIENCE"
            title="从需求判断到现场交付"
            note="三段重点经历展开产品对象、关键行动与对应结果；早期数据产品经历以摘要保留。"
          />
          <div className="experience-list">
            {experiences.map((experience) => (
              <ExperienceItem
                key={experience.company}
                experience={experience}
              />
            ))}
          </div>
        </div>
      </section>
      <section className="projects-section" id="projects">
        <div className="site-container">
          <SectionHeading
            label="02 / SELECTED AGENT WORK"
            title="我与 Agent 共同完成的产品"
            note="每个案例都保留问题判断、人机分工、关键转折、验证结果与诚实边界。"
          />
          <div className="project-grid">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>
      <section className="education-section" id="education">
        <div className="site-container">
          <SectionHeading
            label="03 / EDUCATION & CAPABILITY"
            title="研究、产品与工程之间"
          />
          <div className="education-grid">
            <div className="education-column">
              <p className="section-label">EDUCATION</p>
              <ul className="editorial-list">
                {education.map((item) => (
                  <li key={item.degree}>
                    <strong>{item.degree}</strong>
                    <span>{item.institution}</span>
                    <small>{item.period}</small>
                  </li>
                ))}
              </ul>
            </div>
            <div className="capability-column">
              <p className="section-label">CAPABILITY</p>
              <dl className="capability-list">
                {Object.entries(capabilityGroups).map(([label, values]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{values.join(' · ')}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="honors-column">
              <p className="section-label">HONORS</p>
              <ul className="editorial-list honors-list">
                {honors.map((honor) => (
                  <li key={honor}>{honor}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
