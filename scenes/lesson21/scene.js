import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

//стартовый шаблон 🤔💩

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
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
function addLight(position) {
  const color = 0xffffff;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(...position);
  scene.add(light);
  scene.add(light.target);
}
addLight([-3, 1, 1]);
addLight([2, 1, 0.5]);

const labelGeometry = new THREE.PlaneGeometry(1, 1);
const bodyRadiusTop = 0.4;
const bodyRadiusBottom = 0.2;
const bodyHeight = 2;
const bodyRadialSegments = 6;
const bodyGeometry = new THREE.CylinderGeometry(
  bodyRadiusTop,
  bodyRadiusBottom,
  bodyHeight,
  bodyRadialSegments
);

const headRadius = bodyRadiusTop * 0.8;
const headLonSegments = 12;
const headLatSegments = 5;
const headGeometry = new THREE.SphereGeometry(
  headRadius,
  headLonSegments,
  headLatSegments
);

makePerson(-3, 32, "Purple People Eater", "purple");
makePerson(-0, 32, "Green Machine", "green");
makePerson(+3, 32, "Red Menace", "red");

function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 2, 0);
controls.update();
animate();
//

function makePerson(x, size, name, color) {
  const canvas = makeLabelCanvas(size, name); //если закоментить то в текстуру упадет родительский канвас
  const texture = new THREE.CanvasTexture(canvas);

  texture.minFilter = THREE.LinearFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;

  const labelMaterial = new THREE.SpriteMaterial({
    map: texture,

    transparent: true,
  });

  const bodyMaterial = new THREE.MeshPhongMaterial({
    color,
    flatShading: true,
  });

  const root = new THREE.Object3D();
  root.position.x = x;

  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  root.add(body);
  body.position.y = bodyHeight / 2;

  const head = new THREE.Mesh(headGeometry, bodyMaterial);
  root.add(head);
  head.position.y = bodyHeight + headRadius * 1.1;

  const label = new THREE.Sprite(labelMaterial);

  root.add(label);
  const labelBaseScale = 0.01;
  label.position.y = head.position.y + headRadius + size * labelBaseScale;

  label.scale.x = canvas.width * labelBaseScale;
  label.scale.y = canvas.height * labelBaseScale;

  scene.add(root);
  return root;
}

function makeLabelCanvas(size, name) {
  const borderSize = 2;
  const ctx = document.createElement("canvas").getContext("2d");
  const font = `${size}px bold sans-serif`;
  ctx.font = font;
  const doubleBorderSize = borderSize * 2;
  const width = ctx.measureText(name).width + doubleBorderSize;
  const height = size + doubleBorderSize;
  ctx.canvas.width = width;
  ctx.canvas.height = height;

  ctx.font = font;
  ctx.textBaseline = "top";

  ctx.fillStyle = "blue";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "white";
  ctx.fillText(name, borderSize, borderSize);

  return ctx.canvas;
}
