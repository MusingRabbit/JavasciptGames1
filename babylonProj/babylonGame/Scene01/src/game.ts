import { Engine, IShadowLight, Scene, ShadowGenerator, ShadowLight } from "@babylonjs/core";
import SceneFactory from "./SceneFactory";
import GameObject from "./GameObjects/gameObject";
import { GameObjectSystem } from "./Systems/GameObjectSystem";

export default class Game 
{
    engine : Engine;
    scene : Scene;
    sceneFactory : SceneFactory;
    gameObjSys : GameObjectSystem;

    constructor(engine : Engine)
    {
        this.engine = engine;
        this.scene = new Scene(this.engine);
        this.sceneFactory = new SceneFactory(this.scene);
        this.gameObjSys = new GameObjectSystem();
    }

    public Initialise() : void
    {
        this.engine.runRenderLoop(() => {
            this.Update();
        });

        this.engine.runRenderLoop(() => {
            this.Render();
        });

        this.initialiseLighting();
        this.gameObjSys.Initialise();
    }

    public Update() : void
    {
        this.gameObjSys.Update();
    }

    public Render() : void
    {
        this.scene.render();
    }
    

    public ShowDebugLayer() {
        this.scene.debugLayer.show();
    }
    
    public HideDebugLayer() {
        this.scene.debugLayer.hide();
    }

    private initialiseLighting() : void
    {
        for (let light of this.scene.lights) {
            if (light instanceof ShadowLight) {
              let sLight = light as ShadowLight;
              this.sceneFactory.CreateShadowGenerator(sLight);
            }
          }
    }
}