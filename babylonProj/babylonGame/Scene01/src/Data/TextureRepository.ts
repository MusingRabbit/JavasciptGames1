import { Texture } from "@babylonjs/core";
import { LiteEvent } from "../Event/LiteEvent";
import { FileHelper, PathInfo } from "../Util/File/FileHelper";
import path from "path";

export class TextureData
{
    filePath : string;
    name : string;
    texture : Texture;
    normal : Texture;
    diffuse : Texture;

    constructor(pathInfo : PathInfo) {
        this.filePath = pathInfo.fullPath;
        this.name = pathInfo.name;
    }
}

export class TextureRepository
{
    textureCache : Map<string, TextureData>;
    txrDir : string;

    loadTimeout : number = 2000;
    loadingFlags : Map<string, boolean>;

    private readonly onLoadCompleted = new LiteEvent<TextureData>();

    public get OnLoadCompleted() { return this.onLoadCompleted.expose(); }

    constructor(loadTimeout : number)
    {
        this.loadingFlags = new Map<string, boolean>();
        this.textureCache = new Map<string, TextureData>();
        this.txrDir = "assets/textures/";
        this.loadTimeout = loadTimeout;
    }

    public ClearCache()
    {
        this.loadingFlags.clear();
        this.textureCache.clear();
    }

    public GetTexture(filePath : string) : TextureData
    {
        let result = this.textureCache.get(filePath);

        if (result)
        {
            return result;
        }

        this.loadingFlags.set(filePath, true);

        let pi = FileHelper.GetPathInfo(filePath);
        result = new TextureData(pi);

        try 
        {
            let txr = new Texture(this.txrDir + pi.fullPath);

            txr.onLoadObservable.add((txr) => { 
                result = new TextureData(pi);
                result.texture = txr;
                result.diffuse = txr;
                result.normal = new Texture(this.txrDir + pi.name + "_norm.png");
                
                this.notifyTextureLoadSuccess(pi, result);
            });

            setTimeout(() => {
                if (this.loadingFlags.get(pi.fullPath))
                {
                    this.notifyTextureLoadFailure(pi, "load timeout" ,new TextureData(pi));
                }

            }, this.loadTimeout);
        }
        catch (ex)
        {
            this.notifyTextureLoadFailure(pi, ex, new TextureData(pi));
        }

        return result;
    }

    private notifyTextureLoadSuccess(pathInfo : PathInfo, data : TextureData )
    {
        console.log("Texture " + pathInfo.fullPath +" loaded successfully!");

        this.textureCache.set(pathInfo.fullPath, data);
        this.onLoadCompleted.trigger(data);
        this.loadingFlags.set(pathInfo.fullPath, false);
    }

    private notifyTextureLoadFailure(pathInfo : PathInfo, msg : string, data : TextureData)
    {
        console.log("Texture " + pathInfo.fullPath +" load failed! \n" + msg);
        this.onLoadCompleted.trigger(data);
        this.loadingFlags.set(pathInfo.fullPath, false);
    }
}
