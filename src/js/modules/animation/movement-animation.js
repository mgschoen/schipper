import SchipperEvents from '../schipper-events';

function MovementAnimation (target) {
    this.target = target;
    this.running = false;
    this.directions = [];
    this.stepSize = 0.00001;

    SchipperEvents.subscribe('KEYS_CHANGED', onKeysChanged);

    let that = this;

    function onKeysChanged (data) {
        let activeDirections = Object.keys(data).filter(key => data[key]);
        if (activeDirections.length) {
            that.setDirections(activeDirections);
            if (!that.running) {
                that.start();
            }
        } else {
            that.stop();
        }
    }

    function loopFunction () {

        let currentPosition = that.target.center;
        let movement = [0, 0];
        
        if (that.directions.includes('left')) {
            movement[0] -= that.stepSize;
        }
        if (that.directions.includes('up')) {
            movement[1] += that.stepSize;
        }
        if (that.directions.includes('right')) {
            movement[0] += that.stepSize;
        }
        if (that.directions.includes('down')) {
            movement[1] -= that.stepSize;
        }
        if (that.target.onWater(currentPosition[0] + movement[0], currentPosition[1] + movement[1])) {
            that.target.moveBy(movement[0], movement[1]);
        }
        if (that.running) {
            window.requestAnimationFrame(loopFunction);
        }
    }

    this.start = function () {
        this.running = true;
        loopFunction();
    }

    this.setDirections = function (directions) {
        this.directions = directions;
    }

    this.stop = function () {
        this.running = false;
    }
}

export default MovementAnimation;
