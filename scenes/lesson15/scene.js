import * as THREE from "three";
import { PickHelper } from "../../utils/Picker";
//стартовый шаблон 🤔💩
const loader = new THREE.TextureLoader();
const texture = loader.load('/textures/frame.png');

const scene = new THREE.Scene();
scene.background = new THREE.Color("white");
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

const pickPosition = {x: 0, y: 0};
clearPickPosition();




const canvas = document.getElementById("c");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

{
  const color = 0xffffff;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(0.5, 0.5, 0.5);
  camera.add(light);
}

const cameraPole = new THREE.Object3D();
scene.add(cameraPole);
cameraPole.add(camera);

const mesure = rand(0.5,1.1)
const geometry = new THREE.BoxGeometry(mesure, mesure, mesure);

function rand(min, max) {
  if (max === undefined) {
    max = min;
    min = 0;
  }
  return min + (max - min) * Math.random();
}

function randomColor() {
  return `hsl(${rand(360) | 0}, ${rand(50, 100) | 0}%, 50%)`;
}

const numObjects = 100;
for (let i = 0; i < numObjects; ++i) {
  const material = new THREE.MeshPhongMaterial({
    color: randomColor(),
    map: texture,
    transparent: true,
    side: THREE.DoubleSide,
    alphaTest: 0.1,
  });

  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  cube.position.set(rand(-20, 20), rand(-20, 20), rand(-20, 20));
  cube.rotation.set(rand(Math.PI), rand(Math.PI), 0);
  cube.scale.set(rand(3, 6), rand(3, 6), rand(3, 6));
}
const pickHelper = new PickHelper();
function animate(time) {
  cameraPole.rotation.y = time * 0.0001;
  renderer.render(scene, camera);

  pickHelper.pick(pickPosition, scene, camera, time);
  requestAnimationFrame(animate);
}
animate();
//
function getCanvasRelativePosition(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * canvas.width  / rect.width,
    y: (event.clientY - rect.top ) * canvas.height / rect.height,
  };
}
 
function setPickPosition(event) {
  const pos = getCanvasRelativePosition(event);
  pickPosition.x = (pos.x / canvas.width ) *  2 - 1;
  pickPosition.y = (pos.y / canvas.height) * -2 + 1;  // note we flip Y
}
 
function clearPickPosition() {
  // unlike the mouse which always has a position
  // if the user stops touching the screen we want
  // to stop picking. For now we just pick a value
  // unlikely to pick something
  //лол - найс костыль
  pickPosition.x = -100000;
  pickPosition.y = -100000;
}

window.addEventListener('touchstart', (event) => {
  // prevent the window from scrolling
  event.preventDefault();
  setPickPosition(event.touches[0]);
}, {passive: false});
 
window.addEventListener('touchmove', (event) => {
  setPickPosition(event.touches[0]);
});
 
window.addEventListener('touchend', clearPickPosition);
 
window.addEventListener('mousemove', setPickPosition);
window.addEventListener('mouseout', clearPickPosition);
window.addEventListener('mouseleave', clearPickPosition);