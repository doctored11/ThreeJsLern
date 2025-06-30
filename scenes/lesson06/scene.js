import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";

import { MinMaxGUIHelper } from "../../utils/MinMaxGUIHelper";


const gui = new GUI();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;
const cameraHelper = new THREE.CameraHelper(camera);
scene.add(cameraHelper);

const view1Elem = document.querySelector("#view1");
const view2Elem = document.querySelector("#view2");

const controls = new OrbitControls(camera, view1Elem);
const canvas = document.getElementById("c");

const camera2 = new THREE.PerspectiveCamera(
  60, // fov
  2, // aspect
  0.1, // near
  500 // far
);
camera2.position.set(40, 10, 30);
camera2.lookAt(0, 5, 0);

const controls2 = new OrbitControls(camera2, view2Elem);
controls2.target.set(0, 5, 0);
controls2.update();

//
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshNormalMaterial();
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);


const planeGeo = new THREE.PlaneGeometry(50, 50);
const planeMat = new THREE.MeshBasicMaterial({
  color: 0x808080,
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeo, planeMat);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -5;
scene.add(plane);

const coneGeo = new THREE.ConeGeometry(1, 2, 32);
const coneMat = new THREE.MeshBasicMaterial({ color: 0xff3333 });
const cone = new THREE.Mesh(coneGeo, coneMat);
cone.position.set(3, -4, 0); 
scene.add(cone);

function animate() {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.setScissorTest(true);

  {
    const aspect = setScissorForElement(view1Elem);

    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    cameraHelper.update();

    cameraHelper.visible = false;

    scene.background = new THREE.Color(0x000000);

    renderer.render(scene, camera);
  }

  {
    const aspect = setScissorForElement(view2Elem);

    camera2.aspect = aspect;
    camera2.updateProjectionMatrix();

    cameraHelper.visible = true;

    scene.background.set(0x000040);

    renderer.render(scene, camera2);
  }

  requestAnimationFrame(animate);
}

gui.add(camera, "fov", 1, 180);
const minMaxGUIHelper = new MinMaxGUIHelper(camera, "near", "far", 0.1);

gui.add(minMaxGUIHelper, "min", 0.1, 50, 0.1).name("near");
gui.add(minMaxGUIHelper, "max", 0.1, 50, 0.1).name("far");
animate();
//

function setScissorForElement(elem) {
  const canvasRect = canvas.getBoundingClientRect();
  const elemRect = elem.getBoundingClientRect();

  const right = Math.min(elemRect.right, canvasRect.right) - canvasRect.left;
  const left = Math.max(0, elemRect.left - canvasRect.left);
  const bottom = Math.min(elemRect.bottom, canvasRect.bottom) - canvasRect.top;
  const top = Math.max(0, elemRect.top - canvasRect.top);

  const width = Math.max(0, Math.min(canvasRect.width, right - left));
  const height = Math.max(0, Math.min(canvasRect.height, bottom - top));

  if (width <= 0 || height <= 0) {
    return 1;
  }

  renderer.setScissor(left, top, width, height);
  renderer.setViewport(left, top, width, height);

  return width / height;
}
