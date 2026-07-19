import { _decorator, Component, Node } from 'cc';
import { LayerAction } from './LayerAction';
import { ColorData } from '../ColorData';
import { PinAction } from './PinAction';
const { ccclass, property } = _decorator;

@ccclass('UnitAction')
export class UnitAction extends Component {

    public init_layer() {
        this.node.children.forEach((layer_node => {
            layer_node.getComponent(LayerAction).init_layer();
        }))
    }
    public init_pin(color_pin_arr: ColorData[]) {
        this.node.children.forEach(layer_node => {
            layer_node.getComponent(LayerAction).init_pin(color_pin_arr);
        })
    }
    public get_hole_num(): number {
        let hole_num = 0;
        this.node.children.forEach(layer_node => {
            hole_num += layer_node.getComponent(LayerAction).get_hole_num();
        })
        return hole_num
    }
    get_pin_color(arr: PinAction[]): PinAction[] {
        for (let i = this.node.children.length - 1; i >= 0; i--) {
            let layer_action = this.node.children[i].getComponent(LayerAction);
            layer_action?.get_pin_color(arr);
        }
        return arr;
    }

    get_layer(arr: LayerAction[]) {
        for (let i = this.node.children.length - 1; i >= 0; i--) {
            let layer_action = this.node.children[i].getComponent(LayerAction);
            if (layer_action) {
                arr.push(layer_action);
            }
        }
        return arr;
    }
}


