import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring, useReducedMotion } from 'motion/react';
import { springs } from '../../lib/motion-tokens';

// Genuine 3D: tracks the cursor position over the card and rotates it in
// perspective space (rotateX/rotateY), rather than faking depth with a
// bigger box-shadow. Falls back to a flat card with no tilt when the user
// has requested reduced motion.
export default function TiltCard({ children, className = '', maxTilt = 10, style = {} }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(y, [0, 1], [maxTilt, -maxTilt]), springs.gentle);
  const rotateY = useSpring(useTransform(x, [0, 1], [-maxTilt, maxTilt]), springs.gentle);

  function handleMouseMove(e) {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  }

  function handleMouseLeave() {
    x.set(0.5);
    y.set(0.5);
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        ...style,
        perspective: 800,
        rotateX: reduce ? 0 : rotateX,
        rotateY: reduce ? 0 : rotateY,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}
