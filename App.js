///<reference path="libs/threejs/three.d.ts"/>
///<reference path="xShader/XShader.ts"/>
var App = (function () {
    function App() {
        //setup renderer
        var renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        var w = window.innerWidth;
        var h = window.innerHeight;
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000000);
        camera.position.z = 2000;
        document.getElementById("contener").appendChild(renderer.domElement);
        //setup shader----------
        var nbQuad = 10000;
        var shader = new XShader(null);
        shader.materialOptions.side = THREE.DoubleSide;
        shader.materialOptions.depthTest = false;
        shader.setVertexBuffer(XBuffer.createQuadXYZ_Buffer("vertices", nbQuad));
        var centers = shader.setVertexBuffer(XBuffer.createQuadXYZ_Buffer("center", nbQuad));
        shader.setVertexBuffer(XBuffer.createQuadRGBA_Buffer("quadColor", nbQuad, true)).isVarying = true;
        shader.setIndexBuffer(XIndexBuffer.createQuadIndexBuffer(nbQuad));
        var dim = shader.setVertexUniform("quadDimension", new THREE.Vector2(10, 10));
        shader.vertex.define("\n            vec4 pos = vec4(vertices,1.0);\n            pos.xy *= quadDimension;\n            pos.xyz += center;\n            gl_Position = projectionMatrix * modelViewMatrix * pos;\n        ");
        shader.fragment.define("\n            gl_FragColor = quadColor;\n        ");
        //----------------------
        //create mesh
        var mesh = shader.createMesh();
        scene.add(mesh);
        //update the buffer "center" in the shader
        var v = centers.array;
        var i, len = v.length / 12;
        var px, py, pz, j;
        for (i = 0; i < nbQuad; i++) {
            px = -w / 2 + Math.random() * w;
            py = -h / 2 + Math.random() * h;
            pz = -h / 2 + Math.random() * h;
            j = i * 12;
            v[j + 0] += px;
            v[j + 1] += py;
            v[j + 2] += pz;
            v[j + 3] += px;
            v[j + 4] += py;
            v[j + 5] += pz;
            v[j + 6] += px;
            v[j + 7] += py;
            v[j + 8] += pz;
            v[j + 9] += px;
            v[j + 10] += py;
            v[j + 11] += pz;
        }
        centers.updateGeometry();
        //render !
        var a = 0;
        function animate() {
            a += 0.05;
            dim.value.x = 200 + Math.sin(a) * 100;
            dim.value.y = 200 + Math.cos(a * 5) * 100;
            mesh.rotation.x += 0.03;
            mesh.rotation.y += 0.02;
            mesh.rotation.z += 0.01;
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        }
        animate();
    }
    return App;
}());
new App();
