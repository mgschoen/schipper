import SchipperView from './view/schipper-view';
import SchipperInputObserver from './schipper-input-observer';
import MovementAnimation from './animation/movement-animation';
import ZoomAnimation from './animation/zoom-animation';

function Schipper (root, position) {
    this.view = new SchipperView(root, position);
    this.movementAnimation = new MovementAnimation(this.view);
    this.zoomAnimation = new ZoomAnimation(this.view);
    this.input = new SchipperInputObserver(data => {
        let activeDirections = Object.keys(data).filter(key => data[key]);
        if (activeDirections.length) {
            this.movementAnimation.setDirections(activeDirections);
            if (!this.movementAnimation.running) {
                this.movementAnimation.start();
            }
        } else {
            this.movementAnimation.stop();
        }
    });
}

export default Schipper;
