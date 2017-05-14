///<reference path="../libs/threejs/three.d.ts"/>
var XElement = (function () {
    function XElement(dataType, name, value, moduleName) {
        this.override = false;
        this.enabled = true;
        this._isVarying = false;
        this._useOtherName = false;
        this._name = this._realName = name;
        this.moduleName = moduleName;
        this.value = value;
        this.dataType = dataType;
        this.isArray = false;
        if (value.push) {
            this.isArray = true;
            this.arrayLen = value.length;
            value = value[0];
        }
        switch (true) {
            case value instanceof THREE.CubeTexture:
                this.type = "t";
                this.glType = "samplerCube";
                break;
            case value instanceof THREE.Matrix3:
                this.type = "m3";
                this.glType = "mat3";
                break;
            case value instanceof THREE.Matrix4:
                this.type = "m4";
                this.glType = "mat4";
                break;
            case value instanceof THREE.Color:
                this.type = "c";
                this.glType = "vec3";
                break;
            case value instanceof THREE.Texture:
                this.type = "t";
                this.glType = "sampler2D";
                break;
            case value instanceof THREE.Vector2:
                this.type = "v2";
                this.glType = "vec2";
                break;
            case value instanceof THREE.Vector3:
                this.type = "v3";
                this.glType = "vec3";
                break;
            case value instanceof THREE.Vector4:
                this.type = "v4";
                this.glType = "vec4";
                break;
            case !isNaN(value):
            default:
                this.type = "f";
                this.glType = "float";
                break;
        }
        if (this.isArray)
            this.type += "v";
        if (this.dataType == "attribute" || this.dataType == "varying") {
            if (this.value == 1)
                this.glType = "float";
            else
                this.glType = "vec" + this.value;
        }
        else if (this.dataType == "varying") {
            var len = 0;
            var type = 0;
            var gltype = "";
            if (this.value instanceof THREE.Vector2) {
                type = this.value.x;
                this.isArray = true;
                this.arrayLen = this.value.y;
            }
            else {
                type = this.value;
            }
            switch (type) {
                case 1:
                    gltype = "float";
                    break;
                case 2:
                    gltype = "vec2";
                    break;
                case 3:
                    gltype = "vec3";
                    break;
                case 4:
                    gltype = "vec4";
                    break;
                case 5:
                    gltype = "mat3";
                    break;
                case 6:
                    gltype = "mat4";
                    break;
            }
        }
    }
    Object.defineProperty(XElement.prototype, "name", {
        get: function () { return this._name; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XElement.prototype, "realName", {
        get: function () { return this._realName; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(XElement.prototype, "initElementName", {
        get: function () {
            //console.log("initElementName = "+this._name);
            if (this._isVarying)
                return this._name + " = " + this._realName + ";\n";
            if (this._useOtherName)
                return this.glType + " " + this._name + " = " + this._realName + ";\n";
            return "";
        },
        enumerable: true,
        configurable: true
    });
    XElement.prototype.getOtherName = function () {
        //console.info("the _name '"+this.realName+"' is already used ; it will be replaced by '"+this._realName+"_"+(XElement.countName)+"'");
        this._realName = this._realName + "_" + (XElement.countName++) + "_";
    };
    Object.defineProperty(XElement.prototype, "nbCompo", {
        get: function () { return this._nbCompo; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XElement.prototype, "isVarying", {
        get: function () { return this._isVarying; },
        set: function (b) {
            if (b)
                this._realName = this._name + "_V";
            else
                this._realName = this._name;
            this._isVarying = b;
            switch (this.glType) {
                case "float":
                    this._nbCompo = 1;
                    break;
                case "vec2":
                    this._nbCompo = 2;
                    break;
                case "vec3":
                    this._nbCompo = 3;
                    break;
                case "vec4":
                    this._nbCompo = 4;
                    break;
                case "mat3":
                    this._nbCompo = 5;
                    break;
                case "mat4":
                    this._nbCompo = 6;
                    break;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XElement.prototype, "glsl", {
        get: function () {
            var arrayInfo = "";
            if (this.isArray)
                arrayInfo = "[" + this.arrayLen + "]";
            switch (this.dataType) {
                case "attribute":
                case "uniform":
                case "varying":
                    return this.dataType + " " + this.glType + " " + this._realName + arrayInfo + ";\n";
                case "const":
                    return this.dataType + " " + this.glType + " " + this._realName + " " + this.getGlConstantValue(this.value) + "\n";
            }
        },
        enumerable: true,
        configurable: true
    });
    XElement.prototype.getGlConstantValue = function (v) {
        var result;
        if (v.push) {
            var i, len = v.length;
            result += ";\n";
            for (i = 0; i < len; i++) {
                result += this._realName + "[" + i + "] " + this.getGlConstantValue(v[i]) + "\n";
            }
            return result;
        }
        result = "= ";
        switch (this.type) {
            case "f":
                return result + "" + v + ";";
            case "v2":
                return result + "vec2(" + v.x + "," + v.y + ");";
            case "v3":
            case "c":
                return result + "vec3(" + v.x + "," + v.y + "," + v.z + ");";
            case "v4":
                return result + "vec4(" + v.x + "," + v.y + "," + v.z + "," + v.w + ");";
        }
    };
    XElement.FLOAT = 1;
    XElement.VEC2 = 2;
    XElement.VEC3 = 3;
    XElement.VEC4 = 4;
    XElement.MAT3 = 5;
    XElement.MAT4 = 6;
    XElement.countName = 0;
    return XElement;
}());
