import {Component, RenderComponent, Transform} from "../Components/component";

export default class GameObject
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
    }

    public AddChild(gameObj : GameObject)
    {
        this.children.push(gameObj);

        let rnd = gameObj.GetComponent(RenderComponent);
        let pRnd = this.GetComponent(RenderComponent);

        rnd.mesh.setParent(pRnd.mesh);

        gameObj.parent = this;
    }

    public AddComponent<T extends Component>(arg : T)
    {
        this.components.push(arg);
    }

    //I have no idea if this is how you handle generics in typescript.
    public GetComponent<T extends Component>(type: { new (...args: any[]): T }, ...args: any[]) : T {
        let result : T;

        for (let cmp of this.components)
        {
            if (cmp instanceof type)
            {
                result = <T>cmp;
                return result;
            }
        }

        return <T>new Component();
    }

    public GetLocalTransform()
    {
        return this.transform;
    }

    public GetWorldTransform() : Transform
    {
        let result = new Transform();

        result.position = this.transform.position;
        result.rotation = this.transform.rotation;
        result.scale = this.transform.scale;

        var currObj = <GameObject>this.parent;

        if (currObj)
        {
            while (currObj)
            {
                result.position = result.position.add(currObj.transform.position);
                result.rotation = result.rotation.add(currObj.transform.rotation);
                result.scale = currObj.transform.scale;
                currObj = currObj.parent;
            }
        }

        return result;
    }
}