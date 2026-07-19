import { _decorator, Component, Node } from 'cc';
import { ColorData } from '../ColorData';
import { DataModel } from '../DataModel';
import { ElementAction } from './ElementAction';
import { PinAction } from './PinAction';
const { ccclass, property } = _decorator;

@ccclass('LayerAction')
export class LayerAction extends Component {
    layer_group_id = 0;//碰撞层
    layer_color: ColorData = null;//层颜色

    public init_layer() {
        this.layer_group_id = DataModel.get_new_group_index();
        this.layer_color = DataModel.get_layer_color();

        this.node.children.forEach(element_node => {
            element_node.getComponent(ElementAction).init_element(this.layer_group_id, this.layer_color);
        })
    }
    public init_pin(color_pin_arr: ColorData[]) {
        this.node.children.forEach(element_node => {
            element_node.getComponent(ElementAction).init_pin(this.layer_group_id, color_pin_arr);
        })
    }
    public get_hole_num(): number {
        let hole_num = 0;
        this.node.children.forEach(element_node => {
            hole_num += element_node.getComponent(ElementAction).get_hole_num();
        })
        return hole_num
    }
    get_pin_color(arr: PinAction[]) {
        this.node.children.forEach(element_node => {
            element_node.getComponent(ElementAction)?.get_pin_color(arr);
        })
    }

    layer_status: number = 0;
    public set_status(status: number) {//0=隐藏，1=显示，2=黑色模式
        switch (status) {
            case 0:
                this.node.active = false;
                break;
            case 1:
                this.node.active = true;
                if (this.layer_status == 0) {
                    this.node.children.forEach(element_node => {
                        element_node.getComponent(ElementAction)?.flash_img();
                    })
                }
                if (this.layer_status == 2) {
                    this.node.children.forEach(element_node => {
                        element_node.getComponent(ElementAction)?.set_layer_bg_or_origin(false);
                        element_node.getComponent(ElementAction)?.flash_img();
                    })
                }
                break;
            case 2:
                if (this.layer_status != 2) {
                    this.node.children.forEach(element_node => {
                        element_node.getComponent(ElementAction)?.set_layer_bg_or_origin(true);
                    });
                    this.scheduleOnce(() => {
                        this.node.active = true;
                        this.node.children.forEach(element_node => {
                            element_node.getComponent(ElementAction)?.flash_img(0.5);
                        })
                    }, 1.6)
                }
                break;
        }
        this.layer_status = status;
    }
    public get_element_num():number{
        return this.node.children.length;
    }
}


