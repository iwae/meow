/*
 * @Descripttion: 
 * @version: 
 * @Author: iwae
 * @Date: 2022-09-19 21:26:30
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-09-20 22:55:30
 */
import { _decorator, Component, Node, MeshRenderer, DebugMode } from 'cc';
import { PREVIEW } from 'cc/env';
import { Global } from '../Global';
const { ccclass, property } = _decorator;

@ccclass('CubeMgr')
export class CubeMgr extends Component {

    @property(MeshRenderer)
    mesh: MeshRenderer = null

    private _index = 0;

    set index(v) {
        this._index = v;

        const l = v % 10;

        const i = [(v - l) / 40, l / 8]

        this.setOffset(i);
    }
    get index(): number {
        return this._index;
    }


    start() {
        if (!this.mesh) this.mesh = this.node.getComponent(MeshRenderer) || this.node.getComponentInChildren(MeshRenderer);

    }


    onEnable() {
        /* for map editor test  */
        if (PREVIEW && !Global.runtime) {
            const i = [Math.floor(4 * Math.random()) / 4, Math.floor(8 * Math.random()) / 8];
            this.setOffset(i);
        }
    }

    setOffset(i) {
        /* set mat instanced arr */
        this.mesh.setInstancedAttribute('a_offset', i);
    }

}

