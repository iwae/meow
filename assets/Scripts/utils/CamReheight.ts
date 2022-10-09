
import { _decorator, Component, Node, Camera, director, Layers, Enum } from 'cc';
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('CamReheight')
@executeInEditMode(true)
export class CamReheight extends Component {
    @property(Camera)
    mainUiCam: Camera = null;
    @property(Camera)
    subUiCam: Camera = null;
    @property({ type: Enum(Layers.Enum) })
    get layer(): Layers.Enum {
        return this.currentlayer;
    }
    set layer(v: Layers.Enum) {
        this.currentlayer = v;
        this.setLayer();
    }

    @property({ type: Boolean })
    get refresh() {
        return false;
    }
    set refresh(v) {
        this.setLayer();
    }

    @property({ visible: false })
    currentlayer: Layers.Enum = Layers.Enum.UI_3D;


    onEnable() {
        this.setLayer();
        const canvas = director.getScene().getChildByName('Canvas');
        /* follow mainCam's orthoHeight when canvas size changed */
        canvas && canvas.on(Node.EventType.TRANSFORM_CHANGED, () => {
            this.setHeight();
        }, this)

    }

    setHeight() {
        this.subUiCam.orthoHeight = this.mainUiCam.orthoHeight;
        this.subUiCam.node.worldPosition = this.mainUiCam.node.worldPosition;
    }

    setLayer() {
        this.subUiCam.visibility = this.currentlayer;
        this.setHeight();
    }


}

