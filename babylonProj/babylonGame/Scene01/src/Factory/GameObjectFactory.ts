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

    public CreateGameObject(trans : Transform) : GameObject
    {
        let result = new GameObject();
        result.id = this.getUID(36);
        result.transform = trans;

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

        let result = this.CreateGameObject(transform);

        let rndCmp = this.componentFactory.CreateRenderComponent({name : "simpleLightMesh", shape : ShapeType.Sphere, transform : transform});
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
            name : "simpleLight", 
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

    public CreateMeshGameObject(position : Vector3, mesh: MeshData) : GameObject
    {
        let transform = new Transform();
        transform.position = position;

        let result = this.CreateGameObject(transform);

        let args = new CreateRenderComponentArgs();
        args.name = "cmp";
        args.transform = transform;
        args.mesh = mesh[0];

        let renderCmp = this.componentFactory.CreateRenderComponent(args);

        result.components.push(renderCmp);

        return result;
    }


    public CreateShapeGameObject(position : Vector3, shape: ShapeType) : GameObject
    {
        let transform = new Transform();
        transform.position = position;

        let result = this.CreateGameObject(transform);

        result.name = "gamObj" + ShapeType[shape];

        let args = new CreateRenderComponentArgs();
        args.name = "cmp"
        args.transform = transform;
        args.shape = shape;

        let renderCmp = this.componentFactory.CreateRenderComponent(args);

        result.components.push(renderCmp);
        
        this.onGameObjectCreated.trigger(result);
        
        return result;
    }


}