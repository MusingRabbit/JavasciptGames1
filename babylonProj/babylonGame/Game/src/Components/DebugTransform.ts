import { Color4, LinesMesh, MeshBuilder, NullBlock } from "@babylonjs/core";
import { Component } from "./component";
import { Game } from "../game";

export class DebugTransform extends Component
{
    debugUpLine : LinesMesh;
    debugFwdLine : LinesMesh;
    debugRgtLine : LinesMesh;

    lineLengthMultiplier : number;

    constructor()
    {
        super();

        this.lineLengthMultiplier = 1.0;
    }

    public Update(dt: number): void 
    {
        let currScene = Game.CurrentScene;

        if (currScene)
        {
            if (this.debugUpLine)
                {
                    currScene.removeMesh(this.debugUpLine);
                    this.debugUpLine.dispose();
                }
        
                if (this.debugFwdLine)
                {
                    currScene.removeMesh(this.debugFwdLine);
                    this.debugFwdLine.dispose();
                }
        
                if (this.debugRgtLine)
                {
                    currScene.removeMesh(this.debugRgtLine);
                    this.debugRgtLine.dispose();
                }

                let transform = this.gameObject.transform;

                let upLinePoints = [
                    transform.position,
                    transform.position.add(transform.Up().scale(transform.GetSize() * this.lineLengthMultiplier))
                ];
        
                let fwdLinePoints = [ 
                    transform.position,
                    transform.position.add(transform.Forward().scale(transform.GetSize() * this.lineLengthMultiplier))
                ];
        
                let rgtLinePoints = [ 
                    transform.position,
                    transform.position.add(transform.Right().scale(transform.GetSize() * this.lineLengthMultiplier))
                ];
        
        
                this.debugUpLine = MeshBuilder.CreateLines(this.gameObject.id + "_uLine", {points: upLinePoints, updatable : true, colors : [new Color4(0,1,0,1), new Color4(0,1,0,1)]});
                this.debugFwdLine = MeshBuilder.CreateLines(this.gameObject.id +"_fLine", {points : fwdLinePoints, updatable : true, colors : [new Color4(0,0,1,1), new Color4(0,0,1,1)]});
                this.debugRgtLine = MeshBuilder.CreateLines(this.gameObject.id +"_rLine", {points : rgtLinePoints, updatable : true, colors : [new Color4(1,0,0,1), new Color4(1,0,0,1)]});
        }

        super.Update(dt);
    }
}
