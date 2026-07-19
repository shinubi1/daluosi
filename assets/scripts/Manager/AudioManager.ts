import { _decorator, AudioSourceComponent, Component, Node } from 'cc';
import { Clips } from '../util/Enums';
import { Global } from '../util/Global';
import { ResourceManager } from './ResourceManager';

const { ccclass, property } = _decorator;

@ccclass('AudioManager')
export class AudioManager  {
    private asc:AudioSourceComponent=null;
    private static am:AudioManager=null;
    public static get instance(){
        if(!this.am){
            this.am=new AudioManager();
            this.am.asc=new AudioSourceComponent();
            this.am.asc.loop=true;
        }
        return this.am;
    }

    public async playSound(audio:string,volumeScale:number=1){
        if(!Global.sound_switch) return;
        switch(audio){
            case Clips.reng:
                volumeScale=0.2;
                break;
            case Clips.btn_1:
                volumeScale=0.5;
                break;
            case Clips.complete_1:
                volumeScale=0.3;
                break;
        }

        let clip=await ResourceManager.instance.get_clip(audio);
        if(!clip){
            console.error("声音播放错误:",audio)
        }else{
            this.asc.playOneShot(clip,volumeScale);
        }
    }
}


