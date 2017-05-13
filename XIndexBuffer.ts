/**
 * Created by TOM on 04/03/2017.
 */

///<reference path="../libs/threejs/three.d.ts"/>

class XIndexBuffer {

    protected datas:Uint32Array;
    protected bufferAttribute:THREE.BufferAttribute;



    constructor(datas:Uint32Array|number[]=null){
        if(datas){
            this.create(datas);
        }
    }

    public get array():Uint32Array{ return this.datas;}

    public create(datas:Uint32Array|number[]){
        if((datas as any).splice) this.datas = new Uint32Array(datas);
        else this.datas = datas as Uint32Array;
        this.bufferAttribute = new THREE.BufferAttribute(this.datas,1);
    }
    public set(datas:Uint32Array|number[],offset:number=0):void{
        if(!this.bufferAttribute) this.create(datas);
        else {
            this.bufferAttribute.set(datas,offset);
            this.bufferAttribute.needsUpdate = true;
        }
    }

    public addToGeometry(g:THREE.BufferGeometry):void{
        g.setIndex(this.bufferAttribute);
    }



    //-----------------------------

    public static createQuadIndexBuffer(nbQuad:number):XIndexBuffer{
        var i:number,n:number=0;
        var datas:number[] = [];
        for(i=0;i<nbQuad;i++){
            datas.push(n+0,n+1,n+2,n+1,n+3,n+2);
            n += 4;
        }
        return new XIndexBuffer(datas);
    }


    public static createTriangleIndexBuffer(nbTriangle:number):XIndexBuffer{
        var i:number,k:number=0;
        var datas:number[] = [];
        for(i=0;i<nbTriangle;i++){
            datas.push(k++,k++,k++);
        }

        return new XIndexBuffer(datas);
    }

}