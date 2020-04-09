import Constants from '../constants';
import AnimationController from './animation/animation-controller';

const { animation } = Constants;
const STYLE_SPECIFICATION_URL = 'https://api.maptiler.com/maps/2bc5df47-f6a5-4678-a93c-790959900538/style.json?key=g96wJs8JvSyliKdi1Q1v';
const MAP_OPTIONS = {
    attributionControl: false,
    interactive: false,
    style: STYLE_SPECIFICATION_URL,
    zoom: animation.initialZoom
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
    this.animationController = null;
    this.loaded = false;

    this.map.on('load', function() {
        var marker = document.createElement('figure');
        marker.className = 'pc';
        this.root.insertAdjacentElement('afterend', marker);
        this.marker = marker;
        this.animationController = new AnimationController(this.map, this.marker);
        this.loaded = true;
    }.bind(this));

    this.moveBy = function (x, y) {
        if (!this.loaded) {
            return;
        }
        this.animationController.moveBy(x, y);
        this.center[0] += x;
        this.center[1] += y;
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
            layers: ['water_polygon']
        });
        return waterPolygons.length > 0;
    }

    this.numLandFeatures = function () {
        let renderedFeatures = this.map.queryRenderedFeatures();
        let nonWaterFeatures = renderedFeatures.filter(feature => {
            return feature.source !== 'marker' && feature.sourceLayer !== 'water';
        });
        return nonWaterFeatures.length;
    }

    this.zoomOut = function () {
        if (!this.loaded) {
            return;
        }
        this.animationController.zoomBy(-animation.zoomStep, animation.zoomDuration);
    }

    this.zoomIn = function () {
        if (!this.loaded) {
            return;
        }
        this.animationController.zoomBy(animation.zoomStep, animation.zoomDuration);
    }
}

export default SchipperView;
