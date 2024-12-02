import { Color3, Scene, StandardMaterial, Texture } from "@babylonjs/core";
import { TextureData } from "../Data/TextureRepository";

class MaterialBuilder
{
    scene : Scene;

    constructor(scene : Scene)
    {
        this.scene = scene;
    }

    public CreateStandardMaterial(name : string, colour : Color3 = Color3.White())
    {
        let result = new StandardMaterial(name, this.scene);
        result.backFaceCulling = true;
        result.maxSimultaneousLights = 6;
        result.ambientColor = colour;

        return result;
    }

    public CreateTexturedStandardMaterial(name : string, colour : Color3 = Color3.White(), txrData: TextureData)
    {
        let result = this.CreateStandardMaterial(name, colour);

        result.ambientTexture = txrData.texture;

        if (txrData.normal)
        {
            result.bumpTexture = txrData.normal;
        }

        if (txrData.diffuse)
        {
            result.diffuseTexture = txrData.diffuse;
        }

        return result;
    }
}

