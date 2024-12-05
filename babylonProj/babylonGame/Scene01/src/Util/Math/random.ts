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
}