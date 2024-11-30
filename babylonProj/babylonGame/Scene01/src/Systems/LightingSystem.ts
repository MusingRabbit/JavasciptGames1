import { IShadowLight, Mesh, ShadowGenerator, ShadowLight } from "@babylonjs/core";
import { System } from "./System";
import { LightComponent, RenderComponent } from "../Components/component";
import GameObject from "../GameObjects/gameObject";

class ShadowGeneratorArgs
{
    light : IShadowLight;
    shadowMapSize : number = 2048;
    darkness : number = 0.2;
    useBlurExponentialShadowMap : boolean = true;
    blurScale : number = 2;
    blurBoxOffset : number = 1;
    useKernelBlur : boolean = true;
    blurKernel : number = 64;
    bias : number = 0;
}

class LightData
{
    light : ShadowLight;
    shadowGen : ShadowGenerator;
}

export class LightingSystem extends System
{
    meshes : Mesh[];
    lights : LightData[];

    constructor()
    {
        super();

        this.meshes = [];
        this.lights = [];
    }

    public Initialise()
    {
        for(let gameObj of this.gameObjs.values())
        {
            this.processGameObject(gameObj);
        }
    }

    
    public AddGameObject(gameObj : GameObject) : boolean
    {
        if (super.AddGameObject(gameObj))
        {
            this.processGameObject(gameObj);
            this.updateShadowMap();

            for (let obj of gameObj.children)
            {
                this.AddGameObject(obj);
            }

            return true;
        }
        
        return false;
    }

    private processGameObject(gameObj : GameObject)
    {
        let rndCmp = gameObj.GetComponent(RenderComponent);
        let lightCmp = gameObj.GetComponent(LightComponent);
            
        if (rndCmp.mesh)
        {
            this.meshes.push(rndCmp.mesh);
        }

        if (lightCmp.light)
        {
            if (lightCmp.light instanceof ShadowLight)
                {
                    let args = new ShadowGeneratorArgs();
                    args.light = lightCmp.light;
                    this.lights.push({ light : lightCmp.light, shadowGen : this.createShadowGenerator(args)})
                }
        }
    }

    private createShadowGenerator(args : ShadowGeneratorArgs) : ShadowGenerator
    {
        const result = new ShadowGenerator(args.shadowMapSize, args.light);
        result.setDarkness(args.darkness);
        result.useBlurExponentialShadowMap = args.useBlurExponentialShadowMap;
        result.blurScale = args.blurScale;
        result.blurBoxOffset = args.blurBoxOffset;
        result.useKernelBlur = args.useKernelBlur;
        result.blurKernel = args.blurKernel;
        result.bias = args.bias;
        return result;
    }

    private updateShadowMap()
    {
        for (let light of this.lights)
        {
            for (let mesh of this.meshes)
                {
                    this.addMeshToShadowMap(mesh, light.shadowGen);
                }
        }
    }

    private addMeshToShadowMap(mesh : Mesh, shadowGenerator : ShadowGenerator)
    {
        mesh.receiveShadows = true;

        const sMap : any = shadowGenerator.getShadowMap();

        if (sMap?.renderList != null)
        {
            sMap.renderList.push(mesh);

            //console.log("Adding shadow caster " + mesh.name);

            shadowGenerator.addShadowCaster(mesh, true);
        }
    }
}