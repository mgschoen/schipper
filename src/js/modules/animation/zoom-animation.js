import Constants from '../../constants';

const { animation } = Constants;

function ZoomAnimation (target) {
    
    this.target = target;
    this.isZooming = false;

    let that = this;

    function loopFunction () {
        let numVisibleLandFeatures = that.target.numLandFeatures();
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
        window.requestAnimationFrame(loopFunction);
    }

    window.requestAnimationFrame(loopFunction);
}

export default ZoomAnimation;
