import { CCString, Sprite, SpriteFrame, _decorator } from 'cc';
import { BaseView } from './BaseView';
const { ccclass, property } = _decorator;

@ccclass('adCf')
class adCf {

    @property({ type: SpriteFrame })
    adSF: SpriteFrame = null;
    @property({ type: CCString })
    adLink = ""
}



@ccclass('AdView')
export class AdView extends BaseView {
    @property({ type: adCf })
    ads: adCf[] = [];

    @property({ type: Sprite })
    sp: Sprite = null;

    @property
    Carousel = true;
    @property
    cTime = 4;


    private id = 0;
    private link = "";


    onEnable() {

        this.id = Math.floor(this.ads.length * Math.random());
        this.updateAD();

        if (this.Carousel) {
            this.schedule(this.changeAd, this.cTime);
        }

    }

    onDisbale() {
        this.unschedule(this.changeAd);
    }


    onGo() {
        window.open(this.link);
        super.close();
    }

    changeAd() {

        this.id++;
        if (this.id >= this.ads.length) this.id = 0;

        this.updateAD();

    }


    updateAD() {

        const sf = this.ads[this.id].adSF;

        this.sp.spriteFrame = sf;
        this.link = this.ads[this.id].adLink;

    }

}

