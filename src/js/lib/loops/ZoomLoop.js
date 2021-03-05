import AbstractLoop from './AbstractLoop';
import Constants from '../../constants';

const { ANIMATION } = Constants;

export default class ZoomLoop extends AbstractLoop {
    constructor(target) {
        super();
        this.target = target;
        this.isZooming = false;
        this.active = true;
    }

    _loopImplementation() {
        let numVisibleLandFeatures = this.target.numLandFeatures;
        let performingZoom = false;
        if (numVisibleLandFeatures < ANIMATION.zoomFeatureThresholdMin 
            && !this.isZooming) {
                this.target.zoomOut();
                performingZoom = true;
        }
        if (numVisibleLandFeatures > ANIMATION.zoomFeatureThresholdMax
            && !this.isZooming) {
                this.target.zoomIn();
                performingZoom = true;
        }
        if (performingZoom) {
            this.isZooming = true;
            setTimeout(() => this.isZooming = false, ANIMATION.zoomDuration);
        }
    }

    destroy() {
        this.active = false;
    }
}
