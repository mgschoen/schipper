import Constants from '../../constants';

const { animation } = Constants;

function AnimationController (mapboxMap, markerElement) {

    this.animating = false;
    this.moving = false;
    this.zooming = false;
    this.rotating = false;

    this._map = mapboxMap;
    this._marker = markerElement;
    this._markerScalingFactor = 1 / this._map.transform.scale;

    // where we are
    this._x = this._map.getCenter().lng;
    this._y = this._map.getCenter().lat;
    this._zoom = this._map.getZoom();
    this._rotation = this._map.getBearing();

    // where we were
    this._moveOriginX = null;
    this._moveOriginY = null;
    this._zoomOrigin = null;
    this._rotationOrigin = null;

    // where we want to get
    this._moveTargetX = null;
    this._moveTargetY = null;
    this._zoomTarget = null;
    this._rotationTarget = null;

    // when we want to get there
    this._doneMovingAt = null;
    this._doneZoomingAt = null;
    this._doneRotatingAt = null;

    // how long we are planning it to take us
    this._moveDuration = null;
    this._zoomDuration = null;
    this._rotationDuration = null;

    this._animationStep = function () {
        let now = new Date().getTime();
        if (this._moveTargetX || this._moveTargetY) {
            let calcPosition = this._calculateIntermediatePosition(now);
            if (Number.isNaN(calcPosition.x) || Number.isNaN(calcPosition.y)) {
                return;
            }
            this._map.setCenter({lng: calcPosition.x, lat: calcPosition.y});
            this._x = calcPosition.x;
            this._y = calcPosition.y;
            if (calcPosition.percentagePassed >= 1) {
                this._resetMovement();
                this.moving = false;
            }
        }
        if (this._zoomTarget) {
            let calcZoom = this._calculateIntermediateZoom(now);
            this._map.setZoom(calcZoom.zoom);
            this._resizeMarker();
            this._zoom = calcZoom.zoom;
            if (calcZoom.percentagePassed >= 1) {
                this._resetZoom();
                this.zooming = false;
            }
        }
        if (this._rotationTarget) {
            let calcRotation = this._calculateIntermediateRotation(now);
            this._map.setBearing(calcRotation.rotation);
            this._rotation = calcRotation.rotation;
            if (calcRotation.percentagePassed >= 1) {
                this._resetRotation();
                this._rotation = this._map.getBearing();
                this.rotating = false;
            }
        }
        this.animating = this.moving || this.zooming || this.rotating;
        if (this.animating) {
            window.requestAnimationFrame(this._animationStep.bind(this));
        }
    }

    this._calculateIntermediatePosition = function (time) {
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

    this._calculateIntermediateZoom = function (time) {
        let percentagePassed = this._calculatePercentagePassed(this._zoomDuration, this._doneZoomingAt, time);
        let zoomDistance = this._zoomTarget - this._zoomOrigin;
        let calcZoom = this._zoomOrigin + (zoomDistance * percentagePassed);
        return {
            zoom: calcZoom,
            percentagePassed
        };
    }

    this._calculateIntermediateRotation = function (time) {
        let percentagePassed = this._calculatePercentagePassed(this._rotationDuration, this._doneRotatingAt, time);
        let rotationDistance = this._rotationTarget - this._rotationOrigin;
        let calcRotation = this._rotationOrigin + (rotationDistance * percentagePassed);
        return {
            rotation: calcRotation,
            percentagePassed
        };
    }

    this._calculatePercentagePassed = function (duration, end, now) {
        let timePassed = duration - (end - now);
        let percentagePassed = timePassed / duration;
        if (percentagePassed > 1) {
            percentagePassed = 1
        }
        return percentagePassed
    }

    this._resetMovement = function () {
        this._moveOriginX = null;
        this._moveOriginY = null;
        this._moveTargetX = null;
        this._moveTargetY = null;
        this._moveDuration = null;
        this._doneMovingAt = null;
    }

    this._resetZoom = function () {
        this._zoomOrigin = null;
        this._zoomTarget = null;
        this._zoomDuration = null;
        this._doneZoomingAt = null;
    }

    this._resetRotation = function () {
        this._rotationOrigin = null;
        this._rotationTarget = null;
        this._rotationDuration = null;
        this._doneRotatingAt = null;
    }

    this._resizeMarker = function () {
        let scale = this._map.transform.scale * this._markerScalingFactor;
        this._marker.style.transform = `scale(${scale})`;
    }

    this.moveBy = function (x, y, duration) {
        if (this.moving) {
            console.warn('Already moving');
            return;
        }
        this._moveOriginX = this._x;
        this._moveOriginY = this._y;
        this._moveTargetX = this._x + x;
        this._moveTargetY = this._y + y;
        this._moveDuration = duration || 0;
        this._doneMovingAt = new Date().getTime() + this._moveDuration;
        this.moving = true;
        if (!this.animating) {
            window.requestAnimationFrame(this._animationStep.bind(this));
            this.animating = true;
        }
    }

    this.zoomBy = function (zoom, duration) {
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

    this.rotateBy = function (deg, duration) {
        if (this.rotating) {
            console.warn('Already rotating');
            return;
        }
        this._rotationOrigin = this._rotation;
        this._rotationTarget = this._rotation + deg;
        this._rotationDuration = duration || 0;
        this._doneRotatingAt = new Date().getTime() + this._rotationDuration;
        this.rotating = true;
        if (!this.animating) {
            window.requestAnimationFrame(this._animationStep.bind(this));
            this.animating = true;
        }
    }

}

export default AnimationController;
