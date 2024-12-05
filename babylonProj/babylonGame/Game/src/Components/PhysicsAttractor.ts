import { Component } from "./component";

export class PhysicsAttractor extends Component
{
    strength : number;
    radius : number;

    constructor()
    {
        super();
        this.strength = 0;
        this.radius = 0;
    }
}