import { AbstractMesh, Mesh, Nullable, Scene, SceneLoader } from "@babylonjs/core";
import { LiteEvent } from "../Event/LiteEvent";


export class MeshData
{
    fileName : string;
    objs : Map<string, Mesh>;

    constructor(fileName : string)
    {
        this.fileName = fileName;
        this.objs = new Map<string, Mesh>();
    }

    public Add(mesh : Mesh)
    {
        this.objs.set(mesh.name, mesh);
    }
}

export class MeshRepository
{
    modelDir : string;
    cache : Map<string, MeshData>;

    private readonly onLoadCompleted = new LiteEvent<MeshData>();

    public get OnLoadCompleted() { return this.onLoadCompleted.expose(); }

    constructor() {
        this.cache = new Map<string, MeshData>();
        this.modelDir = "assets/models/";
    }

    public ClearCache()
    {
        this.cache.clear();
    }

    public GetMeshData(fileName : string) : Nullable<MeshData>
    {
        if (this.cache.has(fileName))
        {
            return this.cache.get(fileName) ?? null;
        }

        return null;
    }

    public LoadMesh(fileName : string, scene : Scene) : void
    {
        SceneLoader.ImportMesh("", 
            this.modelDir, 
            fileName, 
            scene, 
            (objs) => { this.onMeshLoadSuccess(fileName, objs) }, null, 
            (scene, message, ex) => { this.onMeshLoadFailure(fileName, message); } );
    }

    private onMeshLoadFailure(fileName : string, msg : string)
    {
        console.log(fileName + " load failed : " + msg);

        this.onLoadCompleted.trigger(new MeshData(fileName));
    }

    private onMeshLoadSuccess(fileName : string, objs : AbstractMesh[])
    {
        let data = new MeshData(fileName);
        data.fileName = fileName;

        for (let obj of objs)
        {
            let mesh = obj as Mesh;
            mesh.bakeCurrentTransformIntoVertices();
            data.Add(mesh);
        }

        this.cache.set(fileName, data);
        
        console.log(fileName + " successfully loaded");

        this.onLoadCompleted.trigger(data);
    }
}