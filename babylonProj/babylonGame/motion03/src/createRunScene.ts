import {
  AbstractMesh,
  ActionManager,
  CubeTexture,
  Vector3,
  Mesh,
  Skeleton
} from "@babylonjs/core";
import { SceneData } from "./interfaces";
import {
  keyActionManager,
  keyDownMap,
  keyDownHeld,
  getKeyDown,
} from "./keyActionManager";
import { characterActionManager } from "./characterActionManager";
import { bakedAnimations, walk, run, left, right, idle, stopAnimation, getAnimating, toggleAnimating } from "./bakedAnimations";
import { collisionDeclaration } from "./collisionDeclaration";

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
    let characterMoving = true;
    if (keyDownMap["w"] || keyDownMap["ArrowUp"]) {
      character.position.x -= 0.1;
      character.rotation.y = (3 * Math.PI) / 2;
      characterMoving = true;
    }
    if (keyDownMap["a"] || keyDownMap["ArrowLeft"]) {
      character.position.z -= 0.1;
      character.rotation.y = (2 * Math.PI) / 2;
      characterMoving = true;
    }
    if (keyDownMap["s"] || keyDownMap["ArrowDown"]) {
      character.position.x += 0.1;
      character.rotation.y = (1 * Math.PI) / 2;
      characterMoving = true;
    }
    if (keyDownMap["d"] || keyDownMap["ArrowRight"]) {
      character.position.z += 0.1;
      character.rotation.y = (0 * Math.PI) / 2;
      characterMoving = true;
    }

    if (getKeyDown() && characterMoving) {
      if (!getAnimating()) {
        walk();
        toggleAnimating(); 
      }
    } else {
      if (getAnimating()) {
        idle();
        toggleAnimating();
      }
    }  

  });

  // add baked in animations to player
  runScene.player.then((result) => {

  });

  runScene.player.then((result) => {  
    let skeleton: Skeleton = result!.skeletons[0];
    let characterMesh = result!.meshes[0];

    bakedAnimations(runScene.scene, skeleton)
    characterActionManager(runScene.scene, characterMesh as Mesh);
    collisionDeclaration(runScene);
  });
});

  runScene.scene.onAfterRenderObservable.add(() => {});
}
