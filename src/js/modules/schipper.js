import SchipperView from './schipper-view';
import SchipperInputObserver from './schipper-input-observer';
import SchipperAnimation from './schipper-animation';

function Schipper (root, position) {
    this.view = new SchipperView(root, position);
    this.animation = new SchipperAnimation(this.view);
    this.input = new SchipperInputObserver(data => {
        let activeDirections = Object.keys(data).filter(key => data[key]);
        if (activeDirections.length) {
            this.animation.setDirections(activeDirections);
            if (!this.animation.running) {
                this.animation.start();
            }
        } else {
            this.animation.stop();
        }
    });
}

export default Schipper;
