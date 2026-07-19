import { _decorator, Component, Node, Prefab } from 'cc';
import { UnitAction } from './Action/UnitAction';
const { ccclass, property } = _decorator;

@ccclass('ResourcePool')
export class ResourcePool {
    private prefab_pool: any = {}

    static rp: ResourcePool = null;
    static get instance() {
        if (!this.rp) {
            this.rp = new ResourcePool();
        }
        return this.rp;
    }
    public set_prefab(name: string, prefab: Prefab) {
        this.prefab_pool[name] = prefab;
    }
    public get_prefab(name: string): Prefab {
        return this.prefab_pool[name];
    }

    public get_prefabs_for_unit():Prefab[]{
        let arr:Prefab[] = [];
        for(let key in this.prefab_pool){
            let value=this.prefab_pool[key];
            if(value&&value.data&&value.data.getComponent(UnitAction)){
                arr.push(value);
            }
        }
        return arr;
    }
}


