import { Color3, DirectionalLight, HemisphericLight, Mesh, PointLight, Scene, SpotLight, StandardMaterial, Texture, Vector3 } from "@babylonjs/core";
import { GameObjectSystem } from "../Systems/GameObjectSystem";
import { LightComponent, LightType, RenderComponent, ShapeType, Transform } from "../Components/component";
import SceneFactory from "../SceneFactory";
import GameObject from "../GameObjects/gameObject";


class CreateRenderComponentArgs
{
    name : string;
    transform : Transform;
    mesh : Mesh;
    texture : Texture;
}

class CreateLightComponentArgs
{
    name : string;
    position : Vector3;
    type : LightType;
    colour : Color3;
    direction : Vector3;
    intensity : number;
    angle : number;
}


class GameObjectFactory
{
    gameObjSystem : GameObjectSystem;
    sceneFactory : SceneFactory;
    scene : Scene

    constructor(scene : Scene, gameObjSystem : GameObjectSystem)
    {
        this.gameObjSystem = gameObjSystem;
        this.scene = scene;
    }

    public CreateGameObject(trans : Transform) : GameObject
    {
        let result = this.gameObjSystem.CreateGameObject(trans);

        let box = this.sceneFactory.CreateBox("box", trans.position, trans.GetSize());
        result.components.push(new RenderComponent(box));
        return result;
    }

    public CreateLightComponent(args: CreateLightComponentArgs)
    {
        let result = new LightComponent();
        
        switch(args.type)
        {
            case LightType.Hemispheric:
                result.light = this.sceneFactory.CreateHemisphericLight(args.name, args.direction, args.colour, args.intensity);
                break;
            case LightType.Spot:
                result.light = this.sceneFactory.CreateSpotLight(args.name, args.position, args.direction, args.colour, args.angle , args.intensity)
                break;
            case LightType.Directional:
                result.light = this.sceneFactory.CreateDirectionalLight(args.name, args.position, args.direction, args.colour, args.intensity);
                break;
            case LightType.Point:
                result.light = this.sceneFactory.CreatePointLight(args.name, args.position, args.colour, args.intensity);
                break;
        }

        return result;
    }
}