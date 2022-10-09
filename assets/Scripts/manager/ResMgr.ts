/*
 * @Descripttion: 
 * @version: 
 * @Author: iwae
 * @Date: 2022-01-01 23:40:30
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-09-27 10:58:30
 */

import { AssetManager, assetManager, AudioClip, director, ImageAsset, instantiate, JsonAsset, Node, Prefab, SkinnedMeshRenderer, Sprite, SpriteAtlas, SpriteFrame, Texture2D, TextureCube } from "cc"
import { AssetType } from "../enum/Enums";
import { Global } from "../Global";
import { PoolMgr } from "./PoolMgr";

export default class ResMgr {
    private _abBundleMap: Object = {};
    private _atlasMap = {};
    public _jsonAssetMap = {};
    public _clipMap = {};
    public _loadStemp = null;
    private loadTime = 0;
    _totalTime = 0

    private static _ins: ResMgr = null;
    public static get ins() {
        if (!this._ins) {
            this._ins = new ResMgr();
        }

        return this._ins;
    }

    printTimer(name: string = "", end = false) {
        this.loadTime = Date.now() - this._loadStemp;
        this._loadStemp = Date.now();
        this._totalTime += this.loadTime
        console.log(name + "，load time===", this.loadTime, "ms")
        if (end) {
            console.log("Load finish, total time===", this._totalTime, "ms")
        }

    }

    /**
     * @description: Load assetbundle based on index
     * @param {number} index
     * @param {number} ratio
     * @return {*}
     */
    public async loadBundle(index: number, ratio: number = 0): Promise<void> {
        if (!this._loadStemp) this._loadStemp = Date.now();
        const rate = Global.LoadingRate;
        const name = "Bundle" + index
        return new Promise<void>((resolve, reject) => {
            assetManager.loadBundle(name, (err: any, bundle: any) => {
                if (err) {
                    console.error("Bundle" + index + " load error, error==", err)
                } else {
                    if (index != 2) this._abBundleMap[index] = bundle;
                    this.printTimer("Bundle" + index + "__" + "load success")
                    Global.LoadingRate = rate + ratio;
                    resolve && resolve();
                }
            })
        })
    }
    /**
     * @name: Load any res
     * @param {index} bunlde index
     * @param {type} res type from AssetType
     * @param {ratio} Res Loading ratiro, make sure the amount of all ratios is less than 1.0
     */
    public async loadRes(index: number, type: any, ratio: number = 0): Promise<void> {
        const rate = Global.LoadingRate;
        return new Promise<void>((resolve, reject) => {
            this._abBundleMap[index].loadDir(type.path, type.type, (finished: number, total: number) => {
                // this._loadTools.setValue(idx, finished / total); 
                if (ratio > 0) Global.LoadingRate = rate + ratio * finished / total
            }, (err: any, assets: any[]) => {
                if (err) {
                    console.error("Error===", err);
                    resolve && resolve();
                }
                let asset: any
                if (type == AssetType.Prefab) {
                    for (let i = 0; i < assets.length; i++) {
                        asset = assets[i];
                        PoolMgr.ins.setPrefab(asset.data.name, asset);
                        Global.Debug && console.log("prefab name==", asset.data.name)
                    }
                }
                if (type == AssetType.Sound) {
                    for (let i = 0; i < assets.length; i++) {
                        asset = assets[i];
                        Global.Debug && console.log("clip name==", asset.name)
                        if (!this._clipMap[asset.name]) this._clipMap[asset.name] = asset
                    }
                }
                if (type == AssetType.Atlas) {
                    for (let i = 0; i < assets.length; i++) {
                        asset = assets[i];
                        Global.Debug && console.log("atlas name==", asset.name)
                        if (!this._atlasMap[asset.name]) this._atlasMap[asset.name] = asset
                    }
                }
                if (type == AssetType.Json) {
                    for (let i = 0; i < assets.length; i++) {
                        asset = assets[i];
                        Global.Debug && console.log("json name==", asset.name)
                        if (!this._jsonAssetMap[asset.name]) this._jsonAssetMap[asset.name] = asset.json
                    }
                }
                this.printTimer("Bundle" + index + "__" + type.path + "loaded success")
                resolve && resolve();
            })
        })
    }

    public async loadBgm(): Promise<void> {
        let self = this
        return new Promise<void>((resolve, reject) => {
            this._abBundleMap[5].load("bgm", function (err, bgm: AudioClip) {
                if (err) {
                    console.error("Error info===", err);
                    resolve && resolve();
                }
                if (!self._clipMap[bgm.name]) self._clipMap[bgm.name] = bgm
                resolve && resolve();
            })
        }
        )
    }

    /**
   * @name: load any prefab
   * @param {index} bunlde index
   * @param {type} res type
   * @param {ratio} Res Loading ratiro, make sure the amount of all ratios is less than 1.0
   */
    public async loadPrefab(info): Promise<void> {
        const rate = Global.LoadingRate;
        return new Promise<void>((resolve, reject) => {
            this._abBundleMap[info.bundle].load(info.path + info.name, function (err, Prefab) {
                if (err) {
                    console.error("Error info===", err);
                    resolve && resolve();
                }
                PoolMgr.ins.setPrefab(info.name, Prefab);
                // console.log("预制体名字===", info.name);
                resolve && resolve();
            })
        }
        )
    }

    /**
     * @name: 加载天空盒
     */
    public async loadSkybox() {
        if (director.getScene().globals.skybox.envmap != null) return
        new Promise<void>((resolve, reject) => {
            this._abBundleMap[5].load("skybox", function (err, cubemap: TextureCube) {
                if (err) {
                    console.log("错误信息===", err);
                    resolve && resolve();
                }
                director.getScene().globals.skybox.envmap = cubemap;
                resolve && resolve();
            })
        }
        )
    }

    /** 
     * pre load&&make prefabs
    */
    public async preloadRes(name: string, count: number, ratio: number = 0): Promise<void> {
        const rate = Global.LoadingRate;

        return new Promise<void>((resolve, reject) => {
            let pre = PoolMgr.ins.getPrefab(name);
            for (let i = 0; i < count; i++) {
                PoolMgr.ins.putNode(instantiate(pre));
            }
            if (ratio > 0) Global.LoadingRate = rate + ratio
            this.printTimer("preload_" + name)
            resolve && resolve();
        })
    }
    public getAtlas(name: string): SpriteAtlas {
        return this._atlasMap[name];
    }


    /* get the prefabs from prefab config */
    public async getPrefab(prefabPath: any, parent?: Node) {

        if (PoolMgr.ins.getPrefab(prefabPath.name)) {
            return PoolMgr.ins.getNode(prefabPath.name, parent)
        }
        await this.loadPrefab(prefabPath)
        return PoolMgr.ins.getNode(prefabPath.name, parent)

    }


    /* get the json from preloade */
    public getJson(name: string) {
        return this._jsonAssetMap[name];
    }

    public getClip(name: string) {
        return this._clipMap[name];
    }


    public async getUI(Path, Parent?: Node) {
        if (Path.clear) {
            if (!Parent && Global.layer[Path.layer].children[0]) {
                if (Global.layer[Path.layer].children[0].name == Path.name) return
                PoolMgr.ins.putNode(Global.layer[Path.layer].children[0])
            }
        }
        let ParentNode = Parent ? Parent : Global.layer[Path.layer]
        return await this.getPrefab(Path, ParentNode)
    }



}