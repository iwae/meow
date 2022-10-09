
import { _decorator } from 'cc';
import { Global } from './Global';
import { rez, Tools } from './utils/Tools';


export class GameConfig {

    static skinList = ["cat"]

    /* amount for energy added */
    static addEnergy = 5;

    /* start energy, and also for daily energy recovery */
    static startEnergy = 10;

    /* max levels, for demo is 10 */
    static maxLevel = 10;

    /* max cube on bot shelf */
    static maxCubes = 6;

    static freezeTime = 15;

    static startShuffle = 2;
    static startFrost = 1;
    static startUndo = 3;


    /* set the cubes scenes's postion Z base on its max Grid Z */
    static setViewDistance(width: number) {
        const z = 3 - width * 2.7;
        Global.min = z - 4.5;
        Global.max = z + 3.5;
        return z;
    }

    /* cubes types,types increases on every 10 of the cubes length, and gains again on every 60 of the length */

    static getCubeTypes(length: number) {
        let types = 3 + Math.floor(length / 10) + Math.floor(length / 60);
        if (types > 8) types = 8;
        return types;
    }

    /* cubes kinds,kinds increases on every 130 of the cubes length */

    static getCubeKinds(length: number) {
        let kinds = 1 + Math.floor(length / 130);;
        if (kinds > 3) kinds = 3;
        return kinds;
    }

    /*put cubes into diff groups with kinds and types  */
    static randGrp(kinds: number, types: number, amount: number, size = 3) {

        /* amount should be devied by size in this case */
        const splices = Math.floor(amount / size);

        const res = [] as rez[];

        let total = 0;
        const length = kinds * types;
        const min = (length > 9) ? 0.85 : 0.95;
        const max = (length > 9) ? 1.1 : 1.05;
        for (var i = 0; i < types; i++) {
            for (var k = 0; k < kinds; k++) {
                const a = (i == types - 1 && k == kinds - 1) ? (splices - total) : Math.round(Tools.randBetween(min, max) * splices / length);
                res[i + k * types] = { index: (k) * 10 + i, amount: a * 3 } as rez;
                total += a;
            }

        }
        return res;

    }
    /* caculate the total time for each level, use the math below */
    static getTimer(level: number) {
        return 45 + Math.floor(level / 4 + level / 35 * 4 + level / 120 * 15 + level / 300 * 30);
    }

    /* get level ranks, which is the stars, use remaining time devided by 5 */
    static getRank() {
        let rank = Math.floor(Global.time / 5);
        if (rank > 3) rank = 3;
        return rank;
    }

}

