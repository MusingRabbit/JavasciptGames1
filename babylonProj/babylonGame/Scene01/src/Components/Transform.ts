import { Matrix, Quaternion, Vector3 } from "@babylonjs/core";
import { Component } from "./component";

export class Transform extends Component
{
    public get Position() : Vector3
    {
        return this.position;
    }

    public set Position(value :Vector3)
    {
        this.position = value;
        this.isDirty = true;
    }

    public get Rotation() : Quaternion
    {
        return this.rotation;
    }

    public set Rotation(value :Quaternion)
    {
        this.rotation = value;
        this.isDirty = true;
    }

    public get Scale() : Vector3
    {
        return this.scale;
    }

    public set Scale(value :Vector3)
    {
        this.scale = value;
        this.isDirty = true;
    }

    private position : Vector3;
    private rotation : Quaternion;
    private scale : Vector3;

    isDirty :boolean;

    constructor()
    {
        super();
        
        this.position = Vector3.Zero();
        this.rotation = Quaternion.Identity();
        this.scale = new Vector3(1,1,1);
    }

    public Update(dt: number): void {
        this.isDirty = false;
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
        let mtxResult = Matrix.Identity();
        this.rotation.toRotationMatrix(mtxResult);
        return mtxResult;
    }

    private getTranslationMatrix() : Matrix
    {
        return Matrix.Translation(this.position.x,  this.position.y, this.position.z);
    }

    public Up() : Vector3
    {
        let up = Vector3.TransformCoordinates(Vector3.Up(), this.getRotationMatrix());
        
        return up.normalize();
    }

    public Forward() : Vector3
    {
        let forward = Vector3.TransformCoordinates(Vector3.Forward(), this.getRotationMatrix());
        return forward.normalize();
    }

    public Right() : Vector3
    {
        let right = Vector3.TransformCoordinates(Vector3.Right(), this.getRotationMatrix());

        return right.normalize();
    }

    public GetMatrix (): Matrix
    {
        let result = Matrix.Identity();

        result = result.multiply(this.getScaleMatrix());
        result = result.multiply(this.getRotationMatrix());
        result = result.multiply(this.getTranslationMatrix());
        
        return result;
    }
}    

