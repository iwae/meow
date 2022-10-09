/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-09-22 18:09:05
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-09-26 16:43:52
 * @FilePath: /yangyang/assets/Scripts/view/EnergyView.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AEf
 */
import { _decorator, Component, Node, director, Pool } from 'cc';
import { Clips, events } from '../enum/Enums';
import { AudioMgr } from '../manager/AudioMgr';
import { EnergyMgr } from '../manager/EnergyMgr';

import { BaseView } from './BaseView';
const { ccclass, property } = _decorator;

@ccclass('EnergyView')
export class EnergyView extends BaseView {


    /* show Energy View */
    getEnergy() {
        super.showVideo(() => {
            this.addEnergy();
        })

    }

    addEnergy() {
        EnergyMgr.ins.changeEnergy(true);
        AudioMgr.ins.playSound(Clips.reward);
        super.close();

    }



}

