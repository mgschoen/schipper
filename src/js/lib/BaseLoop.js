import AbstractLoop from './loops/AbstractLoop';
import PanLoop from './loops/PanLoop';
import ZoomLoop from './loops/ZoomLoop';

export default class BaseLoop extends AbstractLoop {
    constructor(scene) {
        super();
        this.loops = [
            new PanLoop(scene),
            new ZoomLoop(scene),
        ];

    }

    start() {
        this.active = true;
        this.loop();
    }

    stop() {
        this.active = false;
    }

    _loopImplementation() {
        this.loops.forEach((loopInstance) => {
            if (loopInstance.loop && typeof loopInstance.loop === 'function') {
                loopInstance.loop();
            }
        });
        window.requestAnimationFrame(() => this.loop());
    }
}