import { _decorator, CCString, Component, director, Node, Sprite } from 'cc';
import { AudioManager } from '../Manager/AudioManager';
import { ResourceManager } from '../Manager/ResourceManager';
import { Clips, AssetType } from '../util/Enums';
import { Global } from '../util/Global';
const { ccclass, property } = _decorator;

@ccclass('HomeAction')
export class HomeAction extends Component {
    @property(Sprite)
    loadfill: Sprite = null;
    private isload = true;
    load_num = 0;

    @property(CCString)
    ad_intersitial_id: string = '';
    @property(CCString)
    ad_video_id: string = '';
    @property(CCString)
    ad_banner_id: string = '';

    async start() {
        Global.ad_intersitial_id = this.ad_intersitial_id;
        Global.ad_video_id = this.ad_video_id;
        Global.ad_banner_id = this.ad_banner_id;
        await this.loadRes();
    }

    async loadRes() {
        director.preloadScene("Main", () => {
            console.log("main scene preload complete");
            AudioManager.instance.playSound(Clips.btn_1);
            director.loadScene("Main");
        })
        await ResourceManager.instance.load_bundle("bundle", 0.2)
        await ResourceManager.instance.load_resource("bundle", AssetType.Prefab, 0.6);
        await ResourceManager.instance.load_resource("bundle", AssetType.Sound, 0.22);
    }
    protected update(dt: number): void {
        if (!this.isload) return;
        this.loadfill.fillRange = Global.loading_rate;
    }
}


