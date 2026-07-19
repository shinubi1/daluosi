import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ColorData')
export class ColorData {
    r:number;
    g:number;
    b:number;
    id:number;

    public static new_bean(r:number, g:number, b:number, id:number){
        let ret=new ColorData();
        ret.r=r;
        ret.g=g;
        ret.b=b;
        ret.id=id;
        return ret;
    }
    public clone():ColorData{
        return ColorData.new_bean(this.r,this.g,this.b,this.id);
    }
}


