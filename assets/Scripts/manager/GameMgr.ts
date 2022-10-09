/*
 * @Descripttion: 
 * @version: 
 * @Author: iwae
 * @Date: 2022-09-19 23:18:17
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-10-09 14:25:47
 */
import { _decorator, EventTouch, Touch, CameraComponent, MeshRenderer, geometry, Vec2, Vec3, Node, Component, director, Quat, input, Input, quat, EventMouse, sys, tween, AnimationComponent, UI, Game } from 'cc';
import { AdMgr } from '../ad/AdMgr';
import { Clips, Effects, events, Key, scenes, ui } from '../enum/Enums';
import { GameConfig } from '../GameConfig';
import { Global } from '../Global';
import { Tools } from '../utils/Tools';
import { ResultView } from '../view/ResultView';
import { AudioMgr } from './AudioMgr';
import { CubeMgr } from './CubeMgr';
import { PoolMgr } from './PoolMgr';
import ResMgr from './ResMgr';

/* ray model hit policy */
const option: geometry.IRayMeshOptions = { mode: geometry.ERaycastMode.CLOSEST, doubleSided: true, distance: 300 };
/* const ray for model hit detect */
const ray: geometry.Ray = new geometry.Ray();
/* temped vectors */
const v2_0 = new Vec2();
const v2_1 = new Vec2();
const v3_0 = new Vec3();
const v3_1 = new Vec3();
const v3_2 = new Vec3();
const v3_3 = new Vec3();
/* temped quats */
const q0 = new Quat();
const q1 = new Quat();

type step = {
    node: Node,
    pos: Vec3
}


/* its a component for main game logic */
export class GameMgr extends Component {

    /* the scene for game */
    private scene: Node = null;

    private cubeNode: Node = null;

    /* shelf to show bot cubes */
    private shelf: Node = null;

    /* store bot cubes' steps*/
    public botSteps: step[] = [];

    /* if clicked getMore */
    private getMore = false;

    /* the more btn to bot cubes shelf's limitation*/
    private moreBtn: MeshRenderer = null;

    private sceneCam: CameraComponent = null;

    /* for clicked mesh storage */
    private mesh: MeshRenderer = null;

    /* for touchOn detection storage */
    private isDetected = false;

    /* meshes from the level mgr to be caeched and could be checked by ray model */
    private meshes: MeshRenderer[] = [];

    /* for 1st touch on screen, get its id and store */
    private touchID = null;

    private dis = 0;

    private get Rad() {
        return this.scene.position.z;
    }

    private set Rad(v) {
        v3_0.set(this.scene.position);
        v3_0.z = v;
        this.scene.setPosition(v3_0);
    }

    private static _ins: GameMgr = null;

    public static get ins() {
        if (!this._ins) {
            this._ins = new GameMgr();
        }
        return this._ins;
    }



    init(sceneCam: CameraComponent, scene: Node, shelf: Node) {

        this.sceneCam = sceneCam;

        this.scene = scene;

        this.cubeNode = this.scene.getChildByName(scenes.CubeNode);

        this.shelf = shelf.getChildByName("shelf");

        this.moreBtn = shelf.getChildByName("moreBtn").getComponent(MeshRenderer);

        this.regEnvents();

    }

    startGame() {

        Global.start = true;

        this.meshes = this.scene.getComponentsInChildren(MeshRenderer);


    }

    regEnvents() {

        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this)
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this)
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this)
        input.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this)
        if (!sys.isMobile) {
            input.on(Input.EventType.MOUSE_WHEEL, this.onMouseWheel, this)
        }

    }

    /* mouse wheel scroll callbacks */
    onMouseWheel(event: EventMouse) {
        let scrollY = event.getScrollY();

        this.scaleDis(scrollY);

    }

    unLockMore() {


        const v0 = new Vec3(1.25, 1.25, 1.25);
        const v1 = new Vec3(1, 1, 1);

        tween(this.moreBtn.node)
            .to(0.25, { scale: v0 })
            .to(0.15, { scale: v1 })
            .call(() => {
                this.moreBtn.node.active = false;
            }).start();

        GameConfig.maxCubes++;
        director.emit(events.Toast, "Unlocked extra cube space");

        this.getMore = true;

    }

    /* while clicked the more btn, which is an AD button */
    checkMoreBtn() {

        if (this.getMore) return

        let distance = 300;

        let dis = geometry.intersect.rayModel(ray, this.moreBtn.model, option);
        if (dis && dis < distance) {


            AudioMgr.ins.playSound(Clips.btn, 0.5);

            AdMgr.showVideo(() => {
                this.unLockMore();
            })

        }

    }

    /* touch logic while on Touch */

    onTouchStart(event?: EventTouch) {
        if (!Global.start) return;

        director.emit(events.catWatch, true);
        const touch = event.touch as Touch;
        touch.getLocation(v2_0);

        if (!this.isDetected) {
            this.sceneCam.screenPointToRay(v2_0.x, v2_0.y, ray);

            this.checkMoreBtn();
            this.mesh = this.rayHit();
            if (this.mesh) {
                this.isDetected = true;
                AudioMgr.ins.playSound(Clips.touch);
                touch.getUILocation(v2_1);
                this.showTouch(v2_1);
                this.touchID = touch.getID();
                const mesh = this.mesh;
                this.setMesh(mesh);
            }
        }
    }

    /* touch logic while moving */
    onTouchMove(event?: EventTouch) {
        if (!Global.start) return;

        const touches = event.getAllTouches();
        /* scale radius for mobile multi touch */
        let touch1: Touch;
        let speed = 1;
        if (touches.length > 1) {
            const changedTouches = event.getTouches();

            touch1 = touches[0]

            let touch2: Touch = null!;
            if (changedTouches.length > 1) {
                touch2 = touches[1];
            } else {
                touch1 = event.touch;
                const diffID = touch1.getID();
                for (let i = 0; i < touches.length; i++) {
                    const element = touches[i];
                    if (element.getID() !== diffID) {
                        touch2 = element;
                        break;
                    }
                }
            }
            touch1.getLocation(v2_0);
            touch2.getLocation(v2_1);
            let dis = Vec2.distance(v2_0, v2_1)
            let delta = dis - this.dis;
            this.scaleDis(delta)
            this.dis = dis;
            /* slow down rotate speed for better exp */
            speed = 0.1
        } else {
            touch1 = event.touch;
        }

        touch1.getDelta(v2_1);

        const id = touch1.getID();

        /* rotate obj's parent node */
        if (this.touchID) {
            if (id == this.touchID) {
                this.rotateScene(v2_1.multiplyScalar(speed));
            }
        } else {
            this.rotateScene(v2_1.multiplyScalar(speed));
        };

    }


    onTouchEnd(event?: EventTouch) {
        if (!Global.start) return;

        const touch = event.touch as Touch;
        const id = touch.getID();

        if (this.isDetected) {
            if (id == this.touchID) {
                touch.getLocation(v2_0);
                this.sceneCam.screenPointToRay(v2_0.x, v2_0.y, ray);
                director.emit(events.catWatch, false);
                const mesh = this.mesh;
                const meshLast = this.rayHit();
                this.setMesh(mesh, false);
                if (mesh == meshLast) {
                    this._GetMesh(mesh);
                }
                this.mesh = null;
                this.touchID = null;
                this.isDetected = false;
            }
        } else {
            director.emit(events.catWatch, false);
        }

    }

    /* show touch eff */
    async showTouch(pos) {
        const touch = await ResMgr.ins.getUI(ui.TouchView);

        touch.setWorldPosition(pos.x, pos.y, 0);

        touch.getComponent(AnimationComponent).play();

        this.scheduleOnce(() => {
            PoolMgr.ins.putNode(touch);
        }, 1)

    }

    /* set mesh's color less brightness */
    setMesh(mesh, dark = true) {
        mesh.setInstancedAttribute('a_dark', [dark ? 0.75 : 0]);
    }


    /* get the mesh clicked and check it */
    private _GetMesh(mesh: MeshRenderer) {
        const l = this.meshes.length;
        for (var i = 0; i < l; i++) {
            if (this.meshes[i] == mesh) {
                this.meshes.splice(i, 1);
                break;
            }
        }
        const node = mesh.node;
        this.checkbotSteps(node);
        if (l == 1) {
            this.GameResult(true);
        }

    }


    /* check bot cubes and do game logics here as well */
    checkbotSteps(node: Node) {


        const cubes = this.botSteps;
        const L = cubes.length;
        // this.lastAction.set(node.position);


        /* check the length of current cubes, if it aboves 2, do the merge check */
        if (L >= 2) {
            const indexV = node.getComponent(CubeMgr).index;
            const cubeMap: Node[] = [];
            for (var i = 0; i < L; i++) {
                const index = cubes[i].node.getComponent(CubeMgr).index;
                if (index == indexV) cubeMap.push(cubes[i].node);
            }

            const mapL = cubeMap.length;
            if (mapL == 2) {
                Tools.clearFromArrayNode(cubeMap[1], cubes);
                Tools.clearFromArrayNode(cubeMap[0], cubes);
                /* set Node as a child of the shelf,then do the merge animation */
                q0.set(node.worldRotation);
                v3_0.set(node.worldPosition);
                node.parent = this.shelf;
                node.setWorldPosition(v3_0);
                node.setRotation(q0);
                cubeMap.push(node);
                this.mergeAction(cubeMap, L)
                /* refreshBot */
                this.refreshBot();
                //test;

            } else {
                if (L >= GameConfig.maxCubes - 1) {
                    this.GameResult(false);
                }
                this.moveToBot(node, L)



            }
        } else {
            this.moveToBot(node, L)

        }

    }

    /* move cube to the bot shelf */
    moveToBot(node: Node, v) {
        this.botSteps.push({ node: node, pos: node.position.clone() });
        q0.set(node.worldRotation);
        v3_0.set(node.worldPosition);
        node.parent = this.shelf;
        node.setWorldPosition(v3_0);
        node.setRotation(q0);
        v3_0.set(-3 + v, 0, 0);
        v3_1.set(-15, 0, 0);
        tween(node).to(0.35, { position: v3_0, eulerAngles: v3_1 }).start();
    }

    /* refresh bot shelf once the sequence is changed */
    refreshBot() {
        const L = this.botSteps.length;
        if (L > 0) {
            for (var i = 0; i < L; i++) {
                v3_0.set(-3 + i, 0, 0);
                tween(this.botSteps[i].node).to(0.25, { position: v3_0 }).start();
            }

        }


    }

    mergeAction(nodes: Node[], L: number) {

        nodes.forEach((v, i) => {
            const x = L + i - 5
            // v3_0.set(x, 0, 0);
            v3_1.set(-15, 0, 0);
            /* closer to the screen */
            v3_2.set(L - 4, 0.8, 3);
            v3_3.set(0, 360, 0);

            tween(v).
                to(0.35, { position: new Vec3(x, 0, 0), eulerAngles: v3_1 }).delay(0.15).
                to(0.35, { position: v3_2, eulerAngles: v3_3 }).
                call(() => {
                    v.setRotationFromEuler(0, 0, 0);
                    PoolMgr.ins.putNode(v);
                    if (i == 2) {
                        const eff = PoolMgr.ins.getNode(Effects.Star, this.shelf);
                        /* avoid loads stacking */
                        this.scheduleOnce(() => {
                            AudioMgr.ins.playSound(Clips.merge);
                        })
                        eff.setPosition(v3_2);
                        this.scheduleOnce(() => {
                            PoolMgr.ins.putNode(eff);
                        }, 1.1);
                    }
                }
                ).start();
        }
        )
    }



    /* show game's result & panel */
    async GameResult(isWin: boolean) {
        Global.start = false;
        this.mesh = null;
        this.isDetected = false;
        director.emit(Key.Timer, 0);
        this.scheduleOnce(async () => {
            const view = await ResMgr.ins.getUI(ui.ResultView);
            view.getComponent(ResultView).init(isWin);
        }, 0.55);
    }

    revive() {

        this.undo(() => {
            Global.start = true;
            const time = Global.time + 40;
            director.emit(Key.Timer, time);
        })

    }
    undo(CB = null) {

        const L = this.botSteps.length;
        if (L > 0) {
            const index = L - 1;
            let node = this.botSteps[index].node;
            const pos = this.botSteps[index].pos;
            this.botSteps.splice(index, 1);
            q0.set(node.worldRotation);
            v3_0.set(node.worldPosition);
            node.parent = this.cubeNode;
            node.setWorldPosition(v3_0);
            node.setWorldRotation(q0);
            this.meshes.push(node.getComponent(MeshRenderer));
            tween(node).delay(0.1).to(0.3, { position: pos, eulerAngles: Vec3.ZERO }).call(() => {
                CB && CB();
            }).start();
        } else {
            this.scheduleOnce(() => {
                CB && CB();
            }, 0.15);
        }
    }

    shuffle() {

        Global.start = false;
        const pos: Vec3[] = [];
        const L = this.meshes.length;
        for (var i = 0; i < L; i++) {
            pos.push(this.meshes[i].node.position.clone())
        }

        for (var i = 0; i < L; i++) {
            tween(this.meshes[i].node).delay(0.05).to(0.26, { position: pos[L - 1 - i] }).start();
        }
        const euler = this.cubeNode.eulerAngles.clone();
        euler.y += -180 + 360 * Math.random();

        tween(this.cubeNode).to(0.35, { eulerAngles: euler }).start();

        this.scheduleOnce(() => {
            Global.start = true;
        }, 0.352)

    }

    /* clear cubes' scene */
    clearScene() {
        const cubeL = this.meshes.length;
        if (cubeL > 0) {
            for (var i = this.meshes.length - 1; i >= 0; i--) {
                const cube = this.meshes[0].node;
                cube && PoolMgr.ins.putNode(cube);
            }
            this.cubeNode.destroyAllChildren();
        }
        this.mesh = null;
        this.isDetected = false;
        this.meshes.length = 0;

    }

    /* clear bot, which is cubes' shelf */
    clearBot() {
        const cubeL = this.botSteps.length;
        if (cubeL > 0) {
            for (var i = this.botSteps.length - 1; i >= 0; i--) {
                const cube = this.botSteps[0].node;
                cube.setRotationFromEuler(0, 0, 0);
                cube && PoolMgr.ins.putNode(cube);
            }
            this.botSteps.length = 0;
            this.shelf.destroyAllChildren();
        }

    }


    /* set the scale */
    scaleDis(v) {

        let rad = this.Rad;

        rad += Math.sign(v) * 0.3;

        if (rad < Global.min) rad = Global.min;
        if (rad > Global.max) rad = Global.max;

        this.Rad = rad;

    }

    /* roate the scene's Quat */
    rotateScene(v: Vec2) {

        // v3_1.set(this.scene.eulerAngles)
        q1.set(this.scene.rotation)

        Quat.rotateY(q1, q1, v.x * 0.01);

        /* slower for better touch */

        Quat.rotateAround(q1, q1, Vec3.RIGHT, -v.y * 0.008);

        this.scene.setRotation(q1);
    }


    /* check model hit */
    rayHit() {
        let distance = 300;
        let mesh: MeshRenderer
        for (let v of this.meshes) {
            let dis = geometry.intersect.rayModel(ray, v.model, option);
            if (dis && dis < distance) {
                distance = dis;
                mesh = v;
            }
        }
        return mesh;
    }

}




