/*
 * @Author: your name
 * @Date: 2021-11-29 16:58:23
 * @LastEditTime: 2022-09-23 14:01:09
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \FireandWater\assets\Scripts\ToastCtrl.ts
 */

import { _decorator, Component, Node, LabelComponent, director, AnimationComponent, UIOpacity, Tween } from 'cc';
import { events } from './enum/Enums';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = ToastCtrl
 * DateTime = Mon Nov 29 2021 16:58:23 GMT+0800 (中国标准时间)
 * Author = iwae
 * FileBasename = ToastCtrl.ts
 * FileBasenameNoExtension = ToastCtrl
 * URL = db://assets/Scripts/ToastCtrl.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

@ccclass('ToastCtrl')
export class ToastCtrl extends Component {

    @property(LabelComponent)
    text: LabelComponent = null;

    @property(UIOpacity)
    toast: UIOpacity = null;

    private _tw = new Tween();
    private time = 1;

    onEnable() {
        director.on(events.Toast, this.showToast, this);
        this._tw.target(this.toast);
        this._tw.set({ opacity: 0 }).to(0.4, { opacity: 255 }).delay(this.time).to(0.2, { opacity: 0 });
    }

    onDisable() {
        director.off(events.Toast, this.showToast, this);
    }

    /* show toast */
    showToast(text, time = 1.5) {

        this.time = time;

        this.text.string = text;

        this._tw.stop();

        this._tw.start();

    }


}


