import { experiences } from '@/lib/resume';

export type InternshipId = 'qianxun' | 'jd';

export type InternshipStory = {
  id: string;
  label: string;
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
  reflection: string;
};

export const internships: InternshipCase[] = [
  {
    id: 'qianxun',
    wordmark: 'SPIRIT AI',
    eyebrow: 'EMBODIED INTELLIGENCE / 具身智能',
    headline: ['让机器人，', '在现场可靠响应。'],
    introduction:
      '从一次回答的等待时间，到一台机器人在展会的完整表现。我参与 Moz2 多模态体验优化、前台迎宾产品设计与 WRC 现场交付，把模型能力连接到真实场景。',
    scope: '问答链路分析 / 多模态需求 / 现场协调',
    metrics: [
      { value: '5s → 2s', label: '问答响应耗时', note: '优化前后均为约数' },
      { value: '8 组', label: '需求与验收关键点', note: '前台迎宾 MVP' },
      { value: '3 台', label: 'Moz2 展机', note: 'WRC 现场协同保障' },
      { value: '7 模块', label: '竞品能力对标', note: '识别 P0 / P1 差距' },
    ],
    stories: [
      {
        id: 'response',
        label: '01 / RESPONSE',
        title: '先找到等待发生在哪里。',
        problem:
          'WRC 展会场景中，Moz2 问答响应慢、交互稳定性不足。需要把“回答慢”的体验问题，定位到可优化的 Agent / RAG 链路。',
        actions: [
          '基于后端日志定位链路耗时，精简知识库上下文。',
          '补充展会高频问答与合规 Prompt，让回答更贴合现场需求。',
          '完成动作、语音、问答全链路验证，确认优化后的整体表现。',
        ],
        result: '回答耗时由约 5 秒降至约 2 秒，支撑现场稳定展示。',
        artifact: '链路耗时定位 · 知识上下文优化 · 全链路验证',
      },
      {
        id: 'reception',
        label: '02 / MULTIMODAL',
        title: '一次迎宾，是一组协同动作。',
        problem:
          '前台迎宾 MVP 涉及语音、记忆、动作和灯效。产品需求需要明确任务流程，也需要覆盖异常边界。',
        actions: [
          '拆解迎宾任务全流程，细化 One-shot 语音与短期记忆需求。',
          '定义动作、灯效反馈及异常边界，沉淀 8 组需求与验收关键点。',
          '持续维护 PRD / Feature List，支持 Agent 与硬件团队对齐方案。',
        ],
        result: '将场景需求落实为可讨论、可验收的多模态产品定义。',
        artifact: 'PRD · Feature List · 8 组验收关键点',
      },
      {
        id: 'delivery',
        label: '03 / IN THE FIELD',
        title: '让产品走出文档，走进现场。',
        problem:
          '展会展示需要协调多台展机、遥操 Demo 与现场问题，同时把观察到的能力差距带回产品迭代。',
        actions: [
          '作为 WRC 现场协调人，协同保障 3 台 Moz2 展机的遥操 Demo 与问题排查。',
          '完成银河通用竞品 7 大模块对标，识别 P0 / P1 能力差距，推动需求池优先级调整。',
          '协助华为客户售前展示与联调，连接场景需求和实际设备表现。',
        ],
        result: '形成从现场交付、问题排查到需求优先级调整的工作闭环。',
        artifact: '展机协同保障 · 竞品对标 · 需求池优先级',
      },
    ],
    reflection:
      '这段实践让我更关注“完整的一次交互”：回答是否及时，动作与语音是否协同，异常是否有边界，以及最终能否在现场稳定完成。',
  },
  {
    id: 'jd',
    wordmark: 'JD',
    eyebrow: 'VOICE × AIOT / 京造炒菜机器人',
    headline: ['让厨房里的 AI，', '更懂下一句话。'],
    introduction:
      '参与京造炒菜机器人从 0 到 1 的产品建设，围绕语音交互、多轮对话、菜谱推荐与设备控制，把日志中的问题转化为可落地的产品策略。',
    scope: '体验诊断 / 对话策略 / 分享 MVP / 模型评测',
    metrics: [
      {
        value: '90%',
        label: '体验问题一周内解决',
        note: '基于 100+ 条交互日志分析',
      },
      {
        value: '40% → 10%',
        label: '口头禅重复率',
        note: '正向 / 反向 Prompt A/B 测试',
      },
      {
        value: '60% → 90%+',
        label: '生成菜谱满意度',
        note: '模型评测与实地验收',
      },
      { value: '↓ 50%', label: '推荐错误率', note: '菜谱标签匹配策略' },
    ],
    stories: [
      {
        id: 'diagnosis',
        label: '01 / DIAGNOSE',
        title: '把“体验不好”拆成可解决的问题。',
        problem:
          '语音、推荐和设备状态彼此关联，单一体验问题可能来自多个模块。需要找到根因，也需要明确推进顺序与责任人。',
        actions: [
          '独立分析 100+ 条真实用户交互日志，将问题归为 ASR 识别、意图理解、多轮对话、推荐准确性、流程状态、界面一致性 6 类。',
          '明确问题优先级和责任人，形成可执行的修复清单。',
          '参与体验问题攻坚，保障烹饪中语音交互服务与语音打断等核心功能按期上线。',
        ],
        result: '90% 的体验问题在一周内解决，核心功能按期上线。',
        artifact: '100+ 条日志 · 6 类问题 · 修复清单',
      },
      {
        id: 'conversation',
        label: '02 / CONVERSATION',
        title: '第三次拒绝，是理解偏好的机会。',
        problem:
          '模型机械地重复推荐，未能理解用户持续拒绝的原因。继续给菜谱，并不能让对话更接近用户的真实偏好。',
        actions: [
          '重构多轮交互 SOP：用户第三次拒绝推荐时，系统主动追问口味、食材或时间偏好。',
          '将触发逻辑固化为 PRD，交付研发团队实现。',
          '提出菜谱标签匹配法，补全推荐依据，改善推荐精准性。',
        ],
        result: '推荐错误率下降 50%，把重复推荐转为有方向的偏好澄清。',
        artifact: '多轮交互 SOP · PRD · 菜谱标签匹配',
      },
      {
        id: 'prompt',
        label: '03 / NATURAL VOICE',
        title: '自然的对话，需要具体的约束。',
        problem:
          'AI 对话中的口头禅频繁重复，削弱了语音交互的自然度。需要通过对比测试选择有效的提示词约束。',
        actions: [
          '独立复盘口头禅重复问题，构造正向与反向限制提示词。',
          '开展 A/B 测试，对比不同约束方式的表现。',
          '最终采用正向限制约束，推动对话人设与表达策略优化。',
        ],
        result: '口头禅重复率从 40% 降至 10%。',
        artifact: '问题复盘 · Prompt A/B 测试 · 正向约束',
      },
      {
        id: 'sharing',
        label: '04 / SHARE SIMPLY',
        title: '分享一道菜，不必先建一个社交网络。',
        problem:
          '菜谱分享 MVP 需要降低使用与实现复杂度，同时考虑发送端和接收端离线的情况。',
        actions: [
          '独立负责菜谱分享功能的需求落地，复用已有设备绑定关系。',
          '设计发送端与接收端的离线队列存储机制。',
          '规避复杂的 App 好友链，让 MVP 聚焦菜谱分享本身。',
        ],
        result: '以设备绑定关系和双端离线队列，定义极简分享方案。',
        artifact: '分享 MVP 需求 · 设备绑定复用 · 双端离线队列',
      },
      {
        id: 'evaluation',
        label: '05 / EVALUATE',
        title: '菜谱生成之后，还要经得起验收。',
        problem:
          '模型能够生成菜谱，还需要验证结果稳定性与实际使用体验，把测试发现反馈给算法团队。',
        actions: [
          '跟进菜谱大模型开发进度，测试生成结果的稳定性。',
          '支持测试团队实地验收菜谱结果，并反馈算法团队迭代优化。',
          '将模型输出、测试验收与产品体验联系起来，持续推进改进。',
        ],
        result: '生成菜谱满意度从 60% 提高到 90% 以上。',
        artifact: '稳定性测试 · 实地验收 · 算法迭代反馈',
      },
    ],
    reflection:
      '这段实践让我把对话体验看成一条产品链路：理解用户、更新偏好、给出内容、执行操作，再通过日志和验收判断它是否真正可用。',
  },
];

export function getInternship(id: string | undefined) {
  const detail = internships.find((item) => item.id === id);
  const experience = experiences.find((item) => item.detailId === id);
  return detail && experience ? { detail, experience } : undefined;
}
