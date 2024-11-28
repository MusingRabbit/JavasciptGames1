import { Color3, DirectionalLight, HemisphericLight, Mesh, PointLight, Scene, SpotLight, StandardMaterial, Texture, Vector3 } from "@babylonjs/core";
import { GameObjectSystem } from "../Systems/GameObjectSystem";
import { LightComponent, LightType, RenderComponent, ShapeType, Transform } from "../Components/component";
import SceneFactory from "./SceneFactory";
import GameObject from "../GameObjects/gameObject";
import { ComponentFactory } from "./ComponentFactory";


export class GameObjectFactory
{
    gameObjSystem : GameObjectSystem;
    componentFactory : ComponentFactory;
    scene : Scene

    constructor(scene : Scene, gameObjSystem : GameObjectSystem)
    {
        this.gameObjSystem = gameObjSystem;
        this.componentFactory = new ComponentFactory(scene);
        this.scene = scene;
    }

    public CreateGameObject(trans : Transform) : GameObject
    {
        let result = this.gameObjSystem.CreateGameObject(trans);
        return result;
    }

    public CreateLightGameObject(position : Vector3, type : LightType) : GameObject
    {
        let transform = new Transform();
        transform.position = position;

        let result = this.CreateGameObject(transform);

        let lightCmp = this.componentFactory.CreateLightComponent({name : "simpleLight", type : type, transform : transform, colour : Color3.White()});

        result.AddComponent(lightCmp);

        return result;
    }

    public CreateShapeGameObject(position : Vector3, shape: ShapeType) : GameObject
    {
        let transform = new Transform();
        transform.position = position;

        let result = this.CreateGameObject(transform);

        let renderCmp = this.componentFactory.CreateRenderComponent(
            { name:"shape", transform : transform, shape : shape });

        result.components.push(renderCmp);
        
        return result;
    }


}