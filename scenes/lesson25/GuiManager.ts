import GUI from 'lil-gui';
import * as THREE from 'three';
import { SceneManager } from './SceneManager';

interface SphereMaterialParams {
  color: string;
  emissive: string;
  emissiveIntensity: number;
  lightIntensity: number;
  shininess: number;
}

export class GuiManager {
  private gui: GUI;
  private sphereParams: SphereMaterialParams;

  constructor(private sceneManager: SceneManager) {
    this.gui = new GUI();
    
    const material = sceneManager.sphere.material;
    
    this.sphereParams = {
      color: `#${material.color.getHexString()}`,
      emissive: `#${material.emissive.getHexString()}`,
      emissiveIntensity: material.emissiveIntensity,
      lightIntensity: sceneManager.sphereLight.intensity,
      shininess: material.shininess
    };

    this.setupControls(material);
  }

  private setupControls(material: THREE.MeshPhongMaterial) {
    const sphereFolder = this.gui.addFolder('Sphere');
    
    sphereFolder
      .addColor(this.sphereParams, 'color')
      .name('Color')
      .onChange((value: string) => {
        material.color.set(value);
      });

    sphereFolder
      .addColor(this.sphereParams, 'emissive')
      .name('Glow Color')
      .onChange((value: string) => {
        material.emissive.set(value);
        this.sceneManager.sphereLight.color.set(value);
      });

    sphereFolder
      .add(this.sphereParams, 'emissiveIntensity', 0, 2)
      .name('Glow Intensity')
      .onChange((value: number) => {
        material.emissiveIntensity = value;
      });
    
    sphereFolder
      .add(this.sphereParams, 'lightIntensity', 0, 100)
      .name('Light Power')
      .onChange((value: number) => {
        this.sceneManager.sphereLight.intensity = value;
      });
    
    sphereFolder
      .add(this.sphereParams, 'shininess', 0, 200)
      .name('Shininess')
      .onChange((value: number) => {
        material.shininess = value;
      });

    sphereFolder.open();
  }
}