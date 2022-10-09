/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-09-19 10:44:40
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-09-27 10:47:23
 * @FilePath: /yangyang/assets/Scripts/view/HomeView.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { _decorator, Component, Node, director, Widget, tween, Vec3 } from 'cc';
import { events, ui } from '../enum/Enums';
import { Main } from '../Main';
import { LevelMgr } from '../manager/LevelMgr';
import ResMgr from '../manager/ResMgr';
import { Tools } from '../utils/Tools';
import { BaseView } from './BaseView';
const { ccclass, property } = _decorator;

@ccclass('HomeView')
export class HomeView extends BaseView {

    @property(Node)
    StartBtn: Node = null;


    /* start Game btns */
    startGame() {

        if (LevelMgr.ins.startGame()) {
            ResMgr.ins.getUI(ui.GameBtnView);
            director.emit(events.rollBg, true);
            tween(this.StartBtn).to(0.15, { position: new Vec3(0, -820) }).call(() => {
                Tools.clearUI(this.StartBtn);
            }).start();
        }


    }


}

