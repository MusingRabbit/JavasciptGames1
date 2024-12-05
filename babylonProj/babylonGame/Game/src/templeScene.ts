import { Engine, Color3, Quaternion, Vector2, Vector3, Light, HemisphericLight, DirectionalLight, FreeCamera, Matrix, DebugLayer, Mesh, CreateLines, MeshBuilder, LinesMesh, Color4, SpotLight, LightGizmo, GizmoManager, GlowLayer, rgbdDecodePixelShader } from "@babylonjs/core";
import { MathHelper } from "./Util/Math/mathHelper";
import { QuaternionHelper } from "./Util/Math/QuaternionHelper";
import { Game } from "./game";
import { GameObject } from "./GameObjects/gameObject";
import { LightComponent } from "./Components/LightComponent";
import { LightType, ShapeType } from "./Global";
import { MeshComponent } from "./Components/MeshComponent";
import { DebugTransform } from "./Components/DebugTransform";

export class TempleScene extends Game
{
    //gameObj1 : GameObject;
    light1 : GameObject;
    light2 : GameObject;
    light3 : GameObject;
    ambientLight : GameObject;

    templeObj : GameObject;
    ground : GameObject;
    landscape : GameObject;

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
        this.dataManager.QueueLoadMesh("mountain_range_01.glb");
        this.dataManager.QueueLoadMesh("ruinedTemple.glb");
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

        this.counter = this.counter + 0.5 * dt;
        //console.log(dt);

        this.light1.transform.Position = new Vector3(x1 * 30, this.light1.transform.Position.y, y1 * 30);
        this.light2.transform.Position = new Vector3(x2 * 30, this.light2.transform.Position.y, y2 * 30);
        this.light3.transform.Position = new Vector3(x3 * 30, this.light3.transform.Position.y, y3 * 30);

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

    private createLandscape()
    {
        let meshData = this.dataManager.GetMesh("mountain_range_01.glb");

        if (meshData)
        {
            this.landscape = this.objFactory.CreateMeshGameObjects(new Vector3(9000, -455, 8000), meshData);
            this.landscape.transform.Scale = new Vector3(10000, 10000, 10000);
            this.landscape.transform.Rotation = Quaternion.FromEulerAngles(MathHelper.DegToRad(0),MathHelper.DegToRad(1),MathHelper.DegToRad(0));

            let rndCmp = this.landscape.GetComponent(MeshComponent);

            if (rndCmp)
            {
                rndCmp.mesh.infiniteDistance = true;
                rndCmp.mesh.alwaysSelectAsActiveMesh = true; 
    
                for (let child of this.landscape.children)
                {
                    let rndCmp = child.GetComponent(MeshComponent);
                    if (rndCmp)
                    {
                        rndCmp.mesh.alwaysSelectAsActiveMesh = true; 
                    }
                    
                    //rndCmp.filteredLights = [this.ambientLight.name];
                }
            }


        }
    }

    private createTemple()
    {
        let meshData = this.dataManager.GetMesh("ruinedTemple.glb");

        if (meshData)
        {
            this.templeObj = this.objFactory.CreateMeshGameObjects(new Vector3(0,0,0), meshData);
            this.templeObj.transform.Scale = new Vector3(10,10,10);
        }
    }


    private setupFlyingDirectionalLight(gameObj : GameObject)
    {
        let dlight = gameObj.GetComponent(LightComponent)?.GetLight<DirectionalLight>();
        let rCmp = gameObj.GetComponent(MeshComponent);

        if (!rCmp || !dlight)
        {
            return;
        }
        
        dlight.intensity = 1.0;
        dlight.lightmapMode = Light.FALLOFF_PHYSICAL;
        dlight.range = 10;
        dlight.autoCalcShadowZBounds = true;
        dlight.direction = new Vector3(MathHelper.DegToRad(90),0,0);
        dlight.falloffType = Light.FALLOFF_PHYSICAL;
        
        dlight.excludedMeshes.push(rCmp.mesh);

        gameObj.transform.Scale = new Vector3(5,5,5);

        //rCmp.filteredLights = [""];

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
        this.light1 = this.objFactory.CreateLightGameObject(new Vector3(0,10,0), Color3.Red(), LightType.Directional);
        this.setupFlyingDirectionalLight(this.light1);

        this.light2 = this.objFactory.CreateLightGameObject(new Vector3(0,10,0), Color3.Green(), LightType.Directional);
        this.setupFlyingDirectionalLight(this.light2);

        this.light3 = this.objFactory.CreateLightGameObject(new Vector3(0,10,0), Color3.Blue(), LightType.Directional);
        this.setupFlyingDirectionalLight(this.light3);

        this.ambientLight = this.objFactory.CreateLightGameObject(new Vector3(0, 1000, 10), new Color3(1,0.8,0.1),LightType.Hemispheric);
        let hemiLight = this.ambientLight.GetComponent(LightComponent)?.GetLight<HemisphericLight>();

        if (hemiLight)
        {
            hemiLight.intensity = 0.5;
            hemiLight.lightmapMode = Light.LIGHTMAP_DEFAULT;
            hemiLight.range = 1000;
            hemiLight.direction = Vector3.Zero().subtract(this.ambientLight.transform.Position);
        }
    }

    private setupBasicScene() : void 
    {
        let campos = new Vector3(56, 40, 34);
        this.camera = this.sceneBuilder.CreateFreeCamera("camera", campos, 1, true);
        let deltaV = Vector3.Zero().subtract(this.camera.position);
        this.camera.rotation = QuaternionHelper.QuaternionLookRotation(deltaV, Vector3.Up()).toEulerAngles();

        this.setupBasicSceneLighting();
        this.createTemple();
        this.createLandscape();
        

        this.ground = this.objFactory.CreateShapeGameObject(new Vector3(0,-1,0), ShapeType.Ground);
        //this.ground.transform.rotation = Quaternion.FromEulerAngles(MathHelper.DegToRad(90),0,0);
        this.ground.transform.Scale = new Vector3(20,20,20);

        let grassTxr = this.dataManager.GetTexture("grass.jpg");

        let grc = this.ground.GetComponent(MeshComponent);

        if (grc)
        {
            grc.SetTextureData(grassTxr);
        }

        
        this.lightingSys.Initialise();
        //let brc = this.gameObj1.GetComponent(MeshComponent);
        //brc.SetTextureData(rockTxr);
        //this.sceneBuilder.CreateArcRotateCamera("camera", true);
    }
}