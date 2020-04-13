import SchipperEvents from '../schipper-events';
import AlgebraHelpers from '../helpers/algebra-helpers';

const { rotateVector } = AlgebraHelpers;

function MovementAnimation (target) {
    this.target = target;
    this.running = false;
    this.activeKeys = [];
    this.movementStepSize = 0.00001;
    this.rotationStepSize = 1;
    this.direction = 0;         // direction in degrees, north = 0, south = 180

    SchipperEvents.subscribe('KEYS_CHANGED', onKeysChanged);

    let that = this;

    function onKeysChanged (data) {
        let activeKeys = Object.keys(data).filter(key => data[key]);
        if (activeKeys.length) {
            that.setKeys(activeKeys);
            if (!that.running) {
                that.start();
            }
        } else {
            that.stop();
        }
    }

    function loopFunction () {

        let currentPosition = that.target.center;
        let acceleration = 0;
        let steering = 0;
        
        if (that.activeKeys.includes('left')) {
            steering -= that.rotationStepSize;
        }
        if (that.activeKeys.includes('right')) {
            steering += that.rotationStepSize;
        }
        if (that.activeKeys.includes('up')) {
            acceleration += that.movementStepSize;
        }
        if (that.activeKeys.includes('down')) {
            acceleration -= that.movementStepSize;
        }
        if (steering) {
            that.changeDirection(steering);
            that.target.setMarkerRotation(that.direction);
        }
        if (acceleration) {
            let movement = rotateVector(0, acceleration, that.direction);
            if (that.target.onWater(currentPosition[0] + movement[0], currentPosition[1] + movement[1])) {
                that.target.moveBy(movement[0], movement[1]);
            }
        }
        if (that.running) {
            window.requestAnimationFrame(loopFunction);
        }
    }

    this.changeDirection = function (degree) {
        let nextRotation = this.direction + degree;
        if (nextRotation < 0) {
            nextRotation = 360 + nextRotation;
        }
        if (nextRotation >= 360) {
            nextRotation = nextRotation % 360;
        }
        this.direction = nextRotation;
    }

    this.start = function () {
        this.running = true;
        loopFunction();
    }

    this.setKeys = function (keys) {
        this.activeKeys = keys;
    }

    this.stop = function () {
        this.running = false;
    }
}

export default MovementAnimation;
