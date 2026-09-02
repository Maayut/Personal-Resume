import type { CSSProperties, ReactNode } from 'react';
import { MotionConfig, motion } from 'motion/react';

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: 'div' | 'article';
  style?: CSSProperties;
};

const transition = {
  duration: 0.54,
  ease: [0.22, 1, 0.36, 1] as const,
};

export function Reveal({
  children,
  className,
  delay = 0,
  as = 'div',
  style,
}: RevealProps) {
  const motionProps = {
    className,
    style,
    'data-reveal': '',
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.18 },
    transition: { ...transition, delay },
  };

  return (
    <MotionConfig reducedMotion="user">
      {as === 'article' ? (
        <motion.article {...motionProps}>{children}</motion.article>
      ) : (
        <motion.div {...motionProps}>{children}</motion.div>
      )}
    </MotionConfig>
  );
}
