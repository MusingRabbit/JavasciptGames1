import { HavokPlugin, PhysicsShapeSphere, Scene, ShapeCastResult, Vector3 } from "@babylonjs/core";
import { GameObject } from "../GameObjects/gameObject";
import { System } from "./System";
import("@babylonjs/core/Physics/physicsEngineComponent")
import HavokPhysics, { HavokPhysicsWithBindings } from "@babylonjs/havok";
import { LiteEvent } from "../Event/LiteEvent";
import { PhysicsAttractor } from "../Components/PhysicsAttractor";
import { PhysicsComponent } from "../Components/PhysicsComponent";
import { MeshComponent } from "../Components/MeshComponent";
import * as d3 from "d3-octree";


class nodeData 
{
    x : number;
    y : number;
    z : number;
    data : GameObject;

    public static X(d) : number{
        return d.x;
    }

    public static Y(d) : number{
        return d.y;
    }

    public static Z(d) : number{
        return d.z;
    }
}

export class PhysicsSystem extends System
{
    private scene : Scene;
    private havokInstance : HavokPhysicsWithBindings;
    private havokPlugin : HavokPlugin;

    private nodes : nodeData[];

    private readonly onInitialised = new LiteEvent();

    public get OnInitialised() { return this.onInitialised.expose(); }


    constructor(scene : Scene)
    {
        super();
        this.scene = scene;
    }

    private async getInitializedHavok() : Promise<HavokPhysicsWithBindings> {
        return await HavokPhysics();
      }

    public Initialise(reinitialise : boolean = false) : boolean
    {
        if (super.Initialise(reinitialise))
        {
        
            this.initialised = false;
            this.initialising = true;

            HavokPhysics().then((x) => 
            { 
                try 
                {
                    this.havokInstance = x ; 
                    this.havokPlugin = new HavokPlugin(true, this.havokInstance); 
                    this.Enable();
                    this.onInitialised.trigger();
                }
                catch(ex)
                {
                    console.log(ex);
                }

                this.initialised = true;
                this.initialising = false;
            });

            return true;
        }

        return this.initialised;
    }

    public Enable()
    {
        this.scene.enablePhysics(new Vector3(0, 0, 0), this.havokPlugin);
    }

    public Update(dt: number): void {
        super.Update(dt);

        let octree = this.createOctTree(this.gameObjs);

        for(let gObj of this.gameObjs.values())
        {
            let meshCmp = gObj.GetComponent(MeshComponent);
            let attractor = gObj.GetComponent(PhysicsAttractor);
            let physCmp = gObj.GetComponent(PhysicsComponent);

            if (!attractor || !physCmp || !meshCmp)
            {
                continue;
            }

            if (attractor.radius == 0 || attractor.strength == 0)
            {
                continue;
            }

            let physSphere = new PhysicsShapeSphere(gObj.transform.Position, attractor.radius, this.scene);
            let bb = physSphere.getBoundingBox();

            let results = this.searchOctTree(octree, bb.minimum, bb.maximum);

            for (let node of results)
            {
                let rhsGameObj = node.data;
                let rhsPhysCmp = rhsGameObj.GetComponent(PhysicsComponent);

                if (!rhsPhysCmp)
                {
                    continue;
                }

                let direction = rhsGameObj.transform.Position.subtract(gObj.transform.Position).normalize();
                let velocity = direction.multiply(new Vector3(attractor.strength, attractor.strength, attractor.strength));
                rhsPhysCmp.ApplyForce(velocity);
            }
        }
    }

    private searchOctTree(octree : any, min :Vector3, max :Vector3) : nodeData[]
    {
        let results : nodeData[];

        results = [];

        octree.visit(function(node, x1, y1, z1, x2, y2, z2) {
          if (!node.length) {
            do {
              const d = node.data;
              if (d[0] >= min.x && d[0] < max.x && d[1] >= min.y && d[1] < max.y && d[2] >= min.z && d[2] < max.z) {
                results.push(d);
              }
            } while (node = node.next);
          }
          return x1 >= max.x || y1 >= max.y || z1 >= max.z || x2 < min.x || y2 < min.y || z2 < min.z;
        });

        return results;
    }

    private createOctTree(gameObjs : Map<string, GameObject>)
    {
        this.nodes = [];

        for(let obj of gameObjs.values())
        {
            let data = new nodeData();
            data.x = obj.transform.Position.x;
            data.y = obj.transform.Position.y;
            data.z = obj.transform.Position.z;
            data.data = obj;

            this.nodes.push(data);
        }
        

        let t = d3.octree();
        t.x(nodeData.X);
        t.x(nodeData.Y);
        t.x(nodeData.Z);

        for (let node of this.nodes)
        {
            t.add(node);
        }

        return t;
    }

    public AddGameObject(gameObj: GameObject): boolean {
        let result = super.AddGameObject(gameObj);

        return result;
    }

    private getQuerySphere(centre : Vector3, radius : number){
        let result = new PhysicsShapeSphere(centre, radius, this.scene);
        
        return result;
    }
}