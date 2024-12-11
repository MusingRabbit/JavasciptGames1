import { AnimationPropertiesOverride, AnimationRange, Nullable, Scene, Skeleton } from "@babylonjs/core";

export class PlayerAnimator 
{
    private scene : Scene;
    private skeleton : Skeleton;
    private currAnim : string;

    private walkRange : Nullable<AnimationRange>;
    private runRange : Nullable<AnimationRange>;
    private leftRange : Nullable<AnimationRange>;
    private rightRange : Nullable<AnimationRange>;
    private idleRange : Nullable<AnimationRange>;

    private isAnimating : boolean;

    constructor(skeleton : Skeleton)
    {
        this.skeleton = skeleton;
        this.skeleton.animationPropertiesOverride = new AnimationPropertiesOverride();
        this.skeleton.animationPropertiesOverride.enableBlending = true;
        this.skeleton.animationPropertiesOverride.blendingSpeed = 0.05;
        this.skeleton.animationPropertiesOverride.loopMode = 1;
     
        this.walkRange = this.skeleton.getAnimationRange("YBot_Walk");
        this.runRange = this.skeleton.getAnimationRange("YBot_Run");
        this.leftRange = this.skeleton.getAnimationRange("YBot_LeftStrafeWalk");
        this.rightRange = this.skeleton.getAnimationRange("YBot_RightStrafeWalk");
        this.idleRange = this.skeleton.getAnimationRange("YBot_Idle");

        this.scene = this.skeleton.getScene();
    }

    public Walk(){
        if (!this.isAnimating || this.currAnim != "walk")
        {
            this.scene.beginAnimation(this.skeleton, this.walkRange!.from, this.walkRange!.to, true);
            this.isAnimating = true;
            this.currAnim = "walk";
        }
      }
      
      public Run()
      {
        if (!this.isAnimating || this.currAnim != "run")
            {
                this.scene.beginAnimation(this.skeleton, this.runRange!.from, this.runRange!.to, true);
                this.isAnimating = true;
                this.currAnim = "run";
            }
      }
      
      public Left(){
        if (!this.isAnimating || this.currAnim != "left")
        {
            this.scene.beginAnimation(this.skeleton, this.leftRange!.from, this.leftRange!.to, true);
            this.isAnimating = true;
            this.currAnim = "left";
        }
      }
      
      public Right(){
        if (!this.isAnimating || this.currAnim != "right")
        {
            this.scene.beginAnimation(this.skeleton, this.rightRange!.from, this.rightRange!.to, true);
            this.isAnimating = true;
            this.currAnim = "right";
        }
      }
      
      public Idle(){
        if (!this.isAnimating || this.currAnim != "idle")
        {
            this.scene.beginAnimation(this.skeleton, this.idleRange!.from, this.idleRange!.to, true);
            this.isAnimating = true;
            this.currAnim = "idle";
        }
      }
      
      public StopAnimation(){
        this.scene.stopAnimation(this.skeleton);
        this.isAnimating = false;
      }
}