import { _decorator, Component, Node } from 'cc';
import { EmptyHoleAction } from './EmptyHoleAction';
import { PinAction } from './PinAction';
const { ccclass, property } = _decorator;

@ccclass('LayerEmptyAction')
export class LayerEmptyAction extends Component {
    public init_empty() {
        this.node.children.forEach((empty_hole) => {
            empty_hole.getComponent(EmptyHoleAction)?.init_empty_hole();
        })
    }
    public put_pin(pin: PinAction) {
        for (let i = 0; i <= this.node.children.length - 1; i++) {
            let empty_hole_action = this.node.children[i].getComponent(EmptyHoleAction);
            if (empty_hole_action?.can_able_put()) {
                if (empty_hole_action?.put_pin(pin)) {
                    break;
                }
            }
        }
    }
    get_pin_by_color(color_id:number,pin_arr:PinAction[]){
        this.node.children.forEach(empty_hole=>{
            empty_hole.getComponent(EmptyHoleAction)?.get_pin_arr_by_color_id(color_id,pin_arr);
        })
    }
    public is_full(): boolean {
        for (let i = 0; i < this.node.children.length; i++) {
            let empty_hole_action = this.node.children[i].getComponent(EmptyHoleAction);
            if (empty_hole_action?.can_able_put()) {
                return false;
            }
        }
        return true;
    }
}


