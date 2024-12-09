import { Color3, DirectionalLight, HemisphericLight, Mesh, PointLight, Scene, SpotLight, StandardMaterial, Texture, Vector3 } from "@babylonjs/core";
import { GameObjectSystem } from "../Systems/GameObjectSystem";
import SceneObjectBuilder from "./SceneObjectBuilder";

import { ComponentFactory, CreateMeshComponentArgs } from "./ComponentFactory";
import { LiteEvent } from "../Event/LiteEvent";
import { MeshData } from "../Data/MeshRepository";
import { Transform } from "../Components/Transform";
import { GameObject } from "../GameObjects/gameObject";
import { LightType, ShapeType } from "../Global";


export class GameObjectFactory
{
    gameObjSystem : GameObjectSystem;
    componentFactory : ComponentFactory;
    scene : Scene

    private readonly onGameObjectCreated = new LiteEvent<GameObject>();

    public get OnCreated() { return this.onGameObjectCreated.expose(); }

    constructor(scene : Scene, gameObjSystem : GameObjectSystem)
    {
        this.gameObjSystem = gameObjSystem;
        this.componentFactory = new ComponentFactory(scene);
        this.scene = scene;
    }

    public CreateGameObject(name : string, trans : Transform) : GameObject
    {
        let result = new GameObject();
        result.id = this.getUID(36);
        result.transform.Position = trans.Position;
        result.transform.Rotation = trans.Rotation;
        result.transform.Scale = trans.Scale;
        
        result.name = name;

        return result;
    }

    private getUID(length: number): string {
        return Date.now().toString(length) + Math.random().toString(length).substring(2);
    }

    public CreateLightGameObject(position : Vector3, colour : Color3, type : LightType) : GameObject
    {
        let transform = new Transform();
        transform.Position = position;
        transform.Scale = new Vector3(0.5,0.5,0.5);

        let name = "obj" + LightType[type];

        let result = this.CreateGameObject(name ,transform);

        let rndCmp = this.componentFactory.CreateMeshComponent({name : name + "_mesh", shape : ShapeType.Sphere, transform : transform});
        let mat = rndCmp.GetMaterial<StandardMaterial>();

        rndCmp.mesh.receiveShadows = false;

        if (mat != null)
        {
            mat.emissiveColor = colour;
            mat.diffuseColor = colour;
            mat.diffuseColor = colour;
        }


        let lightArgs = 
        {
            name : name + "_light", 
            type : type, 
            colour : colour, 
            radius : 100, 
            intensity : 1.0,
            range : 100,
            exponent : 3
        };

        let lightCmp = this.componentFactory.CreateLightComponent(lightArgs);

        result.AddComponent(rndCmp);
        result.AddComponent(lightCmp);
        

        this.onGameObjectCreated.trigger(result);

        return result;
    }

    public CreateMeshGameObjects(position : Vector3, meshData : MeshData) : GameObject
    {
        let transform = new Transform();
        transform.Position = position;

        let result = this.CreateGameObject(meshData.name, transform);

        let rndCmp = this.componentFactory.CreateMeshComponent({name : meshData.name + "_mesh", shape : ShapeType.Sphere});
        let mat = rndCmp.GetMaterial();

        if (mat)
        {
            mat.alpha = 0.0;
        }

        result.AddComponent(rndCmp);

        for(let mesh of meshData.objs.values())
        {
            result.AddChild(this.CreateMeshGameObject(Vector3.Zero(), mesh));
        }

        return result;
    }

    public CreateMeshGameObject(position : Vector3, mesh: Mesh) : GameObject
    {
        let transform = new Transform();
        transform.Position = position.add(mesh.position);

        let name = "obj" + mesh.name.split('.')[0];

        let result = this.CreateGameObject(name, transform);

        let args = new CreateMeshComponentArgs();
        args.name = "cmp";
        args.mesh = mesh;

        let renderCmp = this.componentFactory.CreateMeshComponent(args);

        result.components.push(renderCmp);

        this.onGameObjectCreated.trigger(result);

        return result;
    }


    public CreateShapeGameObject(position : Vector3, shape: ShapeType, name? : string, tessalation? : number) : GameObject
    {
        let objName =  name ?? "obj" + ShapeType[shape];
        let trans = new Transform();
        trans.Position = position;

        let result = this.CreateGameObject(objName, trans);

        let args = new CreateMeshComponentArgs();
        args.name = objName;
        args.shape = shape;

        if (tessalation)
        {
            args.tessalation = tessalation;
        }

        let renderCmp = this.componentFactory.CreateMeshComponent(args);

        result.components.push(renderCmp);
        
        this.onGameObjectCreated.trigger(result);
        
        return result;
    }
}
