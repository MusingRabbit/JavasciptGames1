import {Component, Transform} from "../Components/component";

export default class GameObject
{
    id : string;
    transform : Transform;
    components : Component[];

    constructor()
    {
        this.components = [];
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

        throw "Type not found";
    }
}