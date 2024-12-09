import { Engine, Color3, Quaternion, Vector2, Vector3, Light, HemisphericLight, DirectionalLight, FreeCamera, Matrix, DebugLayer, Mesh, CreateLines, MeshBuilder, LinesMesh, Color4, SpotLight, LightGizmo, GizmoManager, GlowLayer, RandomNumberBlock, PhysicsShapeType, StandardMaterial } from "@babylonjs/core";

import { Game } from "./game";
import { GameObject } from "./GameObjects/gameObject";
import { Random } from "./Util/Math/random";
import { LightType, ShapeType } from "./Global";
import { PhysicsComponent } from "./Components/PhysicsComponent";
import { PhysicsAttractor } from "./Components/PhysicsAttractor";
import { QuaternionHelper } from "./Util/Math/QuaternionHelper";
import { LightComponent } from "./Components/LightComponent";
import { MeshComponent } from "./Components/MeshComponent";
import { transformWithEsbuild } from "vite";
import { Transform } from "./Components/Transform";

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
            this.renderSys.EnableGlowLayer();
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
        let pickedObj = this.getPickedGameObject();

        if (pickedObj != null)
        {
            let mc = pickedObj.GetComponent(MeshComponent);
            let pa = pickedObj.GetComponent(PhysicsAttractor);
            let mat = mc?.GetMaterial() as StandardMaterial;

            if (pa)
            {
                pa.strength = - pa.strength;

                let offColour = Color3.Black();
                let toggleBlack = pa.strength < 0;
                mat.ambientColor = toggleBlack ? offColour : mat.diffuseColor;
                mat.emissiveColor = toggleBlack ? mat.ambientColor : mat.diffuseColor;
            }
        }

        super.Update(dt);
    }

    public Render(dt : number): void {
        
        super.Render(dt);
    }

    private setupScene() : void 
    {
        this.createCamera();
        //this.setupSceneLighting();
        this.createObjects(2000);
        this.createBoundary(Vector3.Zero(), 100);
    }

    private createBoundary(position : Vector3, size : number)
    {
        let rTrans = new Transform();
        rTrans.Position = position;
        let lRoot = this.objFactory.CreateGameObject("objBoundary", rTrans)

        let l = this.objFactory.CreateShapeGameObject(new Vector3(100, 0, 0), ShapeType.Box, "objBoundary_L");


        l.transform.Position = l.transform.Position.add(position);
        l.transform.Scale = new Vector3(1, 10, 10);

        lRoot.AddChild(l);
    }

    private createCamera()
    {
        let campos = new Vector3(0, 0, -50);
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

    private getPickedGameObject() : GameObject | null
    {
        let mouseState = this.inputSys.GetMouseState();

        if (!mouseState.clicked)
        {
            return null;
        }

        var pickInfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY);

        if (pickInfo.hit && pickInfo.pickedMesh)
        {
            return this.gameObjSys.GetGameObjectByMesh(pickInfo.pickedMesh);
        }

        return null;
    }

    private createLargeSphere(pos : Vector3) : GameObject
    {
        let result = this.objFactory.CreateShapeGameObject(pos, ShapeType.Sphere, "star");
        result.transform.Scale = new Vector3(5,5,5);

        let physAttCmp = new PhysicsAttractor();

        physAttCmp.radius = 200;
        physAttCmp.strength = 30;

        let physCmp = new PhysicsComponent();
        physCmp.shapeType = PhysicsShapeType.MESH;
        physCmp.mass = 10000;

        result.AddComponent(physAttCmp);
        result.AddComponent(physCmp);

        let matCmp = result.GetComponent(MeshComponent);
        let mat = matCmp?.GetMaterial() as StandardMaterial;
        mat.ambientColor = new Color3(0.6,0.6,0.4);
        mat.diffuseColor = mat.ambientColor;
        mat.emissiveColor = mat.ambientColor;

        //let pLight = this.objFactory.CreateLightGameObject(result.transform.Position, mat.ambientColor, LightType.Point);
        //result.AddChild(pLight);
        
        return result;
    }

    private createObjects(count : number)
    {
        let startPos = new Vector3(-30,-30,-30);
        let endPos = new Vector3(30, 30, 30);

        let maxSpeed = 100;

        let sphere0 = this.createLargeSphere(Vector3.Zero());

        let sPCmp = sphere0.GetComponent(PhysicsComponent) as PhysicsComponent;
        sPCmp.ApplyImpulse(new Vector3(0,0,-5))
        
        for (var i = 0; i < count; i++)
        {
            let x = Random.GetNumber(startPos.x, endPos.x);
            let y = Random.GetNumber(startPos.y, endPos.y);
            let z = Random.GetNumber(startPos.z, endPos.z);
            let v = new Vector3(x,y,z);

            let rx = Random.GetNumber(-maxSpeed, maxSpeed);
            let ry = Random.GetNumber(-maxSpeed, maxSpeed);
            let rz = Random.GetNumber(-maxSpeed, maxSpeed);
            let rv = new Vector3(rx,ry,rz);

            let gameObj = this.objFactory.CreateShapeGameObject(v, ShapeType.Box, "obj" + i);
            gameObj.transform.Scale = new Vector3(0.5,0.5,0.5);
            
            let meshCmp = gameObj.GetComponent(MeshComponent);
            let mat = meshCmp?.GetMaterial() as StandardMaterial;
            mat.ambientColor = Color3.Black();//  Random.GetColour3();
            mat.diffuseColor = mat.ambientColor;
            mat.emissiveColor = mat.ambientColor;

            let physCmp = new PhysicsComponent();
            physCmp.shapeType = PhysicsShapeType.BOX;
            physCmp.mass = 10;

            gameObj.AddComponent(physCmp);
            physCmp.ApplyImpulse(rv)
        }
    }
}