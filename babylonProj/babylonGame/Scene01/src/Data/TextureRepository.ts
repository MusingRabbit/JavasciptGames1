import { Texture } from "@babylonjs/core";
import { LiteEvent } from "../Event/LiteEvent";

export class TextureData
{
    fileName : string;
    texture : Texture;
    normal : Texture;
    diffuse : Texture;

    constructor(fileName : string) {
        this.fileName = fileName;
    }
}

export class TextureRepository
{
    textureCache : Map<string, TextureData>;
    txrDir : string;

    loadTimeout : number = 500;

    private readonly onLoadCompleted = new LiteEvent<TextureData>();

    public get OnLoadCompleted() { return this.onLoadCompleted.expose(); }

    constructor(loadTimeout : number)
    {
        this.textureCache = new Map<string, TextureData>();
        this.txrDir = "assets/textures/";
        this.loadTimeout = loadTimeout;
    }

    public ClearCache()
    {
        this.textureCache.clear();
    }

    public GetTexture(fileName : string) : TextureData
    {
        let result = this.textureCache.get(fileName);

        if (result)
        {
            return result;
        }

        result = new TextureData(fileName);
        let tokens = fileName.split('.');
        let name = tokens[0];
        let ext = tokens[1];

        try 
        {
            let txr = new Texture(this.txrDir + fileName);

            txr.onLoadObservable.add((txr) => { 
                result = new TextureData(fileName);
                result.texture = txr;
                result.diffuse = new Texture(this.txrDir + fileName + "_disp.png");
                result.normal = new Texture(this.txrDir + fileName + "_norm.png");
                
                this.onTextureLoadSuccess(fileName, result);
            });

            setTimeout(() => {
                this.onTextureLoadSuccess(fileName, new TextureData(fileName));
            }, this.loadTimeout);


            
            this.textureCache.set(fileName, result);
        }
        catch (ex)
        {
            this.onTextureLoadFailure(fileName, ex, new TextureData(fileName));
        }

        return result;
    }

    private onTextureLoadSuccess(fileName : string, data : TextureData )
    {
        console.log("Texture " + fileName +" loaded successfully!");
        this.onLoadCompleted.trigger(data);
    }

    private onTextureLoadFailure(fileName : string, msg : string, data : TextureData)
    {
        console.log("Texture " + fileName +" load failed! \n" + msg);
        this.onLoadCompleted.trigger(data);
    }
}