import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

const vertexPars = await fetch("./shader/vertex_parse.glsl").then((res) =>
  res.text()
);
const vertexMain = await fetch("./shader/vertex_main.glsl").then((res) =>
  res.text()
);
const fragmentMain = await fetch("./shader/fragment_main.glsl").then((res) =>
  res.text()
);
const fragmentParse = await fetch("./shader/fragment_parse.glsl").then((res) =>
  res.text()
);
// const vertexShader = await fetch("./shader/vertex.glsl").then((res) =>
//   res.text()
// );
// const fragmentShader = await fetch("./shader/fragment.glsl").then((res) =>
//   res.text()
// );

const canvas = document.querySelector("#c");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 0, 5);
scene.add(camera);
scene.background = new THREE.Color(0x230010);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const geometry = new THREE.IcosahedronGeometry(1, 255);
{
  const light = new THREE.PointLight(0xaa7711, 6);
  light.position.set(2, 2, 3);
  scene.add(light);
}
{
  const light = new THREE.PointLight(0xbb11a1, 6);
  light.position.set(-3, -3, -1);
  scene.add(light);
}
{
  const light = new THREE.PointLight(0xff5511, 10);
  light.position.set(-2, -2, 3);
  scene.add(light);
}
{
  const light = new THREE.PointLight(0xffbbaa, 4);
  light.position.set(1, -1, 4);
  scene.add(light);
}
{
  const light = new THREE.AmbientLight(0xff666a, 0.3);

  scene.add(light);
}

const material = new THREE.MeshStandardMaterial({
  onBeforeCompile: (shader) => {
    material.userData.shader = shader;
    shader.uniforms.uTime = { value: 0 };
    shader.uniforms.cameraPosition = { value: camera.position };

    shader.vertexShader = shader.vertexShader.replace(
      "#include <displacementmap_pars_vertex>",
      `#include <displacementmap_pars_vertex>\n${vertexPars}`
    );

    shader.vertexShader = shader.vertexShader.replace(
      "#include <displacementmap_vertex>",
      `#include <displacementmap_vertex>\n${vertexMain}`
    );

    const MFS = "#include <normal_fragment_maps>";
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <bumpmap_pars_fragment>",
      `#include <bumpmap_pars_fragment>\n${fragmentParse}`
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <normal_fragment_maps>",
      `#include <normal_fragment_maps>\n${fragmentMain}`
    );
  },
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// пост обработка
const composer = new EffectComposer(renderer);

const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.5, // сила
  1, // рад
  0.01 // порог
);
composer.addPass(bloomPass);

function animate(time) {
  requestAnimationFrame(animate);
  if (material.userData.shader) {
    material.userData.shader.uniforms.uTime.value = time * 0.0001;
  }
  controls.update();
  composer.render();
}

animate();
