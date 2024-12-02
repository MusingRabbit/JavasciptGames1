import { Scene, Vector3, Color3, HemisphericLight, PointLight, DirectionalLight, SpotLight, Mesh, MeshBuilder, StandardMaterial, Vector2, Texture, IShadowLight, ShadowGenerator, ArcRotateCamera, Quaternion, Nullable, FreeCamera, Material, MultiMaterial, SubMesh } from "@babylonjs/core";
import { Transform } from "../Components/Transform";

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

  private createMultiMaterial(name : string, size : number) : MultiMaterial
  {
    let result = new MultiMaterial(name, this.scene);

    for (var i = 0; i < size; i++)
    {
      let mat = this.createDefaultMaterial(name + i);
      mat.maxSimultaneousLights = 2;
      result.subMaterials.push(this.createDefaultMaterial(name + i));
    }
    

    return result;
  }

  private createTiledSubmesh(mesh : Mesh, w : number, h : number)
  {
    const verticesCount = mesh.getTotalVertices();
    const tileIndicesLength = mesh.getIndices()?.length ?? 1 / (w * h);

    let base = 0;
    for (let row = 0; row < h; row++) {
        for (let col = 0; col < w; col++) {
            mesh.subMeshes.push(new SubMesh(row%2 ^ col%2, 0, verticesCount, base , tileIndicesLength, mesh));
            base += tileIndicesLength;
        }
    }
  }


  private createDefaultMaterial(name: string) {
    let result = new StandardMaterial(name, this.scene);
    result.backFaceCulling = true;
    result.sideOrientation = Material.CounterClockWiseSideOrientation;
    result.maxSimultaneousLights = 6;
    result.ambientColor = Color3.White();
    result.emissiveColor = Color3.White();
    result.specularPower = 8.0;
    return result;
  }

  public CreateGround(name: string, transform : Transform, tessalate : number = 8) {

    let grid = {h : tessalate, w : tessalate};
    let result = MeshBuilder.CreateTiledGround(name, { xmin: -3, zmin: -3, xmax: 3, zmax: 3, subdivisions : grid}, this.scene);
    result.position = transform.position;
    result.receiveShadows = true;
    result.material = this.createMultiMaterial("mat_" + name, tessalate);
    this.createTiledSubmesh(result, grid.w, grid.h);
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
      result = MeshBuilder.CreateTiledPlane(name, { size : transform.GetSize(), sideOrientation: Mesh.FRONTSIDE, pattern : Mesh.FLIP_TILE }, this.scene);
    }
    else 
    {
      result = MeshBuilder.CreatePlane(name, { sideOrientation: Mesh.FRONTSIDE }, this.scene);
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

