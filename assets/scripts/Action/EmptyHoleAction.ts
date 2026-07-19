import { _decorator, Component, director, Node, tween, UITransform, Vec3 } from 'cc';
import { Tool } from '../util/Tool';
import { PinAction } from './PinAction';
import { events } from '../util/Enums';
const { ccclass, property } = _decorator;

@ccclass('EmptyHoleAction')
export class EmptyHoleAction extends Component {
    @property(Node)
    lock: Node
    defalut_lock: boolean = false//默认不锁
    isLocked: boolean = false//当前锁定状态
    protected onLoad(): void {
        this.defalut_lock = this.lock.active;
    }
    init_empty_hole() {
        this.set_lock_unlock(this.defalut_lock);
        Tool.clearFromParent(this.node, PinAction);
    }
    set_lock_unlock(l: boolean) {
        this.isLocked = l;
        if (this.lock) {
            tween(this.lock)
                .to(0.25, { scale: new Vec3(1.2, 1.2, 1) }, { easing: 'quadInOut' })
                .to(0.45, { scale: new Vec3(0.8, 0.8, 1) }, { easing: 'quadInOut' })
                .to(0.25, { scale: new Vec3(1, 1, 1) }, { easing: 'quadInOut' })
                .call(() => {
                    this.lock.scale = new Vec3(1, 1, 1);
                    this.lock.active = l;
                })
                .start();
        }
    }
    //根据颜色ID获取特定颜色的pinAciton数组
    get_pin_arr_by_color_id(color_id: number, pin_arr: PinAction[]) {
        let pin_action = this.node.getComponentInChildren(PinAction);
        if (!pin_action) return;
        if (pin_action.pin_color && pin_action.pin_color.id == color_id && pin_action.flying == false) {
            pin_arr.push(pin_action);
        }
    }
    private get_temp_position(): Vec3 {
        //钉子数
        let pin = this.node.getComponentInChildren(PinAction);
        if (pin) {
            return null;
        }
        return new Vec3(0, 0, 0);
    }
    public can_able_put(): boolean {
        if (this.isLocked) return false;
        let target_hole_pos = this.get_temp_position();
        if (target_hole_pos) {
            return true;
        } else {
            return false;
        }
    }
    public put_pin(pin: PinAction): boolean {
        let target_hole_pos = this.get_temp_position();
        if (!target_hole_pos) return false;

        //将钉子的世界位置转换为当前节点的空间位置
        let world_pos = pin.node.getWorldPosition();
        let target = this.node.getComponent(UITransform).convertToNodeSpaceAR(world_pos);

        pin.flying = true;
        this.node.addChild(pin.node);
        pin.node.setPosition(target);
        pin.remove_collider();

        this.tween_play(pin, target_hole_pos);

        return true;
    }

    async tween_play(pin: PinAction, target_hole_pos: Vec3) {
        let ret1 = new Vec3(pin.node.position.x, pin.node.position.y, pin.node.position.z).lerp(target_hole_pos, 0.1);
        tween(pin.node)
            .to(0.2, { scale: new Vec3(2, 2), position: ret1, angle: 360 }, { easing: 'quadInOut' })
            .to(0.25, { position: target_hole_pos }, { easing: 'quadInOut' })
            .call(() => {
                if (pin.pos_hole) {
                    pin.pos_hole.hide();
                }
                pin.flying = false;
                director.emit(events.check_empty_hole, pin);
            })
            .to(0.2, { scale: new Vec3(1, 1) }, { easing: 'quadInOut' })
            .start();
    }
}


