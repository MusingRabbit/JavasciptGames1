import { fluidRenderingBilateralBlurPixelShader, Nullable, Scene } from "@babylonjs/core";
import { MeshData, MeshRepository } from "./MeshRepository";
import { TextureData, TextureRepository } from "./TextureRepository";
import { it } from "node:test";
import { LiteEvent } from "../Event/LiteEvent";
import { FileHelper } from "../Util/File/FileHelper";

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
        this.txrRepo = new TextureRepository(5000);

        this.meshRepo.OnLoadCompleted.on((data) => {
            if (data)
            {
                console.log("onLoadingCompleted : " + data.filePath);
                let queueItem = this.meshFileQueue.get(data.filePath);

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
                console.log("onLoadingCompleted : " + data.filePath);
                let queueItem = this.txrFileQueue.get(data.filePath);

                if (queueItem)
                {
                    queueItem.complete = true;
                    queueItem.success = data.texture != null && data.texture != undefined;
                }

                this.checkLoadingComplete();
            }
        });
    }

    public QueueLoadMeshes(filePaths : string[])
    {
        for (let path of filePaths)
        {
            this.QueueLoadMesh(path);
        }
    }

    public QueueLoadTextures(filePaths : string[])
    {
        for (let path of filePaths)
        {
            this.QueueLoadTexture(path);
        }
    }

    public QueueLoadMesh(filePath : string)
    {
        let pInfo = FileHelper.GetPathInfo(filePath);
        console.log("Adding " + pInfo.fullPath + " to load queue.");
        this.meshFileQueue.set(pInfo.fullPath, new QueueData(pInfo.fullPath));
    }

    public QueueLoadTexture(filePath : string)
    {
        let pInfo = FileHelper.GetPathInfo(filePath);
        console.log("Adding " + pInfo.fullPath + " to load queue.");
        this.txrFileQueue.set(pInfo.fullPath, new QueueData(pInfo.fullPath));
    }

    public Load()
    {
        if (this.meshFileQueue.size < 1 && this.txrFileQueue.size < 1)
        {
            return;
        }

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

            console.log("DataManager -> Load Complete!");
        }
    }
}

