import { fluidRenderingBilateralBlurPixelShader, Nullable, Scene } from "@babylonjs/core";
import { MeshData, MeshRepository } from "./MeshRepository";
import { TextureData, TextureRepository } from "./TextureRepository";
import { it } from "node:test";
import { LiteEvent } from "../Event/LiteEvent";


class QueueData
{
    fileName : string;
    complete : boolean;
    success : boolean;

    constructor(fileName : string){
        this.fileName = fileName;
    }
}

export class DataManager 
{
    scene : Scene;

    txrRepo : TextureRepository;
    meshRepo : MeshRepository;

    meshFileQueue : Map<string,QueueData>;
    txrFileQueue : Map<string, QueueData>;

    onLoadTriggered : boolean;
    isLoading : boolean;

    private readonly onLoadCompleted = new LiteEvent();

    public get OnLoadCompleted() { return this.onLoadCompleted.expose(); }

    constructor(scene : Scene)
    {
        this.meshFileQueue = new Map<string, QueueData>();
        this.txrFileQueue = new Map<string, QueueData>();
        
        this.scene = scene;
        this.meshRepo = new MeshRepository();
        this.txrRepo = new TextureRepository(500);

        this.meshRepo.OnLoadCompleted.on((data) => {
            if (data)
            {
                console.log("onLoadingCompleted : " + data.fileName);
                let queueItem = this.meshFileQueue.get(data.fileName);

                if (queueItem)
                {
                    queueItem.complete = true;
                    queueItem.success = data.objs != null && data.objs != undefined;
                }

                this.checkLoadingComplete();
            }
        });

        this.txrRepo.OnLoadCompleted.on((data) => {
            if (data)
            {
                console.log("onLoadingCompleted : " + data.fileName);
                let queueItem = this.txrFileQueue.get(data.fileName);

                if (queueItem)
                {
                    queueItem.complete = true;
                    queueItem.success = data.texture != null && data.texture != undefined;
                }

                this.checkLoadingComplete();
            }
        });
    }

    public QueueLoadMeshes(fileNames : string[])
    {
        for (let fn of fileNames)
        {
            this.QueueLoadMesh(fn);
        }
    }

    public QueueLoadTextures(fileNames : string[])
    {
        for (let fn of fileNames)
        {
            this.QueueLoadTexture(fn);
        }
    }

    public QueueLoadMesh(fileName : string)
    {
        console.log("Adding " + fileName + " to load queue.");
        this.meshFileQueue.set(fileName, new QueueData(fileName));
    }

    public QueueLoadTexture(fileName : string)
    {
        console.log("Adding " + fileName + " to load queue.");
        this.txrFileQueue.set(fileName, new QueueData(fileName));
    }

    public Load()
    {
        this.isLoading = true;
        this.onLoadTriggered = false;

        for(let item of this.meshFileQueue.values())
        {
            item.complete = false;
            item.success = false;
            
            this.meshRepo.LoadMesh(item.fileName, this.scene);
        }

        for (let item of this.txrFileQueue.values())
        {
            item.complete = false;
            item.success = false;

            this.txrRepo.GetTexture(item.fileName);
        }
    }

    public GetMesh(fileName : string) : Nullable<MeshData>
    {
        return this.meshRepo.GetMeshData(fileName);
    }

    public GetTexture(fileName : string) : TextureData
    {
        return this.txrRepo.GetTexture(fileName);
    }

    private checkLoadingComplete() : void
    {
        let result = true;

        for(let item of this.meshFileQueue.values())
        {
            if (!item.complete)
            {
                result = false;
                break;
            }
        }

        for(let item of this.txrFileQueue.values())
        {
            if (!item.complete)
            {
                result = false;
                break;
            }
        }
        
        if (result)
        {
            this.isLoading = false;

            if (!this.onLoadTriggered)
            {
                this.onLoadCompleted.trigger();
                this.onLoadTriggered = true;
            }
            
            this.txrFileQueue.clear();
            this.meshFileQueue.clear();
        }
    }
}