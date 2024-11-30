import GameObject from "../GameObjects/gameObject";

export class System 
{
    gameObjs : Map<string, GameObject>;

    constructor()
    {
        this.gameObjs = new Map<string, GameObject>();
    }

    public Initialise() : void 
    {
    }
    
    public Update() : void
    {
    }

    public AddGameObject(gameObj : GameObject) : boolean
    {
        if (this.gameObjs.has(gameObj.id))
        {
            return false;
        }

        this.gameObjs.set(gameObj.id, gameObj);
        return true;
    }
    
}