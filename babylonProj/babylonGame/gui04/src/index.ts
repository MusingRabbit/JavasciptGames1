import { Engine, Scene} from "@babylonjs/core";
import createStartScene from "./createStartScene";
import createRunScene from "./createRunScene";
import createGUIScene from "./createGUI";
import "./main.css";
import { SceneData } from "./interfaces";

const CanvasName = "renderCanvas";

let canvas = document.createElement("canvas");
canvas.id = CanvasName;

canvas.classList.add("background-canvas");
document.body.appendChild(canvas);

let eng = new Engine(canvas, true, {}, true);

let scenes : SceneData[] = [];

scenes[0] = createStartScene(eng);
scenes[1] = createStartScene(eng);

let startScene = createStartScene(eng);

createGUIScene(startScene);
createRunScene(startScene);

eng.runRenderLoop(() => {
  startScene.scene.render();
});