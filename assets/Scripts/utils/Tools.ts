
import { _decorator, Sprite, SpriteFrame, Texture2D, ImageAsset, Node, UIOpacity, tween, UIMeshRenderer, Layers, Vec3, sys, UITransform, Widget, size, view } from 'cc';
import ResMgr from '../manager/ResMgr';

export type rez = {
    index?: number,
    amount?: number
}

export function save(key: string, val: string | number) {
    if (typeof val === "number") {
        val = "" + val as string;
    }
    sys.localStorage.setItem(key, val || '')
}

export function load(key: string, type = 1) {
    let res: any = sys.localStorage.getItem(key);
    if (res) {
        switch (type) {
            case 1:
                res = Number(res);
                break;
        }
        return res;
    }
}


const ONE = new Vec3(1, 1, 1);

const ZERO = new Vec3(0, 0, 0);

export class Tools {

    static getDay() {
        return Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    }

    static createUI(): Node {
        const size = view.getVisibleSize();
        const node = new Node()
        const transfrom = node.addComponent(UITransform);
        transfrom.setContentSize(size);
        const widget = node.addComponent(Widget);
        widget.isAlignLeft = widget.isAlignTop = widget.isAlignTop = widget.isAlignBottom = true;
        widget.right = widget.left = widget.top = widget.bottom = 0;
        node.layer = Layers.Enum.UI_2D;
        return node;
    }


    static isEn(): boolean {
        return (navigator.language.indexOf("zh") != -1) ? false : true;
    }

    static randFromArray(a: rez[]) {

        const L = a.length;

        const i = Math.floor(Math.random() * L);

        const r = a[i];

        r.amount--;

        if (r.amount <= 0) {
            a.splice(i, 1);
        };

        return r.index;
    }

    static clearFromArrayNode(key, array) {
        const l = array.length;
        for (var i = 0; i < l; i++) {
            if (array[i].node == key) {
                array.splice(i, 1);
                break;
            }
        }
    }

    static clearFromArray(key, array) {
        const l = array.length;
        for (var i = 0; i < l; i++) {
            if (array[i] == key) {
                array.splice(i, 1);
                break;
            }
        }
    }

    /* return a float between min and max */
    static randBetween(min: number, max: number) {
        return min + Math.random() * (max - min);
    }

    /**
     * @description: Clear UI node, and realse sprite's memory based on needs
     * @param {Node} node
     * @param {*} clear
     * @return {*}
     */
    static clearUI(node: Node, clear = true) {

        if (clear) {
            const sp = node.getComponent(Sprite);
            sp && Tools.clearSprite(sp);
            const sps = node.getComponentsInChildren(Sprite);
            if (sps.length > 0) {
                sps.forEach((v) => {
                    /* Release mem */
                    Tools.clearSprite(v);
                })
            }

        }
        node.destroy();
    }

    /* node fade In */
    static fadeIn(node: Node, dura = 0.2) {
        node.setScale(Vec3.ZERO);
        tween(node).to(dura, { scale: ONE }).start();

    }

    /* node fade In */
    static fadeOut(node: Node, cb?) {
        tween(node).to(0.2, { scale: ZERO }, { easing: 'elasticOut' }).call(() => {
            cb && cb();
        }).start();
    }

    /**
     * @description: Clear sprite and release memory
     * @param {Sprite} sp
     * @return {*}
     */
    static clearSprite(sp: Sprite) {
        const sf = sp.spriteFrame as SpriteFrame;
        if (sf) {
            sp.spriteFrame = null;
            if (sf && sf.refCount > 0) {
                sf.decRef();
                const tex = sf.texture as Texture2D;
                console.log("released")
                this.clearTex(tex)

            }
        }
    }

    /**
     * @description: Clear texture2D and release momory
     * @param {Texture2D} tex
     * @return {*}
     */
    static clearTex(tex: Texture2D) {

        if (tex && tex.refCount > 0) {
            tex.decRef();
            const image = tex.image as ImageAsset;
            if (image && image.refCount > 0) {
                image.decRef();
            }
        }
    }

    /* convert from 3D to UI node with uimesh Renderer, if flase, revert it */

    static convertUI(node: Node, is2D = true) {

        if (is2D) {
            node.addComponent(UIMeshRenderer);

            node.layer = Layers.Enum.UI_2D;

            node.setScale(42, 42, 42)

        } else {
            node.setScale(0.5, 0.5, 0.5)

            node.layer = Layers.Enum.DEFAULT;

            let ui = node.getComponent(UIMeshRenderer);

            ui && ui.destroy();

            let prefab = ResMgr.ins.getPrefab("")
        }
    }





}

