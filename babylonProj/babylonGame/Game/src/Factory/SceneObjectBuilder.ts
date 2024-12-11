import { Scene, Vector3, Color3, HemisphericLight, PointLight, DirectionalLight, SpotLight, Mesh, MeshBuilder, StandardMaterial, Vector2, Texture, IShadowLight, ShadowGenerator, ArcRotateCamera, Quaternion, Nullable, FreeCamera, Material, MultiMaterial, SubMesh } from "@babylonjs/core";
import { Transform } from "../Components/Transform";
import { CreateGameObjectArgs } from "./ComponentFactory";

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

  public CreateBox(name: string, transform : Transform, args? : CreateGameObjectArgs): Mesh {

    let createBoxArgs = { size: transform.GetSize() };

    if (args?.faceUV)
    {
      createBoxArgs["wrap"] = true;
      createBoxArgs["faceUV"] = args.faceUV;
    }

    let result = MeshBuilder.CreateBox(name, createBoxArgs, this.scene);
    result.position = transform.Position;
    result.rotationQuaternion = transform.Rotation;

    result.receiveShadows = true;
    result.material = this.CreateDefaultMaterial("mat_" + name);

    return result;
  }

  public CreateCapsule(name: string, transform : Transform): Mesh 
  {
    let result = MeshBuilder.CreateCapsule(name, {radius : transform.Scale.x, height : transform.Scale.y}, this.scene);
    result.position = transform.Position;
    result.rotationQuaternion = transform.Rotation;

    result.receiveShadows = true;
    result.material = this.CreateDefaultMaterial("mat_" + name);

    return result;
  }

  public CreateSphere(name: string, transform: Transform, segments: number = 32) {
    let result = MeshBuilder.CreateSphere(name, { diameterX: transform.Scale.x, diameterY : transform.Scale.y, diameterZ : transform.Scale.z, segments: segments }, this.scene);

    result.position = transform.Position;
    result.rotationQuaternion = transform.Rotation;
    result.receiveShadows = true;
    result.material = this.CreateDefaultMaterial("mat_" + name);

    return result;
  }

  public CreateCylinder(name : string, transform : Transform, tessalation : number, args? : CreateGameObjectArgs){

    let createCylinderArgs = { diameter : transform.Scale.x, tessellation : tessalation };

    if (args?.faceUV)
    {
      createCylinderArgs["wrap"] = true;
      createCylinderArgs["faceUV"] = args.faceUV;
    }

    let result = MeshBuilder.CreateCylinder(name, createCylinderArgs, this.scene);

    result.position = transform.Position;
    result.rotationQuaternion = transform.Rotation;
    result.receiveShadows = true;
    result.material = this.CreateDefaultMaterial("mat_" + name);

    return result;
  }

  private createMultiMaterial(name : string, size : number) : MultiMaterial
  {
    let result = new MultiMaterial(name, this.scene);

    for (var i = 0; i < size; i++)
    {
      let mat = this.CreateDefaultMaterial(name + i);
      mat.maxSimultaneousLights = 6;
      result.subMaterials.push(mat);
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


  public CreateDefaultMaterial(name: string) {
    let result = new StandardMaterial(name, this.scene);
    result.backFaceCulling = true;
    result.sideOrientation = Material.CounterClockWiseSideOrientation;
    result.maxSimultaneousLights = 6;
    //result.ambientColor = Color3.White();
    //result.emissiveColor = Color3.White();
    result.specularColor = Color3.White();
    result.specularPower = 16;
    return result;
  }

  public CreateGround(name: string, transform : Transform, tessalate? : number) {

    let tessalation = tessalate ?? 1;
    let grid = {h : tessalation, w : tessalation};
    let result = MeshBuilder.CreateTiledGround(name, { xmin: -3, zmin: -3, xmax: 3, zmax: 3, subdivisions : grid}, this.scene);
    result.position = transform.Position;
    result.receiveShadows = true;
    result.material = this.createMultiMaterial("mat_" + name, tessalation);
    this.createTiledSubmesh(result, grid.w, grid.h);
    return result;
  }

  public CreateTexture(filePath: string): Texture {
    let result = new Texture(filePath, this.scene);
    
    return result;
  }


  public CreatePlane(name: string, transform : Transform, tiled : boolean, tessalate : number = 8, args? : CreateGameObjectArgs) {
    let result : Nullable<Mesh> = null;

    let createPlaneArgs = { size : transform.GetSize(), sideOrientation: Mesh.FRONTSIDE, pattern : Mesh.FLIP_TILE };

    if (args?.orientation)
    {
      createPlaneArgs.sideOrientation = args.orientation;
    }

    if (args?.faceUV)
    {
      createPlaneArgs["wrap"] = true;
      createPlaneArgs["faceUV"] = args.faceUV;
    }
    
    if (tiled)
    {
      createPlaneArgs["pattern"] = Mesh.NO_FLIP;
      result = MeshBuilder.CreateTiledPlane(name, createPlaneArgs, this.scene);
    }
    else 
    {
      result = MeshBuilder.CreatePlane(name, createPlaneArgs, this.scene);
    }

    if (tessalate > 0)
    {
      result.increaseVertices(tessalate);
    }
    
    result.position = transform.Position;
    result.scaling = transform.Scale;

    let mat = this.CreateDefaultMaterial("mat_" + name);
    mat.diffuseColor = Color3.White();
    //mat.specularColor = Color3.White();

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

