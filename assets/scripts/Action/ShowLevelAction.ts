import { _decorator, Component, Label, Node } from 'cc';
import { Global } from '../util/Global';
const { ccclass, property } = _decorator;

@ccclass('ShowLevelAction')
export class ShowLevelAction extends Component {
    @property(Label)
    level_label:Label=null;

    show_level(){
        this.level_label.string = Global.current_level+"";
    }
}


