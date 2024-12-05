import { Color3, Color4 } from "@babylonjs/core";

export class Random 
{
    public static GetNumber(min : number, max : number)
    {
        if (min > max) {
            throw new Error('Minimum value should be smaller than maximum value.');
          }

          const range: number = max - min;
          return min + (range * Math.random());
    }


    public static GetColour3() : Color3
    {
        return new Color3(Math.random(), Math.random(), Math.random());
    }

    public static GetColour4() : Color4
    {
        return new Color4(Math.random(), Math.random(), Math.random(), 1.0);
    }
}