import { Camera, Light, Material, Matrix, Mesh, Nullable, Quaternion, StandardMaterial, Texture, Vector3, Vector4 } from "@babylonjs/core";
import { TextureData } from "../Data/TextureRepository";

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
    TiledPlane,
    Capsule,
}

export class Component
{

}

export class LightComponent extends Component
{
    light : Light;

    public GetLight<T>() : T
    {
        return <T>this.light;
    }
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

        if (material instanceof StandardMaterial)
        {
            material.ambientTexture = data.texture;
            material.bumpTexture = data.normal;
            material.diffuseTexture = data.diffuse;
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

    private getScaleMatrix() : Matrix
    {
        return Matrix.Scaling(this.scale.x, this.scale.y, this.scale.z);
    }

    private getRotationMatrix() : Matrix
    {
        let eulerRot = this.rotation.toEulerAngles();
        return Matrix.RotationYawPitchRoll(eulerRot.x, eulerRot.y,eulerRot.z);
    }

    private getTranslationMatrix() : Matrix
    {
        return Matrix.Translation(this.position.x,  this.position.y, this.position.z);
    }

    public Up() : Vector3
    {
        let fwd = this.Forward();
        let rgt = this.Right();
        let result = fwd.cross(rgt)

        return result.normalize();
        
    }

    public Forward() : Vector3
    {
        let mtxWorld = this.GetMatrix();
        let forward = Vector4.TransformCoordinates(Vector3.Up(), mtxWorld).toVector3();
        
        return forward.normalize();
    }

    public Right() : Vector3
    {
        let mtxWorld = this.GetMatrix();
        let right = Vector4.TransformCoordinates(Vector3.Right(), mtxWorld).toVector3();

        return right.normalize();
    }

    public GetMatrix (): Matrix
    {
        return Matrix.Compose(this.scale, this.rotation, this.position);

        let result = Matrix.Identity();

        result = result.multiply(this.getScaleMatrix());
        result = result.multiply(this.getRotationMatrix());
        result = result.multiply(this.getTranslationMatrix());

        return result;
    }
}
