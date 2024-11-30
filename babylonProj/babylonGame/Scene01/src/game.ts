import { Engine, Scene } from "@babylonjs/core";
import SceneObjectBuilder from "./Factory/SceneObjectBuilder";
import GameObject from "./GameObjects/gameObject";
import { GameObjectSystem } from "./Systems/GameObjectSystem";
import { GameObjectFactory } from "./Factory/GameObjectFactory";
import { LightingSystem } from "./Systems/LightingSystem";
import { TextureRepository } from "./Data/TextureRepository";
import { MeshRepository } from "./Data/MeshRepository";

import "@babylonjs/inspector"
import "@babylonjs/core/Debug/debugLayer"
import { DataManager } from "./Data/DataManager";

export default class Game 
{
    engine : Engine;
    scene : Scene;
    sceneBuilder : SceneObjectBuilder;
    gameObjSys : GameObjectSystem;
    objFactory : GameObjectFactory;
    lightingSys : LightingSystem;

    dataManager : DataManager;

    currTime : number;

    isRunning : boolean;

    constructor(engine : Engine)
    {
        this.engine = engine;
        this.scene = new Scene(this.engine);
        this.sceneBuilder = new SceneObjectBuilder(this.scene);
        this.gameObjSys = new GameObjectSystem();
        this.objFactory = new GameObjectFactory(this.scene, this.gameObjSys);
        this.lightingSys = new LightingSystem();

        this.isRunning = false;

        this.dataManager = new DataManager(this.scene);

        this.objFactory.OnCreated.on((gameObj?) => { 
            if (gameObj != null)
            {
                this.AddGameObject(gameObj);
            }
         });

         this.Load();
    }

    public Initialise() : void
    {
        console.log("game initialising");

        this.lightingSys.Initialise();
        this.gameObjSys.Initialise();
        
        //this.engine.runRenderLoop(() => {
        //    this.Update();
        //});
//
        //this.engine.runRenderLoop(() => {
        //    this.Render();
        //});

    }

    public async Run() 
    {
        if (this.dataManager.isLoading)             
        {
            this.dataManager.OnLoadCompleted.on(() => {
                this.Run();
            });

            return;
        }

        console.log("Running Game");
        this.isRunning = true;

        try 
        {
            while (this.isRunning)
            {
                this.Update();
                this.Render();
            }
        }
        catch(ex)
        {
            console.log(ex);
            this.Stop();
        }
    }

    private Stop()
    {
        this.isRunning = false;
    }

    

    public Load() : void 
    {
        this.dataManager.Load();
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

    public AddGameObject(gameObj : GameObject)
    {
        this.gameObjSys.AddGameObject(gameObj);
        this.lightingSys.AddGameObject(gameObj);
    }
}