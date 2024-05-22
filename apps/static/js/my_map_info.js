// 내 위치 표시 함수
function showMyLocation() {
    if ("geolocation" in navigator) {
        // 위치 정보 사용 권한 요청
        navigator.geolocation.getCurrentPosition(function(position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;

            // 내 위치 표시
            var marker = new ol.Feature({
                geometry: new ol.geom.Point(
                    ol.proj.fromLonLat([longitude, latitude])
                )
            });

            var iconStyle = new ol.style.Style({
                image: new ol.style.Icon({
                    anchor: [0.5, 46],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'pixels',
                    src: 'https://openlayers.org/en/latest/examples/data/icon.png'
                })
            });

            marker.setStyle(iconStyle);

            var vectorSource = new ol.source.Vector({
                features: [marker]
            });

            var vectorLayer = new ol.layer.Vector({
                source: vectorSource
            });

            map.addLayer(vectorLayer);
        });
    } else {
        alert("Geolocation을 지원하지 않는 브라우저입니다.");
    }
}