import SchipperView from './view/schipper-view';
import SchipperInputObserver from './schipper-input-observer';

function Schipper (root, position) {
    this.inputObserver = new SchipperInputObserver();

    let that = this;

    this.initView = function (root, position) {
        that.view = new SchipperView(root, position);
    }

    this.destroyView = function () {
        that.view.destroy();
        that.view = null;
    }

    this.initView(root, position);
}

export default Schipper;
