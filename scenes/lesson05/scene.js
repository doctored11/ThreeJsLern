import * as THREE from "three";
const loader = new THREE.TextureLoader();

let cube;
const geometry = new THREE.BoxGeometry(1, 1, 1);
const texture = loader.load("/textures/t1.jpg", (texture) => {
  //но ждать так не обязательно https://threejs.org/manual/#ru/textures
  console.log("загружено");
  const material = new THREE.MeshBasicMaterial({
    map: texture,
  });
  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
});
texture.colorSpace = THREE.SRGBColorSpace;
//стартовый шаблон 🤔💩

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

function animate() {
  requestAnimationFrame(animate);
  if (cube) {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
  }
  renderer.render(scene, camera);
}
animate();
//
