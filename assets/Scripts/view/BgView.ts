/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-09-19 10:09:11
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-09-26 14:37:30
 * @FilePath: /yangyang/assets/Scripts/view/BgView.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { _decorator, Component, Node, Widget, tween, director } from 'cc';
import { events } from '../enum/Enums';
import { Global } from '../Global';
const { ccclass, property } = _decorator;

@ccclass('BgView')
export class BgView extends Component {

    @property(Widget)
    cat: Widget = null;
    @property(Widget)
    grass: Widget = null;


    onEnable() {
        director.on(events.rollBg, this.roll, this);
        director.on(events.catWatch, this.watch, this);

    }

    onDisable() {
        director.off(events.rollBg, this.roll, this);
        director.on(events.catWatch, this.watch, this);

    }

    roll(up = true) {

        tween(this.cat).to(1.3, { top: up ? 90 : 300 }).call(() => {
            Global.start = up;
        }).start();
        tween(this.grass).to(1, { top: up ? 190 : 560 }).start();

    }

    /* to rollup the giant cats for fun */

    watch(up = true) {
        tween(this.cat).to(0.4, { top: up ? 180 : 90 }).start();
        tween(this.grass).to(0.2, { top: up ? 240 : 190 }).start();

    }





}

