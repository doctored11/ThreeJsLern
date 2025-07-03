import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
//стартовый шаблон 🤔💩

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 5;


const canvas = document.getElementById("c")
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(window.innerWidth, window.innerHeight);


{
  const loader = new THREE.CubeTextureLoader();
  const texture = loader.load([
    '/textures/pos-x.jpg',
    '/textures/neg-x.jpg',
    '/textures/pos-y.jpg',
    '/textures/neg-y.jpg',
    '/textures/pos-z.jpg',
    '/textures/neg-z.jpg',
  ]);
  scene.background = texture;
}

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshNormalMaterial();
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0, 0);
controls.update();
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();
//