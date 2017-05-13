/**
 * Created by TOM on 04/03/2017.
 */

///<reference path="XShaderModule.ts" />
///<reference path="XIndexBuffer.ts" />

class XShader extends XShaderModule {

    private static _DEFAULT_TEXTURE:THREE.Texture;


    protected index:XIndexBuffer = null;
    protected options:any = {};


    constructor(){
        super();

    }
    public get materialOptions():any{return this.options;}

    public static get DEFAULT_TEXTURE():THREE.Texture{
        if(!XShader._DEFAULT_TEXTURE){
            var canvas:HTMLCanvasElement = document.createElement("canvas");
            canvas.width = canvas.height = 1;
            XShader._DEFAULT_TEXTURE = new THREE.Texture(canvas);
        }
        return XShader._DEFAULT_TEXTURE;
    }


    public createMaterial():THREE.ShaderMaterial{

        var material:THREE.ShaderMaterial = new THREE.ShaderMaterial(this.compile());

        for(var z in this.materialOptions) material[z] = this.materialOptions[z];

        return material;
    }

    public linkToGeometry(g:THREE.BufferGeometry):void{
        var att:XBuffer[] = this.attributes.__elements;
        var i:number,len:number = att.length;
        for(i=0;i<len;i++) att[i].addToGeometry(g);

        if(this.index) this.index.addToGeometry(g);

    }




    public setIndex(indices:number[]|Uint32Array):void{
        if(!this.index){} this.index = new XIndexBuffer(indices);
    }
    public setIndexBuffer(buffer:XIndexBuffer):XIndexBuffer{
        this.index = buffer;
        return buffer;
    }


    //------




}