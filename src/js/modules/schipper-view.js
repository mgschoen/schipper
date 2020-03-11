const STYLE_SPECIFICATION_URL = 'https://api.maptiler.com/maps/2bc5df47-f6a5-4678-a93c-790959900538/style.json?key=g96wJs8JvSyliKdi1Q1v';

function SchipperView (root, position) {
    this.center = position;
    this.map = new mapboxgl.Map({
        attributionControl: false,
        container: root,
        interactive: false,
        style: STYLE_SPECIFICATION_URL,
        center: this.center,
        zoom: 17.5
    });
    this.marker = null;

    var getPointSource = function (coordinates) {
        return {
            type: 'geojson',
            data: {
                type: 'Point',
                coordinates
            }
        };
    };

    this.map.on('load', function() {
        // Add a source and layer displaying a point which will be animated in a circle.
        this.map.addSource('marker', getPointSource(this.center));
        this.marker = this.map.getSource('marker');
            
        this.map.addLayer({
            'id': 'point',
            'source': 'marker',
            'type': 'circle',
            'paint': {
                'circle-radius': 10,
                'circle-color': '#007cbf'
            }
        });
    }.bind(this));

    this.moveTo = function (x, y, zoom) {
        this.map.jumpTo({
            center: [x, y],
            zoom: zoom ? zoom : this.map.getZoom()
        });
        this.marker.setData(getPointSource([x,y]).data);
        this.center = [x,y];
    }
}

export default SchipperView;
