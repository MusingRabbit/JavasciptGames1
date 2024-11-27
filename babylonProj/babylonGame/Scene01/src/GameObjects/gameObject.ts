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
}