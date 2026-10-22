import { useLayoutEffect, useRef, useState } from 'react';
import { RotateCw } from 'lucide-react';

export function KitchenVoice() {
  return (
    <figure className="kitchen-voice">
      <div className="kitchen-orbit" aria-hidden="true">
        <span>语音输入</span>
        <span>菜谱推荐</span>
        <span>设备控制</span>
      </div>
      <div className="kitchen-disc" aria-hidden="true">
        <div className="kitchen-wave">
          {[16, 34, 58, 84, 52, 30, 70, 94, 54, 28, 14].map((height, index) => (
            <i key={index} style={{ height }} />
          ))}
        </div>
        <span>JOYINSIDE</span>
      </div>
      <div className="kitchen-caption kitchen-product-caption">
        <span>京造炒菜机器人</span>
        <span>语音智能体接入</span>
      </div>
      <figcaption>语音交互 · 菜谱推荐 · 设备控制</figcaption>
    </figure>
  );
}

export function RecommendationDemo() {
  const [batchChanges, setBatchChanges] = useState(0);
  const [preference, setPreference] = useState('');
  const firstPreference = useRef<HTMLButtonElement>(null);
  const changeBatchButton = useRef<HTMLButtonElement>(null);
  const wasAsked = useRef(false);
  const asked = batchChanges >= 3;

  useLayoutEffect(() => {
    if (asked) firstPreference.current?.focus();
    else if (wasAsked.current) changeBatchButton.current?.focus();
    wasAsked.current = asked;
  }, [asked]);

  return (
    <div className="recommendation-demo">
      <div className="demo-topline">
        <span>推荐策略演示</span>
        <span>换批次数 {batchChanges} / 3</span>
      </div>
      <p className="demo-description">交互规则示意 · 非实际系统</p>
      <div className="demo-progress" aria-hidden="true">
        {[1, 2, 3].map((step) => (
          <span
            key={step}
            className={batchChanges >= step ? 'is-complete' : ''}
          >
            {step}
          </span>
        ))}
      </div>
      <output className="demo-response" aria-live="polite">
        <span className="demo-speaker">烹饪助手</span>
        <p>
          {preference
            ? `示意：根据「${preference}」补充筛选条件，再重新检索菜谱。`
            : asked
              ? '这几批都不合适，你更在意口味、食材，还是烹饪时间？'
              : batchChanges === 0
                ? '这批菜谱不合适，可以换一批。'
                : `已换批 ${batchChanges} 次。第 3 次换批时，会先询问你的偏好。`}
        </p>
      </output>
      {asked ? (
        <fieldset
          className="demo-preferences"
          aria-label="选择偏好方向"
          style={{ border: 0, padding: 0, marginInline: 0, minInlineSize: 0 }}
        >
          {['口味', '食材', '时间'].map((item, index) => (
            <button
              key={item}
              ref={index === 0 ? firstPreference : undefined}
              type="button"
              aria-pressed={preference === item}
              onClick={() => setPreference(item)}
            >
              {item}
            </button>
          ))}
        </fieldset>
      ) : (
        <button
          ref={changeBatchButton}
          className="demo-reject"
          type="button"
          onClick={() => setBatchChanges((count) => count + 1)}
        >
          换一批菜谱 <RotateCw size={16} aria-hidden="true" />
        </button>
      )}
      <div className="demo-bottomline">
        <span>
          {asked
            ? '第 3 次换批 → 澄清偏好 → 重新检索'
            : '点击换批，查看第 3 次时的策略变化'}
        </span>
        <button
          type="button"
          onClick={() => {
            setBatchChanges(0);
            setPreference('');
            changeBatchButton.current?.focus();
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
  if (id === 'diagnosis')
    return (
      <div className="story-diagram diagnosis-diagram">
        <p className="diagram-label">分层评测 / 端到端交互链路</p>
        <div className="diagnosis-count">
          100<span>+</span>
          <small>条真实交互日志</small>
        </div>
        <ol className="jd-evaluation-pipeline" aria-label="评测覆盖的交互链路">
          {[
            ['ASR', '语音识别'],
            ['Agent', '意图路由'],
            ['JSON', '指令下发'],
            ['设备', '执行反馈'],
          ].map(([label, description], index) => (
            <li key={label}>
              <span className="jd-step-number">0{index + 1}</span>
              <strong>{label}</strong>
              <span>{description}</span>
            </li>
          ))}
        </ol>
        <p className="diagram-note">
          从日志定位识别、理解、多轮与推荐问题，整理修复清单并跟进闭环。
        </p>
      </div>
    );
  if (id === 'voice')
    return (
      <div className="story-diagram jd-voice-diagram">
        <p className="diagram-label">ASR 准确率 / 语音交互优化</p>
        <div
          className="jd-asr-comparison"
          aria-label="ASR 准确率从 92% 提升至 95%"
        >
          <div>
            <span>优化前</span>
            <strong>
              92<small>%</small>
            </strong>
          </div>
          <span className="jd-asr-arrow" aria-hidden="true">
            →
          </span>
          <div>
            <span>优化后</span>
            <strong>
              95<small>%</small>
            </strong>
          </div>
        </div>
        <div className="jd-voice-work">
          <div>
            <strong>热词清单</strong>
            <p>改善语音识别准确率。</p>
          </div>
          <div>
            <strong>声纹识别 + 语义拒识</strong>
            <p>处理多人讲话、厨房噪声与闲聊误触发。</p>
          </div>
        </div>
        <p className="diagram-note">
          同时优化意图路由和模糊输入澄清，阶段性收敛闲聊入口。
        </p>
      </div>
    );
  if (id === 'prompt')
    return (
      <div className="story-diagram jd-model-diagram">
        <p className="diagram-label">模型体验 / 调优与验收</p>
        <ul className="jd-work-list">
          {[
            ['Prompt 对照调优', '改善固定口头禅与表达自然度'],
            ['菜谱生成评测', '参与生成结果的体验评测'],
            ['实地烹饪验收', '在实际烹饪中检验菜谱体验'],
          ].map(([title, description], index) => (
            <li key={title}>
              <span className="jd-step-number">0{index + 1}</span>
              <div>
                <strong>{title}</strong>
                <span>{description}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  if (id === 'sharing')
    return (
      <div className="story-diagram jd-sharing-diagram">
        <p className="diagram-label">菜谱分享 / MVP 需求与交付协调</p>
        <div className="jd-sharing-scope">
          <div className="jd-sharing-feature">
            <span>功能设计</span>
            <strong>菜谱分享 MVP</strong>
          </div>
          <ul aria-label="交付协调事项">
            <li>
              <span>01</span>后台迁移依赖
            </li>
            <li>
              <span>02</span>功能范围
            </li>
            <li>
              <span>03</span>交付排期
            </li>
          </ul>
        </div>
        <p className="diagram-note">
          结合后台迁移进度，协调本期功能范围与交付时间。
        </p>
      </div>
    );
  return null;
}
