import { SpotLight, DirectionalLight, PointLight, Vector3, Matrix, Mesh, Material } from "@babylonjs/core";

import { System } from "./System";
import { LiteEvent } from "../Event/LiteEvent";
import { Transform } from "../Components/Transform";
import { GameObject } from "../GameObjects/gameObject";
import { MeshComponent } from "../Components/MeshComponent";
import { CameraComponent } from "../Components/CameraComponent";
import { LightComponent } from "../Components/LightComponent";
import { PhysicsComponent } from "../Components/PhysicsComponent";

export class GameObjectSystem extends System {
    constructor()
    {
        super();
    }

    public Initialise(reinitialise : boolean = false) : boolean {
        if (super.Initialise(reinitialise))
        {
            this.initialised = true;
        }

        return this.initialised;
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
        let meshCmp = gameObj.GetComponent(MeshComponent);
        let physCmp = gameObj.GetComponent(PhysicsComponent);

        if (meshCmp)
        {
            if (physCmp)    // Physics system is in charge of game object
            {
                if (gameObj.transform.isDirty) // Only update mesh if the transform has been set elsewhere...
                {
                    physCmp.Disable();
                    this.updateMeshTransforms(gameObj.GetWorldTransform(), meshCmp);
                    physCmp.Enable();
                }
                else    // Update the game objects transform with the updated mesh position & rotation...
                {
                    gameObj.transform.Position = meshCmp.mesh.position;
                    gameObj.transform.Rotation = meshCmp.mesh.rotationQuaternion ?? gameObj.transform.Rotation;
                    gameObj.transform.isDirty = false;
                }
            }
            else        // Update mesh
            {
                this.updateMeshTransforms(gameObj.GetWorldTransform(), meshCmp);
            }

            this.updateMaterialSettings(meshCmp);
        }


        for (let cmp of gameObj.components) {
            if (cmp instanceof MeshComponent) {
 
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
        cmp.camera.position = transform.Position;
    }


    private updateLightPosition(transform: Transform, cmp: LightComponent): void {
        let mtxRot = new Matrix();
        transform.Rotation.toRotationMatrix(mtxRot)
        let dir = Vector3.TransformCoordinates(transform.Position, mtxRot);

        if (cmp.light instanceof SpotLight) {
            cmp.light.position = transform.Position;
            cmp.light.direction = dir;
        }

        if (cmp.light instanceof DirectionalLight) {
            cmp.light.position = transform.Position;
            cmp.light.direction = dir;
        }

        if (cmp.light instanceof PointLight) {
            cmp.light.position = transform.Position;
            cmp.light.direction = dir;
        }
    }

    private updateMeshTransforms(transform: Transform, cmp: MeshComponent): void {
        cmp.mesh.position = transform.Position;
        cmp.mesh.rotationQuaternion = transform.Rotation;
        cmp.mesh.scaling = transform.Scale;
    }

    private updateMaterialSettings(cmp : MeshComponent) : void {
    }
}   