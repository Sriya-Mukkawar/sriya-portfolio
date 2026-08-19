import * as THREE from "three";

export const hideOriginalPerson = (desk) => {
  desk.traverse((child) => {
    if (child.isSkinnedMesh || child.name === "hair") {
      child.visible = false;
    }
  });
};

const findNamed = (root, names) => {
  for (const name of names) {
    const node = root?.getObjectByName(name);
    if (node) return node;
  }
  const wanted = new Set(names.map((name) => name.replace(/\./g, "")));
  let found = null;
  root?.traverse((child) => {
    if (found || !child.name) return;
    if (wanted.has(child.name.replace(/\./g, ""))) found = child;
  });
  return found;
};

const n = (root, ...names) => findNamed(root, names);

export const findOriginalSkeleton = (root) => ({
  hips: n(root, "spine"),
  spine: n(root, "spine.001", "spine001"),
  chest: n(root, "spine.002", "spine002"),
  upperChest: n(root, "spine.003", "spine003"),
  neck: n(root, "spine.005", "spine005"),
  head: n(root, "spine.006", "spine006"),
  leftShoulder: n(root, "shoulder.L", "shoulderL"),
  rightShoulder: n(root, "shoulder.R", "shoulderR"),
  leftUpperArm: n(root, "upper_arm.L", "upper_armL"),
  rightUpperArm: n(root, "upper_arm.R", "upper_armR"),
  leftLowerArm: n(root, "forearm.L", "forearmL"),
  rightLowerArm: n(root, "forearm.R", "forearmR"),
  leftHand: n(root, "hand.L", "handL"),
  rightHand: n(root, "hand.R", "handR"),
  leftUpperLeg: n(root, "thigh.L", "thighL"),
  rightUpperLeg: n(root, "thigh.R", "thighR"),
  leftLowerLeg: n(root, "shin.L", "shinL"),
  rightLowerLeg: n(root, "shin.R", "shinR"),
  leftFoot: n(root, "foot.L", "footL"),
  rightFoot: n(root, "foot.R", "footR"),
  leftToes: n(root, "toe.L", "toeL"),
  rightToes: n(root, "toe.R", "toeR"),
  leftIndexProximal: n(root, "f_index.01.L", "f_index01L"),
  leftIndexIntermediate: n(root, "f_index.02.L", "f_index02L"),
  leftIndexDistal: n(root, "f_index.03.L", "f_index03L"),
  rightIndexProximal: n(root, "f_index.01.R", "f_index01R"),
  rightIndexIntermediate: n(root, "f_index.02.R", "f_index02R"),
  rightIndexDistal: n(root, "f_index.03.R", "f_index03R"),
  leftMiddleProximal: n(root, "f_middle.01.L", "f_middle01L"),
  leftMiddleIntermediate: n(root, "f_middle.02.L", "f_middle02L"),
  leftMiddleDistal: n(root, "f_middle.03.L", "f_middle03L"),
  rightMiddleProximal: n(root, "f_middle.01.R", "f_middle01R"),
  rightMiddleIntermediate: n(root, "f_middle.02.R", "f_middle02R"),
  rightMiddleDistal: n(root, "f_middle.03.R", "f_middle03R"),
  leftRingProximal: n(root, "f_ring.01.L", "f_ring01L"),
  leftRingIntermediate: n(root, "f_ring.02.L", "f_ring02L"),
  leftRingDistal: n(root, "f_ring.03.L", "f_ring03L"),
  rightRingProximal: n(root, "f_ring.01.R", "f_ring01R"),
  rightRingIntermediate: n(root, "f_ring.02.R", "f_ring02R"),
  rightRingDistal: n(root, "f_ring.03.R", "f_ring03R"),
  leftLittleProximal: n(root, "f_pinky.01.L", "f_pinky01L"),
  leftLittleIntermediate: n(root, "f_pinky.02.L", "f_pinky02L"),
  leftLittleDistal: n(root, "f_pinky.03.L", "f_pinky03L"),
  rightLittleProximal: n(root, "f_pinky.01.R", "f_pinky01R"),
  rightLittleIntermediate: n(root, "f_pinky.02.R", "f_pinky02R"),
  rightLittleDistal: n(root, "f_pinky.03.R", "f_pinky03R"),
  leftThumbMetacarpal: n(root, "thumb.01.L", "thumb01L"),
  leftThumbProximal: n(root, "thumb.02.L", "thumb02L"),
  leftThumbDistal: n(root, "thumb.03.L", "thumb03L"),
  rightThumbMetacarpal: n(root, "thumb.01.R", "thumb01R"),
  rightThumbProximal: n(root, "thumb.02.R", "thumb02R"),
  rightThumbDistal: n(root, "thumb.03.R", "thumb03R"),
  keyboard: n(root, "Keyboard"),
});

const BODY_CHAINS = [
  ["hips", "spine", "hips", "spine"],
  ["spine", "chest", "spine", "chest"],
  ["chest", "upperChest", "chest", "upperChest"],
  ["upperChest", "neck", "upperChest", "neck"],
  ["neck", "head", "neck", "head"],
  ["leftShoulder", "leftUpperArm", "leftShoulder", "leftUpperArm"],
  ["rightShoulder", "rightUpperArm", "rightShoulder", "rightUpperArm"],
];

const FINGER_CHAINS = [
  ["leftHand", "leftIndexProximal", "leftHand", "leftIndexProximal"],
  ["rightHand", "rightIndexProximal", "rightHand", "rightIndexProximal"],
  ["leftIndexProximal", "leftIndexIntermediate", "leftIndexProximal", "leftIndexIntermediate"],
  ["leftIndexIntermediate", "leftIndexDistal", "leftIndexIntermediate", "leftIndexDistal"],
  ["rightIndexProximal", "rightIndexIntermediate", "rightIndexProximal", "rightIndexIntermediate"],
  ["rightIndexIntermediate", "rightIndexDistal", "rightIndexIntermediate", "rightIndexDistal"],
  ["leftMiddleProximal", "leftMiddleIntermediate", "leftMiddleProximal", "leftMiddleIntermediate"],
  ["leftMiddleIntermediate", "leftMiddleDistal", "leftMiddleIntermediate", "leftMiddleDistal"],
  ["rightMiddleProximal", "rightMiddleIntermediate", "rightMiddleProximal", "rightMiddleIntermediate"],
  ["rightMiddleIntermediate", "rightMiddleDistal", "rightMiddleIntermediate", "rightMiddleDistal"],
  ["leftRingProximal", "leftRingIntermediate", "leftRingProximal", "leftRingIntermediate"],
  ["leftRingIntermediate", "leftRingDistal", "leftRingIntermediate", "leftRingDistal"],
  ["rightRingProximal", "rightRingIntermediate", "rightRingProximal", "rightRingIntermediate"],
  ["rightRingIntermediate", "rightRingDistal", "rightRingIntermediate", "rightRingDistal"],
  ["leftLittleProximal", "leftLittleIntermediate", "leftLittleProximal", "leftLittleIntermediate"],
  ["leftLittleIntermediate", "leftLittleDistal", "leftLittleIntermediate", "leftLittleDistal"],
  ["rightLittleProximal", "rightLittleIntermediate", "rightLittleProximal", "rightLittleIntermediate"],
  ["rightLittleIntermediate", "rightLittleDistal", "rightLittleIntermediate", "rightLittleDistal"],
  ["leftThumbMetacarpal", "leftThumbProximal", "leftThumbMetacarpal", "leftThumbProximal"],
  ["leftThumbProximal", "leftThumbDistal", "leftThumbProximal", "leftThumbDistal"],
  ["rightThumbMetacarpal", "rightThumbProximal", "rightThumbMetacarpal", "rightThumbProximal"],
  ["rightThumbProximal", "rightThumbDistal", "rightThumbProximal", "rightThumbDistal"],
];

const _srcOrigin = new THREE.Vector3();
const _srcChild = new THREE.Vector3();
const _srcDir = new THREE.Vector3();
const _restDir = new THREE.Vector3();
const _parentQuat = new THREE.Quaternion();

const copyBoneAim = (srcBone, srcChild, dstBone, dstChild) => {
  if (!srcBone || !srcChild || !dstBone?.parent || !dstChild) return false;

  srcBone.updateWorldMatrix(true, false);
  srcChild.updateWorldMatrix(true, false);
  dstBone.parent.updateWorldMatrix(true, false);

  srcBone.getWorldPosition(_srcOrigin);
  srcChild.getWorldPosition(_srcChild);
  _srcDir.subVectors(_srcChild, _srcOrigin);
  if (_srcDir.lengthSq() < 1e-10) return false;
  _srcDir.normalize();

  _restDir.copy(dstChild.position);
  if (_restDir.lengthSq() < 1e-10) return false;
  _restDir.normalize();

  dstBone.parent.getWorldQuaternion(_parentQuat);
  _srcDir.applyQuaternion(_parentQuat.clone().invert());
  if (_restDir.dot(_srcDir) < -0.92) return false;

  dstBone.quaternion.setFromUnitVectors(_restDir, _srcDir);
  dstBone.updateMatrix();
  dstBone.updateWorldMatrix(true, false);
  return true;
};

const _axis = new THREE.Vector3();
const _poleDir = new THREE.Vector3();
const _elbowWorld = new THREE.Vector3();
const _handTarget = new THREE.Vector3();

const aimAtWorld = (bone, child, worldTarget) => {
  if (!bone?.parent || !child || !worldTarget) return false;
  bone.parent.updateWorldMatrix(true, false);
  bone.updateWorldMatrix(true, false);

  _restDir.copy(child.position);
  if (_restDir.lengthSq() < 1e-10) return false;
  _restDir.normalize();

  _srcOrigin.setFromMatrixPosition(bone.matrixWorld);
  _srcDir.copy(worldTarget).sub(_srcOrigin);
  if (_srcDir.lengthSq() < 1e-8) return false;
  _srcDir.normalize();

  bone.parent.getWorldQuaternion(_parentQuat);
  _srcDir.applyQuaternion(_parentQuat.clone().invert());
  if (_restDir.dot(_srcDir) < -0.92) return false;

  bone.quaternion.setFromUnitVectors(_restDir, _srcDir);
  bone.updateMatrix();
  bone.updateWorldMatrix(true, false);
  return true;
};

const _scale = new THREE.Vector3();
const SIT_LIFT = 0.22;
const SIT_BACK = 0.06;

const ikTwoBone = (upper, lower, end, target, poleSrc, poleLift = 0.25) => {
  if (!upper || !lower || !end || !target) return;

  _handTarget.copy(target);
  upper.parent.updateWorldMatrix(true, false);
  upper.updateWorldMatrix(true, false);
  lower.updateWorldMatrix(true, false);
  upper.getWorldScale(_scale);
  const upperLen = lower.position.length() * _scale.x;
  lower.getWorldScale(_scale);
  const lowerLen = end.position.length() * _scale.x;
  _srcOrigin.setFromMatrixPosition(upper.matrixWorld);

  _srcDir.copy(_handTarget).sub(_srcOrigin);
  let dist = _srcDir.length();
  const maxD = upperLen + lowerLen - 0.002;
  const minD = Math.abs(upperLen - lowerLen) + 0.002;
  if (dist < 1e-5) return;
  if (dist > maxD) {
    _srcDir.multiplyScalar(maxD / dist);
    dist = maxD;
  } else if (dist < minD) {
    _srcDir.multiplyScalar(minD / dist);
    dist = minD;
  }

  const cosShoulder = THREE.MathUtils.clamp(
    (upperLen * upperLen + dist * dist - lowerLen * lowerLen) / (2 * upperLen * dist),
    -1,
    1
  );
  const sinShoulder = Math.sqrt(Math.max(0, 1 - cosShoulder * cosShoulder));
  _axis.copy(_srcDir).multiplyScalar(1 / dist);

  if (poleSrc) {
    poleSrc.getWorldPosition(_poleDir);
    _poleDir.y += poleLift;
  } else {
    _poleDir.set(_srcOrigin.x, _srcOrigin.y + 1, _srcOrigin.z);
  }
  _poleDir.sub(_srcOrigin);
  _poleDir.addScaledVector(_axis, -_poleDir.dot(_axis));
  if (_poleDir.lengthSq() < 1e-8) {
    _poleDir.set(0, 1, 0).addScaledVector(_axis, -_axis.y);
  }
  _poleDir.normalize();

  _elbowWorld
    .copy(_axis)
    .multiplyScalar(cosShoulder)
    .addScaledVector(_poleDir, sinShoulder)
    .multiplyScalar(upperLen)
    .add(_srcOrigin);

  aimAtWorld(upper, lower, _elbowWorld);
  aimAtWorld(lower, end, _handTarget);
};

const _keyPos = new THREE.Vector3();

const ikArmToHand = (vrm, original, side, sitBlend = 1) => {
  const bone = (name) => vrm.humanoid.getNormalizedBoneNode(name);
  const upper = bone(`${side}UpperArm`);
  const lower = bone(`${side}LowerArm`);
  const hand = bone(`${side}Hand`);
  const finger = bone(`${side}IndexProximal`);
  const srcHand = original[`${side}Hand`];
  const srcElbow = original[`${side}LowerArm`];
  const srcFinger = original[`${side}IndexProximal`];
  if (!upper || !lower || !hand || !srcHand) return;

  const reach = (side === "right" ? 0.92 : 0.45) * sitBlend;
  const extraZ = (side === "right" ? 0.48 : 0.12) * sitBlend;
  srcHand.getWorldPosition(_handTarget);
  if (sitBlend > 0.001 && original.keyboard) {
    original.keyboard.getWorldPosition(_keyPos);
    _handTarget.z += (_keyPos.z - _handTarget.z) * reach + extraZ;
    if (side === "right") _handTarget.x += (_keyPos.x - _handTarget.x) * 0.25 * sitBlend;
  }
  _handTarget.y += 0.06 * sitBlend;
  ikTwoBone(upper, lower, hand, _handTarget.clone(), srcElbow, 0.28);
  if (finger && srcFinger) {
    srcFinger.getWorldPosition(_handTarget);
    if (sitBlend > 0.001 && original.keyboard) {
      _handTarget.z += (_keyPos.z - _handTarget.z) * reach + extraZ;
      if (side === "right") _handTarget.x += (_keyPos.x - _handTarget.x) * 0.25 * sitBlend;
    }
    _handTarget.y += 0.04 * sitBlend;
    aimAtWorld(hand, finger, _handTarget);
  }
};

const ikLegToFoot = (vrm, original, side) => {
  const bone = (name) => vrm.humanoid.getNormalizedBoneNode(name);
  const upper = bone(`${side}UpperLeg`);
  const lower = bone(`${side}LowerLeg`);
  const foot = bone(`${side}Foot`);
  const toes = bone(`${side}Toes`);
  const srcFoot = original[`${side}Foot`];
  const srcKnee = original[`${side}LowerLeg`];
  const srcToes = original[`${side}Toes`];
  if (!upper || !lower || !foot || !srcFoot) return;

  srcFoot.getWorldPosition(_handTarget);
  ikTwoBone(upper, lower, foot, _handTarget.clone(), srcKnee, -0.15);
  if (toes && srcToes) {
    srcToes.getWorldPosition(_handTarget);
    aimAtWorld(foot, toes, _handTarget);
  }
};

const ikLegsToOriginal = (vrm, original) => {
  ikLegToFoot(vrm, original, "left");
  ikLegToFoot(vrm, original, "right");
};

const _srcHips = new THREE.Vector3();
const _dstHips = new THREE.Vector3();

export const snapGirlToOriginal = (girl, vrm, original) => {
  const src = original?.hips;
  const dst =
    vrm?.humanoid?.getNormalizedBoneNode("hips") ||
    vrm?.humanoid?.getRawBoneNode("hips");
  if (!src || !dst || !girl) return;
  src.updateWorldMatrix(true, false);
  girl.updateMatrixWorld(true);
  src.getWorldPosition(_srcHips);
  dst.getWorldPosition(_dstHips);
  girl.position.add(_srcHips.sub(_dstHips));
  girl.position.y += SIT_LIFT;
  girl.position.z -= SIT_BACK;
};

export const poseGirlSitting = (vrm) => {
  const bone = (name) => vrm.humanoid?.getNormalizedBoneNode(name);
  const rot = (name, x = 0, y = 0, z = 0) => {
    const node = bone(name);
    if (node) node.rotation.set(x, y, z);
  };

  rot("hips", -0.12, 0, 0);
  rot("spine", 0.18, 0, 0);
  rot("chest", 0.08, 0, 0);
  rot("leftUpperLeg", -1.32, 0, 0);
  rot("rightUpperLeg", -1.32, 0, 0);
  rot("leftLowerLeg", 1.22, 0, 0);
  rot("rightLowerLeg", 1.22, 0, 0);
};

const retargetChains = (vrm, original, chains) => {
  const bone = (name) => vrm.humanoid.getNormalizedBoneNode(name);
  chains.forEach(([src, srcChild, dst, dstChild]) => {
    copyBoneAim(original[src], original[srcChild], bone(dst), bone(dstChild));
  });
};

export const updateGirlFromOriginal = (vrm, original, cameraZ = 24) => {
  if (!vrm?.humanoid || !original?.hips) return;
  const sitBlend = THREE.MathUtils.smoothstep(cameraZ, 28, 52);
  retargetChains(vrm, original, BODY_CHAINS);
  ikLegsToOriginal(vrm, original);
  ikArmToHand(vrm, original, "left", sitBlend);
  ikArmToHand(vrm, original, "right", sitBlend);
  retargetChains(vrm, original, FINGER_CHAINS);
};

export const getPersonBox = (desk) => {
  const personBox = new THREE.Box3();
  desk.traverse((child) => {
    if (child.isSkinnedMesh) personBox.expandByObject(child);
  });
  return personBox;
};

export const fitGirlToDesk = (girl, personBox, vrm, original) => {
  if (!personBox || personBox.isEmpty()) return;

  if (original?.hips) updateGirlFromOriginal(vrm, original);
  vrm?.humanoid?.update();
  vrm?.update(0);
  girl.updateMatrixWorld(true);

  const srcHead = original?.head;
  const srcHips = original?.hips;
  const dstHead = vrm?.humanoid?.getRawBoneNode("head") || vrm?.humanoid?.getNormalizedBoneNode("head");
  const dstHips = vrm?.humanoid?.getRawBoneNode("hips") || vrm?.humanoid?.getNormalizedBoneNode("hips");

  if (srcHead && srcHips && dstHead && dstHips) {
    const srcLen = srcHips.getWorldPosition(new THREE.Vector3()).distanceTo(
      srcHead.getWorldPosition(new THREE.Vector3())
    );
    const dstLen = dstHips.getWorldPosition(new THREE.Vector3()).distanceTo(
      dstHead.getWorldPosition(new THREE.Vector3())
    );
    if (srcLen > 0.01 && dstLen > 0.01) {
      girl.scale.multiplyScalar(srcLen / dstLen);
    }
  } else {
    const girlBox = new THREE.Box3().setFromObject(girl);
    if (girlBox.isEmpty()) return;
    const personSize = personBox.getSize(new THREE.Vector3());
    const girlSize = girlBox.getSize(new THREE.Vector3());
    girl.scale.multiplyScalar(personSize.y / Math.max(girlSize.y, 0.01));
  }

  vrm?.update(0);
  girl.updateMatrixWorld(true);
  snapGirlToOriginal(girl, vrm, original);
};

export const findHeadBone = (root, vrm) =>
  vrm?.humanoid?.getNormalizedBoneNode("head") ||
  root.getObjectByName("spine.006") ||
  root.getObjectByName("spine006") ||
  root.getObjectByName("J_Bip_C_Head") ||
  root.getObjectByName("Head") ||
  null;

const SKIN_LIT = new THREE.Color("#ffe8dc");
const SKIN_SHADE = new THREE.Color("#edc4ae");

export const applySkinTone = (girl) => {
  girl.traverse((child) => {
    if (!child.isMesh) return;
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.forEach((mat) => {
      if (!mat?.name) return;
      const name = mat.name.toLowerCase();
      if (!name.includes("skin") && !name.includes("facemouth")) return;
      mat.color?.set(SKIN_LIT);
      if (mat.shadeColorFactor) mat.shadeColorFactor.copy(SKIN_SHADE);
      mat.needsUpdate = true;
    });
  });
};

const PANT_COLOR = new THREE.Color("#2c3038");
const PANT_SHADE = new THREE.Color("#1a1c20");

const isLegBone = (name = "") => /UpperLeg|LowerLeg/.test(name);

const vertexUsesLeg = (skinIndex, skinWeight, i, legBones) => {
  const bones = [skinIndex.getX(i), skinIndex.getY(i), skinIndex.getZ(i), skinIndex.getW(i)];
  const weights = [skinWeight.getX(i), skinWeight.getY(i), skinWeight.getZ(i), skinWeight.getW(i)];
  return bones.some((bone, k) => weights[k] > 0.22 && legBones.has(bone));
};

export const applyPants = (girl) => {
  girl.traverse((child) => {
    if (!child.isSkinnedMesh) return;
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    const skinIndex = materials.findIndex(
      (mat) => mat?.name && /skin/i.test(mat.name) && !/face/i.test(mat.name)
    );
    if (skinIndex < 0 || !child.skeleton || !child.geometry.index) return;

    const geometry = child.geometry;
    const skinGroup = geometry.groups.find((group) => group.materialIndex === skinIndex);
    if (!skinGroup) return;

    const legBones = new Set();
    child.skeleton.bones.forEach((bone, i) => {
      if (isLegBone(bone.name)) legBones.add(i);
    });
    if (!legBones.size) return;

    const idx = geometry.index;
    const skinIdxAttr = geometry.attributes.skinIndex;
    const skinWeightAttr = geometry.attributes.skinWeight;
    const uvAttr = geometry.attributes.uv;
    const torso = [];
    const pants = [];

    for (let i = skinGroup.start; i < skinGroup.start + skinGroup.count; i += 3) {
      const a = idx.getX(i);
      const b = idx.getX(i + 1);
      const c = idx.getX(i + 2);
      const legish =
        vertexUsesLeg(skinIdxAttr, skinWeightAttr, a, legBones) ||
        vertexUsesLeg(skinIdxAttr, skinWeightAttr, b, legBones) ||
        vertexUsesLeg(skinIdxAttr, skinWeightAttr, c, legBones);
      (legish ? pants : torso).push(a, b, c);
    }

    if (!pants.length) return;

    const start = skinGroup.start;
    let cursor = start;
    for (const v of torso) idx.setX(cursor++, v);
    const torsoCount = torso.length;
    for (const v of pants) idx.setX(cursor++, v);
    const pantsCount = pants.length;
    idx.needsUpdate = true;

    const groupIndex = geometry.groups.indexOf(skinGroup);
    geometry.groups.splice(groupIndex, 1,
      { start, count: torsoCount, materialIndex: skinIndex },
      { start: start + torsoCount, count: pantsCount, materialIndex: materials.length }
    );

    const pantsMat = materials[skinIndex].clone();
    pantsMat.name = "Pants_01_CLOTH";
    pantsMat.color?.copy(PANT_COLOR);
    if (pantsMat.shadeColorFactor) pantsMat.shadeColorFactor.copy(PANT_SHADE);
    paintPantsOnMap(pantsMat, uvAttr, pants);
    pantsMat.needsUpdate = true;
    child.material = [...materials, pantsMat];

    materials.forEach((mat) => {
      if (mat?.name && /bottoms/i.test(mat.name)) {
        mat.color?.copy(PANT_COLOR);
        if (mat.shadeColorFactor) mat.shadeColorFactor.copy(PANT_SHADE);
        mat.needsUpdate = true;
      }
    });
  });
};

const paintPantsOnMap = (mat, uvAttr, pantIndices) => {
  const map = mat.map;
  const image = map?.image;
  if (!image || !uvAttr) return;

  const srcWidth = image.width || image.videoWidth;
  const srcHeight = image.height || image.videoHeight;
  if (!srcWidth || !srcHeight) return;

  const maxSize = 1024;
  const scale = Math.min(1, maxSize / Math.max(srcWidth, srcHeight));
  const width = Math.max(1, Math.round(srcWidth * scale));
  const height = Math.max(1, Math.round(srcHeight * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0, width, height);
  ctx.fillStyle = "#2c3038";
  ctx.strokeStyle = "#2c3038";
  ctx.lineWidth = 8;
  ctx.lineJoin = "round";

  const uvToCanvas = (vert) => {
    const u = uvAttr.getX(vert);
    const v = uvAttr.getY(vert);
    const y = map.flipY ? (1 - v) * height : v * height;
    return [u * width, y];
  };

  for (let i = 0; i < pantIndices.length; i += 3) {
    const [x1, y1] = uvToCanvas(pantIndices[i]);
    const [x2, y2] = uvToCanvas(pantIndices[i + 1]);
    const [x3, y3] = uvToCanvas(pantIndices[i + 2]);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  const painted = new THREE.CanvasTexture(canvas);
  painted.flipY = map.flipY;
  painted.colorSpace = map.colorSpace;
  painted.wrapS = map.wrapS;
  painted.wrapT = map.wrapT;
  painted.needsUpdate = true;
  mat.map = painted;
};
