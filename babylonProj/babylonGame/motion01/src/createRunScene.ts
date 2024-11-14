import { AbstractMesh, CubeTexture, _ENVTextureLoader, ActionManager } from "@babylonjs/core";
import { SceneData } from "./interfaces";
import {
  keyActionManager,
  keyDownMap,
  keyDownHeld,
  getKeyDown,
} from "./keyActionManager";

import "@babylonjs/core/Materials/Textures/Loaders/envTextureLoader";
import "@babylonjs/core/Helpers/sceneHelpers";

export default function createRunScene(runScene: SceneData) {
    runScene.scene.actionManager = new ActionManager(runScene.scene);
    keyActionManager(runScene.scene);
  
  
  runScene.audio.stop();
  runScene.scene.onBeforeRenderObservable.add(() => {
    // check and respond to keypad presses

    if (getKeyDown() == 1 && (keyDownMap["m"] || keyDownMap["M"])) {
      keyDownHeld();
      if (runScene.audio.isPlaying) {
        runScene.audio.stop();
      } else {
        runScene.audio.play();
      }
    }
  

  runScene.player.then((result) => {
    let character: AbstractMesh = result!.meshes[0];
    if (keyDownMap["w"] || keyDownMap["ArrowUp"]) {
      character.position.x -= 0.1;
      character.rotation.y = (3 * Math.PI) / 2;
    }
    if (keyDownMap["a"] || keyDownMap["ArrowLeft"]) {
      character.position.z -= 0.1;
      character.rotation.y = (2 * Math.PI) / 2;
    }
    if (keyDownMap["s"] || keyDownMap["ArrowDown"]) {
      character.position.x += 0.1;
      character.rotation.y = (1 * Math.PI) / 2;
    }
    if (keyDownMap["d"] || keyDownMap["ArrowRight"]) {
      character.position.z += 0.1;
      character.rotation.y = (0 * Math.PI) / 2;
    }
  });
});

  runScene.scene.onAfterRenderObservable.add(() => {});
}
