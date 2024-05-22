import 'ol/ol.css';
import Feature from 'ol/Feature.js';
import Geolocation from 'ol/Geolocation.js';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import Point from 'ol/geom/Point.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';

var view = new View({
    center: [0, 0],
    zoom: 2
});

var map = new Map({
    layers: [
        new TileLayer({
            source: new OSM()
        })
    ],
    target: 'map',
    view: view
});

var geolocation = new Geolocation({
    trackingOptions: {
        enableHighAccuracy: true
    },
    projection: view.getProjection()
});

geolocation.setTracking(true);



geolocation.on('change', function() {
    console.log('accuracy = ' + geolocation.getAccuracy() + 'm ' +
        'altitude = ' + geolocation.getAltitude() + 'm ' +
        'altitudeAccuracy = ' +  geolocation.getAltitudeAccuracy() + 'm ' +
        'heading = ' + geolocation.getHeading() + 'rad ' +
        'speed = ' + geolocation.getSpeed() + 'm/s');
});
geolocation.on('error', function(error) {
    console.log('geolocation error: ' + error.message);
});
geolocation.on('change:position', function() {
    var coordinates = geolocation.getPosition();
    positionFeature.setGeometry(coordinates ? new Point(coordinates) : null);
});

var positionFeature = new Feature();
positionFeature.setStyle(new Style({
    image: new CircleStyle({
        radius: 6,
        fill: new Fill({
            color: '#3399CC'
        }),
        stroke: new Stroke({
            color: '#fff',
            width: 2
        })
    })
}));

new VectorLayer({
    map: map,
    source: new VectorSource({
        features: [positionFeature]
    })
});