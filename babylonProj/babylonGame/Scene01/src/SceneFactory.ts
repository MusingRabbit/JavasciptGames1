import { Scene, Vector3, Color3, HemisphericLight, PointLight, DirectionalLight, SpotLight, Mesh, MeshBuilder, StandardMaterial, Vector2, Texture, IShadowLight, ShadowGenerator, ArcRotateCamera } from "@babylonjs/core";

export default class SceneFactory {
  scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  public CreateHemisphericLight(name: string, direction: Vector3, colour: Color3, intensity: number = 1.0) {
    let result = new HemisphericLight(name, direction, this.scene);

    result.intensity = intensity;
    result.specular = Color3.White();
    result.diffuse = colour;
    result.groundColor = colour;
    result.intensity = intensity;

    return result;
  }

  public CreatePointLight(name: string, pos: Vector3, colour: Color3, intensity: number = 1.0) {
    let result = new PointLight(name, pos, this.scene);
    result.diffuse = colour;
    result.specular = Color3.White();
    result.intensity = intensity;

    return result;
  }

  public CreateDirectionalLight(name: string, pos: Vector3, direction: Vector3, colour: Color3, intensity: number = 1.0) {
    let result = new DirectionalLight(name, direction, this.scene);
    result.position = pos;
    result.diffuse = colour;
    result.specular = Color3.White();
    result.intensity = intensity;

    return result;
  }

  public CreateSpotLight(name: string, pos: Vector3, direction: Vector3, colour: Color3, angle: number, intensity: number = 1.0) {
    let result = new SpotLight(name, pos, direction, angle, 20, this.scene);
    result.diffuse = colour;
    result.specular = Color3.White();
    result.intensity = intensity;

    return result;
  }

  public CreateBox(name: string, pos: Vector3, boxSize: number): Mesh {
    let result = MeshBuilder.CreateBox(name, { size: boxSize }, this.scene);
    result.position = pos;
    result.receiveShadows = true;
    result.material = this.createDefaultMaterial("defaultMat");

    return result;
  }

  public CreateSphere(name: string, pos: Vector3, diameter: number = 2, segments: number = 32) {
    let result = MeshBuilder.CreateSphere(name, { diameter: diameter, segments: segments }, this.scene);

    result.position = pos;
    result.receiveShadows = true;
    result.material = this.createDefaultMaterial("defaultMat");

    return result;
  }

  private createDefaultMaterial(name: string) {
    let result = new StandardMaterial(name, this.scene);
    result.backFaceCulling = true;

    return result;
  }

  public CreateGround(name: string, dimensions: Vector2) {
    let result = MeshBuilder.CreateGround(name, { width: dimensions.x, height: dimensions.y }, this.scene);
    result.receiveShadows = true;
    result.material = this.createDefaultMaterial("defaultMat");

    return result;
  }

  public CreateTexture(filePath: string): Texture {
    let result = new Texture(filePath, this.scene);

    return result;
  }

  public CreatePlane(name: string, pos: Vector3, txr: Texture, size: number) {
    let result = MeshBuilder.CreatePlane(name, { size: size, sideOrientation: Mesh.DOUBLESIDE }, this.scene);
    result.position = pos;

    let mat = this.createDefaultMaterial("defaultMat");
    mat.diffuseColor = Color3.White();
    mat.specularColor = Color3.White();
    mat.ambientTexture = txr;

    result.material = mat;

    return result;
  }

  public CreateShadowGenerator(light: IShadowLight): ShadowGenerator {
    const result = new ShadowGenerator(1024, light);
    result.setDarkness(0.2);
    result.useBlurExponentialShadowMap = true;
    result.blurScale = 2;
    result.blurBoxOffset = 1;
    result.useKernelBlur = true;
    result.blurKernel = 64;
    result.bias = 0;

    const sMap: any = result.getShadowMap();

    if (sMap == null || sMap?.renderList == null) {
      console.log("Shadowmap is null!");
    }

    let meshes = this.scene.meshes;

    console.log("Adding " + meshes.length + " meshes to shadowmap");

    for (var i = 0; i < meshes.length; i++) {
      let mesh = meshes[i];
      console.log("Adding mesh " + mesh.name);
      sMap.renderList.push(mesh);
      result.addShadowCaster(mesh, true);
    }

    return result;
  }

  public CreateArcRotateCamera(name: string, attatchControl: boolean): ArcRotateCamera {
    let camAlpha = -Math.PI / 2, camBeta = Math.PI / 2.5, camDist = 10, camTarget = new Vector3(0, 0, 0);

    let result = new ArcRotateCamera(
      name,
      camAlpha,
      camBeta,
      camDist,
      camTarget,
      this.scene
    );

    result.attachControl(attatchControl);
    return result;
  }
}