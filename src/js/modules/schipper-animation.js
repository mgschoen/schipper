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
        let nextPosition = [...currentPosition];
        let numVisibleLandFeatures = that.target.numLandFeatures();
        
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
        let performingZoom = false;
        if (numVisibleLandFeatures < animation.zoomFeatureThresholdMin 
            && !that.target.map.isZooming()) {
                that.target.zoomOut();
                performingZoom = true;
        }
        if (numVisibleLandFeatures > animation.zoomFeatureThresholdMax
            && !that.target.map.isZooming()) {
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