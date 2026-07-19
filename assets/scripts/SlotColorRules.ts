import { PinAction } from "./Action/PinAction";
import { ColorData } from "./ColorData";
import { Global } from "./util/Global";


export class SlotColorRules {
   public static slot_color_arr: ColorData[];

   //设置插槽盒颜色的数组
   public static set_slot_color(color_arr: ColorData[]): void {
      SlotColorRules.slot_color_arr = color_arr
   }
   public static r_0(): PinAction[] {
      let pin_arr: PinAction[] = [];
      //TODO:获取垃圾桶里的钉子
      //TODO:获取预备槽位里的钉子
      let layer_pin_colors_arr = Global.layer_root_action.level_action.get_pin_color();
      layer_pin_colors_arr.forEach(element => {
         pin_arr.push(element);
      });
      return pin_arr;
   }
   public static r_1(): PinAction[] {
      let pin_arr: PinAction[] = [];
      //TODO:获取垃圾桶里的钉子
      //TODO:获取预备槽位里的钉子
      return pin_arr;
   }
   public static r_2(): PinAction[] {
      let pin_arr: PinAction[] = [];
      //TODO:获取预备槽位里的钉子
      return pin_arr;
   }
   public static r_3(): PinAction[] {
      let pin_arr: PinAction[] = [];
      //TODO:获取垃圾桶里的钉子
      return pin_arr;
   }
   public static r_4(): PinAction[] {
      let pin_arr: PinAction[] = [];
      return pin_arr;
   }
   //获取下一个插槽盒颜色
   public static get_next_slot_color(pin_arr: PinAction[]): ColorData {
      console.log("获取slot颜色>>>>>");
      let slot_color_arr = Global.layer_slot_action.get_slot_color_arr();

      let ret: ColorData = null;

      for (let i = 0; i < pin_arr.length; i++) {
         let pin = pin_arr[i];
         if (!pin) {
            continue;
         }
         if (!pin.pin_color) {
            continue;
         }
         let color_same = false;
         for (let j = 0; j < slot_color_arr.length; j++) {
            if (slot_color_arr[j].id == pin.pin_color.id) {
               color_same = true;
               break;
            }
         }
         if (color_same) continue;
         ret = SlotColorRules.get_the_color(pin.pin_color);
         if (ret) break;
      }
      if (!ret) {
         ret = SlotColorRules.get_shift_color();
      }
      return ret;
   }

   //取出特定颜色的方法
   public static get_the_color(color: ColorData): ColorData {
      let temp = [];
      let ret: ColorData = null;

      for (let i = 0; i < SlotColorRules.slot_color_arr.length; i++) {
         let c = SlotColorRules.slot_color_arr[i];
         if (ret == null) {
            if (c.id == color.id) {
               ret = c;
            } else {
               temp.push(c);
            }
         } else {
            temp.push(c);
         }
      }
      if (ret !== null) {
         SlotColorRules.set_slot_color(temp);
      }
      return ret;
   }
   //弹出slot盒的第一个颜色
   private static get_shift_color(): ColorData {
      return SlotColorRules.slot_color_arr.shift();
   }
}


