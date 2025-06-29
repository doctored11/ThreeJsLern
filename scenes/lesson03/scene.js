import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

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

const ambient = new THREE.AmbientLight(0xffffff, 5);
scene.add(ambient);

function addWireframe(mesh, color = 0xffffff) {
  const wireframe = new THREE.LineSegments(
    new THREE.WireframeGeometry(mesh.geometry),
    new THREE.LineBasicMaterial({ color })
  );
  mesh.add(wireframe);
}

const material = new THREE.MeshBasicMaterial({ color: 0xaa77aa });
{
  //CircleGeometry круг
  const radius = 1;

  const segments = 15;

  const thetaStart = Math.PI * 0.06;

  const thetaLength = Math.PI * 1.48;

  const geometry = new THREE.CircleGeometry(
    radius,
    segments,
    thetaStart,
    thetaLength
  );

  const obj = new THREE.Mesh(geometry, material);

  addWireframe(obj, 0xffffff);

  obj.position.set(-5, 2, 0);
  scene.add(obj);
}

{
  //ConeGeometry конусч
  const radius = 0.5;

  const height = 1.5;

  const radialSegments = 16;

  const heightSegments = 1;

  const openEnded = true;
  const thetaStart = Math.PI * 0.1;

  const thetaLength = Math.PI * 1.8;

  const geometry = new THREE.ConeGeometry(
    radius,
    height,
    radialSegments,
    heightSegments,
    openEnded,
    thetaStart,
    thetaLength
  );

  const obj = new THREE.Mesh(geometry, material);

  addWireframe(obj, 0xffffff);

  obj.position.set(-3, 2, 0);
  scene.add(obj);
}
{
  const radius = 0.5;

  const detail = 1;

  const geometry = new THREE.DodecahedronGeometry(radius, detail);
  const obj = new THREE.Mesh(geometry, material);

  addWireframe(obj, 0xffffff);
  obj.position.set(-1, 2, 0);
  scene.add(obj);
}

{
  //кастомная фигура
  const shape = new THREE.Shape();
  const x = 1;
  const y = 2;

  const step = 0.5;
  shape.moveTo(x, y + step);
  shape.lineTo(x + step / 3, y + step / 3);
  shape.lineTo(x + step, y);

  shape.lineTo(x + step / 3, y - step / 3);
  shape.lineTo(x + step, y - step);

  shape.lineTo(x, y - step / 3);
  shape.lineTo(x - step, y - step);

  shape.lineTo(x - step / 3, y - step / 3);
  shape.lineTo(x - step, y);

  shape.lineTo(x - step / 3, y + step / 3);
  shape.lineTo(x, y + step);
  const extrudeSettings = {
    steps: 2,

    depth: 0.3,

    bevelEnabled: true,
    bevelThickness: 0.1,

    bevelSize: 0.1,

    bevelSegments: 1,
  };

  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  const obj = new THREE.Mesh(geometry, material);

  addWireframe(obj, 0xffffff);
  // obj.position.set(1, 0, 0);
  // obj.rotateZ(Math.PI);
  scene.add(obj);
}

{
  //диск с дыркой
  const innerRadius = 0.2;

  const outerRadius = 1;

  const thetaSegments = 18;

  const phiSegments = 2;

  const thetaStart = Math.PI * 0.25;

  const thetaLength = Math.PI * 1.5;

  const geometry = new THREE.RingGeometry(
    innerRadius,
    outerRadius,
    thetaSegments,
    phiSegments,
    thetaStart,
    thetaLength
  );
  const obj = new THREE.Mesh(geometry, material);

  addWireframe(obj, 0xffffff);
  obj.position.set(4, 2, 0);
  scene.add(obj);
}
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.target.set(0, 0, 0);

function animate() {
  requestAnimationFrame(animate);
  // controls.update();
  renderer.render(scene, camera);
}
animate();
//
