import './main.css';

import { Engine } from "@babylonjs/core";
import { SimpleGame } from "./simpleGame";
import { PhysicsGame } from './physicsGame';
import { Game } from './game';

function startGame(gameName : string) : Game | null
{
    try 
    {
        let eng = new Engine(canvas, true, {}, true);
        let game = new Game(eng);
    
        switch(gameName)
        {
            case ("temple") :
            {
                game = new SimpleGame(eng);
                break;
            }
            case ("physics") : 
            {
                game = new PhysicsGame(eng);
                break;
            }
        }

        game.Initialise();
        game.Run();
        game.ShowDebugLayer();

        return game;
    }
    catch(ex)
    {
        console.log(ex);
    }

    return null;
}

const CanvasName = "renderCanvas";

let canvas = document.createElement("canvas");
canvas.id = CanvasName;

canvas.classList.add("background-canvas");
document.body.appendChild(canvas);

const urlParams = new URLSearchParams(window.location.search);
const gameName = urlParams.get('name');

let currGame = startGame("temple");


