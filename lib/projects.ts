export type ToolChoice = {
  name: string;
  reason: string;
};

export type ProjectCase = {
  id: "compliance" | "mock-interview" | "career-pathfinder";
  index: string;
  title: string;
  subtitle: string;
  audience: string;
  metric: string;
  tags: string[];
  situation: string;
  task: string;
  actions: string[];
  result: string[];
  humanRole: string[];
  agentRole: string[];
  collaborationLoop: string;
  tools: ToolChoice[];
  boundary: string;
  resumeCopy: string;
};

export const projects: ProjectCase[] = [
  {
    id: "compliance",
    index: "01",
    title: "用工合规智能系统",
    subtitle: "将企业制度、法规知识与 Agent 风险诊断连接成可溯源工作流",
    audience: "企业 HR 与法务",
    metric: "88 次提交 · 26 份真实材料 · Go 后端测试通过",
    tags: ["RAG", "Agent Trace", "Go + Vue", "企业合规"],
    situation:
      "企业制度、合同和访谈材料分散，人工审查慢，生成式结论又容易缺少法律依据与过程证据。",
    task:
      "定义从企业建档、材料上传、风险分级到整改报告的业务闭环，并让每条风险能够回查知识库来源。",
    actions: [
      "先审核 Agent 工作计划，再明确 UI 对齐、后端边界和验收要求。",
      "通过 HTTP 复用 WeKnora RAG，将知识片段写入风险依据和报告溯源。",
      "真实材料首测零风险后补失败测试与劳动合规种子规则。",
      "为法规 JSONL 建立 Prompt、校验脚本、质量报告和 Agent trace。",
    ],
    result: [
      "形成 Go、Vue 3、PostgreSQL 与 WeKnora 的全栈系统。",
      "真实处理 26 份企业制度、合同和访谈材料。",
      "首轮零风险经规则修复后识别出 2 项风险。",
      "本轮 Go 后端所有有测试的包均通过。",
    ],
    humanRole: [
      "定义业务问题与验收标准",
      "提供企业材料和法律知识",
      "审核计划并约束技术边界",
      "判断真实风险结果是否合理",
    ],
    agentRole: [
      "拆解数据、RAG、前后端任务",
      "实现接口、规则、报告和测试",
      "批量处理文档并做质量检查",
      "建立可观测 trace 与数据闸门",
    ],
    collaborationLoop:
      "真实企业材料首测 risk_count=0 → 我判断结果不可信 → Agent 增加失败测试和规则 → 复测识别 2 项风险。",
    tools: [
      {
        name: "Codex gpt-5.5",
        reason: "处理复杂跨栈规划、编码和系统调试。",
      },
      {
        name: "DeepSeek v4 Flash",
        reason: "用于部分低成本快速迭代任务。",
      },
      {
        name: "WeKnora + RAG",
        reason: "复用既有知识库能力，保留 Go 服务边界并支持证据溯源。",
      },
    ],
    boundary:
      "已确认 WeKnora 承载运行时 Agent，但未确认 WeKnora 底层具体 LLM；真实 RAG 复测当时也未传实际知识库 ID。",
    resumeCopy:
      "用工合规智能系统｜定义企业材料治理、知识库检索、风险诊断和报告生成闭环；与 AI Agent 协作完成 Go + Vue + PostgreSQL + WeKnora 全栈系统，为风险结论加入知识片段溯源和运行 trace；真实处理 26 份企业材料，本轮后端测试通过。",
  },
  {
    id: "mock-interview",
    index: "02",
    title: "MockInterview",
    subtitle: "围绕简历与回答动态追问的中文电话模拟面试 Agent",
    audience: "产品经理求职者",
    metric: "238 项测试通过 · 77 份面经 · 267 道问题",
    tags: ["Voice Agent", "LangGraph", "DeepSeek", "混合检索"],
    situation:
      "传统题库式模拟面试与候选人简历脱节，RAG 生硬抽题，难以形成真实、连续的追问体验。",
    task:
      "建立从面经采集、结构化、检索到语音面试的完整链路，并让系统根据简历、回答和阶段状态动态追问。",
    actions: [
      "真实试用后推翻“知识库直接决定问题”的早期方向。",
      "将知识库降为流程与风格证据，重写简历中心的阶段状态机。",
      "用 FunASR、Edge TTS 和 DeepSeek 构建中文语音闭环。",
      "逐项修复代理、预热、锁竞争、浏览器播放、静音与状态持久化问题。",
    ],
    result: [
      "形成采集、结构化、混合检索、状态机和电话模式闭环。",
      "历史结构化抽取 F1 达 0.9186。",
      "一次实测链路约 2.1 秒，常态记录约 4–6 秒。",
      "本轮 238 项测试通过，1 项外部真实环境 E2E 跳过。",
    ],
    humanRole: [
      "提供建设计划与目标用户",
      "确定模型环境和产品约束",
      "持续进行真实语音试用",
      "纠正 RAG 与面试角色的产品关系",
    ],
    agentRole: [
      "设计数据与 Prompt 契约",
      "实现采集、检索和语音链路",
      "分析 15 份真实面试记录",
      "把用户报错固化为代码与测试",
    ],
    collaborationLoop:
      "真实试用发现问题与简历无关 → 我重新定义 LLM、知识库与简历的关系 → Agent 重写 Prompt、图状态和持久化 → 面试转为上下文驱动。",
    tools: [
      {
        name: "Codex gpt-5.6-sol",
        reason: "承担跨数据、后端和语音链路的系统工程。",
      },
      {
        name: "DeepSeek v4 Flash",
        reason: "OpenAI 兼容、中文能力和成本适合多轮面试。",
      },
      {
        name: "LangGraph",
        reason: "显式管理阶段推进、追问分支与 checkpoint。",
      },
      {
        name: "FunASR + Edge TTS",
        reason: "本地中文识别与低成本自然语音输出。",
      },
    ],
    boundary:
      "知识库规模仍低于原定 2000 份面经和 3000 道问题；外部平台真实 E2E 和移动端音频仍需继续验证。",
    resumeCopy:
      "MockInterview｜从真实面经构建可追溯知识库与中文电话面试 Agent；通过真实试用将“RAG 抽题”纠正为“LLM 围绕简历和回答动态追问”，使用 LangGraph、DeepSeek、FunASR、Edge TTS 完成语音闭环；本轮 238 项测试通过。",
  },
  {
    id: "career-pathfinder",
    index: "03",
    title: "Career Pathfinder",
    subtitle: "有证据、可反证、保护隐私的职业决策 Agent",
    audience: "面临职业路径选择的中国学生",
    metric: "行为契约 PASS · 6 个重要问题修复 · 模块化 Skill",
    tags: ["Decision Agent", "Evidence", "Safety", "Evaluation"],
    situation:
      "职业推荐容易过早下结论、使用人格标签和伪精确分数，也常把制度事实与个人体验混为一谈。",
    task:
      "设计一个在证据不足时持续追问、能呈现反证与不确定性、并给出可逆验证实验的职业决策 Agent。",
    actions: [
      "把画像改为连续维度、行为证据和置信度，不使用 MBTI 式标签。",
      "建立官方制度事实与从业者体验双轨证据。",
      "以 RED 基线、GREEN 复测和独立审查验证 Agent 行为。",
      "把 AI 岗位冲击拆成可自动化、被增强和需人负责的任务组合。",
    ],
    result: [
      "形成单入口、按需加载的模块化 Career Pathfinder skill。",
      "基线测试暴露过早推荐、伪评分与默认大厂更优等问题并完成修复。",
      "独立审查发现并修复 6 个 Important 问题，复审无 Critical/Important。",
      "本轮结构、链接、元数据与跨文件契约校验 PASS。",
    ],
    humanRole: [
      "定义中国学生决策情境",
      "提出行为锚点与持续追问要求",
      "拒绝标签化人格结论",
      "补充长期回报和 AI 韧性视角",
    ],
    agentRole: [
      "审阅并识别 demo 结构缺陷",
      "设计证据、画像与安全协议",
      "运行 RED/GREEN 行为评测",
      "根据独立审查修正规则",
    ],
    collaborationLoop:
      "基线场景暴露伪评分和过早推荐 → 我补充证据充分度与长期韧性要求 → Agent 将约束写入模块和测试 → 独立复审清除高等级问题。",
    tools: [
      {
        name: "Codex gpt-5.6-sol",
        reason: "适合长上下文规则设计、反例推理和评测脚本实现。",
      },
      {
        name: "模块化 Agent Skill",
        reason: "单入口、按需读取规则，控制上下文和维护成本。",
      },
      {
        name: "RED/GREEN + 独立审查",
        reason: "验证 Agent 实际行为，而不只检查文件存在。",
      },
    ],
    boundary:
      "当前 PASS 是结构和行为夹具合同通过，不等同于大规模真实学生效果；证据充分度门槛也不等同于 95% 的统计准确率。",
    resumeCopy:
      "Career Pathfinder｜设计面向中国学生的职业决策 Agent，以行为证据、置信度、反证和可逆实验替代人格标签与伪精确评分；使用模块化 Skill、RED/GREEN 场景测试和独立审查约束 Agent 行为，修复 6 个重要问题并通过结构与契约校验。",
  },
];
