/**
 * Created by TOM on 04/03/2017.
 */
///<reference path="XBaseShader.ts"/>
class XFragment extends XBaseShader{

    public getColor:XShaderCode;
    public modifyColor:XShaderCode;
    public applyColor:XShaderCode;

    constructor(){
        super();
        this.getColor = this.codeInit;//this.main.createSubShaderCode(``);
        this.modifyColor = this.main.createSubShaderCode(``);
        this.applyColor = this.main.createSubShaderCode(``);
    }
}