import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export * from 'gsap';
export { ScrollTrigger };

// Reusable Animation Utilities
export const animatePopUp = (target: gsap.TweenTarget, vars?: gsap.TweenVars, tl?: gsap.core.Timeline, position?: string | number) => {
  const settings = {
    duration: 0.8,
    ease: "elastic.out(1, 0.5)",
    ...vars
  };
  return tl 
    ? tl.fromTo(target, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, ...settings }, position) 
    : gsap.fromTo(target, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, ...settings });
};

export const animateFadeInLeft = (target: gsap.TweenTarget, vars?: gsap.TweenVars, tl?: gsap.core.Timeline, position?: string | number) => {
  const { scrollTrigger, ...restVars } = vars || {};
  const settings = {
    duration: 0.8,
    stagger: 0.15,
    ease: "power3.out",
    ...restVars
  };
  
  if (tl) {
    return tl.fromTo(target, { x: -50, opacity: 0 }, { x: 0, opacity: 1, ...settings }, position);
  }
  return gsap.fromTo(target, { x: -50, opacity: 0 }, { x: 0, opacity: 1, ...settings, scrollTrigger });
};

export const animateSwipeReveal = (target: gsap.TweenTarget, vars?: gsap.TweenVars, tl?: gsap.core.Timeline, position?: string | number) => {
  const { scrollTrigger, ...restVars } = vars || {};
  const settings = {
    duration: 1.2,
    ease: "power4.inOut",
    ...restVars
  };

  if (tl) {
    return tl.fromTo(target, { clipPath: "inset(0 100% 0 0)", opacity: 0 }, { clipPath: "inset(0 0% 0 0)", opacity: 1, ...settings }, position);
  }
  return gsap.fromTo(target, { clipPath: "inset(0 100% 0 0)", opacity: 0 }, { clipPath: "inset(0 0% 0 0)", opacity: 1, ...settings, scrollTrigger });
};

export const animateCounter = (targetValueStr: string, onUpdate: (value: string) => void, vars?: gsap.TweenVars, tl?: gsap.core.Timeline, position?: string | number) => {
  const { scrollTrigger, ...restVars } = vars || {};
  const isK = targetValueStr.toLowerCase().includes("k");
  const hasPlus = targetValueStr.includes("+");
  const targetValue = parseFloat(targetValueStr.replace(/[kK+]/g, ""));
  
  const obj = { value: 0 };
  const settings = {
    value: targetValue,
    duration: 2,
    ease: "power2.out",
    onUpdate: () => {
      let displayValue = Math.floor(obj.value).toString();
      if (isK) displayValue += "k";
      if (hasPlus) displayValue += "+";
      onUpdate(displayValue);
    },
    ...restVars
  };

  if (tl) {
    return tl.to(obj, settings, position);
  }
  return gsap.to(obj, { ...settings, scrollTrigger });
};

export default gsap;
