import { SpotLight, DirectionalLight, PointLight, Vector3, Matrix, Mesh, Material } from "@babylonjs/core";

import { System } from "./System";
import { LiteEvent } from "../Event/LiteEvent";
import { Transform } from "../Components/Transform";
import { GameObject } from "../GameObjects/gameObject";
import { RenderComponent } from "../Components/RenderComponent";
import { CameraComponent } from "../Components/CameraComponent";
import { LightComponent } from "../Components/LightComponent";

export class GameObjectSystem extends System {
    constructor()
    {
        super();
    }

    public Initialise() : void {
        super.Initialise();
    }

    public Update(dt : number) : void
    {
        this.processGameObjects(dt);
        super.Update(dt);
    }
    
    private processGameObjects(dt : number): void {
        for (let obj of this.gameObjs.values()) {
            this.updateComponents(dt, obj);
        }
    }

    private updateComponents(dt : number, gameObj: GameObject): void {
        for (let cmp of gameObj.components) {
            if (cmp instanceof RenderComponent) {
                this.updateMeshTransforms(gameObj.GetWorldTransform(), cmp);
                this.updateMaterialSettings(cmp);
            }

            //if (cmp instanceof LightComponent) {
            //    this.updateLightPosition(gameObj.GetWorldTransform(), cmp);
            //}

            //if (cmp instanceof CameraComponent) {
            //    this.updateCameraPosition(gameObj.GetWorldTransform(), cmp);
            //}


            cmp.Update(dt);
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

    private updateMaterialSettings(cmp : RenderComponent) : void {
    }
}   