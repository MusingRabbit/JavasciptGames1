import { Engine, Color3, Quaternion, Vector2, Vector3, Light, HemisphericLight, DirectionalLight, FreeCamera, Matrix } from "@babylonjs/core";
import Game from "./game";
import { LightComponent, LightType, RenderComponent, ShapeType, Transform } from "./Components/component";
import GameObject from "./GameObjects/gameObject";
import { MathHelper } from "./mathHelper";
import { QuaternionHelper } from "./Util/Math/QuaternionHelper";

const TEMPLE_OBJ_FILEPATH  = "ruinedTemple.obj";

export class SimpleGame extends Game
{
    //gameObj1 : GameObject;
    light1 : GameObject;
    light2 : GameObject;
    light3 : GameObject;
    ambientLight : GameObject;

    templeObj : GameObject;
    ground : GameObject;

    counter : number;
    camera : FreeCamera;
    

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
        this.dataManager.QueueLoadMesh(TEMPLE_OBJ_FILEPATH);
        this.dataManager.QueueLoadTextures(["rock_wall_01.jpg", "stone_wall_01.jpg", "grass.jpg"]);

        super.Load();
    }

    public Update(dt : number): void {
        let x1 = Math.cos(this.counter);
        let y1 = Math.sin(this.counter);
        let x2 = Math.cos(this.counter + 2);
        let y2 = Math.sin(this.counter + 2);
        let x3 = Math.cos(this.counter + 4);
        let y3 = Math.sin(this.counter + 4);

        this.counter = this.counter + 1 * dt;
        //console.log(dt);

        //let rot = Quaternion.FromEulerAngles(x,y,x);
        //this.gameObj1.transform.rotation = rot;
        //this.gameObj1.transform.position = new Vector3(x, y, x);

        
        this.light1.transform.position = new Vector3(x1 * 300, this.light1.transform.position.y, y1 * 300);
        this.light2.transform.position = new Vector3(x2 * 300, this.light2.transform.position.y, y2 * 300);
        this.light3.transform.position = new Vector3(x3 * 300, this.light3.transform.position.y, y3 * 300);

        let mtxLookAt1 = Matrix.LookAtLH(this.light1.transform.position, Vector3.Zero(), Vector3.Up());
        let mtxLookAt2 = Matrix.LookAtLH(this.light2.transform.position, Vector3.Zero(), Vector3.Up());
        let mtxLookAt3 = Matrix.LookAtLH(this.light3.transform.position, Vector3.Zero(), Vector3.Up());

        this.light1.transform.rotation = Quaternion.FromRotationMatrix(mtxLookAt1.invert());
        this.light2.transform.rotation = Quaternion.FromRotationMatrix(mtxLookAt2.invert());
        this.light3.transform.rotation = Quaternion.FromRotationMatrix(mtxLookAt3.invert());

        //console.log(this.ground.transform.rotation);

        //this.gameObj1.transform.rotation = Quaternion.Slerp(this.gameObj1.transform.rotation, this.gameObj1.transform.rotation, 100);

        super.Update(dt);
    }

    public Render(dt : number): void {
        super.Render(dt);
    }

    private createTemple()
    {
        let meshData = this.dataManager.GetMesh(TEMPLE_OBJ_FILEPATH);

        if (meshData)
        {
            this.templeObj = this.objFactory.CreateMeshGameObjects(new Vector3(0,0,0), meshData);
            this.templeObj.transform.scale = new Vector3(100,100,100);
        }
    }


    private setupFlyingDirectionalLight(gameObj : GameObject)
    {
        let dlight = gameObj.GetComponent(LightComponent).GetLight<DirectionalLight>();
        dlight.intensity = 0.5;
        dlight.lightmapMode = Light.LIGHTMAP_DEFAULT;
        dlight.range = 100;
        dlight.shadowMaxZ = 100;
        dlight.shadowMinZ = 0;

        gameObj.transform.scale = new Vector3(50,50,50);
    }

    private setupBasicSceneLighting()
    {
        this.light1 = this.objFactory.CreateLightGameObject(new Vector3(0,300,0), Color3.Red(), LightType.Directional);
        this.setupFlyingDirectionalLight(this.light1);

        this.light2 = this.objFactory.CreateLightGameObject(new Vector3(0,300,0), Color3.Green(), LightType.Directional);
        this.setupFlyingDirectionalLight(this.light2);

        this.light3 = this.objFactory.CreateLightGameObject(new Vector3(0,300,0), Color3.Blue(), LightType.Directional);
        this.setupFlyingDirectionalLight(this.light3);

        this.ambientLight = this.objFactory.CreateLightGameObject(new Vector3(0, 5, 10), new Color3(1,1,1),LightType.Hemispheric);
        let hemiLight = this.ambientLight.GetComponent(LightComponent).GetLight<HemisphericLight>();
        hemiLight.intensity = 0.2;
        hemiLight.lightmapMode = Light.LIGHTMAP_DEFAULT;
        hemiLight.range = 100;
        hemiLight.direction = Vector3.Zero().subtract(this.ambientLight.transform.position);
    }

    private setupBasicScene() : void 
    {
        this.setupBasicSceneLighting();
        this.createTemple();

        this.ground = this.objFactory.CreateShapeGameObject(new Vector3(0,0,0), ShapeType.TiledPlane);
        this.ground.transform.rotation = Quaternion.FromEulerAngles(MathHelper.DegToRad(90),0,0);
        this.ground.transform.scale = new Vector3(10000,10000,10000);

        let stoneTxr = this.dataManager.GetTexture("stone_wall_01.jpg");
        let rockTxr = this.dataManager.GetTexture("rock_wall_01.jpg");
        let grassTxr = this.dataManager.GetTexture("grass.jpg");

        let grc = this.ground.GetComponent(RenderComponent);
        grc.SetTextureData(grassTxr);

        //let brc = this.gameObj1.GetComponent(RenderComponent);
        //brc.SetTextureData(rockTxr);
        let campos = new Vector3(567.5978293483191, 399.37482604575297, 346.3021466005386);
        this.camera = this.sceneBuilder.CreateFreeCamera("camera", campos, 1, true);
        let deltaV = Vector3.Zero().subtract(this.camera.position);
        this.camera.rotation = QuaternionHelper.QuaternionLookRotation(deltaV, Vector3.Up()).toEulerAngles();
        //this.sceneBuilder.CreateArcRotateCamera("camera", true);
    }
}