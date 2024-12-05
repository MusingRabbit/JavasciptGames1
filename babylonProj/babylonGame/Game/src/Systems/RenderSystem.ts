import { GlowLayer } from "@babylonjs/core";
import { System } from "./System";
import { Game } from "../game";

export class RenderSystem extends System
{
    glowLayer : GlowLayer

    constructor()
    {
        super();
        this.initialised = false;
    }

    public Initialise(reinitialise : boolean = false) : boolean
    {
        if (super.Initialise(reinitialise))
        {
            this.glowLayer = new GlowLayer("glowLayer", Game.CurrentScene);
            this.glowLayer.isEnabled = false;
            this.initialised = true;
            return true;
        }

        return this.initialised;
    }

    public Update(dt: number): void {
        super.Update(dt);
    }

    public EnableGlowLayer()
    {
        this.glowLayer.isEnabled = true;
    }

    public DisableGlowLayer()
    {
        this.glowLayer.isEnabled = false;
    }
}