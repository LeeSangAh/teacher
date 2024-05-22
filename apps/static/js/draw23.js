
var drawnItems = L.featureGroup()

L.control.layers(
    layer_control.base_layers,
    layer_control.overlays,
    {"autoZIndex": true, "collapsed": true, "position": "topright"},{ 'drawlayer': drawnItems }
).addTo(map);

var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

var drawControl = new L.Control.Draw({
    edit: {
        featureGroup: drawnItems,
        poly: {
            allowIntersection: false
        }
    },
    draw: {
        polygon: {
            allowIntersection: false,
            showArea: true
        }
    }
});

map.addControl(drawControl);
drawControl.setPosition('topright');

map.on(L.Draw.Event.CREATED, function (event) {
    var layer = event.layer,
        type = event.layerType;

    if (type === 'circle') {
        console.log(layer.getLatLng());
        console.log(layer.getRadius());
    }



    drawnItems.addLayer(layer);


});
