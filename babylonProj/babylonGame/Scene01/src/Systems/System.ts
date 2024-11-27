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
    
}