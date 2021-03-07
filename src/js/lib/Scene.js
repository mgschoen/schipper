import Constants from '../constants';
import AnimationPlayer from './AnimationPlayer';
import EventBus from './EventBus';
import InstrumentPanel from './InstrumentPanel';
import Store from './Store';

const { ANIMATION, MAP, UI_SETTINGS } = Constants;
const MAP_OPTIONS = {
    attributionControl: false,
    interactive: false,
    style: MAP.sourceUrl,
    zoom: ANIMATION.initialZoom
};

export default class Scene {
    constructor(root) {
        this.root = typeof root === 'string' 
            ? document.querySelector('#' + root)
            : root;
        this.map = new mapboxgl.Map({
            container: root,
            center: [Store.getItem('mapX'), Store.getItem('mapY')],
            ...MAP_OPTIONS
        });
        this.marker = null;
        this.timePanel = null;
        this.animationPlayer = null;
        this.loaded = false;

        this.boundOnMissionStarted = (data) => this.onMissionStarted(data);
        this.boundOnMissionTimeChanged = (data) => this.onMissionTimeChanged(data);

        this.map.on('load', () => this.onMapLoaded());
    }
    
    onMapLoaded() {
        // init marker
        var marker = document.createElement('figure');
        marker.className = 'pc';
        this.root.insertAdjacentElement('afterend', marker);
        this.marker = marker;

        this.animationPlayer = new AnimationPlayer(this.map, this.marker);
        EventBus.subscribe('MISSION_STARTED', this.boundOnMissionStarted);

        this.loaded = true;
        EventBus.publish('VIEW_LOADED', this);
    }

    onMissionStarted(data) {
        this.initUI(data);
        EventBus.unsubscribe('MISSION_STARTED', this.boundOnMissionStarted);
        this.boundOnMissionStarted = null;
    }

    onMissionTimeChanged(data) {
        let formattedData = this.formatTimeData(data);
        this.timePanel.update(formattedData);
    }

    initUI(initialData) {
        this.timePanel = new InstrumentPanel('bottom-right', UI_SETTINGS.prototypes.time);
        this.timePanel.update(this.formatTimeData(initialData));
        this.root.insertAdjacentElement('afterend', this.timePanel.element);
        EventBus.subscribe('MISSION_TIME_CHANGED', this.boundOnMissionTimeChanged);
    }

    formatTimeData(data) {
        let remaining = data.total - data.current;
        let remainingSeconds = remaining / 1000;
        let remainingString = '' + 
            ((remainingSeconds >= 60) ? Math.floor(remainingSeconds / 60) + 'm' : '') + 
            remainingSeconds % 60 + 's';
        return {
            remaining: remainingString
        };
    }

    moveTo(x, y) {
        if (!this.loaded) {
            return;
        }
        this.animationPlayer.moveTo(x, y);
    }

    zoomOut() {
        if (!this.loaded) {
            return;
        }
        this.animationPlayer.zoomBy(-ANIMATION.zoomStep, ANIMATION.zoomDuration);
    }

    zoomIn() {
        if (!this.loaded) {
            return;
        }
        this.animationPlayer.zoomBy(ANIMATION.zoomStep, ANIMATION.zoomDuration);
    }

    setMarkerRotation(degree) {
        if (!this.loaded) {
            return;
        }
        if (Number.isNaN(degree)) {
            console.warn(`Cannot rotate marker: ${degree} is not a number`);
            return;
        }
        this.animationPlayer.rotateMarkerTo(degree);
    }

    adMarkerToMap(lnglat) {
        new mapboxgl.Marker()
            .setLngLat(lnglat)
            .addTo(this.map);
    }

    isOnWater(lat, lon) {
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

    get numLandFeatures() {
        let renderedFeatures = this.map.queryRenderedFeatures();
        let nonWaterFeatures = renderedFeatures.filter(feature => {
            return feature.sourceLayer !== MAP.waterLayerName;
        });
        return nonWaterFeatures.length;
    }

    destroy() {
        this.map.remove();
        this.marker.remove();
        this.animationPlayer.destroy();
        this.movementAnimation.destroy();
        this.zoomAnimation.destroy();
        this.timePanel.destroy();
        EventBus.unsubscribe('MISSION_TIME_CHANGED', this.boundOnMissionTimeChanged);
    }
}
