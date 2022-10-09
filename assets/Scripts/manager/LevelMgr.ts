/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-09-19 00:19:54
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-10-09 14:25:51
 * @FilePath: /yangyang/assets/Scripts/manager/LevelMgr.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { _decorator, Node, Vec3, tween, director } from 'cc';
import { Clips, events, Key } from '../enum/Enums';
import { GameConfig } from '../GameConfig';
import { Global } from '../Global';
import { load, Tools } from '../utils/Tools';
import { AudioMgr } from './AudioMgr';
import { CubeMgr } from './CubeMgr';
import { EnergyMgr } from './EnergyMgr';
import { GameMgr } from './GameMgr';
import { PoolMgr } from './PoolMgr';
import ResMgr from './ResMgr';

const v = /* as temp Vec3 */new Vec3();

export class LevelMgr {

    private xSize = 1;
    private zSize = 1;
    private gridSize = 1;

    private euler: Vec3 = null;
    private cubeNode: Node = null;

    private static _ins: LevelMgr = null;

    public static get ins() {
        if (!this._ins) {
            this._ins = new LevelMgr();
        }

        return this._ins;
    }

    init(cubeNode, euler: Vec3) {
        /* check the level from cache */
        Global.level = Number(load(Key.Level)) || 1;
        this.cubeNode = cubeNode;
        this.euler = euler;

    }

    startGame() {
        if (EnergyMgr.ins.changeEnergy()) {
            Global.scene[1].active = true;
            LevelMgr.ins.loadLevel(Global.level);
            return true;
        } else {
            return false;
        }
    }


    /* load level from json parsed */
    async loadLevel(index: number) {


        Global.currlevel = index;

        director.emit(events.Toast, "Level" + index)

        const data = ResMgr.ins.getJson("" + index);

        const config = data.config;
        this.xSize = config.x;
        this.zSize = config.z;

        this.gridSize = config.size;
        /* set scene y and z which affect the content view size*/

        const y = -(config.height - 1) / 2;

        const z = GameConfig.setViewDistance(config.width);

        this.cubeNode.setPosition(0, y);

        this.cubeNode.parent.setPosition(0, 0.1, z);

        this.cubeNode.setRotationFromEuler(this.euler);

        /* map cube data */
        const map = data.mapData;

        /* cubes length */
        const L = map.length;
        if (L <= 0) {
            console.error("Map Data Error,Level==" + index)
        }
        let T = GameConfig.getCubeTypes(L); /* as Cubes typs amount */

        let K = GameConfig.getCubeKinds(L); /* as Cubes kinds amount */

        const res = GameConfig.randGrp(K, T, L);

        const time = GameConfig.getTimer(L);

        for (var i = 0; i < L; i++) {
            const j = map[i];
            const cube = this.setNode(j, this.cubeNode);
            const index = Tools.randFromArray(res);
            cube.index = index;
        }

        /* Game Starts */

        GameMgr.ins.startGame();

        director.emit(Key.Timer, time);

    }

    /* locate the cube and tween it to the des with delay */
    setNode(j, parent): CubeMgr {
        const node = PoolMgr.ins.getNode(j[3], parent);
        const pos = this._GetPos(j[0], j[1], j[2])
        node.setPosition(pos.x, pos.y + 11, pos.z)
        const time = (pos.y - 0.8) * 0.15 + Math.abs(pos.x) * 0.08 + Math.abs(pos.z) * 0.08;
        tween(node).delay(time).to(0.36, { position: pos }).start();
        return node.getComponent(CubeMgr);
    }


    /* get the cubes' postion from X,Y and grid size */
    private _GetPos(x: number, y: number, z: number): Vec3 {
        v.x = (x - this.xSize / 2 + 0.5) * this.gridSize;
        v.y = y;
        v.z = (z - this.zSize / 2 + 0.5) * this.gridSize;
        return v.clone();
    }


}

