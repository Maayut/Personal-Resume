import { MotionConfig, motion } from 'motion/react';

import { useBackgroundVideo } from '@/hooks/use-background-video';
import { useHeroPointerFollow } from '@/hooks/use-hero-pointer-follow';
import { useTypewriter } from '@/hooks/use-typewriter';
import { profile } from '@/lib/resume';

const heroVideoUrl = `${import.meta.env.BASE_URL}media/hero-scrub.mp4`;

export function InteractiveHero() {
  const { motionRef, surfaceRef } =
    useHeroPointerFollow<HTMLElement, HTMLDivElement>();
  const { videoRef, failed, markFailed } = useBackgroundVideo(surfaceRef);
  const { displayed, done } = useTypewriter(profile.headline);

  return (
    <section
      ref={surfaceRef}
      className={`resume-hero${failed ? ' has-video-fallback' : ''}`}
    >
      <div className="hero-visual" aria-hidden="true">
        <video
          ref={videoRef}
          className="hero-video"
          muted
          playsInline
          loop
          preload="auto"
          poster={`${import.meta.env.BASE_URL}media/hero-fallback.svg`}
          onError={markFailed}
          aria-hidden="true"
        >
          <source src={heroVideoUrl} type="video/mp4" />
        </video>
        <div ref={motionRef} className="hero-visual-grain" />
      </div>
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
    </section>
  );
}
