import { Quaternion, Vector3 } from "@babylonjs/core";

export class QuaternionHelper
{
    public static QuaternionLookRotation(forward, up) : Quaternion
    {
        forward.normalize();
    
        const vector = forward.clone();
        const vector2 = Vector3.Cross(up, vector).normalize()
        const vector3 = Vector3.Cross(vector, vector2);
        var m00 = vector2.x;
        var m01 = vector2.y;
        var m02 = vector2.z;
        var m10 = vector3.x;
        var m11 = vector3.y;
        var m12 = vector3.z;
        var m20 = vector.x;
        var m21 = vector.y;
        var m22 = vector.z;
    
    
        let num8 = (m00 + m11) + m22;
        var quaternion = new Quaternion();
        if (num8 > 0)
        {
            var num = Math.sqrt(num8 + 1);
            quaternion.w = num * 0.5;
            num = 0.5 / num;
            quaternion.x = (m12 - m21) * num;
            quaternion.y = (m20 - m02) * num;
            quaternion.z = (m01 - m10) * num;
            return quaternion;
        }
        if ((m00 >= m11) && (m00 >= m22))
        {
            var num7 = Math.sqrt(((1 + m00) - m11) - m22);
            var num4 = 0.5 / num7;
            quaternion.x = 0.5 * num7;
            quaternion.y = (m01 + m10) * num4;
            quaternion.z = (m02 + m20) * num4;
            quaternion.w = (m12 - m21) * num4;
            return quaternion;
        }
        if (m11 > m22)
        {
            var num6 = Math.sqrt(((1 + m11) - m00) - m22);
            var num3 = 0.5 / num6;
            quaternion.x = (m10+ m01) * num3;
            quaternion.y = 0.5 * num6;
            quaternion.z = (m21 + m12) * num3;
            quaternion.w = (m20 - m02) * num3;
            return quaternion; 
        }
        var num5 = Math.sqrt(((1 + m22) - m00) - m11);
        var num2 = 0.5 / num5;
        quaternion.x = (m20 + m02) * num2;
        quaternion.y = (m21 + m12) * num2;
        quaternion.z = 0.5 * num5;
        quaternion.w = (m01 - m10) * num2;
        return quaternion;
    }
}