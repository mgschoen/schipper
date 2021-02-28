import EventBus from './EventBus';

import {
    getTransformStyles,
    setTransformStyles
} from './helpers';

export default class AnimationPlayer {
    constructor(mapboxMap, markerElement) {
        this.animating = false;
        this.moving = false;
        this.zooming = false;
        this.rotatingMarker = false;

        this._map = mapboxMap;
        this._marker = markerElement;
        this._markerScalingFactor = 1 / this._map.transform.scale;

        // where we are
        this._x = this._map.getCenter().lng;
        this._y = this._map.getCenter().lat;
        this._zoom = this._map.getZoom();
        this._markerRotation = parseFloat(getTransformStyles(this._marker).rotate) || 0;

        // where we were
        this._moveOriginX = null;
        this._moveOriginY = null;
        this._zoomOrigin = null;
        this._markerRotationOrigin = null;

        // where we want to get
        this._moveTargetX = null;
        this._moveTargetY = null;
        this._zoomTarget = null;
        this._markerRotationTarget = null;

        // when we want to get there
        this._doneMovingAt = null;
        this._doneZoomingAt = null;
        this._doneRotatingMarkerAt = null;

        // how long we are planning it to take us
        this._moveDuration = null;
        this._zoomDuration = null;
        this._markerRotationDuration = null;

        this.init();
    }

    init() {
        this.boundOnPositionChanged = coords => this.onPositionChanged(coords);
        EventBus.subscribe('POSITION_CHANGED', this.boundOnPositionChanged);
    }

    onPositionChanged(coords) {
        this._x = coords[0] || this._x;
        this._y = coords[1] || this._y;
    }

    _animationStep() {
        let now = new Date().getTime();
        if (this.moving) {
            let calcPosition = this._calculateIntermediatePosition(now);
            if (Number.isNaN(calcPosition.x) || Number.isNaN(calcPosition.y)) {
                return;
            }
            this._map.setCenter({lng: calcPosition.x, lat: calcPosition.y});
            if (calcPosition.percentagePassed >= 1) {
                this._resetMovement();
                this.moving = false;
            }
            EventBus.publish('POSITION_CHANGED', [calcPosition.x, calcPosition.y]);
        }
        if (this.zooming) {
            let calcZoom = this._calculateIntermediateZoom(now);
            this._map.setZoom(calcZoom.zoom);
            this._resizeMarker();
            this._zoom = calcZoom.zoom;
            if (calcZoom.percentagePassed >= 1) {
                this._resetZoom();
                this.zooming = false;
            }
        }
        if (this.rotatingMarker) {
            let calcMarkerRotation = this._calculateIntermediateMarkerRotation(now);
            setTransformStyles(this._marker, {rotate: `${calcMarkerRotation.markerRotation}deg`});
            this._markerRotation = calcMarkerRotation.markerRotation;
            if (calcMarkerRotation.percentagePassed >= 1) {
                this._resetMarkerRotation();
                this.rotatingMarker = false;
            }
        }
        this.animating = this.moving || this.zooming || this.rotatingMarker;
        if (this.animating) {
            window.requestAnimationFrame(this._animationStep.bind(this));
        }
    }

    _calculateIntermediatePosition(time) {
        let percentagePassed = this._calculatePercentagePassed(this._moveDuration, this._doneMovingAt, time);
        let distanceX = this._moveTargetX - this._moveOriginX;
        let distanceY = this._moveTargetY - this._moveOriginY;
        let calcX = this._moveOriginX + (distanceX * percentagePassed);
        let calcY = this._moveOriginY + (distanceY * percentagePassed);
        return {
            x: calcX,
            y: calcY,
            percentagePassed
        };
    }

    _calculateIntermediateZoom(time) {
        let percentagePassed = this._calculatePercentagePassed(this._zoomDuration, this._doneZoomingAt, time);
        let zoomDistance = this._zoomTarget - this._zoomOrigin;
        let calcZoom = this._zoomOrigin + (zoomDistance * percentagePassed);
        return {
            zoom: calcZoom,
            percentagePassed
        };
    }

    _calculateIntermediateMarkerRotation(time) {
        let percentagePassed = this._calculatePercentagePassed(this._markerRotationDuration, this._doneRotatingMarkerAt, time);
        let rotationDistance = this._markerRotationTarget - this._markerRotationOrigin;
        let calcRotation = this._markerRotationOrigin + (rotationDistance * percentagePassed);
        calcRotation = calcRotation % 360;
        if (calcRotation < 0) {
            calcRotation += 360;
        }
        return {
            markerRotation: calcRotation,
            percentagePassed
        };
    }

    _calculatePercentagePassed(duration, end, now) {
        let timePassed = duration - (end - now);
        let percentagePassed = timePassed / duration;
        if (percentagePassed > 1) {
            percentagePassed = 1
        }
        return percentagePassed
    }

    _resetMovement() {
        this._moveOriginX = null;
        this._moveOriginY = null;
        this._moveTargetX = null;
        this._moveTargetY = null;
        this._moveDuration = null;
        this._doneMovingAt = null;
    }

    _resetZoom() {
        this._zoomOrigin = null;
        this._zoomTarget = null;
        this._zoomDuration = null;
        this._doneZoomingAt = null;
    }

    _resetMarkerRotation() {
        this._markerRotationOrigin = null;
        this._markerRotationTarget = null;
        this._markerRotationDuration = null;
        this._doneRotatingMarkerAt = null;
    }

    _resizeMarker() {
        let scale = this._map.transform.scale * this._markerScalingFactor;
        setTransformStyles(this._marker, {scale});
    }

    moveTo(x, y, duration) {
        if (this.moving) {
            console.warn('Already moving');
            return;
        }
        this._moveOriginX = this._x;
        this._moveOriginY = this._y;
        this._moveTargetX = x;
        this._moveTargetY = y;
        this._moveDuration = duration || 0;
        this._doneMovingAt = new Date().getTime() + this._moveDuration;
        this.moving = true;
        if (!this.animating) {
            window.requestAnimationFrame(this._animationStep.bind(this));
            this.animating = true;
        }
    }

    zoomBy(zoom, duration) {
        if (this.zooming) {
            console.warn('Already zooming');
            return;
        }
        this._zoomOrigin = this._zoom;
        this._zoomTarget = this._zoom + zoom;
        this._zoomDuration = duration || 0;
        this._doneZoomingAt = new Date().getTime() + this._zoomDuration;
        this.zooming = true;
        if (!this.animating) {
            window.requestAnimationFrame(this._animationStep.bind(this));
            this.animating = true;
        }
    }

    rotateMarkerTo(degree, duration) {
        if (this.rotatingMarker) {
            console.warn('Already rotating marker');
            return;
        }
        // make sure we use origin and target values that
        // - are no further than 180° from each other
        // - revolve around the [0-360]° scale (small overlaps below and above tolerated)
        let rotationOrigin = this._markerRotation;
        let rotationTarget = degree % 360;
        if (rotationTarget < 0) {
            rotationTarget += 360;
        }
        let rotationDifference = rotationTarget - rotationOrigin;
        if (rotationDifference > 180) {
            rotationTarget -= 360;
        } else if (rotationDifference < -180) {
            rotationTarget += 360;
        }
        this._markerRotationOrigin = rotationOrigin;
        this._markerRotationTarget = rotationTarget;
        this._markerRotationDuration = duration || 0;
        this._doneRotatingMarkerAt = new Date().getTime() + this._markerRotationDuration;
        this.rotatingMarker = true;
        if (!this.animating) {
            window.requestAnimationFrame(this._animationStep.bind(this));
            this.animating = true;
        }
    }

    destroy() {
        EventBus.unsubscribe('POSITION_CHANGED', this.boundOnPositionChanged);
    }
}
