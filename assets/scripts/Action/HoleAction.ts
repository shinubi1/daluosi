import { _decorator, Component, Node, UIOpacity } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HoleAction')
export class HoleAction extends Component {
    holering: Node = null;

    protected onLoad(): void {
        this.holering = this.node.getChildByName('empty_holering');
    }
    hide() {
        if (this.node.getComponent(UIOpacity)) {
            this.node.getComponent(UIOpacity).opacity = 0;
        }
    }
}


