import { AbstractMesh, Mesh, Nullable, Scene, SceneLoader } from "@babylonjs/core";
import { LiteEvent } from "../Event/LiteEvent";
import { FileHelper, PathInfo } from "../Util/File/FileHelper";

export class MeshData
{
    name : string;
    filePath : string;
    objs : Map<string, Mesh>;

    constructor(pathInfo : PathInfo)
    {
        this.name = pathInfo.name;
        this.filePath = pathInfo.fullPath;
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

    constructor(modelDirectory : string) {
        this.cache = new Map<string, MeshData>();
        this.modelDir = modelDirectory;
    }

    public ClearCache()
    {
        this.cache.clear();
    }

    public GetMeshData(filePath : string) : Nullable<MeshData>
    {
        let pi = FileHelper.GetPathInfo(filePath);

        if (this.cache.has(pi.fullPath))
        {
            return this.cache.get(pi.fullPath) ?? null;
        }

        return null;
    }

    public LoadMesh(filePath : string, scene : Scene) : void
    {
        let pi = FileHelper.GetPathInfo(filePath);

        SceneLoader.ImportMesh("", 
            this.modelDir + pi.path, 
            pi.fileName, 
            scene, 
            (objs) => { this.onMeshLoadSuccess(pi, objs) }, null, 
            (scene, message, ex) => { this.onMeshLoadFailure(pi, message); } );
    }

    private onMeshLoadFailure(pathInfo : PathInfo, msg : string)
    {
        console.log(pathInfo.fullPath + " load failed : " + msg);

        this.onLoadCompleted.trigger(new MeshData(pathInfo));
    }

    private onMeshLoadSuccess(pathInfo : PathInfo, objs : AbstractMesh[])
    {
        let data = new MeshData(pathInfo);

        for (let obj of objs)
        {
            let mesh = obj as Mesh;
            mesh.bakeCurrentTransformIntoVertices();
            data.Add(mesh);
        }

        this.cache.set(pathInfo.fullPath, data);
        
        console.log(pathInfo.fullPath + " successfully loaded");

        this.onLoadCompleted.trigger(data);
    }
}
