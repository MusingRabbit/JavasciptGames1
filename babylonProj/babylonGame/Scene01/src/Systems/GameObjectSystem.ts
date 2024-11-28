import { SpotLight, DirectionalLight, PointLight, Vector3, Matrix } from "@babylonjs/core";
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

        this.gameObjs.set(result.id, result);

        return result;
    }

    public AddGameObject(gameObj : GameObject) : void {
        this.gameObjs.set(gameObj.id, gameObj);
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
        for (let obj of this.gameObjs.values()) {
            this.updateComponents(obj);
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
        let mtxRot = new Matrix();
        transform.rotation.toRotationMatrix(mtxRot)
        let dir = Vector3.TransformCoordinates(transform.position, mtxRot);

        if (cmp.light instanceof SpotLight) {
            cmp.light.position = transform.position;
            cmp.light.direction = dir;
        }

        if (cmp.light instanceof DirectionalLight) {
            cmp.light.position = transform.position;
            cmp.light.direction = dir;
        }

        if (cmp.light instanceof PointLight) {
            cmp.light.position = transform.position;
            cmp.light.direction = dir;
        }
    }

    private updateMeshTransforms(transform: Transform, cmp: RenderComponent): void {
        cmp.mesh.position = transform.position;
        cmp.mesh.rotationQuaternion = transform.rotation;
        cmp.mesh.scaling = transform.scale;
    }
}
