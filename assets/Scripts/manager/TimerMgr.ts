/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-09-22 19:34:18
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-09-26 17:02:11
 * @FilePath: /yangyang/assets/Scripts/manager/TimerMgr.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { _decorator, Component, Node, director, UIOpacity, UIOpacityComponent, LabelComponent } from 'cc';
import { Clips, Key } from '../enum/Enums';
import { Global } from '../Global';
import { AudioMgr } from './AudioMgr';
import { GameMgr } from './GameMgr';
const { ccclass, property } = _decorator;

@ccclass('TimerMgr')
export class TimerMgr extends Component {

    private _op: UIOpacity = null;

    @property(LabelComponent)
    text: LabelComponent = null;


    start() {
        this._op = this.node.getComponent(UIOpacityComponent);
        director.on(Key.Timer, this.setTimer, this);
        director.on(Key.Pause, this.pause, this);
        this._op.opacity = 0;
    }

    /* when watching ad, call this */
    pause(isPause: boolean) {
        if (this._op.opacity == 0) return;

        if (isPause) {
            this.unschedule(this.timer);
        } else {
            this.schedule(this.timer, 1);
        }
    }

    /**
     * @description: if time = 0, stop it;
     * @return {*}
     */
    setTimer(time: number) {

        if (time == 0) {
            this.unschedule(this.timer)
            // this._op.opacity = 0;
        } else {
            Global.time = time;
            this._op.opacity = 255;
            this.text.string = time + "s";
            this.schedule(this.timer, 1)
        }


    }

    timer() {
        Global.time;
        Global.time--;
        this.text.string = Global.time + "s";
        if (Global.time < 6 && Global.time > 0) {
            AudioMgr.ins.playSound(Clips.counter);
        }
        if (Global.time <= 0) {
            this.unschedule(this.timer);
            GameMgr.ins.GameResult(false);
        }
    }
}

