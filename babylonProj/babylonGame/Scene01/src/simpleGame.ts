import { Engine, Color3, Quaternion, Vector2, Vector3 } from "@babylonjs/core";
import Game from "./game";
import { LightComponent, LightType, RenderComponent, ShapeType, Transform } from "./Components/component";
import GameObject from "./GameObjects/gameObject";
import { MathHelper } from "./mathHelper";

const TEMPLE_OBJ_FILENAME  = "ruined_temple01.obj";

export class SimpleGame extends Game
{
    //gameObj1 : GameObject;
    gameObj2 : GameObject;
    templeObj : GameObject;
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

    public Load() : void 
    {
        this.dataManager.QueueLoadMesh(TEMPLE_OBJ_FILENAME);
        this.dataManager.QueueLoadTextures(["rock_wall_01.jpg", "stone_wall_01.jpg"]);

        super.Load();
    }

    public Update(): void {
        let dt = this.engine.getDeltaTime() * 0.001;

        let x = Math.cos(this.counter);
        let y = Math.sin(this.counter);

        this.counter = this.counter + 1 * dt;
        //console.log(dt);

        //let rot = Quaternion.FromEulerAngles(x,y,x);
        //this.gameObj1.transform.rotation = rot;
        //this.gameObj1.transform.position = new Vector3(x, y, x);

        
        this.gameObj2.transform.position = new Vector3(y, this.gameObj2.transform.position.y, y);
        

        //console.log(this.ground.transform.rotation);

        //this.gameObj1.transform.rotation = Quaternion.Slerp(this.gameObj1.transform.rotation, this.gameObj1.transform.rotation, 100);

        super.Update();
    }

    public Render(): void {
        super.Render();
    }

    private createTemple()
    {
        let meshData = this.dataManager.GetMesh(TEMPLE_OBJ_FILENAME);

        if (meshData)
        {
            this.templeObj = this.objFactory.CreateMeshGameObject(new Vector3(0,0,0), meshData);
        }
    }

    private setupBasicScene() : void 
    {
        this.createTemple();

        this.ground = this.objFactory.CreateShapeGameObject(new Vector3(0,0,0), ShapeType.Plane);
        //this.gameObj1 = this.objFactory.CreateShapeGameObject(new Vector3(0,0.5,0), ShapeType.Box);
        this.gameObj2 = this.objFactory.CreateLightGameObject(new Vector3(0,4,0), Color3.White(), LightType.Point);

        let cmp = this.gameObj2.GetComponent(LightComponent);
        cmp.light.intensity = 0.5;
        //cmp.light.radius = 3;

        
        this.ground.transform.rotation = Quaternion.FromEulerAngles(MathHelper.DegToRad(90),0,0);
        this.ground.transform.scale = new Vector3(10,10,10);

        let stoneTxr = this.dataManager.GetTexture("stone_wall_01.jpg");
        let rockTxr = this.dataManager.GetTexture("rock_wall_01.jpg");

        let grc = this.ground.GetComponent(RenderComponent);
        grc.SetTextureData(rockTxr);

        //let brc = this.gameObj1.GetComponent(RenderComponent);
        //brc.SetTextureData(rockTxr);

        this.sceneBuilder.CreateArcRotateCamera("camera", true);
    }
}