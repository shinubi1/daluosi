import { _decorator, Button, Component, Label, Node, Widget } from 'cc';
import { Global } from '../util/Global';
import { LevelStorage } from '../util/LevelStorage';
import { AudioManager } from '../Manager/AudioManager';
import { Clips } from '../util/Enums';
const { ccclass, property } = _decorator;

@ccclass('GameOverAction')
export class GameOverAction extends Component {
    private btn_restart: Node = null;
    private btn_go_lvl_1: Node = null;
    private history_lvl_label: Label = null;

    protected onLoad(): void {
        this.node.active = false;
        let widget = this.node.getComponent(Widget);
        if (widget) widget.enabled = false;
        this.node.setPosition(0, 0);
        this.btn_restart = this.node.getChildByName('btn_restart');
        this.btn_go_lvl_1 = this.node.getChildByName('btn_go_lvl_1');
        let history_node = this.node.getChildByName('history');
        this.history_lvl_label = history_node?.getChildByName('history_lvl_label')?.getComponent(Label);

        this.btn_restart?.on(Button.EventType.CLICK, this.on_restart_click, this);
        this.btn_go_lvl_1?.on(Button.EventType.CLICK, this.on_go_lvl_1_click, this);
    }

    open() {
        this.node.active = true;
        this.node.setPosition(0, 0);
        Global.is_check = true;
        if (this.history_lvl_label) {
            this.history_lvl_label.string = LevelStorage.get_history_level() + "";
        }
        AudioManager.instance.playSound(Clips.fail);
    }

    private on_restart_click() {
        this.node.active = false;
        Global.main_action.start_level(Global.current_level);
    }

    private on_go_lvl_1_click() {
        this.node.active = false;
        Global.main_action.start_level(1);
    }
}
