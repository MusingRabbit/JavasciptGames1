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
    lightHemispheric: HemisphericLight;
    camera: Camera;
    player:Promise<void | ISceneLoaderAsyncResult>;
    ground: Mesh;
  }