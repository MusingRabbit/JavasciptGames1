import { Camera, Light, Material, Matrix, Mesh, Nullable, Quaternion, StandardMaterial, Texture, Vector3, Vector4 } from "@babylonjs/core";
import { TextureData } from "../Data/TextureRepository";
import { GameObject } from "../GameObjects/gameObject";

export class Component
{
    gameObject : GameObject;

    public SetGameObject(gameObject : GameObject) : void
    {
        this.gameObject = gameObject;
    }

    public Update(dt : number)
    {

    }
}



