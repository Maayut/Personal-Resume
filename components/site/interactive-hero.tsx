import { MotionConfig, motion } from 'motion/react';

import { useBackgroundVideo } from '@/hooks/use-background-video';
import { useTypewriter } from '@/hooks/use-typewriter';
import { profile } from '@/lib/resume';

const heroVideoUrl =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260601_110537_3a579fa0-7bbc-4d94-9d25-0e816c7840f5.mp4';

export function InteractiveHero() {
  const { videoRef, failed, markFailed } = useBackgroundVideo();
  const { displayed, done } = useTypewriter(profile.headline);

  return (
    <section className={`resume-hero${failed ? ' has-video-fallback' : ''}`}>
      <video
        ref={videoRef}
        className="hero-video"
        muted
        playsInline
        preload="metadata"
        poster={`${import.meta.env.BASE_URL}media/hero-fallback.svg`}
        onError={markFailed}
        aria-hidden="true"
      >
        <source src={heroVideoUrl} type="video/mp4" />
      </video>
      <div className="hero-wash" aria-hidden="true" />
      <MotionConfig reducedMotion="user">
        <motion.div
          className="hero-content site-container"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="section-label">
            AI PRODUCT MANAGER · EMBODIED INTELLIGENCE
          </p>
          <h1 aria-label={profile.headline}>
            <span aria-hidden="true">{displayed}</span>
            <span
              className={`typewriter-cursor${done ? ' is-complete' : ''}`}
              aria-hidden="true"
            />
          </h1>
          <p className="hero-introduction">{profile.introduction}</p>
        </motion.div>
      </MotionConfig>
      <p className="hero-scrub-hint">桌面端：左右移动，观察环境变化</p>
    </section>
  );
}
