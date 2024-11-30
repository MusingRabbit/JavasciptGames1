export class PathInfo
{
    name : string;
    path : string;
    fileName : string;
    fullPath : string;
    ext : string;

    constructor(filePath : string, fileName : string)
    {
        this.name = fileName;
        this.path = filePath;

        let tokens = fileName.split('.');

        if (tokens.length > 1)
        {
            this.ext = tokens[1];
        }

        this.name = tokens[0];
        this.fileName = fileName;
        this.fullPath = this.path + this.name + (this.ext != "" ? "." + this.ext : "");
    }
}


export class FileHelper
{
    public static GetPathInfo(filePath : string) : PathInfo
    {
        let pathTokens = filePath.split('/');
        let path = "";
    
        for(var i = 0; i < pathTokens.length - 1; i++)
        {
            path += pathTokens[i] + "/";
        }
    
        let fileName = pathTokens[pathTokens.length - 1];
    
        return new PathInfo(path, fileName);
    }
}

