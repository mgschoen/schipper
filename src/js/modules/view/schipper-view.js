import Constants from '../../constants';
import AnimationPlayer from './_animation-player';
import MovementAnimation from '../animation/movement-animation';
import ZoomAnimation from '../animation/zoom-animation';
import SchipperEvents from '../schipper-events';

const { ANIMATION, MAP } = Constants;
const MAP_OPTIONS = {
    attributionControl: false,
    interactive: false,
    style: MAP.sourceUrl,
    zoom: ANIMATION.initialZoom
};

function SchipperView (root, position) {
    this.root = typeof root === 'string' 
        ? document.querySelector('#' + root)
        : root;
    this.center = position;
    this.map = new mapboxgl.Map({
        container: root,
        center: this.center,
        ...MAP_OPTIONS
    });
    this.marker = null;

    this.animationPlayer = null;
    this.movementAnimation = new MovementAnimation(this);
    this.zoomAnimation = new ZoomAnimation(this);
    
    this.loaded = false;

    this.map.on('load', function() {
        var marker = document.createElement('figure');
        marker.className = 'pc';
        this.root.insertAdjacentElement('afterend', marker);
        this.marker = marker;
        this.animationPlayer = new AnimationPlayer(this.map, this.marker);
        this.loaded = true;
    }.bind(this));

    SchipperEvents.subscribe('POSITION_CHANGED', onPositionChanged.bind(this));

    function onPositionChanged (coords) {
        this.center[0] = coords[0] || this.center[0];
        this.center[1] = coords[1] || this.center[1];
    }

    this.moveTo = function (x, y) {
        if (!this.loaded) {
            return;
        }
        this.animationPlayer.moveTo(x, y);
    }

    this.onWater = function (lat, lon) {
        let viewportWidth = this.map._container.offsetWidth;
        let viewportHeight = this.map._container.offsetHeight;
        let viewportPosition = this.map.project([lat,lon]);
        if (viewportPosition.x < 0 || viewportPosition.x > viewportWidth ||
            viewportPosition.y < 0 || viewportPosition.y > viewportHeight) {
                throw new RangeError('Cannot check onWater status if location is out of viewport');
        }
        let waterPolygons = this.map.queryRenderedFeatures(viewportPosition, {
            layers: [MAP.waterLayerName]
        });
        return waterPolygons.length > 0;
    }

    this.numLandFeatures = function () {
        let renderedFeatures = this.map.queryRenderedFeatures();
        let nonWaterFeatures = renderedFeatures.filter(feature => {
            return feature.sourceLayer !== MAP.waterLayerName;
        });
        return nonWaterFeatures.length;
    }

    this.zoomOut = function () {
        if (!this.loaded) {
            return;
        }
        this.animationPlayer.zoomBy(-ANIMATION.zoomStep, ANIMATION.zoomDuration);
    }

    this.zoomIn = function () {
        if (!this.loaded) {
            return;
        }
        this.animationPlayer.zoomBy(ANIMATION.zoomStep, ANIMATION.zoomDuration);
    }

    this.setMarkerRotation = function (degree) {
        if (!this.loaded) {
            return;
        }
        if (Number.isNaN(degree)) {
            console.warn(`Cannot rotate marker: ${degree} is not a number`);
            return;
        }
        this.animationPlayer.rotateMarkerTo(degree);
    }
}

export default SchipperView;
