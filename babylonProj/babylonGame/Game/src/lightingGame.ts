import { ArcRotateCamera, Color3, DirectionalLight, Engine, Light, Matrix, Quaternion, StandardMaterial, Vector3 } from "@babylonjs/core";
import { Game } from "./game";
import { LightType, ShapeType } from "./Global";
import { LightComponent } from "./Components/LightComponent";
import { lchown } from "fs";
import { MathHelper } from "./Util/Math/mathHelper";
import { MeshComponent } from "./Components/MeshComponent";
import { GameObject } from "./GameObjects/gameObject";

export class LightingGame extends Game
{
    constructor(engine : Engine)
    {
        super(engine, "./assets/");
    }

    public Initialise(): boolean {
        if (super.Initialise())
        {
            this.createLightingScene();
            this.isInitialised = true;
            return this.isInitialised;
        }

        return false;
    }

    public Update(dt: number): void {


        super.Update(dt);
    }

    private createLightingScene()
    {
        let camera = this.createArcRotateCamera();

        let box = this.objFactory.CreateShapeGameObject(new Vector3(0,0.45), ShapeType.Box);
        let sphere = this.objFactory.CreateShapeGameObject(new Vector3(0, 3), ShapeType.Sphere);
        let ground = this.objFactory.CreateShapeGameObject(Vector3.Zero(), ShapeType.Ground);

        this.setupLighting();

        ground.transform.Scale = new Vector3(2,2,2);


        let bMc = box.GetComponent(MeshComponent);
        let bMat = bMc?.GetMaterial() as StandardMaterial;
        bMat.ambientColor = Color3.White();
        bMat.diffuseColor = Color3.White();

        let gMc = ground.GetComponent(MeshComponent);
        let mat = gMc?.GetMaterial() as StandardMaterial;
        mat.ambientColor = Color3.White();
        mat.diffuseColor = Color3.White();

        this.lightingSys.Initialise();
    }

    private setupLighting()
    {
        let aLight = this.objFactory.CreateLightGameObject(new Vector3(10, 30, 10), new Color3(0.2,0.1,0.2), LightType.Hemispheric);
        
        let dLight = this.objFactory.CreateLightGameObject(new Vector3(20, 30, 10), new Color3(0.8, 0.1, 0.3), LightType.Directional);
        this.setupDrectionalLight(dLight);

        let dLight2 = this.objFactory.CreateLightGameObject(new Vector3(10, 30, -20), new Color3(0.8, 0.3, 0.1), LightType.Directional);
        this.setupDrectionalLight(dLight2);

        let dLight3 = this.objFactory.CreateLightGameObject(new Vector3(-20, 30, 10), new Color3(0.1, 0.3, 0.8), LightType.Directional);
        this.setupDrectionalLight(dLight3);

        let mtxLookAt1 = Matrix.LookAtLH(dLight.transform.Position, Vector3.Zero(), Vector3.Up());
        let mtxLookAt2 = Matrix.LookAtLH(dLight2.transform.Position, Vector3.Zero(), Vector3.Up());
        let mtxLookAt3 = Matrix.LookAtLH(dLight3.transform.Position, Vector3.Zero(), Vector3.Up());
        let mtxLookAt4 = Matrix.LookAtLH(aLight.transform.Position, Vector3.Zero(), Vector3.Up());

        dLight.transform.Rotation = Quaternion.FromRotationMatrix(mtxLookAt1.invert());
        dLight2.transform.Rotation = Quaternion.FromRotationMatrix(mtxLookAt2.invert());
        dLight3.transform.Rotation = Quaternion.FromRotationMatrix(mtxLookAt3.invert());
        aLight.transform.Rotation = Quaternion.FromRotationMatrix(mtxLookAt4.invert());
    }

    private setupDrectionalLight(gameObj : GameObject)
    {
        let dlight = gameObj.GetComponent(LightComponent)?.GetLight<DirectionalLight>();
        let rCmp = gameObj.GetComponent(MeshComponent);

        if (!rCmp || !dlight)
        {
            return;
        }
        
        dlight.intensity = 1.0;
        dlight.lightmapMode = Light.FALLOFF_PHYSICAL;
        dlight.range = 120;
        dlight.autoCalcShadowZBounds = true;
        dlight.direction = new Vector3(MathHelper.DegToRad(90),0,0);
        dlight.falloffType = Light.FALLOFF_PHYSICAL;
        
        dlight.excludedMeshes.push(rCmp.mesh);

        gameObj.transform.Scale = new Vector3(1,1,1);
    }

    private createArcRotateCamera() : ArcRotateCamera{

        console.log("createArcRotateCamera");
    
        let camAlpha = -Math.PI / 2,
          camBeta = Math.PI / 2.5,
          camDist = 10,
          camTarget = new Vector3(0, 0, 0);
    
        let camera = new ArcRotateCamera(
          "mainCam",
          camAlpha,
          camBeta,
          camDist,
          camTarget,
          this.scene,
        );
    
        camera.attachControl(true);
        
        return camera;
      } 
}