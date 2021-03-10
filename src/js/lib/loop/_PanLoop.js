import AbstractLoop from './_AbstractLoop';
import Store from '../Store';
import { translateWithBearing } from '../Helpers';

export default class PanLoop extends AbstractLoop {
    constructor(target) {
        super();
        this.target = target;
        this.activeKeys = [];
        this.movementStepSize = 0.001;
        this.rotationStepSize = 1;
        this.direction = 0;         // direction in degrees, north = 0, south = 180

        this.boundOnKeysChanged = (data) => this.onKeysChanged(data);
        Store.subscribe('activeKeys', this.boundOnKeysChanged);
    }

    onKeysChanged(data) {
        let activeKeys = Object.keys(data).filter(key => data[key]);
        if (activeKeys.length) {
            this.activeKeys = activeKeys;
            if (!this.active) {
                this.active = true;
            }
        } else {
            this.active = false;
        }
    }

    _loopImplementation() {
        let currentPosition = [Store.getItem('mapX'), Store.getItem('mapY')];
        let acceleration = 0;
        let steering = 0;
        
        if (this.activeKeys.includes('left')) {
            steering -= this.rotationStepSize;
        }
        if (this.activeKeys.includes('right')) {
            steering += this.rotationStepSize;
        }
        if (this.activeKeys.includes('up')) {
            acceleration += this.movementStepSize;
        }
        if (this.activeKeys.includes('down')) {
            acceleration -= this.movementStepSize;
        }
        if (steering) {
            this.changeDirection(steering);
            this.target.setMarkerRotation(this.direction);
        }
        if (acceleration) {
            let movementDirection = (acceleration < 0) 
                ? (this.direction + 180) % 360
                : this.direction;
            let nextPosition = translateWithBearing(
                currentPosition[0],
                currentPosition[1],
                this.movementStepSize,
                movementDirection
            );
            if (this.target.isOnWater(nextPosition[0], nextPosition[1])) {
                this.target.moveTo(nextPosition[0], nextPosition[1]);
            }
        }
    }

    changeDirection(degree) {
        let nextRotation = this.direction + degree;
        if (nextRotation < 0) {
            nextRotation = 360 + nextRotation;
        }
        if (nextRotation >= 360) {
            nextRotation = nextRotation % 360;
        }
        this.direction = nextRotation;
    }

    destroy() {
        this.stop();
        Store.unsubscribe('activeKeys', this.boundOnKeysChanged);
    }
}
