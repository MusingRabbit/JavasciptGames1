import { Camera, Light, Material, Mesh, Quaternion, Texture, Vector3 } from "@babylonjs/core";

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
    type : LightType;
}

export class RenderComponent extends Component 
{
    mesh : Mesh;
    texture : Texture;
    material : Material;

    constructor(mesh : Mesh)
    {
        super();
        this.mesh = mesh;
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

    public GetSize(){
        return (this.scale.x + this.scale.y + this.scale.z) / 3;
    }
}
