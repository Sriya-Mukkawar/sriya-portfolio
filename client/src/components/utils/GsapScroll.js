import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function setCharTimeline(character, camera) {
  let intensity = 0;
  setInterval(() => {
    intensity = Math.random();
  }, 200);

  const tl1 = gsap.timeline({
    scrollTrigger: {
      trigger: ".landing-section",
      start: "top top",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
  const tl2 = gsap.timeline({
    scrollTrigger: {
      trigger: ".about-section",
      start: "center 55%",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
  const tl3 = gsap.timeline({
    scrollTrigger: {
      trigger: ".whatIDO",
      start: "top top",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });

  let screenLight;
  let monitor;
  character?.traverse((object) => {
    if (object.name === "Plane004" || object.name === "Plane.004") {
      object.children.forEach((child) => {
        if (!child.material) return;
        child.material.transparent = true;
        child.material.opacity = 0;
        if (child.material.name === "Material.027") {
          monitor = child;
          child.material.color.set("#FFFFFF");
        }
      });
    }
    if (object.name === "screenlight" && object.material) {
      object.material.transparent = true;
      object.material.opacity = 0;
      object.material.emissive.set("#C8BFFF");
      gsap.timeline({ repeat: -1, repeatRefresh: true }).to(object.material, {
        emissiveIntensity: () => intensity * 8,
        duration: () => Math.random() * 0.6,
        delay: () => Math.random() * 0.1,
      });
      screenLight = object;
    }
  });

  const neckBone =
    character?.getObjectByName("spine.005") ||
    character?.getObjectByName("spine005") ||
    character?.getObjectByName("J_Bip_C_Neck");
  if (window.innerWidth > 1024 && character) {
    tl1
      .fromTo(character.rotation, { y: 0 }, { y: 0.7, duration: 1 }, 0)
      .to(camera.position, { z: 22 }, 0)
      .fromTo(".character-model", { x: 0 }, { x: "-25%", duration: 1 }, 0)
      .to(".landing-intro, .landing-info", { opacity: 0, duration: 0.4 }, 0)
      .to(".landing-intro, .landing-info", { y: "40%", duration: 0.8 }, 0)
      .fromTo(".about-me", { y: "18%", opacity: 0 }, { y: "0%", opacity: 1, duration: 1 }, 0);

    tl2
      .to(camera.position, { z: 75, y: 8.4, duration: 6, delay: 2, ease: "power3.inOut" }, 0)
      .to(".about-section", { y: "18%", duration: 6 }, 0)
      .to(".about-me", { opacity: 0, delay: 4.2, duration: 1.4 }, 0)
      .fromTo(
        ".character-model",
        { pointerEvents: "inherit" },
        { pointerEvents: "none", x: "-12%", delay: 2, duration: 5 },
        0
      )
      .to(character.rotation, { y: 0.92, x: 0.12, delay: 3, duration: 3 }, 0);

    if (neckBone) {
      tl2.to(neckBone.rotation, { x: 0.6, delay: 2, duration: 3 }, 0);
    }
    if (monitor?.material) {
      tl2
        .to(monitor.material, { opacity: 1, duration: 0.8, delay: 3.2 }, 0)
        .fromTo(monitor.position, { y: -10, z: 2 }, { y: 0, z: 0, delay: 1.5, duration: 3 }, 0);
    }
    if (screenLight?.material) {
      tl2.to(screenLight.material, { opacity: 1, duration: 0.8, delay: 4.5 }, 0);
    }

    tl2.fromTo(
      ".character-rim",
      { opacity: 1, scaleX: 1.4 },
      { opacity: 0, scale: 0, y: "-70%", duration: 5, delay: 2 },
      0.3
    );

    tl3
      .fromTo(
        ".character-model",
        { y: "0%" },
        { y: "-100%", duration: 4, ease: "none", delay: 1, immediateRender: false },
        0
      )
      .fromTo(".whatIDO", { y: 0 }, { y: "15%", duration: 2 }, 0)
      .to(character.rotation, { x: -0.04, duration: 2, delay: 1 }, 0);

    character.userData.typingTarget = 0;
    ScrollTrigger.create({
      trigger: ".whatIDO",
      start: "top 90%",
      end: "bottom top",
      onToggle: (self) => {
        character.userData.typingTarget = self.isActive ? 1 : 0;
      },
    });

    ScrollTrigger.refresh();
  }
}

export function setAllTimeline() {
  ScrollTrigger.refresh();
}
