// 현재 위치를 검색하고 지도에 마커를 추가합니다.
function onLocationFound(e) {
    var radius = e.accuracy / 2;
    L.marker(e.latlng).addTo(map)
        .bindPopup("You are within " + radius + " meters from this point").openPopup();
    L.circle(e.latlng, radius).addTo(map);
}

function onLocationError(e) {
    alert(e.message);
}
// ====================== 법정동 구역 ===============================
function geo_json_styler_b(feature) {
    switch(feature.properties.S_ID) {
        default:
            return {"color": "#50bcdf",
                "fillColor": "#f440a1",
                "fillOpacity": 0,
                "opacity": 1,
                "weight": 3};
    }
}

function geo_json_onEachFeature(feature, layer) {
    layer.on('mouseover', function () {
        layer.bindTooltip(`<h6>${feature.properties.EMD_KOR_NM}</h6>`,
    {
            permanent: true,
            opacity: 1,
            direction: "center"
            }).openTooltip();
    });
    layer.on('mouseout', function () {
        layer.closeTooltip();
    });
};

var geo_json_b = L.geoJson(null, {
    onEachFeature: geo_json_onEachFeature,
    style: geo_json_styler_b,
});

function geo_json_add (data) {
    geo_json_b.addData(data).addTo(choropleth_b);
}
// ====================== 행정동 구역 ===============================
function geo_json_styler_h(feature) {
    switch(feature.properties.S_ID) {
        default:
            return {"color": "#5784f5",
                "fillColor": "#f440a1",
                "fillOpacity": 0,
                "opacity": 1,
                "weight": 3};
    }
}

function geo_json_onEachFeature_h(feature, layer) {
    layer.on('mouseover', function () {
        layer.bindTooltip(`<h6>${feature.properties.adm_nm}</h6>`,
            {
                permanent: true,
                opacity: 1,
                direction: "center"
            }).openTooltip();
    });
    layer.on('mouseout', function () {
        layer.closeTooltip();
    });
};

var geo_json_h = L.geoJson(null, {
    onEachFeature: geo_json_onEachFeature_h,
    style: geo_json_styler_h,

});

function geo_json_add_h (data) {
    geo_json_h.addData(data).addTo(choropleth_h);
}


