import Constants from '../constants';

const { animation } = Constants;

function SchipperAnimation (target) {
    this.target = target;
    this.running = false;
    this.directions = [];
    this.stepSize = 0.00001;
    this.isZooming = false;

    let that = this;

    function loopFunction () {

        let currentPosition = that.target.center;
        let movement = [0, 0];
        let numVisibleLandFeatures = that.target.numLandFeatures();
        
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
        let performingZoom = false;
        if (numVisibleLandFeatures < animation.zoomFeatureThresholdMin 
            && !that.isZooming) {
                that.target.zoomOut();
                performingZoom = true;
        }
        if (numVisibleLandFeatures > animation.zoomFeatureThresholdMax
            && !that.isZooming) {
                that.target.zoomIn();
                performingZoom = true;
        }
        if (performingZoom) {
            that.isZooming = true;
            setTimeout(_ => that.isZooming = false, animation.zoomDuration);
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