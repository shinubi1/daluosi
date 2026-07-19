import { _decorator, Component, tween, UITransform, Vec3 } from 'cc';
import { PinAction } from './PinAction';
const { ccclass } = _decorator;

@ccclass('BucketAction')
export class BucketAction extends Component {
    public put_pin(pin: PinAction, delay: number = 0): void {
        let world_pos = pin.node.getWorldPosition();
        this.node.addChild(pin.node);
        let local = this.node.getComponent(UITransform).convertToNodeSpaceAR(world_pos);
        pin.node.setPosition(local);
        pin.remove_collider();
        tween(pin.node)
            .delay(delay)
            .to(0.4, { position: new Vec3(0, 0, 0), scale: new Vec3(0.3, 0.3, 1) }, { easing: 'quadIn' })
            .call(() => {
                pin.node.destroy();
            })
            .start();
    }
}
