import { ProjectCase } from "@/components/project-case";
import { MotionEnhancer } from "@/components/motion-enhancer";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { projects } from "@/lib/projects";

const quickMetrics = [
  ["04", "真实场景"],
  ["合规 · 语音 · 决策 · 自动化", "四类 Agent"],
  ["测试 · Trace · 反馈", "验证证据"],
];

export default function Home() {
  return (
    <main className="page-shell">
      <div className="scroll-progress" aria-hidden="true" />
      <nav className="site-nav" aria-label="页面导航">
        <a href="#top" className="brand-mark" aria-label="返回页面顶部">
          <span className="icon-glyph" aria-hidden="true">●</span>
          <span>Agent Casebook</span>
        </a>
        <div className="nav-links">
          <a href="#projects">项目案例</a>
          <a href="#capabilities">能力总结</a>
        </div>
      </nav>

      <section id="top" className="hero-shell">
        <div className="hero-copy">
          <span className="hero-badge" data-reveal data-reveal-order="1">
            AI AGENT PROJECT SHOWCASE · 2026
          </span>
          <h1 data-reveal data-reveal-order="2">
            把真实问题
            <br />
            变成<span>可验证</span>的 Agent 产品
          </h1>
          <p className="hero-lead" data-reveal data-reveal-order="3">
            我定义真实问题和验收标准，向 Agent 提供领域材料与反馈；
            Agent 放大研究与工程执行力。最终用测试、溯源和真实试用判断结果是否真正可用。
          </p>
          <a href="#projects" className="hero-link" data-reveal data-reveal-order="4">
            查看项目
            <span className="icon-glyph" aria-hidden="true">↓</span>
          </a>
        </div>

        <div className="hero-proof" aria-label="案例范围" data-reveal data-reveal-order="3" data-spotlight>
          <p className="proof-label">SELECTED WORK</p>
          <div className="proof-grid">
            {quickMetrics.map(([value, label]) => (
              <div key={label} className="proof-item">
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
          <div className="proof-note">
            <span className="icon-glyph" aria-hidden="true">✓</span>
            <p>所有结果均来自本地项目、测试记录与 Agent 对话历史交叉核验。</p>
          </div>
        </div>
      </section>

      <section id="projects" className="content-shell project-index">
        <div className="section-heading" data-reveal>
          <span>01 — SELECTED CASES</span>
          <h2>四个项目，四种真实问题</h2>
          <p>
            不按代码量排序，优先展示真实受益对象、关键判断与可核验结果。
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {projects.map((project) => (
            <a
              key={project.id}
              href={"#" + project.id}
              className="project-index-link"
              data-reveal
              data-spotlight
            >
              <Card className={"index-card index-" + project.id} size="sm">
                <CardHeader>
                  <div className="index-topline">
                    <span>{project.index}</span>
                    <span className="icon-glyph" aria-hidden="true">↗</span>
                  </div>
                  <CardTitle>{project.title}</CardTitle>
                  <CardDescription>{project.subtitle}</CardDescription>
                </CardHeader>
              </Card>
            </a>
          ))}
        </div>
      </section>

      <section className="content-shell case-stack">
        {projects.map((project) => (
          <ProjectCase key={project.id} project={project} />
        ))}
      </section>

      <section id="capabilities" className="content-shell capabilities-section">
        <div className="section-heading" data-reveal>
          <span>02 — CAPABILITY</span>
          <h2>我在四个项目中反复证明的能力</h2>
        </div>
        <div className="capability-grid">
          {[
            ["01", "领域抽象", "把法律、面试、职业决策与招聘表单知识转成 Agent 可执行的结构。"],
            ["02", "工作流设计", "为模型配置检索、状态、工具、证据与失败降级。"],
            ["03", "真实验证", "用测试、trace、真实材料和用户反馈判断是否真正可用。"],
          ].map(([index, title, description]) => (
            <div key={title} className="capability-card" data-reveal data-spotlight>
              <span>{index}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="content-shell site-footer" data-reveal>
        <p>AI Agent Project Casebook · Evidence over hype.</p>
      </footer>
      <MotionEnhancer />
    </main>
  );
}
