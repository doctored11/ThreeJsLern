import * as THREE from "three";
import { TrackballControls } from "three/addons/controls/TrackballControls.js";

//стартовый шаблон 🤔💩
const canvas = document.querySelector("#c");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
const canvasRect = renderer.domElement.getBoundingClientRect();

const sceneElements = [];
function addScene(elem, fn, controls) {
  sceneElements.push({ elem, fn, controls });
}


function makeScene(elem) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xededff);
  const fov = 45;
  const aspect = 2;
  const near = 0.1;
  const far = 5;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 2;
  camera.position.set(0, 1, 2);
  camera.lookAt(0, 0, 0);

  {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(0.5, 0.5, 0.5);
    camera.add(light);
  }
scene.add(camera)
  const controls = new TrackballControls(camera, elem);
  controls.noZoom = true;
  controls.noPan = true;


  return { scene, camera, elem, controls };
}

{
  const elem = document.querySelector("#box");
  const { scene, camera,controls } = makeScene(elem);
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshPhongMaterial({ color: "red" });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  addScene(elem, (time, rect,controls) => {
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
    mesh.rotation.y = time * 0.1;

    controls.update(); 
    renderer.render(scene, camera);
  },controls);
}

{
  const elem = document.querySelector("#pyramid");
  const { scene, camera,controls } = makeScene(elem);
  const radius = 0.8;
  const widthSegments = 4;
  const heightSegments = 2;
  const geometry = new THREE.SphereGeometry(
    radius,
    widthSegments,
    heightSegments
  );
  const material = new THREE.MeshPhongMaterial({
    color: "blue",
    flatShading: true,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  addScene(elem, (time, rect,controls) => {
  

    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
    mesh.rotation.y = time * 0.1;

    controls.update()
    renderer.render(scene, camera);
  },controls);
}

function render(time) {
  time *= 0.001;

  renderer.setScissorTest(false);

  renderer.clear(true, true);
  renderer.setScissorTest(true);

  const transform = `translateY(${window.scrollY}px)`;
  renderer.domElement.style.transform = transform;

  for (const { elem, fn, controls} of sceneElements) {
    // get the viewport relative position of this element
    const rect = elem.getBoundingClientRect();
    const { left, right, top, bottom, width, height } = rect;

    const isOffscreen =
      bottom < 0 ||
      top > renderer.domElement.clientHeight ||
      right < 0 ||
      left > renderer.domElement.clientWidth;

    if (!isOffscreen) {
      const positiveYUpBottom = renderer.domElement.clientHeight - bottom;
      renderer.setScissor(left, positiveYUpBottom, width, height);
      renderer.setViewport(left, positiveYUpBottom, width, height);

      fn(time, rect,controls);
    }
  }

  requestAnimationFrame(render);
}
requestAnimationFrame(render);
//
//не понятно почему работает с ними двумя, 1 по идее просто маска запрещающая рендер вне а второй указывает где рисовать. Но без setScissor не работает
// renderer.setScissor(left, positiveYUpBottom, width, height);
// renderer.setViewport(left, positiveYUpBottom, width, height);
