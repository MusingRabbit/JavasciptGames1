import { Camera, Light, Material, Mesh, Nullable, Quaternion, StandardMaterial, Texture, Vector3 } from "@babylonjs/core";

export enum LightType
{
    Spot,
    Hemispheric,
    Point,
    Directional
}

export enum ShapeType
{
    Box,
    Sphere,
    Plane,
    Capsule,
}

export class Component
{

}

export class LightComponent extends Component
{
    light : Light;
}

export class RenderComponent extends Component 
{
    mesh : Mesh;
    texture : Texture

    public SetMesh(mesh: Mesh)
    {
        if (this.mesh)
        {
            let scene = this.mesh.getScene();
            scene.removeMesh(this.mesh);
        }

        this.mesh = mesh;
    }

    public GetMaterial() : Nullable<Material>
    {
        return this.mesh.material;
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

    public SetTexture(texture : Texture)
    {
        let material = this.GetMaterial();

        if (!material)
        {
            return;
        }

        if (material instanceof StandardMaterial)
        {
            material.ambientTexture = texture;
        }
    }
}

export class CameraComponent extends Component
{
    camera : Camera;
}

export class Transform 
{
    position : Vector3;
    rotation : Quaternion;
    scale : Vector3;

    constructor()
    {
        this.position = Vector3.Zero();
        this.rotation = Quaternion.Identity();
        this.scale = new Vector3(1,1,1);
    }

    public SetRotationEuler(rot : Vector3)
    {
        this.rotation = Quaternion.FromEulerAngles(rot.x, rot.y, rot.z);
    }

    public SetSize(size : number)
    {
        this.scale = new Vector3(size, size, size);
    }

    public GetSize(){
        return (this.scale.x + this.scale.y + this.scale.z) / 3;
    }
}
