import { Scene, Sound } from "@babylonjs/core";
import { SceneData } from "./interfaces";
import { Button, AdvancedDynamicTexture } from "@babylonjs/gui/2D";


function createSceneButton(
    scene: Scene,
    name: string,
    index: string,
    x: string,
    y: string,
    advtex: { addControl: (arg0: Button) => void }) 
  {
    const buttonClickSound: Sound = new Sound(
        "MenuClickSFX",
        "./assets/audio/menu-click.wav",
        scene,
        null,
        {
          loop: false,
          autoplay: false,
        }
      )



    var button: Button = Button.CreateSimpleButton(name, index);

    button.left = x;
    button.top = y;
    button.width = "180px";
    button.height = "35px";
    button.color = "white";
    button.cornerRadius = 20;
    button.background = "green";
    button.onPointerClickObservable.add(function(){ buttonClickSound.play(); alert("button clicked. ") });

    advtex.addControl(button);

    return button;
}

export default function createGUIScene(runScene: SceneData) {
    //GUI elements
    let advancedTexture: AdvancedDynamicTexture =
      AdvancedDynamicTexture.CreateFullscreenUI("myUI", true);
    let btn1: Button = createSceneButton(
      runScene.scene,
      "btn1",
      "Click Here",
      "0px",
      "120px",
      advancedTexture
    );
    
   
  
    //runScene.scene.onAfterRenderObservable.add(() => {});
  }

