import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";

export default function handleResize(renderer, camera, canvasDiv, character) {
  if (!canvasDiv.current) return;
  const canvas3d = canvasDiv.current.getBoundingClientRect();
  renderer.setSize(canvas3d.width, canvas3d.height);
  camera.aspect = canvas3d.width / canvas3d.height;
  camera.updateProjectionMatrix();
  const workTrigger = ScrollTrigger.getById("work");
  ScrollTrigger.getAll().forEach((trigger) => {
    if (trigger !== workTrigger) trigger.kill();
  });
  setCharTimeline(character, camera);
  setAllTimeline();
}
