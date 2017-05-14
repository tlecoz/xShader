var XShaderCode = (function () {
    function XShaderCode(parent, code, priority) {
        if (parent === void 0) { parent = null; }
        if (priority === void 0) { priority = 0; }
        this.enabled = true;
        this.parent = parent;
        this.children = [];
        this.priority = priority;
        this.code = code;
    }
    XShaderCode.prototype.define = function (code, priority) {
        if (priority === void 0) { priority = 0; }
        this.code = code;
        this.priority = priority;
        return this;
    };
    XShaderCode.prototype.clearCode = function () {
        this.code = "";
    };
    XShaderCode.prototype.addCodeBefore = function (code) {
        this.code = code + this.code;
    };
    XShaderCode.prototype.addCodeAfter = function (code) {
        this.code += code;
    };
    XShaderCode.prototype.save = function () {
        this.savedCode = "" + this.code;
        return this;
    };
    XShaderCode.prototype.restore = function () {
        this.code = "" + this.savedCode;
        return this;
    };
    XShaderCode.prototype.createSubShaderCode = function (code, priority) {
        if (code === void 0) { code = ""; }
        if (priority === void 0) { priority = 0; }
        var result = new XShaderCode(this, code, priority);
        this.children.push(result);
        return result;
    };
    XShaderCode.prototype.modify = function (words, values) {
        var i, len = words.length;
        var c;
        var j, nb = this.children.length;
        for (j = 0; j < nb; j++)
            this.children[j].modify(words, values);
        for (i = 0; i < len; i++)
            this.code = this.code.split(words[i]).join(values[i]);
    };
    XShaderCode.prototype.replaceVariables = function (variables) {
        var i, len = variables.length;
        var names = [];
        var values = [];
        //////////console.log("variables = "+variables+" : "+variables.length+" : "+variables[0])
        for (i = 0; i < len; i++) {
            names[i] = variables[i].name;
            if (!isNaN(variables[i].value))
                values[i] = this.getFloat(variables[i].value);
            else
                values[i] = variables[i].value;
        }
        this.modify(names, values);
        return this;
    };
    XShaderCode.prototype.getFloat = function (n) {
        var result = "" + n;
        if (result.split(".").length > 1)
            return result;
        else
            return result + ".0";
    };
    Object.defineProperty(XShaderCode.prototype, "glsl", {
        get: function () {
            var result = this.code;
            if (this.children.length) {
                this.children.sort(function (a, b) {
                    if (a.priority > b.priority)
                        return 1;
                    if (a.priority < b.priority)
                        return -1;
                    return 0;
                });
                var i, len = this.children.length;
                for (i = 0; i < len; i++)
                    if (this.children[i].enabled)
                        result += this.children[i].glsl + "\n";
            }
            return result;
        },
        enumerable: true,
        configurable: true
    });
    return XShaderCode;
}());
