import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const canvas = document.getElementById("c");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0, 0);
controls.update();

// render Target
const rtWidth = 512;
const rtHeight = 512;
const renderTarget = new THREE.WebGLRenderTarget(rtWidth, rtHeight);

const rtFov = 75;
const rtAspect = rtWidth / rtHeight;
const rtNear = 0.1;
const rtFar = 5;
const rtCamera = new THREE.PerspectiveCamera(rtFov, rtAspect, rtNear, rtFar);
rtCamera.position.z = 2;

const rtScene = new THREE.Scene();
rtScene.background = new THREE.Color(0xbbbbff);

{
  const color = 0xffffff;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-1, 2, 4);
  rtScene.add(light);
}

const light = new THREE.AmbientLight(0xffffff);
scene.add(light);

//
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
let rtCube;
{
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshPhongMaterial(0x44aa88);
  rtCube = new THREE.Mesh(geometry, material);
  // rtCube.position.set(-1, 1, 0);
  rtScene.add(rtCube);
}

const material = new THREE.MeshPhongMaterial({
  map: renderTarget.texture,
});
const geometry = new THREE.BoxGeometry();
const constCube = new THREE.Mesh(geometry, material);
constCube.position.set(1, 1, 0);
scene.add(constCube);

function animate() {
  rtCube.rotation.x += 0.01;
  rtCube.rotation.y += 0.01;
  renderer.setRenderTarget(renderTarget);
  renderer.render(rtScene, rtCamera);
  renderer.setRenderTarget(null);

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
//
