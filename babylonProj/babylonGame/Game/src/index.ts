import './main.css';

import { Engine } from "@babylonjs/core";
import { SimpleGame } from "./simpleGame";
import { PhysicsGame } from './physicsGame';
import { Game } from './game';



const CanvasName = "renderCanvas";

let canvas = document.createElement("canvas");
canvas.id = CanvasName;

canvas.classList.add("background-canvas");
document.body.appendChild(canvas);



try 
{
    const urlParams = new URLSearchParams(window.location.search);
    const gameName = urlParams.get('name');

    let eng = new Engine(canvas, true, {}, true);
    let currGame = new Game(eng);

    //switch(gameName)
    //{
    //    case ("temple") :
    //    {
    //        currGame = new SimpleGame(eng);
    //        break;
    //    }
    //    case ("physics") : 
    //    {
    //        currGame = new PhysicsGame(eng);
    //        break;
    //    }
    //}

    currGame = new PhysicsGame(eng);

    currGame.Initialise();
    currGame.Run();
    currGame.ShowDebugLayer();
}
catch(ex)
{
    console.log(ex);
}