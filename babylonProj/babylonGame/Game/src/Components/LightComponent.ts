import { Light } from "@babylonjs/core";
import { Component } from "./component";

export class LightComponent extends Component
{
    light : Light;

    public GetLight<T>() : T
    {
        return <T>this.light as T;
    }

    public SetLight<T extends Light>(light : T){
        this.light = light;
    }
}

