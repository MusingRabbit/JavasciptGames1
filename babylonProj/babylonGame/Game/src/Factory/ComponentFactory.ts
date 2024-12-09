import { Color3, Material, Matrix, Mesh, Scene, Texture, Vector3 } from "@babylonjs/core";

import SceneObjectBuilder from "./SceneObjectBuilder";
import { TextureData } from "../Data/TextureRepository";
import { Transform } from "../Components/Transform";
import { LightType, ShapeType } from "../Global";
import { MeshComponent } from "../Components/MeshComponent";
import { LightComponent } from "../Components/LightComponent";

export class CreateCameraComponentArgs
{
    name :string;
    transform : Transform;
}

export class CreateMeshComponentArgs
{
    name : string;
    transform? : Transform;
    mesh? : Mesh;
    material? : Material;
    txrData? : TextureData;
    shape : ShapeType;
    tessalation? : number | null = null;

    constructor()
    {
        this.name = "component";
        this.shape = ShapeType.Box;
    }
}

export class CreateLightComponentArgs
{
    name : string;
    transform? : Transform;
    type : LightType;
    colour : Color3;
    intensity? : number;
    radius? : number;
    angle? : number;
    range? : number;
    exponent?:number;
    
    constructor()
    {
        this.name = "component";
        this.transform = new Transform();
        this.type = LightType.Spot;
        this.colour = Color3.White();
        this.intensity = 1.0;
        this.angle = 45;
        this.range = 10;
        this.exponent = 5;
    }
}

export class ComponentFactory
{
    scene : Scene;
    sceneObjBuilder : SceneObjectBuilder

    constructor(scene : Scene)
    {
        this.scene = scene;
        this.sceneObjBuilder = new SceneObjectBuilder(this.scene);
    }

    public CreateCameraComponent(args : CreateCameraComponentArgs)
    {
        // TODO:
    }

    public CreateMeshComponent(args : CreateMeshComponentArgs)
    {
        let result = new MeshComponent();
        let transform = new Transform();

        if (args.transform)
        {
            transform.Position = args.transform.Position;
            transform.Rotation = args.transform.Rotation;
            transform.Scale = args.transform.Scale;
        }

        if (args.mesh)
        {
            this.scene.addMesh(args.mesh, true);
            result.SetMesh(args.mesh);
        }
        else
        {
            switch(args.shape)
            {
                case ShapeType.Box:
                    let box = this.sceneObjBuilder.CreateBox(args.name + "_box", transform);
                    result.SetMesh(box);
                    break;
                case ShapeType.Capsule:
                    let capsule = this.sceneObjBuilder.CreateCapsule(args.name + "_captsule", transform);
                    result.SetMesh(capsule);
                    break;
                case ShapeType.Ground:
                    let ground = this.sceneObjBuilder.CreateGround(args.name + "_ground", transform, args?.tessalation ?? 1);
                    result.SetMesh(ground);
                    break;
                case ShapeType.Plane:
                    let plane = this.sceneObjBuilder.CreatePlane(args.name + "_plane", transform, false);
                    result.SetMesh(plane);
                    break;
                case ShapeType.TiledPlane:
                    let tilePlane = this.sceneObjBuilder.CreatePlane(args.name + "_plane", transform, true , args?.tessalation ?? 10);
                    result.SetMesh(tilePlane);
                    break;
                case ShapeType.Sphere:
                    let sphere = this.sceneObjBuilder.CreateSphere(args.name + "_sphere", transform, args?.tessalation ?? 32);
                    result.SetMesh(sphere);
                    break;
            }
        }

        if (args.material)
        {
            result.SetMaterial(args.material);
        }

        if (args.txrData)
        {
            result.SetTextureData(args.txrData);
        }

        return result;
    }

    public CreateLightComponent(args: CreateLightComponentArgs)
    {
        let result = new LightComponent();

        let transform = new Transform();

        if (args.transform)
        {
            transform = args.transform;
        }

        let mtxRot = new Matrix();
        transform.Rotation.toRotationMatrix(mtxRot)
        let dir = Vector3.TransformCoordinates(transform.Position, mtxRot);

        switch(args.type)
        {
            case LightType.Hemispheric:
                result.light = this.sceneObjBuilder.CreateHemisphericLight(args.name, dir, args.colour);
                break;
            case LightType.Spot:
                result.light = this.sceneObjBuilder.CreateSpotLight(args.name, transform.Position, dir, args.colour, args.angle ?? 45, args.exponent);
                break;
            case LightType.Directional:
                result.light = this.sceneObjBuilder.CreateDirectionalLight(args.name, transform.Position, dir, args.colour);
                break;
            case LightType.Point:
                result.light = this.sceneObjBuilder.CreatePointLight(args.name, transform.Position, args.colour);
                break;
        }

        if (args.radius)
        {
            result.light.radius = args.radius;
        }

        if (args.intensity)
        {
            result.light.intensity = args.intensity;
        }

        if (args.range)
        {
            result.light.range = args.range;
        }

        return result;
    }
}