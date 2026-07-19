import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { LevelAction } from './LevelAction';
import { Tool } from '../util/Tool';
import { ResourcePool } from '../ResourcePool';
const { ccclass, property } = _decorator;

@ccclass('LayerRootAction')
export class LayerRootAction extends Component {
    level_action: LevelAction

    public init_root(level: number) {
        Tool.clearFromParent(this.node, LevelAction);
        let level_prefab = ResourcePool.instance.get_prefab("lvl_" + level);
        let unit_arr: Prefab[] = [];
        //如果未找到指定的关卡预制体
        if (!level_prefab) {
            console.error("没有这个关卡 >>>>>", level);

            //获取默认关卡预制体
            level_prefab = ResourcePool.instance.get_prefab("lvl_x");
            //获取默认关卡的unit预制体数组
            unit_arr = this.get_level_unit(level);
        }
        // 实例化关卡预制体
        let level_node = instantiate(level_prefab);
        //如果单位预制体数组不为空
        if(unit_arr.length>0){
            console.log("生成关卡,unit num:",unit_arr)
            //遍历unit预制体数组并将每个单位实例化后添加关卡节点
            unit_arr.forEach(unit_prefab=>{
                let unit_node=instantiate(unit_prefab);
                level_node.addChild(unit_node);
            })
        }

        //获取关卡节点上的LevelAction组件
        this.level_action=level_node.getComponent(LevelAction);
        this.level_action.init_level();
        //关卡节点添加到我们当前的节点
        this.node.addChild(level_node)
    }
    private get_level_unit(level: number): Prefab[] {
        //从资源池获取unit预制体数组
        let unit_arr: Prefab[] = ResourcePool.instance.get_prefabs_for_unit();
        //随机打乱unit预制体数组的顺序
        unit_arr.sort(() => {
            return 0.5 - Math.random();
        })
        //根据关卡决定需要选择的unit数量
        let num = 1;
        if (level < 15) {
            num = 4;
        } else if (level < 20) {
            num = 5;
        } else if (level < 25) {
            num = 6;
        } else {
            num = 10;
        }
        //创建一个空数组用于存放最终选的unit预制体
        let ret: Prefab[] = [];
        //根据确定的数量从随机打乱的unit预制体数组中选择unit
        for (let i = 0; i < num; i++) {
            if (unit_arr.length > 0) {
                ret.push(unit_arr.shift());
            }
        }
        return ret;
    }
}
