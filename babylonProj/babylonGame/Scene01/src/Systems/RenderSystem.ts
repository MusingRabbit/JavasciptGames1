import { GlowLayer } from "@babylonjs/core";
import { System } from "./System";
import { Game } from "../game";

export class RenderSystem extends System
{
    glowLayer : GlowLayer

    constructor()
    {
        super();
    }

    public Initialise(): void {
        super.Initialise();

        this.glowLayer = new GlowLayer("glowLayer", Game.CurrentScene);
        this.glowLayer.isEnabled = false;
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