import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenis = null;

export const startLenis = () => {
  if (lenis) {
    lenis.start();
    return lenis;
  }

  lenis = new Lenis({
    duration: 1.35,
    smoothWheel: true,
    wheelMultiplier: 1.15,
  });

  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
};

export const scrollToSection = (hash) => {
  const target = document.querySelector(hash);
  if (!target) return;
  if (lenis) {
    lenis.scrollTo(target, { offset: -24, duration: 1.35 });
  } else {
    target.scrollIntoView({ behavior: "smooth" });
  }
};
