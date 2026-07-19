import { _decorator, CCInteger, Component, director, Node } from 'cc';
import { LayerRootAction } from './Action/LayerRootAction';
import { LayerSlotAction } from './Action/LayerSlotAction';
import { LayerEmptyAction } from './Action/LayerEmptyAction';
import { ShowLevelAction } from './Action/ShowLevelAction';
import { MenuAction } from './Action/MenuAction';
import { GameOverAction } from './Action/GameOverAction';
import { CoinsAction } from './Action/CoinsAction';
import { SuccessAction } from './Action/SuccessAction';
import { LayerBtnAction } from './Action/LayerBtnAction';
import { TipsAction } from './Action/TipsAction';
import { BucketAction } from './Action/BucketAction';
import { PropsAction } from './Action/PropsAction';
import { GuideAction } from './Action/GuideAction';
import { Global } from './util/Global';
import { LevelStorage } from './util/LevelStorage';
import { events } from './util/Enums';
import { SlotAction } from './Action/SlotAction';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {
    @property(LayerRootAction)
    layer_root: LayerRootAction
    @property(LayerSlotAction)
    layer_slot: LayerSlotAction
    @property(LayerEmptyAction)
    layer_empty: LayerEmptyAction
    @property(ShowLevelAction)
    show_level_action: ShowLevelAction

    @property(MenuAction)
    menu: MenuAction
    @property(GameOverAction)
    game_over_action: GameOverAction
    @property(CoinsAction)
    coins_action: CoinsAction
    @property(SuccessAction)
    success_action: SuccessAction
    @property(LayerBtnAction)
    layer_btn_action: LayerBtnAction
    @property(TipsAction)
    tips_action: TipsAction

    @property(BucketAction)
    buc_action: BucketAction

    @property(PropsAction)
    props_action: PropsAction
    @property(GuideAction)
    guide_action: GuideAction

    @property({ type: CCInteger, tooltip: "基础扳手的消耗,实际消耗为lvl*need_coins" })
    need_coins: number;

    protected onLoad(): void {
        director.on(events.check_complete,this.next_level_check_complete,this);
    }
    protected start(): void {
        Global.need_coins = this.need_coins;
        Global.layer_root_action = this.layer_root;
        Global.layer_slot_action = this.layer_slot;
        Global.layer_empty_action = this.layer_empty;
        Global.main_action = this;
        Global.Show_level_action = this.show_level_action;
        Global.game_over_action = this.game_over_action;
        Global.coins_action = this.coins_action;
        Global.success_action = this.success_action;
        Global.layer_btn_action = this.layer_btn_action;
        Global.tips_action = this.tips_action;
        Global.bucket_action = this.buc_action;
        Global.props_action = this.props_action;
        Global.guide_action = this.guide_action;
        this.restart_game();
    }

    restart_game(): void {
        localStorage.setItem("cur_lvl", 1+ "");
        let level = LevelStorage.get_current_level();
        Global.restart_default(level);
        this.start_level(level);
    }

    start_level(_level: number) {
        Global.is_check=true;
        //记录关卡信息
        LevelStorage.record_current_level(_level);
        //重置 钉子 金币等信息
        Global.every_level_default();

        console.log("开始游戏 >>>>", _level);
        //TODO:实例化根图层关卡面板
        this.layer_root.init_root(_level);
        //TODO:初始化显示关卡
        Global.Show_level_action.show_level();
        //TODO:重置技能限制
        //TODO:初始化显示金币
        Global.is_check=false;
    }
    next_level_check_complete(slotAction:SlotAction) {
        if(Global.current_level_pin_move_num>=Global.current_level_pin_total){
            Global.success_action.open();
        }else{
            slotAction.into_scene();
        }
    }
}