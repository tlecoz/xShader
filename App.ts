

///<reference path="libs/threejs/three.d.ts"/>
///<reference path="xShader/XShader.ts"/>
class App {


    constructor() {

        //setup renderer
        var renderer:THREE.WebGLRenderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth,window.innerHeight);
        var w:number = window.innerWidth;
        var h:number = window.innerHeight;
        var scene:THREE.Scene = new THREE.Scene();
        var camera:THREE.PerspectiveCamera = new THREE.PerspectiveCamera(60,w/h,0.1,1000000);
        camera.position.z = 2000;
        document.getElementById("contener").appendChild(renderer.domElement);


        //setup shader----------
        var nbQuad:number = 10000;
        var shader:XShader = new XShader(null);
        shader.materialOptions.side = THREE.DoubleSide;
        shader.materialOptions.depthTest = false;
        shader.setVertexBuffer(XBuffer.createQuadXYZ_Buffer("vertices",nbQuad));
        var centers:XBuffer = shader.setVertexBuffer(XBuffer.createQuadXYZ_Buffer("center",nbQuad));
        shader.setVertexBuffer(XBuffer.createQuadRGBA_Buffer("quadColor",nbQuad,true)).isVarying = true;
        shader.setIndexBuffer(XIndexBuffer.createQuadIndexBuffer(nbQuad));
        var dim:XElement = shader.setVertexUniform("quadDimension",new THREE.Vector2(10,10));

        shader.vertex.define(`
            vec4 pos = vec4(vertices,1.0);
            pos.xy *= quadDimension;
            pos.xyz += center;
            gl_Position = projectionMatrix * modelViewMatrix * pos;
        `)
        shader.fragment.define(`
            gl_FragColor = quadColor;
        `)
        //----------------------


        //create mesh
        var mesh:THREE.Mesh = shader.createMesh();
        scene.add(mesh);


        //update the buffer "center" in the shader
        var v:Float32Array = centers.array;
        var i:number,len:number = v.length/12;
        var px:number,py:number,pz:number,j:number;
        for(i=0;i<nbQuad;i++){
            px = -w/2 + Math.random()*w;
            py = -h/2 + Math.random()*h;
            pz = -h/2 + Math.random()*h;
            j = i*12;
            v[j+0] += px;
            v[j+1] += py;
            v[j+2] += pz;
            v[j+3] += px;
            v[j+4] += py;
            v[j+5] += pz;
            v[j+6] += px;
            v[j+7] += py;
            v[j+8] += pz;
            v[j+9] += px;
            v[j+10] += py;
            v[j+11] += pz;
        }
        centers.updateGeometry();


        //render !
        var a:number = 0;
        function animate(){
            a+=0.05;
            dim.value.x = 200 + Math.sin(a)*100;
            dim.value.y = 200 + Math.cos(a*5)*100;
            mesh.rotation.x += 0.03;
            mesh.rotation.y += 0.02;
            mesh.rotation.z += 0.01;

            renderer.render(scene,camera);

            requestAnimationFrame(animate)
        }
        animate();
    }

}
new App();