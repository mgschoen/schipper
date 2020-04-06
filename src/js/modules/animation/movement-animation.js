import Constants from '../../constants';

const { animation } = Constants;

function MovementAnimation (target) {
    this.target = target;
    this.running = false;
    this.directions = [];
    this.stepSize = 0.00001;

    let that = this;

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
