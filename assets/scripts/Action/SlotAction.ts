import { _decorator, Color, Component, director, easing, Input, Node, Sprite, tween, UITransform, Vec2, Vec3 } from 'cc';
import { ColorData } from '../ColorData';
import { HoleAction } from './HoleAction';
import { Tool } from '../util/Tool';
import { PinAction } from './PinAction';
import { SlotColorRules } from '../SlotColorRules';
import { Global } from '../util/Global';
import { AudioManager } from '../Manager/AudioManager';
import { Clips, events } from '../util/Enums';
const { ccclass, property } = _decorator;

@ccclass('SlotAction')
export class SlotAction extends Component {
    slot_color: ColorData;
    default_position: Vec3;
    default_lock: boolean = false;
    @property(Node)
    lock: Node;
    @property(Sprite)
    box_1_img: Sprite;
    @property(Sprite)
    box_2_img: Sprite;

    isLocked: boolean = false;

    protected onLoad(): void {
        this.default_position = this.node.getPosition().clone();
        this.default_lock = this.lock.active;
        this.node.on(Input.EventType.TOUCH_START, this.on_touch, this);
    }

    private on_touch(): void {
        if (Global.is_check) return;
        if (!this.isLocked) return;
        AudioManager.instance.playSound(Clips.btn_1);
        Global.props_action?.open('props_4', this);
    }

    init_slot() {
        this.set_lock_unlock(this.default_lock);
        this.clear_pins();

        this.node.setPosition(this.default_position.x, this.default_position.y);
        if (this.isLocked) {
            return;
        }
        this.slot_color = SlotColorRules.get_next_slot_color(SlotColorRules.r_0());
        if (!this.slot_color) {
            return;
        }
        this.set_img(this.slot_color, 255);
    }

    set_lock_unlock(l: boolean) {
        if (l) {
            this.isLocked = true;
            //隐藏hole
            this.node.children.forEach(element => {
                if (element.getComponent(HoleAction)) {
                    element.active = false;
                }
            });
            this.set_img(ColorData.new_bean(0, 0, 0, 0), 100);
            this.lock.active = true;
            this.box_2_img.node.active = false;
        } else {
            this.isLocked = false;
            this.node.children.forEach(element => {
                if (element.getComponent(HoleAction)) {
                    element.active = true;
                }
            });
            this.lock.active = false;
            this.box_2_img.node.active = true;
        }
    }
    public clear_pins() {
        Tool.clearFromParent(this.node, PinAction);
    }
    private set_img(c: ColorData, a: number) {
        this.box_1_img.color = new Color(c.r, c.g, c.b, a)
    }
    get_slot_color(): ColorData {
        return this.slot_color;
    }
    public check_able_put(pin: PinAction): boolean {
        // 检查是否有设置插槽颜色，如果没有则不能放置
        if (!this.slot_color) {
            return false;
        }
        // 检查插槽是否被锁定，如果锁定则不能放置
        if (this.isLocked) {
            return false;
        }
        // 检查插槽颜色是否与要放置的钉子颜色匹配，如果不匹配则不能放置
        if (pin.pin_color.id != this.slot_color.id) {
            return false;
        }
        // 获取临时插槽数量，如果有空闲插槽则可以放置
        let temp = this.get_temp_hole_num();
        if (temp > 0) {
            return true;
        } else {
            return false;
        }
    }


    public get_temp_hole_num(): number {
        let pin_num = this.get_pin_num();
        let hole_arr = this.get_hole_arr();
        return hole_arr.length - pin_num;
    }

    private get_hole_arr(): Node[] {
        let hole_arr = [];
        this.node.children.forEach(element => {
            if (element.getComponent(HoleAction)) {
                hole_arr.push(element);
            }
        });
        return hole_arr;
    }
    public get_pin_num(): number {
        let pin_num = 0;
        this.node.children.forEach(element => {
            if (element.getComponent(PinAction)) {
                pin_num++;
            }
        });
        return pin_num;
    }
    private get_temp_position(): Vec3 {
        let pin_num = this.get_pin_num();
        let hole_arr = this.get_hole_arr();
        if (this.get_temp_hole_num() <= 0) {
            return null;
        }
        let target_hole_index = pin_num;
        return hole_arr[target_hole_index].position;
    }
    public put_pin(pin: PinAction, delay = 0): boolean {
        let target_hole_pos = this.get_temp_position();
        if (!target_hole_pos) {
            //没有找到孔的点
            return false;
        }
        let pin_world_pos = pin.node.getWorldPosition();
        let target = this.node.getComponent(UITransform).convertToNodeSpaceAR(pin_world_pos);
        this.node.addChild(pin.node);
        pin.node.setPosition(target);

        //使钉子的物理效果失效
        pin.remove_collider();
        //限制一下，防止多个钉子被同时点进来,只允许最后一个钉子完成后执行结束动作
        let run_complete = false;
        if (this.get_temp_hole_num() <= 0) {
            run_complete = true;
        }
        this.tween_play(pin, run_complete, target_hole_pos, delay);
        return true;
    }

    private tween_play(pin: PinAction, run_complete: boolean, target_hole_pos: Vec3, delay: number) {
        let ret1 = new Vec3(pin.node.position.x, pin.node.position.y, pin.node.position.z).lerp(target_hole_pos, 0.1);
        tween(pin.node)
            .delay(delay)
            .to(0.2, { scale: new Vec3(2, 2), position: ret1, angle: 360 }, { easing: 'quadInOut' })
            .to(0.3, { position: target_hole_pos }, { easing: 'quadInOut' })
            .call(() => {
                if (pin.pos_hole) {
                    pin.pos_hole.hide();
                }
                if (run_complete) {
                    this.full_complete();
                }
            })
            .to(0.2, { scale: new Vec3(1, 1) }, { easing: 'quadInOut' })
            .start();
    }

    private full_complete() {
        // 移除盒子
        Global.coins_action.put_coins(this.get_pin_num(), this.node.getWorldPosition())
        let to_position_1 = this.node.getPosition().clone();
        let to_position = this.node.getPosition().clone();
        to_position.y = to_position.y + 300;
        tween(this.node)
            .to(0.05, { position: new Vec3(to_position_1.x + 6, to_position_1.y) }, { easing: 'quadInOut' })
            .to(0.05, { position: new Vec3(to_position_1.x - 6, to_position_1.y) }, { easing: 'quadInOut' })
            .union()
            .repeat(4)
            .to(0.05, { position: new Vec3(to_position_1.x, to_position_1.y) }, { easing: 'quadInOut' })
            .to(0.15, { position: to_position }, { easing: 'quadInOut' })
            .call(() => {
                AudioManager.instance.playSound(Clips.pin_3);
                this.slot_color = null;
                //TODO:进度条更新
                let eliminated = this.get_pin_num();
                this.clear_pins();
                Global.current_level_pin_move_num += eliminated;
                director.emit(events.check_complete, this)
            })
            .start();
    }
    into_scene(pos: Vec2 = new Vec2(-300, 0)) {
        if (this.isLocked) {
            //默认是锁定的，让其出现在默认位置
            this.node.setPosition(this.default_position.x, this.default_position.y)
            return;
        }
        switch (Global.current_level) {
            case 1:
                this.slot_color = SlotColorRules.get_next_slot_color(SlotColorRules.r_0());
                break;
            case 2:
                this.slot_color = SlotColorRules.get_next_slot_color(SlotColorRules.r_0());
                break;
            case 3:
                this.slot_color = SlotColorRules.get_next_slot_color(SlotColorRules.r_1());
                break;
            case 4:
                this.slot_color = SlotColorRules.get_next_slot_color(SlotColorRules.r_2());
                break;
            case 5:
                this.slot_color = SlotColorRules.get_next_slot_color(SlotColorRules.r_3());
                break;
            case 6:
                this.slot_color = SlotColorRules.get_next_slot_color(SlotColorRules.r_3());
                break;
            default:
                this.slot_color = SlotColorRules.get_next_slot_color(SlotColorRules.r_4());
        }
        console.log("into_scene>>>>>remain slot:", SlotColorRules.slot_color_arr.length);
        if (!this.slot_color) {
            //没有颜色了
            console.log("into_scene>>>>>没有颜色了");
            return;
        }
        this.set_img(this.slot_color, 255);
        this.node.setPosition(this.default_position.x + pos.x, this.default_position.y + pos.y);
        tween(this.node)
            .to(0.2, { position: this.default_position.clone() }, { easing: 'quadInOut' })
            .call(() => {
                this.load_pin();
            })
            .start();
    }
    //读取钉子颜色放入插槽盒
    load_pin() {
        if (!this.slot_color) return;
        let pin_arr: PinAction[] = [];
        //TODO:获取与垃圾桶当前颜色ID匹配的螺丝钉数组
        //获取与当前插槽盒颜色相匹配的预备孔位的钉子
        Global.layer_empty_action.get_pin_by_color(this.slot_color.id, pin_arr);
        pin_arr.forEach(element => {
            //检查是否可以放置当前的螺丝钉动作
            if (this.check_able_put(element)) {
                this.put_pin(element, 0.2);
            }
        })
    }

}


