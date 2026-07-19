import { _decorator, assetManager, Component, Node, resources } from 'cc';

import { ResourcePool } from '../ResourcePool';
import { AssetType } from '../util/Enums';
import { Global } from '../util/Global';
const { ccclass, property } = _decorator;

@ccclass('ResourceManager')
export class ResourceManager {
    private bundle_map: Object = {};
    public clip_map = {};
    private static rm: ResourceManager = null;
    public static get instance() {
        if (!this.rm) {
            this.rm = new ResourceManager();
        }
        return this.rm;
    }

    public async load_bundle(name: string, ratio: number = 0): Promise<void> {
        return new Promise((resolve, reject) => {
            assetManager.loadBundle(name, (err, bundle) => {
                if (err) {
                    console.error(name + " ----load bundle err:", err);
                    reject(err);
                    return;
                }
                this.bundle_map[name] = bundle;
                console.log(name + " ----load bundle success");
                Global.loading_rate = Global.loading_rate + ratio;
                resolve();
            })
        })
    }

    public async load_resource(name: string, type: any, ratio: number = 0): Promise<void> {
        let arr: number[] = [];
        return new Promise((resolve, reject) => {
            this.bundle_map[name].loadDir(type.path, type.type, (finished: number, total: number) => {
                let date = ratio * finished / total;
                arr.push(date);
                if (arr.length == 1) {
                    Global.loading_rate = Global.loading_rate + date;
                } else {
                    Global.loading_rate = Global.loading_rate + (arr[arr.length - 1] - arr[arr.length - 2]);
                }
            }, (err: any, assets: any[]) => {
                if (err) {
                    console.error("load_resource err:", err);
                    reject(err);
                    return;
                }
                assets.forEach(element => {
                    switch (type) {
                        case AssetType.Prefab:
                            ResourcePool.instance.set_prefab(element.data.name, element);
                            break;
                        case AssetType.Sound:
                            this.clip_map[element.name] = element;
                            break;
                    }
                })
                console.log(name + ">>" + type.path + "loaded success")
                resolve();
            })
        })

    }
    public get_clip(name: string) {
        return this.clip_map[name];
    }
}


