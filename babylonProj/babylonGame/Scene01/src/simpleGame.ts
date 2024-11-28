import { Engine, Color3, Quaternion, Vector2, Vector3 } from "@babylonjs/core";
import Game from "./game";
import SceneFactory from "./Factory/SceneFactory";
import { LightComponent, LightType, RenderComponent, ShapeType, Transform } from "./Components/component";
import GameObject from "./GameObjects/gameObject";
import { GameObjectFactory } from "./Factory/GameObjectFactory";
import { MathHelper } from "./mathHelper";

export class SimpleGame extends Game
{
    gameObj1 : GameObject;
    gameObj2 : GameObject;
    ground : GameObject;

    counter : number;

    constructor(engine : Engine) {
        super(engine);

        this.counter = 0;
    }

    public Initialise(): void {
        this.setupBasicScene();

        super.Initialise();
    }

    public Update(): void {
        let dt = this.engine.getDeltaTime() * 0.001;

        let x = Math.cos(this.counter);
        let y = Math.sin(this.counter);

        this.counter = this.counter + 1 * dt;
        //console.log(dt);

        let rot = Quaternion.FromEulerAngles(x,y,x);
        //this.gameObj1.transform.rotation = rot;
        //this.gameObj1.transform.position = new Vector3(x, y, x);

        
        this.gameObj2.transform.position = new Vector3(x,y,x);
        

        //console.log(this.ground.transform.rotation);

        //this.gameObj1.transform.rotation = Quaternion.Slerp(this.gameObj1.transform.rotation, this.gameObj1.transform.rotation, 100);

        super.Update();
    }

    public Render(): void {


        super.Render();
    }

    private setupBasicScene() : void 
    {
        this.gameObj1 = this.objFactory.CreateShapeGameObject(new Vector3(0,-1.5,0), ShapeType.Box);
        this.gameObj2 = this.objFactory.CreateLightGameObject(Vector3.Zero(), LightType.Directional);

        let rotX = MathHelper.DegToRad(-10);
        let rotY = MathHelper.DegToRad(-10);

        this.gameObj2.transform.rotation = Quaternion.FromEulerAngles(rotX, rotY,0);

        let cmp = this.gameObj2.GetComponent(LightComponent);
        cmp.light.intensity = 0.5;

        this.ground = this.objFactory.CreateShapeGameObject(new Vector3(0,-2,0), ShapeType.Plane);
        
        this.ground.transform.rotation = Quaternion.FromEulerAngles(MathHelper.DegToRad(90),0,0);
        this.ground.transform.scale = new Vector3(10,10,10);

        this.sceneFactory.CreateArcRotateCamera("camera", true);
    }
}