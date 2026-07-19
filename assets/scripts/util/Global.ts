import { _decorator } from "cc";
import { BucketAction } from "../Action/BucketAction";
import { CoinsAction } from "../Action/CoinsAction";
import { GameOverAction } from "../Action/GameOverAction";
import { GuideAction } from "../Action/GuideAction";
import { LayerBtnAction } from "../Action/LayerBtnAction";
import { LayerEmptyAction } from "../Action/LayerEmptyAction";
import { LayerRootAction } from "../Action/LayerRootAction";
import { LayerSlotAction } from "../Action/LayerSlotAction";
import { MenuAction } from "../Action/MenuAction";
import { PropsAction } from "../Action/PropsAction";
import { ShowLevelAction } from "../Action/ShowLevelAction";
import { SuccessAction } from "../Action/SuccessAction";
import { TipsAction } from "../Action/TipsAction";
import { Main } from "../Main";
const { ccclass, property } = _decorator;


export class Global {
    static loading_rate=0;
    static sound_switch: boolean = true;


    static layer_slot_action: LayerSlotAction;
    static layer_root_action: LayerRootAction;
    static layer_empty_action: LayerEmptyAction;
    static main_action: Main;
    static Show_level_action: ShowLevelAction;
    static game_over_action: GameOverAction;
    static coins_action: CoinsAction;
    static success_action: SuccessAction;
    static layer_btn_action: LayerBtnAction;
    static tips_action: TipsAction;
    static bucket_action: BucketAction;
    static props_action: PropsAction;
    static guide_action:GuideAction;
    static menu_action: MenuAction;
    
    static current_level_pin_total=0;//当前关卡的钉子总数
    static current_level_pin_move_num=0;//当前关卡的钉子被移走数量


    //当前金币
    static cur_coins=0;
    //使用当前道具需要多少金币
    static need_coins=30;

    //当前关卡
    static current_level=0;
    //从头开始游戏，进行默认设置
    public static restart_default(level=0) {
        Global.current_level=level;
        Global.cur_coins=0;
    }

    //每关开始前调用默认初始化
    public static every_level_default() {
        Global.current_level_pin_total=0;
        Global.current_level_pin_move_num=0;
        //TODO:重置垃圾桶里的钉子
        //TODO:重置引导
    }
    public static init_pin_info(total:number){
        Global.current_level_pin_total=total;
        Global.current_level_pin_move_num=0;
    }

    static ad_intersitial_id: string;
    static ad_video_id: string;
    static ad_banner_id: string;

    static is_check=false;
}


