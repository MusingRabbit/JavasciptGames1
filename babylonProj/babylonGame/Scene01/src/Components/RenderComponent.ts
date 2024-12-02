import { Material, Mesh, MultiMaterial, Nullable, StandardMaterial, Texture } from "@babylonjs/core";
import { TextureData } from "../Data/TextureRepository";
import { Component } from "./component";

export class RenderComponent extends Component 
{
    mesh : Mesh;
    texture : Texture;
    ignoreLighting :boolean;

    constructor()
    {
        super();

        this.ignoreLighting = false;
    }

    public SetMesh(mesh: Mesh)
    {
        if (this.mesh)
        {
            let scene = this.mesh.getScene();
            scene.removeMesh(this.mesh);
        }

        this.mesh = mesh;

        if (this.mesh.material)
        {
            this.SetMaterial(this.mesh.material);
        }
    }

    public GetMaterial<T extends Material>() : Nullable<T>
    {
        return <T>this.mesh.material;
    }

    public SetMaterial(material : Material)
    {
        if (!this.mesh)
        {
            return;
        }

        this.mesh.material = material;
    }

    public GetTexture() : Nullable<Texture>
    {
        return this.texture;
    }

    public SetTextureData(data : TextureData)
    {
        let material = this.GetMaterial();

        if (!material)
        {
            return;
        }

        if (material instanceof MultiMaterial)
        {
            for (let mat of material.subMaterials)
            {
                if (mat instanceof StandardMaterial)
                {
                    mat.diffuseTexture = data.texture;
                    mat.ambientTexture = data.texture;
                    mat.bumpTexture = data.normal;
                }
            }
        }
        else if (material instanceof StandardMaterial)
        {
            material.diffuseTexture = data.texture;
            material.bumpTexture = data.normal;
        }
        
    }
}
