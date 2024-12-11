import { Material, Mesh, MultiMaterial, Nullable, StandardMaterial, Texture, VertexBuffer } from "@babylonjs/core";
import { TextureData } from "../Data/TextureRepository";
import { Component } from "./component";

export class MeshComponent extends Component 
{
    mesh : Mesh;
    texture : Texture;
    ignoreLighting : boolean;

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

    public GetMaterial<T extends Material>() : T
    {
        return <T>this.mesh.material as T;
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

    public flipNormals()
    {
        var normals = this.mesh.getVerticesData(VertexBuffer.NormalKind);

        if (!normals)
        {
            return;
        }

        for(let i=0; i< normals.length; i++)
        {
            normals[i] *= -1;
        }
            
        this.mesh.setVerticesData(VertexBuffer.NormalKind, normals);
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
                    //mat.ambientTexture = data.texture;

                    if (!data.normal.loadingError)
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
