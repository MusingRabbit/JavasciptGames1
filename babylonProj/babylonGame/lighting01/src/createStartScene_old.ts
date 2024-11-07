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
    Engine, Texture,
    ShadowGenerator,
    IShadowLight,
    StandardMaterial,
    AbstractMesh,
  } from "@babylonjs/core";
  
  
  function createBox(scene: Scene) {
    console.log("createBox");
    let box = MeshBuilder.CreateBox("box",{size: 1}, scene);
    box.position.y = 0.5;
    box.receiveShadows = true;
    return box;
  }

  
  function createHemisphericLight(scene: Scene) {
    console.log("createHemisphericLight");
    const light = new HemisphericLight("light", new Vector3(1, 1, 0), scene);
    light.intensity = 0.1;
    light.diffuse = new Color3(1, 0, 0);
    light.specular = new Color3(0, 1, 0);
    light.groundColor = new Color3(0, 1, 0);
    return light;
  }

  function createPointLight(scene : Scene)
  {
    console.log("createPointLight");
    const result = new PointLight("light", new Vector3(-1, 1, 0), scene);
    result.position = new Vector3(5,20,10);
    result.intensity = 0.3;
    result.diffuse = new Color3(0.5, 1, 1);
    result.specular = new Color3(0.8, 1, 1);
    result.shadowMinZ = 0.01;
    return result;
  }

  function createDirectionalLight(scene: Scene ){
    console.log("createDirectionalLight");
    const result = new DirectionalLight("light", new Vector3(0.2, -1, 0.2),scene);
    result.position = new Vector3(10, 40, 10);
    result.intensity = 1.0;
    result.diffuse = new Color3(1, 1, 1);
    result.specular = new Color3(1, 1, 1);
    // result.shadowMinZ = 0.01;
    return result;
}

function createSpotLight(scene: Scene ){
  console.log("createSpotLight");
  const light = new SpotLight("light", new Vector3(1, 5, -3), 
      new Vector3(0, -1, 0), Math.PI / 3, 20, scene);
  light.intensity = 1.5;
  light.diffuse = new Color3(1, 0, 0);
  light.specular = new Color3(0, 1, 0);
  return light;
}
  
  function createSphere(scene: Scene) {
    console.log("createSphere");
    let sphere = MeshBuilder.CreateSphere(
      "sphere",
      { diameter: 2, segments: 32 },
      scene,
    );
    sphere.position.y = 2;
    sphere.receiveShadows = true;
    return sphere;
  }
  
  function createGround(scene: Scene) {
    console.log("createGround");
    let ground = MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);
    var groundMaterial = new StandardMaterial("groundMaterial", scene);
    groundMaterial.backFaceCulling = true;
    ground.material = groundMaterial;
    ground.receiveShadows = true;
    return ground;
  }

  function createPlane(scene: Scene, filePath:string) {
    let plane = MeshBuilder.CreatePlane(
      "plane",
      { size: 3, sideOrientation: Mesh.DOUBLESIDE },
      scene
    );
    plane.position.y = 1;
  
    var texture = new StandardMaterial("reflective", scene);
    texture.ambientTexture = new Texture(filePath, scene);
    texture.diffuseColor = new Color3(1, 1, 1);
    plane.material = texture;
    return plane;
  }

  function createShadowGenerator(light : IShadowLight, meshes : Mesh[]){
    console.log("createShadowGenerator");
    const result = new ShadowGenerator(1024, light);
    result.setDarkness(0.2);
    result.useBlurExponentialShadowMap = true;
    result.blurScale = 4;
    result.blurBoxOffset = 1;
    result.useKernelBlur = true;
    result.blurKernel = 64;
    result.bias = 10;
    

    const sMap : any = result.getShadowMap();

    if (sMap == null || sMap?.renderList == null)
    {
      console.log("Shadowmap is null!");
    }

    console.log("Adding " + meshes.length + " meshes to shadowmap");

    for (var i = 0; i < meshes.length; i++)
    {
      let mesh = meshes[i];
      console.log("Adding mesh " + mesh.name);
      sMap.renderList.push(mesh);
      result.addShadowCaster(mesh, true);
    }

    return result;
  }
  
  function createArcRotateCamera(scene: Scene) {

    console.log("createArcRotateCamera");

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
    console.log("createStartScene");

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
  
    let data: SceneData = { scene: new Scene(engine) };
    data.scene.debugLayer.show();
  
    data.box = createBox(data.scene);
    //data.lightBulb = createPointLight(data.scene);
    //data.lightHemispheric = createHemisphericLight(data.scene);
    //data.lightSpot = createSpotLight(data.scene);
    data.lightDirectional = createDirectionalLight(data.scene);

    data.sphere = createSphere(data.scene);
    data.ground = createGround(data.scene);
    data.camera = createArcRotateCamera(data.scene);

    data.shadowGenerator = createShadowGenerator(data.lightDirectional, [data.box, data.sphere])
    return data;
  }