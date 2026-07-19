import { _decorator, Animation, Component, input, Input, Node, UITransform } from 'cc';
import { Global } from '../util/Global';
const { ccclass, property } = _decorator;

@ccclass('GuideAction')
export class GuideAction extends Component {
    private idle_time: number = 0;
    private readonly idle_threshold: number = 10;
    private is_showing: boolean = false;
    private animation: Animation = null;
    private inner_guide: Node = null;

    protected onLoad(): void {
        this.inner_guide = this.node.getChildByName('guide');
        this.inner_guide.active = false;
        this.animation = this.inner_guide?.getComponent(Animation);
        input.on(Input.EventType.TOUCH_START, this.on_touch, this);
    }

    protected onDestroy(): void {
        input.off(Input.EventType.TOUCH_START, this.on_touch, this);
    }

    public reset(): void {
        this.idle_time = 0;
        if (this.is_showing) this.hide();
    }

    update(deltaTime: number) {
        if (Global.is_check) {
            this.idle_time = 0;
            if (this.is_showing) this.hide();
            return;
        }
        if (this.is_showing) return;
        this.idle_time += deltaTime;
        if (this.idle_time >= this.idle_threshold) {
            this.show();
        }
    }

    private on_touch() {
        this.idle_time = 0;
        if (this.is_showing) this.hide();
    }

    private show() {
        this.is_showing = true;
        let layer_btn = Global.layer_btn_action?.node;
        if (!layer_btn || layer_btn.children.length === 0) return;
        let target = layer_btn.children[Math.floor(Math.random() * layer_btn.children.length)];
        let target_world = target.getWorldPosition();
        let parent = this.node.parent;
        if (parent) {
            let local_pos = parent.getComponent(UITransform).convertToNodeSpaceAR(target_world);
            this.node.setPosition(local_pos);
        }
        if (this.inner_guide) this.inner_guide.active = true;
        this.animation?.play();
    }

    private hide() {
        this.is_showing = false;
        if (this.inner_guide) this.inner_guide.active = false;
        this.animation?.stop();
    }
}
