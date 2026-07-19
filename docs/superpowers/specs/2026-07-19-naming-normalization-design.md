# 命名规范化重构设计

## 目标

修正项目中的拼写错误与不一致的缩写命名，提升代码可读性。原则：**不改 `@property` 字段名**（避免破坏场景/预制体序列化），**不改 localStorage key 字符串**（避免破坏用户存档）。

## 范围

### 第一档：拼写错误修正

| 原名 | 新名 | 类型 | 涉及文件 |
|---|---|---|---|
| `SoltAction` | `SlotAction` | 类名 + 文件名 + `@ccclass` 字符串 | SoltAction.ts -> SlotAction.ts, Main.ts, SoltColorRules.ts |
| `SoltColorRules` | `SlotColorRules` | 类名 + 文件名 | SoltColorRules.ts -> SlotColorRules.ts, SoltAction.ts(→SlotAction.ts) |
| `solt_color` | `slot_color` | SoltAction 内部字段 | SoltAction.ts |
| `solt_color_arr` | `slot_color_arr` | SoltColorRules 静态字段 | SoltColorRules.ts |
| `set_solt_color` | `set_slot_color` | SoltColorRules 方法 | SoltColorRules.ts |
| `get_next_solt_color` | `get_next_slot_color` | SoltColorRules 方法 | SoltColorRules.ts, SoltAction.ts |
| `get_solt_color_arr` | `get_slot_color_arr` | SoltAction 方法 | SoltAction.ts, SoltColorRules.ts |
| `get_solt_color` | `get_slot_color` | SoltAction 方法 | SoltAction.ts |
| `init_solt` | `init_slot` | SoltAction 方法 | SoltAction.ts |
| `lvl_aciton` | `level_action` | LayerRootAction 字段（`aciton` 拼写错误 + `lvl` 缩写） | LayerRootAction.ts, SoltColorRules.ts |
| `set_layer_bg_or_orgin` | `set_layer_bg_or_origin` | ElementAction 方法 | ElementAction.ts, LayerAction.ts |
| `deafult_position` | `default_position` | SoltAction 内部字段 | SoltAction.ts |
| `deafult_lock` | `default_lock` | SoltAction 内部字段 | SoltAction.ts |
| `into_scence` | `into_scene` | SoltAction 方法（`scence` -> `scene`） | SoltAction.ts, Main.ts |

### 第二档：内部缩写展开

| 原名 | 新名 | 位置 |
|---|---|---|
| `ele_color` | `element_color` | ElementAction 内部字段 |
| `opc_1` | `opacity_1` | ElementAction.flash_img 局部变量 |
| `opc_2` | `opacity_2` | ElementAction.flash_img 局部变量 |
| `cur_group_index` | `current_group_index` | DataModel 私有静态 |
| `lvl_color_arr` | `level_color_arr` | DataModel 私有静态 |
| `lvl_color_index` | `level_color_index` | DataModel 私有静态 |
| `generate_lvl_color_arr` | `generate_level_color_arr` | DataModel 公开方法 |
| `reset_lvl_color_index` | `reset_level_color_index` | DataModel 公开方法 |
| `get_lvl_color` | `get_level_color` | DataModel 公开方法 |

### 第三档：跨文件重命名（不影响场景/存档）

| 原名 | 新名 | 说明 |
|---|---|---|
| `LvLStorage` | `LevelStorage` | 类名 + 文件名 + `@ccclass` |
| `get_cur_lvl` | `get_current_level` | LvLStorage(→LevelStorage) 方法 |
| `record_cur_lvl` | `record_current_level` | LvLStorage 方法 |
| `get_history_lvl` | `get_history_level` | LvLStorage 方法 |
| `Global.cur_lvl` | `Global.current_level` | Global 静态字段 |
| `Global.cur_lvl_pin_total` | `Global.current_level_pin_total` | Global 静态字段 |
| `Global.cur_lvl_pin_move_num` | `Global.current_level_pin_move_num` | Global 静态字段 |
| `Main.next_lvl_check_complete` | `Main.next_level_check_complete` | Main 方法 |
| `Main.start_lvl` | `Main.start_level` | Main 方法 |
| `Main.restart_game` 中的局部 `lvl` | `level` | 局部变量 |
| `Main.start_lvl` 的参数 `_lvl` | `_level` | Main.ts 参数 |
| `Main.next_lvl_check_complete` 的参数 `soltAction` | `slotAction` | Main.ts 参数 |
| `LayerRootAction.lvl_aciton` | `level_action` | 已在第一档（同时是 typo + 缩写） |
| `LayerRootAction.lvl_node` | `level_node` | 局部变量 |
| `LayerRootAction.get_lvl_unit` | `get_level_unit` | 私有方法 |
| `LayerRootAction.init_root` 的参数 `lvl` | `level` | 参数 |
| `LevelAction` 中的局部 `lvl` 参数 | `level` | 局部变量 |

### 不改的项（第四档，跳过）

- 所有 `@property` 字段：`buc_action`、`layer_root`、`layer_slot`、`layer_empty`、`menu`、`need_coins`、`game_over_action`、`coins_action`、`success_action`、`tips_action`、`props_action`、`guide_action`、`show_level_action`、`layer_btn_action`、`box_1_img`、`box_2_img`、`lock` 等
- localStorage key 字符串：`"cur_lvl"`、`"history_lvl"` 保持不变
- 场景中节点名：`"cur_lvl"` 节点名保持不变
- 预制体资源名：`"lvl_" + lvl`、`"lvl_x"`、`"lvl_1"` 等是预制体文件名查找字符串，改了需要同步重命名预制体文件，跳过
- `Main.need_coins` 中 tooltip 文本 `"基础扳手的消耗,实际消耗为lvl*need_coins"` 中的 `lvl` 是中文 tooltip 描述，不改
- `isLocked`、`is_check`、`is_Locked` 等 `is*` 命名风格不一致问题：风格偏好非拼写错误，跳过

## 验证策略

1. 重命名后用 `grep` 确认无残留旧名（除 localStorage key 字符串与场景节点名）
2. 用 `npx tsc --noEmit` 检查 TypeScript 编译（项目已有 tsconfig.json）
3. 检查所有 `import { SoltAction }` / `import { SoltColorRules }` / `import { LvLStorage }` 是否已更新
4. 验证 `@ccclass('SoltAction')` 等字符串是否同步更新

## 风险与回滚

- 风险点：`@ccclass` 字符串改了但场景中若以类名方式引用会失效。已验证场景文件中没有以类名字符串引用 `SoltAction`/`SoltColorRules`/`LvLStorage`，使用 UUID 引用，故安全。
- 回滚：所有改动可通过 `git checkout` 回滚。
