import { Color3, Material, Matrix, Mesh, Scene, Texture, Vector3 } from "@babylonjs/core";
import { LightComponent, LightType, RenderComponent, ShapeType, Transform } from "../Components/component";
import SceneFactory from "../SceneFactory";


export class CreateCameraComponentArgs
{
    name :string;
    transform : Transform;
}

export class CreateRenderComponentArgs
{
    name : string;
    transform : Transform;
    mesh? : Mesh;
    material? : Material;
    texture? : Texture;
    shape : ShapeType

    constructor()
    {
        this.name = "component";
        this.transform = new Transform();
        this.shape = ShapeType.Box;
    }
}


export class CreateLightComponentArgs
{
    name : string;
    transform : Transform;
    type : LightType;
    colour : Color3;
    intensity? : number;
    angle? : number;

    constructor()
    {
        this.name = "component";
        this.transform = new Transform();
        this.type = LightType.Spot;
        this.colour = Color3.White();
        this.intensity = 1.0;
        this.angle = 45;
    }
}


export class ComponentFactory
{
    scene : Scene;
    sceneFactory : SceneFactory

    constructor(scene : Scene)
    {
        this.scene = scene;
        this.sceneFactory = new SceneFactory(this.scene);
    }

    public CreateCameraComponent(args : CreateCameraComponentArgs)
    {
        // TODO:
    }

    public CreateRenderComponent(args : CreateRenderComponentArgs)
    {
        let result = new RenderComponent();

        if (args.mesh)
        {
            result.SetMesh(args.mesh);
        }
        else
        {
            switch(args.shape)
            {
                case ShapeType.Box:
                    let box = this.sceneFactory.CreateBox("box", args.transform);
                    result.SetMesh(box);
                    break;
                case ShapeType.Capsule:
                    let capsule = this.sceneFactory.CreateCapsule("captsule", args.transform);
                    result.SetMesh(capsule);
                    break;
                case ShapeType.Plane:
                    let plane = this.sceneFactory.CreatePlane("plane", args.transform);
                    result.SetMesh(plane);
                    break;
                case ShapeType.Sphere:
                    let sphere = this.sceneFactory.CreateSphere("sphere", args.transform, 64);
                    result.SetMesh(sphere);
                    break;
            }
        }

        if (args.material)
        {
            result.SetMaterial(args.material);
        }

        if (args.texture)
        {
            result.SetTexture(args.texture);
        }

        return result;
    }

    public CreateLightComponent(args: CreateLightComponentArgs)
    {
        let result = new LightComponent();

        let mtxRot = new Matrix();
        args.transform.rotation.toRotationMatrix(mtxRot)
        let dir = Vector3.TransformCoordinates(args.transform.position, mtxRot);

        
        switch(args.type)
        {
            case LightType.Hemispheric:
                result.light = this.sceneFactory.CreateHemisphericLight(args.name, dir, args.colour, args.intensity);
                break;
            case LightType.Spot:
                result.light = this.sceneFactory.CreateSpotLight(args.name, args.transform.position, dir, args.colour, args.angle ?? 45 , args.intensity)
                break;
            case LightType.Directional:
                result.light = this.sceneFactory.CreateDirectionalLight(args.name, args.transform.position, dir, args.colour, args.intensity);
                break;
            case LightType.Point:
                result.light = this.sceneFactory.CreatePointLight(args.name, args.transform.position, args.colour, args.intensity);
                break;
        }

        return result;
    }
}