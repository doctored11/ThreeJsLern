import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
//стартовый шаблон 🤔💩

const scene = new THREE.Scene();
scene.background = new THREE.Color("white");
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 20;
camera.position.y = 10;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

{
  const planeSize = 40;
  const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
  const planeMat = new THREE.MeshBasicMaterial({
    color: 0xb75842,
  });
  // planeMat.color.setRGB(1.5, 1.5, 1.5);
  const mesh = new THREE.Mesh(planeGeo, planeMat);
  mesh.rotation.x = Math.PI * -0.5;
  mesh.position.set(0, 0, 0);
  scene.add(mesh);
}

const sphereShadowBases = [];

const sphereRadius = 1;
const sphereWidthDivisions = 32;
const sphereHeightDivisions = 16;
const sphereGeo = new THREE.SphereGeometry(
  sphereRadius,
  sphereWidthDivisions,
  sphereHeightDivisions
);

const radius = 0.1;

const segments = 15;

const thetaStart = Math.PI * 0.06;

// const thetaLength = Math.PI * 1.48;

const shadowGeo = new THREE.CircleGeometry(
  radius,
  segments,
  thetaStart
  // thetaLength
);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);

const numSpheres = 15;
for (let i = 0; i < numSpheres; ++i) {
  // make a base for the shadow and the sphere
  // so they move together.
  const base = new THREE.Object3D();
  scene.add(base);

  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x333333,
    transparent: true,
    depthWrite: false
  });

  const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
  shadowMesh.position.y = 0.001; // so we're above the ground slightly
  shadowMesh.rotation.x = Math.PI * -0.5;
  const shadowSize = sphereRadius * 4;
  shadowMesh.scale.set(shadowSize, shadowSize, shadowSize);
  base.add(shadowMesh);

  // add the sphere to the base
  const u = i / numSpheres; // goes from 0 to 1 as we iterate the spheres.
  const sphereMat = new THREE.MeshPhongMaterial();
  sphereMat.color.setHSL(u, 1, 0.75);
  const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
  sphereMesh.position.set(0, sphereRadius + 2, 0);
  base.add(sphereMesh);

  // remember all 3 plus the y position
  sphereShadowBases.push({
    base,
    sphereMesh,
    shadowMesh,
    y: sphereMesh.position.y,
  });
}
{
  const skyColor = 0xb1e1ff; // light blue
  const groundColor = 0xb97a20; // brownish orange
  const intensity = 4;
  const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
  scene.add(light);
}
{
  const color = 0xffffff;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(0, 10, 5);
  light.target.position.set(-5, 0, 0);
  scene.add(light);
  scene.add(light.target);
}
let time = 1;
function animate() {
  time += 0.01;

  sphereShadowBases.forEach((sphereShadowBase, ndx) => {
    const { base, sphereMesh, shadowMesh, y } = sphereShadowBase;

    // u is a value that goes from 0 to 1 as we iterate the spheres
    const u = ndx / sphereShadowBases.length;

    // compute a position for the base. This will move
    // both the sphere and its shadow
    const speed = time * 0.2;
    const angle = speed + u * Math.PI * 2 * (ndx % 1 ? 1 : -1);
    const radius = Math.sin(speed - ndx) * 10;
    base.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);

    // yOff is a value that goes from 0 to 1
    const yOff = Math.abs(Math.sin(time * 2 + ndx));
    // move the sphere up and down
    sphereMesh.position.y = y + THREE.MathUtils.lerp(-2, 5, yOff);
    // fade the shadow as the sphere goes up
    shadowMesh.material.opacity = THREE.MathUtils.lerp(1, 0.1, yOff);

    const s = THREE.MathUtils.lerp(3, 10, yOff);
    shadowMesh.scale.set(s, s, s);
  });

  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}
animate();
//
