import { _decorator, Component, Node } from 'cc';
import { AdMgr } from '../ad/AdMgr';
import { Clips, Props } from '../enum/Enums';
import { AudioMgr } from '../manager/AudioMgr';
import { PoolMgr } from '../manager/PoolMgr';
import { Tools } from '../utils/Tools';
const { ccclass, property } = _decorator;

@ccclass('BaseView')
export class BaseView extends Component {

    @property({
        displayOrder: 0,
        group: Props.View
    })
    tweenView = true;
    @property({
        type: Node,
        visible() {
            return this.tweenView;
        },
        displayOrder: 0,
        group: Props.View
    })
    root: Node = null
    @property({
        visible() {
            return this.tweenView;
        },
        displayOrder: 0,
        group: Props.View
    })
    tweenTime = 0.25;
    @property({
        displayOrder: 0,
        group: Props.View
    })
    playBtnClip = true;
    @property({
        group: Props.Ad,
        tooltip: "hide Banner on Start"
    })
    hideBannerOnLoad = false;
    @property({
        visible() {
            return !this.hideBannerOnLoad;
        },
        group: Props.Ad,
        tooltip: "show Banner on Start"
    })
    showBannerAd = false;
    @property({
        visible() {
            return this.showBannerAd && !this.hideBannerOnLoad;
        },
        range: [0, 5],
        group: Props.Ad
    })
    bannerDelay = 0;
    @property({
        group: Props.Ad,
        tooltip: "show Intersitial Ad on Start"
    })
    showIntersitialAd = false;
    @property({
        visible() {
            return this.showIntersitialAd;
        },
        range: [0, 5],
        group: Props.Ad
    })
    intersitialDelay = 0;
    @property({
        group: Props.Ad,
        tooltip: "show video Ad on Start"
    })
    showVideoAd = false;
    @property({
        visible() {
            return this.showVideoAd;
        },
        range: [0, 5],
        group: Props.Ad
    })
    videoDelay = 0;

    onEnable() {
        this.playBtnClip && AudioMgr.ins.playSound(Clips.btn);
        if (this.tweenView) {
            if (!this.root) this.root = this.node;
            Tools.fadeIn(this.root);
        }
        this.showAds();
    }

    close() {
        this.playBtnClip && AudioMgr.ins.playSound(Clips.btn, 0.5);
        if (this.showBannerAd) this.closeAd()
        if (this.tweenView) {
            Tools.fadeOut(this.root, () => {
                PoolMgr.ins.putNode(this.node);
            })
        } else {
            PoolMgr.ins.putNode(this.node);

        }
    }
    showAds() {
        if (this.hideBannerOnLoad) {
            this.closeAd();
        }
        if (this.showBannerAd) {
            this.scheduleOnce(() => {
                this.showBanner();
            }, this.bannerDelay)
        }
        if (this.showIntersitialAd) {
            this.scheduleOnce(() => {
                this.showIntersitial();
            }, this.intersitialDelay)
        }
        if (this.showVideoAd) {
            this.scheduleOnce(() => {
                this.showVideo();
            }, this.bannerDelay)
        }

    }
    closeAd() {
        AdMgr.closeAd();
    }

    showBanner() {
        AdMgr.showBanner();
    }
    showVideo(CB = null) {
        AdMgr.showVideo(CB);

    }
    showIntersitial() {
        AdMgr.showInterstial(this.bannerDelay);
    }

}

