import { Engine, Color3, Quaternion, Vector2, Vector3, Light } from "@babylonjs/core";
import Game from "./game";
import { LightComponent, LightType, RenderComponent, ShapeType, Transform } from "./Components/component";
import GameObject from "./GameObjects/gameObject";
import { MathHelper } from "./mathHelper";
import { QuaternionHelper } from "./Util/Math/QuaternionHelper";

const TEMPLE_OBJ_FILENAME  = "ruined_temple01.obj";

export class SimpleGame extends Game
{
    //gameObj1 : GameObject;
    light1 : GameObject;
    light2 : GameObject;
    light3 : GameObject;

    templeObj : GameObject;
    ground : GameObject;

    counter : number;

    

    constructor(engine : Engine) {
        super(engine);

        this.counter = 0;
    }

    public Initialise(): boolean {
        if (super.Initialise())
        {
            this.setupBasicScene();
            return true;
        }

       return false;
    }

    public Load() : void 
    {
        this.dataManager.QueueLoadMesh(TEMPLE_OBJ_FILENAME);
        this.dataManager.QueueLoadTextures(["rock_wall_01.jpg", "stone_wall_01.jpg"]);

        super.Load();
    }

    public Update(dt : number): void {
        let x = Math.cos(this.counter);
        let y = Math.sin(this.counter);

        this.counter = this.counter + 1 * dt;
        //console.log(dt);

        //let rot = Quaternion.FromEulerAngles(x,y,x);
        //this.gameObj1.transform.rotation = rot;
        //this.gameObj1.transform.position = new Vector3(x, y, x);

        
        this.light1.transform.position = new Vector3(x * 15, this.light1.transform.position.y, y * 15);
        this.light2.transform.position = new Vector3(x * 15, this.light2.transform.position.y, -y * 15);
        this.light3.transform.position = new Vector3(-x * 15, this.light3.transform.position.y, -y * 15);
        
        //this.templeObj.transform.rotation = rot;

        //console.log(this.ground.transform.rotation);

        //this.gameObj1.transform.rotation = Quaternion.Slerp(this.gameObj1.transform.rotation, this.gameObj1.transform.rotation, 100);

        super.Update(dt);
    }

    public Render(dt : number): void {
        super.Render(dt);
    }

    private createTemple()
    {
        let meshData = this.dataManager.GetMesh(TEMPLE_OBJ_FILENAME);

        if (meshData)
        {
            this.templeObj = this.objFactory.CreateMeshGameObjects(new Vector3(0,0,0), meshData);
        }
    }

    private setupBasicScene() : void 
    {
        this.createTemple();

        this.ground = this.objFactory.CreateShapeGameObject(new Vector3(0,0,0), ShapeType.Plane);
        //this.gameObj1 = this.objFactory.CreateShapeGameObject(new Vector3(0,0.5,0), ShapeType.Box);

        this.light1 = this.objFactory.CreateLightGameObject(new Vector3(0,4,0), Color3.Red(), LightType.Directional);
        let cmp = this.light1.GetComponent(LightComponent);
        cmp.light.intensity = 0.5;
        cmp.light.lightmapMode = Light.LIGHTMAP_DEFAULT;
        cmp.light.range = 100;

        this.light2 = this.objFactory.CreateLightGameObject(new Vector3(0,4,0), Color3.Green(), LightType.Directional);
        cmp = this.light2.GetComponent(LightComponent);
        cmp.light.intensity = 0.5;
        cmp.light.lightmapMode = Light.LIGHTMAP_DEFAULT;
        cmp.light.range = 100;

        this.light3 = this.objFactory.CreateLightGameObject(new Vector3(0,4,0), Color3.Blue(), LightType.Directional);
        cmp = this.light3.GetComponent(LightComponent);
        cmp.light.intensity = 0.5;
        cmp.light.lightmapMode = Light.LIGHTMAP_DEFAULT;
        cmp.light.range = 100;



        let detlaV1 = this.light1.transform.position.subtract(new Vector3(0.1,0.1,0.1));
        let detlaV2 = this.light2.transform.position.subtract(new Vector3(-0.1,0.1,-0.1));
        let detlaV3 = this.light3.transform.position.subtract(new Vector3(0.1,-0.1,0.1));


        this.light1.transform.rotation = QuaternionHelper.QuaternionLookRotation(detlaV1, Vector3.Up());
        this.light2.transform.rotation = QuaternionHelper.QuaternionLookRotation(detlaV2, Vector3.Up());
        this.light3.transform.rotation = QuaternionHelper.QuaternionLookRotation(detlaV3, Vector3.Up());
        
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