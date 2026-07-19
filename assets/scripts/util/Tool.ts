import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Tool')
export class Tool {
    static clearFromParent(node: Node, co: any) {
        //创建一个空数组用于存储制定组件的子节点
        let arr = [];
        //便利输入节点的所有子节点
        node.children.forEach((element) => {
            if (element.getComponent(co)) {
                arr.push(element);
            }
        });
        //便利数组中的每个元素（子节点），将其从父节点中移除
        arr.forEach((element) => {
            element.removeFromParent();
        })
    }

    public static random_between_floor(min: number, max: number): number {
        let ret = Math.random() * (max - min) + min;
        return Math.floor(ret);
    }
    public static random_between(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }
}


