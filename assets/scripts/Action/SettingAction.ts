import { _decorator, Button, Component } from 'cc';
import { Global } from '../util/Global';
const { ccclass } = _decorator;

@ccclass('SettingAction')
export class SettingAction extends Component {
    protected onLoad(): void {
        this.node.on(Button.EventType.CLICK, this.on_click, this);
    }

    private on_click(): void {
        Global.menu_action?.open();
    }
}
