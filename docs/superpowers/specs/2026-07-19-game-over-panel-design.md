# 游戏失败判定与 game_over 面板设计

## 目标

当玩家把所有空槽位（LayerEmptyAction）都填满钉子后仍无法继续（即卡死），弹出 game_over 面板，让玩家选择重玩本关或回到第 1 关。

## 背景

- [LayerEmptyAction](../../../assets/scripts/Action/LayerEmptyAction.ts) 是预备孔位容器，玩家点击钉子但当前没有匹配颜色的插槽可放时，钉子会进入空槽位
- [LayerSlotAction.check_empty_hole](../../../assets/scripts/Action/LayerSlotAction.ts#L69) 在钉子进入空槽位后被触发，会调用 `slot.load_pin()` 自动把空槽位里匹配颜色的钉子装到插槽里
- [GameOverAction](../../../assets/scripts/Action/GameOverAction.ts) 当前是空 stub
- game_over 面板节点在场景里已建好，包含 `btn_restart`、`btn_go_lvl_1`、`history`（含 `history_lvl_label`）、`fail` 等

## 范围

### 实现

1. `LayerEmptyAction` 加 `is_full()` 方法
2. `LayerSlotAction.check_empty_hole` 末尾检测 `is_full()`，触发 `GameOverAction.open()`
3. `GameOverAction` 完整实现：显示面板、显示历史最高关卡、接线两个按钮

### 不实现

- 看广告复活（需广告 SDK）
- game_over 面板入场动画
- 其他装饰性文案

## 详细设计

### 1. LayerEmptyAction.ts - 新增 is_full()

```typescript
public is_full(): boolean {
    for (let i = 0; i < this.node.children.length; i++) {
        let empty_hole_action = this.node.children[i].getComponent(EmptyHoleAction);
        if (empty_hole_action?.can_able_put()) {
            return false;
        }
    }
    return true;
}
```

利用 `EmptyHoleAction.can_able_put()`（已有方法）判断每个空槽位是否还能放钉子。任一空槽位能放就返回 false。

### 2. LayerSlotAction.ts - 在 check_empty_hole 末尾检测

```typescript
check_empty_hole(pin:PinAction){
    let slot=this.preput_to_slot(pin);
    if(slot){
        console.log("check_empty_hole",slot.node.name);
        slot.load_pin();
    }
    // 自动装载后如果空槽位还是满的，说明玩家卡死
    if (Global.layer_empty_action.is_full()) {
        Global.game_over_action.open();
    }
}
```

**为什么放在 `slot.load_pin()` 之后**：玩家把钉子放进空槽位后，自动装载会尝试把空槽位里的钉子装到匹配颜色的插槽里。要等这个装载完才能判断是否真的卡死。`slot.load_pin()` 内部 `put_pin` 会同步 reparent 钉子，所以装载完后 `is_full()` 检测是准确的。

### 3. GameOverAction.ts - 完整实现

```typescript
import { _decorator, Button, Component, Label, Node, Widget } from 'cc';
import { Global } from '../util/Global';
import { LevelStorage } from '../util/LevelStorage';
import { AudioManager } from '../Manager/AudioManager';
import { Clips } from '../util/Enums';
const { ccclass, property } = _decorator;

@ccclass('GameOverAction')
export class GameOverAction extends Component {
    private btn_restart: Node = null;
    private btn_go_lvl_1: Node = null;
    private history_lvl_label: Label = null;

    protected onLoad(): void {
        this.node.active = false;
        let widget = this.node.getComponent(Widget);
        if (widget) widget.enabled = false;
        this.node.setPosition(0, 0);
        this.btn_restart = this.node.getChildByName('btn_restart');
        this.btn_go_lvl_1 = this.node.getChildByName('btn_go_lvl_1');
        let history_node = this.node.getChildByName('history');
        this.history_lvl_label = history_node?.getChildByName('history_lvl_label')?.getComponent(Label);

        this.btn_restart?.on(Button.EventType.CLICK, this.on_restart_click, this);
        this.btn_go_lvl_1?.on(Button.EventType.CLICK, this.on_go_lvl_1_click, this);
    }

    open() {
        this.node.active = true;
        this.node.setPosition(0, 0);
        Global.is_check = true;
        if (this.history_lvl_label) {
            this.history_lvl_label.string = LevelStorage.get_history_level() + "";
        }
        AudioManager.instance.playSound(Clips.fail);
    }

    private on_restart_click() {
        this.node.active = false;
        Global.main_action.start_level(Global.current_level);
    }

    private on_go_lvl_1_click() {
        this.node.active = false;
        Global.main_action.start_level(1);
    }
}
```

**关键点**：
- `onLoad` 禁用 Widget（game_over 节点的 Widget `_alignMode: 2` ALWAYS + `_left: 878, _right: -878` 把节点停屏幕外，会和 `setPosition` 冲突，和 success 面板同样问题）
- `history_lvl_label` 在 `history` 子节点下，需要两层 `getChildByName`
- `open()` 调用 `LevelStorage.get_history_level()` 显示历史最高关卡（localStorage `history_lvl`）
- `on_restart_click` 调 `start_level(current_level)` 重玩本关；`start_level` 内部会重置 `is_check=false` 和 `current_level_pin_move_num=0`
- `on_go_lvl_1_click` 调 `start_level(1)` 回第 1 关

### 数据流

```
玩家点击钉子 -> PinAction.touch_start
   ↓
先尝试 layer_slot_action.put_pin（放进插槽）
   ↓ 失败（插槽颜色不匹配或都满了）
layer_empty_action.put_pin（放进空槽位）
   ↓
EmptyHoleAction.tween_play 动画
   ↓ 动画结束
emit check_empty_hole
   ↓
LayerSlotAction.check_empty_hole:
   1. preput_to_slot(pin) 找能装这个钉子的插槽
   2. 如果找到，slot.load_pin() 自动装载匹配颜色的钉子
   3. 检查 is_full() - 如果还是满的 -> GameOverAction.open()
   ↓
玩家点 btn_restart -> start_level(current_level)  [重玩本关]
玩家点 btn_go_lvl_1 -> start_level(1)  [回第 1 关]
```

## 验证

1. TypeScript 编译：`tsc --noEmit -p tsconfig.json`（仅看 assets/scripts 路径下的错误）
2. 手动验证：
   - 进入关卡，故意把钉子全放进空槽位（让插槽颜色都不匹配）
   - 空槽位填满后，game_over 面板应弹出
   - `history_lvl_label` 显示历史最高关卡
   - 点 `btn_restart` 重玩本关，钉子/插槽重置
   - 点 `btn_go_lvl_1` 回到第 1 关
3. 边界：自动装载后空槽位有空位 -> 不应弹 game_over

## 风险

- **场景节点名依赖**：实现依赖 game_over 节点下有 `btn_restart`、`btn_go_lvl_1`、`history`（含子节点 `history_lvl_label`）。已通过解析 Main.scene 确认存在。
- **Widget 干扰**：game_over 节点本身有 Widget（AlignMode=ALWAYS），会和 `setPosition` 冲突。`onLoad` 中禁用 Widget 解决。
- **检测时机**：`is_full()` 在 `slot.load_pin()` 之后调用，依赖 `load_pin` 内部 `put_pin` 同步 reparent 钉子。已确认 `SlotAction.put_pin` 在调用 `tween_play` 前就 `addChild`，所以同步生效。
- **success 面板已弹出的情况下不该再触发 game_over**：实际不会发生，因为 success 弹出时 `Global.is_check=true`，玩家无法再操作钉子。
