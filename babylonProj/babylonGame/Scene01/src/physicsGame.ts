import { Engine, Color3, Quaternion, Vector2, Vector3, Light, HemisphericLight, DirectionalLight, FreeCamera, Matrix, DebugLayer, Mesh, CreateLines, MeshBuilder, LinesMesh, Color4, SpotLight, LightGizmo, GizmoManager, GlowLayer, RandomNumberBlock, PhysicsShapeType } from "@babylonjs/core";

import { Game } from "./game";
import { GameObject } from "./GameObjects/gameObject";
import { Random } from "./Util/Math/random";
import { LightType, ShapeType } from "./Global";
import { PhysicsComponent } from "./Components/PhysicsComponent";
import { PhysicsAttractor } from "./Components/PhysicsAttractor";
import { QuaternionHelper } from "./Util/Math/QuaternionHelper";
import { LightComponent } from "./Components/LightComponent";

export class PhysicsGame extends Game
{
    ambientLight : GameObject;
    camera : FreeCamera;
    rng : RandomNumberBlock;
    
    constructor(engine : Engine) {
        super(engine);

        this.rng = new RandomNumberBlock("rng");
    }

    public Initialise(): boolean {
        if (super.Initialise())
        {
            this.setupScene();
            this.isInitialised = true;
            return true;
        }

       return false;
    }

    public Load() : void 
    {

        super.Load();
    }

    public Update(dt : number): void {
        super.Update(dt);
    }

    public Render(dt : number): void {
        
        super.Render(dt);
    }

    private setupScene() : void 
    {
        this.createCamera();
        this.setupSceneLighting();
        this.createBalls(100);
    }

    private createCamera()
    {
        let campos = new Vector3(0, 0, -10);
        this.camera = this.sceneBuilder.CreateFreeCamera("camera", campos, 1, true);
        let deltaV = Vector3.Zero().subtract(this.camera.position);
        this.camera.rotation = QuaternionHelper.QuaternionLookRotation(deltaV, Vector3.Up()).toEulerAngles();
    }

    private setupSceneLighting()
    {
        this.ambientLight = this.objFactory.CreateLightGameObject(new Vector3(0, 1000, 10), new Color3(1,0.8,0.1),LightType.Hemispheric);
        let hemiLight = this.ambientLight.GetComponent(LightComponent)?.GetLight<HemisphericLight>();
        
        if (hemiLight)
        {
            hemiLight.intensity = 0.1;
            hemiLight.lightmapMode = Light.LIGHTMAP_DEFAULT;
            hemiLight.range = 100;
            hemiLight.direction = Vector3.Zero().subtract(this.ambientLight.transform.Position);
        }

    }

    private createBalls(count : number)
    {
        let startPos = new Vector3(-10,-10,-10);
        let endPos = new Vector3(10, 10, 10);

        for (var i = 0; i < count; i++)
        {
            let x = Random.GetNumber(startPos.x, endPos.x);
            let y = Random.GetNumber(startPos.y, endPos.y);
            let z = Random.GetNumber(startPos.z, endPos.z);
            let v = new Vector3(x,y,z);
            let gameObj = this.objFactory.CreateShapeGameObject(v, ShapeType.Sphere);
            
            let physCmp = new PhysicsComponent();
            physCmp.shapeType = PhysicsShapeType.SPHERE;
            physCmp.mass = 10;
            gameObj.AddComponent(physCmp);

            let physAttCmp = new PhysicsAttractor();

            if (i == 0)
            {
                physAttCmp.radius = 100;
                physAttCmp.strength = 0.1;
            }

            gameObj.AddComponent(physAttCmp);
        }
    }
}