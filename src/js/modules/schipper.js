import SchipperView from './view/schipper-view';
import InputObserver from './InputObserver';

export default class Schipper {
    constructor(root, position) {
        this.inputObserver = new InputObserver();
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
