/**
 * Created by TOM on 04/03/2017.
 */

///<reference path="XElement.ts"/>

class XBuffer extends XElement {

    protected datas:Float32Array = null;
    protected bufferAttribute:THREE.BufferAttribute;

    constructor(name:string,nbComponent:number,datas:number[]|Float32Array=null,moduleName:string=""){
        super("attribute",name,nbComponent,moduleName);
        if(datas) this.create(datas)
    }

    public get array():Float32Array{ return this.datas;}

    public create(datas:Float32Array|number[]){
        if((datas as any).splice) this.datas = new Float32Array(datas);
        else this.datas = datas as Float32Array;

        this.bufferAttribute = new THREE.BufferAttribute(this.datas,this.value as number);
    }

    public set(datas:Float32Array|number[],offset:number=0):void{
        if(!this.bufferAttribute) this.create(datas);
        else {
            this.bufferAttribute.set(datas,offset);
            this.bufferAttribute.needsUpdate = true;
        }
    }

    public addToGeometry(g:THREE.BufferGeometry):void{
        if(!g.attributes[this.realName]) g.addAttribute(this.realName,this.bufferAttribute);
        else g.attributes[this.realName] = this.bufferAttribute;
        this.bufferAttribute.needsUpdate = true;
    }
    public updateGeometry():void{
        this.bufferAttribute.needsUpdate = true;
    }




    //#############################################################################

    public static createQuadUV_Buffer(name:string,nbQuad:number):XBuffer{
        var i:number;
        var datas:number[] = [];
        for(i=0;i<nbQuad;i++){
            datas.push(0,0);
            datas.push(1,0);
            datas.push(0,1);
            datas.push(1,1);
        }
        return new XBuffer(name,2,datas);
    }

    public static createQuadXY_Buffer(name:string,nbQuad:number):XBuffer{
        var i:number;
        var datas:number[] = [];
        for(i=0;i<nbQuad;i++){
            datas.push(-0.5,-0.5);
            datas.push(+0.5,-0.5);
            datas.push(-0.5,+0.5);
            datas.push(+0.5,+0.5);
        }
        return new XBuffer(name,2,datas);
    }

    public static createQuadXYZ_Buffer(name:string,nbQuad:number):XBuffer{
        var i:number;
        var datas:number[] = [];
        for(i=0;i<nbQuad;i++){
            datas.push(-0.5,-0.5,0.0);
            datas.push(+0.5,-0.5,0.0);
            datas.push(-0.5,+0.5,0.0);
            datas.push(+0.5,+0.5,0.0);
        }
        return new XBuffer(name,3,datas);
    }

    public static createQuadId_Buffer(name:string,nbQuad:number):XBuffer{
        var i:number;
        var datas:number[] = [];
        for(i=0;i<nbQuad;i++){
            datas.push(i,i,i,i);
        }

        return new XBuffer(name,1,datas);
    }

    public static createQuadVertexId_Buffer(name:string,nbQuad:number):XBuffer{
        var i:number;
        var datas:number[] = [];
        for(i=0;i<nbQuad;i++){
            datas.push(0,1,2,3);
        }

        return new XBuffer(name,1,datas);
    }

    public static createQuadRGB_Buffer(name:string,nbQuad:number,randomColor:boolean=false):XBuffer{
        var i:number;
        var datas:number[] = [];

        if(!randomColor) {
            for (i = 0; i < nbQuad; i++) {
                datas.push(1, 1, 1);
                datas.push(1, 1, 1);
                datas.push(1, 1, 1);
                datas.push(1, 1, 1);
            }
        }else{
            var r:number,g:number,b:number;
            for (i = 0; i < nbQuad; i++) {
                r = Math.random();
                g = Math.random();
                b = Math.random();
                datas.push(r, g, b);
                datas.push(r, g, b);
                datas.push(r, g, b);
                datas.push(r, g, b);
            }
        }

        return new XBuffer(name,3,datas);
    }
    public static createQuadRGBA_Buffer(name:string,nbQuad:number,randomColor:boolean=false):XBuffer{
        var i:number;
        var datas:number[] = [];
        if(!randomColor) {
            for (i = 0; i < nbQuad; i++) {
                datas.push(1, 1, 1, 1);
                datas.push(1, 1, 1, 1);
                datas.push(1, 1, 1, 1);
                datas.push(1, 1, 1, 1);
            }
        }else{
            var r:number,g:number,b:number,a:number;
            for (i = 0; i < nbQuad; i++) {
                r = Math.random();
                g = Math.random();
                b = Math.random();
                a = Math.random();
                datas.push(r, g, b, a);
                datas.push(r, g, b, a);
                datas.push(r, g, b, a);
                datas.push(r, g, b, a);
            }
        }
        return new XBuffer(name,3,datas);
    }

    //-----------------------------
    public static createTriangleVec4Buffer(name:string,nbTriangle:number):XBuffer{
        var i:number,j:number;
        var datas:number[] = [];
        for(i=0;i<nbTriangle;i++){
            datas.push(0,0,0,0);
            datas.push(0,0,0,0);
            datas.push(0,0,0,0);
        }
        return new XBuffer(name,4,datas);
    }
    public static createTriangleVec3Buffer(name:string,nbTriangle:number):XBuffer{
        var i:number,j:number;
        var datas:number[] = [];
        for(i=0;i<nbTriangle;i++){
            datas.push(0,0,0);
            datas.push(0,0,0);
            datas.push(0,0,0);
        }
        return new XBuffer(name,3,datas);
    }
}