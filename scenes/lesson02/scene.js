import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);

camera.position.set(-200, 200, 800);


const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);



const ambient = new THREE.AmbientLight(0xffffff, 5);
scene.add(ambient);

const loader = new GLTFLoader();

loader.load(
  "/models/l2-car/scene.gltf",
  function (gltf) {
    const model = gltf.scene;

    scene.add(model);

    
    // const controls = new OrbitControls(camera, renderer.domElement);
    // controls.target.set(0, 0, 0);
    // controls.update();
  },
  undefined,
  function (error) {
    console.error("Ошибка при загрузке:", error);
  }
);

scene.add(new THREE.GridHelper(10, 10));
scene.add(new THREE.AxesHelper(5));

function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}
animate();
//
