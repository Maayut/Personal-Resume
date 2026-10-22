import { experiences } from '@/lib/resume';

export type InternshipId = 'qianxun' | 'jd';

export type InternshipStory = {
  id: string;
  label: string;
  navTitle: string;
  title: string;
  problem: string;
  actions: string[];
  result: string;
  artifact: string;
};

export type InternshipCase = {
  id: InternshipId;
  wordmark: string;
  eyebrow: string;
  headline: [string, string];
  introduction: string;
  scope: string;
  metrics: { value: string; label: string; note: string }[];
  stories: InternshipStory[];
  reflectionTitle: string;
  reflection: string;
};

export const internships: InternshipCase[] = [
  {
    id: 'qianxun',
    wordmark: 'SPIRIT AI',
    eyebrow: 'EMBODIED INTELLIGENCE / 具身智能',
    headline: ['茶点服务与接待机器人', '多模态交互产品实践'],
    introduction:
      '在千寻智能，我参与茶点服务与 MOZ2 接待机器人的交互设计，负责 Demo 流程、语音与视觉需求，并参与声学调试、分层评测和场景交付。',
    scope: '场景规划 / 语音交互 / 视觉与动作 / 评测验收',
    metrics: [
      {
        value: '2.5s → 1.6s',
        label: '语音端到端延迟',
        note: '云侧 omni + 本地 ASR 方案',
      },
      { value: '5s → 2.5s', label: 'WRC 问答延迟', note: '现场问答链路优化' },
      { value: 'DVT', label: '样机投产', note: '协同供应商与硬件团队调优' },
      { value: '语音 / 视觉', label: '分层评测', note: '单项能力与整机交互' },
    ],
    stories: [
      {
        id: 'reception',
        label: '01 / SCENARIO',
        navTitle: '场景规划',
        title: '茶点服务与接待流程',
        problem:
          '一轮服务包含迎宾、了解需求、确认选品、拿取递交和服务收尾。每个环节需要哪些交互能力、哪些能力先做，是场景规划的重点。',
        actions: [
          '拆解迎宾、对话选品、澄清确认、拿取递交、服务收尾五个环节。',
          '按场景需要规划交互能力层级，输出语音与视觉一期 PRD。',
          '推动需求优先级讨论，梳理茶点与接待项目可复用的能力。',
        ],
        result:
          '完成场景流程与一期需求定义，明确语音、视觉能力的优先级和复用范围。',
        artifact: '场景 Demo 流程 · 语音一期 PRD · 视觉一期 PRD',
      },
      {
        id: 'response',
        label: '02 / VOICE',
        navTitle: '语音交互',
        title: '全双工对话与声学调优',
        problem:
          '反复唤醒、上下文缺失和播报自打断会中断对话。除了对话策略，也需要检查机器人自身声音引发的误触发。',
        actions: [
          '推动全双工对话、短期记忆、指代澄清功能的需求与落地。',
          '通过对照测试定位自声误触发，协同供应商、硬件团队推进声学调优。',
          '提出云侧 omni + 本地 ASR 方案，替代 ASR + VAD 级联。',
        ],
        result:
          '语音端到端延迟由 2.5 秒降至 1.6 秒；声学调优工作推进至 DVT 样机投产。',
        artifact: '全双工与记忆需求 · 声学对照测试 · omni 方案',
      },
      {
        id: 'perception',
        label: '03 / PERCEPTION',
        navTitle: '视觉与动作',
        title: '视觉能力与服务动作',
        problem:
          '主动迎宾、对象识别、手势回应和指向理解，需要同时考虑视觉能力、可用动作和当前任务状态。',
        actions: [
          '明确各项视觉能力的边界与需求优先级。',
          '提出阶段指标：人脸识别 1.5m、人数及动作识别 2m、接近检测 3m。',
          '联动算法、硬件及运控团队，推动视觉能力、动作资源与茶点任务状态协同。',
        ],
        result:
          '形成视觉能力边界、优先级和跨团队协作需求。上述距离是阶段指标，并非实测达标结果。',
        artifact: '视觉能力边界 · 分阶段指标 · 动作与任务状态需求',
      },
      {
        id: 'validation',
        label: '04 / VALIDATION',
        navTitle: '评测验收',
        title: '语音、视觉与整机评测',
        problem:
          '单项模型测试不足以判断机器人能否完成一次交互。评测需要区分模块问题，也要覆盖现场环境与完整任务。',
        actions: [
          '语音侧按距离、性别与音色、说话方向、办公室人声及机械噪声设计测试条件。',
          '分别定义唤醒、ASR、VAD、TTS、全双工指标，支持逐层定位问题。',
          '视觉侧纳入距离、方向、光照、遮挡及目标位置变化，结合机器人端到端交互进行评估。',
        ],
        result:
          '整理可复现的测试场景与分层指标，覆盖单项模型能力和机器人整机交互。',
        artifact: '语音测试条件 · 视觉测试条件 · 分层评测指标',
      },
      {
        id: 'delivery',
        label: '05 / DELIVERY',
        navTitle: '场景交付',
        title: 'WRC 问答与远程任务入口',
        problem:
          'WRC 展示需要降低问答等待时间。面对面交互之外，也需要支持远程发起任务和查看执行状态。',
        actions: [
          '参与 WRC 场景的问答链路优化。',
          '设计飞书 Channel 远程任务入口及交互卡片。',
          '梳理任务发起与执行状态反馈，将远程交互纳入产品方案。',
        ],
        result:
          'WRC 问答端到端延迟由 5 秒降至 2.5 秒；完成飞书远程任务交互方案。',
        artifact: 'WRC 问答优化 · 飞书交互卡片 · 任务状态反馈方案',
      },
    ],
    reflectionTitle: '需求与验收的对应关系',
    reflection:
      '这段工作的核心是明确机器人在具体场景里该做什么，以及如何验收。语音需要检查延迟、误触发和上下文，视觉需要注明距离与环境条件，动作则需要与茶点任务状态对应。',
  },
  {
    id: 'jd',
    wordmark: 'JD',
    eyebrow: 'JOYINSIDE / 京造炒菜机器人',
    headline: ['京造炒菜机器人', 'JOYINSIDE 语音交互'],
    introduction:
      '参与 JOYINSIDE 语音智能体接入京造炒菜机器人的产品建设。我的工作包括端到端体验评测、菜谱推荐策略、语音交互设计，以及菜谱分享 MVP 的需求与排期协调。',
    scope: '体验评测 / 菜谱推荐 / 语音交互 / 功能设计',
    metrics: [
      {
        value: '100+',
        label: '真实交互日志',
        note: '定位识别、理解、多轮和推荐问题',
      },
      {
        value: '200 道',
        label: '菜谱标签补充',
        note: '菜系、口味、时长、难度',
      },
      {
        value: '第 3 次',
        label: '换批时澄清偏好',
        note: '确认需求后重新检索',
      },
      { value: '92% → 95%', label: 'ASR 准确率', note: '热词清单优化' },
    ],
    stories: [
      {
        id: 'diagnosis',
        label: '01 / DIAGNOSE',
        navTitle: '体验评测',
        title: '端到端体验评测',
        problem:
          '用户说出指令后，需要依次完成识别、意图路由、指令下发和设备执行。体验问题要沿这条链路逐层检查。',
        actions: [
          '建立覆盖 ASR、Agent 意图路由、JSON 指令下发与设备执行的分层评测机制。',
          '分析 100+ 条真实交互日志，定位识别、理解、多轮、推荐等问题。',
          '输出修复清单，协同算法、研发及供应商跟进处理与验证。',
        ],
        result: '建立分层评测机制，并根据真实交互日志形成修复清单。',
        artifact: '分层评测机制 · 日志分析 · 修复清单',
      },
      {
        id: 'conversation',
        label: '02 / CONVERSATION',
        navTitle: '菜谱推荐',
        title: '菜谱标签与偏好澄清',
        problem:
          '用户对推荐结果不满意时，连续刷新菜谱无法补充偏好信息。检索需要更完整的菜谱特征，也需要主动确认需求。',
        actions: [
          '为 200 道菜谱补充菜系、口味、时长、难度等标签。',
          '设计第 3 次换批时主动澄清偏好的策略，确认需求后重新检索。',
          '结合标签特征与澄清结果调整推荐，减少无方向的重复换批。',
        ],
        result: '推荐换批次数控制在 3 次以内。',
        artifact: '200 道菜谱标签 · 偏好澄清策略 · 重新检索逻辑',
      },
      {
        id: 'voice',
        label: '03 / VOICE',
        navTitle: '语音优化',
        title: '厨房环境下的语音识别',
        problem:
          '厨房噪声、多人讲话和闲聊误触发会干扰烹饪操作，需要优先保障烹饪主流程。',
        actions: [
          '针对噪声、多人讲话及误触发问题，采用声纹识别与语义拒识方案。',
          '优化意图路由和模糊输入澄清机制，阶段性收敛闲聊入口。',
          '构建热词清单，改善 ASR 识别表现。',
        ],
        result: 'ASR 准确率由 92% 提升至 95%。',
        artifact: '声纹与语义拒识方案 · 意图路由策略 · 热词清单',
      },
      {
        id: 'prompt',
        label: '04 / MODEL EXPERIENCE',
        navTitle: '模型体验',
        title: '表达调优与菜谱验收',
        problem:
          'Agent 固定口头禅影响表达自然度；生成的菜谱也需要结合实际烹饪检查。',
        actions: [
          '通过 Prompt 对照调优，改善固定口头禅与重复表达。',
          '参与菜谱生成结果评测。',
          '参与实地烹饪验收，检查菜谱在实际操作中的表现。',
        ],
        result: '完成表达调优与菜谱评测工作，参与实地烹饪验收。',
        artifact: 'Prompt 对照调优 · 菜谱评测 · 烹饪验收',
      },
      {
        id: 'sharing',
        label: '05 / SHARING',
        navTitle: '分享 MVP',
        title: '菜谱分享 MVP',
        problem:
          '菜谱分享功能涉及后台迁移依赖，需要同时明确本期范围和交付排期。',
        actions: [
          '设计菜谱分享功能 MVP。',
          '梳理后台迁移对功能实现的依赖。',
          '协调功能范围与交付排期。',
        ],
        result: '完成分享 MVP 设计，并协调后台依赖、功能范围与排期。',
        artifact: '分享 MVP 方案 · 后台依赖梳理 · 交付排期',
      },
    ],
    reflectionTitle: '烹饪主流程与功能范围',
    reflection:
      '这段工作以烹饪主流程为优先：语音侧减少误触发，推荐侧通过标签和澄清补足偏好，评测覆盖指令下发与设备执行。菜谱分享则结合后台迁移进度确定 MVP 范围与排期。',
  },
];

export function getInternship(id: string | undefined) {
  const detail = internships.find((item) => item.id === id);
  const experience = experiences.find((item) => item.detailId === id);
  return detail && experience ? { detail, experience } : undefined;
}
