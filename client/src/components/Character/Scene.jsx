import { useEffect, useRef } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { findHeadBone, updateGirlFromOriginal, snapGirlToOriginal } from "./utils/poseGirl";

const Scene = () => {
  const canvasDiv = useRef(null);
  const hoverDivRef = useRef(null);
  const sceneRef = useRef(new THREE.Scene());

  useEffect(() => {
    if (window.innerWidth <= 768) return;
    if (!canvasDiv.current) return;

    let cancelled = false;
    const rect = canvasDiv.current.getBoundingClientRect();
    const width = Math.max(rect.width, window.innerWidth);
    const height = Math.max(rect.height, window.innerHeight);
    const aspect = width / height;
    const scene = sceneRef.current;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: window.devicePixelRatio < 2,
        powerPreference: "high-performance",
      });
    } catch (err) {
      console.error("WebGL failed to start", err);
      return;
    }
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    canvasDiv.current.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
    camera.position.set(0, 13.1, 24.7);
    camera.zoom = 1.1;
    camera.updateProjectionMatrix();

    let headBone = null;
    let screenLight = null;
    let mixer;
    let loadedCharacter = null;
    let vrm = null;
    let blinkTime = 0;
    const clock = new THREE.Clock();
    const light = setLighting(scene);
    const { loadCharacter } = setCharacter(renderer, scene, camera);

    loadCharacter()
      .then((gltf) => {
        if (cancelled || !gltf) return;
        const animations = setAnimations(gltf);
        if (hoverDivRef.current) animations.hover(gltf, hoverDivRef.current);
        mixer = animations.mixer;
        loadedCharacter = gltf.scene;
        vrm = gltf.userData?.vrm || null;
        scene.add(loadedCharacter);
        headBone = findHeadBone(loadedCharacter, vrm);
        screenLight = loadedCharacter.getObjectByName("screenlight") || null;
        light.turnOnLights();
        animations.startIntro();
        window.addEventListener("resize", onResize);
      })
      .catch((err) => {
        console.error(err);
      });

    const onResize = () => {
      if (loadedCharacter) handleResize(renderer, camera, canvasDiv, loadedCharacter);
    };

    let mouse = { x: 0, y: 0 };
    let interpolation = { x: 0.1, y: 0.2 };
    const onMouseMove = (event) => {
      handleMouseMove(event, (x, y) => {
        mouse = { x, y };
      });
    };

    let debounce;
    const onTouchStart = (event) => {
      const element = event.target;
      debounce = setTimeout(() => {
        element?.addEventListener("touchmove", (e) =>
          handleTouchMove(e, (x, y) => {
            mouse = { x, y };
          })
        );
      }, 200);
    };
    const onTouchEnd = () => {
      handleTouchEnd((x, y, interpolationX, interpolationY) => {
        mouse = { x, y };
        interpolation = { x: interpolationX, y: interpolationY };
      });
    };

    document.addEventListener("mousemove", onMouseMove);
    const landingDiv = document.getElementById("landingDiv");
    landingDiv?.addEventListener("touchstart", onTouchStart);
    landingDiv?.addEventListener("touchend", onTouchEnd);

    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      if (mixer) mixer.update(delta);
      if (vrm) {
        blinkTime += delta;
        const blink = blinkTime % 4.2 < 0.12 ? 1 : 0;
        vrm.expressionManager?.setValue("blink", blink);
        snapGirlToOriginal(
          loadedCharacter?.userData?.girl,
          vrm,
          loadedCharacter?.userData?.originalSkeleton
        );
        updateGirlFromOriginal(
          vrm,
          loadedCharacter?.userData?.originalSkeleton,
          camera.position.z
        );
      }
      if (headBone) {
        handleHeadRotation(
          headBone,
          mouse.x,
          mouse.y,
          interpolation.x,
          interpolation.y,
          THREE.MathUtils.lerp
        );
        light.setPointLight(screenLight);
      }
      if (vrm) {
        vrm.humanoid.update();
        vrm.lookAt?.update(delta);
        vrm.expressionManager?.update();
        vrm.nodeConstraintManager?.update();
        vrm.materials?.forEach((material) => material.update?.(delta));
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      clearTimeout(debounce);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("mousemove", onMouseMove);
      landingDiv?.removeEventListener("touchstart", onTouchStart);
      landingDiv?.removeEventListener("touchend", onTouchEnd);
      scene.clear();
      renderer.dispose();
      if (canvasDiv.current?.contains(renderer.domElement)) {
        canvasDiv.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="character-container">
      <div className="character-model">
        <div className="character-shift" ref={canvasDiv}>
          <div className="character-rim" />
          <div className="character-hover" ref={hoverDivRef} />
        </div>
      </div>
    </div>
  );
};

export default Scene;
