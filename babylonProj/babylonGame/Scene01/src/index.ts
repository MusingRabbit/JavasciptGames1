import { Engine, Scene } from "@babylonjs/core";
import './main.css';
import SceneController from "./SceneFactory";
import { SimpleGame } from "./simpleGame";

const CanvasName = "renderCanvas";

let canvas = document.createElement("canvas");
canvas.id = CanvasName;

canvas.classList.add("background-canvas");
document.body.appendChild(canvas);

let eng = new Engine(canvas, true, {}, true);
let game = new SimpleGame(eng);

game.Initialise();
