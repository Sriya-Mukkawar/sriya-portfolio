import * as THREE from "three";
import { DRACOLoader, GLTFLoader } from "three-stdlib";
import { GLTFLoader as ThreeGLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { VRMLoaderPlugin, VRMUtils } from "@pixiv/three-vrm";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { decryptFile } from "./decrypt";
import {
  hideOriginalPerson,
  poseGirlSitting,
  fitGirlToDesk,
  getPersonBox,
  applySkinTone,
  applyPants,
  findOriginalSkeleton,
} from "./poseGirl";

const loadDesk = (renderer, scene, camera) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  return new Promise(async (resolve, reject) => {
    try {
      const encryptedBlob = await decryptFile(
        "/models/character.enc",
        "Character3D#@"
      );
      const blobUrl = URL.createObjectURL(new Blob([encryptedBlob]));
      loader.load(
        blobUrl,
        async (gltf) => {
          try {
            await Promise.race([
              renderer.compileAsync(gltf.scene, camera, scene),
              new Promise((done) => setTimeout(done, 4000)),
            ]);
          } catch (err) {
            console.warn("Desk compile skipped", err);
          }
          dracoLoader.dispose();
          resolve(gltf);
        },
        undefined,
        reject
      );
    } catch (err) {
      reject(err);
    }
  });
};

const loadGirl = (renderer, scene, camera) => {
  const loader = new ThreeGLTFLoader();
  loader.register((parser) => new VRMLoaderPlugin(parser));
  return new Promise((resolve, reject) => {
    loader.load(
      "/models/girl.vrm",
      async (gltf) => {
        const vrm = gltf.userData.vrm;
        if (vrm) {
          VRMUtils.removeUnnecessaryVertices(gltf.scene);
          if (VRMUtils.combineSkeletons) VRMUtils.combineSkeletons(gltf.scene);
          gltf.scene.traverse((obj) => {
            obj.frustumCulled = false;
          });
        }
        try {
          await Promise.race([
            renderer.compileAsync(gltf.scene, camera, scene),
            new Promise((done) => setTimeout(done, 4000)),
          ]);
        } catch (err) {
          console.warn("Girl compile skipped", err);
        }
        resolve(gltf);
      },
      undefined,
      reject
    );
  });
};

const setCharacter = (renderer, scene, camera) => {
  const loadCharacter = () =>
    Promise.all([
      loadDesk(renderer, scene, camera),
      loadGirl(renderer, scene, camera).catch((err) => {
        console.error("Girl model failed to load", err);
        return null;
      }),
    ]).then(([deskGltf, girlGltf]) => {
      try {
      const root = new THREE.Group();
      root.name = "characterRoot";
      const desk = deskGltf.scene;
      root.add(desk);

      const vrm = girlGltf?.userData?.vrm;
      if (vrm && girlGltf?.scene) {
        desk.updateMatrixWorld(true);
        const personBox = getPersonBox(desk);
        hideOriginalPerson(desk);
        poseGirlSitting(vrm);
        applySkinTone(girlGltf.scene);
        try {
          applyPants(girlGltf.scene);
        } catch (err) {
          console.warn("Pants pass skipped", err);
        }
        root.add(girlGltf.scene);
        const originalSkeleton = findOriginalSkeleton(root);
        fitGirlToDesk(girlGltf.scene, personBox, vrm, originalSkeleton);
        vrm.update(0);
        vrm.springBoneManager?.reset();
        girlGltf.scene.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = false;
            child.receiveShadow = false;
          }
        });
        root.userData.vrm = vrm;
        root.userData.girl = girlGltf.scene;
        root.userData.originalSkeleton = originalSkeleton;
      } else {
        desk.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = false;
            child.receiveShadow = false;
            if (child.material && !Array.isArray(child.material)) {
              child.material.precision = "mediump";
            }
          }
        });
      }

      const footR = root.getObjectByName("foot.R") || root.getObjectByName("footR");
      const footL = root.getObjectByName("foot.L") || root.getObjectByName("footL");
      if (footR) footR.position.y = 3.36;
      if (footL) footL.position.y = 3.36;

      setCharTimeline(root, camera);
      setAllTimeline();

      return {
        scene: root,
        animations: deskGltf.animations || [],
        userData: {
          vrm,
          originalSkeleton: root.userData.originalSkeleton,
          girl: root.userData.girl,
        },
      };
      } catch (err) {
        console.error("Character setup failed", err);
        return {
          scene: deskGltf.scene,
          animations: deskGltf.animations || [],
          userData: { vrm: girlGltf?.userData?.vrm || null },
        };
      }
    });

  return { loadCharacter };
};

export default setCharacter;
