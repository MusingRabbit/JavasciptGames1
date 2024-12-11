import { ArcRotateCamera, Color3, CubeTexture, Engine, HemisphericLight, Matrix, Quaternion, Sound, Vector3, Vector4 } from "@babylonjs/core";
import { Game } from "../game";
import { LightType, ShapeType } from "../Global";
import { GameObject } from "../GameObjects/gameObject";
import { LightComponent } from "../Components/LightComponent";
import { PlayerAnimator } from "./playerAnim";

export class MotionGame extends Game
{
    player : GameObject;
    playerAnim : PlayerAnimator;
    sceneLight : GameObject;
    camera : ArcRotateCamera;
    music: Sound;

    constructor(engine : Engine)
    {
        super(engine, "./assets/motion/")
    }

    public Load()
    {
        this.dataManager.QueueLoadTextures([
            "wood.jpg",
        ]);

        this.dataManager.QueueLoadMeshes([
            "dummy3.babylon"
        ]);

        super.Load();
    }

    public Initialise(): boolean {
        if (super.Initialise())
        {
            this.music = this.backgroundMusic();

            this.createScene();

            this.isInitialised = true;
            return this.isInitialised;
        }

        return false;
    }

    public Update(dt: number): void {

        this.handleInput(dt);


        super.Update(dt);
    }

    private handleInput(dt : number)
    {
        let vel = new Vector3(0,0,0);

        if (this.inputSys.IsKeyDown('w'))
        {
          vel.z += (2 * dt);
        }

        if (this.inputSys.IsKeyDown('s'))
        {
          vel.z -= (2 * dt);
        }

        if (this.inputSys.IsKeyDown('a'))
        {
          vel.x -= (2 * dt);
        }

        if (this.inputSys.IsKeyDown('d'))
        {
          vel.x += (2 * dt);
        }

        if (this.inputSys.IsKeyDown('m'))
          {
            this.music.isPaused ? this.music.play() : this.music.pause();
          }

        if (!vel.equals(Vector3.Zero()))
        {
          this.playerAnim.Walk();

          let mtxRot : Matrix = Matrix.Identity();
          mtxRot = Matrix.LookAtLH(this.camera.position, Vector3.Zero(), Vector3.Up().normalize());
          let absVel = Vector3.TransformCoordinates(vel, mtxRot.invert());
          absVel = absVel.subtract(this.camera.position);
          absVel.y = 0;
          this.player.transform.Position = this.player.transform.Position.add(absVel);
          let fDir = absVel.multiply(new Vector3(-1,-1,-1)).normalize();
          this.player.transform.Rotation = Quaternion.FromLookDirectionLH(fDir, Vector3.Up());
        }
        else 
        {
          this.playerAnim.Idle();
        }
    }

    private createScene()
    {
        this.createGround();

        let playerMesh = this.dataManager.GetMesh("dummy3.babylon");

        if (!playerMesh)
        {
            console.error("No player mesh could be loaded.");
            return;
        }

        let mesh = playerMesh.objs.get("mixamorig:Skin");

        if (!mesh || !mesh.skeleton)
        {
          console.error("No player mesh/skeleton could be retreived.");
          return;
        }

        this.player = this.objFactory.CreateMeshGameObject(Vector3.Zero(), mesh);
        this.playerAnim = new PlayerAnimator(mesh.skeleton);
        this.setupLighting();
        this.camera = this.createArcRotateCamera();
        this.createSkybox();
    }

    private setupLighting()
    {
        this.sceneLight = this.objFactory.CreateLightGameObject(new Vector3(2,1,0), Color3.White(), LightType.Hemispheric);
        let lc = this.sceneLight.GetComponent(LightComponent);
        let light = lc!.GetLight<HemisphericLight>();
        light.specular = new Color3(1, 0.8, 0.8);
        light.groundColor = new Color3(0, 0.2, 0.7);
    }

    private createGround()
    {
        let txrData = this.dataManager.GetTexture("wood.jpg");
        let ground = this.objFactory.CreateShapeGameObject(Vector3.Zero(), ShapeType.Ground, { name : "gnd", tessalation : 4, txrData : txrData});
        ground.transform.SetSize(15);
    }

    private createSkybox()
    {
      const environmentTexture = new CubeTexture(
        "./assets/motion/textures/industrialSky.env",
        this.scene
      );
      const skybox = this.scene.createDefaultSkybox(
        environmentTexture,
        true,
        10000,
        0.1
      );
  
      return skybox;
    }
  

    private backgroundMusic()
    {
      let music = new Sound("music", "./assets/motion/audio/arcade-kid.mp3", this.scene, null, {loop:true, autoplay:true});
      Engine.audioEngine!.useCustomUnlockedButton = true;
  
      window.addEventListener("click", () => 
        { 
          if (!Engine.audioEngine!.unlocked) 
          {
            Engine.audioEngine!.unlock();
          } 
        }, {once:true});
  
      return music;
    }

    private createArcRotateCamera() {
        let camAlpha = -Math.PI / 2,
          camBeta = Math.PI / 2.5,
          camDist = 10,
          camTarget = new Vector3(0, 0, 0);
    
        let camera = new ArcRotateCamera(
          "camera1",
          camAlpha,
          camBeta,
          camDist,
          camTarget,
          this.scene,
        );
    
        camera.lowerRadiusLimit = 9;
        camera.upperRadiusLimit = 25;
        camera.lowerAlphaLimit = 0;
        camera.upperAlphaLimit = Math.PI * 2;
        camera.lowerBetaLimit = 0;
        camera.upperBetaLimit = Math.PI / 2.02;
    
        camera.attachControl(true);
        return camera;
      }
    
}