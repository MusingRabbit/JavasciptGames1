import { Light } from "@babylonjs/core";

import { Transform } from "../Components/Transform";
import { LightComponent } from "../Components/LightComponent";
import { MeshComponent } from "../Components/MeshComponent";
import { Component } from "../Components/component";

export class GameObject
{
    id : string;
    name : string;
    transform : Transform;
    components : Component[];

    parent : GameObject;
    children : GameObject[];

    constructor()
    {
        this.components = [];
        this.children = [];

        this.transform = new Transform();
        this.transform.SetGameObject(this);
    }

    public AddChild(gameObj : GameObject)
    {
        this.children.push(gameObj);

        let lgt = gameObj.GetComponent(LightComponent);
        let rnd = gameObj.GetComponent(MeshComponent);
        let pRnd = this.GetComponent(MeshComponent);

        if (rnd && pRnd)
        {
            rnd.mesh.setParent(pRnd.mesh);

            if (lgt?.light)
            {
                lgt.light.parent = rnd.mesh;
                lgt.light.setEnabled(true);
            }
        }


        gameObj.parent = this;
    }

    public AddComponent<T extends Component>(arg : T)
    {
        arg.SetGameObject(this);
        this.components.push(arg);
        this.updateParentRelationships();
    }

    private updateParentRelationships()
    {
        let rnd = this.GetComponent(MeshComponent);
        let lgt = this.GetComponent(LightComponent);

        if (rnd?.mesh && lgt?.light)
        {
            lgt.light.parent = rnd.mesh;
        }
    }

    //I have no idea if this is how you handle generics in typescript.
    public GetComponent<T extends Component>(type: { new (...args: any[]): T }, ...args: any[]) : T | null {
        let result : T;

        for (let cmp of this.components)
        {
            if (cmp instanceof type)
            {
                result = <T>cmp;
                return result;
            }
        }

        return null;
    }

    public GetLocalTransform()
    {
        return this.transform;
    }

    public GetWorldTransform() : Transform
    {
        let result = new Transform();

        result.Position = this.transform.Position;
        result.Rotation = this.transform.Rotation;
        result.Scale = this.transform.Scale;

        var currObj = <GameObject>this.parent;

        if (currObj)
        {
            while (currObj)
            {
                result.Position = result.Position.add(currObj.transform.Position);
                result.Rotation = result.Rotation.add(currObj.transform.Rotation);
                result.Scale = currObj.transform.Scale;
                currObj = currObj.parent;
            }
        }

        return result;
    }
}

