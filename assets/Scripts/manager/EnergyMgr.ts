/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-09-22 16:15:17
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-09-23 15:08:23
 * @FilePath: /yangyang/assets/Scripts/manager/EnergyMgr.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { _decorator, Component, Node, LabelComponent, tween } from 'cc';
import { Key, ui } from '../enum/Enums';
import { GameConfig } from '../GameConfig';
import { load, save, Tools } from '../utils/Tools';
import ResMgr from './ResMgr';
const { ccclass, property } = _decorator;

@ccclass('EnergyMgr')
export class EnergyMgr extends Component {

    @property(LabelComponent)
    energyLabel: LabelComponent = null;

    @property(LabelComponent)
    starLabel: LabelComponent = null;

    private _s = 0;
    get starNum() {
        return this._s;
    }
    set starNum(v) {
        this._s = v;
        this.starLabel.string = Math.floor(this._s) + "";
    }
    private _e = 0;
    get energyNum() {
        return this._e;
    }
    set energyNum(v) {
        this._e = v;
        this.energyLabel.string = Math.floor(this._e) + "";
    }

    public static ins: EnergyMgr = null;


    start() {
        EnergyMgr.ins = this;
        const timeLast = Number(load(Key.LastTime));
        const timeNow = Tools.getDay();

        if (timeLast) {
            let energy = Number(load(Key.Energy));
            /* comepare time */
            if (timeNow > timeLast) {
                if (energy < GameConfig.startEnergy) energy = GameConfig.startEnergy
                save(Key.Energy, energy);

            }
            this.energyNum = energy;
        } else {
            save(Key.LastTime, timeNow);
            save(Key.Energy, GameConfig.startEnergy);
            this.energyNum = GameConfig.startEnergy;
        }

        let star = Number(load(Key.Star));
        if (!star) {
            save(Key.Star, 0);
            star = 0;
        }
        this.starNum = star;

    }

    /* for add or reduce energy */
    changeEnergy(add = false) {

        let energy = Number(load(Key.Energy));
        if (add) {
            energy += GameConfig.addEnergy;
            const self = this.getComponent(EnergyMgr);
            tween(self).to(GameConfig.addEnergy / 10, { energyNum: energy }).start();
            save(Key.Energy, energy);
            return true;
        } else {
            if (energy <= 0) {
                this.showEnergy();
                return false;
            } else {
                energy--;
                save(Key.Energy, energy);
                this.energyLabel.string = "" + energy;
                return true;
            }
        }
    }

    async showEnergy() {
        await ResMgr.ins.getUI(ui.EnergyView);
    }
    changeStar(num: number) {
        let star = Number(load(Key.Star));
        star += num;
        const self = this.getComponent(EnergyMgr);
        tween(self).to(star / 2, { starNum: star }).start();

        save(Key.Star, star);

    }

}

