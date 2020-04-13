import SchipperView from './view/schipper-view';
import SchipperInputObserver from './schipper-input-observer';

export default class Schipper {
    constructor(root, position) {
        this.inputObserver = new SchipperInputObserver();
        this.initView(root, position);
    }

    initView(root, position) {
        this.view = new SchipperView(root, position);
    }

    destroyView() {
        this.view.destroy();
        this.view = null;
    }
}
