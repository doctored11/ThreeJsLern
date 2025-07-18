import { SceneManager } from './SceneManager';
import { GuiManager } from './GuiManager';

class App {
  private sceneManager: SceneManager;
  private guiManager: GuiManager;

  constructor() {
    this.sceneManager = new SceneManager();
    this.guiManager = new GuiManager(this.sceneManager);
    this.animate();
  }

  private animate() {
    requestAnimationFrame(() => this.animate());
    this.sceneManager.update();
  }
}

new App();