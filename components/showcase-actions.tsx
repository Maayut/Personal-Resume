"use client";

import { useState } from "react";
import { Copy, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import { projects } from "@/lib/projects";

export function ShowcaseActions() {
  const [status, setStatus] = useState("");

  const copyResumeText = async () => {
    try {
      await navigator.clipboard.writeText(
        projects.map((project) => project.resumeCopy).join("\n\n"),
      );
      setStatus("三段简历描述已复制");
    } catch {
      setStatus("复制失败，请手动选择文本");
    }
  };

  return (
    <div className="showcase-actions" data-screen-only="true">
      <Button type="button" size="lg" onClick={copyResumeText}>
        <Copy aria-hidden="true" />
        复制简历描述
      </Button>
      <Button type="button" size="lg" variant="outline" onClick={() => window.print()}>
        <Printer aria-hidden="true" />
        打印 / 保存 PDF
      </Button>
      <span role="status" aria-live="polite">
        {status}
      </span>
    </div>
  );
}
