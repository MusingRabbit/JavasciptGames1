import { KeyboardEventTypes, KeyboardInfo, MultiPointerScaleBehavior, Observable, PointerEventTypes, PointerInfo, Scene, Vector2 } from "@babylonjs/core";
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

export class KeyboardState
{
    private keyMap : Map<string, boolean>;

    constructor()
    {
        this.keyMap = new Map<string,boolean>();
    }

    public SetKeyDown(key : string)
    {
      this.keyMap.set(key, true);
    }

    public SetKeyUp(key : string)
    {
      this.keyMap.set(key, false);
    }

    public GetKeyDown(key : string) : boolean
    {
        return this.keyMap.has(key) && (this.keyMap.get(key) ?? false);
    }

    public GetKeyUp(key : string) : boolean
    {
        return !this.keyMap.has(key) || !this.keyMap.get(key);
    }

    public Copy() : KeyboardState
    {
      let result = new KeyboardState();

      for (var key in this.keyMap.keys())
      {
        result.keyMap.set(key, this.keyMap.get(key) ?? false);
      }

      return result;
    }
}

export class InputSystem extends System
{
    private scene : Scene;
    private mouseState : MouseState;
    private kbState : KeyboardState;
    private oldKbState : KeyboardState;

    constructor(scene : Scene)
    {
        super();
        this.mouseState = new MouseState();
        this.kbState = new KeyboardState();
        this.oldKbState = new KeyboardState();
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


        this.scene.onKeyboardObservable.add((keyInfo : KeyboardInfo) => {

            switch (keyInfo.type)
            {
              case KeyboardEventTypes.KEYDOWN:
                this.kbState.SetKeyDown(keyInfo.event.key);
                break;
              case KeyboardEventTypes.KEYUP:
                this.kbState.SetKeyUp(keyInfo.event.key);
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

    public GetKeyboardState() : KeyboardState
    {
        return this.kbState.Copy();
    }

    public IsKeyDown(key : string)
    {
        return this.kbState.GetKeyDown(key);
    }

    public IsKeyTapped(key : string)
    {
        let oldKeyDown = this.oldKbState.GetKeyDown(key);
        let keyDown = this.kbState.GetKeyDown(key);

        return oldKeyDown == true && keyDown == false;
    }

    public Update(dt: number): void {
        this.oldKbState = this.kbState.Copy();
        this.mouseState.Reset();
    }
}