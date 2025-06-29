import * as THREE from "three";
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

const lineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
const points = [
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(5, 0, 0),
  new THREE.Vector3(5, 5, 5),
];

const LineGeometry = new THREE.BufferGeometry().setFromPoints(points);
const line = new THREE.Line( LineGeometry, lineMaterial );
scene.add( line );


function animate() {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
