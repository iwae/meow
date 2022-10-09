import { _decorator, Prefab, Node, instantiate, NodePool, Vec3 } from "cc";

const { ccclass, property } = _decorator;

@ccclass("PoolMgr")
export class PoolMgr {

    private _dictPool: any = {}
    private _dictPrefab: any = {}

    static _ins: PoolMgr;
    /* class member could be defined like this */
    // dummy = '';

    static get ins() {
        if (this._ins) {
            return this._ins;
        }

        this._ins = new PoolMgr();

        window["xxx"] = this._ins;
        return this._ins;
    }

    public copyNode(copynode: Node, parent: Node | null): Node {
        let name = copynode.name;
        this._dictPrefab[name] = copynode;
        let node = null;
        if (this._dictPool.hasOwnProperty(name)) {
            let pool = this._dictPool[name];
            if (pool.size() > 0) {
                node = pool.get();
            } else {
                node = instantiate(copynode);
            }
        } else {

            let pool = new NodePool();
            this._dictPool[name] = pool;

            node = instantiate(copynode);
        }
        if (parent) {
            node.parent = parent;
            node.active = true;
        }
        return node;
    }

    /**
     * @description: get the node from the pool
     * @param {Prefab} prefab
     * @param {Node} parent
     * @param {Vec3} pos
     * @return {*}
     */
    public getNode(prefab: Prefab | string, parent?: Node, pos?: Vec3): Node {
        let tempPre;
        let name;
        if (typeof prefab === 'string') {
            tempPre = this._dictPrefab[prefab];
            name = prefab;
            if (!tempPre) {
                console.log("Pool invalid prefab name = ", name);
                return null;
            }
        }
        else {
            tempPre = prefab;
            name = prefab.data.name;
        }

        let node = null;
        if (this._dictPool.hasOwnProperty(name)) {
            //已有对应的对象池
            let pool = this._dictPool[name];
            if (pool.size() > 0) {
                node = pool.get();
            } else {
                node = instantiate(tempPre);
            }
        } else {
            //没有对应对象池，创建他！
            let pool = new NodePool();
            this._dictPool[name] = pool;

            node = instantiate(tempPre);
        }

        if (parent) {
            node.parent = parent;
            node.active = true;
            if (pos) node.position = pos;
        }

        return node;
    }

    // /**
    //  * @name: 
    //  * @msg: 
    //  * @param {Prefab} prefab 预制体名
    //  * @param {true} play 是否播放
    //  * @param {Vec3} pos 位置
    //  * @param {*} time 回收时间，不回收不填
    //  * @return {*}
    //  */
    // public playSkill(prefab: Prefab | string, play: boolean=true, pos?: Vec3, time?,parent?):Node {

    //     let node = this.getNode(prefab, parent?parent:Global.stage[3], pos)

    //     if (play) {
    //         node.getComponent(EffectPlay).play()
    //     }

    //     if (time) {

    //         setTimeout(() => {
    //             if (play) {
    //                 node.getComponent(EffectPlay).stop()
    //             }

    //             this.putNode(node)

    //         }, time * 1000);

    //     }
    //     return node

    // }

    /**
     * @description: put the node into the pool
     * @param {Node} node
     * @param {*} isActive
     * @return {*}
     */
    public putNode(node: Node | null, isActive = false) {
        if (!node) {
            return;
        }

        //console.log("回收信息",node.name,node)
        let name = node.name;
        let pool = null;
        // node.active = isActive
        if (this._dictPool.hasOwnProperty(name)) {
            //已有对应的对象池
            pool = this._dictPool[name];
        } else {
            //没有对应对象池，创建他！
            pool = new NodePool();
            this._dictPool[name] = pool;
        }

        pool.put(node);
    }

    /**
     * @description: clear the pool based on name
     * @param {string} name
     * @return {*}
     */
    public clearPool(name: string) {
        if (this._dictPool.hasOwnProperty(name)) {
            let pool = this._dictPool[name];
            pool.clear();
        }
    }


    public setPrefab(name: string, prefab: Prefab): void {

        this._dictPrefab[name] = prefab;
    }

    public getPrefab(name: string): Prefab {
        return this._dictPrefab[name];
    }


}
