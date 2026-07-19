import { _decorator, AudioClip, Component, Node, Prefab } from 'cc';

export const events={
    check_complete: "check_complete",
    check_empty_hole: "check_empty_hole",
    remove_element: "remove_element",
}

export const Clips={
    btn_1: "btn_2",
    btn_2: "btn_2",
    complete_1: "complete_1",
    complete_2: "complete_2",
    drill: "drill",
    pin_1: "pin_1",
    pin_2: "pin_2",
    pin_3: "pin_3",
    duang: "duang",
    popup: "popup",
    coins: "coins",
    reng: "reng",
    fail: "fail",
}
export const AssetType={
    Prefab:{type:Prefab,path:"Preload/Prefabs/"},
    Sound:{type:AudioClip,path:"Preload/Clips/"}
}