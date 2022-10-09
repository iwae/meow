/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-09-21 16:08:59
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-09-25 19:26:31
 * @FilePath: /yangyang/assets/Scripts/ctrl/LoadCtrl.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { _decorator, Component, Sprite } from 'cc';
import { Global } from '../Global';
import { Tools } from '../utils/Tools';
const { ccclass, property } = _decorator;

@ccclass('LoadCtrl')
export class LoadCtrl extends Component {

    @property(Sprite)
    load: Sprite = null;

    private isload = true;


    closeLoad() {
        this.isload = false;
        Tools.clearUI(this.node);
    }




    update(deltaTime: number) {
        if (!this.isload) return;

        this.load.fillRange = Global.LoadingRate;
        if (Global.LoadingRate >= 0.99) {
            this.closeLoad();
        }

    }
}

