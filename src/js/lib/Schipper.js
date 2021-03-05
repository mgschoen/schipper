import Scene from './Scene';
import InputObserver from './InputObserver';
import BaseLoop from './BaseLoop';

export default class Schipper {
    constructor(root, position) {
        this.inputObserver = new InputObserver();
        this.rootElement = root;
        this.initalPosition = position;
    }

    initScene() {
        this.scene = new Scene(this.rootElement, this.initalPosition);
        this.baseLoop = new BaseLoop(this.scene);
        this.baseLoop.start();
    }

    destroyScene() {
        this.baseLoop.stop();
        this.baseLoop = null;
        this.scene.destroy();
        this.scene = null;
    }
}
