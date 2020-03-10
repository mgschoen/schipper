import Leaflet from 'leaflet';
// Keep the VectorGrid import even though it looks as if it was not used.
// It's attaching the VectorGrid plugin to the global Leaflet instance.
import LeafletVectorgrid from 'leaflet.vectorgrid';

import vectorStyles from './vector-styles';

const tileURLPattern = 'https://api.maptiler.com/maps/basic/{z}/{x}/{y}.png?key=g96wJs8JvSyliKdi1Q1v';
const openMapTilesURLPattern = 'https://api.maptiler.com/tiles/v3/{z}/{x}/{y}.pbf?key=g96wJs8JvSyliKdi1Q1v';

function SchipperView (root, position) {
    this.center = position;
    this.map = Leaflet.map(root, {
        attributionControl: false,
        boxZoom: false,
        center: this.center,
        doubleClickZoom: false,
        dragging: false,
        keyboard: false,
        scrollWheelZoom: 'center',
        zoom: 19,
        zoomControl: false
    });
    this.marker = Leaflet.circle(this.center, {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 5
    }).addTo(this.map);

    var baseLayer = Leaflet.tileLayer(tileURLPattern).addTo(this.map);
    var openMapTilesLayer = new Leaflet.VectorGrid.Protobuf(openMapTilesURLPattern, {
        vectorTileLayerStyles: vectorStyles
    }).addTo(this.map);

    this.moveTo = function (x, y) {
        this.map.setView([x,y]);
        this.marker.setLatLng([x,y]);
        this.center = [x,y];
    }
}

export default SchipperView;
