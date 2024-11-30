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
    isInitialised :boolean;

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

    public Initialise() : boolean
    {
        this.isInitialised = false;

        if (this.dataManager.isLoading)             
        {
            this.dataManager.OnLoadCompleted.on(() => {
                this.Initialise();
            });

            return false;
        }

        console.log("game initialising");

        this.lightingSys.Initialise();
        this.gameObjSys.Initialise();

        this.isInitialised = true;
        return this.isInitialised;
    }

    public Run() : boolean
    {
        if (this.isInitialised)
        {
            console.log("Running Game");
            this.isRunning = true;
    
            try 
            {
                this.engine.runRenderLoop(() => {
                    let dt = this.engine.getDeltaTime() * 0.001;
                    this.Update(dt);
                    this.Render(dt);
                });
            }
            catch(ex)
            {
                console.log(ex);
                this.Stop();
            }
        }
        else 
        {
            console.log("Run() -> Initialisation not yet complete.");
            setTimeout(() => this.Run(), 10);
        }

        return this.isRunning;
    }

    private Stop()
    {
        this.isRunning = false;
    }

    

    public Load() : void 
    {
        this.dataManager.Load();
    }

    public Update(dt : number) : void
    {
        this.gameObjSys.Update();
    }

    public Render(dt : number) : void
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
        console.log("AddGameObject : " + gameObj.name + "(" + gameObj.id + ")");
        this.gameObjSys.AddGameObject(gameObj);
        this.lightingSys.AddGameObject(gameObj);
    }
}