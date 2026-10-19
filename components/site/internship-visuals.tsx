import { useState } from 'react';

export function EmbodiedField() {
  return (
    <figure className="embodied-field">
      <div className="field-caption">
        <span>MOZ2 / MULTIMODAL</span>
        <span>01 — 03</span>
      </div>
      <svg
        viewBox="0 0 560 440"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <radialGradient id="field-glow">
            <stop stopColor="#667dff" stopOpacity=".3" />
            <stop offset="1" stopColor="#667dff" stopOpacity="0" />
          </radialGradient>
          <linearGradient
            id="field-line"
            x1="80"
            y1="60"
            x2="480"
            y2="400"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#a4b1ff" />
            <stop offset="1" stopColor="#4d6aff" stopOpacity=".15" />
          </linearGradient>
        </defs>
        <circle cx="280" cy="220" r="220" fill="url(#field-glow)" />
        {[200, 154, 108].map((radius) => (
          <circle
            key={radius}
            cx="280"
            cy="220"
            r={radius}
            stroke="#7185e6"
            strokeOpacity=".22"
            strokeDasharray={radius === 154 ? '2 7' : undefined}
          />
        ))}
        <ellipse
          cx="280"
          cy="220"
          rx="205"
          ry="65"
          transform="rotate(-32 280 220)"
          stroke="url(#field-line)"
        />
        <ellipse
          cx="280"
          cy="220"
          rx="205"
          ry="65"
          transform="rotate(32 280 220)"
          stroke="url(#field-line)"
        />
        <path d="M78 220H482M280 18V422" stroke="#7185e6" strokeOpacity=".16" />
        <rect
          x="226"
          y="163"
          width="108"
          height="114"
          rx="30"
          fill="#182143"
          stroke="#8d9cf7"
        />
        <rect x="245" y="188" width="70" height="29" rx="14.5" fill="#0d1227" />
        <path
          d="M255 203h10m30 0h10M262 239h36"
          stroke="#a6b5ff"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path d="M280 150v-14m-7 0h14" stroke="#a6b5ff" strokeWidth="2" />
        {[
          [120, 110],
          [440, 110],
          [120, 330],
          [440, 330],
        ].map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <circle cx={x} cy={y} r="7" fill="#9dabff" />
            <circle cx={x} cy={y} r="14" stroke="#7b8cff" strokeOpacity=".4" />
          </g>
        ))}
      </svg>
      <span className="field-node field-node-one">语音 / VOICE</span>
      <span className="field-node field-node-two">问答 / KNOWLEDGE</span>
      <span className="field-node field-node-three">动作 / ACTION</span>
      <span className="field-node field-node-four">灯效 / FEEDBACK</span>
      <figcaption>
        <span className="field-dot" /> 多模态工作范围示意
      </figcaption>
    </figure>
  );
}

export function KitchenVoice() {
  return (
    <figure className="kitchen-voice">
      <div className="kitchen-orbit" aria-hidden="true">
        <span>听见</span>
        <span>理解</span>
        <span>回应</span>
      </div>
      <div className="kitchen-disc" aria-hidden="true">
        <div className="kitchen-wave">
          {[16, 34, 58, 84, 52, 30, 70, 94, 54, 28, 14].map((height, index) => (
            <i key={index} style={{ height }} />
          ))}
        </div>
        <span>VOICE × RECIPE</span>
      </div>
      <div className="kitchen-caption">
        <span>从一句话</span>
        <span>到一餐饭。</span>
      </div>
      <figcaption>语音交互 · 菜谱推荐 · 设备控制</figcaption>
    </figure>
  );
}

export function RecommendationDemo() {
  const [rejections, setRejections] = useState(0);
  const [preference, setPreference] = useState('');
  const asked = rejections >= 3;

  return (
    <div className="recommendation-demo">
      <div className="demo-topline">
        <span>TRY THE RULE</span>
        <span>拒绝次数 {rejections} / 3</span>
      </div>
      <p className="demo-description">交互规则演示 · 非真实用户对话</p>
      <div className="demo-progress" aria-hidden="true">
        {[1, 2, 3].map((step) => (
          <span key={step} className={rejections >= step ? 'is-rejected' : ''}>
            {step}
          </span>
        ))}
      </div>
      <output className="demo-response" aria-live="polite">
        <span className="demo-speaker">烹饪助手</span>
        <p>
          {preference
            ? `已记录「${preference}」偏好，进入下一轮推荐。`
            : asked
              ? '想换个方向吗？你更在意口味、食材，还是烹饪时间？'
              : rejections === 0
                ? '来看看今天的菜谱推荐。'
                : '收到，再换一道菜谱。'}
        </p>
      </output>
      {asked ? (
        <div className="demo-preferences" aria-label="选择偏好方向">
          {['口味', '食材', '时间'].map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={preference === item}
              onClick={() => setPreference(item)}
            >
              {item}
            </button>
          ))}
        </div>
      ) : (
        <button
          className="demo-reject"
          type="button"
          onClick={() => setRejections((count) => count + 1)}
        >
          不想吃，换一个 <span aria-hidden="true">↻</span>
        </button>
      )}
      <div className="demo-bottomline">
        <span>
          {asked
            ? '第三次拒绝 → 主动澄清偏好'
            : '连续点击，试试第三次会发生什么'}
        </span>
        <button
          type="button"
          onClick={() => {
            setRejections(0);
            setPreference('');
          }}
        >
          重置
        </button>
      </div>
    </div>
  );
}

export function StoryVisual({ id }: { id: string }) {
  if (id === 'conversation') return <RecommendationDemo />;
  if (id === 'response')
    return (
      <div className="story-diagram response-diagram">
        <p className="diagram-label">RESPONSE TIME / 问答耗时</p>
        <div className="response-row">
          <span>优化前</span>
          <div className="response-bar response-before" />
          <strong>≈ 5s</strong>
        </div>
        <div className="response-row">
          <span>优化后</span>
          <div className="response-bar response-after" />
          <strong>≈ 2s</strong>
        </div>
        <p className="diagram-note">日志定位 → 上下文精简 → 全链路验证</p>
      </div>
    );
  if (id === 'reception')
    return (
      <div className="story-diagram reception-diagram">
        <p className="diagram-label">RECEPTION MVP / 需求范围</p>
        <div className="reception-grid">
          {['One-shot 语音', '短期记忆', '动作反馈', '灯效反馈'].map(
            (label, index) => (
              <div key={label}>
                <span>0{index + 1}</span>
                <strong>{label}</strong>
              </div>
            ),
          )}
        </div>
        <div className="reception-boundary">异常边界 + 验收关键点</div>
        <p className="diagram-note">
          以上为工作维度概览，完整需求沉淀为 8 组。
        </p>
      </div>
    );
  if (id === 'delivery')
    return (
      <div className="story-diagram delivery-diagram">
        <p className="diagram-label">WRC / 现场交付</p>
        <div className="robot-fleet">
          {['01', '02', '03'].map((number) => (
            <div key={number}>
              <span className="robot-head" aria-hidden="true">
                <i />
                <i />
              </span>
              <strong>MOZ2 / {number}</strong>
            </div>
          ))}
        </div>
        <div className="diagram-chips">
          <span>遥操 Demo</span>
          <span>现场问题排查</span>
          <span>客户联调</span>
        </div>
      </div>
    );
  if (id === 'diagnosis')
    return (
      <div className="story-diagram diagnosis-diagram">
        <p className="diagram-label">LOG → ACTION / 体验问题分类</p>
        <div className="diagnosis-count">
          100<span>+</span>
          <small>条真实交互日志</small>
        </div>
        <ul className="diagnosis-list">
          {[
            'ASR 识别',
            '意图理解',
            '多轮对话',
            '推荐准确性',
            '流程状态',
            '界面一致性',
          ].map((label, index) => (
            <li key={label}>
              <span>0{index + 1}</span>
              {label}
            </li>
          ))}
        </ul>
      </div>
    );
  if (id === 'prompt')
    return (
      <div className="story-diagram prompt-diagram">
        <p className="diagram-label">PROMPT A/B / 口头禅重复率</p>
        <div className="prompt-comparison">
          <div>
            <span>优化前</span>
            <strong>
              40<small>%</small>
            </strong>
          </div>
          <span aria-hidden="true">↘</span>
          <div>
            <span>正向限制约束</span>
            <strong>
              10<small>%</small>
            </strong>
          </div>
        </div>
        <p className="diagram-note">
          对比正向、反向限制提示词后，采用正向约束。
        </p>
      </div>
    );
  if (id === 'sharing')
    return (
      <div className="story-diagram sharing-diagram">
        <p className="diagram-label">RECIPE SHARING / 方案概览</p>
        <div className="sharing-flow">
          <div>
            <strong>发送端</strong>
            <span>离线队列</span>
          </div>
          <span aria-hidden="true">→</span>
          <div>
            <strong>接收端</strong>
            <span>离线队列</span>
          </div>
        </div>
        <div className="sharing-binding">复用设备绑定关系</div>
        <p className="diagram-note">MVP 聚焦菜谱传递，减少社交关系链复杂度。</p>
      </div>
    );
  return (
    <div className="story-diagram evaluation-diagram">
      <p className="diagram-label">RECIPE QUALITY / 生成菜谱满意度</p>
      <div className="evaluation-value">
        60% <span aria-hidden="true">↗</span> <strong>90%+</strong>
      </div>
      <ol className="evaluation-flow">
        <li>生成稳定性测试</li>
        <li>实地验收</li>
        <li>反馈算法迭代</li>
      </ol>
    </div>
  );
}
