/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-09-21 13:56:53
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-10-09 14:26:01
 * @FilePath: /yangyang/assets/Scripts/view/ResultView.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { _decorator, Component, Node, UITransform, director, Game, tween } from 'cc';
import { Clips, events, Key } from '../enum/Enums';
import { GameConfig } from '../GameConfig';
import { Global } from '../Global';
import { AudioMgr } from '../manager/AudioMgr';
import { EnergyMgr } from '../manager/EnergyMgr';
import { GameMgr } from '../manager/GameMgr';
import { LevelMgr } from '../manager/LevelMgr';
import { save, Tools } from '../utils/Tools';
import { BaseView } from './BaseView';
const { ccclass, property } = _decorator;

@ccclass('ResultView')
export class ResultView extends BaseView {

    @property(Node)
    winT: Node = null;
    @property(Node)
    loseT: Node = null;
    @property(Node)
    winB: Node = null;
    @property(Node)
    loseB: Node = null;
    @property(Node)
    reviveB: Node = null;
    @property(UITransform)
    stars: UITransform = null;
    private _rank = 0;

    get rank(): number {
        return this._rank;
    }

    set rank(v: number) {
        this._rank = v;
        this.stars.width = 180 * Math.round(v);;
    }

    private _win = true;

    /* not set yet, you can use time to do with score? */
    init(win: boolean) {

        this._win = win;
        this.winT.active = win;
        this.winB.active = win;
        this.loseT.active = !win;
        this.loseB.active = !win;
        this.reviveB.active = !win;

        const self = this.getComponent(ResultView);

        if (win) {
            const r = GameConfig.getRank();;
            EnergyMgr.ins.changeStar(r)
            this.rank = 0;
            tween(self).delay(0.25).to(r * 0.5, { rank: r }).start();
            if (Global.level <= Global.currlevel) Global.level++;
            if (Global.level > GameConfig.maxLevel) Global.level = GameConfig.maxLevel;
            save(Key.Level, Global.level);
            director.emit(events.Toast, "yeah~")

        } else {
            this.rank = 3;
            tween(self).delay(0.25).to(1.5, { rank: 0 }).start();

        }
        const clip = win ? Clips.win : Clips.lose;
        AudioMgr.ins.playSound(clip);
    }

    /* play again */
    async again() {
        /* if play again, no need energy */
        let level = this._win ? (Global.level - 1) : Global.level;
        if (level < 1) level = 1;

        if (EnergyMgr.ins.changeEnergy() || this._win) {
            GameMgr.ins.clearScene();
            this.scheduleOnce(async () => {
                GameMgr.ins.clearBot();
                await LevelMgr.ins.loadLevel(level);
                super.close();

            }, 0.01)

        }

    }
    /* go next LEvel */
    async next() {
        if (EnergyMgr.ins.changeEnergy()) {
            await LevelMgr.ins.loadLevel(Global.level);
            super.close();
        }
    }

    revive() {
        super.showVideo(() => {
            super.close();
            GameMgr.ins.revive();
        })
    }

    onDisable() {
        this.winT.active = this.winB.active = false;
        this.reviveB.active = this.loseT.active = this.loseB.active = false;
        this.rank = 0;
    }




}

