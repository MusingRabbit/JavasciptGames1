import "@babylonjs/core/Debug/debugLayer";
import { SceneData } from "./interfaces";
import "@babylonjs/inspector";
import {
    Scene,
    ArcRotateCamera,
    Vector3, Vector4,
    Color3,
    HemisphericLight,
    MeshBuilder,
    Mesh,
    InstancedMesh,
    Nullable,
    Light, PointLight, DirectionalLight, SpotLight,
    Camera,
    Engine,
    Texture, CubeTexture,
    ShadowGenerator, 
    SpriteManager,
    Sprite,
    IShadowLight,
    StandardMaterial,
  } from "@babylonjs/core";

  
  
  function createBox(style: number) {
    //style 1 small style 2 semi detatched
    const boxMat = new StandardMaterial("boxMat");
    const faceUV: Vector4[] = []; // faces for small house
    if (style == 1) {
      boxMat.diffuseTexture = new Texture("./assets/textures/cubehouse.png");
      faceUV[0] = new Vector4(0.5, 0.0, 0.75, 1.0); //rear face
      faceUV[1] = new Vector4(0.0, 0.0, 0.25, 1.0); //front face
      faceUV[2] = new Vector4(0.25, 0, 0.5, 1.0); //right side
      faceUV[3] = new Vector4(0.75, 0, 1.0, 1.0); //left side
      // faceUV[4] would be for bottom but not used
      // faceUV[5] would be for top but not used
    } else {
      boxMat.diffuseTexture = new Texture("./assets/textures/semihouse.png");
      faceUV[0] = new Vector4(0.6, 0.0, 1.0, 1.0); //rear face
      faceUV[1] = new Vector4(0.0, 0.0, 0.4, 1.0); //front face
      faceUV[2] = new Vector4(0.4, 0, 0.6, 1.0); //right side
      faceUV[3] = new Vector4(0.4, 0, 0.6, 1.0); //left side
      // faceUV[4] would be for bottom but not used
      // faceUV[5] would be for top but not used
    }
    
    const box = MeshBuilder.CreateBox("box", {
      width: style,
      height: 1,
      faceUV: faceUV,
      wrap: true,
    });
    box.position = new Vector3(0, 0.5, 0);
    box.scaling = new Vector3(1, 1, 1);
    box.material = boxMat;
    return box;
  }
  
  function createHemisphericLight(scene: Scene) {
    const light = new HemisphericLight(
      "light",
      new Vector3(2, 1, 0), // move x pos to direct shadows
      scene
    );
    light.intensity = 0.8;
    light.diffuse = new Color3(1, 1, 1);
    light.specular = new Color3(1, 0.8, 0.8);
    light.groundColor = new Color3(0, 0.2, 0.7);
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
    return result;
  }

  function createDirectionalLight(scene: Scene ){
    console.log("createDirectionalLight");
    const result = new DirectionalLight("light", new Vector3(0.2, -1, 0.2),scene);
    result.position = new Vector3(20, 40, 20);
    result.intensity = 0.7;
    result.diffuse = new Color3(1, 0, 0);
    result.specular = new Color3(0, 1, 0);
    return result;
  }

function createSpotLight(scene: Scene ){
  console.log("createSpotLight");
  const light = new SpotLight("light", new Vector3(1, 5, -3), 
      new Vector3(0, -1, 0), Math.PI / 3, 20, scene);
  light.intensity = 0.5;
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
    sphere.position.y = 1;
    sphere.receiveShadows = true;
    return sphere;
  }

  function createHouses(scene: Scene, style: number) {
    //Start by locating one each of the two house types then add others
  
    if (style == 1) {
      // show 1 small house
      createHouse(scene, 1);
    }
    if (style == 2) {
      // show 1 large house
      createHouse(scene, 2);
    }
    if (style == 3) {
      // show estate
      const houses: Nullable<Mesh>[] = [];
      // first two houses are original meshes
      houses[0] = createHouse(scene, 1);
      houses[0]!.rotation.y = -Math.PI / 16;
      houses[0]!.position.x = -6.8;
      houses[0]!.position.z = 2.5;
  
      houses[1] = createHouse(scene, 2);
      houses[1]!.rotation.y = -Math.PI / 16;
      houses[1]!.position.x = -4.5;
      houses[1]!.position.z = 3;
  
      //next houses are cloned instances of first two
      const ihouses: InstancedMesh[] = [];
      const places: number[][] = []; //each entry is an array [house type, rotation, x, z]
  
      places.push([2, -Math.PI / 16, -1.5, 4]);
      places.push([2, -Math.PI / 3, 1.5, 6]);
      places.push([2, (15 * Math.PI) / 16, -6.4, -1.5]);
      places.push([1, (15 * Math.PI) / 16, -4.1, -1]);
      places.push([2, (15 * Math.PI) / 16, -2.1, -0.5]);
      places.push([1, (5 * Math.PI) / 4, 0, -1]);
      places.push([1, Math.PI + Math.PI / 2.5, 0.5, -3]);
      places.push([2, Math.PI + Math.PI / 2.1, 0.75, -5]);
      places.push([1, Math.PI + Math.PI / 2.25, 0.75, -7]);
      places.push([2, Math.PI / 1.9, 4.75, -1]);
      places.push([1, Math.PI / 1.95, 4.5, -3]);
      places.push([2, Math.PI / 1.9, 4.75, -5]);
      places.push([1, Math.PI / 1.9, 4.75, -7]);
      places.push([2, -Math.PI / 3, 5.25, 2]);
      places.push([1, -Math.PI / 3, 6, 4]);
  
      for (let i = 0; i < places.length; i++) {
        if (places[i][0] === 1) {
          ihouses[i] = houses[0]!.createInstance("house" + i);
        } else {
          ihouses[i] = houses[1]!.createInstance("house" + i);
        }
        ihouses[i].rotation.y = places[i][1];
        ihouses[i].position.x = places[i][2];
        ihouses[i].position.z = places[i][3];
      }
    }
    // nothing returned by this function
  }

  function createHouse(scene: Scene, style: number) {
    const box = createBox(style);
    const roof = createRoof(style);
    const house = Mesh.MergeMeshes(
      [box, roof],
      true,
      false,
      undefined,
      false,
      true
    );
    // last true allows combined mesh to use multiple materials
    return house;
  }

  function createRoof(style: number) {
    const roof = MeshBuilder.CreateCylinder("roof", {
      diameter: 1.3,
      height: 1.2,
      tessellation: 3,
    });
    roof.scaling.x = 0.75;
    roof.scaling.y = style * 0.85;
    roof.rotation.z = Math.PI / 2;
    roof.position.y = 1.22;
    const roofMat = new StandardMaterial("roofMat");
    roofMat.diffuseTexture = new Texture("./assets/textures/roof.jpg");
    roof.material = roofMat;
    return roof;
  }
  
  function createSky(scene: Scene) {
    const skybox = MeshBuilder.CreateBox("skyBox", { size: 150 }, scene);
    const skyboxMaterial = new StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new CubeTexture(
      "./assets/textures/skybox/skybox",
      scene
    );
    skyboxMaterial.reflectionTexture.coordinatesMode =
      Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
    skyboxMaterial.specularColor = new Color3(0, 0, 0);
    skybox.material = skyboxMaterial;
    return skybox;
  }

  function createGround(scene: Scene) {
    const groundMaterial = new StandardMaterial("groundMaterial");
    groundMaterial.diffuseTexture = new Texture(
      "./assets/environments/villagegreen.png"
    );
    groundMaterial.diffuseTexture.hasAlpha = true;
    groundMaterial.backFaceCulling = false;
    const ground = MeshBuilder.CreateGround(
      "ground",
      { width: 24, height: 24 },
      scene
    );
    ground.material = groundMaterial;
    ground.position.y = 0.01;
    return ground;
  }

  function createTerrain(scene: Scene) {
    //Create large ground for valley environment
    const largeGroundMat = new StandardMaterial("largeGroundMat");
    largeGroundMat.diffuseTexture = new Texture("./assets/environments/valleygrass.png");
  
    const largeGround = MeshBuilder.CreateGroundFromHeightMap(
      "largeGround",
      "./assets/environments/villageheightmap.png",
      {
        width: 150,
        height: 150,
        subdivisions: 20,
        minHeight: 0,
        maxHeight: 10,
      },
      scene
    );
    largeGround.material = largeGroundMat;
    largeGround.position.y = -0.01;
  }

  function createTrees(scene: Scene) {
    const spriteManagerTrees = new SpriteManager(
      "treesManager",
      "./assets/sprites/tree.png",
      2000,
      { width: 512, height: 1024 },
      scene
    );
  
    //We create trees at random positions
    for (let i = 0; i < 500; i++) {
      const tree: Sprite = new Sprite("tree", spriteManagerTrees);
      tree.position.x = Math.random() * -30;
      tree.position.z = Math.random() * 20 + 8;
      tree.position.y = 0.2;
    }
  
    for (let i = 0; i < 500; i++) {
      const tree = new Sprite("tree", spriteManagerTrees);
      tree.position.x = Math.random() * 25 + 7;
      tree.position.z = Math.random() * -35 + 8;
      tree.position.y = 0.2;
    }
    // nothing returned by this function
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
    result.bias = 0;

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
    }

    return result;
  }
  
  function createArcRotateCamera(scene: Scene) {
    let camAlpha = -Math.PI / 2,
      camBeta = Math.PI / 2.5,
      camDist = 25,
      camTarget = new Vector3(0, 0, 0);
    let camera = new ArcRotateCamera(
      "camera1",
      camAlpha,
      camBeta,
      camDist,
      camTarget,
      scene
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

export default function createStartScene(engine: Engine) {
  let scene   = new Scene(engine);
  let ground  = createGround(scene);
  let sky     = createSky(scene);
  let lightHemispheric = createHemisphericLight(scene);
  createHouses(scene, 3);
  createTrees(scene);
  createTerrain(scene);
  let camera  = createArcRotateCamera(scene);


  let data: SceneData = {
    scene,
    ground,
    sky,
    lightHemispheric,
    camera
  };
  return data;
}