import { SpotLight, DirectionalLight, PointLight } from "@babylonjs/core";
import { Transform, RenderComponent, LightComponent, CameraComponent } from "../Components/component";
import GameObject from "../GameObjects/gameObject";
import { System } from "./System";

export class GameObjectSystem extends System {

    constructor()
    {
        super();
    }

    public CreateGameObject(transform: Transform) : GameObject {
        let result = new GameObject();
        result.id = this.getUID(36);
        result.transform = transform;

        this.gameObjs[result.id] = result;

        return result;
    }

    public AddGameObject(gameObj :GameObject) : void {
        this.gameObjs[gameObj.id] = gameObj;
    }

    public Initialise() : void {
        super.Initialise();
    }

    public Update() : void
    {
        this.processGameObjects();
        super.Update();
    }

    private getUID(length: number): string {
        return Date.now().toString(length) + Math.random().toString(length).substring(2);
    }

    private processGameObjects(): void {
        for (let obj of this.gameObjs) {
            this.updateComponents(obj[1]);
        }
    }

    private updateComponents(gameObj: GameObject): void {
        for (let cmp of gameObj.components) {
            if (cmp instanceof RenderComponent) {
                this.updateMeshTransforms(gameObj.transform, cmp);
            }

            if (cmp instanceof LightComponent) {
                this.updateLightPosition(gameObj.transform, cmp);
            }

            if (cmp instanceof CameraComponent) {
                this.updateCameraPosition(gameObj.transform, cmp);
            }
        }
    }

    private updateCameraPosition(transform: Transform, cmp: CameraComponent): void {
        cmp.camera.position = transform.position;
    }


    private updateLightPosition(transform: Transform, cmp: LightComponent): void {
        if (cmp.light instanceof SpotLight) {
            cmp.light.position = transform.position;
        }

        if (cmp.light instanceof DirectionalLight) {
            cmp.light.position = transform.position;
        }

        if (cmp.light instanceof PointLight) {
            cmp.light.position = transform.position;
        }
    }

    private updateMeshTransforms(transform: Transform, cmp: RenderComponent): void {
        cmp.mesh.position = transform.position;
        cmp.mesh.rotation = transform.rotation.toEulerAngles();
        cmp.mesh.scaling = transform.scale;
    }
}
