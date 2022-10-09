/*
 * @Author: iwae iwae@foxmail.com
 * @Date: 2022-09-02 10:54:56
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-09-27 09:55:37
 * @FilePath: /98KPhysic/assets/src/Global.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { director, Node } from "cc";
import { Key } from "./enum/Enums";

export class Global {

    static Debug = false;
    /* if is game Run time */
    static runtime = false;

    /* if game starts */
    static start = false;

    /* if the device is mobile */

    static isMobile = false;

    /* store performance settings */

    static high = false;

    static scale = 2;

    static radio = 1;


    /* loading rate  */
    static LoadingRate = 0;

    /* global layer storage */

    static layer: Node[] = [];

    static scene: Node[] = [];

    /* if Egnlish env */

    static en = false;

    /* min scene scale */
    static min = -20;

    /* max scene scale */
    static max = -8;


    /* temp level storage */
    static level = 1;

    /* temp current level storage */
    static currlevel = 1;

    /* temp level time storage */
    static time = 0;

    /* used for game pause */
    static Pause(isPause = true) {
        director.emit(Key.Pause, isPause);
        Global.start = !isPause;
    }


}

