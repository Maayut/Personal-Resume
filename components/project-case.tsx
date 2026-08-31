import { ArrowUpRight, CheckCircle2, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { ProjectCase as Project } from "@/lib/projects";

const accentClasses: Record<Project["id"], string> = {
  compliance: "accent-compliance",
  "mock-interview": "accent-interview",
  "career-pathfinder": "accent-career",
};

const starItems = [
  ["S", "Situation", "situation"],
  ["T", "Task", "task"],
] as const;

export function ProjectCase({ project }: { project: Project }) {
  return (
    <article
      id={project.id}
      aria-labelledby={project.id + "-title"}
      className={"project-case " + accentClasses[project.id]}
    >
      <header className="grid gap-8 border-b border-[var(--line)] px-6 py-8 md:grid-cols-[1fr_auto] md:px-10 md:py-10">
        <div>
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="project-number">{project.index}</span>
            <span className="eyebrow">{project.audience}</span>
          </div>
          <h2
            id={project.id + "-title"}
            className="max-w-3xl text-3xl font-semibold tracking-[-0.04em] md:text-5xl"
          >
            {project.title}
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--muted-ink)] md:text-lg">
            {project.subtitle}
          </p>
        </div>
        <div className="metric-stamp self-start">
          <span>验证结果</span>
          <strong>{project.metric}</strong>
        </div>
      </header>

      <div className="px-6 py-8 md:px-10 md:py-10">
        <div className="mb-8 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="tag-badge">
              {tag}
            </Badge>
          ))}
        </div>

        <section
          aria-label="STAR 项目描述"
          className="grid gap-4 md:grid-cols-2"
        >
          {starItems.map(([letter, label, field]) => (
            <Card key={label} className="star-card shadow-none">
              <CardHeader>
                <div className="mb-3 flex items-center gap-3">
                  <span className="star-letter">{letter}</span>
                  <CardTitle>{label}</CardTitle>
                </div>
                <CardDescription className="text-[15px] leading-7 text-[var(--muted-ink)]">
                  {project[field]}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}

          <Card className="star-card shadow-none">
            <CardHeader>
              <div className="mb-3 flex items-center gap-3">
                <span className="star-letter">A</span>
                <CardTitle>Action</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="evidence-list">
                {project.actions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="star-card shadow-none">
            <CardHeader>
              <div className="mb-3 flex items-center gap-3">
                <span className="star-letter">R</span>
                <CardTitle>Result</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="evidence-list">
                {project.result.map((item) => (
                  <li key={item}>
                    <CheckCircle2 aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-10" />

        <section aria-label="人机协作分工">
          <div className="section-kicker">
            <span>COLLABORATION</span>
            <h3>我做判断，Agent 放大执行</h3>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Card className="role-card shadow-none">
              <CardHeader>
                <CardTitle>我负责</CardTitle>
                <CardDescription>目标、边界、领域材料与真实验收</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="compact-list">
                  {project.humanRole.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="role-card shadow-none">
              <CardHeader>
                <CardTitle>AI Agent 负责</CardTitle>
                <CardDescription>研究、拆解、实现、测试与文档化</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="compact-list">
                  {project.agentRole.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          <div className="collaboration-loop">
            <ArrowUpRight aria-hidden="true" />
            <p>
              <strong>协作闭环</strong>
              {project.collaborationLoop}
            </p>
          </div>
        </section>

        <Separator className="my-10" />

        <section aria-label="工具选择">
          <div className="section-kicker">
            <span>MODEL &amp; TOOLS</span>
            <h3>不是堆模型，而是按任务选择工具</h3>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {project.tools.map((tool) => (
              <Card key={tool.name} className="tool-card shadow-none">
                <CardHeader>
                  <CardTitle className="text-[15px]">{tool.name}</CardTitle>
                  <CardDescription className="leading-6">
                    {tool.reason}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <aside className="boundary-note">
          <ShieldCheck aria-hidden="true" />
          <div>
            <strong>诚实边界</strong>
            <p>{project.boundary}</p>
          </div>
        </aside>
      </div>
    </article>
  );
}
