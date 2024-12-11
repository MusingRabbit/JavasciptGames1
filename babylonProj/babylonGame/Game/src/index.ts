import './main.css';

import { Color3, Color4, Engine, Nullable, Scene, Vector2 } from "@babylonjs/core";
import { SimpleGame } from "./simpleGame";
import { PhysicsGame } from './physicsGame';
import { Game } from './game';

import { Button, AdvancedDynamicTexture } from "@babylonjs/gui/2D";
import { LightingGame } from './lightingGame';
import { VillageGame } from './villageGame';

class createButtonArgs
{
    name : string;
    text : string;
    pos : Vector2;
    dimensions? : Vector2;
    backgroundColour? : Color4;
    foregroundColour? : Color4;
}


function startGame(gameName : string) : Game | null
{
    try 
    {
        let eng = new Engine(canvas, true, {}, true);
        let game = new Game(eng, "./assets/");
    
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
            case ("lighting") : 
            {
                game = new LightingGame(eng);
                break;
            }
            case ("village") : 
            {
                game = new VillageGame(eng);
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

function createButton(args : createButtonArgs) : Button
{
    let result = Button.CreateSimpleButton(args.name, args.text);
    result.left = args.pos.x;
    result.top = args.pos.y;

    if (!args.dimensions)
    {
        args.dimensions = new Vector2(100,75);
    }

    result.width = args.dimensions.x + "px";
    result.height = args.dimensions.y + "px";
    result.cornerRadius = 20;

    if (!args.backgroundColour)
    {
        args.backgroundColour = new Color4(0.2, 0.2, 0.3, 1);
    }

    if (!args.foregroundColour)
    {
        args.foregroundColour = new Color4(1, 1, 1, 1);
    }

    result.background = args.backgroundColour.toHexString();
    result.color = args.foregroundColour.toHexString();

    return result;
}

function createGui(scene : Scene)
{
    let advTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);

    let screenWidthRatio =  canvas.height / canvas.width;
    let screenHeightRatio = canvas.width / canvas.height;
    let buttonDim = new Vector2(75,50);
    let btnPos = new Vector2(1 * screenWidthRatio, 140 * screenHeightRatio);
    let btn1Pos = new Vector2(-200 * screenWidthRatio, 140 * screenHeightRatio);
    let btn2Pos = new Vector2(200 * screenWidthRatio, 140 * screenHeightRatio);
    let btn3Pos = new Vector2(400 * screenWidthRatio, 140 * screenHeightRatio);
    let btn4Pos = new Vector2(-400 * screenWidthRatio, 140 * screenHeightRatio);

    let btnReset = createButton({name : "btnReset", text : "Reset", pos : btnPos, dimensions : buttonDim});
    let btnTemple = createButton({name : "btnTemple", text : "Temple", pos : btn1Pos, dimensions : buttonDim});
    let btnPhysics = createButton({name : "btnPhysics", text : "Physics", pos : btn2Pos, dimensions : buttonDim});
    let btnLighting = createButton({name : "btnLighting", text : "Lighting", pos : btn3Pos, dimensions : buttonDim});
    let btnVillage = createButton({name : "btnVillage", text : "Village", pos : btn4Pos, dimensions : buttonDim});

    btnReset.onPointerClickObservable.add(x => { selectGameAndStart(currGameName); });
    btnTemple.onPointerClickObservable.add(x => { selectGameAndStart("temple"); });
    btnPhysics.onPointerClickObservable.add(x => {selectGameAndStart("physics")});
    btnLighting.onPointerClickObservable.add(x => {selectGameAndStart("lighting")});
    btnVillage.onPointerClickObservable.add(x => {selectGameAndStart("lighting")});

    advTexture.addControl(btnReset);
    advTexture.addControl(btnTemple);
    advTexture.addControl(btnPhysics);
    advTexture.addControl(btnLighting);
    advTexture.addControl(btnVillage);

    return advTexture;
}

const CanvasName = "renderCanvas";

let canvas = document.createElement("canvas");
canvas.id = CanvasName;

canvas.classList.add("background-canvas");
document.body.appendChild(canvas);

const urlParams = new URLSearchParams(window.location.search);
const gameName = urlParams.get('name');

let currGame : Nullable<Game> = null;
let currGameName = "village";

selectGameAndStart(currGameName);

function selectGameAndStart(gameName : string)
{
    if (currGame)
    {
        currGame.Clear();
        currGame = null;
    }

    currGameName = gameName;
    currGame = startGame(currGameName);
    
    if (currGame)
    {
        createGui(currGame.GetScene());
    }
}