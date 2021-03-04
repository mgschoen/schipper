import Constants from '../constants';
import AnimationPlayer from './AnimationPlayer';
import PanController from './PanController';
import ZoomController from './ZoomController';
import EventBus from './EventBus';
import InstrumentPanel from './InstrumentPanel';

const { ANIMATION, MAP, UI_SETTINGS } = Constants;
const MAP_OPTIONS = {
    attributionControl: false,
    interactive: false,
    style: MAP.sourceUrl,
    zoom: ANIMATION.initialZoom
};

export default class Scene {
    constructor(root, position) {
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
        this.timePanel = null;

        this.animationPlayer = null;
        this.movementAnimation = new PanController(this);
        this.zoomAnimation = new ZoomController(this);
        
        this.loaded = false;

        this.boundOnPositionChanged = (coords) => this.onPositionChanged(coords);
        this.boundOnMissionStarted = (data) => this.onMissionStarted(data);
        this.boundOnMissionTimeChanged = (data) => this.onMissionTimeChanged(data);

        this.init();
    }

    init() {
        this.map.on('load', () => this.onMapLoaded());
        EventBus.subscribe('POSITION_CHANGED', this.boundOnPositionChanged);
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

    onPositionChanged(coords) {
        this.center[0] = coords[0] || this.center[0];
        this.center[1] = coords[1] || this.center[1];
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
        EventBus.unsubscribe('POSITION_CHANGED', this.boundOnPositionChanged);
        EventBus.unsubscribe('MISSION_TIME_CHANGED', this.boundOnMissionTimeChanged);
    }
}
