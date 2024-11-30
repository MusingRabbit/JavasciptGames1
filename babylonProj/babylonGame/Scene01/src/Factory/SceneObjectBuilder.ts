import { Scene, Vector3, Color3, HemisphericLight, PointLight, DirectionalLight, SpotLight, Mesh, MeshBuilder, StandardMaterial, Vector2, Texture, IShadowLight, ShadowGenerator, ArcRotateCamera, Quaternion, Nullable, FreeCamera } from "@babylonjs/core";
import { Transform } from "../Components/component";

export default class SceneObjectBuilder {
  scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  public CreateHemisphericLight(name: string, direction: Vector3, colour: Color3, intensity: number = 1.0) {
    let result = new HemisphericLight(name, direction, this.scene);

    result.intensity = intensity;
    result.specular = colour;
    result.diffuse = colour;
    result.groundColor = colour;

    return result;
  }

  public CreatePointLight(name: string, pos: Vector3, colour: Color3, intensity: number = 1.0) {
    let result = new PointLight(name, pos, this.scene);
    result.diffuse = colour;
    result.specular = colour;
    result.intensity = intensity;

    return result;
  }

  public CreateDirectionalLight(name: string, pos: Vector3, direction: Vector3, colour: Color3, intensity: number = 1.0) {
    let result = new DirectionalLight(name, direction, this.scene);
    result.position = pos;
    result.diffuse = colour;
    result.specular = colour;
    result.intensity = intensity;

    return result;
  }

  public CreateSpotLight(name: string, pos: Vector3, direction: Vector3, colour: Color3, angle: number, intensity: number = 1.0, exponent : number = 10) {
    let result = new SpotLight(name, pos, direction, angle, 20, this.scene);
    result.diffuse = colour;
    result.specular = colour;
    result.intensity = intensity;
    result.exponent = exponent;
    return result;
  }

  public CreateBox(name: string, transform : Transform): Mesh {
    let result = MeshBuilder.CreateBox(name, { size: transform.GetSize() }, this.scene);
    result.position = transform.position;
    result.rotationQuaternion = transform.rotation;

    result.receiveShadows = true;
    result.material = this.createDefaultMaterial("mat_" + name);

    return result;
  }

  public CreateCapsule(name: string, transform : Transform): Mesh 
  {
    let result = MeshBuilder.CreateCapsule(name, {radius : transform.scale.x, height : transform.scale.y}, this.scene);
    result.position = transform.position;
    result.rotationQuaternion = transform.rotation;

    result.receiveShadows = true;
    result.material = this.createDefaultMaterial("mat_" + name);

    return result;
  }

  public CreateSphere(name: string, transform: Transform, segments: number = 32) {
    let result = MeshBuilder.CreateSphere(name, { diameter: transform.scale.x, segments: segments }, this.scene);

    result.position = transform.position;
    result.rotationQuaternion = transform.rotation;
    result.receiveShadows = true;
    result.material = this.createDefaultMaterial("mat_" + name);

    return result;
  }

  private createDefaultMaterial(name: string) {
    let result = new StandardMaterial(name, this.scene);
    result.backFaceCulling = true;
    result.maxSimultaneousLights = 6;
    result.ambientColor = Color3.White();
    result.emissiveColor = Color3.White();
    result.specularPower = 8.0;
    return result;
  }

  public CreateGround(name: string, transform : Transform) {
    let result = MeshBuilder.CreateGround(name, { width: transform.scale.x, height: transform.scale.y }, this.scene);
    result.position = transform.position;
    result.receiveShadows = true;
    result.material = this.createDefaultMaterial("mat_" + name);

    return result;
  }

  public CreateTexture(filePath: string): Texture {
    let result = new Texture(filePath, this.scene);
    
    return result;
  }

  public CreatePlane(name: string, transform : Transform, tiled : boolean, tessalate : number = 8) {
    let result : Nullable<Mesh> = null;

    if (tiled)
    {
      let tileSize = (transform.GetSize() / tessalate) * 1.5;
      result = MeshBuilder.CreateTiledPlane(name, { tileSize : tileSize, sideOrientation: Mesh.DOUBLESIDE }, this.scene);
    }
    else 
    {
      result = MeshBuilder.CreatePlane(name, { sideOrientation: Mesh.DOUBLESIDE }, this.scene);
    }

    if (tessalate > 0)
    {
      result.increaseVertices(tessalate);
    }
    
    result.position = transform.position;
    result.scaling = transform.scale;

    let mat = this.createDefaultMaterial("mat_" + name);
    mat.diffuseColor = Color3.White();
    mat.specularColor = Color3.White();

    result.material = mat;

    return result;
  }

  public CreateFreeCamera(name : string, position : Vector3, movementSpeed : number, attachControl : boolean) : FreeCamera {
    let result = new FreeCamera(name, position, this.scene, true);

    if (attachControl)
    {
      result.attachControl();
    }

    result.speed = movementSpeed;

    return result;
  }

  public CreateArcRotateCamera(name: string, attatchControl: boolean): ArcRotateCamera {
    let camAlpha = -Math.PI / 2;
    let camBeta = Math.PI / 2.5;
    let camDist = 10; 
    let camTarget = Vector3.Zero();

    let result = new ArcRotateCamera(
      name,
      camAlpha,
      camBeta,
      camDist,
      camTarget,
      this.scene
    );

    result.speed = 0.2;

    if (attatchControl)
    {
      result.attachControl(attatchControl);
    }

    return result;
  }
}
