import {
    Scene,
    Mesh,
    HemisphericLight,
    Camera,
    Sound,
    ISceneLoaderAsyncResult
  } from "@babylonjs/core";
  
  export interface SceneData {
    scene: Scene;
    audio: Sound,
    lightHemispheric: HemisphericLight,
    camera: Camera,
    box1 : Mesh,
    box2 : Mesh,
    ground: Mesh,
    player:Promise<void | ISceneLoaderAsyncResult>,
    
  }