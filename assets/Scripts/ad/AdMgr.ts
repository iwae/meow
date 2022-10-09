
import { _decorator, sys, __private, director } from 'cc';
import { DEBUG } from 'cc/env';
import { events, ui } from '../enum/Enums';
import ResMgr from '../manager/ResMgr';

export class AdMgr {

    static bannerOn = false;

    static closeAd() {
        const system = sys.platform;

        switch (system) {

            case sys.Platform.BYTEDANCE_MINI_GAME:

                break;
            case sys.Platform.ANDROID:

                break;
        }
    }



    static showBanner() {
        const system = sys.platform;

        switch (system) {


            case sys.Platform.ANDROID:

                break;
        }

    }
    static showInterstial(delay = 0) {

        const system = sys.platform;

        switch (system) {


            case sys.Platform.MOBILE_BROWSER:
            case sys.Platform.DESKTOP_BROWSER:
                this.showWebIntersital();
                break;

            case sys.Platform.BYTEDANCE_MINI_GAME:

                break;
            case sys.Platform.ANDROID:

                break;
        }

    }

    static showVideo(CB = null) {


        if (DEBUG) {
            this.showWebIntersital();
            CB && CB();
            return;
        }


        const system = sys.platform;

        switch (system) {
            case sys.Platform.MOBILE_BROWSER:
            case sys.Platform.DESKTOP_BROWSER:
                this.showWebIntersital();
                CB && CB();
                break;

            case sys.Platform.ANDROID:

                break;
        }

    }

    static showWebIntersital() {

        ResMgr.ins.getUI(ui.AdView);
    }


}

