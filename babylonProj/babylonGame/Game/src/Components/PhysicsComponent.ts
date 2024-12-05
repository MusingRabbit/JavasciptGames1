import { Mesh, PhysicsAggregate, PhysicsShape, PhysicsShapeType, TubeBuilder, Vector3 } from "@babylonjs/core";
import { Component } from "./component";
import { GameObject } from "../GameObjects/gameObject";
import { MeshComponent } from "./MeshComponent";

export class PhysicsComponent extends Component
{
    aggregate : PhysicsAggregate;
    shapeType : PhysicsShapeType;
    mass : number;
    restitution : number;
    mesh : Mesh;

    constructor()
    {
        super();

        this.shapeType = PhysicsShapeType.MESH;
    }

    public SetGameObject(gameObject: GameObject): void {
        super.SetGameObject(gameObject);

        let rc = gameObject.GetComponent(MeshComponent);

        if (!rc)
        {
            console.log("game object has no mesh component!");
            return;
        }

        this.mesh = rc.mesh;

        let mass = this.mass;
        let restitution = this.restitution;

        this.aggregate = new PhysicsAggregate(rc.mesh, this.shapeType, { mass, restitution}, rc.mesh.getScene());
    }

    public Update(dt: number): void {
        super.Update(dt);
    }

    public ApplyForce(force : Vector3)
    {
        this.aggregate.body.applyForce(force, this.mesh.absolutePosition);
    }

    public ApplyImpulse(force : Vector3)
    {
        this.aggregate.body.applyImpulse(force, this.mesh.absolutePosition);
    }

    public Disable()
    {
        this.aggregate.body.disablePreStep = true;
    }

    public Enable()
    {
        this.aggregate.body.disablePreStep = false;
    }

}