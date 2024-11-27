import { SceneData } from "./interfaces";
import { Scene, 
  ArcRotateCamera, 
  Vector2,
  Vector3,
  MeshBuilder, 
  StandardMaterial,
  HemisphericLight, 
  Color3, 
  Engine,
  Texture,
  SceneLoader,
  AbstractMesh,
  CubeTexture,
  ISceneLoaderAsyncResult,
  Sound} from "@babylonjs/core";
  

  function backgroundMusic(scene: Scene)
  {
    let music = new Sound("music", "./assets/audio/arcade-kid.mp3", scene, null, {loop:true, autoplay:true});
    Engine.audioEngine!.useCustomUnlockedButton = true;

    window.addEventListener("click", () => 
      { 
        if (!Engine.audioEngine!.unlocked) 
        {
          Engine.audioEngine!.unlock();
        } 
      }, {once:true});

    return music;
  }

  function createGround(scene: Scene){
    const matGround = new StandardMaterial("groundMaterial");
    const txrGround = new Texture("./assets/textures/wood.jpg");

    txrGround.uScale = 4.0;
    txrGround.vScale = 4.0;
    txrGround.hasAlpha = true;
    matGround.diffuseTexture = txrGround;

    let ground = MeshBuilder.CreateGround("ground", 
      {width : 15, height : 15, subdivisions : 4},
      scene
    )

    ground.material = matGround;
    return ground;
  }


  function createHemisphericLight(scene: Scene ){
    const light:HemisphericLight = new HemisphericLight("light", new Vector3(2, 1, 0), scene);
    light.intensity = 0.7;
    light.diffuse = new Color3(1, 1, 1);
    light.specular = new Color3(1, 0.8, 0.8);
    light.groundColor = new Color3(0, 0.2, 0.7);
    return light;
}
  
  function createBox(scene: Scene) {
    let box = MeshBuilder.CreateBox("box",{size: 1}, scene);
    box.position.y = 3;
    return box;
  }

  function createArcRotateCamera(scene: Scene) {
    let camAlpha = -Math.PI / 2,
      camBeta = Math.PI / 2.5,
      camDist = 10,
      camTarget = new Vector3(0, 0, 0);

    let camera = new ArcRotateCamera(
      "camera1",
      camAlpha,
      camBeta,
      camDist,
      camTarget,
      scene,
    );

    camera.lowerRadiusLimit = 9;
    camera.upperRadiusLimit = 25;
    camera.lowerAlphaLimit = 0;
    camera.upperAlphaLimit = Math.PI * 2;
    camera.lowerBetaLimit = 0;
    camera.upperBetaLimit = Math.PI / 2.02;

    camera.attachControl(true);
    return camera;
  }

  function importDummyMesh(scene: Scene, position : Vector3) {
    let item: Promise<void | ISceneLoaderAsyncResult> =
      SceneLoader.ImportMeshAsync(
        "",
        "./assets/models/",
        "dummy3.babylon",
        scene
      );
  
    item.then((result) => {
      let character: AbstractMesh = result!.meshes[0];
      character.position = position;
      character.scaling = new Vector3(1, 1, 1);
      character.rotation = new Vector3(0, 1.5, 0);
    });
    return item;
  }

  function createSkybox(scene : Scene)
  {
    const environmentTexture = new CubeTexture(
      "assets/textures/industrialSky.env",
      scene
    );
    const skybox = scene.createDefaultSkybox(
      environmentTexture,
      true,
      10000,
      0.1
    );

    return skybox;
  }

  export default function createStartScene(engine: Engine) {
    let scene = new Scene(engine);
    let audio = backgroundMusic(scene);
    let lightHemispheric = createHemisphericLight(scene);
    let camera = createArcRotateCamera(scene);
    let player = importDummyMesh(scene, new Vector3(0,0,0));
    let ground = createGround(scene);
    let skyBox = createSkybox(scene);

  
    let sceneData: SceneData = {
      scene,
      audio,
      lightHemispheric,
      camera,
      player,
      ground,
    };
    return sceneData;
  }
