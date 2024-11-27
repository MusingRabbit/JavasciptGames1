import { Color3, Quaternion, Vector2, Vector3 } from "@babylonjs/core";
import Game from "./game";
import SceneFactory from "./SceneFactory";
import { RenderComponent, Transform } from "./Components/component";
import GameObject from "./GameObjects/gameObject";

export class SimpleGame extends Game
{
    gameObj1 : GameObject;

    public Initialise(): void {
        this.setupBasicScene();

        this.ShowDebugLayer();

        super.Initialise();
    }

    public Update(): void {

        let i = 0;
        let x = Math.sin(i);
        let y = Math.cos(i);
        let z = Math.sin(i);

        i++
        let rot = Quaternion.FromEulerAngles(x,y,z)
        this.gameObj1.transform.rotation = rot;

        //this.gameObj1.transform.rotation = Quaternion.Slerp(this.gameObj1.transform.rotation, this.gameObj1.transform.rotation, 100);

        super.Update();
    }

    public Render(): void {


        super.Render();
    }


    private createBoxGameObject() : GameObject
    {
        let result = this.gameObjSys.CreateGameObject(new Transform());
        result.components.push(new RenderComponent(this.sceneFactory.CreateBox("box", result.transform.position, result.transform.GetSize())));
        

        return result;
    }

    private setupBasicScene() : void 
    {
        this.gameObj1 = this.createBoxGameObject();
        this.sceneFactory.CreateArcRotateCamera("camera", true);
    }
}