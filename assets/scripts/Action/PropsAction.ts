import { _decorator, Button, Color, Component, Node, Widget, Label } from 'cc';
import { Global } from '../util/Global';
import { Tool } from '../util/Tool';
import { PinAction } from './PinAction';
import { SlotAction } from './SlotAction';
import { EmptyHoleAction } from './EmptyHoleAction';
import { AudioManager } from '../Manager/AudioManager';
import { Clips } from '../util/Enums';
const { ccclass } = _decorator;

type PanelName = 'props_1' | 'props_2' | 'props_3' | 'props_4';

@ccclass('PropsAction')
export class PropsAction extends Component {
    private props_1: Node = null;
    private props_2: Node = null;
    private props_3: Node = null;
    private props_4: Node = null;
    private coins_label: Label = null;
    private target_slot: SlotAction = null;

    protected onLoad(): void {
        let widget = this.node.getComponent(Widget);
        if (widget) widget.enabled = false;
        this.node.setPosition(0, 0);
        this.node.active = false;

        this.props_1 = this.node.getChildByName('props_1');
        this.props_2 = this.node.getChildByName('props_2');
        this.props_3 = this.node.getChildByName('props_3');
        this.props_4 = this.node.getChildByName('props_4');
        this.coins_label = this.node.getChildByName('coins_label')?.getComponent(Label);

        let btn_close = this.node.getChildByName('btn_close');
        btn_close?.on(Button.EventType.CLICK, this.close, this);
        let btn_continue = this.node.getChildByName('btn_continue');
        btn_continue?.on(Button.EventType.CLICK, this.close, this);

        this.setup_panel_1();
        this.setup_panel_2();
        this.setup_panel_3();
        this.setup_panel_4();
    }

    private setup_panel_1(): void {
        let btn_coins = this.props_1?.getChildByName('btn_add_hole_coins');
        let btn_videos = this.props_1?.getChildByName('btn_add_hole_videos');
        btn_coins?.on(Button.EventType.CLICK, () => this.use_add_hole(true), this);
        btn_videos?.on(Button.EventType.CLICK, () => this.use_add_hole(false), this);
    }

    private setup_panel_2(): void {
        let btn_coins = this.props_2?.getChildByName('btn_add_hole_coins');
        let btn_videos = this.props_2?.getChildByName('btn_add_hole_videos');
        btn_coins?.on(Button.EventType.CLICK, () => this.use_convert_color(true), this);
        btn_videos?.on(Button.EventType.CLICK, () => this.use_convert_color(false), this);
    }

    private setup_panel_3(): void {
        let btn_coins = this.props_3?.getChildByName('btn_clear_coins');
        let btn_videos = this.props_3?.getChildByName('btn_clear_videos');
        btn_coins?.on(Button.EventType.CLICK, () => this.use_clear_pins(true), this);
        btn_videos?.on(Button.EventType.CLICK, () => this.use_clear_pins(false), this);
    }

    private setup_panel_4(): void {
        let btn_coins = this.props_4?.getChildByName('btn_open_box_coins');
        let btn_videos = this.props_4?.getChildByName('btn_open_box_videos');
        btn_coins?.on(Button.EventType.CLICK, () => this.use_open_box(true), this);
        btn_videos?.on(Button.EventType.CLICK, () => this.use_open_box(false), this);
    }

    open(panel: PanelName, target?: SlotAction): void {
        this.node.active = true;
        this.node.setPosition(0, 0);
        Global.is_check = true;
        Global.guide_action?.reset();
        this.target_slot = target ?? null;

        if (this.props_1) this.props_1.active = (panel === 'props_1');
        if (this.props_2) this.props_2.active = (panel === 'props_2');
        if (this.props_3) this.props_3.active = (panel === 'props_3');
        if (this.props_4) this.props_4.active = (panel === 'props_4');

        this.refresh_coins_label();
        AudioManager.instance.playSound(Clips.popup);
    }

    close(): void {
        this.node.active = false;
        Global.is_check = false;
        Global.guide_action?.reset();
        this.target_slot = null;
    }

    private refresh_coins_label(): void {
        if (this.coins_label) {
            this.coins_label.string = Global.cur_coins + '';
        }
    }

    private get_cost(): number {
        return Global.need_coins * Global.current_level;
    }

    private pay_coins(): boolean {
        let cost = this.get_cost();
        if (Global.cur_coins < cost) {
            Global.tips_action?.show('扳手不足', 2, true);
            return false;
        }
        Global.cur_coins -= cost;
        Global.coins_action?.refrush_coins();
        this.refresh_coins_label();
        return true;
    }

    private use_add_hole(use_coins: boolean): void {
        if (use_coins && !this.pay_coins()) return;
        AudioManager.instance.playSound(Clips.btn_1);
        this.add_empty_hole();
        this.close();
    }

    private use_convert_color(use_coins: boolean): void {
        if (use_coins && !this.pay_coins()) return;
        AudioManager.instance.playSound(Clips.btn_1);
        this.convert_color();
        this.close();
    }

    private use_clear_pins(use_coins: boolean): void {
        if (use_coins && !this.pay_coins()) return;
        AudioManager.instance.playSound(Clips.btn_1);
        this.clear_pins();
        this.close();
    }

    private use_open_box(use_coins: boolean): void {
        if (use_coins && !this.pay_coins()) return;
        AudioManager.instance.playSound(Clips.btn_1);
        if (this.target_slot && this.target_slot.isLocked) {
            this.target_slot.set_lock_unlock(false);
        }
        this.close();
    }

    private add_empty_hole(): void {
        let layer_empty = Global.layer_empty_action?.node;
        if (!layer_empty) return;
        let unlocked_one = false;
        for (let child of layer_empty.children) {
            let hole = child.getComponent(EmptyHoleAction);
            if (hole && hole.isLocked) {
                hole.set_lock_unlock(false);
                unlocked_one = true;
                break;
            }
        }
        if (!unlocked_one) {
            Global.tips_action?.show('没有锁住的空位');
        }
    }

    private convert_color(): void {
        let layer_empty = Global.layer_empty_action?.node;
        if (!layer_empty) return;
        let pin = this.find_first_pin_in_layer_empty();
        if (!pin) {
            Global.tips_action?.show('没有钉子可转化');
            return;
        }
        let slot_colors = Global.layer_slot_action.get_slot_color_arr();
        if (slot_colors.length === 0) {
            Global.tips_action?.show('没有可用的颜色');
            return;
        }
        let target_color = slot_colors[0];
        if (pin.pin_color && pin.pin_color.id === target_color.id) return;
        pin.pin_color = target_color.clone();
        if (pin.pin_img) {
            pin.pin_img.color = new Color(target_color.r, target_color.g, target_color.b, 255);
        }
        Global.layer_slot_action.node.children.forEach(slot_node => {
            slot_node.getComponent(SlotAction)?.load_pin();
        });
    }

    private clear_pins(): void {
        let layer_empty = Global.layer_empty_action?.node;
        if (!layer_empty) return;
        let pins: PinAction[] = [];
        layer_empty.children.forEach(child => {
            let pin = child.getComponentInChildren(PinAction);
            if (pin) pins.push(pin);
        });
        if (pins.length === 0) {
            Global.tips_action?.show('没有钉子可清除');
            return;
        }
        pins.forEach((pin, i) => {
            Global.bucket_action?.put_pin(pin, i * 0.1);
        });
    }

    private find_first_pin_in_layer_empty(): PinAction | null {
        let layer_empty = Global.layer_empty_action?.node;
        if (!layer_empty) return null;
        for (let child of layer_empty.children) {
            let pin = child.getComponentInChildren(PinAction);
            if (pin) return pin;
        }
        return null;
    }
}
