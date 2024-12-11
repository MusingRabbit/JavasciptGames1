import { Mesh, PhysicsAggregate, PhysicsBody, PhysicsMotionType, PhysicsShape, PhysicsShapeType, TubeBuilder, Vector3 } from "@babylonjs/core";
import { Component } from "./component";
import { GameObject } from "../GameObjects/gameObject";
import { MeshComponent } from "./MeshComponent";
import { ShapeType } from "@babylonjs/havok";

export class PhysicsComponent extends Component
{
    body : PhysicsBody;
    aggregate : PhysicsAggregate;
    shapeType : PhysicsShapeType;
    motionType : number;
    mass : number;
    restitution : number;
    mesh : Mesh;

    isStatic : boolean;

    constructor(motionType? : PhysicsMotionType, shapeType? : PhysicsShapeType, mass?:number, restitution?: number)
    {
        super();

        if (motionType)
        {
            this.motionType = motionType;
        }
        else 
        {
            this.motionType = PhysicsMotionType.DYNAMIC;
        }


        if (shapeType)
        {
            this.shapeType = shapeType;
        }
        else 
        {
            this.shapeType = PhysicsShapeType.MESH;
        }

        this.mass = mass ?? 1;
        this.restitution = restitution ?? 1;
        
        this.isStatic = (this.motionType == PhysicsMotionType.STATIC);
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


        rc.mesh.checkCollisions = true;
        rc.mesh.isPickable = true;
        
        this.aggregate = new PhysicsAggregate(rc.mesh, this.shapeType, { mass, restitution }, rc.mesh.getScene());

        this.aggregate.body.setMotionType(this.motionType);

        this.body = this.aggregate.body;
        
    }

    public EnableCollisions()
    {
        let rc = this.gameObject.GetComponent(MeshComponent);

        if (rc)
        {
            rc.mesh.checkCollisions = true;
        }
    }

    public DisableCollisions() 
    {
        let rc = this.gameObject.GetComponent(MeshComponent);

        if (rc)
        {
            rc.mesh.checkCollisions = false;
        }
    }

    public Update(dt: number): void {
        super.Update(dt);
    }

    public ApplyForce(force : Vector3)
    {
        if (this.isStatic)
        {
            return;
        }
        
        this.body.applyForce(force, this.mesh.absolutePosition);
    }

    public ApplyImpulse(force : Vector3)
    {
        if (this.isStatic)
        {
            return;
        }

        this.body.applyImpulse(force, this.mesh.absolutePosition);
    }

    public Disable()
    {
        this.body.disablePreStep = true;
    }

    public Enable()
    {
        this.body.disablePreStep = false;
    }

}