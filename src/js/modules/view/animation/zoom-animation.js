import Constants from '../../../constants';

const { ANIMATION } = Constants;

export default class ZoomAnimation {
    constructor(target) {
        this.target = target;
        this.isZooming = false;
        this.init();
    }

    init() {
        window.requestAnimationFrame(this.loop.bind(this));
    }

    loop() {
        let numVisibleLandFeatures = this.target.numLandFeatures();
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
            setTimeout(_ => this.isZooming = false, ANIMATION.zoomDuration);
        }
        window.requestAnimationFrame(this.loop.bind(this));
    }
}