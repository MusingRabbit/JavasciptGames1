import { Engine, Color3, Quaternion, Vector2, Vector3, Light, HemisphericLight, DirectionalLight, FreeCamera, Matrix, DebugLayer, Mesh, CreateLines, MeshBuilder, LinesMesh, Color4, SpotLight, LightGizmo, GizmoManager, GlowLayer } from "@babylonjs/core";
import { MathHelper } from "./Util/Math/mathHelper";
import { QuaternionHelper } from "./Util/Math/QuaternionHelper";
import { Game } from "./game";
import { GameObject } from "./GameObjects/gameObject";
import { LightComponent } from "./Components/LightComponent";
import { LightType, ShapeType } from "./Global";
import { MeshComponent } from "./Components/MeshComponent";
import { DebugTransform } from "./Components/DebugTransform";

const TEMPLE_OBJ_FILEPATH  = "ruinedTemple.glb";

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
            //this.renderSys.EnableGlowLayer();
            this.setupBasicScene();

            this.isInitialised = true;
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

        this.light1.transform.Position = new Vector3(x1 * 300, this.light1.transform.Position.y, y1 * 300);
        this.light2.transform.Position = new Vector3(x2 * 300, this.light2.transform.Position.y, y2 * 300);
        this.light3.transform.Position = new Vector3(x3 * 300, this.light3.transform.Position.y, y3 * 300);

        let mtxLookAt1 = Matrix.LookAtLH(this.light1.transform.Position, Vector3.Zero(), Vector3.Up());
        let mtxLookAt2 = Matrix.LookAtLH(this.light2.transform.Position, Vector3.Zero(), Vector3.Up());
        let mtxLookAt3 = Matrix.LookAtLH(this.light3.transform.Position, Vector3.Zero(), Vector3.Up());

        this.light1.transform.Rotation = Quaternion.FromRotationMatrix(mtxLookAt1.invert());
        this.light2.transform.Rotation = Quaternion.FromRotationMatrix(mtxLookAt2.invert());
        this.light3.transform.Rotation = Quaternion.FromRotationMatrix(mtxLookAt3.invert());

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
            this.templeObj.transform.Scale = new Vector3(100,100,100);
        }
    }


    private setupFlyingDirectionalLight(gameObj : GameObject)
    {
        let dlight = gameObj.GetComponent(LightComponent)?.GetLight<DirectionalLight>();
        let rCmp = gameObj.GetComponent(MeshComponent);

        if (!dlight || !rCmp)
        {
            return;
        }
        
        dlight.intensity = 1.0;
        dlight.lightmapMode = Light.LIGHTMAP_DEFAULT;
        dlight.range = 1000;
        dlight.autoCalcShadowZBounds = true;
        dlight.direction = new Vector3(MathHelper.DegToRad(90),0,0);
        dlight.falloffType = Light.FALLOFF_PHYSICAL;
        
        dlight.excludedMeshes.push(rCmp.mesh);

        gameObj.transform.Scale = new Vector3(50,50,50);

        rCmp.ignoreLighting = true;

        if (this.showDebug)
        {
            gameObj.AddComponent(new DebugTransform());
            
            const lightGizmo = new LightGizmo();
            lightGizmo.light = dlight;
            lightGizmo.attachedMesh = rCmp.mesh;

            const gizmoMan = new GizmoManager(this.scene);
            gizmoMan.positionGizmoEnabled = true;
            gizmoMan.rotationGizmoEnabled = true;
            gizmoMan.usePointerToAttachGizmos = false;
            gizmoMan.attachToMesh(gizmoMan.attachedMesh);
        }
    }

    private setupBasicSceneLighting()
    {
        this.light1 = this.objFactory.CreateLightGameObject(new Vector3(0,100,0), Color3.Red(), LightType.Directional);
        this.setupFlyingDirectionalLight(this.light1);

        this.light2 = this.objFactory.CreateLightGameObject(new Vector3(0,100,0), Color3.Green(), LightType.Directional);
        this.setupFlyingDirectionalLight(this.light2);

        this.light3 = this.objFactory.CreateLightGameObject(new Vector3(0,100,0), Color3.Blue(), LightType.Directional);
        this.setupFlyingDirectionalLight(this.light3);

        //this.ambientLight = this.objFactory.CreateLightGameObject(new Vector3(0, 5, 10), new Color3(1,1,1),LightType.Hemispheric);
        //let hemiLight = this.ambientLight.GetComponent(LightComponent).GetLight<HemisphericLight>();
        //hemiLight.intensity = 1.0;
        //hemiLight.lightmapMode = Light.LIGHTMAP_DEFAULT;
        //hemiLight.range = 1000;
        //hemiLight.direction = Vector3.Zero().subtract(this.ambientLight.transform.position);
    }

    private setupBasicScene() : void 
    {
        let campos = new Vector3(560, 400, 340);
        this.camera = this.sceneBuilder.CreateFreeCamera("camera", campos, 1, true);
        let deltaV = Vector3.Zero().subtract(this.camera.position);
        this.camera.rotation = QuaternionHelper.QuaternionLookRotation(deltaV, Vector3.Up()).toEulerAngles();

        this.setupBasicSceneLighting();
        this.createTemple();

        this.ground = this.objFactory.CreateShapeGameObject(new Vector3(0,0,0), ShapeType.Ground);
        //this.ground.transform.rotation = Quaternion.FromEulerAngles(MathHelper.DegToRad(90),0,0);
        this.ground.transform.Scale = new Vector3(500,500,500);

        let grassTxr = this.dataManager.GetTexture("grass.jpg");

        let grc = this.ground.GetComponent(MeshComponent);

        if (grc)
        {
            grc.SetTextureData(grassTxr);
        }

        //let brc = this.gameObj1.GetComponent(MeshComponent);
        //brc.SetTextureData(rockTxr);
        //this.sceneBuilder.CreateArcRotateCamera("camera", true);
    }
}