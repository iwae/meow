import { _decorator, Component, Node, director, LabelComponent, Game } from 'cc';
import { AdMgr } from '../ad/AdMgr';
import { events, Key } from '../enum/Enums';
import { GameConfig } from '../GameConfig';
import { Global } from '../Global';
import { GameMgr } from '../manager/GameMgr';
import { load, save } from '../utils/Tools';
import { AdCtrl } from './AdCtrl';
const { ccclass, property } = _decorator;

@ccclass('ItemsCtrl')
export class ItemsCtrl extends Component {
    @property(Node)
    freezeBg: Node = null;
    @property(Node)
    undoBtn: Node = null;
    @property(Node)
    shuffleBtn: Node = null;
    @property(Node)
    freezeBtn: Node = null;

    private undoLabel: LabelComponent = null;
    private shuffleLabel: LabelComponent = null;
    private frostLabel: LabelComponent = null;

    onEnable() {

        let star = Number(load(Key.Star));
        if (!star) {
            save(Key.Star, 0);
            star = 0;
        }

        this._registerBtns();
        this._initData();
    }

    private _initData() {
        this.shuffleLabel = this.shuffleBtn.getComponentInChildren(LabelComponent);
        let shuffle = Number(load(Key.Shuffle));
        if (!shuffle) {
            shuffle = GameConfig.startShuffle;
            save(Key.Shuffle, shuffle);
        }
        this.shuffleLabel.string = "" + shuffle;
        this.undoLabel = this.undoBtn.getComponentInChildren(LabelComponent);
        let undo = Number(load(Key.Undo));
        if (!undo) {
            undo = GameConfig.startUndo;
            save(Key.Undo, undo);
        }
        this.undoLabel.string = "" + undo;
        this.frostLabel = this.freezeBtn.getComponentInChildren(LabelComponent);
        let frost = Number(load(Key.Frost));
        if (!frost) {
            frost = GameConfig.startFrost;
            save(Key.Frost, frost);
        }
        this.frostLabel.string = "" + frost;
    }

    private _registerBtns() {
        this.freezeBtn.on(Node.EventType.TOUCH_END, (() => {
            this.freeze();
        }), this);
        this.shuffleBtn.on(Node.EventType.TOUCH_END, (() => {
            this.shuffle();
        }), this);
        this.undoBtn.on(Node.EventType.TOUCH_END, (() => {
            this.undo();
        }), this);
    }



    undo() {
        if (!Global.start) return;
        let undo = Number(load(Key.Undo));
        if (!undo || undo <= 0) {
            if (GameMgr.ins.botSteps.length <= 0) {
                director.emit(events.Toast, "No actions to undo");
                return;
            }

            AdMgr.showVideo(() => {
                undo = GameConfig.startUndo;
                save(Key.Undo, undo);
                this.undoBtn.getChildByName("videoBtn").active = false;
                GameMgr.ins.undo();
                this.undoLabel.string = "" + undo;

            })
        } else {
            undo--;
            save(Key.Undo, undo);
            this.undoLabel.string = "" + undo;
            GameMgr.ins.undo();
            if (undo <= 0) this.undoBtn.getChildByName("videoBtn").active = true;
        }
    }
    shuffle() {
        if (!Global.start) return;

        let shuffle = Number(load(Key.Shuffle));
        if (!shuffle || shuffle <= 0) {

            AdMgr.showVideo(() => {
                shuffle = GameConfig.startShuffle;
                save(Key.Shuffle, shuffle);
                this.shuffleBtn.getChildByName("videoBtn").active = false;
                GameMgr.ins.shuffle();
                this.shuffleLabel.string = "" + shuffle;

            })

        } else {
            shuffle--;
            save(Key.Shuffle, shuffle);
            this.shuffleLabel.string = "" + shuffle;
            GameMgr.ins.shuffle();
            if (shuffle <= 0) this.shuffleBtn.getChildByName("videoBtn").active = true;

        }

    }
    freeze() {
        if (!Global.start) return;
        let frost = Number(load(Key.Frost));
        if (!frost || frost <= 0) {
            AdMgr.showVideo(() => {
                frost = GameConfig.startFrost;
                save(Key.Frost, frost);
                this.freezeBtn.getChildByName("videoBtn").active = false;
                this.goFreeze();
                this.frostLabel.string = "" + frost;
            })
        } else {
            frost--;
            save(Key.Frost, frost);
            this.frostLabel.string = "" + frost;
            this.goFreeze();
            if (frost <= 0) this.freezeBtn.getChildByName("videoBtn").active = true;
        }

    }

    goFreeze() {
        director.emit(Key.Timer, 0);
        this.freezeBg.active = true;
        this.scheduleOnce(() => {
            const time = Global.time;
            this.freezeBg.active = false;
            director.emit(Key.Timer, time);
        }, GameConfig.freezeTime)
    }
}

