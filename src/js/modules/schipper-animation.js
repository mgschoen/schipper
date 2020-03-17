function SchipperAnimation (target) {
    this.target = target;
    this.running = false;
    this.directions = [];
    this.stepSize = 0.00001;

    let that = this;

    function loopFunction () {

        let currentPosition = that.target.center;
        let nextPosition = [...currentPosition];
        
        if (that.directions.includes('left')) {
            nextPosition[0] -= that.stepSize;
        }
        if (that.directions.includes('up')) {
            nextPosition[1] += that.stepSize;
        }
        if (that.directions.includes('right')) {
            nextPosition[0] += that.stepSize;
        }
        if (that.directions.includes('down')) {
            nextPosition[1] -= that.stepSize;
        }
        if (that.target.onWater(...nextPosition)) {
            that.target.moveTo(nextPosition[0], nextPosition[1]);
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

export default SchipperAnimation;