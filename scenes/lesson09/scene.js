import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({ canvas });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(2, 2, 5);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshNormalMaterial();
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const light = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(light);


controls.addEventListener('change', () => {
  render(); // Только при изменении камеры (контрола)
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render(); // рендер на ресайз
});

function render() {
  renderer.render(scene, camera);
}

render(); 
