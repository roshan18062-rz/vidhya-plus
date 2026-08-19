import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'motion/react';

// 3D scroll-triggered reveal with configurable direction and rotation
export default function ScrollReveal({
  children,
  direction = 'up',    // up, down, left, right, rotateX, rotateY
  delay = 0,
  duration = 0.7,
  className = '',
  once = true,
  amount = 0.2
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount });

  const transforms = {
    up: { y: 60, x: 0, rotateX: 0, rotateY: 0 },
    down: { y: -60, x: 0, rotateX: 0, rotateY: 0 },
    left: { y: 0, x: 60, rotateX: 0, rotateY: 0 },
    right: { y: 0, x: -60, rotateX: 0, rotateY: 0 },
    rotateX: { y: 40, x: 0, rotateX: 25, rotateY: 0 },
    rotateY: { y: 0, x: 40, rotateX: 0, rotateY: 25 },
  };

  const t = transforms[direction] || transforms.up;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{
        opacity: 0,
        y: t.y,
        x: t.x,
        rotateX: t.rotateX,
        rotateY: t.rotateY,
      }}
      animate={isInView ? {
        opacity: 1,
        y: 0,
        x: 0,
        rotateX: 0,
        rotateY: 0,
      } : {
        opacity: 0,
        y: t.y,
        x: t.x,
        rotateX: t.rotateX,
        rotateY: t.rotateY,
      }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ perspective: 1200 }}
    >
      {children}
    </motion.div>
  );
}