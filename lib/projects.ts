export type ToolChoice = {
  name: string;
  reason: string;
};

export type ProjectCase = {
  id:
    | "compliance"
    | "mock-interview"
    | "career-pathfinder"
    | "resume-autofill";
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
  },
  {
    id: "resume-autofill",
    index: "04",
    title: "FillResume｜CVMax 网申助手复刻",
    subtitle: "从商业插件逆向调研到隐私优先的本地网申自动填表工具",
    audience: "高频投递的秋招求职者",
    metric: "42/42 单元测试 · Chrome E2E 通过 · 零自动提交",
    tags: ["Chrome MV3", "Clean-room", "Form Autofill", "Local-first"],
    situation:
      "秋招需要在不同招聘系统重复填写同一份资料；现有商业工具虽能提效，但实现源码不公开，云端匹配、敏感数据权限和失败边界难以核验。",
    task:
      "在不复制 CVMax 私有源码、接口或协议的前提下，复刻其核心网申填表体验，并把资料安全、人工终审和投递留痕设为硬边界。",
    actions: [
      "检索官方商店、隐私政策与开发者信息，下载并静态分析官方分发 CRX，建立可验证的功能矩阵。",
      "我试用原插件并收窄范围后，Agent 将方案改为本地确定性字段分类器，不依赖云端 AI 匹配。",
      "实现字段语义识别、原生 setter 与事件触发、动态表单重扫、资料存储和投递记录去重。",
      "用 TDD、生产构建、隔离 Chrome E2E 和独立代码审查验证保存、填表、不自动提交与留痕闭环。",
    ],
    result: [
      "形成可加载使用的 Chrome Manifest V3 扩展及发布 ZIP。",
      "42/42 单元测试通过，并完成生产构建与独立代码审查。",
      "Chrome E2E 覆盖保存资料、填写测试表单、不自动提交和生成一条投递记录。",
      "个人资料与投递记录仅保存在 chrome.storage.local，不连接自建服务器。",
    ],
    humanRole: [
      "提供 CVMax 目标链接与真实求职场景",
      "安装登录原插件并完成安全试用",
      "决定只保留自动填表与投递留痕",
      "坚持人工审核提交和本地隐私边界",
    ],
    agentRole: [
      "调查公开资料并分析分发 CRX",
      "完成 clean-room 架构与风险取舍",
      "实现扩展、测试、构建和安装包",
      "用浏览器 E2E 与独立审查验证结果",
    ],
    collaborationLoop:
      "我提出复刻目标并完成原插件试用 → Agent 还原功能与数据边界 → 我把范围收窄为本地填表和留痕 → Agent 以 TDD 实现并用 Chrome E2E 验证。",
    tools: [
      {
        name: "Codex Agent",
        reason: "适合持续进行资料调查、长任务拆解、跨文件实现和测试闭环；历史记录未明确具体模型版本。",
      },
      {
        name: "Chrome + CRX 静态分析",
        reason: "在找不到官方源码时，从公开分发物与真实交互中确认功能和边界，而不是凭外观猜测。",
      },
      {
        name: "Node Test + Playwright",
        reason: "同时覆盖字段规则、记录去重等逻辑，以及真实浏览器内的端到端行为。",
      },
    ],
    boundary:
      "这是 clean-room 功能复刻，不是 CVMax 官方源码；未复刻其服务端 AI 匹配、账号与商业系统，closed Shadow DOM、文件上传和部分自研控件仍需人工处理。",
  },
];
