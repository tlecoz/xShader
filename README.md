# XShader
A Typescript/javascript library to create modular and object-oriented shaders (for Three.js)

First of all, let's compare how we create shaders in Three.js and how it look like with XShader.

In Three.js :
```javascript
var material:THREE.ShaderMaterial = new THREE.ShaderMaterial( {
    uniforms:{
        time: { type: "f", value: 1.0 },
        resolution: { type: "v2", value: new THREE.Vector2() }
    }
    ,
    vertexShader: `
        uniform float time;
        uniform vec2 resolution;
        void main() {
        gl_Position = vec4( position, 1.0 );
        }`,
    fragmentShader:`
        uniform float time;
        uniform vec2 resolution;
        void main() {
        float x = mod(time + gl_FragCoord.x, 20.) < 10. ? 1. : 0.;
        float y = mod(time + gl_FragCoord.y, 20.) < 10. ? 1. : 0.;
        gl_FragColor = vec4(vec3(min(x, y)), 1.);
        }`
});
```

And now with XShader

```typescript 
class MyShader extends XShader {
    constructor(){
        super();
        this.setFragmentUniform("time",1.0);
        this.setFragmentUniform("resolution",new THREE.Vector2());
        this.vertex.define(` gl_Position = vec4( position, 1.0 );  `);
        this.fragment.define(`
            float x = mod(time + gl_FragCoord.x, 20.) < 10. ? 1. : 0.;
            float y = mod(time + gl_FragCoord.y, 20.) < 10. ? 1. : 0.;
            gl_FragColor = vec4(vec3(min(x, y)), 1.);
        `);
    }
}
```

As you can see, the code is shorter and the definition of the uniforms/buffer disappeared from the glsl code but the difference is not huge in that example.
The differences appears when you consider the whole potential of XShader, what you can do with it and how it will modify the way you work with shaders.

First of all, it's possible to convert automaticly a vertexUniform or a vertexBuffer into a varying without create a new variable-name.
For example, the first real line of my shader could be that

```typescript
this.setVertexUniform("time",1.0).isVarying = true;
```

doing that, you can use the word "time" in the vertex shader and in the fragment shader without doing anything else.
It may sounds like nothing but it's damn confortable to use compared to the need to create a name for the buffer/uniform and another for the varying.

Now, if you want to update the value of the time variable, it could be usefull to keep a reference of that uniform into an object. You can do it like that

```typescript
var timeUniform:XElement =  this.setVertexUniform("time",1.0);
timeUniform.isVarying = true;
timeUniform.value = 123456;
```

Contrary to Three.js that make a bit complex to add an attribute inside a material, it's a common task with XShader.

for example, if I would draw a square from scratch, without a THREE.PlaneGeometry  I could do it like that

```typescript
class MyPlane extends XShader {

    protected vertices:XBuffer;
    protected colorMulti:XElement;
    protected dimension:XElement;
    protected texture:XElement;

    constructor(width:number,height:number){
        super();
        var nbQuad:number = 1;
        this.vertices = this.setVertexBuffer(XBuffer.createQuadXYZ_Buffer("vertices",nbQuad));
        this.setVertexBuffer(XBuffer.createQuadUV_Buffer("uvts",nbQuad)).isVarying = true;
        this.setIndexBuffer(XIndexBuffer.createQuadIndexBuffer(nbQuad));
        this.texture = this.setFragmentUniform("texture",new THREE.TextureLoader().load("myPicture.jpg"));
        this.colorMulti = this.setFragmentUniform("colorMulti",new THREE.Color(0xff0000));
        this.dimension = this.setVertexUniform("dimension",new THREE.Vector2(width,height);

        this.vertex.define(`
            vec4 pos = vec4(vertices.xyz ,1.0);
            pos.xy *= dimension;
            gl_Position = projectionMatrix * modelViewMatrix * pos;
        `);
        this.fragment.define(`
            vec4 color = texture2D(texture,uvts);
            color.rgb *= colorMulti,
            gl_FragColor = color;
        `);
    }
}
```

Now, if you want to update the buffer called vertice, you can do it like that

```typescript
var verts:Float32Array = this.vertices.array;
for(var i:number = 0;i<verts.length;i++) verts[i] = Math.random();
this.vertices.updateGeometry();
```

If I know that the shader I'm writting will be use as "base" for higher-level-shader , I should write it a bit differently :

```typescript
class MyPlane extends XShader {

    protected vertices:XBuffer;
    protected colorMulti:XElement;
    protected texture:XElement;
    protected dimension:XElement;

    constructor(width:number,height:number){
        super();
        var nbQuad:number = 1;

        this.vertices = this.setVertexBuffer(XBuffer.createQuadXYZ_Buffer("vertices",nbQuad));
        this.setVertexBuffer(XBuffer.createQuadUV_Buffer("uvts",nbQuad)).isVarying = true;
        this.setIndexBuffer(XIndexBuffer.createQuadIndexBuffer(nbQuad));
        this.texture = this.setFragmentUniform("texture",new THREE.TextureLoader().load("myPicture.jpg"));
        this.colorMulti = this.setFragmentUniform("colorMulti",new THREE.Color(0xff0000));
        this.dimension = this.setVertexUniform("dimension",new THREE.Vector2(width,height);

        this.vertex.getPosition.define(`
            vec4 pos = vec4(vertices.xyz ,1.0);
        `);
        this.vertex.modifyPosition.define(`
            pos.xy *= dimension;
        `);
        this.vertex.applyPosition.define(`
            gl_Position = projectionMatrix * modelViewMatrix * pos;
        `);

        this.fragment.getColor.define(`
            vec4 color = texture2D(texture,uvts);
        `);
        this.fragment.modifyColor.define(`
            color.rgb *= colorMulti,
        `);
        this.fragment.applyColor.define(`
            gl_FragColor = color;
        `);
    }
}
```
Now it's become possible to create a new shader, a bit different from this one, like that

```typescript
class MyOtherPlane extends MyPlane {
    public mousePosition:XElement;
    constructor(width:number,height:number){
        super(width,height);
        this.mousePosition = this.setVertexUniform("mouse",new THREE.Vector2());
        this.vertex.modifyVertexPosition.addCodeAfter("pos.xy += mouse;");
    }
}
```

Doing that, we add a bunch of code into the object "modifyVertexPosition" after the rest of the code already inside it.

But we could choose a different approach to do the same thing

```typescript
class MyOtherPlane extends MyPlane {
    public mousePosition:XElement;
    protected mouseControl:XShaderCode;
    protected anotherControl:XShaderCode;
    constructor(width:number,height:number){
        super(width,height);
        this.mousePosition = this.setVertexUniform("mouse",new THREE.Vector2());
        this.mouseControl = this.vertex.modifyVertexPosition.createSubShaderCode(`pos.xy += mouse;`);
        this.anotherControl= this.vertex.modifyVertexPosition.createSubShaderCode(`pos.xy *= 123.0;`);
    }
}
```

Doing that, you create a kind of "node" inside the object "modifyVertexPosition" (which is a node too actually).
this node will be read after the content located directly into  "modifyVertexPosition" and before the next node from the root "applyVertexPosition"

Because we created subShaderCode, we can extend that shader to declinate it with another approach :)

```typescript
class MyOtherOtherPlane extends MyOtherPlane {

    constructor(width:number,height:number){
        super(width,height);
        this.anotherControl.enabled = false;
    }
}
```
You can enable / disable every node.
If you disable a node with children in it, the children will be disabled too ; the same if you enable a node.

If for some reason you would like to apply before the mouseControl (located just before in the tree-node) , you could do it like that

```typescript
this.anotherControl.priority = -1
```

By default, each node has a priority set to 0.
The priority works for the children of a same node.

Just before the process convert the tree-node into a string, I sort the children by priority from the smaller to the higher , then if you set priority to -1, the child will be before the other with a priority set to 0.

 

Now we have seen all that, we can start to think differently when we build our shader.
It's now possible to create easyly an object dedicated to some task independantly of the shader

For example, we could create a class that extends nothing

```typescript
class Effects {
    protected effects:XShaderCode[] = [];
    constructor(rootCode:XShaderCode,colorName:string){
        this.effects[0] = rootCode.createSubShaderCode(`$color.rgb *= 1.5;`);
        this.effects[1] = rootCode.createSubShaderCode(`$color.rgb *= 2.5;`);
        this.effects[2] = rootCode.createSubShaderCode(`$color.rgb *= 3.5;`);
        this.effects[3] = rootCode.createSubShaderCode(`$color.rgb *= 4.5;`);
        this.effects[4] = rootCode.createSubShaderCode(`$color.rgb *= 5.5;`);

        for(var i:number=0;i<this.effects.length;i++){
            this.effects[i].replaceVariables([{name:"$color",value:colorName}]);
        }
    }
    public setEffect(id:number):void{
        for(var i:number=0;i<this.effects.length;i++) this.effects[i].enabled = false;
        this.effects[id].enabled = true;
    }
}
```

This code is not very interesting but it shows that you can code a functionality for a shader outside of a shader.

Typically, in that case

```typescript
this.fragment.getFragmentColor.define(`
    vec4 color = texture2D(texture,uvts);
`);
this.fragment.modifyFragmentColor.define(`
    color.rgb  *= colorMulti,
`);
this.fragment.applyFragmentColor.define(`
    gl_FragColor = color;
`);
```

We could use our class Effect like that

```typescript
this.fragment.getFragmentColor.define(`
vec4 color = texture2D(texture,uvts);
`);

var effect:Effect = new Effet(this.fragment.modifyFragmentColor,"color");
effect.setEffect(3);

this.fragment.applyFragmentColor.define(`
gl_FragColor = color;
`);
```

Actually, it's possible to improve a little bit more the way you can work with XShader with the concept of XShaderModule.
Instead of extending shader, you can think your code as small modules that you will plug into your shader.

For example, imagine you want to create a shader with a texture, you will need at least a uniform for the texture, a buffer for the UV and a some lines of GLSL to get the color and apply it to your mesh.
You probably will need this kind of functionnality very often when you'll write a shader.

Instead of creating an extendable "base" shader, you could think it as module.

Let's create a simple module to add a texture in our shader and define its variable-name from the outside

```typescript
class TextureQuadModule extends XShaderModule {
    constructor(nbQuad:number,resultColorName:string="col",textureName:string="texture",uvName:string="uvts",texture:THREE.Texture=XShader.DEFAULT_TEXTURE){
        super();
        this.setFragmentUniform(textureName,texture);
        this.setVertexBuffer(XBuffer.createQuadUV_Buffer(uvName,nbQuad)).isVarying = true;
        this.fragment.getColor.define(`vec4 `+resultColorName+` = texture2D(`+textureName+`,`+uvName+`);`)
    }
}
```

And that's it !
If you want to use it, you just need to add that line to your shader

```typescript
this.setModule(new TextureQuadModule(nbQuad,"textureColor","texture","uvts",new THREE.TextureLoader().load("image.jpg"));
```

During the compile-process, the module are "read" in the order you call them.
For every nodes "getPosition","modifyPosition",applyPosition","getColor","modifyColor","applyColor" , the content of these node in the module will be placed BEFORE the content of the shader nodes.
Then, at the scale of your shader, every variables used in a module is available.

In our module, we created a variable containing the result of the 'texture2D' function. The name of that variable is defined in your shader and can be used in the glsl code of your shader.
Then we can write that to use it

```typescript
this.fragment.applyColor.define("gl_FragColor = textureColor;");
```

Here is another example of very simple module

```typescript
class MouseModule extends XShaderModule {
    
    constructor(isVarying:boolean=false,mouseName:string="mouse"){

        super("MouseModule");

        var mouse = new THREE.Vector4(0,0,0,0);
        this.setVertexUniform("mouseObj",mouse).isVarying = isVarying;
        this.setStructure("Mouse",[
            {name:"position",type:"vec2"},
            {name:"press",type:"float"},
            {name:"wheelSpeed",type:"float"}
        ])

        this.vertex.getPosition.define(`
            $mouse = Mouse(mouseObj.xy,mouseObj.z,mouseObj.w);
        `).replaceVariables([{name:"$mouse",value:mouseName}]);
        
        document.body.onmousedown = function(){
            mouse.z = 1;
        }
        document.body.onmouseup = function () {
            mouse.z = 0;
        }
        document.body.onwheel = function(ev){
            mouse.w += ev.wheelDelta;
        }
        document.body.onmousemove = function(ev){
            mouse.x = ev.clientX - window.innerWidth/2;
            mouse.y = -(ev.clientY - window.innerHeight/2);
        }
    }
}
```

These modules are very basic, but you could use it in various situations.
For example, you could create a sound-spectrum-module or what you want actually

If you use 2 or more modules that use the same buffer or uniform names, the new one will replace the previous but the type of variable cannot be changed.

I 'm pride of  XShader, it's not rocket-science-code but it was long to really know what I wanted to do, how to be efficient while being readable and easy-to-use.

I hope you will like it !

(look at App.ts for a working example)
