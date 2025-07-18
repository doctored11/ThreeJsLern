import * as THREE from 'three';

export class SceneManager {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  
  public sphere: THREE.Mesh<THREE.SphereGeometry, THREE.MeshPhongMaterial>;
  public sphereLight: THREE.PointLight;
  
  public cube: THREE.Mesh<THREE.BoxGeometry, THREE.MeshPhongMaterial>;

  constructor() {
    this.initScene();
    this.createSphere();
    this.createCube();
    this.addLight();
  }

  private initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x111111);
    
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    document.body.appendChild(this.renderer.domElement);
  }

  private createSphere() {
    const geometry = new THREE.SphereGeometry(1, 16, 16);
    const material = new THREE.MeshPhongMaterial({ 
      color: 0xffff00,
      emissive: 0xffff00,    
      emissiveIntensity: 0.8, 
      shininess: 100         
    });
    
    this.sphere = new THREE.Mesh(geometry, material);
    this.sphere.position.set(0, 0, 0);
    this.sphere.castShadow = true;
    this.scene.add(this.sphere);

    this.addWireframe(this.sphere, 0xffaabb);
    
    this.sphereLight = new THREE.PointLight(0xffff00, 2, 10);
    this.sphereLight.position.copy(this.sphere.position);
    this.scene.add(this.sphereLight);
  }

  private createCube() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ 
      color: 0x2233ff,
      shininess: 80
    });
    
    this.cube = new THREE.Mesh(geometry, material);
    this.cube.position.set(3, 0, 0);
    this.cube.castShadow = true;
    this.cube.receiveShadow = true;
    this.scene.add(this.cube);
    
    this.addWireframe(this.cube, 0x226622);
  }

  private addLight() {
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    this.scene.add(ambientLight);
  }

  private addWireframe(mesh: THREE.Mesh, color: number = 0xffffff) {
    const wireframe = new THREE.LineSegments(
      new THREE.WireframeGeometry(mesh.geometry),
      new THREE.LineBasicMaterial({ 
        color,
        transparent: true,
        opacity: 0.5
      })
    );
    mesh.add(wireframe);
  }

  public update() {
    this.sphere.rotation.x += 0.01;
    this.sphere.rotation.y += 0.01;
    
    this.sphereLight.position.copy(this.sphere.position);
    
    this.renderer.render(this.scene, this.camera);
  }
}