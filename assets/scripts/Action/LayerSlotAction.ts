import { _decorator, Component, director, Node } from 'cc';
import { SlotAction } from './SlotAction';
import { ColorData } from '../ColorData';
import { PinAction } from './PinAction';
import { events } from '../util/Enums';
import { Global } from '../util/Global';
const { ccclass, property } = _decorator;

@ccclass('LayerSlotAction')
export class LayerSlotAction extends Component {

    protected onLoad(): void {
        director.on(events.check_empty_hole,this.check_empty_hole,this)
    }

    public init_slot() {
        this.node.children.forEach(slot => {
            slot.getComponent(SlotAction)?.init_slot()
        })
    }
    public get_slot_color_arr() {
        let arr: ColorData[] = [];
        this.node.children.forEach((slot) => {
            if (slot.getComponent(SlotAction)) {
                let color = slot.getComponent(SlotAction).get_slot_color();
                if (color) {
                    arr.push(color)
                }
            }
        });
        return arr;
    }
    public put_pin(pin: PinAction): boolean {
        let target =this.preput_to_slot(pin);
        if(target){
            return target.put_pin(pin);
        }
        return false;
    }

    // 根据给定的 PinAction 查找可以放置的 SlotAction 并返回临时孔位最少的目标 SlotAction
    public preput_to_slot(pin: PinAction): SlotAction {
        // 初始化一个空数组来存储可以放置的 SlotAction
        let can_move_arr: SlotAction[] = []
        // 遍历节点的所有子节点
        this.node.children.forEach(slot => {
            // 检查子节点是否可以放置给定的 PinAction
            if (slot.getComponent(SlotAction).check_able_put(pin)) {
                // 如果可以放置，则将该子节点的 SlotAction 组件添加到数组中
                can_move_arr.push(slot.getComponent(SlotAction));
            }
        });
        // 初始化目标 SlotAction 为 null
        let target: SlotAction = null;
        // 遍历可以放置的 SlotAction 数组
        can_move_arr.forEach(element => {
            // 如果目标尚未设置，则将当前元素设为目标
            if (!target) {
                target = element;
            } else {
                // 如果当前元素的临时孔位数量少于目标元素的临时孔位数量，则更新目标为当前元素
                if (element.get_temp_hole_num() < target.get_temp_hole_num()) {
                    target = element;
                }
            }
        });
        // 返回最终确定的目标 SlotAction
        return target;
    }
    check_empty_hole(pin:PinAction){
        let slot=this.preput_to_slot(pin);
        if(slot){
            console.log("check_empty_hole",slot.node.name);
            slot.load_pin();
        }
        // 自动装载后如果空槽位还是满的，说明玩家卡死
        if (Global.layer_empty_action.is_full()) {
            Global.game_over_action.open();
        }
    }
}


