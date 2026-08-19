import { useReducedMotion } from 'motion/react';

// Returns initial/animate/exit variants that collapse to a plain opacity
// fade (or nothing) when the user has requested reduced motion, instead of
// every component having to branch on this itself.
export function useSafeMotion(distance = 16) {
  const reduce = useReducedMotion();

  if (reduce) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    };
  }

  return {
    initial: { opacity: 0, y: distance },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: distance },
  };
}
