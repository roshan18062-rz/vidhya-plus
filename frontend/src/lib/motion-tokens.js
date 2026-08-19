// Design-system-level motion tokens. Every animation in this app pulls from
// here — no raw duration/easing/distance/scale numbers scattered in
// components (motion-patterns skill, rule 8).

export const motionTokens = {
  duration: {
    fast: 0.15,
    normal: 0.3,
    slow: 0.5,
  },
  easing: {
    smooth: [0.22, 1, 0.36, 1], // gentle ease-out, matches the ledger/paper feel
  },
  distance: {
    sm: 8,
    md: 16,
    lg: 32,
    xl: 48,
  },
  scale: {
    subtle: 0.97,
    pop: 1.02,
    press: 0.97,
  },
};

export const springs = {
  gentle: { type: 'spring', stiffness: 260, damping: 26 },
  snappy: { type: 'spring', stiffness: 420, damping: 30 },
};
