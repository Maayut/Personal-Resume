import { projects } from "@/lib/projects";

export function ShowcaseActions() {
  const resumeText = projects
    .map((project) => project.resumeCopy)
    .join("\n\n");
  const enhancementScript = `(() => {
    const root = document.querySelector('[data-showcase-actions]');
    if (!root || root.dataset.ready === 'true') return;
    root.dataset.ready = 'true';
    const status = root.querySelector('[data-status]');
    root.querySelector('[data-copy]')?.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(${JSON.stringify(resumeText)});
        if (status) status.textContent = '三段简历描述已复制';
      } catch {
        if (status) status.textContent = '复制失败，请手动选择文本';
      }
    });
    root.querySelector('[data-print]')?.addEventListener('click', () => window.print());
  })();`;

  return (
    <div
      className="showcase-actions"
      data-screen-only="true"
      data-showcase-actions
    >
      <button
        className="action-button action-primary"
        type="button"
        data-copy
      >
        <span aria-hidden="true">↗</span>
        复制简历描述
      </button>
      <button
        className="action-button action-secondary"
        type="button"
        data-print
      >
        <span aria-hidden="true">⎙</span>
        打印 / 保存 PDF
      </button>
      <span role="status" aria-live="polite" data-status />
      <script dangerouslySetInnerHTML={{ __html: enhancementScript }} />
    </div>
  );
}
