# 关卡结束检测功能设计

## 目标

实现"检查是否全部消除，关卡结束"功能，让玩家清空所有钉子后弹出 success 面板，点击下一关按钮进入下一关。

## 背景

现有代码 [SlotAction.ts:191](../../../assets/scripts/Action/SlotAction.ts#L191) 留有 TODO 标注此功能未实现。具体缺陷：

1. `Global.current_level_pin_move_num` 从未被递增（[Global.ts:38](../../../assets/scripts/util/Global.ts#L38) 仅初始化为 0），导致 [Main.ts:101](../../../assets/scripts/Main.ts#L101) 的 `current_level_pin_move_num >= current_level_pin_total` 判断永远为 false
2. [SuccessAction.open()](../../../assets/scripts/Action/SuccessAction.ts#L13) 是空实现
3. success 面板上的 `btn_next`、`btn_get_coins` 按钮无点击响应

## 范围

### 实现

1. 在 `SlotAction.full_complete()` 中递增 `current_level_pin_move_num`
2. 实现 `SuccessAction`：显示面板、初始化按钮、更新文案
3. 接线 `btn_next` 点击 -> 进入下一关

### 不实现

- `btn_get_coins` 看广告领扳手（需广告 SDK，只放按钮音占位）
- 游戏失败/无解判定（不在本次范围）
- success 面板入场动画（不破坏场景中已有的 tween）

## 详细设计

### 1. SlotAction.ts - 递增计数器

[SlotAction.ts:174-195](../../../assets/scripts/Action/SlotAction.ts#L174-L195) 的 `full_complete()` 中，在 `clear_pins()` 之前捕获钉子数，在 `emit` 之前递增计数器：

```typescript
.call(() => {
    AudioManager.instance.playSound(Clips.pin_3);
    this.slot_color = null;
    let eliminated = this.get_pin_num();  // 清空前捕获
    this.clear_pins();
    Global.current_level_pin_move_num += eliminated;  // 新增
    director.emit(events.check_complete, this)
})
```

**为什么用 `get_pin_num()` 而不是硬编码 3**：插槽的孔位数由预制体决定，不同插槽可能孔位数不同。`get_pin_num()` 在 `clear_pins()` 之前调用能拿到当前实际填入的钉子数。

**为什么在 emit 之前递增**：`Main.next_level_check_complete` 同步执行，递增后 emit 才能让判断读到最新值。

### 2. SuccessAction.ts - 实现 success 面板

success 面板节点结构（场景里已建好，全是 `success` 节点的直接子节点）：
- `btn_next`（Button 组件）- 下一关按钮
- `btn_get_coins`（Button 组件）- 领扳手按钮
- `lvl`（Label 组件）- 下一关关卡数字
- `coins_label`（Label 组件）- 当前扳手数量（注意：项目里 coins 命名实际指扳手，见 [coins-actually-wrenches](../../../../../.claude/projects/-Users-lindan-CocosProject-daluosi2/memory/coins-actually-wrenches.md) 记忆）

实现：

```typescript
import { _decorator, Button, Component, Label, Node } from 'cc';
import { Global } from '../util/Global';
import { AudioManager } from '../Manager/AudioManager';
import { Clips } from '../util/Enums';
const { ccclass, property } = _decorator;

@ccclass('SuccessAction')
export class SuccessAction extends Component {
    private btn_next: Node = null;
    private btn_get_coins: Node = null;
    private lvl_label: Label = null;
    private coins_label: Label = null;

    protected onLoad(): void {
        this.node.active = false;
        this.btn_next = this.node.getChildByName('btn_next');
        this.btn_get_coins = this.node.getChildByName('btn_get_coins');
        this.lvl_label = this.node.getChildByName('lvl')?.getComponent(Label);
        this.coins_label = this.node.getChildByName('coins_label')?.getComponent(Label);

        this.btn_next?.on(Button.EventType.CLICK, this.on_next_click, this);
        this.btn_get_coins?.on(Button.EventType.CLICK, this.on_get_coins_click, this);
    }

    open() {
        this.node.active = true;
        Global.is_check = true;
        if (this.lvl_label) {
            this.lvl_label.string = (Global.current_level + 1) + "";
        }
        if (this.coins_label) {
            this.coins_label.string = Global.cur_coins + "";
        }
        AudioManager.instance.playSound(Clips.complete_1);
    }

    private on_next_click() {
        this.node.active = false;
        Global.main_action.start_level(Global.current_level + 1);
    }

    private on_get_coins_click() {
        AudioManager.instance.playSound(Clips.btn_1);
    }
}
```

**关键点**：
- `onLoad` 中 `this.node.active = false` 隐藏面板，避免场景加载时闪现（onLoad 在首帧渲染前执行）
- 用 `getChildByName` 而非 `@property`，无需在 Cocos Creator 编辑器里手动拖拽节点
- `open()` 中 `Global.is_check = true` 阻止玩家继续操作钉子（[PinAction.touch_start](../../../assets/scripts/Action/PinAction.ts#L40) 检查此标志）
- `on_next_click` 调用 `start_level(current_level + 1)`，`start_level` 内部会调用 `every_level_default()` 重置 `current_level_pin_move_num = 0` 和 `is_check = false`

### 3. 数据流

```
玩家填满插槽 -> SlotAction.full_complete()
   |
   | 捕获 eliminated = get_pin_num()
   | clear_pins()
   | current_level_pin_move_num += eliminated
   |
   v
director.emit(events.check_complete, this)
   |
   v
Main.next_level_check_complete(slotAction):
   if (current_level_pin_move_num >= current_level_pin_total)
       -> Global.success_action.open()  [关卡结束]
   else
       -> slotAction.into_scene()  [继续出下一个插槽]
   |
   v
玩家点 btn_next -> on_next_click()
   |
   v
Global.main_action.start_level(current_level + 1)
   |
   v
every_level_default() 重置 move_num=0
is_check = false（start_level 末尾）
```

## 验证

1. TypeScript 编译：`tsc --noEmit -p tsconfig.json`（仅看 assets/scripts 路径下的错误）
2. 手动验证流程：
   - 进入关卡，填满所有插槽
   - 最后一个插槽清空后，success 面板应弹出
   - 面板上 `lvl` 显示 `当前关卡+1`，`coins_label` 显示当前扳手数
   - 点击 `btn_next` 进入下一关，面板隐藏，钉子/插槽重置
3. 边界：如果玩家在最后一个插槽清空瞬间快速点击钉子，`is_check=true` 应阻止误操作

## 风险

- **场景节点名**：实现依赖 `success` 节点下有名为 `btn_next`、`btn_get_coins`、`lvl`、`coins_label` 的子节点。已通过解析 [Main.scene](../../../assets/scenes/Main.scene) 确认这些节点存在。
- **场景初始可见性**：success 节点在场景里 `_active` 默认为 true，依赖 `onLoad` 中 `active=false` 隐藏。若发现首帧闪现，需改为在场景文件中设置 `_active: false`。
- **`start_level` 调用链**：`start_level` 末尾会 `is_check=false`，所以 `on_next_click` 不需要显式管理 `is_check`。
