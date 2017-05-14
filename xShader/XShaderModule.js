///<reference path="XVertex.ts" />
///<reference path="XFragment.ts" />
var XShaderModule = (function () {
    function XShaderModule(name) {
        if (name === void 0) { name = null; }
        this.enabled = true;
        //the name of the module is used in order to debug override
        if (name)
            this.name = name;
        else
            this.name = "module_" + XShaderModule.moduleId;
        XShaderModule.moduleId++;
        this.vertex = new XVertex();
        this.fragment = new XFragment();
        this.modules = [];
        this.structNames = [];
        this.structByName = [];
    }
    XShaderModule.prototype.update = function () {
        //must be overrided
    };
    XShaderModule.prototype.setVarying = function (name, dataType) {
        /*
        there is 3 ways to use "dataType" :
        - either you put 1,2,3,4,5,6 in order to create a float,vec2,vec3,vec4, mat3, mat4
        - either you use the static constants
           XElement.FLOAT , XElement.VEC2 , XElement.VEC4 , XElement.VEC4
           XElement.MAT3 , XElement.MAT4

        - either, if you want to set an array as varying, you can pass a THREE.Vector2 written like that

        THREE.Vector2( C , arrayLength );

        where C equals a XElement constant, for example THREE.Vector2(XElement.VEC2,3);

        */
        this.vertex.varyings.push(new XElement("varying", name, dataType, this.name));
    };
    XShaderModule.prototype.setVertexBuffer = function (buffer) {
        this.vertex.attributes.push(buffer);
        buffer.moduleName = this.name;
        return buffer;
    };
    XShaderModule.prototype.setVertexAttribute = function (name, nbComponent, datas) {
        if (datas === void 0) { datas = null; }
        return this.vertex.setAttribute(name, nbComponent, datas, this.name);
    };
    XShaderModule.prototype.setVertexUniform = function (name, value) {
        var e = new XElement("uniform", name, value, this.name);
        this.vertex.uniforms.push(e);
        return e;
    };
    XShaderModule.prototype.setFragmentUniform = function (name, value) {
        var e = new XElement("uniform", name, value, this.name);
        this.fragment.uniforms.push(e);
        return e;
    };
    XShaderModule.prototype.setVertexConstant = function (name, value) {
        var e = new XElement("const", name, value, this.name);
        this.vertex.constants.push(e);
        return e;
    };
    XShaderModule.prototype.setFragmentConstant = function (name, value) {
        var e = new XElement("const", name, value, this.name);
        this.fragment.constants.push(e);
        return e;
    };
    XShaderModule.prototype.setModule = function (module) {
        //console.log("setModule "+this.modules.lastIndexOf(module));
        if (this.modules.lastIndexOf(module) == -1) {
            //console.log("pushModule");
            this.modules.push(module);
        }
        return module;
    };
    XShaderModule.prototype.setStructure = function (name, structure) {
        //console.info("The structure '"+name+"' already exist and will be replaced by the new one.")
        if (this.structNames.lastIndexOf(name) == -1)
            this.structNames.push(name);
        this.structByName[name] = new XStruct(name, structure, this.name);
    };
    //==========================
    XShaderModule.prototype.compile = function () {
        var i, len = this.modules.length;
        for (i = 0; i < len; i++) {
            this.modules[i].vertex.disableVaryings = true;
            this.modules[i].compile();
        }
        var structInfos = this.blendStructures();
        this.attributes = this.blendAttributes();
        this.uniforms = this.blendUniforms();
        this.blendVaryings();
        this.blendCode();
        var vs = this.vertex.glsl;
        var fs = this.fragment.glsl;
        vs = XStruct.findStructInstancesAndGetDefinition(vs, structInfos.structNames, structInfos.structByName) + vs;
        fs = XStruct.findStructInstancesAndGetDefinition(fs, structInfos.structNames, structInfos.structByName) + fs;
        return {
            vertexShader: vs,
            fragmentShader: fs,
            uniforms: this.uniforms,
        };
    };
    XShaderModule.prototype.blendCode = function () {
        var i, len = this.modules.length;
        for (i = len - 1; i > -1; i--) {
            this.vertex.getPosition.addCodeBefore(this.modules[i].vertex.getPosition.glsl);
            this.vertex.modifyPosition.addCodeBefore(this.modules[i].vertex.modifyPosition.glsl);
            this.vertex.applyPosition.addCodeBefore(this.modules[i].vertex.applyPosition.glsl);
            this.fragment.getColor.addCodeBefore(this.modules[i].fragment.getColor.glsl);
            this.fragment.modifyColor.addCodeBefore(this.modules[i].fragment.modifyColor.glsl);
            this.fragment.applyColor.addCodeBefore(this.modules[i].fragment.applyColor.glsl);
        }
    };
    XShaderModule.prototype.blendStructures = function () {
        var result = {};
        var structNames = [];
        var structByName = [];
        this.modules.unshift(this);
        var i, len = this.modules.length;
        var j, nb, names, structs, name;
        for (i = 0; i < len; i++) {
            if (this.modules[i].enabled == false)
                continue;
            names = this.modules[i].structNames;
            structs = this.modules[i].structByName;
            nb = names.length;
            for (j = 0; j < nb; j++) {
                name = names[j];
                if (structNames.lastIndexOf(name) == -1) {
                    structNames.push(name);
                    structByName[name] = structs[name];
                }
                else {
                    console.warn("The structure '" + name + "' is already defined in the module '" + structByName[name].moduleName + "' . It will be replaced by the one located in the module '" + structs[name].moduleName + "'.");
                    structByName[name] = structs[name];
                }
            }
        }
        this.modules.shift();
        result.structNames = structNames;
        result.structByName = structByName;
        return result;
    };
    XShaderModule.prototype.blendVaryings = function () {
        var o = {};
        //this.modules.push(this);
        var i, len;
        var j, nb;
        var module;
        var t, e;
        var names;
        var values;
        t = this.uniforms.__elements;
        len = t.length;
        for (i = 0; i < len; i++)
            if (t[i].isVarying)
                this.vertex.setVarying(t[i].name, t[i].nbCompo, t[i].moduleName);
        t = this.attributes.__elements;
        len = t.length;
        for (i = 0; i < len; i++) {
            console.log("attributes : " + t[i].name, t[i].isVarying, t[i].nbCompo);
            if (t[i].isVarying)
                this.vertex.setVarying(t[i].name, t[i].nbCompo, t[i].moduleName);
        }
        len = this.modules.length;
        for (i = 0; i < len; i++) {
            if (this.modules[i].enabled == false)
                continue;
            module = this.modules[i];
            t = module.vertex.varyings;
            nb = t.length;
            names = [];
            values = [];
            for (j = 0; j < nb; j++) {
                e = t[j];
                if (e.enabled) {
                    console.log("add varying -> " + e.realName);
                    if (!o[e.realName]) {
                        o[e.realName] = e;
                    }
                    else {
                        var name = e.realName;
                        //while(o[e.realName]) e.getOtherName();
                        names.push(name);
                        values.push(e.realName);
                    }
                }
            }
            module.vertex.main.modify(names, values);
            module.fragment.main.modify(names, values);
        }
        //this.modules.pop();
        this.fragment.setVaryingFromVertex(this.vertex.varyings);
        return o;
    };
    XShaderModule.prototype.blendAttributes = function () {
        var o = {};
        this.modules.push(this);
        var i, len = this.modules.length;
        console.log("nbModule = " + len);
        var j, nb;
        var module;
        var t, e;
        var elements = [];
        for (i = 0; i < len; i++) {
            module = this.modules[i];
            if (this.modules[i].enabled == false)
                continue;
            t = module.vertex.attributes;
            nb = t.length;
            for (j = 0; j < nb; j++) {
                e = t[j];
                if (e.enabled) {
                    if (!o[e.realName]) {
                        o[e.realName] = e;
                        elements.push(e);
                    }
                    else {
                        if (e.array) {
                            o[e.realName].create(e.array);
                            o[e.realName] = e;
                        }
                        else {
                            e.create(o[e.realName].array);
                        }
                    }
                }
            }
        }
        this.modules.pop();
        o.__elements = elements;
        var i, len = elements.length;
        for (i = 0; i < len; i++) {
            //////////console.log(elements[i].moduleName+" != "+this.name);
            if (elements[i].moduleName != this.name) {
                this.setVertexBuffer(elements[i]);
            }
        }
        return o;
    };
    XShaderModule.prototype.blendUniforms = function () {
        this.modules.push(this);
        var vElements = [];
        var fElements = [];
        var result = {};
        var t = this.vertex.uniforms;
        var i, len = t.length;
        var e;
        var names = [];
        var values = [];
        var j, nb = this.modules.length;
        var module;
        for (j = 0; j < nb; j++) {
            if (this.modules[j].enabled == false)
                continue;
            module = this.modules[j];
            t = module.vertex.uniforms;
            len = t.length;
            for (i = 0; i < len; i++) {
                e = t[i];
                if (e.enabled) {
                    if (!result[e.realName]) {
                        result[e.realName] = e;
                        vElements.push(e);
                    }
                    else if (e.override)
                        result[e.realName] = e;
                    else {
                        while (result[e.realName] != undefined)
                            e.getOtherName();
                        result[e.realName] = e;
                        vElements.push(e);
                    }
                }
            }
            t = module.fragment.uniforms;
            len = t.length;
            for (i = 0; i < len; i++) {
                e = t[i];
                console.log("uniform name = " + e.name);
                if (e.enabled) {
                    if (!result[e.realName]) {
                        result[e.realName] = e;
                        fElements.push(e);
                    }
                    else if (e.override)
                        result[e.realName] = e;
                    else {
                        while (result[e.realName] != undefined)
                            e.getOtherName();
                        result[e.realName] = e;
                        fElements.push(e);
                    }
                }
            }
            t = module.vertex.constants;
            len = t.length;
            var name;
            names = [];
            values = [];
            for (i = 0; i < len; i++) {
                e = t[i];
                name = e.realName;
                while (result[name] != undefined)
                    e.getOtherName();
                names.push(name);
                values.push(e.realName);
            }
            module.vertex.main.modify(names, values);
            t = module.fragment.constants;
            len = t.length;
            names = [];
            values = [];
            for (i = 0; i < len; i++) {
                e = t[i];
                name = e.realName;
                while (result[name] != undefined)
                    e.getOtherName();
                names.push(name);
                values.push(e.realName);
            }
            module.fragment.main.modify(names, values);
        }
        this.modules.pop();
        result.__elements = vElements;
        var i, len = vElements.length;
        for (i = 0; i < len; i++) {
            if (vElements[i].moduleName != this.name) {
                this.setVertexUniform(vElements[i].name, vElements[i].value);
            }
        }
        len = fElements.length;
        for (i = 0; i < len; i++) {
            if (fElements[i].moduleName != this.name) {
                this.setFragmentUniform(fElements[i].name, fElements[i].value);
            }
        }
        return result;
    };
    XShaderModule.moduleId = 0;
    return XShaderModule;
}());
