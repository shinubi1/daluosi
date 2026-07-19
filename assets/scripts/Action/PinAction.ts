import { _decorator, BoxCollider2D, CircleCollider2D, Color, Component, EventTouch, Input, Node, PolygonCollider2D, RigidBody2D, Sprite } from 'cc';
import { ColorData } from '../ColorData';
import { HoleAction } from './HoleAction';
import { Global } from '../util/Global';
import { AudioManager } from '../Manager/AudioManager';
import { Clips } from '../util/Enums';
const { ccclass, property } = _decorator;

@ccclass('PinAction')
export class PinAction extends Component {
    pin_color: ColorData = null;
    @property(Sprite)
    pin_img: Sprite = null;

    pos_hole: HoleAction = null;

    public flying:boolean=false;

    
    protected start(): void {
        this.node.on(Input.EventType.TOUCH_START, this.touch_start, this);
    }

    public init_data(group_id: number, pin_color: ColorData, hole: HoleAction) {
        this.pos_hole = hole;
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
        this.pin_color = pin_color;
        this.pin_img.color = new Color(this.pin_color.r, this.pin_color.g, this.pin_color.b, 255);

    }
    touch_start(e: EventTouch) {
        if(Global.is_check){
            console.log("is check ");
            return;
        }
        AudioManager.instance.playSound(Clips.pin_1);

        if(Global.layer_slot_action.put_pin(this)){
            //引导提示
            return;
        }
        Global.layer_empty_action.put_pin(this);
    }
    public remove_collider(){
        this.node.getComponent(RigidBody2D).enabled=false;;
        this.node.getComponent(CircleCollider2D).enabled=false;
        this.node.off(Input.EventType.TOUCH_START);
    }
}


