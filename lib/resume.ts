export type Experience = {
  detailId?: 'qianxun' | 'jd';
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
  name: '马毓廷',
  role: 'AI 产品经理',
  phone: '166-4356-2796',
  email: '3188901755@qq.com',
  city: '湖北武汉',
  age: '23 岁',
  gender: '男',
  height: '180 cm',
  weight: '67 kg',
  ethnicity: '汉族',
  headline: '机器人与语音交互产品',
  introduction:
    '武汉大学信息资源管理硕士在读。实习工作主要围绕机器人多模态交互、语音智能体和智能硬件，负责场景需求、交互策略与体验评测。',
};

export const experiences: Experience[] = [
  {
    company: '千寻智能',
    detailId: 'qianxun',
    role: '机器人产品实习生（多模态）',
    period: '2026.08 — 2026.11（预计）',
    domain: 'EMBODIED AI',
    featured: true,
    summary:
      '参与茶点服务与 MOZ2 接待机器人的多模态交互建设，负责场景规划、语音与视觉需求及验收标准。',
    highlights: [
      '拆解迎宾、选品、确认、递交与收尾流程，输出语音和视觉一期 PRD。',
      '推动全双工、短期记忆与指代澄清，协同声学调优及 DVT 样机投产。',
      '设计语音、视觉分层评测，参与 WRC 问答优化与飞书远程任务方案。',
    ],
    metrics: ['语音延迟：2.5s → 1.6s', 'WRC 问答延迟：5s → 2.5s'],
  },
  {
    company: '京东科技',
    detailId: 'jd',
    role: 'AI 产品经理实习生',
    period: '2026.02 — 2026.06',
    domain: 'VOICE AGENT / AIOT',
    featured: true,
    summary:
      '参与 JOYINSIDE 接入京造炒菜机器人的产品建设，负责体验评测、菜谱推荐策略与语音交互设计。',
    highlights: [
      '分析 100+ 条真实交互日志，按识别、意图路由、指令下发与设备执行分层评测。',
      '为 200 道菜谱补充标签，设计第 3 次换批时主动澄清偏好的推荐策略。',
      '优化语音误触发和热词识别，参与 Prompt 调优、烹饪验收及菜谱分享 MVP 设计。',
    ],
    metrics: ['200 道菜谱标签', 'ASR 准确率：92% → 95%'],
  },
  {
    company: '网易云音乐',
    role: '产品经理实习生（IoT 与商业化）',
    period: '2025.06 — 2025.09',
    domain: 'ECOSYSTEM GROWTH',
    featured: true,
    summary: '参与会员合作方案、TV 端功能集成及账号、搜索、语音点播体验优化。',
    highlights: [
      '对比四种分润模式，选择聚合会员方案并协同商务推进落地。',
      '采用 SDK + API 方式，将画报、氛围漫游等功能前置到 TV 系统层。',
      '梳理账号绑定、搜索召回、语音点播链路，输出三项体验优化方案。',
    ],
    metrics: ['4 种分润模式对比', '3 项体验优化方案'],
  },
  {
    company: '科大讯飞',
    role: '数据产品经理实习生',
    period: '2023.12 — 2024.02',
    domain: 'DATA PRODUCT',
    featured: false,
    summary: '分析智能座舱中的大模型需求，撰写并推行《知识问答数据标注规范》。',
    highlights: [
      '规范覆盖问答判断、多轮问答与知识检索召回',
      '开展标注培训，规范被采纳为项目统一生产标准',
    ],
    metrics: ['标注规范纳入项目生产标准'],
  },
];

export const education: Education[] = [
  {
    degree: '信息资源管理 硕士',
    institution: '武汉大学 信息管理学院',
    period: '2025.09 — 2027.06',
  },
  {
    degree: '电子商务 本科',
    institution: '武汉大学 信息管理学院',
    period: '2021.09 — 2025.06',
  },
];

export const capabilityGroups: Record<string, string[]> = {
  'AI 产品方法': ['需求分析', 'PRD', '产品评测', '跨团队推进'],
  'Agent 与模型': ['Prompt Engineering', 'RAG', 'Workflow', 'LLM 评测'],
  数据与工程: ['Python', 'SQL', 'Claude Code', 'OpenAI Codex'],
  '多模态与 IoT': ['语音交互', 'Function Calling', '设备控制', '智能硬件'],
};

export const honors = [
  'CET-6 535',
  '优秀学生干部',
  '互联网+校级三等奖',
  '国家二级运动员（三级跳远）',
];

export const resume = {
  profile,
  experiences,
  education,
  capabilityGroups,
  honors,
};
