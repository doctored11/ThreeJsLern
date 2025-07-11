import * as THREE from "three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000
);
camera.position.z = 5;
//крч лучше смотреть как в з7
const canvas = document.getElementById("c");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

const ctx = document.createElement("canvas").getContext("2d");
ctx.canvas.width = 256;
ctx.canvas.height = 256;
ctx.fillStyle = "#FFF";
ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

const texture = new THREE.CanvasTexture(ctx.canvas);
const material = new THREE.MeshBasicMaterial({ map: texture });

const geometry = new THREE.BoxGeometry();
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

function randInt(min, max) {
  if (max === undefined) {
    max = min;
    min = 0;
  }
  return (Math.random() * (max - min) + min) | 0;
}

function drawRandomDot() {
  ctx.fillStyle = `#${randInt(0x1000000).toString(16).padStart(6, "0")}`;
  ctx.beginPath();
  const x = randInt(256);
  const y = randInt(256);
  const radius = randInt(10, 64);
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function animate(time) {
  drawRandomDot();
  texture.needsUpdate = true;
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
