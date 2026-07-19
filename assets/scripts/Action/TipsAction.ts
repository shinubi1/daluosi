import { _decorator, Component, Label, Node, Tween, tween } from 'cc';
const { ccclass } = _decorator;

@ccclass('TipsAction')
export class TipsAction extends Component {
    private label: Label = null;
    private icon: Node = null;

    protected onLoad(): void {
        this.label = this.node.getChildByName('Label')?.getComponent(Label);
        this.icon = this.node.getChildByName('bs_ai');
        this.node.active = false;
    }

    show(text: string, duration: number = 2, show_icon: boolean = false): void {
        if (this.label) this.label.string = text;
        if (this.icon) this.icon.active = show_icon;
        this.node.active = true;
        this.node.setPosition(0, 0);
        Tween.stopAllByTarget(this.node);
        tween(this.node)
            .delay(duration)
            .call(() => {
                this.node.active = false;
            })
            .start();
    }
}
