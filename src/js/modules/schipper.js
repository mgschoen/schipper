import SchipperView from './view/schipper-view';
import SchipperInputObserver from './schipper-input-observer';

function Schipper (root, position) {
    this.view = new SchipperView(root, position);
    this.inputObserver = new SchipperInputObserver();
}

export default Schipper;
