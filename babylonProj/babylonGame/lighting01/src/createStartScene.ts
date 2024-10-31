import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import {
    Scene,
    ArcRotateCamera,
    Vector3,
    Color3,
    HemisphericLight,
    MeshBuilder,
    Mesh,
    Light, PointLight, DirectionalLight, SpotLight,
    Camera,
    Engine,
    ShadowGenerator,
    IShadowLight,
    StandardMaterial,
  } from "@babylonjs/core";
  
  
  function createBox(scene: Scene) {
    let box = MeshBuilder.CreateBox("box",{size: 1}, scene);
    box.position.y = 3;
    return box;
  }

  
  function createHemisphericLight(scene: Scene) {
    const light = new HemisphericLight("light", new Vector3(1, 1, 0), scene);
    light.intensity = 0.7;
    light.diffuse = new Color3(1, 0, 0);
    light.specular = new Color3(0, 1, 0);
    light.groundColor = new Color3(0, 1, 0);
    return light;
  }

  function createPointLight(scene : Scene)
  {
    const result = new PointLight("light", new Vector3(-1, 1, 0), scene);
    result.position = new Vector3(5,20,10);
    result.intensity = 0.3;
    result.diffuse = new Color3(0.5, 1, 1);
    result.specular = new Color3(0.8, 1, 1);
    return result;
  }

  function createDirectionalLight(scene: Scene ){
    const result = new DirectionalLight("light", new Vector3(0.2, -1, 0.2),scene);
    result.position = new Vector3(20, 40, 20);
    result.intensity = 0.7;
    result.diffuse = new Color3(1, 0, 0);
    result.specular = new Color3(0, 1, 0);
    return result;
}

function createSpotLight(scene: Scene ){
  const light = new SpotLight("light", new Vector3(1, 5, -3), 
      new Vector3(0, -1, 0), Math.PI / 3, 20, scene);
  light.intensity = 0.5;
  light.diffuse = new Color3(1, 0, 0);
  light.specular = new Color3(0, 1, 0);
  return light;
}
  
  function createSphere(scene: Scene) {
    let sphere = MeshBuilder.CreateSphere(
      "sphere",
      { diameter: 2, segments: 32 },
      scene,
    );
    sphere.position.y = 1;
    return sphere;
  }
  
  function createGround(scene: Scene) {
    let ground = MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);
    var groundMaterial = new StandardMaterial("groundMaterial", scene);
    groundMaterial.backFaceCulling = true;
    ground.material = groundMaterial;
    ground.receiveShadows = true;
    return ground;
  }

  function createShadowGenerator(light : IShadowLight, meshes : Mesh[]){
    const shadower = new ShadowGenerator(1024, light);
    shadower.setDarkness(0.2);
    shadower.useBlurExponentialShadowMap = true;
    shadower.blurScale = 4;
    shadower.blurBoxOffset = 1;
    shadower.useKernelBlur = true;
    shadower.blurKernel = 64;
    shadower.bias = 0;

    const sMap = shadower.getShadowMap();

    for (var i = 0; i < meshes.length; i++)
    {
      let mesh = meshes[i];
      sMap?.renderList?.push(mesh);
    }

    return shadower;
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
    camera.attachControl(true);
    return camera;
  }
  
  export default function createStartScene(engine: Engine) {
    interface SceneData {
      scene:Scene,
      box?: Mesh,
      lightBulb?: PointLight,
      lightDirectional?: DirectionalLight,
      lightSpot?: SpotLight,
      lightHemispheric?: HemisphericLight,
      sphere?: Mesh,
      ground?: Mesh,
      camera?:Camera,
      shadowGenerator?: ShadowGenerator
    }
  
    let that: SceneData = { scene: new Scene(engine) };
    that.scene.debugLayer.show();
  
    that.box = createBox(that.scene);
    that.lightBulb = createPointLight(that.scene);
    that.lightHemispheric = createHemisphericLight(that.scene);
    that.lightSpot = createSpotLight(that.scene);

    that.sphere = createSphere(that.scene);
    that.ground = createGround(that.scene);
    that.camera = createArcRotateCamera(that.scene);

    let meshes:Mesh[] = new Array();
    meshes.push(that.box);
    meshes.push(that.sphere);
    meshes.push(that.ground);

    that.shadowGenerator = createShadowGenerator(that.lightSpot, meshes)
    return that;
  }