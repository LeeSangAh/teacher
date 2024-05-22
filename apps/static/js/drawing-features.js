var vector = new ol.layer.Vector({
    source: new ol.source.Vector()
});

var vectorLayer1 = new ol.layer.Vector({
    source: new ol.source.Vector()
});


var map = new ol.Map({
    view: new ol.View({
        zoom: 17,
        center: new ol.geom.Point([ 126.97659953, 37.579220423 ]) //처음 중앙에 보여질 경도, 위도 
        .transform('EPSG:4326', 'EPSG:3857') //GPS 좌표계 -> 구글 좌표계
        .getCoordinates(), //포인트의 좌표를 리턴함
    }),
    target: 'js-map',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.XYZ({ //vworld api 사용
                url: 'http://xdworld.vworld.kr:8080/2d/Base/202002/{z}/{x}/{y}.png'
             })
        }),
        vectorLayer1
    ]
});

$('#map_value').on('click', function(e) {
    //기존 호출 방법
    //var json = new ol.format.GeoJSON().writeFeatures(vectorLayer1.getSource().getFeatures());

    //console.log(vectorLayer1);
    //소스 불러오기
    //var json = new ol.format.GeoJSON().writeFeatures(vectorLayer1.getSource().getFeatures());
    var newfeatures = [];
    var projection = ol.proj.get('EPSG:3857'); // from 3857
    vectorLayer1.getSource().forEachFeature(function(feature) {
        var clone = feature.clone();
        clone.setId(feature.getId());  // clone does not set the id
        clone.getGeometry().transform(projection, 'EPSG:4326'); //  EPSG:4326 좌표계로 재정의
        newfeatures.push(clone);    //newfeatures의 배열에 위에 저장한 clone을 저장
    });
    //var json = new ol.format.GeoJSON().writeFeatures(vectorLayer1.getSource().getFeatures());
    var json = new ol.format.GeoJSON().writeFeatures(newfeatures);
    console.log(json);

})


//점, 선, 다각형, 원 선택
var geomRadios = $('[name=geometries]');
var drawControl;

var updateDrawControl = function() {
    var geometryType = geomRadios.filter(':checked').val();

    map.removeInteraction(drawControl);

    if (geometryType === 'None') return;

    drawControl = new ol.interaction.Draw({
        type: geometryType, //Point, LineString, Polygon, Circle
        source: vectorLayer1.getSource()      //vectorLayer1.getSource();
    });

    map.addInteraction(drawControl);
};

geomRadios.on('change', updateDrawControl);

//데이터 가져오기
function setJSON() {

    var vector_load;
    var vectorSource = new ol.source.Vector({
        url : 'test.txt',   //json 파일 위치
        projection : 'EPSG : 4326', //불러올 데이터의 좌표계 지정.
        format : new ol.format.GeoJSON()
    });

    vector_load = new ol.layer.Vector({
        source : vectorSource
    })

    map.addLayer(vector_load);
}