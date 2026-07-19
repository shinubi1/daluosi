import { _decorator, Component, Node } from 'cc';
import { ColorData } from './ColorData';
import { Tool } from './util/Tool';
const { ccclass, property } = _decorator;

@ccclass('DataModel')
export class DataModel {
    public static base_color_arr = [
        //深青
        ColorData.new_bean(13, 105, 105, 10001),
        //紫色	137，89，211
        ColorData.new_bean(137, 89, 211, 10002),
        //171, 177, 187  灰白
        ColorData.new_bean(111, 111, 111, 10003),
        //黄色	208,191,109
        ColorData.new_bean(208, 191, 109, 10004),
        //粉色	211 , 139, 246
        ColorData.new_bean(211, 139, 246, 10005),
        //绿色	140-214-115
        ColorData.new_bean(140, 214, 115, 10006),
        //蓝色	36， 118-200
        ColorData.new_bean(36, 118, 200, 10007),
        //青色
        ColorData.new_bean(17, 215, 215, 10008),
        //255, 87, 51 橘红
        ColorData.new_bean(239, 91, 122, 10009),
    ];

    //随机基础颜色
    public static random_base_color() {
        DataModel.base_color_arr.sort(() => {
            return 0.5 - Math.random();
        })
    }

    private static level_color_arr = [];
    public static generate_level_color_arr(colornum: number) {
        DataModel.level_color_arr = [];
        for (let i = 0; i < DataModel.base_color_arr.length; i++) {
            DataModel.level_color_arr.push(DataModel.base_color_arr[i].clone());
            if (DataModel.level_color_arr.length >= colornum) {
                break;
            }
        }
    }

    private static level_color_index = 0;
    public static reset_level_color_index() {
        DataModel.level_color_index = 0;
    }
    public static get_level_color():ColorData{// 获取盒子颜色，按顺序返回颜色数据
        let ret=DataModel.level_color_arr[DataModel.level_color_index];
        DataModel.level_color_index+=1;
        if(DataModel.level_color_index>=DataModel.level_color_arr.length){
            DataModel.level_color_index=0;
        }
        if(ret==null){
            let r=Tool.random_between_floor(1,255);
            let g=Tool.random_between_floor(1,255);
            let b=Tool.random_between_floor(1,255);
            ret=ColorData.new_bean(r,g,b,Tool.random_between_floor(20000,150000));
            console.log("未找到对应color颜色",DataModel.level_color_index,"",DataModel.level_color_arr);
        }
        return ret;
    }

    private static layer_color_index=0; // 当前使用的颜色索引
    public static get_layer_color():ColorData{ // 获取图层颜色，按顺序返回颜色数据
        let ret=DataModel.base_color_arr[DataModel.layer_color_index] // 根据当前索引获取颜色数据
        DataModel.layer_color_index+=1; // 颜色索引递增
        if(DataModel.layer_color_index>=DataModel.base_color_arr.length){ // 如果颜色索引超出数组长度
            DataModel.layer_color_index=0; // 重置颜色索引为0
        }
        return ret; // 返回获取的颜色数据
    }

    // 当前碰撞组的索引
    private static current_group_index=0;
    // 获取一个新的组索引值，该值是基于当前组索引的2的幂次方
    public static get_new_group_index(){
        let temp=1<<DataModel.current_group_index;
        DataModel.current_group_index+=1;
        if(DataModel.current_group_index>30){
            DataModel.current_group_index=0;
        }
        return temp;
    }
}


