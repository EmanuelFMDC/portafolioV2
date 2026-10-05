// Sustituto de GSAP para Vitest: evita imports asíncronos reales de la librería.
const tween = () => ({ kill() {}, scrollTrigger: { kill() {} } });

export const gsap = {
  to: tween,
  from: tween,
  set() {},
  registerPlugin() {},
  quickTo: () => () => {},
};

export const ScrollTrigger = {};
