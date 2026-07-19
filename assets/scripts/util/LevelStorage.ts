import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LevelStorage')
export class LevelStorage {

    public static get_current_level(): number {
        let stored = localStorage.getItem("cur_lvl");
        if (!stored) {
            localStorage.setItem("cur_lvl", 1 + "");
            return 1
        } else {
            let level: number = Number(stored);
            return level;
        }
    }

    public static get_history_level(): number {
        let stored = localStorage.getItem("history_lvl");
        if (!stored) {
            localStorage.setItem("history_lvl", 1 + "");
            return 1;
        } else {
            let level: number = Number(stored);
            return level;
        }
    }
    public static record_current_level(level: number): void {
        localStorage.setItem("cur_lvl", level + "");
        let stored = localStorage.getItem("history_lvl");
        if (!stored) {
            localStorage.setItem("history_lvl", level + "");
        } else {
            let hs: number = Number(stored);
            if (level > hs) {
                localStorage.setItem("history_lvl", level + "");
            }
        }
    }
}
