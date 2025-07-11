import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
//стартовый шаблон 🤔💩

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x9fff77);
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

const canvas = document.getElementById("c");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

const geometry = new THREE.BoxGeometry();

const labelContainerElem = document.querySelector("#labels");
const tempV = new THREE.Vector3();
const raycaster = new THREE.Raycaster();

{
  const l = new THREE.PointLight(0xffffff, 20);
  l.position.set(1.5, 1.5, 1.5);
  scene.add(l);

  const amL = new THREE.AmbientLight(0xbbffbb, 5);
  scene.add(amL);
}
const cubes = [
  makeInstance(geometry, 0x44aa88, 0, "Aqua"),
  makeInstance(geometry, 0x8844aa, -2, "Purple"),
  makeInstance(geometry, 0xaa8844, 2, "Gold"),
];

const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0, 0);
controls.update();

function animate(time) {
  time *= 0.001;

  cubes.forEach((cubeInfo, ndx) => {
    const { cube, elem } = cubeInfo;
    const speed = 1 + ndx * 0.1;
    const rot = time * speed;
    cube.rotation.x = rot;
    cube.rotation.y = rot;

    cube.updateWorldMatrix(true, false);
    cube.getWorldPosition(tempV);

    tempV.project(camera);

    raycaster.setFromCamera(tempV, camera);
    const intersectedObjects = raycaster.intersectObjects(scene.children);
    const show =
      intersectedObjects.length && cube === intersectedObjects[0].object;

    if (!show || Math.abs(tempV.z) > 1) {
      elem.style.display = "none";
    } else {
      elem.style.display = "";
    }

    const x = (tempV.x * 0.5 + 0.5) * canvas.clientWidth;
    const y = (tempV.y * -0.5 + 0.5) * canvas.clientHeight;

    elem.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;
  });

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
//

function makeInstance(geometry, color, x, name) {
  const material = new THREE.MeshPhongMaterial({ color });

  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  cube.position.x = x;

  const elem = document.createElement("div");
  elem.textContent = name;
  labelContainerElem.appendChild(elem);

  return { cube, elem };
}
