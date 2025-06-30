import * as THREE from "three";
import { AxisGridHelper } from "../../utils/AxisGridHelper";
import GUI from 'lil-gui';
//стартовый шаблон 🤔💩

const gui = new GUI();
// gui.add( document, 'title' );

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 50;
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const objects = [];

const radius = 1;
const widthSegments = 6;
const heightSegments = 6;
const sphereGeometry = new THREE.SphereGeometry(
  radius,
  widthSegments,
  heightSegments
);

const sunMaterial = new THREE.MeshPhongMaterial({ emissive: 0xffff00 });
const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
sunMesh.scale.set(5, 5, 5);
addWireframe(sunMesh, 0xffaabb);
// scene.add(sunMesh);
objects.push(sunMesh);

{
  const color = 0xffffff;
  const intensity = 300;
  const light = new THREE.PointLight(color, intensity);
  light.position.set(0, 0, 0);
  scene.add(light);
}

const earthMaterial = new THREE.MeshPhongMaterial({
  color: 0x2233ff,
  emissive: 0x112299,
});
const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
addWireframe(earthMesh, 0x226622);
// sunMesh.add(earthMesh);
// objects.push(earthMesh);

//
const solarSystem = new THREE.Object3D();
scene.add(solarSystem);
objects.push(solarSystem);
solarSystem.add(sunMesh);
// solarSystem.add(earthMesh);

const earthOrbit = new THREE.Object3D();
earthOrbit.position.x = 10;
solarSystem.add(earthOrbit);
objects.push(earthOrbit);
earthOrbit.add(earthMesh);

//
const moonOrbit = new THREE.Object3D();
moonOrbit.position.x = 2;
earthOrbit.add(moonOrbit);

const moonMaterial = new THREE.MeshPhongMaterial({
  color: 0x888888,
  emissive: 0x222222,
});
const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
moonMesh.scale.set(0.5, 0.5, 0.5);
moonOrbit.add(moonMesh);
objects.push(moonMesh);

//
let time = 0;
function animate() {
  time += 0.01;
  objects.forEach((obj) => {
    obj.rotation.z = time;
  });
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

function makeAxisGrid(node, label, units) {
  const helper = new AxisGridHelper(node, units);
  gui.add(helper, "visible").name(label);
}

makeAxisGrid(solarSystem, "solarSystem", 25);
makeAxisGrid(sunMesh, "sunMesh");
makeAxisGrid(earthOrbit, "earthOrbit");
makeAxisGrid(earthMesh, "earthMesh");
makeAxisGrid(moonMesh, "moonMesh");

animate();
//

function addWireframe(mesh, color = 0xffffff) {
  const wireframe = new THREE.LineSegments(
    new THREE.WireframeGeometry(mesh.geometry),
    new THREE.LineBasicMaterial({ color })
  );
  mesh.add(wireframe);
}
