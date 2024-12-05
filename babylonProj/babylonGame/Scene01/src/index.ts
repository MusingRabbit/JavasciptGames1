import './main.css';

import { Engine } from "@babylonjs/core";
import { SimpleGame } from "./simpleGame";
import { PhysicsGame } from './physicsGame';

const CanvasName = "renderCanvas";

let canvas = document.createElement("canvas");
canvas.id = CanvasName;

canvas.classList.add("background-canvas");
document.body.appendChild(canvas);


try 
{
    let eng = new Engine(canvas, true, {}, true);
    let game = new SimpleGame(eng);

    game.Initialise();
    game.Run();
    game.ShowDebugLayer();
}
catch(ex)
{
    console.log(ex);
}