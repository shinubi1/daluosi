import { _decorator, BoxCollider2D, CircleCollider2D, Color, color, Component, director, ERigidBody2DType, instantiate, Node, PolygonCollider2D, RigidBody2D, Sprite, tween, UIOpacity, view } from 'cc';
import { ColorData } from '../ColorData';
import { HoleAction } from './HoleAction';
import { ResourcePool } from '../ResourcePool';
import { PinAction } from './PinAction';
import { events } from '../util/Enums';
const { ccclass, property } = _decorator;

@ccclass('ElementAction')
export class ElementAction extends Component {
    element_color: ColorData

    update(){
        //钉子掉落、元素下落出屏自动销毁
        let currentPosition=this.node.getPosition();
        if(currentPosition.y<-view.getVisibleSize().height/2){
            this.node.removeFromParent();
            director.emit(events.remove_element,this);
        }
    }
    public init_element(group_id: number, element_color: ColorData) {
        this.element_color = element_color;
        this.node.getComponent(RigidBody2D).group = group_id;
        this.node.getComponents(BoxCollider2D).forEach(element => {
            element.group = group_id;
        })
        this.node.getComponents(CircleCollider2D).forEach(element => {
            element.group = group_id;
        })
        this.node.getComponents(PolygonCollider2D).forEach(element => {
            element.group = group_id;
        })
        this.set_img_color(element_color, 190)
    }
    public init_pin(group_id: number, color_pin_arr: ColorData[]) {
        this.node.children.forEach(element => {
            if (element.getComponent(HoleAction)) {
                let new_pin = instantiate(ResourcePool.instance.get_prefab("pin"));
                this.node.addChild(new_pin);
                new_pin.setPosition(element.position);
                new_pin.getComponent(PinAction).init_data(group_id, color_pin_arr.shift(), element.getComponent(HoleAction))
            }
        })
    }
    private set_img_color(_color: ColorData, a: number) {
        this.node.children.forEach(element => {
            if (element.name == "img" && _color) {
                let img = element.getComponent(Sprite);
                img.color = new Color(_color.r, _color.g, _color.b, a);
            }
        })
    }
    public get_hole_num(): number {
        let hole_num = 0;
        this.node.children.forEach(element => {
            if (element.getComponent(HoleAction)) {
                hole_num++;
            }
        })
        return hole_num;
    }
    get_pin_color(arr: PinAction[]) {
        this.node.children.forEach(pin_node => {
            let pin_action = pin_node.getComponent(PinAction);
            if (pin_action && pin_action.pin_color) {
                arr.push(pin_node.getComponent(PinAction));
            }
        })
    }
    public flash_img(time: number = 0.3) {
        this.node.children.forEach(element => {
            if (element.name == "img") {
                if (element.getComponent(UIOpacity)) {
                    let opacity_1 = 100;
                    let opacity_2 = 200;
                    element.getComponent(UIOpacity).opacity = 100;
                    tween(element.getComponent(UIOpacity))
                        .to(time, { opacity: opacity_2 }, { easing: 'quadInOut' })
                        .to(time, { opacity: opacity_1 }, { easing: 'quadInOut' })
                        .to(time, { opacity: opacity_2 }, { easing: 'quadInOut' })
                        .to(time, { opacity: opacity_1 }, { easing: 'quadInOut' })
                        .to(time, { opacity: 255 }, { easing: 'quadInOut' })
                        .call(() => {
                            element.getComponent(UIOpacity).opacity = 255;
                        })
                        .start();
                }
            }
        })
    }

    //当我们当前的板子为背景的时候，它就不受物理影响，并且显示为黑色，不显示钉子
    public set_layer_bg_or_origin(is_bg:boolean){
        if(is_bg){
            this.node.getComponent(RigidBody2D).type=ERigidBody2DType.Static;
            this.node.children.forEach(element=>{
                element.active=false;
                if(element.name=="img"){//只设置图片颜色
                    element.active=true;
                    this.set_img_color(ColorData.new_bean(0,0,0,0),180);
                }
            })
        }else{
            this.node.children.forEach(element=>{
                element.active=true;
            });
            this.set_img_color(this.element_color,190);
            this.node.getComponent(RigidBody2D).type=ERigidBody2DType.Dynamic;
        }
    }
}


