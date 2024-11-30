import { Color3, DirectionalLight, HemisphericLight, Mesh, PointLight, Scene, SpotLight, StandardMaterial, Texture, Vector3 } from "@babylonjs/core";
import { GameObjectSystem } from "../Systems/GameObjectSystem";
import { LightComponent, LightType, RenderComponent, ShapeType, Transform } from "../Components/component";
import SceneObjectBuilder from "./SceneObjectBuilder";
import GameObject from "../GameObjects/gameObject";
import { ComponentFactory, CreateRenderComponentArgs } from "./ComponentFactory";
import { LiteEvent } from "../Event/LiteEvent";
import { MeshData } from "../Data/MeshRepository";




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
        result.transform = trans;
        result.name = name;

        return result;
    }

    private getUID(length: number): string {
        return Date.now().toString(length) + Math.random().toString(length).substring(2);
    }

    public CreateLightGameObject(position : Vector3, colour : Color3, type : LightType) : GameObject
    {
        let transform = new Transform();
        transform.position = position;
        transform.scale = new Vector3(0.5,0.5,0.5);

        let name = "obj" + LightType[type];

        let result = this.CreateGameObject(name ,transform);

        let rndCmp = this.componentFactory.CreateRenderComponent({name : name + "_mesh", shape : ShapeType.Sphere, transform : transform});
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
            transform : transform, 
            colour : colour, 
            radius : 100, 
            intensity : 1.0,
            range : 100,
            exponent : 3
        };

        let lightCmp = this.componentFactory.CreateLightComponent(lightArgs);

        result.AddComponent(lightCmp);
        result.AddComponent(rndCmp);

        this.onGameObjectCreated.trigger(result);

        return result;
    }

    public CreateMeshGameObjects(position : Vector3, meshData : MeshData) : GameObject
    {
        let transform = new Transform();
        transform.position = position;

        let result = this.CreateGameObject(meshData.name, transform);

        let rndCmp = this.componentFactory.CreateRenderComponent({name : meshData.name + "_mesh", shape : ShapeType.Sphere, transform : transform});
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
        transform.position = position.add(mesh.position);

        let name = "obj" + mesh.name.split('.')[0];

        let result = this.CreateGameObject(name, transform);

        let args = new CreateRenderComponentArgs();
        args.name = "cmp";
        args.transform = transform;
        args.mesh = mesh;

        let renderCmp = this.componentFactory.CreateRenderComponent(args);

        result.components.push(renderCmp);

        this.onGameObjectCreated.trigger(result);

        return result;
    }


    public CreateShapeGameObject(position : Vector3, shape: ShapeType) : GameObject
    {
        let transform = new Transform();
        transform.position = position;

        let name =  "obj" + ShapeType[shape];

        let result = this.CreateGameObject(name, transform);

        let args = new CreateRenderComponentArgs();
        args.name = "cmp";
        args.transform = transform;
        args.shape = shape;

        let renderCmp = this.componentFactory.CreateRenderComponent(args);

        result.components.push(renderCmp);
        
        this.onGameObjectCreated.trigger(result);
        
        return result;
    }


}