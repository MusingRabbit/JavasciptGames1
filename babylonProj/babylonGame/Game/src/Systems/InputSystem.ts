import { MultiPointerScaleBehavior, Observable, PointerEventTypes, PointerInfo, Scene, Vector2 } from "@babylonjs/core";
import { System } from "./System";

export class MouseState
{
    screenPos : Vector2;
    clicked : boolean;
    doubleClicked : boolean;
    down : boolean;
    up : boolean;

    constructor()
    {
        this.Reset();
    }

    public Copy() : MouseState
    {
        let result = new MouseState();
        result.up = this.up;
        result.down = this.down;
        result.clicked = this.clicked;
        result.screenPos = this.screenPos;
        result.doubleClicked = this.clicked;
        return result;
    }

    public Reset() : void 
    {
        this.screenPos = Vector2.Zero();
        this.clicked = false;
        this.doubleClicked = false;
        this.down = false;
        this.up = false;    
    }
}

export class InputSystem extends System
{
    private scene : Scene;
    private mouseState : MouseState;

    constructor(scene : Scene)
    {
        super();
        this.mouseState = new MouseState();
        this.scene = scene;
    }

    public Initialise(reinitialise?: boolean): boolean {

        this.scene.onPointerObservable.add((pointerInfo : PointerInfo) => {
            switch(pointerInfo.type)
            {
                case PointerEventTypes.POINTERDOWN:
                    this.mouseState.down = true;
                    this.mouseState.up = false;
                    break;
                  case PointerEventTypes.POINTERUP:
                    this.mouseState.up = true;
                    this.mouseState.down = false;
                    break;
                  case PointerEventTypes.POINTERMOVE:
                    this.mouseState.screenPos = new Vector2(this.scene.pointerX, this.scene.pointerY);
                    break;
                  case PointerEventTypes.POINTERWHEEL:
                    break;
                  case PointerEventTypes.POINTERPICK:
                    break;
                  case PointerEventTypes.POINTERTAP:
                    this.mouseState.clicked = true;
                    break;
                  case PointerEventTypes.POINTERDOUBLETAP:
                    this.mouseState.doubleClicked = true;
                    break;
            }
        });

        this.initialised = true;
        return this.initialised;
    }

    public GetMouseState() : MouseState
    {
        return this.mouseState.Copy();
    }

    public Update(dt: number): void {
        this.mouseState.Reset();
    }
}