import { GameObject } from "../GameObjects/gameObject";

export class System 
{
    gameObjs : Map<string, GameObject>;
    initialised : boolean;
    initialising : boolean;

    constructor()
    {
        this.gameObjs = new Map<string, GameObject>();
        this.initialised = false;
        this.initialising = false;
    }

    public Initialise(reinitialise : boolean = false) : boolean 
    {
        return reinitialise || this.canInitialise();
    }

    public Clear()
    {
        this.gameObjs.clear();
    }

    private canInitialise()
    {
        if (this.initialised || this.initialising)
        {
            return false;
        }

        return true;
    }
    
    public Update(dt : number) : void
    {
    }

    public isReady()
    {
        return this.initialising == false && this.initialised == true;
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
