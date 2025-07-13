import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffeeee);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 1.5, 3);

const canvas = document.getElementById("c");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

scene.add(new THREE.AmbientLight(0xffffff, 1));
const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(5, 10, 2);
scene.add(light);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1, 0);
controls.update();

const loader = new GLTFLoader();

let mixer;
const animations = {};
let currentAction;

const guiParams = {
  animation: "",
  speed: 1.0,
};

const gui = new GUI();

loader.load(
  "/models/camel/scene.gltf",
  (gltf) => {
    const model = gltf.scene;
    scene.add(model);

    mixer = new THREE.AnimationMixer(model);
    //console.log(gltf)
    gltf.animations.forEach((clip) => {
      animations[clip.name] = clip;
    });

    const animationNames = Object.keys(animations);
    guiParams.animation = animationNames[0];

    gui
      .add(guiParams, "animation", animationNames)
      .name("Анимация")
      .onChange((name) => {
        if (currentAction) currentAction.stop();
        const clip = animations[name];
        currentAction = mixer.clipAction(clip);
        currentAction.timeScale = guiParams.speed;
        currentAction.play();
      });

    gui
      .add(guiParams, "speed", 0.1, 3.0, 0.1)
      .name("скорость")
      .onChange((value) => {
        if (currentAction) currentAction.timeScale = value;
      });

    const clip = animations[guiParams.animation];
    // console.log(clip)
    currentAction = mixer.clipAction(clip);
    currentAction.timeScale = guiParams.speed;
    currentAction.play();
  },
  undefined,
  (error) => {
    console.error("ошибка загрузки модели GLTF:", error);
  }
);

const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);
  renderer.render(scene, camera);
}
animate();
