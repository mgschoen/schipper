import Constants from '../constants';

const { animation } = Constants;
const STYLE_SPECIFICATION_URL = 'https://api.maptiler.com/maps/2bc5df47-f6a5-4678-a93c-790959900538/style.json?key=g96wJs8JvSyliKdi1Q1v';

function SchipperView (root, position) {
    this.root = typeof root === 'string' 
        ? document.querySelector('#' + root)
        : root;
    this.center = position;
    this.map = new mapboxgl.Map({
        attributionControl: false,
        container: root,
        interactive: false,
        style: STYLE_SPECIFICATION_URL,
        center: this.center,
        zoom: animation.initialZoom
    });
    this.marker = null;

    this.map.on('load', function() {
        var marker = document.createElement('figure');
        marker.className = 'pc';
        this.root.insertAdjacentElement('afterend', marker);
        this.marker = marker;
    }.bind(this));

    this.moveTo = function (x, y, zoom) {
        this.map.jumpTo({
            center: [x, y],
            zoom: zoom ? zoom : this.map.getZoom()
        });
        this.center = [x,y];
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
        this.map.zoomTo(this.map.getZoom() - animation.zoomStep, {
            animated: true,
            duration: animation.zoomDuration
        });
    }

    this.zoomIn = function () {
        this.map.zoomTo(this.map.getZoom() + animation.zoomStep, {
            animated: true,
            duration: animation.zoomDuration
        });
    }
}

export default SchipperView;
