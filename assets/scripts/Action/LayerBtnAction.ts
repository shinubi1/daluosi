import { _decorator, Button, Component } from 'cc';
import { Global } from '../util/Global';
import { AudioManager } from '../Manager/AudioManager';
import { Clips } from '../util/Enums';
const { ccclass } = _decorator;

@ccclass('LayerBtnAction')
export class LayerBtnAction extends Component {
    protected onLoad(): void {
        let btn1 = this.node.getChildByName('Button1');
        let btn2 = this.node.getChildByName('Button2');
        let btn3 = this.node.getChildByName('Button3');
        btn1?.on(Button.EventType.CLICK, this.on_color_convert_click, this);
        btn2?.on(Button.EventType.CLICK, this.on_add_hole_click, this);
        btn3?.on(Button.EventType.CLICK, this.on_clear_pins_click, this);
    }

    private on_color_convert_click(): void {
        AudioManager.instance.playSound(Clips.btn_1);
        Global.props_action?.open('props_2');
    }

    private on_add_hole_click(): void {
        AudioManager.instance.playSound(Clips.btn_1);
        Global.props_action?.open('props_1');
    }

    private on_clear_pins_click(): void {
        AudioManager.instance.playSound(Clips.btn_1);
        Global.props_action?.open('props_3');
    }
}
