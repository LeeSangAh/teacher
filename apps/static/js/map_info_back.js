var map;
var tile_layer;
var streets;
var geo_add;

var layerGroup = L.layerGroup().addTo(map);
var choropleth = L.featureGroup().addTo(map);
var circle_group1 = L.featureGroup().addTo(map);
var circle_group2 = L.featureGroup().addTo(map);
var school_markers = new L.MarkerClusterGroup();

var adm_cd_real;
var bjdong_cd;

function layer_clear(){
    map.removeLayer( circle_group1 );
    map.removeLayer( circle_group2 );
    map.removeLayer( layerGroup );
    map.removeLayer( choropleth );

    layerGroup = L.layerGroup().addTo(map);
    choropleth = L.featureGroup().addTo(map);
    circle_group1 = L.featureGroup().addTo(map);
    circle_group2 = L.featureGroup().addTo(map);
}
function init() {
    if ("{{session['id']}}" == ""){
        alert("올바른 경로가 아닙니다.\n로그인 페이지로 이동합니다.");
        location.href="/login";
    }
}
var selectBoxChange = function (value){
    $("#sido1").val(value)
    $("#gugun1").val(value)
}

function toggleBtn1() {
    // 토글 할 버튼 선택 (btn1)
    const menu = document.getElementById('menu-panel');
    const button = document.getElementById('tblcontents');

    // btn1 숨기기 (display: none)
    if(menu.style.display !== 'none') {
        menu.style.display = 'none';
        button.style.left = 20;
    }
    // btn` 보이기 (display: block)
    else {
        menu.style.display = 'block';
        button.style.left = 260;
    }
}

function toggleBtn2() {
    // 토글 할 버튼 선택 (btn1)
    const menu = document.getElementById('detail_info');
    // btn1 숨기기 (display: none)
    if(menu.style.display !== 'none') {
        menu.style.display = 'none';
    }
    // btn` 보이기 (display: block)
    else {
        menu.style.display = 'block';
    }
}
function shop_info(lat, lon){
    var coordinate = {
        'lat':lat, 'lon':lon
    }
    $.ajax({
        type: 'POST',
        url: '/shop_info_ajax_gg',
        data: JSON.stringify(coordinate),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data){
        var c = data.result2['id_counter'];
        for (var i = 1; i < c; i++) {
            var marker_i = L.marker([data.result2['lat_'+i], data.result2['lon_'+i]], {}).addTo(layerGroup);
            var cate1 = data.result2['shop_cate1_'+i];
            var icon = data.result2['shop_cate2_icon_'+i];

            var cu_icon = L.icon({
                iconUrl: '../static/icons/'+cate1+'/'+icon+'.png',
                iconSize:     [22, 34], // size of the icon                                iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
                popupAnchor:  [0, -10] // point from which the popup should open relative to the iconAnchor
            });
            marker_i.setIcon(cu_icon);

            var popup_i = L.popup({"maxWidth": "100%"});
            var html_i = $('<div id="html_i" style="width: 100px; height: 100.0%; align: center;">'+data.result2['shop_cate3_'+i]+'</div>')[0];
            popup_i.setContent(html_i);
            marker_i.bindPopup(popup_i);
            marker_i.bindTooltip('<div>'+data.result2['shop_brand_'+i]+'</div>', {"sticky": true});
        }
    },
    error: function(request, status, error){
        alert('데이터를 가지고 오는데 실패했습니다.')
        alert(error);
    }
})
}

function shop_info2(lat, lon){
    var shop_brand;
    var coordinate = {
        'lat':lat, 'lon':lon
    }
    $.ajax({
        type: 'POST',
        url: '/shop_info_ajax_gg',
        data: JSON.stringify(coordinate),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data){
            var c = data.result2['id_counter'];
            // for (var i = 1; i < c; i++) {;
            alert ("반경 500미터 이내에"+c+"개의 교육 정보가 있습니다.");
            // }
        },
        error: function(request, status, error){
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    })
}

$('#search_bnt').click(function(){
    var sido = $('#sido').val();
    var sigugun = $('#sigugun').val();
    var dong = $('#dong').val();
    var postdata = {
        'sido':sido, 'sigugun':sigugun, 'dong':dong
    }
    if (sido == "" || sigugun == "" || dong == ""){
        alert("행정구역을 선택하세요.")
    }else{
        $.ajax({
            type: 'POST',
            url: '/search_ajax',
            data: JSON.stringify(postdata),
            dataType : 'JSON',
            contentType: "application/json",
            success: function(data){
            if (data.result2['result_type'] == 'fail'){
                alert("찾는 법정동이 없습니다.");
            } else {
                // map 이동
                map.setView([data.result2['lat'], data.result2['lon']], 15, { zoomControl: false });
                // layer_clear();
                geo_add = JSON.parse(data.result2['coordi_geojson']);
                geo_json_add(geo_add);

                document.getElementById('bjdong_cd').value = data.result2['bjdong_real'];
                document.getElementById('adm_cd_real').value = data.result2['adm_cd_real'];
            }
        },
        error: function(request, status, error){
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
        })
    }
})

$('#kinder_toggle').click(function(){
    var marker_i;
    var cu_icon;
    var c;
    var popup_i;
    var html_i;

    center = map.getCenter();
    center_y = center.lat;
    center_x = center.lng;

    var sido = $('#sido').val();
    var gugun = $('#gugun').val();
    var dong = $('#dong').val();
    var postdata = {
        'sido':sido, 'gugun':gugun, 'dong':dong, 'center_y':center_y, 'center_x':center_x
    }
    if (sido == "" || sigugun == "" || dong == ""){
        alert("행정구역을 선택하세요.")
    }else {
        $.ajax({
            type: 'POST',
            url: '/kinder_info',
            data: JSON.stringify(postdata),
            dataType: 'JSON',
            contentType: "application/json",
            success: function (data) {
                c = data.result2['id_counter'];
                for (var i = 1; i <= c; i++) {
                    marker_i = L.marker([data.result2['lat_' + i], data.result2['lon_' + i]], {}).addTo(layerGroup);

                    cu_icon = L.icon({
                        iconUrl: '../static/icons/school/kinder.png',
                        iconSize: [32, 46], // size of the icon                                iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
                        popupAnchor: [0, -10] // point from which the popup should open relative to the iconAnchor
                    });
                    marker_i.setIcon(cu_icon);
                    popup_i = L.popup({"maxWidth": "100%"});
                    html_i = $('<div id="html_i" style="width: 100px; height: 100.0%; align: center;">'
                        + "자료 기준: 2022년<br>"
                        + "* 총인원 : " + data.result2['kinder_sum_' + i] + "<br>"
                        + "- 만3세: " + data.result2['kinder_cnt_03_' + i] + "<br>"
                        + "- 만4세: " + data.result2['kinder_cnt_04_' + i] + "<br>"
                        + "- 만5세: " + data.result2['kinder_cnt_05_' + i] +
                        '</div>')[0];
                    popup_i.setContent(html_i);
                    marker_i.bindPopup(popup_i);
                    marker_i.bindTooltip('<div>' + data.result2['kinder_nm_' + i] + '/' + data.result2['kinder_type_' + i] + '</div>', {"sticky": true});
                }
            },
            error: function (request, status, error) {
                alert('데이터를 가지고 오는데 실패했습니다.')
                alert(error);
            }
        })
    }
})

$('#el_toggle').click(function(){
    var marker_i;
    var cu_icon;
    var c;
    var popup_i;
    var html_i;

    center = map.getCenter();
    center_y = center.lat;
    center_x = center.lng;

    center = map.getCenter();
    center_y = center.lat;
    center_x = center.lng;

    var sido = $('#sido').val();
    var gugun = $('#gugun').val();
    var dong = $('#dong').val();
    var postdata = {
        'sido':sido, 'gugun':gugun, 'dong':dong, 'center_y':center_y, 'center_x':center_x
    }
    if (sido == "" || sigugun == "" || dong == ""){
        alert("행정구역을 선택하세요.")
    }else {
        $.ajax({
            type: 'POST',
            url: '/el_school_info',
            data: JSON.stringify(postdata),
            dataType: 'JSON',
            contentType: "application/json",
            success: function (data) {
                c = data.result2['id_counter'];
                for (var i = 1; i <= c; i++) {
                    marker_i = L.marker([data.result2['lat_' + i], data.result2['lon_' + i]], {}).addTo(layerGroup);
                    cu_icon = L.icon({
                        iconUrl: '../static/icons/school/el.png',
                        iconSize: [32, 46], // size of the icon                                iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
                        popupAnchor: [0, -10] // point from which the popup should open relative to the iconAnchor
                    });
                    marker_i.setIcon(cu_icon);
                    popup_i = L.popup({"maxWidth": "100%"});
                    html_i = $('<div id="html_i" style="width: 100px; height: 100.0%; align: center;">'
                        + "자료 기준: 2022년<br>"
                        + "* 총인원:" + data.result2['school_cnt_' + i] + "<br>"
                        + "- 1학년: " + data.result2['school_cnt_01' + i] + "<br>"
                        + "- 2학년: " + data.result2['school_cnt_02' + i] + "<br>"
                        + "- 3학년: " + data.result2['school_cnt_03' + i] + "<br>"
                        + "- 4학년: " + data.result2['school_cnt_04' + i] + "<br>"
                        + "- 5학년: " + data.result2['school_cnt_05' + i] + "<br>"
                        + "- 6학년: " + data.result2['school_cnt_06' + i] +
                        '</div>')[0];
                    popup_i.setContent(html_i);
                    marker_i.bindPopup(popup_i);
                    marker_i.bindTooltip('<div>' + data.result2['school_nm_' + i] + '</div>', {"sticky": true});
                }
            },
            error: function (request, status, error) {
                alert('데이터를 가지고 오는데 실패했습니다.')
                alert(error);
            }
        })
    }
})

$('#mi_toggle').click(function(){
    var marker_i;
    var cu_icon;
    var c;
    var popup_i;
    var html_i;

    center = map.getCenter();
    center_y = center.lat;
    center_x = center.lng;

    var sido = $('#sido').val();
    var gugun = $('#gugun').val();
    var dong = $('#dong').val();
    var postdata = {
        'sido':sido, 'gugun':gugun, 'dong':dong, 'center_y':center_y, 'center_x':center_x
    }
    if (sido == "" || sigugun == "" || dong == ""){
        alert("행정구역을 선택하세요.")
    }else {
        $.ajax({
            type: 'POST',
            url: '/mi_school_info',
            data: JSON.stringify(postdata),
            dataType: 'JSON',

            contentType: "application/json",
            success: function (data) {
                c = data.result2['id_counter'];
                for (var i = 1; i <= c; i++) {
                    marker_i = L.marker([data.result2['lat_' + i], data.result2['lon_' + i]], {}).addTo(layerGroup);
                    cu_icon = L.icon({
                        iconUrl: '../static/icons/school/mi.png',
                        iconSize: [32, 46], // size of the icon                                iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
                        popupAnchor: [0, -10] // point from which the popup should open relative to the iconAnchor
                    });
                    marker_i.setIcon(cu_icon);

                    popup_i = L.popup({"maxWidth": "100%"});
                    html_i = $('<div id="html_i" style="width: 100px; height: 100.0%; align: center;">'
                        + "자료 기준: 2022년<br>"
                        + "* 총인원:" + data.result2['school_cnt_' + i] + "<br>"
                        + "- 1학년: " + data.result2['school_cnt_01' + i] + "<br>"
                        + "- 2학년: " + data.result2['school_cnt_02' + i] + "<br>"
                        + "- 3학년: " + data.result2['school_cnt_03' + i] +
                        '</div>')[0];
                    popup_i.setContent(html_i);
                    marker_i.bindPopup(popup_i);
                    marker_i.bindTooltip('<div>' + data.result2['school_nm_' + i] + '</div>', {"sticky": true});
                }
            },
            error: function (request, status, error) {
                alert('데이터를 가지고 오는데 실패했습니다.')
                alert(error);
            }
        })
    }
})

$('#hi_toggle').click(function(){
    var marker_i;
    var cu_icon;
    var c;
    var popup_i;
    var html_i;

    center = map.getCenter();
    center_y = center.lat;
    center_x = center.lng;

    var sido = $('#sido').val();
    var gugun = $('#gugun').val();
    var dong = $('#dong').val();
    var postdata = {
        'sido':sido, 'gugun':gugun, 'dong':dong, 'center_y':center_y, 'center_x':center_x
    }
    if (sido == "" || sigugun == "" || dong == ""){
        alert("행정구역을 선택하세요.")
    }else {
    $.ajax({
        type: 'POST',
        url: '/hi_school_info',
        data: JSON.stringify(postdata),
        dataType : 'JSON',

    contentType: "application/json",
        success: function(data){
        c = data.result2['id_counter'];
        for (var i = 1; i <= c; i++) {
            marker_i = L.marker([data.result2['lat_'+i], data.result2['lon_'+i]], {}).addTo(layerGroup);
            cu_icon = L.icon({
                iconUrl: '../static/icons/school/hi.png',
                iconSize:     [32, 46], // size of the icon                                iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
                popupAnchor:  [0, -10] // point from which the popup should open relative to the iconAnchor
            });
            marker_i.setIcon(cu_icon);

            popup_i = L.popup({"maxWidth": "100%"});
            html_i = $('<div id="html_i" style="width: 100px; height: 100.0%; align: center;">'
                +"자료 기준: 2022년<br>"
                +"* 총인원:"+data.result2['school_cnt_'+i]+"<br>"
                +"- 1학년: "+data.result2['school_cnt_01'+i]+"<br>"
                +"- 2학년: "+data.result2['school_cnt_02'+i]+"<br>"
                +"- 3학년: "+data.result2['school_cnt_03'+i]+
                '</div>')[0];
            popup_i.setContent(html_i);
            marker_i.bindPopup(popup_i);
            marker_i.bindTooltip('<div>'+data.result2['school_nm_'+i]+'</div>', {"sticky": true});
        }
    },
    error: function(request, status, error){
        alert('데이터를 가지고 오는데 실패했습니다.')
        alert(error);
    }
    })
    }
})

$('#ed_toggle').click(function(){
    var marker_i;
    var cu_icon;
    var c;
    var popup_i;
    var html_i;
    var edu_markers;
    edu_markers = new L.MarkerClusterGroup();

    center = map.getCenter();
    center_y = center.lat;
    center_x = center.lng;

    var sido = $('#sido').val();
    var gugun = $('#gugun').val();
    var dong = $('#dong').val();
    var postdata = {
        'sido1':sido, 'gugun':gugun, 'dong':dong, 'center_y':center_y, 'center_x':center_x
    }
    if (sido == "" || sigugun == "" || dong == ""){
        alert("행정구역을 선택하세요.")
    }else {
    $.ajax({
        type: 'POST',
        url: '/shop_info_ajax',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data){
            c = data.result2['id_counter'];
            for (var i = 1; i <= c; i++) {
                // var marker_i = L.marker([data.result2['lat_'+i], data.result2['lon_'+i]], {}).addTo(layerGroup);
                marker_i = L.marker([data.result2['lat_'+i], data.result2['lon_'+i]], {});
                edu_markers.addLayer(marker_i);
                map.addLayer(edu_markers);

                cate1 = data.result2['indsLclsCd_'+i];
                icon = data.result2['indsMclsCd_'+i];
                cu_icon = L.icon({
                    iconUrl: '../static/icons/'+cate1+'/'+icon+'.png',
                    iconSize:     [22, 34],
                    popupAnchor:  [0, -10]
                });
                marker_i.setIcon(cu_icon);
                popup_i = L.popup({"maxWidth": "100%"});
                html_i = $('<div id="html_i" style="width: 100px; height: 100.0%; align: center;">'+data.result2['indsSclsNm_'+i]+'</div>')[0];
                popup_i.setContent(html_i);
                marker_i.bindPopup(popup_i);
                marker_i.bindTooltip('<div>'+data.result2['bizesNm_'+i]+'</div>', {"sticky": true});
            }
        },
        error: function(request, status, error){
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    })
    }
})

$('#building_toggle').click(function(){
    var marker_i;
    var cu_icon;
    var c;
    var popup_i;
    var html_i;
    var building_markers;
    building_markers = new L.MarkerClusterGroup();
    // adm_cd_real = $('#adm_cd_real').val();
    // bjdong_cd = $('#bjdong_cd').val();
    // var postdata = {
    //     'adm_cd_real':adm_cd_real, 'bjdong_cd':bjdong_cd
    // }
    center = map.getCenter();
    center_y = center.lat;
    center_x = center.lng;

    var sido = $('#sido').val();
    var gugun = $('#gugun').val();
    var dong = $('#dong').val();
    var postdata = {
        'sido':sido, 'gugun':gugun, 'dong':dong, 'center_y':center_y, 'center_x':center_x
    }
    if (sido == "" || sigugun == "" || dong == ""){
        alert("행정구역을 선택하세요.")
    }else {
        $.ajax({
            type: 'POST',
            url: '/building_info',
            data: JSON.stringify(postdata),
            dataType: 'JSON',
            contentType: "application/json",

            success: function (data) {
                c = data.result2['id_counter'];
                for (var i = 1; i <= c; i++) {
                    // marker_i = L.marker([data.result2['lat_'+i], data.result2['lon_'+i]], {}).addTo(layerGroup);
                    marker_i = L.marker([data.result2['lat_' + i], data.result2['lon_' + i]], {});
                    building_markers.addLayer(marker_i);
                    map.addLayer(building_markers);

                    cu_icon = L.icon({
                        iconUrl: '../static/icons/building/' + data.result2['mainPurpsCd_' + i] + '.png',
                        iconSize: [16, 16], // size of the icon                                iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
                        popupAnchor: [0, -10] // point from which the popup should open relative to the iconAnchor
                    });
                    marker_i.setIcon(cu_icon);
                    marker_i.bindTooltip('<div>' + data.result2['bldNm_' + i] + '<br>' + data.result2['dongnm_' + i] + '<br>' + data.result2['hhldCnt_' + i] + '세대</div>', {"sticky": true});
                }
            },
            error: function (request, status, error) {
                alert('데이터를 가지고 오는데 실패했습니다.')
                alert(error);
            }
        })
    }
})

$('#platon_toggle').click(function(){
    var marker_i;
    var cu_icon;
    var c;
    var popup_i;
    var html_i;
    var platon_markers;
    platon_markers = new L.MarkerClusterGroup();

    center = map.getCenter();
    center_y = center.lat;
    center_x = center.lng;

    var sido1 = $('#sido1').val();
    var gugun1 = $('#gugun1').val();
    var search = $('#search').val();
    var gubun = '04'
    var postdata = {
        'sido1':sido1, 'gugun1':gugun1, 'search':search, 'gubun':gubun, 'center_y':center_y, 'center_x':center_x
    }
    $.ajax({
        type: 'POST',
        url: '/platon_info',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data){
            c = data.result2['id_counter'];
            for (var i = 1; i <= c; i++) {
                marker_i = L.marker([data.result2['lat_'+i], data.result2['lon_'+i]], {});
                platon_markers.addLayer(marker_i);
                map.addLayer(platon_markers);

                cu_icon = L.icon({
                    iconUrl: '../static/icons/center/platon_02.png',
                    iconSize:     [24, 24], // size of the icon                                iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
                    popupAnchor:  [0, -10] // point from which the popup should open relative to the iconAnchor
                });
                marker_i.setIcon(cu_icon);
                popup_i = L.popup({"maxWidth": "100%"});
                html_i = $('<div id="html_i" style="width: 100px; height: 100.0%; align: center;">'+data.result2['mem_cnt_'+i]+'명 </div>')[0];
                popup_i.setContent(html_i);
                marker_i.bindPopup(popup_i);
                marker_i.bindTooltip('<div>'+data.result2['loc_info_'+i]+'</div>', {"sticky": true});
            }
        },
        error: function(request, status, error){
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    })
    // }
})

$('#platon_custom_toggle').click(function(){
    var marker_i;
    var cu_icon;
    var c;
    var popup_i;
    var html_i;
    var platon_member_markers;
    platon_member_markers = new L.MarkerClusterGroup();

    center = map.getCenter();
    center_y = center.lat;
    center_x = center.lng;

    var postdata = {
        'sido1':""
    }
    $.ajax({
        type: 'POST',
        url: '/platon_member_info',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data){
            c = data.result2['id_counter'];
            for (var i = 1; i <= c; i++) {
                marker_i = L.marker([data.result2['lat_'+i], data.result2['lon_'+i]], {});
                platon_member_markers.addLayer(marker_i);
                map.addLayer(platon_member_markers);

                cu_icon = L.icon({
                    iconUrl: '../static/icons/center/pla.png',
                    iconSize:     [24, 24], // size of the icon                                iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
                    popupAnchor:  [0, -10] // point from which the popup should open relative to the iconAnchor
                });
                marker_i.setIcon(cu_icon);
                popup_i = L.popup({"maxWidth": "100%"});
                html_i = $('<div id="html_i" style="width: 300px; height: 100.0%; align: center;">'
                    +"- 회원 이름:"+data.result2['member_nm_'+i]+"<br>"
                    +"- SAP 번호: "+data.result2['sap_num_'+i]+"<br>"
                    +"- 센터/지점명: "+data.result2['center_nm_'+i]+"<br>"
                    +"- 선생님: "+data.result2['teacher_nm_'+i]+"<br>"
                    +"* 수업 상태:"+data.result2['lectuer_type_'+i]+"<br>"
                    +"- 부모 이름: "+data.result2['parents_nm_'+i]+"<br>"
                    +"- 부모 연락처: "+data.result2['parents_cell_'+i]+"<br>"
                    +"- 수업명: "+data.result2['edu_nm_'+i]+
                    '</div>')[0];
                popup_i.setContent(html_i);
                marker_i.bindPopup(popup_i);
                marker_i.bindTooltip('<div>'+data.result2['member_nm_'+i]+'</div>', {"sticky": true});
            }
        },
        error: function(request, status, error){
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    })
    // }
})

$('#singi_custom_toggle').click(function(){
    var marker_i;
    var cu_icon;
    var c;
    var popup_i;
    var html_i;
    var platon_member_markers;
    platon_member_markers = new L.MarkerClusterGroup();

    center = map.getCenter();
    center_y = center.lat;
    center_x = center.lng;

    var postdata = {
        'sido1':""
    }
    $.ajax({
        type: 'POST',
        url: '/singi_member_info',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data){
            c = data.result2['id_counter'];
            for (var i = 1; i <= c; i++) {
                marker_i = L.marker([data.result2['lat_'+i], data.result2['lon_'+i]], {});
                platon_member_markers.addLayer(marker_i);
                map.addLayer(platon_member_markers);

                cu_icon = L.icon({
                    iconUrl: '../static/icons/center/sin.png',
                    iconSize:     [24, 24], // size of the icon                                iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
                    popupAnchor:  [0, -10] // point from which the popup should open relative to the iconAnchor
                });
                marker_i.setIcon(cu_icon);
                popup_i = L.popup({"maxWidth": "100%"});
                html_i = $('<div id="html_i" style="width: 300px; height: 100.0%; align: center;">'
                    +"- 회원 이름:"+data.result2['member_nm_'+i]+"<br>"
                    +"- SAP 번호: "+data.result2['sap_num_'+i]+"<br>"
                    +"- 센터/지점명: "+data.result2['center_nm_'+i]+"<br>"
                    +"- 선생님: "+data.result2['teacher_nm_'+i]+"<br>"
                    +"* 수업 상태:"+data.result2['lectuer_type_'+i]+"<br>"
                    +"- 부모 이름: "+data.result2['parents_nm_'+i]+"<br>"
                    +"- 부모 연락처: "+data.result2['parents_cell_'+i]+"<br>"
                    +"- 수업명: "+data.result2['edu_nm_'+i]+
                    '</div>')[0];
                popup_i.setContent(html_i);
                marker_i.bindPopup(popup_i);
                marker_i.bindTooltip('<div>'+data.result2['member_nm_'+i]+'</div>', {"sticky": true});
            }
        },
        error: function(request, status, error){
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    })
    // }
})

// {#        {{markers|safe}}#}

// map.on("mouseup", function(e){
//     var lat = e.latlng.lat;
//     var lon = e.latlng.lng;
//
//     var postdata = {
//         'lat':lat, 'lon':lon
//     }
//     $.ajax({
//         type: 'POST',
//         url: '/get_address_ajax',
//         data: JSON.stringify(postdata),
//         dataType : 'JSON',
//         contentType: "application/json",
//         success: function(data){
//             alert(data.result2['gugun1'])
//             $("#sido1").append("<option value="+data.result2['sido1']+">"+this+"</option>");
//             // $("#sido1").val(data.result2['sido1']).prop("selected", true);
//             $("#gugun1").val(data.result2['gugun1']).prop("selected", true);
//             $("#search").val(data.result2['search']);
//         },
//         error: function(request, status, error){
//             alert('데이터를 가지고 오는데 실패했습니다.')
//             alert(error);
//         }
//     })
// })

// 오른쪽 마우스 클릭 시
map.on("contextmenu", function(e){
    map.removeLayer( circle_group1 );
    map.removeLayer( circle_group2 );

    circle_group1 = L.featureGroup().addTo(map);
    circle_group2 = L.featureGroup().addTo(map);
})

map.on("click", function(e){
    shop_info(e.latlng.lat, e.latlng.lng);
    var circle = L.circle(
        [e.latlng.lat, e.latlng.lng],
        {"bubblingMouseEvents": true, "color": "skyblue",
            "dashArray": null, "dashOffset": null,
            "fill": true, "fillColor": "skyblue",
            "fillOpacity": 0.2, "fillRule": "evenodd",
            "lineCap": "round", "lineJoin": "round",
            "opacity": 1.0, "radius": 500,
            "stroke": true, "weight": 3}
    ).addTo(circle_group2).bindTooltip('반경 500M').openPopup();

    // var marker_j = new L.Marker([e.latlng.lat, e.latlng.lng]).addTo(layerGroup);
    // var icon_j = L.AwesomeMarkers.icon({
    //     "prefix": "fa",
    //     "extraClasses": "fa-rotate-0",
    //     "icon": "home",
    //     "iconColor": "white",
    //     "markerColor": "darkred"
    // });
    // marker_j.setIcon(icon_j);
    //
    // var popup_j = L.popup({"maxWidth": "100%"});
    // var html_j = $('<div id="html_i" style="width: 100px; height: 100.0%; align: center;">가맹</div>')[0];
    // popup_j.setContent(html_j);
    // marker_j.bindPopup(popup_j);
    // marker_j.bindTooltip('<div>반경 250미터</div>', {"sticky": true});
    var circle_j = L.circle(
        [e.latlng.lat, e.latlng.lng],
        {"bubblingMouseEvents": true, "color": "skyblue",
            "dashArray": null, "dashOffset": null,
            "fill": true, "fillColor": "orange",
            "fillOpacity": 0.2, "fillRule": "evenodd",
            "lineCap": "round", "lineJoin": "round",
            "opacity": 1.0, "radius": 250,
            "stroke": true, "weight": 3}
    ).addTo(circle_group1).bindTooltip('반경 250M').openPopup();


})

// 내 위치 가져오기를 구현해보자
/***map.on('locationfound', function(e) {
            var radius = e.accuracy / 2;
            var locationMarker = L.marker(e.latlng).addTo(map)
                .bindPopup('당신의 반경 ' + radius.toFixed(1) + '미터 안에 계시겠군요.').openPopup();
            var locationCircle = L.circle(e.latlng, radius).addTo(map);
        });
 map.on('locationerror', function(e) {console.log(e.message)});
 map.locate({setView: true, maxZoom: 16});

 // move 버튼 클릭 시 특정 위치로 이동을 구현해보자
 $('#move').click(function(){
            map.locate({setView: true, maxZoom: 16});
        })
 ***/

var mini_tile_layer = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {"attribution": "Data by \u0026copy; \u003ca href=\"http://openstreetmap.org\"\u003eOpenStreetMap\u003c/a\u003e, under \u003ca href=\"http://www.openstreetmap.org/copyright\"\u003eODbL\u003c/a\u003e.", "detectRetina": false, "maxNativeZoom": 17, "maxZoom": 17, "minZoom": 5, "noWrap": false, "opacity": 10, "subdomains": "abc", "tms": false}
);

var mini_map = new L.Control.MiniMap(
    mini_tile_layer,
    {"autoToggleDisplay": false,
        "centerFixed": false,
        "collapsedHeight": 25,
        "collapsedWidth": 25,
        "height": 150,
        "minimized": false,
        "position": "bottomright",
        "toggleDisplay": false,
        "width": 150,
        "zoomAnimation": false,
        "zoomLevelOffset": -5}
);

map.addControl(mini_map);

var layer_control = {
    base_layers : {
        "openstreetmap" : tile_layer
    },
    overlays :  {
        "choropleth" : choropleth,
    },
};

L.control.layers(
    layer_control.base_layers,
    layer_control.overlays,
    {"autoZIndex": true, "collapsed": true, "position": "topright"}
).addTo(map);
