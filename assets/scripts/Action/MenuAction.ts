import { _decorator, Button, Component, Node, Widget } from 'cc';
import { Global } from '../util/Global';
import { AudioManager } from '../Manager/AudioManager';
import { Clips } from '../util/Enums';
const { ccclass } = _decorator;

@ccclass('MenuAction')
export class MenuAction extends Component {
    private btn_close: Node = null;
    private sound: Node = null;
    private sound_off_icon: Node = null;
    private btn_restart: Node = null;
    private btn_go_lvl_1: Node = null;
    private btn_continue: Node = null;

    protected onLoad(): void {
        this.node.active = false;
        let widget = this.node.getComponent(Widget);
        if (widget) widget.enabled = false;
        this.node.setPosition(0, 0);

        this.btn_close = this.node.getChildByName('btn_close');
        this.sound = this.node.getChildByName('sound');
        this.sound_off_icon = this.sound?.getChildByName('xxx');
        this.btn_restart = this.node.getChildByName('btn_restart');
        this.btn_go_lvl_1 = this.node.getChildByName('btn_go_lvl_1');
        this.btn_continue = this.node.getChildByName('btn_continue');

        this.btn_close?.on(Button.EventType.CLICK, this.on_close_click, this);
        this.sound?.on(Button.EventType.CLICK, this.on_sound_click, this);
        this.btn_restart?.on(Button.EventType.CLICK, this.on_restart_click, this);
        this.btn_go_lvl_1?.on(Button.EventType.CLICK, this.on_go_lvl_1_click, this);
        this.btn_continue?.on(Button.EventType.CLICK, this.on_continue_click, this);

        this.update_sound_icon();
    }

    open(): void {
        this.node.active = true;
        this.node.setPosition(0, 0);
        Global.is_check = true;
        Global.guide_action?.reset();
        this.update_sound_icon();
        AudioManager.instance.playSound(Clips.popup);
    }

    private close(): void {
        this.node.active = false;
        Global.is_check = false;
        Global.guide_action?.reset();
    }

    private on_close_click(): void {
        this.close();
    }

    private on_continue_click(): void {
        this.close();
    }

    private on_sound_click(): void {
        Global.sound_switch = !Global.sound_switch;
        localStorage.setItem('sound_switch', Global.sound_switch ? '1' : '0');
        this.update_sound_icon();
        if (Global.sound_switch) {
            AudioManager.instance.playSound(Clips.btn_1);
        }
    }

    private update_sound_icon(): void {
        if (this.sound_off_icon) {
            this.sound_off_icon.active = !Global.sound_switch;
        }
    }

    private on_restart_click(): void {
        this.close();
        Global.main_action.start_level(Global.current_level);
    }

    private on_go_lvl_1_click(): void {
        this.close();
        Global.main_action.start_level(1);
    }
}
