export type Experience = {
  company: string;
  role: string;
  period: string;
  domain: string;
  featured: boolean;
  summary: string;
  highlights: string[];
  metrics: string[];
};

export type ResumeProfile = {
  name: string;
  role: string;
  phone: string;
  email: string;
  city: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  ethnicity: string;
  headline: string;
  introduction: string;
};

export type Education = {
  degree: string;
  institution: string;
  period: string;
};

export const profile: ResumeProfile = {
  name: "马毓廷",
  role: "AI 产品经理",
  phone: "166-4356-2796",
  email: "3188901755@qq.com",
  city: "湖北武汉",
  age: "23 岁",
  gender: "男",
  height: "180 cm",
  weight: "67 kg",
  ethnicity: "汉族",
  headline: "让 AI 从能力走向真实交互",
  introduction:
    "聚焦多模态交互、语音 Agent 与 AIoT 产品，具备从需求定义、策略设计、跨团队推进到上线验证的完整实践。",
};

export const experiences: Experience[] = [
  {
    company: "千寻智能",
    role: "机器人产品实习生（多模态）",
    period: "2026.08 — 至今",
    domain: "EMBODIED AI",
    featured: true,
    summary: "负责展会问答链路优化、前台迎宾 MVP 需求设计与 WRC 现场交付。",
    highlights: [
      "基于后端日志定位 Agent/RAG 链路耗时并精简知识上下文。",
      "沉淀 8 组多模态需求与验收关键点，持续维护 PRD 与 Feature List。",
      "协调 3 台 Moz2 展机的遥操 Demo、问题排查与客户联调。",
    ],
    metrics: ["问答响应耗时：约 5s → 约 2s", "3 台展机现场交付"],
  },
  {
    company: "京东科技",
    role: "AIoT 产品实习生",
    period: "2025.03 — 2025.08",
    domain: "VOICE AGENT / AIOT",
    featured: true,
    summary: "参与炒菜机器人从 0 到 1 的语音交互与内容体验设计，并通过日志分析推动问题闭环。",
    highlights: [
      "分析 100+ 条真实交互日志，归因识别、播报、流程与内容体验问题。",
      "设计口头禅去重、菜谱内容评测与语音交互优化策略并推动研发落地。",
      "协同算法、研发和业务团队跟进版本验证，将问题沉淀为可复用验收项。",
    ],
    metrics: ["90% 体验问题一周内解决", "口头禅重复率：40% → 10%", "菜谱满意度：90%+"],
  },
  {
    company: "网易云音乐",
    role: "商业化产品实习生",
    period: "2024.06 — 2024.09",
    domain: "ECOSYSTEM GROWTH",
    featured: true,
    summary: "参与小米生态会员合作与 TV 音乐频道集成，连接内容权益、设备入口与用户增长。",
    highlights: [
      "梳理会员权益、频道入口和跨端使用链路，输出合作方案与产品需求。",
      "协同商务、研发、设计及小米生态团队推进联调、验收与上线。",
      "围绕设备覆盖与活跃目标跟踪上线表现，支持后续资源配置判断。",
    ],
    metrics: ["TV 端 MAU：540 万 → 900 万", "覆盖约 6000 万台电视设备"],
  },
  {
    company: "科大讯飞",
    role: "数据产品实习生",
    period: "2023.07 — 2023.09",
    domain: "DATA PRODUCT",
    featured: false,
    summary: "制定标注规范并设计三类平台原型，改善数据任务的分发、验收与交付流程。",
    highlights: ["整理标注规范与异常案例", "输出任务、质检与交付三类平台原型"],
    metrics: ["交付效率提升约 100%"],
  },
];

export const education: Education[] = [
  {
    degree: "信息资源管理 硕士",
    institution: "武汉大学 信息管理学院",
    period: "2025.09 — 2027.06",
  },
  {
    degree: "电子商务 本科",
    institution: "同校",
    period: "2021.09 — 2025.06",
  },
];

export const capabilityGroups: Record<string, string[]> = {
  "AI 产品方法": ["需求分析", "PRD", "产品评测", "跨团队推进"],
  "Agent 与模型": ["Prompt Engineering", "RAG", "Workflow", "LLM 评测"],
  "数据与工程": ["Python", "SQL", "Claude Code", "OpenAI Codex"],
  "多模态与 IoT": ["语音交互", "Function Calling", "设备控制", "智能硬件"],
};

export const honors = [
  "GPA 3.7 / 4.0",
  "CET-6 535",
  "优秀学生干部",
  "互联网+校级三等奖",
  "国家二级运动员（三级跳远）",
];

export const resume = {
  profile,
  experiences,
  education,
  capabilityGroups,
  honors,
};
