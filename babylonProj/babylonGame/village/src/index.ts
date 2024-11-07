import { Engine } from "@babylonjs/core";
import createRunScene from "./createRunScene";
import createStartScene from "./createStartScene";
import './main.css';

const CanvasName = "renderCanvas";

let canvas = document.createElement("canvas");
canvas.id = CanvasName;

canvas.classList.add("background-canvas");
document.body.appendChild(canvas);

let eng = new Engine(canvas, true, {}, true);
let startScene = createStartScene(eng);

createRunScene(startScene);

eng.runRenderLoop(() => {
    startScene.scene.render();
});  