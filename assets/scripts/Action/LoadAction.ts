import { _decorator, Component, Node, Sprite, UITransform } from 'cc';
import { Global } from '../util/Global';
const { ccclass } = _decorator;

@ccclass('LoadAction')
export class LoadAction extends Component {
    private loadfill: Node = null;
    private loadfill_sprite: Sprite = null;
    private indicator: Node = null;
    private bar_width: number = 634;

    protected onLoad(): void {
        this.loadfill = this.node.getChildByName('loadfill');
        this.loadfill_sprite = this.loadfill?.getComponent(Sprite);
        this.indicator = this.node.getChildByName('Node');
        let uitransform = this.loadfill?.getComponent(UITransform);
        if (uitransform) this.bar_width = uitransform.width;
        Global.load_action = this;
        console.log('LoadAction.onLoad, loadfill:', !!this.loadfill, 'sprite:', !!this.loadfill_sprite, 'indicator:', !!this.indicator, 'bar_width:', this.bar_width);
        this.refresh();
    }

    public refresh(): void {
        let progress = 0;
        if (Global.current_level_pin_total > 0) {
            progress = Global.current_level_pin_move_num / Global.current_level_pin_total;
            if (progress > 1) progress = 1;
            if (progress < 0) progress = 0;
        }
        console.log('LoadAction.refresh, move:', Global.current_level_pin_move_num, 'total:', Global.current_level_pin_total, 'progress:', progress);
        if (this.loadfill_sprite) {
            this.loadfill_sprite.fillRange = progress;
        }
        if (this.indicator) {
            let x = (progress - 0.5) * this.bar_width;
            this.indicator.setPosition(x, 0, 0);
        }
    }
}
