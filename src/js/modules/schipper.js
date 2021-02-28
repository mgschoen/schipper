import Scene from './Scene';
import InputObserver from './InputObserver';

export default class Schipper {
    constructor(root, position) {
        this.inputObserver = new InputObserver();
        this.scene = new Scene(root, position);
    }

    destroyScene() {
        this.scene.destroy();
        this.scene = null;
    }
}
