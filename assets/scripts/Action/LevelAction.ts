import { _decorator, Component, director, Node } from 'cc';
import { DataModel } from '../DataModel';
import { Global } from '../util/Global';
import { UnitAction } from './UnitAction';
import { SlotColorRules } from '../SlotColorRules';
import { PinAction } from './PinAction';
import { LayerAction } from './LayerAction';
import { events } from '../util/Enums';
const { ccclass, property } = _decorator;

@ccclass('LevelAction')
export class LevelAction extends Component {

    protected onLoad(): void {
        director.on(events.remove_element,this.hide_element,this);
    }

    public init_level() {
        //每次开始把基础颜色打乱
        DataModel.random_base_color();
        let color_num = 3;
        if (Global.current_level == 1) {
            color_num = 3;
        } else if (Global.current_level == 2) {
            color_num = 5;
        } else if (Global.current_level < 6) {
            color_num = 5;
        } else if (Global.current_level < 8) {
            color_num = 6;
        } else if (Global.current_level < 10) {
            color_num = 8;
        } else {
            color_num = Global.current_level;
        }
        console.log(">level:", Global.current_level, "color_num:", color_num);
        DataModel.generate_level_color_arr(color_num);
        DataModel.reset_level_color_index();

        //初始化每一模块的layer层
        this.node.children.forEach(unit_node => {
            unit_node.getComponent(UnitAction).init_layer();
        })

        let color_pin_arr = [];//存储钉子
        let color_slot_arr = [];//存储槽
        let total_hole_num = this.get_hole_num();//计算当前关卡所有孔位
        let need_slot_num = total_hole_num / 3;//获取当前关卡所有的插槽盒总数
        for (let i = 0; i < need_slot_num; i++) {
            let base = DataModel.get_level_color();
            color_pin_arr.push(base.clone())
            color_pin_arr.push(base.clone())
            color_pin_arr.push(base.clone())
            color_slot_arr.push(base);
        }
        color_slot_arr.sort(() => {
            return 0.5 - Math.random();
        })
        console.log("当前钉子数量", color_pin_arr.length);
        console.log("当前槽盒数量", color_slot_arr.length);

        // 生成钉子
        this.node.children.forEach(unit_node => {
            unit_node.getComponent(UnitAction).init_pin(color_pin_arr);
        })


        //设置slot的颜色规则
        SlotColorRules.set_slot_color(color_slot_arr);
        Global.layer_slot_action.init_slot();//初始化插槽盒
        Global.layer_empty_action.init_empty();//初始化预备空槽位

        //初始化钉子信息
        Global.init_pin_info(total_hole_num);
        //默认隐藏一些层块
        this.set_default_layer()
    }
    private set_default_layer() {
        //默认都是不显示的
        let layer_arr = this.get_all_layer();
        layer_arr.forEach(layer_action => {
            layer_action.set_status(0);
        });
        this.hide_element();
    }
    private get_all_layer(): LayerAction[] {
        let arr: LayerAction[] = [];
        for (let i = this.node.children.length - 1; i >= 0; i--) {
            let unity_action = this.node.children[i].getComponent(UnitAction);
            unity_action.get_layer(arr)
        }
        return arr;
    }
    public get_hole_num(): number {
        let hole_num = 0;
        this.node.children.forEach(unit_node => {
            hole_num += unit_node.getComponent(UnitAction).get_hole_num();
        })
        return hole_num
    }
    get_pin_color(): PinAction[] {
        let arr: PinAction[] = [];
        for (let i = this.node.children.length - 1; i >= 0; i--) {
            let unit_action = this.node.children[i].getComponent(UnitAction);
            unit_action?.get_pin_color(arr);
        }
        return arr;
    }
    private hide_element() {
        let default_show_layer_num = 4;
        let show_num = 0;
        let layer_arr = this.get_all_layer();
        for (let i = 0; i < layer_arr.length; i++) {
            let layer_action = layer_arr[i];
            if (layer_action.get_element_num() <= 0) continue;
            show_num++;
            if (show_num <= default_show_layer_num) {
                layer_action.set_status(1);
            } else if (show_num == (default_show_layer_num + 1)) {
                layer_action.set_status(2);
            } else {
                layer_action.set_status(0);
            }
        }

    }
}


