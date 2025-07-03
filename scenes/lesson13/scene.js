import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
//стартовый шаблон 🤔💩

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xededff);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

const canvas = document.getElementById("c");
const renderer = new THREE.WebGLRenderer({ canvas,antialias: true, }); //сглаживание убирает лесенку на гранях
renderer.setSize(window.innerWidth, window.innerHeight);

function hsl(h, s, l) {
  return new THREE.Color().setHSL(h, s, l);
}
function addLight(...pos) {
  const color = 0xffffff;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(...pos);
  scene.add(light);
}

addLight(-1, 2, 4);
addLight(1, -1, -2);
const geometry = new THREE.BoxGeometry(1, 1, 1);
{
  const d = 0.8;
  makeInstance(geometry, hsl(0 / 8, 1, 0.5), -d, -d, -d);
  makeInstance(geometry, hsl(1 / 8, 1, 0.5), d, -d, -d);
  makeInstance(geometry, hsl(2 / 8, 1, 0.5), -d, d, -d);
  makeInstance(geometry, hsl(3 / 8, 1, 0.5), d, d, -d);
  makeInstance(geometry, hsl(4 / 8, 1, 0.5), -d, -d, d);
  makeInstance(geometry, hsl(5 / 8, 1, 0.5), d, -d, d);
  makeInstance(geometry, hsl(6 / 8, 1, 0.5), -d, d, d);
  makeInstance(geometry, hsl(7 / 8, 1, 0.5), d, d, d);
}
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0, 0);
controls.update();
function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}
animate();
//
function makeInstance(geometry, color, x, y, z) {//отдельно рисуются внутренние и передние текстуры, чтобы задняя рисовалась первее
  [THREE.BackSide, THREE.FrontSide].forEach((side) => {
    const material = new THREE.MeshPhongMaterial({
      color,
      opacity: 0.5,
      transparent: true,
      side,
    });
 
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
 
    cube.position.set(x, y, z);
  });
}
