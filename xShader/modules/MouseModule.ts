/**
 * Created by TOM on 08/03/2017.
 */

///<reference path="../XShaderModule.ts"/>

class MouseModule extends XShaderModule {

    protected mouse:THREE.Vector4;

    constructor(isVarying:boolean=false){

        super("MouseModule");

        this.mouse = new THREE.Vector4(0,0,0,0);
        this.setVertexUniform("mouseObj",this.mouse).isVarying = isVarying;
        this.setStructure("Mouse",[
            {name:"position",type:"vec2"},
            {name:"press",type:"float"},
            {name:"wheelSpeed",type:"float"}
        ])

        this.vertex.mainInit.define(`
            mouse = Mouse(mouseObj.xy,mouseObj.z,mouseObj.w);
        `)

        var th:MouseModule = this;
        document.body.onmousedown = function(){
            th.mouse.z = 1;
        }
        document.body.onmouseup = function () {
            th.mouse.z = 0;
        }
        document.body.onwheel = function(ev){
            th.mouse.w += ev.wheelDelta;
        }
        document.body.onmousemove = function(ev){
            th.mouse.x = ev.clientX - window.innerWidth/2;
            th.mouse.y = -(ev.clientY - window.innerHeight/2);
        }

    }

}