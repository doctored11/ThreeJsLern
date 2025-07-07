import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import {
  EffectComposer,
  EffectPass,
  RenderPass,
  BloomEffect,
  NoiseEffect,
} from "postprocessing";

const [vertexShader, fragmentShader] = await Promise.all([
  fetch("./shader/vertex.glsl").then((res) => res.text()),
  fetch("./shader/fragment.glsl").then((res) => res.text()),
]);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x002233);
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);



camera.position.set(-2, 1.5, -1);
scene.add(camera);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const l2 = new THREE.PointLight(0xaaffff, 12);
l2.position.set(1.5, 3, 2);
scene.add(l2);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#c"),
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
const composer = new EffectComposer(renderer);

const geometry = new THREE.PlaneGeometry(10, 10, 512, 512);
const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    uTime: { value: 0 },
    uLightDir: { value: new THREE.Vector3(1, 1, 1) },
  },
  side: THREE.DoubleSide,
  wireframe: false,
});
const mesh = new THREE.Mesh(geometry, material);
mesh.rotation.x = -Math.PI / 2;
scene.add(mesh);

function ringWave(pos, time) {
  const dist = pos.length();
  const centerFreq = 8.0;
  const centerSpeed = 2.0;
  const centerScale = 0.05;
  const phase = Math.log(1.0 + dist * 3.0) * centerFreq - time * centerSpeed;
  const ring = Math.sin(phase);
  const fade = THREE.MathUtils.smoothstep(dist, 0.2, 1.5);
  return ring * fade * centerScale * dist;
}

let ship;
const shipPos = new THREE.Vector2(2.0, 2.5);

const loader = new GLTFLoader();

loader.load("/models/island/scene.gltf", (gltf) => {
  const island = gltf.scene;
  island.position.set(0, 0.3, 0);
  island.scale.set(0.2, 0.2, 0.2);
  island.rotation.y = Math.PI;
  scene.add(island);
});

loader.load("/models/ship/scene.gltf", (gltf) => {
  ship = gltf.scene;
  ship.scale.set(0.005, 0.005, 0.005);
  ship.rotation.y = -Math.PI / 2;
  scene.add(ship);
});

const renderPass = new RenderPass(scene, camera);
const bloomEffect = new BloomEffect({
  luminanceThreshold: 0.9,
  luminanceSmoothing: 0.1,
  intensity: 5.0,
});
const noiseEffect = new NoiseEffect({
  premultiply: true,
});

const effectPass = new EffectPass(camera, bloomEffect, noiseEffect);
effectPass.renderToScreen = true;
composer.addPass(renderPass);
composer.addPass(effectPass);


function animate(t) {
  requestAnimationFrame(animate);
  const time = t * 0.001;

  material.uniforms.uTime.value = time;

  if (ship) {
    const adjustedTime = time;

    const baseHeight = ringWave(shipPos, adjustedTime);
    const delta = 0.05;

    const hx = ringWave(
      new THREE.Vector2(shipPos.x + delta, shipPos.y),
      adjustedTime
    );
    const hy = ringWave(
      new THREE.Vector2(shipPos.x, shipPos.y + delta),
      adjustedTime
    );

    ship.rotation.x = -(hy - baseHeight) / delta;
    ship.rotation.z = (hx - baseHeight) / delta;

    ship.position.x = shipPos.x;
    ship.position.z = shipPos.y;
    ship.position.y = baseHeight - 0.02;
  }

  controls.update();
  // renderer.render(scene, camera);
  composer.render();
}

animate();
