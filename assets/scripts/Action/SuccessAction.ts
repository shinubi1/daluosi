import { _decorator, Button, Component, Label, Node, Widget } from 'cc';
import { Global } from '../util/Global';
import { AudioManager } from '../Manager/AudioManager';
import { Clips } from '../util/Enums';
const { ccclass, property } = _decorator;

@ccclass('SuccessAction')
export class SuccessAction extends Component {
    private btn_next: Node = null;
    private btn_get_coins: Node = null;
    private lvl_label: Label = null;
    private coins_label: Label = null;

    protected onLoad(): void {
        this.node.active = false;
        let widget = this.node.getComponent(Widget);
        if (widget) widget.enabled = false;
        this.node.setPosition(1650, 0);
        this.btn_next = this.node.getChildByName('btn_next');
        this.btn_get_coins = this.node.getChildByName('btn_get_coins');
        this.lvl_label = this.node.getChildByName('lvl')?.getComponent(Label);
        this.coins_label = this.node.getChildByName('coins_label')?.getComponent(Label);

        this.btn_next?.on(Button.EventType.CLICK, this.on_next_click, this);
        this.btn_get_coins?.on(Button.EventType.CLICK, this.on_get_coins_click, this);
    }

    open() {
        this.node.active = true;
        this.node.setPosition(0, 0);
        Global.is_check = true;
        if (this.lvl_label) {
            this.lvl_label.string = (Global.current_level + 1) + "";
        }
        if (this.coins_label) {
            this.coins_label.string = Global.cur_coins + "";
        }
        AudioManager.instance.playSound(Clips.complete_1);
    }

    private on_next_click() {
        this.node.active = false;
        Global.main_action.start_level(Global.current_level + 1);
    }

    private on_get_coins_click() {
        AudioManager.instance.playSound(Clips.btn_1);
    }
}
