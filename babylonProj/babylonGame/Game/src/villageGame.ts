import { Camera, CanvasAlphaMode, Color3, Engine, FreeCamera, HemisphericLight, InstancedMesh, Material, Mesh, MeshBuilder, Quaternion, RotationGizmo, SpriteManager, StandardMaterial, Vector3, Vector4 } from "@babylonjs/core";
import { Game } from "./game"
import { LightType, MeshOrientation, ShapeType } from "./Global";
import { MeshComponent } from "./Components/MeshComponent";
import { GameObject } from "./GameObjects/gameObject";
import { MathHelper } from "./Util/Math/mathHelper";
import { Transform } from "./Components/Transform";
import { Random } from "./Util/Math/random";
import { QuaternionHelper } from "./Util/Math/QuaternionHelper";
import { LightComponent } from "./Components/LightComponent";


class HouseLocation
{
    type : number;
    transform : Transform;

    constructor(type : number, pos : Vector3, rot : Vector3)
    {
        this.type = type;
        this.transform = new Transform();
        this.transform.Position = pos;
        this.transform.Rotation = Quaternion.FromEulerAngles(rot.x, rot.y, rot.z);
    }
}

export class VillageGame extends Game
{
    camera : FreeCamera;

    constructor(engine:Engine)
    {
        super(engine, "./assets/village/");
    }

    public Load(): void {
        this.dataManager.QueueLoadTextures([
            "cubehouse.png",
            "semihouse.png",
            "roof.jpg",
            "valleygrass.png",
            "villagegreen.png",
            "villageheightmap.png",
            "tree.png",
            "palmtree.png"
        ]);

        super.Load();
    }

    public Initialise(): boolean {

        if (super.Initialise())
        {
            this.createGround();
            this.createHouses();
            this.createTrees(new Vector3(-20, 0.2, 20), 10, 500);
            this.createTrees(new Vector3(20, 0.2, -10), 12, 700);
            this.createTerrain();

            this.createLighting();

            this.createCamera();

            this.isInitialised = true;
        }

        return this.isInitialised;
    }

    public Update(dt: number): void {
        super.Update(dt);
    }

    private createCamera()
    {
        let campos = new Vector3(0, 5, 0);
        this.camera = this.sceneBuilder.CreateFreeCamera("camera", campos, 1, true);
        let deltaV = Vector3.Zero().subtract(this.camera.position);
        this.camera.rotation = QuaternionHelper.QuaternionLookRotation(deltaV, Vector3.Up()).toEulerAngles();
    }

    private createGround()
    {
        let txrData = this.dataManager.GetTexture("villagegreen.png");
        let result = this.objFactory.CreateShapeGameObject(Vector3.Zero(), ShapeType.Ground, {name : "villageGnd"});
        let mc = result.GetComponent(MeshComponent);

        result.transform.Scale = new Vector3(4,1,4);
        result.transform.Position.y = 0.01;

        if (mc)
        {
            mc.SetTextureData(txrData);
            
            let mat = mc.GetMaterial<StandardMaterial>();
            mat.diffuseTexture = txrData.diffuse;
            mat.diffuseTexture.hasAlpha = true;
            mat.useAlphaFromDiffuseTexture = true;
        }
    }

    private createTerrain(){
        let txrData = this.dataManager.GetTexture("valleygrass.png");
        
        let path = "./assets/village/textures/villageheightmap.png";
        let mesh = MeshBuilder.CreateGroundFromHeightMap("terrain", path,
            {
                width: 150,
                height: 150,
                subdivisions: 20,
                minHeight: 0,
                maxHeight: 10,
            }, this.scene);
        
        let obj = this.objFactory.CreateMeshGameObject(Vector3.Zero(), mesh);
        obj.transform.Position.y -= 0.01;

        let mc = obj.GetComponent(MeshComponent);

        if (mc)
        {
            let mat = mc.GetMaterial<StandardMaterial>();
            mat.diffuseTexture = txrData.diffuse;
        }

        return obj;
    }

    private createTree(pos : Vector3) : GameObject
    {
        let txr = this.dataManager.GetTexture(Math.floor(Random.GetNumber(0,100)) % 2 == 0 ? "tree.png" : "palmtree.png");
        let obj1 = this.objFactory.CreateShapeGameObject(pos, ShapeType.Plane, {txrData : txr, orientation: MeshOrientation.Double});
        let obj2 = this.objFactory.CreateShapeGameObject(Vector3.Zero(), ShapeType.Plane, {txrData : txr, orientation : MeshOrientation.Double});

        obj2.transform.Rotation = Quaternion.FromEulerAngles(0,MathHelper.DegToRad(90),0);

        obj1.AddChild(obj2);

        obj1.transform.Scale.y = 2;
        obj1.transform.Scale.x = 1.5;
        obj1.transform.Scale.z = 1.5;

        let mc1 = obj1.GetComponent(MeshComponent);
        let mc2 = obj2.GetComponent(MeshComponent);

        if (mc1)
        {
            let mat1 = mc1.GetMaterial<StandardMaterial>();
            mat1.transparencyMode = Material.MATERIAL_ALPHABLEND;
            mat1.diffuseTexture!.hasAlpha = true;
            mat1.useAlphaFromDiffuseTexture = true;
        }

        if (mc2)
        {
            let mat2 = mc2.GetMaterial<StandardMaterial>();
            mat2.transparencyMode = Material.MATERIAL_ALPHABLEND;
            mat2.diffuseTexture!.hasAlpha = true;
            mat2.useAlphaFromDiffuseTexture = true;
        }

        return obj1;
    }

    private createTrees(pos : Vector3, areaSize : number, count : number)
    {
        let result : GameObject[] = [];
        let maxPos = pos.add(new Vector3(areaSize, 0.8, areaSize));
        let minPos = pos.subtract(new Vector3(areaSize, 0.8, areaSize));

        for (let i = 0; i < count; i ++)
        {
            let x = Random.GetNumber(minPos.x, maxPos.x);
            let y = 1;//Random.GetNumber(minPos.y, maxPos.y);
            let z = Random.GetNumber(minPos.z, maxPos.z);

            let tree = this.createTree(new Vector3(x,y,z));
            result.push(tree);
        }

        return result;
    }

    private createHouses() : GameObject[]
    {
    //Start by locating one each of the two house types then add others
        let houseLocs = this.getAllHouseLocations();
        let result : GameObject[] = [];

        for (let i = 0; i < houseLocs.length; i++)
        {
            let loc = houseLocs[i];
            let house = this.createHouseObject("house" + i, loc.type, loc.transform.Position, loc.transform.Rotation.toEulerAngles());
            result.push(house);
        }

        return result;
    }

    private getAllHouseLocations() : HouseLocation[]
    {
        let result: HouseLocation[] = [];

        result.push(new HouseLocation(1, new Vector3(-6.8, 0.5, 2.5), new Vector3(0, -MathHelper.DegToRad(10.8), 0)));
        result.push(new HouseLocation(2, new Vector3(-4.5, 0.5, 3), new Vector3(0, -MathHelper.DegToRad(10.8), 0)));
        
        result.push(new HouseLocation(2, new Vector3(-1.5, 0.5, 4), new Vector3(0, -MathHelper.DegToRad(10.8), 0)));
        result.push(new HouseLocation(2, new Vector3(1.5, 0.5, 6), new Vector3(0, -MathHelper.DegToRad(60), 0)));
        result.push(new HouseLocation(2, new Vector3(-6.4, 0.5, -1.5), new Vector3(0, MathHelper.DegToRad(168.4), 0)));
        result.push(new HouseLocation(1, new Vector3(-4.1, 0.5, -1), new Vector3(0, MathHelper.DegToRad(168.4), 0)));
        result.push(new HouseLocation(2, new Vector3(-2.1, 0.5, -0.5), new Vector3(0, MathHelper.DegToRad(168.4), 0)));
        result.push(new HouseLocation(1, new Vector3(0, 0.5, -1), new Vector3(0, MathHelper.DegToRad(224.8), 0)));
        result.push(new HouseLocation(1, new Vector3(0.5, 0.5, -3), new Vector3(0, MathHelper.DegToRad(143.2), 0)));
        result.push(new HouseLocation(2, new Vector3(0.75, 0.5, -5), new Vector3(0, MathHelper.DegToRad(171), 0)));
        result.push(new HouseLocation(1, new Vector3(0.75, 0.5, -7), new Vector3(0, MathHelper.DegToRad(159.8), 0)));
        result.push(new HouseLocation(2, new Vector3(4.75, 0.5, -1), new Vector3(0, MathHelper.DegToRad(94.5), 0)));
        result.push(new HouseLocation(1, new Vector3(4.5, 0.5, -3), new Vector3(0, MathHelper.DegToRad(92), 0)));
        result.push(new HouseLocation(2, new Vector3(4.75, 0.5, -5), new Vector3(0, MathHelper.DegToRad(94.5), 0)));
        result.push(new HouseLocation(1, new Vector3(4.75, 0.5, -7), new Vector3(0, MathHelper.DegToRad(94.5), 0)));
        result.push(new HouseLocation(2, new Vector3(5.25, 0.5, 2), new Vector3(0, -MathHelper.DegToRad(59.5), 0)));
        result.push(new HouseLocation(1, new Vector3(6, 0.5, 4), new Vector3(0, -MathHelper.DegToRad(59.5), 0)));

        return result;
    }

    private getHouseModelUVForStyle(style : number)
    {
        const faceUV: Vector4[] = []; // faces for small house

        if (style == 1) 
        {
            faceUV[0] = new Vector4(0.5, 0.0, 0.75, 1.0); //rear face
            faceUV[1] = new Vector4(0.0, 0.0, 0.25, 1.0); //front face
            faceUV[2] = new Vector4(0.25, 0, 0.5, 1.0); //right side
            faceUV[3] = new Vector4(0.75, 0, 1.0, 1.0); //left side
            // faceUV[4] would be for bottom but not used
            // faceUV[5] would be for top but not used
        } 
        else 
        {
            faceUV[0] = new Vector4(0.6, 0.0, 1.0, 1.0); //rear face
            faceUV[1] = new Vector4(0.0, 0.0, 0.4, 1.0); //front face
            faceUV[2] = new Vector4(0.4, 0, 0.6, 1.0); //right side
            faceUV[3] = new Vector4(0.4, 0, 0.6, 1.0); //left side
            // faceUV[4] would be for bottom but not used
            // faceUV[5] would be for top but not used
        }

        return faceUV;
    }

    private createLighting()
    {
        let sunLightObj = this.objFactory.CreateLightGameObject(new Vector3(2,15,0), new Color3(1,1,1), LightType.Hemispheric);

        let lc = sunLightObj.GetComponent(LightComponent);
        let light = lc?.GetLight<HemisphericLight>();
        
        if (light)
        {
            light.intensity = 0.8;
            light.specular = new Color3(1,0.8,0.8);
            light.groundColor = new Color3(0, 0.2, 0.7);
        }

        let dVec = Vector3.Zero().subtract(sunLightObj.transform.Position).normalize();
        sunLightObj.transform.Rotation = Quaternion.FromLookDirectionLH(dVec, Vector3.Up());
    }

    private createHouseObject(name : string, style : number, pos : Vector3, rot : Vector3)
    {
        let root = this.objFactory.CreateShapeGameObject(pos, ShapeType.Sphere, {name : name, hideMesh : true});
        root.transform.Rotation = Quaternion.FromEulerAngles(rot.x, rot.y, rot.z);

        let house = this.createHouseBoxObject(style);
        let roof = this.createRoofObject(style);
        
        root.AddChild(house);
        root.AddChild(roof);

        return root;
    }

    private createHouseBoxObject(style : number) : GameObject
    {
        let name = style == 1 ? "cubehouse" : "semihouse";
        let result = this.objFactory.CreateShapeGameObject(new Vector3(0,0,0), ShapeType.Box, {name : name, faceUV : this.getHouseModelUVForStyle(style)});
        let txrData = this.dataManager.GetTexture(name + ".png");
        let mc = result.GetComponent(MeshComponent);

        if (mc)
        {
            let mat = mc.GetMaterial<StandardMaterial>();
            mat.diffuseTexture = txrData.texture;
        }

        result.transform.Scale = Vector3.One();

        return result;
    }

    private createRoofObject(style : number)
    {
        let name = "roof";
        let pos = new Vector3(0,0.7,0);
        let scale = new Vector3(1,0.6,1.3);
        let result = this.objFactory.CreateShapeGameObject(pos, ShapeType.Cylinder, {tessalation : 3, name : name});
        let txrData = this.dataManager.GetTexture(name + ".jpg");

        let mc = result.GetComponent(MeshComponent);

        if (mc)
        {
            let mat = mc.GetMaterial<StandardMaterial>();
            mat.diffuseTexture = txrData.texture;
        }

        result.transform.Scale = scale;
        result.transform.Rotation = Quaternion.FromEulerVector(new Vector3(MathHelper.DegToRad(0),MathHelper.DegToRad(0),MathHelper.DegToRad(90)))

        return result;
    }

    private setupSceneLighting()
    {

    }
}