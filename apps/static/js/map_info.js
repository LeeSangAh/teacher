var map;
var tile_layer;
var geo_add_b;
var geo_add_h;


var choropleth_b = L.featureGroup().addTo(map);
var choropleth_h = L.featureGroup().addTo(map);
var circle_group1 = L.featureGroup().addTo(map);
var circle_group2 = L.featureGroup().addTo(map);

var kinder_layerGroup = L.layerGroup().addTo(map);
var el_layerGroup = L.layerGroup().addTo(map);
var mi_layerGroup = L.layerGroup().addTo(map);
var hi_layerGroup = L.layerGroup().addTo(map);

var myloc_layerGroup = L.featureGroup().addTo(map);
var myhouse_layerGroup = L.featureGroup().addTo(map);
var hotzone_layerGroup = L.featureGroup().addTo(map);

var shop_markers = new L.MarkerClusterGroup().addTo(map);
var edu_markers = new L.MarkerClusterGroup().addTo(map);
var building_markers = new L.MarkerClusterGroup().addTo(map);
var platon_markers = new L.MarkerClusterGroup().addTo(map);
var platon_member_markers = new L.MarkerClusterGroup().addTo(map);
var singi_member_markers = new L.MarkerClusterGroup().addTo(map);
var platon_stop_member_markers = new L.MarkerClusterGroup().addTo(map);
var singi_stop_member_markers = new L.MarkerClusterGroup().addTo(map);
var asobi_markers = new L.MarkerClusterGroup().addTo(map);
var competition_markers = new L.MarkerClusterGroup().addTo(map);

var search_history = new Array();
var hot_zone = new Array();
var sh_R;

let polygon_search_history = new Array();
var poly_R = false;

var all_bjdong_cd;
var sido_cd;
var user_loc;

// A프로젝트 등급 계산을 위한 전역 변수
var zeroto4 = 0;
var fiveto8 = 0;
var sevento12 = 0;
var thirteento15 = 0;

var hhldCnt = 0;
var zeroto4_ho_c = 0;
var fiveto8_ho_c = 0;
var sevento12_ho_c = 0;
var thirteento15_ho_c = 0;

var kinder_cnt_result = 0; // 유치원 수
var el_cnt_result = 0; // 초등학교 수
var competition_result = 0; // 경쟁 가맹 수
var fiveto8_result = 0; //법정동 전체 세대수 대비 유치원 수 추정
var sevento12_result = 0; //법정동 전체 세대수 대비 초등학생 수 추정

var kinder_cnt_result_sum = 0; // 다중 법정동 유치원 수
var el_cnt_result_sum = 0; // 다중 법정동 초등학교 수
var competition_result_sum = 0; // 다중 법정동 경쟁 가맹 수
var fiveto8_result_sum = 0; // 다중 법정동 전체 세대수 대비 유치원 수 추정
var sevento12_result_sum = 0; // 다중 법정동 전체 세대수 대비 초등학생 수 추정

var unit_area = 0; // 시군구 단위 면적당 세대수
var unit_area_result = 0; // 사용자가 선택한 면적 대비 세대수 추정
var el_unit_area = 0; //시군구 단위 면적당 초등학생 수
var el_unit_area_result = 0; // 사용자가 선택한 면적 대비 초등학생 수 추정

var predict_result_cnt = 0;
var real_result_cnt = 0;

var academy_cnt = 0;

function layer_clear(){
    map.removeLayer( circle_group1 );
    map.removeLayer( circle_group2 );
    map.removeLayer( layerGroup );
    map.removeLayer( choropleth );

    layerGroup = L.layerGroup().addTo(map);
    choropleth = L.featureGroup().addTo(map);
    circle_group1 = L.featureGroup().addTo(map);
    circle_group2 = L.featureGroup().addTo(map);
};

function b_check(new_bjdong_cd){
    sh_R = search_history.includes(new_bjdong_cd);
    return sh_R
};

function p_check(polygon_bjdong_cd){
    // console.log("new_bjdong_cd"+polygon_bjdong_cd);
    poly_R = polygon_search_history.includes(polygon_bjdong_cd);
    return poly_R
};

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
};

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
};

function shop_info(lat, lon){
    var coordinate = {
        'lat':lat, 'lon':lon
    }
    $.ajax({
        type: 'POST',
        url: '/map_info/shop_info_ajax_gg',
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
};

function shop_info2(lat, lon){
    var shop_brand;
    var coordinate = {
        'lat':lat, 'lon':lon
    }
    $.ajax({
        type: 'POST',
        url: '/map_info/shop_info_ajax_gg',
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
};

function edu_search(){
    var c;
    var sido = $('#sido').val();
    var sigugun = $('#sigugun').val();
    var dong = $('#dong').val();
    var dong_nm = $('#dong option:selected').text();
    var school_type = $('#school option:selected').val();
    var subject_type = $('#subject option:selected').val();
    var search = $('#search_txt').text();
    var postdata = {
        'sido':sido, 'sigugun':sigugun, 'dong':dong
    }
    if (sido == "" || sigugun == "" || dong == ""){
        alert("행정구역을 선택하세요.")
    }else{
        $.ajax({
            type: 'POST',
            url: '/map_info/search_ajax',
            data: JSON.stringify(postdata),
            dataType : 'JSON',
            contentType: "application/json",
            success: function(data) {
                if (data.result2['result_type'] == 'fail') {
                    alert("찾는 법정동이 없습니다.");
                } else {
                    sido_cd = sido;
                    all_bjdong_cd = sigugun+dong;
                    // document.getElementById('loc_info_nm').innerText = dong_nm + " 정보보기";
                    // map 이동
                    map.setView([data.result2['lat'], data.result2['lon']], 15, {zoomControl: false});
                    localStorage.setItem("last_lat", data.result2['lat']);
                    localStorage.setItem("last_lon", data.result2['lon']);
                    localStorage.setItem("last_sido_cd", sido_cd);
                    localStorage.setItem("last_bjdong_cd", all_bjdong_cd);
                    // layer_clear();
                    geo_add_b = JSON.parse(data.result2['coordi_geojson']);
                    geo_json_add(geo_add_b);
                    // heang_area(sigugun+dong)

                    // var new_bjdong = sigugun+dong;
                    // b_check(new_bjdong);
                    // kinder_toggle(sigugun+dong);
                    // el_toggle(sigugun+dong);
                    // mi_toggle(sigugun+dong);
                    // hi_toggle(sigugun+dong);
                    // ed_toggle(sigugun+dong);
                    // academy_toggle(sigugun+dong, school_type, subject_type, search)
                    // shop_toggle(sigugun+dong);
                    // // platon_toggle(sigugun+dong);
                    // // platon_custom_toggle(sigugun+dong);
                    // // singi_custom_toggle(sigugun+dong);
                    // // platon_stop_custom_toggle(sigugun+dong);
                    // // singi_stop_custom_toggle(sigugun+dong);
                    // asobi_toggle(sigugun+dong);
                    // building_toggle(sigugun+dong);
                    // pup_cnt(sigugun+dong);
                    // academy_best_info(sigugun+dong, dong_nm);
                    select_set_value(sido_cd, all_bjdong_cd);
                }
        },
        error: function(request, status, error){
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    })
    }
}

$('#search_btn').click(function(){
    var sido = $('#sido option:selected').val();
    var sigungun = $('#sigugun option:selected').val();
    var bjdong = $('#dong option:selected').val();
    var school_type = $('#school option:selected').val();
    var subject_type = $('#subject option:selected').val();
    var search = $('#search_txt').val();

    if (sido == "" || sigugun == "" || dong == "") {
        alert("행정구역을 선택하세요.")
    }else{
        location.href="/map_info/results?search_type=1&sido="+sido+"&sigungun="+sigungun+"&bjdong="+bjdong+
        "&school_type="+school_type+"&subject_type="+subject_type+"&search="+search+"";
    }
});

function search_result(bjdong_cd , bjdong_nm, search_type){
    var school_type = $('#school option:selected').val();
    var subject_type = $('#subject option:selected').val();
    var search = $('#search_txt').val();
    var imgElement= $('.zoom-image').attr('id');
    var mapElement = document.getElementById("map");

    if (search_type == '1'){
        mapElement.style.height = "60%";
        document.getElementById(imgElement).src = "/static/images/plus_zoom.png";
        document.getElementById(imgElement).setAttribute("id", "plusButton");
    }
    bjdong_area(bjdong_cd);
    b_check(bjdong_cd);
    kinder_toggle(bjdong_cd);
    el_toggle(bjdong_cd);
    mi_toggle(bjdong_cd);
    hi_toggle(bjdong_cd);
    // ed_toggle(bjdong_cd);
    academy_toggle(bjdong_cd, school_type, subject_type, search)
    if (search_type != '1'){
        shop_toggle(bjdong_cd);
    }
    academy_best_info(bjdong_cd, bjdong_nm);
};

function bjdong_area(bjdong) {
    center = map.getCenter();
    center_y = center.lat;
    center_x = center.lng;
    var bjdong2 = $('#bjdong2').val();

    var postdata = {
        'bjdong_cd': bjdong, 'bjdong2': bjdong2
    }
    $.ajax({
        type: 'POST',
        url: '/map_info/search_area_b_ajax',
        data: JSON.stringify(postdata),
        dataType: 'JSON',
        contentType: "application/json",
        success: function (data) {
            // console.log("sh_R: ", sh_R);
            // if (sh_R == false) {
                geo_add_b = JSON.parse(data.result2['coordi_geojson']);
                geo_json_add(geo_add_b);
                document.getElementById('bjdong2').value = data.result2['bjdong2']
            // }
        },
        error: function (request, status, error) {
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    })
};

function heang_area(bjdong) {
    var bjdong2 = $('#bjdong2').val();
    var postdata = {
        'bjdong_cd': bjdong, 'bjdong2': bjdong2
    }
    $.ajax({
        type: 'POST',
        url: '/map_info/search_area_h_ajax',
        data: JSON.stringify(postdata),
        dataType: 'JSON',
        contentType: "application/json",
        success: function (data) {
            c = data.result2['id_counter'];
            if (sh_R == false) {
                for (var i = 1; i <= c; i++) {
                    geo_add_h = JSON.parse(data.result2['coordi_geojson_'+i]);
                    geo_json_add_h(geo_add_h);
                }
            }
        },
        error: function (request, status, error) {
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    })
};

// ============================== 여기부터 지도 데이터 불러오기 ===========================

function pup_cnt(bjdong) {
    var total_cnt = 0;
    var zeroto4_per = 0;
    var fiveto8_per = 0;
    var sevento12_per = 0;
    var thirteento15_per = 0;

    // console.log("들어오나")
    var postdata = {
        'bjdong': bjdong
    }
    $.ajax({
        type: 'POST',
        url: '/map_info/bjdong_heang',
        data: JSON.stringify(postdata),
        dataType: 'JSON',
        contentType: "application/json",
        success: function (data) {
            c = data.result2['id_counter'];
            for (var i = 1; i <= c; i++) {
                total_cnt += Number(data.result2['human_total_cnt_' + i]);
                console.log("total_cnt: ", total_cnt)
                zeroto4 += Number(data.result2['kids_cnt_01_' + i]);
                fiveto8 += Number(data.result2['kids_cnt_02_' + i]);
                sevento12 += Number(data.result2['kids_cnt_03_' + i]);
                thirteento15 += Number(data.result2['kids_cnt_04_' + i]);
            }

            zeroto4_per = Number(zeroto4)/Number(total_cnt);
            fiveto8_per = Number(fiveto8)/Number(total_cnt);
            sevento12_per = Number(sevento12)/Number(total_cnt);
            thirteento15_per = Number(thirteento15)/Number(total_cnt);

            total_cnt = total_cnt.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
            var zeroto4_s = zeroto4.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
            var fiveto8_s = fiveto8.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
            var sevento12_s = sevento12.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
            var thirteento15_s = thirteento15.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");

            $('#amd_info0').empty();
            $('#amd_info1').empty();
            $('#amd_info2').empty();
            $('#amd_info3').empty();
            $('#amd_info4').empty();

            $('#amd_info0').append("전체인구: 총 "+total_cnt+"명");
            $('#amd_info1').append("0~4세: 총 "+zeroto4_s+"명 ("+(zeroto4_per*100).toFixed(2)+"%)");
            $('#amd_info2').append("4~8세: 총 "+fiveto8_s+"명 ("+(fiveto8_per*100).toFixed(2)+"%)");
            $('#amd_info3').append("7~12세: 총 "+sevento12_s+"명 ("+(sevento12_per*100).toFixed(2)+"%)");
            $('#amd_info4').append("13~15세: 총 "+thirteento15_s+"명 ("+(thirteento15_per*100).toFixed(2)+"%)");

        },
        error: function (request, status, error) {
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    })
};

function kinder_toggle(bjdong_cd){
    var cu_icon;
    var c;
    var popup_i;
    var html_i;
    var kinder_marker;
    var bjdong2 = $('#bjdong2').val();
    var bjdong_cd = bjdong_cd
    var kinder_cnt = 0;
    var postdata = {
        'bjdong2': bjdong2, 'bjdong_cd':bjdong_cd
    }
    $.ajax({
        type: 'POST',
        url: '/map_info/kinder_info',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data){
            c = data.result2['id_counter'];
            kinder_cnt_result = 0;
            kinder_cnt_result = c;
            if (sh_R == false){
                for (var i = 1; i <= c; i++) {
                    kinder_marker = L.marker([data.result2['lat_' + i], data.result2['lon_' + i]], {}).addTo(kinder_layerGroup);

                    cu_icon = L.icon({
                        iconUrl: '../static/icons/school/kinder.png',
                        iconSize: [32, 46],
                        popupAnchor: [0, -10]
                    });
                    kinder_marker.setIcon(cu_icon);
                    popup_i = L.popup({"maxWidth": "100%"});
                    html_i = $('<div id="html_i" style="width: 100px; height: 100.0%; align: center;">'
                        + "자료 기준: 2022년<br>"
                        + "* 총인원 : " + data.result2['kinder_sum_' + i] + "<br>"
                        + "- 만3세: " + data.result2['kinder_cnt_03_' + i] + "<br>"
                        + "- 만4세: " + data.result2['kinder_cnt_04_' + i] + "<br>"
                        + "- 만5세: " + data.result2['kinder_cnt_05_' + i] +
                        '</div>')[0];
                    popup_i.setContent(html_i);
                    kinder_marker.bindPopup(popup_i);
                    kinder_marker.bindTooltip('<div>' + data.result2['kinder_nm_' + i] + '/' + data.result2['kinder_type_' + i] + '</div>', {"sticky": true});
                    kinder_cnt += data.result2['kinder_sum_' + i];
                }
                kinder_cnt = kinder_cnt.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
                document.getElementById('bjdong2').value = data.result2['bjdong2'];

                $('#kids').empty();
                $('#kids').append('유치원: '+c+'개 (총 '+kinder_cnt+'명)');
                search_history.push(data.result2['bjdong2']);
            }
    },
    error: function(request, status, error){
        alert('데이터를 가지고 오는데 실패했습니다.')
        alert(error);
    }
    })
};

function el_toggle(bjdong_cd){
    var marker_i;
    var cu_icon;
    var c;
    var popup_i;
    var html_i;
    var bjdong2 = $('#bjdong2').val();
    var bjdong_cd = bjdong_cd
    var el_cnt = 0;
    var postdata = {
        'bjdong2': bjdong2, 'bjdong_cd':bjdong_cd
    }
    $.ajax({
        type: 'POST',
        url: '/map_info/el_school_info',
        data: JSON.stringify(postdata),
        dataType: 'JSON',
        contentType: "application/json",
        success: function (data) {
            c = data.result2['id_counter'];
            el_cnt_result = 0;
            el_cnt_result = c;

            if (sh_R == false){
                for (var i = 1; i <= c; i++) {
                    marker_i = L.marker([data.result2['lat_' + i], data.result2['lon_' + i]], {}).addTo(el_layerGroup);
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
                    el_cnt += Number(data.result2['school_cnt_' + i]);
                }
                el_cnt = el_cnt.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
                document.getElementById('bjdong2').value = data.result2['bjdong2']
                $('#elschool').empty();
                $('#amd_info17_01').empty();
                $('#amd_info19_01').empty();
                $('#elschool').append('초등학교: '+c+'개 (총 '+el_cnt+'명)');
                $('#amd_info17_01').append('유.초 학교: '+(kinder_cnt_result+el_cnt_result)+'개');
                $('#amd_info19_01').append('초등학교: '+el_cnt_result+'개');
            }
        },
        error: function (request, status, error) {
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    })
};

function mi_toggle(bjdong_cd){
    var marker_i;
    var cu_icon;
    var c;
    var popup_i;
    var html_i;
    var bjdong2 = $('#bjdong2').val();
    var bjdong_cd = bjdong_cd;
    var mi_cnt = 0;
    var postdata = {
        'bjdong2': bjdong2, 'bjdong_cd':bjdong_cd
    }
    $.ajax({
        type: 'POST',
        url: '/map_info/mi_school_info',
        data: JSON.stringify(postdata),
        dataType: 'JSON',

        contentType: "application/json",
        success: function (data) {
            c = data.result2['id_counter'];
            if (sh_R == false){
                for (var i = 1; i <= c; i++) {
                    marker_i = L.marker([data.result2['lat_' + i], data.result2['lon_' + i]], {}).addTo(mi_layerGroup);
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
                    mi_cnt += Number(data.result2['school_cnt_' + i]);
                }
                mi_cnt = mi_cnt.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
                document.getElementById('bjdong2').value = data.result2['bjdong2']
                $('#mischool').empty();
                $('#mischool').append('중학교: '+c+'개 (총: '+mi_cnt+' 명)');
             }
        },
        error: function (request, status, error) {
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    })
};

function hi_toggle(bjdong_cd){
    var marker_i;
    var cu_icon;
    var c;
    var popup_i;
    var html_i;
    var hi_cnt = 0;
    var bjdong2 = $('#bjdong2').val();
    var bjdong_cd = bjdong_cd
    var postdata = {
        'bjdong2': bjdong2, 'bjdong_cd':bjdong_cd
    }
    $.ajax({
        type: 'POST',
        url: '/map_info/hi_school_info',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data){
            c = data.result2['id_counter'];
            // alert("고등학교 수 = "+c);
            // hi_school_dictObject = {};
            if (sh_R == false){
                for (var i = 1; i <= c; i++) {
                    marker_i = L.marker([data.result2['lat_' + i], data.result2['lon_' + i]], {}).addTo(hi_layerGroup);
                    cu_icon = L.icon({
                        iconUrl: '../static/icons/school/hi.png',
                        iconSize: [32, 46],
                        popupAnchor: [0, -10]
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
                    hi_cnt += Number(data.result2['school_cnt_' + i]);
                }
                hi_cnt = hi_cnt.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
                document.getElementById('bjdong2').value = data.result2['bjdong2']
                $('#hischool').empty();
                $('#hischool').append('고등학교: '+c+'개 (총 '+hi_cnt+'명)');
            }
    },
    error: function(request, status, error){
        alert('데이터를 가지고 오는데 실패했습니다.')
        alert(error);
    }
    })

};
function ed_toggle(bjdong_cd){
    var marker_i;
    var cu_icon;
    var c;
    var popup_i;
    var html_i;
    var bjdong2 = $('#bjdong2').val();
    var bjdong_cd = bjdong_cd
    var postdata = {
        'bjdong2': bjdong2, 'bjdong_cd':bjdong_cd
    }
    $.ajax({
        type: 'POST',
        url: '/map_info/shop_info_ajax',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data){
            c = data.result2['id_counter'];
            // alert("소상공인 개수 = "+c);
            // small_busi_dictObject = {};
            if (sh_R == false){
                for (var i = 1; i <= c; i++) {
                    // var marker_i = L.marker([data.result2['lat_'+i], data.result2['lon_'+i]], {}).addTo(edu_layerGroup);
                    marker_i = L.marker([data.result2['lat_' + i], data.result2['lon_' + i]], {});
                    edu_markers.addLayer(marker_i);
                    // map.addLayer(edu_markers);

                    cate1 = data.result2['indsLclsCd_' + i];
                    icon = data.result2['indsMclsCd_' + i];
                    cu_icon = L.icon({
                        iconUrl: '../static/icons/' + cate1 + '/' + icon + '.png',
                        iconSize: [22, 34],
                        popupAnchor: [0, -10]
                    });
                    marker_i.setIcon(cu_icon);
                    popup_i = L.popup({"maxWidth": "100%"});
                    html_i = $('<div id="html_i" style="width: 100px; height: 100.0%; align: center;">' + data.result2['indsSclsNm_' + i] + '</div>')[0];
                    popup_i.setContent(html_i);
                    marker_i.bindPopup(popup_i);
                    marker_i.bindTooltip('<div>' + data.result2['bizesNm_' + i] + '</div>', {"sticky": true});
                }
                document.getElementById('bjdong2').value = data.result2['bjdong2']
            }
        },
        error: function(request, status, error){
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    })
};

function academy_toggle(bjdong_cd){
    var marker_i;
    var cu_icon;
    var c;
    var popup_i;
    var html_i;
    var bjdong2 = $('#bjdong2').val();
    var bjdong_cd = bjdong_cd;

    var academy_cnt_01 = 0; //입시
    var academy_cnt_02 = 0; //예능
    var academy_cnt_03 = 0; //종합(보습)
    var academy_cnt_04 = 0; //외국어
    var reg_gubun = "00";
    var zone_reg_state = "1";

    var postdata = {
        'bjdong2': bjdong2, 'bjdong_cd':bjdong_cd
    }
    $.ajax({
        type: 'POST',
        url: '/map_info/academy_info_ajax',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data){
            c = data.result2['id_counter'];
            if (sh_R == false){
                for (var i = 1; i <= c; i++) {
                    var idx = data.result2['idx_' + i];
                    marker_i = L.marker([data.result2['lat_' + i], data.result2['lon_' + i]], {});
                    edu_markers.addLayer(marker_i);

                    icon = data.result2['category_cd_' + i];
                    cu_icon = L.icon({
                        iconUrl: '../static/icons/academy/' + icon + '.png',
                        iconSize: [22, 34],
                        popupAnchor: [0, -10]
                    });
                    marker_i.setIcon(cu_icon);
                    popup_i = L.popup({"maxWidth": "100%"});
                    html_i = $('<div id="html_i" style="width: 100px; height: 100.0%; align: center;">' +
                    '</div>')[0];
                    popup_i.setContent(html_i);
                    marker_i.bindPopup(popup_i);
                    marker_i.bindTooltip('<div><b>' + data.result2['academy_nm_' + i] +'</b><br>' +
                    data.result2['category_nm_' + i] + " / " + data.result2['teaching_subject_nm_01_' + i] + " / " + data.result2['teaching_line_nm_' + i]+'</div>', {"sticky": true});
                    if (data.result2['category_cd_' + i] == '02'){
                        academy_cnt_01 += 1;
                    }else if(data.result2['category_cd_' + i] == '04'){
                        academy_cnt_02 += 1;
                    }else if(data.result2['category_cd_' + i] == '05'){
                        academy_cnt_03 += 1;
                    }else if(data.result2['category_cd_' + i] == '03'){
                        academy_cnt_04 += 1;
                    }
                }
                document.getElementById('bjdong2').value = data.result2['bjdong2'];
                $('#amd_info5').empty();
                $('#amd_info6').empty();
                $('#amd_info7').empty();
                $('#amd_info8').empty();
                $('#amd_info5').append("입시.검정 및 보습: 총 "+academy_cnt_01+"개");
                $('#amd_info6').append("예능: 총 "+academy_cnt_02+"개");
                $('#amd_info7').append("종합(보습): 총 "+academy_cnt_03+"개");
                $('#amd_info8').append("외국어: 총 "+academy_cnt_04+"개");
            }
        },
        error: function(request, status, error){
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    });
}

function academy_hotzone_toggle(bjdong_cd){
    var marker_i;
    var cu_icon;
    var c;
    var popup_i;
    var html_i;
    var popup_j;
    var html_j;
    var bjdong2 = $('#bjdong2').val();
    var bjdong_cd = bjdong_cd;
    var reg_gubun = "00";
    var zone_reg_state = "0";
    var latlngs = Array();
    var postdata = {
        'bjdong2': bjdong2, 'bjdong_cd':bjdong_cd, 'session_id': session_id
    }
    $.ajax({
        type: 'POST',
        url: '/member_activity/academy_hotzone_ajax',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data){
            c = data.result2['id_counter'];
            hot_zone = new Array();
            if (sh_R == false){
                for (var i = 1; i <= c; i++) {
                    var idx = data.result2['idx_' + i];
                    // var hot_idx = data.result2['hot_idx_' + i];
                    marker_i = L.marker([data.result2['lat_' + i], data.result2['lon_' + i]], {}).addTo(hotzone_layerGroup);
                    var lat_lon = {};
                    lat_lon['lat'] = data.result2['lat_' + i];
                    lat_lon['lon'] = data.result2['lon_' + i];
                    hot_zone[i-1] = new Array(lat_lon);
                    icon = data.result2['category_cd_' + i];
                    cu_icon = L.icon({
                        iconUrl: '../static/icons/academy/' + icon + '_h.png',
                        iconSize: [22, 34],
                        popupAnchor: [0, -10]
                    });
                    marker_i.setIcon(cu_icon);
                    latlngs.push(marker_i.getLatLng());

                    popup_i = L.popup({"maxWidth": "100%"});
                    html_i = $('<div id="html_i" style="width: 100px; height: 100.0%; align: center;">' +
                        '- <a href="/edu_info/academy_info_detail?id='+idx+'+&bjdong2='+data.result2['bjdong2']+'">학원 정보</a><br> ' +
                        '- <a href="#">커뮤니티</a><br> '+
                        // '- <a href="javascript:void(0);" onclick="hotzone_reg('+idx+', '+reg_gubun+', '+zone_reg_state+',  this );">핫존 등록</a> ' +
                        '- <a href="javascript:void(0);" onclick="hotzone_reg('+idx+', '+reg_gubun+', '+zone_reg_state+', '+ bjdong_cd +');">핫존 해지</a> ' +
                        '</div>')[0];
                    popup_i.setContent(html_i);
                    marker_i.bindPopup(popup_i);
                    marker_i.bindTooltip('<div><b>' + data.result2['academy_nm_' + i] +'</b><br>' +
                        data.result2['category_nm_' + i] + " / " + data.result2['teaching_subject_nm_01_' + i] + " / " + data.result2['teaching_line_nm_' + i]+'</div>', {"sticky": true});
                    document.getElementById('bjdong2').value = data.result2['bjdong2']
                }
                var polygon = L.polygon(latlngs, {color: 'red'}).addTo(hotzone_layerGroup);
                popup_j = L.popup({"maxWidth": "100%"});
                html_j = $('<div id="html_i" style="width: 200px; height: 100.0%; align: center;">' +
                    '<b>여기는 내 핫존이야</b><br><br> ' +
                    '- <a href="#">핫플 <img src="/static/images/Ghost.gif"></a><br> ' +
                    '- <a href="#">핫친 <img src="/static/images/Ghost.gif"></a><br><br> ' +
                    '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/t1qq60p8rz8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>'+
                    '</div>')[0];
                popup_j.setContent(html_j);
                polygon.bindPopup(popup_j);
            }
        },
        error: function(request, status, error){
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    });
}

// function hotzone_reg(zone_id, gubun, zone_state, e){
function hotzone_reg(zone_id, reg_gubun, zone_reg_state, bjdong_cd){
    var reg_result = "";
    var postdata = {
        'session_id': session_id, 'zone_id': zone_id, 'gubun': reg_gubun, 'zone_state': zone_reg_state, 'bjdong_cd': bjdong_cd
    }
    $.ajax({
        type: 'POST',
        url: '/member_activity/hotzone_reg_ajax',
        data: JSON.stringify(postdata),
        async: false,
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data){
            if (zone_reg_state == 1){
                reg_result = '1';
                // $(e).text("핫존 해지");
                // $(e).attr("onclick","aaaa()");
                alert("핫존으로 등록되었습니다.");
            }else{
                reg_result = '0';
                alert("핫존 등록이 해지되었습니다.");
            }
        },
        error: function(request, status, error){
            reg_result = '0';
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    });
    map.removeLayer( hotzone_layerGroup );
    hotzone_layerGroup = L.featureGroup().addTo(map);
    academy_re_hotzone_toggle(bjdong_cd);
}

function academy_re_hotzone_toggle(bjdong_cd){
    var marker_i;
    var cu_icon;
    var c;
    var popup_i;
    var html_i;
    var popup_j;
    var html_j;
    var bjdong2 = $('#bjdong2').val();
    var bjdong_cd = bjdong_cd;
    var reg_gubun = "00";
    var zone_reg_state = "0";
    var latlngs = Array();
    var postdata = {
        'bjdong2': bjdong2, 'bjdong_cd':bjdong_cd, 'session_id': session_id
    }
    $.ajax({
        type: 'POST',
        url: '/member_activity/academy_hotzone_ajax',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data){
            c = data.result2['id_counter'];
            for (var i = 1; i <= c; i++) {
                var idx = data.result2['idx_' + i];
                var hot_idx = data.result2['hot_idx_' + i];
                marker_i = L.marker([data.result2['lat_' + i], data.result2['lon_' + i]], {}).addTo(hotzone_layerGroup);

                icon = data.result2['category_cd_' + i];
                cu_icon = L.icon({
                    iconUrl: '../static/icons/academy/' + icon + '_h.png',
                    iconSize: [22, 34],
                    popupAnchor: [0, -10]
                });
                marker_i.setIcon(cu_icon);
                latlngs.push(marker_i.getLatLng());

                popup_i = L.popup({"maxWidth": "100%"});
                html_i = $('<div id="html_i" style="width: 100px; height: 100.0%; align: center;">' +
                    '- <a href="/edu_info/academy_info_detail?id='+idx+'+&bjdong2='+data.result2['bjdong2']+'">학원 정보</a><br> ' +
                    '- <a href="#">커뮤니티</a><br> '+
                    // '- <a href="javascript:void(0);" onclick="hotzone_reg('+idx+', '+reg_gubun+', '+zone_reg_state+',  this );">핫존 등록</a> ' +
                    '- <a href="javascript:void(0);" onclick="hotzone_reg('+idx+', '+reg_gubun+', '+zone_reg_state+', '+ bjdong_cd +');">핫존 해지</a> ' +
                    '</div>')[0];
                popup_i.setContent(html_i);
                marker_i.bindPopup(popup_i);
                marker_i.bindTooltip('<div><b>' + data.result2['academy_nm_' + i] +'</b><br>' +
                    data.result2['category_nm_' + i] + " / " + data.result2['teaching_subject_nm_01_' + i] + " / " + data.result2['teaching_line_nm_' + i]+'</div>', {"sticky": true});
                document.getElementById('bjdong2').value = data.result2['bjdong2']
            }
            var polygon = L.polygon(latlngs, {color: 'red'}).addTo(hotzone_layerGroup);
            popup_j = L.popup({"maxWidth": "100%"});
            html_j = $('<div id="html_i" style="width: 200px; height: 100.0%; align: center;">' +
                '<b>여기는 내 핫존이야</b><br><br> ' +
                '- <a href="#">핫플 <img src="/static/images/Ghost.gif"></a><br> ' +
                '- <a href="#">핫친 <img src="/static/images/Ghost.gif"></a><br><br> ' +
                '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/t1qq60p8rz8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>'+
                '</div>')[0];
            popup_j.setContent(html_j);
            polygon.bindPopup(popup_j);
        },
        error: function(request, status, error){
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    });
}

function shop_toggle(bjdong_cd){
    var marker_i;
    var cu_icon;
    var c;
    var popup_i;
    var html_i;

    var bjdong2 = $('#bjdong2').val();
    var bjdong_cd = bjdong_cd
    var postdata = {
        'bjdong2': bjdong2, 'bjdong_cd':bjdong_cd
    }
    $.ajax({
        type: 'POST',
        url: '/map_info/shop_info_23',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data){
            c = data.result2['id_counter'];
            if (sh_R == false){
                for (var i = 1; i <= c; i++) {
                    marker_i = L.marker([data.result2['lat_' + i], data.result2['lon_' + i]], {});
                    shop_markers.addLayer(marker_i);
                    icon = data.result2['indsLclsCd_' + i];
                    cu_icon = L.icon({
                        iconUrl: '../static/icons/shop/' + icon + '.png',
                        iconSize: [22, 34],
                        popupAnchor: [0, -10]
                    });
                    marker_i.setIcon(cu_icon);
                    popup_i = L.popup({"maxWidth": "100%"});
                    html_i = $('<div id="html_i" style="width: 100px; height: 100.0%; align: center;">' + data.result2['indsSclsNm_' + i] + '</div>')[0];
                    popup_i.setContent(html_i);
                    marker_i.bindPopup(popup_i);
                    marker_i.bindTooltip('<div>' + data.result2['bizesNm_' + i] + '</div>', {"sticky": true});
                }
                document.getElementById('bjdong2').value = data.result2['bjdong2'];
                var c1 = c.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
                $('#amd_info10').empty();
                $('#amd_info10').append("소상공인: "+c1+"개");
            }
        },
        beforeSend:function(){
            // (이미지 보여주기 처리)
            $('.wrap-loading').removeClass('display-none');
        },complete:function(){
            // (이미지 감추기 처리)
            $('.wrap-loading').addClass('display-none');
        },
        error: function(request, status, error){
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    });
}

function shop_best_info(bjdong_cd, new_bjdong_nm){
    var marker_i;
    var cu_icon;
    var c;
    var popup_i;
    var html_i;

    var bjdong2 = $('#bjdong2').val();
    var bjdong_cd = bjdong_cd

    var postdata = {
        'bjdong2': bjdong2, 'bjdong_cd':bjdong_cd
    }
    $.ajax({
        type: 'POST',
        url: '/map_info/shop_info_best_ajax',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data){
            c = data.result2['id_counter'];
                for (var i = 1; i <= c; i++) {
                    var bizesNm = "bizesNm_"+i
                    var indsSclsNm = "indsSclsNm_"+i
                    var academy_img = "academy_"+i
                    document.getElementById('bjdong_nm').innerHTML= new_bjdong_nm + ' 인기 학원';
                    // document.getElementById(academy_img).src = data.result2['shop_img_'+i];
                    $("#"+academy_img+"").attr("src", "/static/images/"+data.result2['shop_img_'+i]+"");
                    document.getElementById(bizesNm).innerHTML = data.result2['bizesNm_'+i];
                    document.getElementById(indsSclsNm).innerHTML = data.result2['indsSclsNm_'+i];
                    // document.getElementById(bizesNm).href = data.result2['shop_img_'+i];
                    document.getElementById('bjdong2').value = data.result2['bjdong2']
                }
        },
        error: function(request, status, error){
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    })
};

var academy_best_len;

function academy_best_info(bjdong_cd, new_bjdong_nm){
    var marker_i;
    var cu_icon;
    var c;
    var popup_i;
    var html_i;

    var bjdong2 = $('#bjdong2').val();
    var bjdong_cd = bjdong_cd

    var postdata = {
        'bjdong2': bjdong2, 'bjdong_cd':bjdong_cd
    }
    $.ajax({
        type: 'POST',
        url: '/map_info/academy_best_info_ajax',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data){
            academy_best_len = data.result2['id_counter'];
            c = data.result2['id_counter'];
            document.getElementById('bjdong_nm').innerHTML= new_bjdong_nm + ' 인기 학원';
            document.getElementById('bjdong2').value = data.result2['bjdong2'];
            for (var i = 1; i <= c; i++) {
                var bizesNm = "bizesNm_"+i;
                var indsSclsNm = "indsSclsNm_"+i;
                var academy_img = "academy_"+i;
                var academy_url = "academy_url_"+i;

                $("#"+academy_img+"").attr("src", "/static/images/"+data.result2['shop_img_01_'+i]+"");
                $("#"+academy_url+"").attr("href", "/edu_info/academy_info_detail?id="+data.result2['idx_'+i]+"");
                document.getElementById(bizesNm).innerHTML = data.result2['academy_nm_'+i];
                document.getElementById(indsSclsNm).innerHTML = data.result2['teaching_subject_nm_01_'+i];
            }
        },
        error: function(request, status, error){
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    })
};

function building_toggle(bjdong_cd){
    var marker_i;
    var cu_icon;
    var c;
    var bjdong2 = $('#bjdong2').val();
    var bjdong_cd = bjdong_cd
    var hhldCnt_c = 0;
    var postdata = {
        'bjdong2': bjdong2, 'bjdong_cd':bjdong_cd
    }
    $.ajax({
        type: 'POST',
        url: '/map_info/building_info',
        data: JSON.stringify(postdata),
        dataType: 'JSON',
        contentType: "application/json",
        success: function (data) {
            c = data.result2['id_counter'];
            console.log("C: ", c)
            if (sh_R == false){
                for (var i = 1; i <= c; i++) {
                    marker_i = L.marker([data.result2['lat_' + i], data.result2['lon_' + i]], {});
                    building_markers.addLayer(marker_i);
                    cu_icon = L.icon({
                        iconUrl: '../static/icons/building/' + data.result2['mainPurpsCd_' + i] + '.png',
                        iconSize: [16, 16],
                        popupAnchor: [0, -10]
                    });
                    marker_i.setIcon(cu_icon);
                    marker_i.bindTooltip('<div>' + data.result2['bldNm_' + i] + '<br>' + data.result2['dongnm_' + i] + '<br>' + data.result2['hhldCnt_' + i] + '세대</div>', {"sticky": true});
                    hhldCnt_c += Number(data.result2['hhldCnt_' + i]);
                }
                hhldCnt = hhldCnt_c;
                zeroto4_ho_c = zeroto4/hhldCnt;
                fiveto8_ho_c = fiveto8/hhldCnt;
                sevento12_ho_c = sevento12/hhldCnt;
                thirteento15_ho_c = thirteento15/hhldCnt;
                fiveto8_result = (fiveto8_ho_c*hhldCnt).toFixed(1);
                sevento12_result = (sevento12_ho_c*hhldCnt).toFixed(1);

                document.getElementById('bjdong2').value = data.result2['bjdong2']
                hhldCnt = hhldCnt.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
                fiveto8_result = fiveto8_result.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");

                $('#amd_info9').empty();
                $('#amd_info9_01').empty();
                $('#amd_info17').empty();
                $('#amd_info19_03').empty();
                $('#amd_info19').empty();
                $('#amd_info9').append("공동주택: "+hhldCnt+"세대");
                $('#amd_info19').append("공동주택: "+hhldCnt+"세대");
                $('#amd_info9_01').append('<li>0~4세: 세대 당 '+zeroto4_ho_c.toFixed(2)+'명</li>' +
                    '<li>4~8세(추정): 세대 당 '+fiveto8_ho_c.toFixed(2)+'명</li>' +
                    '<li>7~12세(추정): 세대 당 '+sevento12_ho_c.toFixed(2)+'명</li>' +
                    '<li style="margin-bottom: 10px;">13~15세(추정):  세대 당 '+thirteento15_ho_c.toFixed(2)+'명</li>');
                $('#amd_info17').append('4~8세: '+fiveto8_result+'명');
                $('#amd_info19_03').append('초등(추정): '+sevento12_result+'명');

            }
        },
        beforeSend:function(){
            // (이미지 보여주기 처리)
            $('.wrap-loading').removeClass('display-none');
        },complete:function(){
            // (이미지 감추기 처리)
            $('.wrap-loading').addClass('display-none');
        },
        error: function (request, status, error) {
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
        ,timeout:100000 //"응답제한시간 ms"
    })
};

function platon_toggle(bjdong_cd) {
    var marker_i;
    var cu_icon;
    var c;
    var popup_i;
    var html_i;
    var bjdong2 = $('#bjdong2').val();
    var bjdong_cd = bjdong_cd
    var mem_cnt_c = 0;
    var postdata = {
        'bjdong2': bjdong2, 'bjdong_cd':bjdong_cd
    }
    $.ajax({
        type: 'POST',
        url: '/map_info/platon_info',
        data: JSON.stringify(postdata),
        dataType: 'JSON',
        contentType: "application/json",
        success: function (data) {
            c = data.result2['id_counter'];
            if (sh_R == false) {
                for (var i = 1; i <= c; i++) {
                    marker_i = L.marker([data.result2['lat_' + i], data.result2['lon_' + i]], {});
                    platon_markers.addLayer(marker_i);

                    cu_icon = L.icon({
                        iconUrl: '../static/icons/center/platon_02.png',
                        iconSize: [24, 24], // size of the icon                                iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
                        popupAnchor: [0, -10] // point from which the popup should open relative to the iconAnchor
                    });
                    marker_i.setIcon(cu_icon);
                    popup_i = L.popup({"maxWidth": "100%"});
                    html_i = $('<div id="html_i" style="width: 100px; height: 100.0%; align: center;">' + data.result2['mem_cnt_' + i] + '명 </div>')[0];
                    popup_i.setContent(html_i);
                    marker_i.bindPopup(popup_i);
                    marker_i.bindTooltip('<div>' + data.result2['loc_info_' + i] + '</div>', {"sticky": true});
                    mem_cnt_c += Number(data.result2['mem_cnt_' + i]);
                }
                document.getElementById('bjdong2').value = data.result2['bjdong2'];
                mem_cnt_c = mem_cnt_c.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
                $('#amd_info11').empty();
                $('#amd_info11').append("플라톤 센터 (회원): "+c+"개 ("+mem_cnt_c+"명)" );
            }
        },
        error: function (request, status, error) {
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    })
    // }
};

// $('#platon_custom_toggle').click(function(){
function platon_custom_toggle(bjdong_cd){
        var marker_i;
        var cu_icon;
        var c;
        var popup_i;
        var html_i;
        var bjdong2 = $('#bjdong2').val();
        var bjdong_cd = bjdong_cd
        var postdata = {
            'bjdong2': bjdong2, 'bjdong_cd':bjdong_cd
        }
            $.ajax({
                type: 'POST',
                url: '/map_info/platon_member_info',
                data: JSON.stringify(postdata),
                dataType: 'JSON',
                contentType: "application/json",
                success: function (data) {
                    c = data.result2['id_counter'];
                    if (sh_R == false) {
                        for (var i = 1; i <= c; i++) {
                            // alert(data.result2['member_nm_'+i]);
                            // alert('c: '+c);
                            // alert('i: '+i);
                            // marker_i = L.marker([data.result2['lat_' + i], data.result2['lon_' + i]], {}).addTo(platon_member_layerGroup);
                            marker_i = L.marker([data.result2['lat_' + i], data.result2['lon_' + i]], {});
                            platon_member_markers.addLayer(marker_i);
                            // map.addLayer(platon_member_markers);

                            cu_icon = L.icon({
                                iconUrl: '../static/icons/center/pla.png',
                                iconSize: [24, 24],
                                popupAnchor: [0, -10]
                            });
                            var birthDate  = data.result2['birth_' + i]
                            var y = birthDate .substr(0, 4);
                            var m = birthDate .substr(4, 2);
                            var d = birthDate .substr(6, 2);
                            var today = new Date();
                            birthDate = new Date(y,m-1,d);
                            var age = today.getFullYear() - birthDate.getFullYear() + 1;

                            marker_i.setIcon(cu_icon);
                            popup_i = L.popup({"maxWidth": "100%"});
                            html_i = $('<div id="html_i" style="width: 300px; height: 100.0%; align: center;">'
                                + "- 회원 이름:" + data.result2['member_nm_' + i] + "<br>"
                                + "- 생년월일/나이:" + data.result2['birth_' + i] + "/"+ age+"세 <br>"
                                + "- SAP 번호: " + data.result2['sap_num_' + i] + "<br>"
                                + "- 센터/지점명: " + data.result2['center_nm_' + i] + "<br>"
                                + "- 선생님: " + data.result2['teacher_nm_' + i] + "<br>"
                                + "* 수업 상태:" + data.result2['lectuer_type_' + i] + "<br>"
                                + "- 부모 이름: " + data.result2['parents_nm_' + i] + "<br>"
                                + "- 부모 연락처: " + data.result2['parents_cell_' + i] + "<br>"
                                + "- 수업명: " + data.result2['edu_nm_' + i] +
                                '</div>')[0];
                            popup_i.setContent(html_i);
                            marker_i.bindPopup(popup_i);
                            marker_i.bindTooltip('<div>' + data.result2['member_nm_' + i] + '</div>', {"sticky": true});
                        }
                        document.getElementById('bjdong2').value = data.result2['bjdong2'];
                    }
                },
                error: function (request, status, error) {
                    alert('데이터를 가지고 오는데 실패했습니다.')
                    alert(error);
                }
            })
        // }
};

function singi_custom_toggle(bjdong_cd){
    var marker_i;
    var cu_icon;
    var c;
    var popup_i;
    var html_i;

    var bjdong2 = $('#bjdong2').val();
    var bjdong_cd = bjdong_cd

    var postdata = {
        'bjdong2': bjdong2, 'bjdong_cd':bjdong_cd
    }
    $.ajax({
        type: 'POST',
        url: '/map_info/singi_member_info',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data){
            c = data.result2['id_counter'];
            if (sh_R == false) {
                for (var i = 1; i <= c; i++) {
                    // marker_i = L.marker([data.result2['lat_' + i], data.result2['lon_' + i]], {}).addTo(singi_member_layerGroup);
                    marker_i = L.marker([data.result2['lat_' + i], data.result2['lon_' + i]], {});
                    singi_member_markers.addLayer(marker_i);
                    // map.addLayer(singi_member_markers);

                    cu_icon = L.icon({
                        iconUrl: '../static/icons/center/sin.png',
                        iconSize: [24, 24], // size of the icon                                iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
                        popupAnchor: [0, -10] // point from which the popup should open relative to the iconAnchor
                    });

                    var birthDate  = data.result2['birth_' + i]
                    var y = birthDate .substr(0, 4);
                    var m = birthDate .substr(4, 2);
                    var d = birthDate .substr(6, 2);
                    var today = new Date();
                    birthDate = new Date(y,m-1,d);
                    var age = today.getFullYear() - birthDate.getFullYear() + 1;

                    marker_i.setIcon(cu_icon);
                    popup_i = L.popup({"maxWidth": "100%"});
                    html_i = $('<div id="html_i" style="width: 300px; height: 100.0%; align: center;">'
                        + "- 회원 이름:" + data.result2['member_nm_' + i] + "<br>"
                        + "- 생년월일/나이:" + data.result2['birth_' + i] + "/"+ age+"세 <br>"
                        + "- SAP 번호: " + data.result2['sap_num_' + i] + "<br>"
                        + "- 센터/지점명: " + data.result2['center_nm_' + i] + "<br>"
                        + "- 선생님: " + data.result2['teacher_nm_' + i] + "<br>"
                        + "* 수업 상태:" + data.result2['lectuer_type_' + i] + "<br>"
                        + "- 부모 이름: " + data.result2['parents_nm_' + i] + "<br>"
                        + "- 부모 연락처: " + data.result2['parents_cell_' + i] + "<br>"
                        + "- 수업명: " + data.result2['edu_nm_' + i] +
                        '</div>')[0];
                    popup_i.setContent(html_i);
                    marker_i.bindPopup(popup_i);
                    marker_i.bindTooltip('<div>' + data.result2['member_nm_' + i] + '</div>', {"sticky": true});
                }
                document.getElementById('bjdong2').value = data.result2['bjdong2']
            }
        },
        error: function(request, status, error){
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    })
  // }
};

function platon_stop_custom_toggle(bjdong_cd){
    var marker_i;
    var cu_icon;
    var c;
    var popup_i;
    var html_i;
    var bjdong2 = $('#bjdong2').val();
    var bjdong_cd = bjdong_cd;
    var postdata = {
        'bjdong2': bjdong2, 'bjdong_cd':bjdong_cd
    }
    $.ajax({
        type: 'POST',
        url: '/map_info/platon_stop_member_info',
        data: JSON.stringify(postdata),
        dataType: 'JSON',
        contentType: "application/json",
        success: function (data) {
            c = data.result2['id_counter'];
            if (sh_R == false) {
                for (var i = 1; i <= c; i++) {

                    marker_i = L.marker([data.result2['lat_' + i], data.result2['lon_' + i]], {});
                    platon_stop_member_markers.addLayer(marker_i);

                    cu_icon = L.icon({
                        iconUrl: '../static/icons/center/stop_pla.png',
                        iconSize: [24, 24],
                        popupAnchor: [0, -10]
                    });
                    var birthDate  = data.result2['birth_' + i]
                    var y = birthDate .substr(0, 4);
                    var m = birthDate .substr(4, 2);
                    var d = birthDate .substr(6, 2);
                    var today = new Date();
                    birthDate = new Date(y,m-1,d);
                    var age = today.getFullYear() - birthDate.getFullYear() + 1;

                    marker_i.setIcon(cu_icon);
                    popup_i = L.popup({"maxWidth": "100%"});
                    html_i = $('<div id="html_i" style="width: 300px; height: 100.0%; align: center;">'
                        + "- 회원 이름:" + data.result2['member_nm_' + i] + "<br>"
                        + "- 생년월일/나이:" + data.result2['birth_' + i] + "/"+ age+"세 <br>"
                        + "- SAP 번호: " + data.result2['sap_num_' + i] + "<br>"
                        + "- 센터/지점명: " + data.result2['center_nm_' + i] + "<br>"
                        + "- 선생님: " + data.result2['teacher_nm_' + i] + "<br>"
                        + "* 수업 상태:" + data.result2['lectuer_type_' + i] + "<br>"
                        + "- 부모 이름: " + data.result2['parents_nm_' + i] + "<br>"
                        + "- 부모 연락처: " + data.result2['parents_cell_' + i] + "<br>"
                        + "- 수업명: " + data.result2['edu_nm_' + i] +
                        '</div>')[0];
                    popup_i.setContent(html_i);
                    marker_i.bindPopup(popup_i);
                    marker_i.bindTooltip('<div>' + data.result2['member_nm_' + i] + '</div>', {"sticky": true});
                }
                document.getElementById('bjdong2').value = data.result2['bjdong2'];
                c = c.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
                $('#amd_info13').empty();
                $('#amd_info13').append("플라톤 (휴회): "+c+"명" );
            }
        },
        error: function (request, status, error) {
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    })
};

function singi_stop_custom_toggle(bjdong_cd){
    var marker_i;
    var cu_icon;
    var c;
    var popup_i;
    var html_i;

    var bjdong2 = $('#bjdong2').val();
    var bjdong_cd = bjdong_cd

    var postdata = {
        'bjdong2': bjdong2, 'bjdong_cd':bjdong_cd
    }
    $.ajax({
        type: 'POST',
        url: '/map_info/singi_stop_member_info',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data){
            c = data.result2['id_counter'];
            if (sh_R == false) {
                for (var i = 1; i <= c; i++) {
                    marker_i = L.marker([data.result2['lat_' + i], data.result2['lon_' + i]], {});
                    singi_stop_member_markers.addLayer(marker_i);

                    cu_icon = L.icon({
                        iconUrl: '../static/icons/center/stop_sin.png',
                        iconSize: [24, 24],
                        popupAnchor: [0, -10]
                    });
                    var birthDate  = data.result2['birth_' + i]
                    var y = birthDate .substr(0, 4);
                    var m = birthDate .substr(4, 2);
                    var d = birthDate .substr(6, 2);
                    var today = new Date();
                    birthDate = new Date(y,m-1,d);
                    var age = today.getFullYear() - birthDate.getFullYear() + 1;

                    marker_i.setIcon(cu_icon);
                    popup_i = L.popup({"maxWidth": "100%"});
                    html_i = $('<div id="html_i" style="width: 300px; height: 100.0%; align: center;">'
                        + "- 회원 이름:" + data.result2['member_nm_' + i] + "<br>"
                        + "- 생년월일/나이:" + data.result2['birth_' + i] + "/"+ age+"세 <br>"
                        + "- SAP 번호: " + data.result2['sap_num_' + i] + "<br>"
                        + "- 센터/지점명: " + data.result2['center_nm_' + i] + "<br>"
                        + "- 선생님: " + data.result2['teacher_nm_' + i] + "<br>"
                        + "* 수업 상태:" + data.result2['lectuer_type_' + i] + "<br>"
                        + "- 부모 이름: " + data.result2['parents_nm_' + i] + "<br>"
                        + "- 부모 연락처: " + data.result2['parents_cell_' + i] + "<br>"
                        + "- 수업명: " + data.result2['edu_nm_' + i] +
                        '</div>')[0];
                    popup_i.setContent(html_i);
                    marker_i.bindPopup(popup_i);
                    marker_i.bindTooltip('<div>' + data.result2['member_nm_' + i] + '</div>', {"sticky": true});
                }
                document.getElementById('bjdong2').value = data.result2['bjdong2'];
                c = c.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
                $('#amd_info14').empty();
                $('#amd_info14').append("신기한 (휴회): "+c+"명" );
            }
        },
        error: function(request, status, error){
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    })
    // }
};

function hansol_member(bjdong_cd){
        var postdata = {
        'bjdong_cd':bjdong_cd
    }
    $.ajax({
        type: 'POST',
        url: '/map_info/hansol_member_info',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data){
            console.log("data.result2['member_cnt']", data.result2['member_cnt']);
            real_result_cnt = data.result2['member_cnt'];
            $('#amd_info22').empty();
            $('#amd_info22').append("<span class='fas fa-check text-success me-1' data-fa-transform='shrink-2'></span>"+real_result_cnt+"명(실제)" );

        },
        error: function(request, status, error){
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    })
}

function compete_toggle(bjdong_cd) {
    var marker_i;
    var cu_icon;
    var c;
    var popup_i;
    var html_i;
    var bjdong2 = $('#bjdong2').val();
    var bjdong_cd = bjdong_cd;
    var postdata = {
        'bjdong2': bjdong2, 'bjdong_cd':bjdong_cd
    }
    $.ajax({
        type: 'POST',
        url: '/map_info/compete_bjdong_info',
        data: JSON.stringify(postdata),
        dataType: 'JSON',
        contentType: "application/json",
        success: function (data) {
            c = data.result2['id_counter'];
            if (sh_R == false) {
                for (var i = 1; i <= c; i++) {
                    marker_i = L.marker([data.result2['lat_' + i], data.result2['lon_' + i]], {});
                    asobi_markers.addLayer(marker_i);
                    cu_icon = L.icon({
                        iconUrl: '../static/icons/R/competition.png',
                        iconSize: [22, 21],
                        popupAnchor: [0, -10]
                    });
                    marker_i.setIcon(cu_icon);
                    popup_i = L.popup({"maxWidth": "100%"});
                    html_i = $('<div id="html_i" style="width: 300px; height: 100.0%; align: center;">'
                        + data.result2['place_add_' + i] + '(' +data.result2['place_tel_' + i]+')</div>')[0];
                    popup_i.setContent(html_i);
                    marker_i.bindPopup(popup_i);
                    marker_i.bindTooltip('<div>' + data.result2['place_name_' + i] + '</div>', {"sticky": true});
                }
                competition_result = 0;
                competition_result = c;
                document.getElementById('bjdong2').value = data.result2['bjdong2'];
                c = c.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");

                $('#amd_info15').empty();
                $('#amd_info15').append("경쟁(시설형): "+c+"개" );
                $('#amd_info17_02').empty();
                $('#amd_info17_02').append('경쟁(시설형): '+c+'개');
                $('#amd_info19_02').empty();
                $('#amd_info19_02').append('경쟁(시설형): '+c+'개');
            }
        },
        error: function (request, status, error) {
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    })
};

function asobi_toggle(bjdong_cd) {
    var marker_i;
    var cu_icon;
    var c;
    var popup_i;
    var html_i;
    var bjdong2 = $('#bjdong2').val();
    var bjdong_cd = bjdong_cd;
    var postdata = {
        'bjdong2': bjdong2, 'bjdong_cd':bjdong_cd
    }
    $.ajax({
        type: 'POST',
        url: '/map_info/asobi_bjdong_info',
        data: JSON.stringify(postdata),
        dataType: 'JSON',
        contentType: "application/json",
        success: function (data) {
            c = data.result2['id_counter'];
            if (sh_R == false) {
                for (var i = 1; i <= c; i++) {
                    marker_i = L.marker([data.result2['lat_' + i], data.result2['lon_' + i]], {});
                    asobi_markers.addLayer(marker_i);
                    cu_icon = L.icon({
                        iconUrl: '../static/icons/R/R01_01.png',
                        iconSize: [22, 21],
                        popupAnchor: [0, -10]
                    });
                    marker_i.setIcon(cu_icon);
                    popup_i = L.popup({"maxWidth": "100%"});
                    html_i = $('<div id="html_i" style="width: 300px; height: 100.0%; align: center;">'
                        + data.result2['Addr_' + i] + '</div>')[0];
                    popup_i.setContent(html_i);
                    marker_i.bindPopup(popup_i);
                    marker_i.bindTooltip('<div>' + data.result2['storeNm_' + i] + '</div>', {"sticky": true});
                }
                document.getElementById('bjdong2').value = data.result2['bjdong2'];
                c = c.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
                $('#amd_info16').empty();
                $('#amd_info16').append("아소비: "+c+"개" );
            }
        },
        error: function (request, status, error) {
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    })
};
// ============================== 여기까지 지도 데이터 불러오기 ===========================


function sigungu_area_unit(bjdong, n1){
    var sigungu_cd = bjdong.substr(0, 5);
    console.log(sigungu_cd);
    var postdata = {
        'sigungu_cd': sigungu_cd
    }
    $.ajax({
        type: 'POST',
        url: '/map_info/sigungu_area_unit',
        data: JSON.stringify(postdata),
        dataType: 'JSON',
        contentType: "application/json",
        success: function (data) {
            var ho_sum = data.result2['ho_sum'];
            var sigungu_user_area = data.result2['sigungu_user_area'];
            var sigungu_nm = data.result2['sigungu_nm'];
            console.log(ho_sum, sigungu_user_area);
            unit_area = Number(ho_sum)/Number(sigungu_user_area);
            console.log("시군구 평균 세대: ", unit_area);
            console.log(n1);
            unit_area_result = (unit_area * Number(n1)).toFixed(2);
            console.log(unit_area_result, "단위 면적당 시군구 평균 세대수");
            $('#amd_info19_00').empty();
            $('#amd_info19_00').append('<li>세대수 평균 ('+sigungu_nm+'): '+unit_area_result+'</li>');
        },
        error: function (request, status, error) {
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    })
}

function sigungu_el_unit(bjdong, n1){
    var sigungu_cd = bjdong.substr(0, 5);
    console.log(sigungu_cd);
    var postdata = {
        'sigungu_cd': sigungu_cd
    }
    $.ajax({
        type: 'POST',
        url: '/map_info/sigungu_elstudent_unit',
        data: JSON.stringify(postdata),
        dataType: 'JSON',
        contentType: "application/json",
        success: function (data) {
            var el_sum = data.result2['el_sum'];
            var sigungu_user_area = data.result2['sigungu_user_area'];
            var sigungu_nm = data.result2['sigungu_nm'];
            console.log(el_sum, sigungu_user_area);

            el_unit_area = Number(el_sum)/Number(sigungu_user_area);
            console.log("평균 초등학생: ", el_unit_area);
            console.log(n1);
            el_unit_area_result = (el_unit_area * Number(n1)).toFixed(2);
            console.log(el_unit_area_result, "단위 면적당 시군구 평균 초등학생수");

            $('#amd_info19_03_01').empty();
            $('#amd_info19_03_01').append('<li>초등 평균 ('+sigungu_nm+'): '+el_unit_area_result+'</li>');

        },
        error: function (request, status, error) {
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    })
}


function btn_call($href, bjdong_cd){
    if(bjdong_cd){
    layer_popup($href);
    btn_bjdong_info(bjdong_cd);
    }else{
        alert("지역을 선택하세요.");
    }
};

function btn_bjdong_info (bjdong_cd){
    bjdong_area(bjdong_cd);
    pup_cnt_button(bjdong_cd);
    kinder_button(bjdong_cd);
    el_button(bjdong_cd);
    mi_button(bjdong_cd);
    hi_button(bjdong_cd);
    ed_button(bjdong_cd);
    building_button(bjdong_cd);
    platon_button(bjdong_cd);
    platon_custom_button(bjdong_cd);
    singi_custom_button(bjdong_cd);
    platon_stop_custom_button(bjdong_cd);
    singi_stop_custom_button(bjdong_cd);
    asobi_button(bjdong_cd);

};

// ======== 법정동에 대한 정보 가져오기 =================
function get_polygon_info(bjdong, polygon, n1) {
    // sigungu_area_unit(bjdong, n1);
    // sigungu_el_unit(bjdong, n1);

    var postdata = {
        'draw_poly': polygon,
        'bjdong': bjdong
    }
    $.ajax({
        type: 'POST',
        url: '/map_info/cal_polygon_front',
        data: JSON.stringify(postdata),
        dataType: 'JSON',
        contentType: "application/json",
        success: function (data) {
            // 유치원
            var kinder = data.kinder_data['kinder_info_result'];
            var kinder_json = JSON.parse(kinder);
            var kinder_cnt = kinder_json.length;
            var kinder_cnt_c = 0;
            for (var i = 0; i < kinder_cnt; i++) {
                kinder_cnt_c += Number(kinder_json[i]['cnt_sum']);
            }
            kinder_cnt_result = 0;
            kinder_cnt_result = kinder_cnt;
            kinder_cnt_c = kinder_cnt_c.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
            $('#kids').empty();
            $('#kids').append('유지원: '+kinder_cnt+'개 (총 '+kinder_cnt_c+'명)');

            // 초등학교
            var el_school = data.el_school_data['el_school_info_result'];
            var el_json = JSON.parse(el_school);
            var el_cnt = el_json.length;
            var el_cnt_c = 0;
            el_cnt_result = 0;
            el_cnt_result = el_cnt;
            for (var i = 0; i < el_cnt; i++) {
                el_cnt_c += Number(el_json[i]['SUM_CNT']);
            }
            el_cnt_c = el_cnt_c.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
            $('#elschool').empty();
            $('#amd_info17_01').empty();
            $('#amd_info19_01').empty();
            $('#elschool').append('초등학교: '+el_cnt+'개 (총 '+el_cnt_c+'명)');
            $('#amd_info17_01').append('유.초 학교: '+(kinder_cnt_result+el_cnt_result)+'개');
            $('#amd_info19_01').append('초등학교: '+el_cnt+'개 (총 '+el_cnt_c+'명)');

            // 중학교
            var mi_school = data.mi_school_data['mi_school_info_result'];
            var mi_json = JSON.parse(mi_school);
            var mi_cnt = mi_json.length;
            var mi_cnt_c = 0;
            for (var i = 0; i < mi_cnt; i++) {
                mi_cnt_c += Number(mi_json[i]['SUM_CNT']);
            }
            mi_cnt_c = mi_cnt_c.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
            $('#mischool').empty();
            $('#mischool').append('중학교: '+mi_cnt+'개 (총 '+mi_cnt_c+'명)');

            //고등학교
            var hi_school = data.hi_school_data['hi_school_info_result'];
            var hi_json = JSON.parse(hi_school);
            var hi_cnt = hi_json.length;
            var hi_cnt_c = 0;
            for (var i = 0; i < hi_cnt; i++) {
                hi_cnt_c += Number(hi_json[i]['SUM_CNT']);
            }
            hi_cnt_c = hi_cnt_c.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
            $('#hischool').empty();
            $('#hischool').append('고등학교: '+hi_cnt+'개 (총 '+hi_cnt_c+'명)');

            // 건물
            var building = data.building_data['building_info_result'];
            var building_json = JSON.parse(building);
            var building_cnt = building_json.length;
            var building_cnt_c = 0;
            for (var i = 0; i < building_cnt; i++) {
                building_cnt_c += Number(building_json[i]['HO_CNT']);
            }
            var zeroto4_per_h = zeroto4/building_cnt_c;
            var fiveto8_per_h = fiveto8/building_cnt_c;
            var sevento12_per_h = sevento12/building_cnt_c;
            var thirteento15_per_h = thirteento15/building_cnt_c;

            console.log(zeroto4_per_h, fiveto8_per_h, sevento12_per_h, thirteento15_per_h);
            fiveto8_result = fiveto8_ho_c*building_cnt_c;
            sevento12_result = sevento12_ho_c*building_cnt_c;

            building_cnt_c_s = building_cnt_c.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
            $('#amd_info9').empty();
            $('#amd_info9_01').empty();
            $('#amd_info17').empty();
            $('#amd_info19').empty();
            $('#amd_info19_03').empty();
            $('#amd_info9').append('공동주택(아파트 포함): '+building_cnt_c_s+'세대');
            $('#amd_info19').append("공동주택:"+building_cnt_c_s+"세대");
            $('#amd_info9_01').append('<li>0~4세: 세대 당 '+zeroto4_ho_c.toFixed(2)+'명</li>' +
                '<li>4~8세: 세대 당 '+fiveto8_ho_c.toFixed(2)+'명</li>' +
                '<li>7~12세: 세대 당 '+sevento12_ho_c.toFixed(2)+'명</li>' +
                '<li style="margin-bottom: 10px;">13~15세:  세대 당 '+thirteento15_ho_c.toFixed(1)+'명</li>');
            $('#amd_info17').append('4~8세 (추정): '+fiveto8_result.toFixed(1)+'명');
            $('#amd_info19_03').append('초등(추정): '+sevento12_result.toFixed(1)+'명');

            // 소상공인
            var shop = data.shop_data['shop_info_result'];
            var shop_json = JSON.parse(shop);
            var shop_cnt = shop_json.length;
            shop_cnt = shop_cnt.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
            $('#amd_info10').empty();
            $('#amd_info10').append('소상공인: '+shop_cnt+'개');

            // 학원
            var academy = data.academy_data['academy_info_result'];
            var academy_json = JSON.parse(academy);
            var academy_cnt = academy_json.length;
            var academy_cnt_01 = 0;
            var academy_cnt_02 = 0;
            var academy_cnt_03 = 0;
            var academy_cnt_04 = 0;
            for (var i = 0; i < academy_cnt; i++) {
                // console.log(academy_json[i]['category_cd']);
                if (academy_json[i]['category_cd'] == '02'){
                    academy_cnt_01 += 1;
                }else if(academy_json[i]['category_cd'] == '04'){
                    academy_cnt_02 += 1;
                }else if(academy_json[i]['category_cd'] == '05'){
                    academy_cnt_03 += 1;
                }else if(academy_json[i]['category_cd'] == '03'){
                    academy_cnt_04 += 1;
                }
            }
            academy_cnt_01 = academy_cnt_01.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
            academy_cnt_02 = academy_cnt_02.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
            academy_cnt_03 = academy_cnt_03.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
            academy_cnt_04 = academy_cnt_04.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
            $('#amd_info5').empty();
            $('#amd_info6').empty();
            $('#amd_info7').empty();
            $('#amd_info8').empty();
            $('#amd_info5').append('입시.검정 및 보습: 총'+academy_cnt_01+'개');
            $('#amd_info6').append('예능: 총'+academy_cnt_02+'개');
            $('#amd_info7').append('종합(보습): 총'+academy_cnt_03+'개');
            $('#amd_info8').append('외국어: 총'+academy_cnt_04+'개');

            var asobi_center = data.asobi_data['asobi_info_result'];
            var asobi_c_json = JSON.parse(asobi_center);
            var asobi_cnt = asobi_c_json.length;
            asobi_cnt = asobi_cnt.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
            $('#amd_info16').empty();
            $('#amd_info16').append('아소비: '+asobi_cnt+'개');

            var competition_center = data.competition_data['competition_info_result'];
            var competition_json = JSON.parse(competition_center);
            var competition_cnt = competition_json.length;
            competition_cnt = competition_cnt.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
            competition_result = 0;
            competition_result = competition_cnt;
            $('#amd_info15').empty();
            $('#amd_info15').append('경쟁(시설형): '+competition_result+'개');
            $('#amd_info17_02').empty();
            $('#amd_info17_02').append('경쟁(시설형): '+competition_result+'개');
            $('#amd_info19_02').empty();
            $('#amd_info19_02').append('경쟁(시설형): '+competition_result+'개');

            var platon_center = data.platon_data['platon_info_result'];
            var pla_c_json = JSON.parse(platon_center);
            var pla_c_cnt = pla_c_json.length;
            var pla_c_m_cnt = 0;
            for (var i = 0; i < pla_c_cnt; i++) {
                pla_c_m_cnt += Number(pla_c_json[i]['mem_cnt']);
            }
            pla_c_m_cnt = pla_c_m_cnt.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
            $('#amd_info11').empty();
            $('#amd_info11').append('플라톤 센터 (회원): '+pla_c_cnt+'개 ('+pla_c_m_cnt+')명');

            var platon_stop = data.platon_stop_data['platon_stop_member_info_result'];
            var platon_stop_json = JSON.parse(platon_stop);
            var pla_stop_cnt = platon_stop_json.length;
            pla_stop_cnt = pla_stop_cnt.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
            $('#amd_info13').empty();
            $('#amd_info13').append('플라톤 (휴회): '+pla_stop_cnt+'명');

            var singi_stop = data.singi_stop_data['singi_stop_member_info_result'];
            var sin_stop_json = JSON.parse(singi_stop);
            var sin_stop_cnt = sin_stop_json.length;
            sin_stop_cnt = sin_stop_cnt.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
            $('#amd_info14').empty();
            $('#amd_info14').append('신기한 (휴회): '+sin_stop_cnt+'명');

            a_proj();

            // platon_proj(building_cnt_c);
        },
        beforeSend:function(){
            // (이미지 보여주기 처리)
            $('.wrap-loading').removeClass('display-none');
        },complete:function(){
            // (이미지 감추기 처리)
            $('.wrap-loading').addClass('display-none');
        },
        error: function (request, status, error) {
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    })
};

// ======== 다중 법정동에 대한 정보 가져오기 =================
function get_polygon_info_nopigom(new_bjdong, new_bjdong_nm, polygon, n1) {
    var kinder_marker;
    var el_marker;
    var edu_marker;
    var asobi_marker;
    var competition_marker;
    $('#school_info').append('<div class="fs--2 mt-3" id='+new_bjdong+'_school><span class="dot bg-primary"></span><span class="fw-semi-bold text-900">'+new_bjdong_nm+'</span></div>');
    $('#building_business_info').append('<div class="fs--2 mt-3" id='+new_bjdong+'_bb_info><span class="dot bg-primary"></span><span class="fw-semi-bold text-900">'+new_bjdong_nm+'</span></div>');
    $('#academy_info_nopigon').append('<div class="fs--2 mt-3" id='+new_bjdong+'_academy_info><span class="dot bg-primary"></span><span class="fw-semi-bold text-900">'+new_bjdong_nm+'</span></div>');
    var postdata = {
        'draw_poly': polygon,
        'bjdong': new_bjdong
    }
    $.ajax({
        type: 'POST',
        url: '/map_info/cal_polygon_front_nopigon',
        data: JSON.stringify(postdata),
        dataType: 'JSON',
        contentType: "application/json",
        success: function (data) {
            // ============= 유치원 시작 =============
            var kinder = data.kinder_data['kinder_info_result'];
            var kinder_json = JSON.parse(kinder);
            var kinder_cnt = kinder_json.length;
            var kinder_cnt_c = 0;
            for (var i = 0; i < kinder_cnt; i++) {
                kinder_cnt_c += Number(kinder_json[i]['cnt_sum']);
                kinder_marker = L.marker([kinder_json[i]['lat'], kinder_json[i]['lon']], {}).addTo(kinder_layerGroup);
                var cu_icon_1 = L.icon({
                    iconUrl: '../static/icons/school/kinder.png',
                    iconSize: [32, 46],
                    popupAnchor: [0, -10]
                });
                kinder_marker.setIcon(cu_icon_1);
                var popup_1 = L.popup({"maxWidth": "100%"});
                var html_1 = $('<div id="html_i" style="width: 100px; height: 100.0%; align: center;">'
                    + "자료 기준: 2022년<br>"
                    + "* 총인원 : " + kinder_json[i]['cnt_sum'] + "<br>"
                    + "- 만3세: " + kinder_json[i]['cnt_3'] + "<br>"
                    + "- 만4세: " + kinder_json[i]['cnt_4'] + "<br>"
                    + "- 만5세: " + kinder_json[i]['cnt_5'] +
                    '</div>')[0];
                popup_1.setContent(html_1);
                kinder_marker.bindPopup(popup_1);
                kinder_marker.bindTooltip('<div>' + kinder_json[i]['kinder'] + '/' + kinder_json[i]['establish'] + '</div>', {"sticky": true});
            };
            kinder_cnt_result = 0;
            kinder_cnt_result = kinder_cnt;
            kinder_cnt_result_sum +=kinder_cnt_result;
            kinder_cnt_c = kinder_cnt_c.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
            // ============= 유치원 끝 =============

            // ============= 초등학교 시작 =============
            var el_school = data.el_school_data['el_school_info_result'];
            var el_json = JSON.parse(el_school);
            var el_cnt = el_json.length;
            var el_cnt_c = 0;
            el_cnt_result = 0;
            el_cnt_result = el_cnt;
            el_cnt_result_sum += el_cnt_result;
            for (var i = 0; i < el_cnt; i++) {
                el_cnt_c += Number(el_json[i]['SUM_CNT']);
                el_marker = L.marker([el_json[i]['lat'], el_json[i]['lon']], {}).addTo(el_layerGroup);
                var cu_icon_2 = L.icon({
                    iconUrl: '../static/icons/school/el.png',
                    iconSize: [32, 46],
                    popupAnchor: [0, -10]
                });
                el_marker.setIcon(cu_icon_2);
                var popup_2 = L.popup({"maxWidth": "100%"});
                var html_2 = $('<div id="html_i" style="width: 100px; height: 100.0%; align: center;">'
                    + "자료 기준: 2022년<br>"
                    + "* 총인원:" + el_json[i]['SUM_CNT'] + "<br>"
                    + "- 1학년: " + el_json[i]['school_cnt_01'] + "<br>"
                    + "- 2학년: " + el_json[i]['school_cnt_02'] + "<br>"
                    + "- 3학년: " + el_json[i]['school_cnt_03'] + "<br>"
                    + "- 4학년: " + el_json[i]['school_cnt_04'] + "<br>"
                    + "- 5학년: " + el_json[i]['school_cnt_05'] + "<br>"
                    + "- 6학년: " + el_json[i]['school_cnt_06'] +
                    '</div>')[0];
                popup_2.setContent(html_2);
                el_marker.bindPopup(popup_2);
                el_marker.bindTooltip('<div>' + el_json[i]['SCHUL_NM'] + '</div>', {"sticky": true});
            }
            el_cnt_c = el_cnt_c.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
            $('#elschool').empty();
            $('#amd_info17_01').empty();
            $('#amd_info19_01').empty();
            $('#elschool').append('초등학교: ' + el_cnt + '개 (총 ' + el_cnt_c + '명)');
            $('#amd_info17_01').append('유.초 학교: ' + (kinder_cnt_result_sum + el_cnt_result_sum) + '개');
            $('#amd_info19_01').append('초등학교: ' + el_cnt + '개 (총 ' + el_cnt_c + '명)');
            $('#'+new_bjdong+'_school').append('<div class="d-flex flex-between-center mb-1"> ' +
                                                '<div class="d-flex align-items-center">' +
                                                '   <li><span class="fw-semi-bold text-900" id="kids">유지원: ' + kinder_cnt + '개 (총 ' + kinder_cnt_c + '명)</span></li></div>' +
                                                '</div>' +
                                                '<div class="d-flex flex-between-center mb-1">' +
                                                '   <div class="d-flex align-items-center">' +
                                                '<li><span class="fw-semi-bold text-900" id="el_school">초등학교: ' + el_cnt + '개 (총 ' + el_cnt_c + '명)</span></li></div>' +
                                                '</div>');
            // ============= 초등학교 끝 =============

            // ============= 건물 시작 =============
            var building = data.building_data['building_info_result'];
            var building_json = JSON.parse(building);
            var building_cnt = building_json.length;

            var building_cnt_c = 0;
            for (var i = 0; i < building_cnt; i++) {
                building_cnt_c += Number(building_json[i]['HO_CNT']);
            }

            var pup_cnt = data.result2['id_counter'];
            for (var i = 0; i < pup_cnt; i++) {
              zeroto4 = data.result2['kids_cnt_01_'+pup_cnt];
              fiveto8 = data.result2['kids_cnt_02_'+pup_cnt];
              sevento12 = data.result2['kids_cnt_03_'+pup_cnt];
              thirteento15 = data.result2['kids_cnt_04_'+pup_cnt];
            }

            var bjdong_building_hocnt_sum = data.result2['HO_CNT_SUM_result'];
            var zeroto4_per_h = zeroto4 / bjdong_building_hocnt_sum;
            var fiveto8_per_h = fiveto8 / bjdong_building_hocnt_sum;
            var sevento12_per_h = sevento12 / bjdong_building_hocnt_sum;
            var thirteento15_per_h = thirteento15 / bjdong_building_hocnt_sum;

            fiveto8_result = fiveto8_per_h * building_cnt_c;
            sevento12_result = sevento12_per_h * building_cnt_c;
            fiveto8_result_sum += fiveto8_result;
            sevento12_result_sum += sevento12_result;

            building_cnt_c_s = building_cnt_c.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
            $('#amd_info9').empty();
            $('#amd_info9_01').empty();
            $('#amd_info17').empty();
            $('#amd_info19').empty();
            $('#amd_info19_03').empty();
            $('#amd_info9').append('공동주택(아파트 포함): ' + building_cnt_c_s + '세대');
            $('#amd_info19').append("공동주택:" + building_cnt_c_s + "세대");
            // $('#amd_info9_01').append('<li>0~4세: 세대 당 ' + zeroto4_ho_c.toFixed(2) + '명</li>' +
            //     '<li>4~8세: 세대 당 ' + fiveto8_ho_c.toFixed(2) + '명</li>' +
            //     '<li>7~12세: 세대 당 ' + sevento12_ho_c.toFixed(2) + '명</li>' +
            //     '<li style="margin-bottom: 10px;">13~15세:  세대 당 ' + thirteento15_ho_c.toFixed(1) + '명</li>');
            $('#amd_info17').append('4~8세 (추정): ' + fiveto8_result_sum.toFixed(1) + '명');
            $('#amd_info19_03').append('초등 (추정): ' + sevento12_result_sum.toFixed(1) + '명');

            $('#'+new_bjdong+'_bb_info').append('<div class="d-flex flex-between-center mb-1"> ' +
                                                    '<div class="align-items-center">' +
                                                    '* 공공주택(아파트 포함): ' + building_cnt_c_s + '세대' +
                                                        '<li>0~4세: 세대 당 ' + zeroto4_per_h.toFixed(2) + '명</li>' +
                                                        '<li>4~8세: 세대 당 ' + fiveto8_per_h.toFixed(2) + '명</li>' +
                                                        '<li>7~12세: 세대 당 ' + sevento12_per_h.toFixed(2) + '명</li>' +
                                                        '<li style="margin-bottom: 10px;">13~15세:  세대 당 ' + thirteento15_per_h.toFixed(1) + '명</li>' +
                                                    '</div>' +
                                                '</div>');


            // ============= 건물 끝 =============

            // ============= 소상공인 시작 =============
            var shop = data.shop_data['shop_info_result'];
            var shop_json = JSON.parse(shop);
            var shop_cnt = shop_json.length;
            shop_cnt = shop_cnt.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
            $('#amd_info10').empty();
            $('#amd_info10').append('소상공인: ' + shop_cnt + '개');
            // ============= 소상공인 끝 =============

            // ============= 학원 시작 =============
            var academy = data.academy_data['academy_info_result'];
            var academy_json = JSON.parse(academy);
            var academy_cnt = academy_json.length;
            var academy_cnt_01 = 0;
            var academy_cnt_02 = 0;
            var academy_cnt_03 = 0;
            var academy_cnt_04 = 0;
            for (var i = 0; i < academy_cnt; i++) {
                if (academy_json[i]['category_cd'] == '02') {
                    academy_cnt_01 += 1;
                } else if (academy_json[i]['category_cd'] == '04') {
                    academy_cnt_02 += 1;
                } else if (academy_json[i]['category_cd'] == '05') {
                    academy_cnt_03 += 1;
                } else if (academy_json[i]['category_cd'] == '03') {
                    academy_cnt_04 += 1;
                }
                edu_marker = L.marker([academy_json[i]['lat'], academy_json[i]['lon']], {});
                edu_markers.addLayer(edu_marker);

                icon = academy_json[i]['category_cd'];
                var cu_icon_3 = L.icon({
                    iconUrl: '../static/icons/academy/' + icon + '.png',
                    iconSize: [22, 34],
                    popupAnchor: [0, -10]
                });
                edu_marker.setIcon(cu_icon_3);
                edu_marker.bindTooltip('<div><b>' + academy_json[i]['ACADEMY_NM'] +'</b><br>' +
                    academy_json[i]['CATEGORY_NM']+ " / " + academy_json[i]['teaching_subject_nm_01'] + " / " + academy_json[i]['TEACHING_LINE_NM']+'</div>', {"sticky": true});

            }
            academy_cnt_01 = academy_cnt_01.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
            academy_cnt_02 = academy_cnt_02.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
            academy_cnt_03 = academy_cnt_03.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
            academy_cnt_04 = academy_cnt_04.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
            $('#amd_info5').empty();
            $('#amd_info6').empty();
            $('#amd_info7').empty();
            $('#amd_info8').empty();
            $('#amd_info5').append('입시.검정 및 보습: 총' + academy_cnt_01 + '개');
            $('#amd_info6').append('예능: 총' + academy_cnt_02 + '개');
            $('#amd_info7').append('종합(보습): 총' + academy_cnt_03 + '개');
            $('#amd_info8').append('외국어: 총' + academy_cnt_04 + '개');
            $('#'+new_bjdong+'_academy_info').append('<div class="d-flex flex-between-center mb-1">' +
                                                    '   <div class="align-items-center">' +
                                                        '   <li>입시.검정 및 보습: '+academy_cnt_01+'</li>' +
                                                        '   <li>예능: '+academy_cnt_02+'</li>' +
                                                        '   <li>종합(보습) :'+academy_cnt_03+'</li>' +
                                                        '   <li>외국어 :'+academy_cnt_04+'</li>' +
                                                        '</div>' +
                                                    '</div>');
            // ============= 학원 끝 =============

            // ============= 아소비 시작 =============
            var asobi_center = data.asobi_data['asobi_info_result'];
            var asobi_c_json = JSON.parse(asobi_center);
            var asobi_cnt = asobi_c_json.length;
            for (var i = 0; i < asobi_cnt; i++) {
                asobi_marker = L.marker([asobi_c_json[i]['lat'], asobi_c_json[i]['lon']], {});
                asobi_markers.addLayer(asobi_marker);
                var cu_icon_4 = L.icon({
                    iconUrl: '../static/icons/R/R01_01.png',
                    iconSize: [22, 21],
                    popupAnchor: [0, -10]
                });
                asobi_marker.setIcon(cu_icon_4);
                var popup_4 = L.popup({"maxWidth": "100%"});
                var html_4 = $('<div id="html_i" style="width: 300px; height: 100.0%; align: center;">'
                    + asobi_c_json[i]['addr'] + '</div>')[0];
                popup_4.setContent(html_4);
                asobi_marker.bindPopup(popup_4);
                asobi_marker.bindTooltip('<div>' + asobi_c_json[i]['asobi_nm'] + '</div>', {"sticky": true});
            }
            asobi_cnt = asobi_cnt.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
            $('#amd_info16').empty();
            $('#amd_info16').append('아소비: ' + asobi_cnt + '개');
            // ============= 아소비 끝 =============

            // ============= 경쟁 가맹 시작 =============
            var competition_center = data.competition_data['competition_info_result'];
            // console.log("competition_center", competition_center);
            var competition_json = JSON.parse(competition_center);
            var competition_cnt = competition_json.length;

            for (var i = 0; i < competition_cnt; i++) {
                competition_marker = L.marker([competition_json[i]['lat'], competition_json[i]['lon']], {});
                competition_markers.addLayer(competition_marker);
                var cu_icon_5 = L.icon({
                    iconUrl: '../static/icons/R/competition.png',
                    iconSize: [22, 21],
                    popupAnchor: [0, -10]
                });
                competition_marker.setIcon(cu_icon_5);
                var popup_5 = L.popup({"maxWidth": "100%"});
                var html_5 = $('<div id="html_i" style="width: 300px; height: 100.0%; align: center;">'
                    + competition_json[i]['place_address'] + '(' +competition_json[i]['place_tel']+')</div>')[0];
                popup_5.setContent(html_5);
                competition_marker.bindPopup(popup_5);
                competition_marker.bindTooltip('<div>' + competition_json[i]['place_name'] + '</div>', {"sticky": true});
            }
            competition_result = 0;
            competition_result = competition_cnt;
            competition_result_sum += competition_result;

            competition_cnt = competition_cnt.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");

            $('#amd_info15').empty();
            $('#amd_info15').append('경쟁(시설형): ' + competition_result + '개');
            $('#amd_info17_02').empty();
            $('#amd_info17_02').append('경쟁(시설형): ' + competition_result_sum + '개');
            $('#amd_info19_02').empty();
            $('#amd_info19_02').append('경쟁(시설형): ' + competition_result + '개');

            // ============= 경쟁 가맹 끝 =============

            a_proj();

            // platon_proj(building_cnt_c);
        },
        beforeSend: function () {
            // (이미지 보여주기 처리)
            $('.wrap-loading').removeClass('display-none');
        }, complete: function () {
            // (이미지 감추기 처리)
            $('.wrap-loading').addClass('display-none');
        },
        error: function (request, status, error) {
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    })
};

//  ============ 노피곰 지역 등급 데이터 계산 ================
function a_proj(){
    var kinderel_cnt_result = kinder_cnt_result_sum+el_cnt_result_sum;
    if (sevento12_result_sum >= 120 && kinderel_cnt_result >= 0 && competition_result_sum >= 2){
        $('#amd_info18').empty();
        $('#amd_info18').append('A등급');
    }else if(sevento12_result_sum >= 80 && kinderel_cnt_result == 0 && competition_result_sum >= 1){
        $('#amd_info18').empty();
        $('#amd_info18').append('B등급');
    }else if (sevento12_result_sum < 80 && kinderel_cnt_result == 0 && competition_result_sum == 0){
        $('#amd_info18').empty();
        $('#amd_info18').append('C등급');
    }else{
        $('#amd_info18').empty();
        $('#amd_info18').append('-등급');
    }
}

//  ============ 플라톤 지역 등급 데이터 계산 ================
function platon_proj(building_cnt_c){
    var sedaecnt = building_cnt_c - unit_area_result;
    var elcnt = sevento12_result - el_unit_area_result;
    console.log("sevento12_result: ", sevento12_result)
    console.log("condition1: ", building_cnt_c - unit_area_result);
    console.log("condition2: ", el_cnt_result);
    console.log("condition3: ", sevento12_result - el_unit_area_result);
    console.log("condition4: ", competition_result);

    if (building_cnt_c > unit_area_result && el_cnt_result >= 1 && sevento12_result >= el_unit_area_result && competition_result >= 2){
        $('#amd_info20').empty();
        $('#amd_info20').append('A등급');
    }else if((sedaecnt <= 100 && sedaecnt >= -100) && (el_cnt_result == 0) && (elcnt <= 20 && elcnt >= -20) && (competition_result >= 1)){
        $('#amd_info20').empty();
        $('#amd_info20').append('B등급');
    }else if (building_cnt_c < unit_area_result && el_cnt_result == 0 && sevento12_result <= el_unit_area_result && competition_result <= 1){
        $('#amd_info20').empty();
        $('#amd_info20').append('C등급');
    }else{
        $('#amd_info20').empty();
        $('#amd_info20').append('-등급');
    }
}
// ======== 예측 모델 ====================
function predict(bjdong){
    var postdata = {
        'bjdong':bjdong
    }
    $.ajax({
        type: 'POST',
        url: '/predict/predict_result',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data){
            var predict_result = data.result2['predic_result'];
            var predic_proba = data.result2['predic_proba'];
            predic_proba = predic_proba.toFixed(2);
            var predict_result_cnt_s;
            if (predict_result == 0){
                predict_result_cnt_s = '200~800명';
                predict_result_cnt = 500;
            }else if (predict_result == 1){
                predict_result_cnt_s = '100~200명';
                predict_result_cnt = 150;
            }else if (predict_result == 2){
                predict_result_cnt_s = '90~100명';
                predict_result_cnt = 95;
            }else if (predict_result == 3){
                predict_result_cnt_s = '80~90명';
                predict_result_cnt = 85;
            }else if (predict_result == 4){
                predict_result_cnt_s = '70~80명';
                predict_result_cnt = 75;
            }else if (predict_result == 5){
                predict_result_cnt_s = '60~70명';
                predict_result_cnt = 65;
            }else if (predict_result == 6){
                predict_result_cnt_s = '50~60명';
                predict_result_cnt = 55;
            }else if (predict_result == 7){
                predict_result_cnt_s = '40~50명';
                predict_result_cnt = 45;
            }else if (predict_result == 8){
                predict_result_cnt_s = '30~40명';
                predict_result_cnt = 35;
            }else if (predict_result == 9){
                predict_result_cnt_s = '20~30명';
                predict_result_cnt = 25;
            }else if (predict_result == 10){
                predict_result_cnt_s = '10~20명';
                predict_result_cnt = 15;
            }else if (predict_result == 11){
                predict_result_cnt_s = '1~10명';
                predict_result_cnt = 5;
            }else if (predict_result == 12){
                predict_result_cnt_s = '0명';
                predict_result_cnt = 0;
            }
            $('#amd_info21').empty();
            $('#amd_info21').append("<span class='fas fa-check text-success me-1' data-fa-transform='shrink-2'></span>"+predict_result_cnt_s+"(예측치 "+predic_proba*100+"%)");

            var percent = (real_result_cnt / predict_result_cnt)*100;
            percent = percent.toFixed(2);
            docReady(bandwidthSavedInit(percent));
        },
        beforeSend:function(){
            // (이미지 보여주기 처리)
            $('.wrap-loading4').removeClass('display-none');
        },complete:function(){
            // (이미지 감추기 처리)
            $('.wrap-loading4').addClass('display-none');
        },
        error: function(request, status, error){
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    })
}

// =========== 선택한 지역의 정보 가져오기 ======================
function polygon_get_info(lat, lon, getLatLngs, n1){
    var new_bjdong = "";
    var new_bjdong_nm = "";
    var postdata = {
        'center_y':lat, 'center_x':lon
    }
    $.ajax({
        type: 'POST',
        url: '/map_info/loc_info',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data){
            new_bjdong = data.result2['bjdong_cd'];
            new_bjdong_nm = data.result2['bjdong_nm'];

            all_bjdong_cd = new_bjdong;
            var sido = new_bjdong.substr(0,2);
            document.getElementById('bjdong_nm').value = new_bjdong_nm + " 정보보기";

            poly_R = p_check(new_bjdong);

            if (!poly_R ) {
                bjdong_area(new_bjdong);
                $("#polygon_bjdong_nm").append(new_bjdong_nm + " ");
                polygon_search_history.push(new_bjdong);
                get_polygon_info_nopigom(new_bjdong, new_bjdong_nm, getLatLngs, n1);
                select_set_value(sido, new_bjdong);
            };
        },
        error: function(request, status, error){
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    })
};

function zoom_Image() {
    var imgElement= $('.zoom-image').attr('id');
    var mapElement = document.getElementById("map");

    if (imgElement == 'minusButton') {
        mapElement.style.height = "60%";
        document.getElementById(imgElement).src = "/static/images/plus_zoom.png";
        document.getElementById(imgElement).setAttribute("id", "plusButton");
    } else if (imgElement == 'plusButton')
    {
        mapElement.style.height = "80%";
        document.getElementById(imgElement).src = "/static/images/minus_zoom.png";
        document.getElementById(imgElement).setAttribute("id", "minusButton");
    }
}

// 내 위치 함수

let mylocation;
let loc_count = 0;

function toggleImage() {
    var imgElement= $('.image-toggle').attr('id');

    if (imgElement == 'locateButton') {
        mylocation = setInterval(myloc_start, 2000);
        document.getElementById(imgElement).src = "/static/images/toggle_02.png";
        document.getElementById(imgElement).setAttribute("id", "locateOffButton");

    } else if (imgElement == 'locateOffButton')
    {
        myloc_stop();
        loc_count = 0;
        document.getElementById(imgElement).src = "/static/images/toggle_01.png";
        document.getElementById(imgElement).setAttribute("id", "locateButton");
    }
};

function myloc_start(){
    // map.locate({setView: true, maxZoom: 16});
    map.locate();
    map.removeLayer( myloc_layerGroup );
    myloc_layerGroup = L.featureGroup().addTo(map);
}

function myloc_stop(){
    clearInterval(mylocation);
    map.stopLocate();
    map.removeLayer(myloc_layerGroup);
    myloc_layerGroup = L.featureGroup().addTo(map);
}

// 자바스크립트로 핫존 체크하는 방식으로 적용함
function polygon_inside(point, vs) {
    // ray-casting algorithm based on
    // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html
    var x = Number(Object.values(point)[0]), y = Number(Object.values(point)[1]);
    var inside = false;
    // var odd = false;

    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var vs_i = vs[i][0];
        var vs_j = vs[j][0];

        var xi = Number(Object.values(vs_i)[0]), yi = Number(Object.values(vs_i)[1]);
        var xj = Number(Object.values(vs_j)[0]), yj = Number(Object.values(vs_j)[1]);

        // console.log(xi, x)

        var intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        // console.log(intersect);
        if (intersect) inside = !inside;

        // if ((yi< y && yj>=y ||  yj< y && yi>=y)
        //     && (xi<=x || xj<=x)) {
        //     odd ^= (xi + ( y-yi ) * ( xj-xi )/( yj-yi )) < x;
        // }
        // console.log(odd);
        // if ((pY[i]< y && pY[j]>=y ||  pY[j]< y && pY[i]>=y)
        //     && (pX[i]<=x || pX[j]<=x)) {
        //     odd ^= (pX[i] + (y-pY[i])*(pX[j]-pX[i])/(pY[j]-pY[i])) < x;
        // }
    }
    if (loc_count === 0) {
        if (inside === true) {
            alert("핫존!");
            loc_count += 1;
        }
    }
    return inside;
};

// 서버에서 핫존 여부 체크하는 방식: 서버 부하가 많아서 브라우저에서 체크하는 방식으로 변경함
function hotzone_polygon_info(user_loc) {
    var bjdong = $('#bjdong2').val();
    var postdata = {
        'session_id': session_id,
        'bjdong': bjdong,
        'user_loc': user_loc,
        'hot_zone': hot_zone
    }
    $.ajax({
        type: 'POST',
        url: '/map_info/hotzone_polygon_front',
        data: JSON.stringify(postdata),
        dataType: 'JSON',
        contentType: "application/json",
        success: function (data) {
            var loc_result = data.result2['loc_result'];
            if (loc_count === 0){
                if (loc_result === true) {
                    alert("내 핫존에 왔다!");
                    loc_count += 1;
                }
            }
        },
        error: function (request, status, error) {
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    })
};


// 마우스 클릭 시 법정동의 교육 정보 가지고 오기

// map.on("mouseup", function(e){
//     center = map.getCenter();
//     center_y = center.lat;
//     center_x = center.lng;
//     // console.log(center_x, center_y)
//     var postdata = {
//         'center_y':center_y, 'center_x':center_x
//     }
//     $.ajax({
//         type: 'POST',
//         url: '/map_info/loc_info',
//         data: JSON.stringify(postdata),
//         dataType : 'JSON',
//         contentType: "application/json",
//         success: function(data){
//             sido_cd = data.result2['sido_cd'];
//             var new_bjdong = data.result2['bjdong_cd'];
//             var new_bjdong_nm = data.result2['bjdong_nm'];
//
//             all_bjdong_cd = new_bjdong;
//             // document.getElementById('loc_info_nm').innerText = new_bjdong_nm + " 정보보기";
//             document.getElementById('bjdong_nm').value = new_bjdong_nm;
//             b_check(new_bjdong);
//             if (sh_R == false) {
//                 bjdong_area(data.result2['bjdong_cd']);
//                 kinder_toggle(data.result2['bjdong_cd']);
//                 el_toggle(data.result2['bjdong_cd']);
//                 mi_toggle(data.result2['bjdong_cd']);
//                 hi_toggle(data.result2['bjdong_cd']);
//                 // ed_toggle(data.result2['bjdong_cd']);
//                 academy_toggle(data.result2['bjdong_cd']);
//                 shop_toggle(data.result2['bjdong_cd']);
//                 compete_toggle(data.result2['bjdong_cd']);
//                 platon_toggle(data.result2['bjdong_cd']);
//                 platon_custom_toggle(data.result2['bjdong_cd']);
//                 singi_custom_toggle(data.result2['bjdong_cd']);
//                 platon_stop_custom_toggle(data.result2['bjdong_cd']);
//                 singi_stop_custom_toggle(data.result2['bjdong_cd']);
//                 asobi_toggle(data.result2['bjdong_cd']);
//                 building_toggle(data.result2['bjdong_cd']);
//                 pup_cnt(data.result2['bjdong_cd']);
//                 hansol_member(data.result2['bjdong_cd']);
//                 // predict(data.result2['bjdong_cd']);
//
//                 $('#amd_info18').empty();
//                 $('#amd_info18').append('-등급');
//             }
//             select_set_value(sido_cd, data.result2['bjdong_cd']);
//             // academy_best_info(data.result2['bjdong_cd'], new_bjdong_nm);
//         },
//         error: function(request, status, error){
//             alert('데이터를 가지고 오는데 실패했습니다.')
//             alert(error);
//         }
//     })
// });

// map.on("click", function(e){
//     shop_info(e.latlng.lat, e.latlng.lng);
//     var circle = L.circle(
//         [e.latlng.lat, e.latlng.lng],
//         {"bubblingMouseEvents": true, "color": "skyblue",
//             "dashArray": null, "dashOffset": null,
//             "fill": true, "fillColor": "skyblue",
//             "fillOpacity": 0.2, "fillRule": "evenodd",
//             "lineCap": "round", "lineJoin": "round",
//             "opacity": 1.0, "radius": 500,
//             "stroke": true, "weight": 3}
//     ).addTo(circle_group2).bindTooltip('반경 500M').openPopup();
//
//     // var marker_j = new L.Marker([e.latlng.lat, e.latlng.lng]).addTo(layerGroup);
//     // var icon_j = L.AwesomeMarkers.icon({
//     //     "prefix": "fa",
//     //     "extraClasses": "fa-rotate-0",
//     //     "icon": "home",
//     //     "iconColor": "white",
//     //     "markerColor": "darkred"
//     // });
//     // marker_j.setIcon(icon_j);
//     //
//     // var popup_j = L.popup({"maxWidth": "100%"});
//     // var html_j = $('<div id="html_i" style="width: 100px; height: 100.0%; align: center;">가맹</div>')[0];
//     // popup_j.setContent(html_j);
//     // marker_j.bindPopup(popup_j);
//     // marker_j.bindTooltip('<div>반경 250미터</div>', {"sticky": true});
//     var circle_j = L.circle(
//         [e.latlng.lat, e.latlng.lng],
//         {"bubblingMouseEvents": true, "color": "skyblue",
//             "dashArray": null, "dashOffset": null,
//             "fill": true, "fillColor": "orange",
//             "fillOpacity": 0.2, "fillRule": "evenodd",
//             "lineCap": "round", "lineJoin": "round",
//             "opacity": 1.0, "radius": 250,
//             "stroke": true, "weight": 3}
//     ).addTo(circle_group1).bindTooltip('반경 250M').openPopup();
//
//
// })



// 내 위치 가져오기를 구현해보자
// map.on('locationfound', function(e) {
//             var radius = e.accuracy / 2;
//             var locationMarker = L.marker(e.latlng).addTo(map)
//                 .bindPopup('당신의 반경 ' + radius.toFixed(0.5) + '미터 안에 계시겠군요.').openPopup();
//             var locationCircle = L.circle(e.latlng, radius).addTo(map);
//         });
//  map.on('locationerror', function(e) {console.log(e.message)});
//  map.locate({setView: true, maxZoom: 16});

 // move 버튼 클릭 시 특정 위치로 이동을 구현해보자
 // $('#move').click(function(){
 //            map.locate({setView: true, maxZoom: 16});
 //        })
//
// map.on('locationfound', onLocationFound); // 현재 위치 검색이 성공하면 onLocationFound() 함수를 호출합니다.
// map.on('locationerror', onLocationError); // 현재 위치 검색이 실패하면 onLocationError() 함수를 호출합니다.
// map.locate({setView: true, maxZoom: 16}); // 현재 위치를 검색합니다.
//

// function onLocationFound(e) {
//     var radius = e.accuracy / 6;
//
//     // L.marker(e.latlng).addTo(myloc_layerGroup)
//     // .bindPopup("약 " + radius.toFixed(1) + " 미터 이내").openPopup();
//
//     L.marker(e.latlng).addTo(myloc_layerGroup);
//     // L.circle(e.latlng, radius, {}).add(myloc_layerGroup);
//     L.circle(e.latlng, radius, {"bubblingMouseEvents": true, "color": "skyblue",
//         "dashArray": null, "dashOffset": null,
//         "fill": true, "fillColor": "skyblue",
//         "fillOpacity": 0.2, "fillRule": "evenodd",
//         "lineCap": "round", "lineJoin": "round",
//         "opacity": 1.0, "radius": 500,
//         "stroke": true, "weight": 3}).addTo(myloc_layerGroup);
//     // console.log(e.latlng);
//     // hotzone_polygon_info(e.latlng);
//     map.setView(e.latlng, 17);
//     polygon_inside(e.latlng, hot_zone);
//     // polygon_test(point, polygon);
// }



// map.on('locationfound', onLocationFound);
//
// function onLocationError(e) {
//     alert(e.message);
// }
//
// map.on('locationerror', onLocationError);




// function onLocation() {
//     user_loc = 'N'
//     $.ajax({
//         type: 'POST',
//         url: '/member_info/user_loc',
//         contentType: "application/json",
//         success: function(data){
//             select_bjdong = data.select_bjdong;
//             user_loc_lat = data.loc_lat;
//             user_loc_lon = data.loc_lon;
//             sido_cd= data.sido_cd;
//             bjdong_nm = data.emd;
//             bjdong_cd = data.bjdong_cd;
//             console.log(user_loc_lat, user_loc_lon, sido_cd);
//             if (user_loc_lat == '' || user_loc_lat == null){
//                 member_layer_call('#info_open_div');
//             }else{
//                 $('#loc_info_nm').append("지역: "+bjdong_nm);
//                 if (select_bjdong == '1'){
//                     $('#loc_info_nm').append(" (집)");
//                 }else if (select_bjdong == '2'){
//                     $('#loc_info_nm').append(" (회사)");
//                 }else if (select_bjdong == '3'){
//                     $('#loc_info_nm').append(" (기타)");
//                 }
//                 document.getElementById('bjdong_nm').value = bjdong_nm;
//                 all_bjdong_cd = bjdong_cd;
//                 // document.getElementById('loc_info_nm').innerText = new_bjdong_nm + " 정보보기";
//                 b_check(bjdong_cd);
//                 map.setView([user_loc_lat, user_loc_lon], 16, {zoomControl: false});
//                 bjdong_area(bjdong_cd);
//
//                 pup_cnt(bjdong_cd);
//
//                 kinder_toggle(bjdong_cd);
//                 el_toggle(bjdong_cd);
//                 mi_toggle(bjdong_cd);
//                 hi_toggle(bjdong_cd);
//
//                 academy_toggle(bjdong_cd);
//                 shop_toggle(bjdong_cd);
//                 building_toggle(bjdong_cd);
//                 compete_toggle(bjdong_cd);
//
//                 platon_toggle(bjdong_cd);
//                 platon_custom_toggle(bjdong_cd);
//                 singi_custom_toggle(bjdong_cd);
//                 platon_stop_custom_toggle(bjdong_cd);
//                 singi_stop_custom_toggle(bjdong_cd);
//                 asobi_toggle(bjdong_cd);
//
//                 hansol_member(bjdong_cd);
//                 // predict(bjdong_cd);
//
//                 $('#amd_info18').empty();
//                 $('#amd_info18').append('-등급');
//
//             }
//         },
//         error: function(request, status, error){
//             alert('데이터를 가지고 오는데 실패했습니다.')
//             alert(error);
//         }
//     })
// }


$('#location_01').click(function(){
    if (session_id == "" || session_id == null){
        alert('로그인이 필요합니다.');
        location.href = "/login";
    }else{
        bjdong_reg_info('1');
    }
});

$('#location_02').click(function(){
    if (session_id == "" || session_id == null){
        alert('로그인이 필요합니다.');
        location.href = "/login";
    }else{
        bjdong_reg_info('2');
    }
});

$('#location_03').click(function(){
    if (session_id == "" || session_id == null){
        alert('로그인이 필요합니다.');
        location.href = "/login";
    }else{
        bjdong_reg_info('3');
    }
});

function bjdong_reg_info(type){
    if (user_loc == 'N'){
        var sido = $('#sido option:selected').val();
        var sigungun = $('#sigugun option:selected').val();
        var bjdong = $('#dong option:selected').val();
        if (sido == "" || sigungun == "" || bjdong == "") {
            alert('행정구역을 선택하세요.');}
        else{
            bjdong_cd = sigungun + bjdong;
            var postdata = {
                'type': type, 'bjdong_cd': bjdong_cd, 'user_loc': user_loc
            }
            $.ajax({
                type: 'POST',
                url: '/member_info/member_info_update',
                data: JSON.stringify(postdata),
                dataType : 'JSON',
                contentType: "application/json",
                success: function(data){
                    alert("관심지역이 등록되었습니다.");
                    location.reload();
                },
                error: function(request, status, error){
                    alert('데이터를 가지고 오는데 실패했습니다.')
                    alert(error);
                }
            })
        }
    }else{
        var postdata = {
            'type': type, 'bjdong_cd': bjdong_cd, 'user_loc': user_loc
        }
        $.ajax({
            type: 'POST',
            url: '/member_info/member_info_update',
            data: JSON.stringify(postdata),
            dataType : 'JSON',
            contentType: "application/json",
            success: function(data){
                alert("관심지역이 등록되었습니다.");
                $layerPopup.style.display = 'none';
            },
            error: function(request, status, error){
                alert('데이터를 가지고 오는데 실패했습니다.')
                alert(error);
            }
        })
    }
};

function myhouse(lat, lon) {
    // var marker_j = new L.Marker([lat, lon]).addTo(myhouse_layerGroup);
    // var icon_j = L.AwesomeMarkers.icon({
    //     "prefix": "fa",
    //     "extraClasses": "fa-rotate-0",
    //     "icon": "home",
    //     "iconColor": "white",
    //     "markerColor": "darkred"
    // });
    // marker_j.setIcon(icon_j);

    // var popup_j = L.popup({"maxWidth": "100%"});
    // var html_j = $('<div id="html_i" style="width: 100px; height: 100.0%; align: center;">우리집 반경 250M</div>')[0];
    // popup_j.setContent(html_j);
    // marker_j.bindPopup(popup_j);
    // marker_j.bindTooltip('<div>반경 250미터</div>', {"sticky": true});
    var circle_j = L.circle(
        [lat, lon],
        {
            "bubblingMouseEvents": true, "color": "skyblue",
            "dashArray": null, "dashOffset": null,
            "fill": true, "fillColor": "orange",
            "fillOpacity": 0.2, "fillRule": "evenodd",
            "lineCap": "round", "lineJoin": "round",
            "opacity": 1.0, "radius": 250,
            "stroke": true, "weight": 3
        }
    ).addTo(circle_group1).bindTooltip('250M 이내 정보').openPopup();
    console.log(circle_j);
};

/***
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
        "height": 100,
        "minimized": false,
        "position": "bottomright",
        "toggleDisplay": false,
        "width": 150,
        "zoomAnimation": false,
        "zoomLevelOffset": -5}
);

map.addControl(mini_map);
***/

$('#popup_call').click(function(e) {
    var divTop = e.clientY - 40; //상단 좌표 위치 안맞을시 e.pageY
    var divLeft = e.clientX; //좌측 좌표 위치 안맞을시 e.pageX
    var serial = $(this).attr("serial");
    var idx = $(this).attr("idx");
    $('#info_open_div').empty().append('<div style="position:absolute;top:5px;right:5px"><span id="close" style="cursor:pointer;font-size:1.5em" title="닫기">X</span> </div><br><a href="?serial=' + serial + '">serial</a><BR><a href="?idx=' + idx + '">idx</a>');
    $('#info_open_div').css({
        "z-index": '1002',
        "top": divTop,
        "left": divLeft,
        "position": "absolute"
    }).show();
    // $('#close').click(function(){document.getElementById('divView').style.display='none'});
});

// 오른쪽 마우스 클릭 시
map.on("contextmenu", function(e){
    map.removeLayer(kinder_layerGroup);
    map.removeLayer(el_layerGroup);
    map.removeLayer(edu_markers);
    map.removeLayer(building_markers);
    map.removeLayer(asobi_markers);
    map.removeLayer(competition_markers);
    map.removeLayer(choropleth_b);
    map.removeLayer(drawnItems);

    choropleth_b = new L.featureGroup().addTo(map);
    kinder_layerGroup = new L.layerGroup().addTo(map);
    el_layerGroup = new L.layerGroup().addTo(map);
    edu_markers = new L.MarkerClusterGroup().addTo(map);
    building_markers = new L.MarkerClusterGroup().addTo(map);
    asobi_markers = new L.MarkerClusterGroup().addTo(map);
    competition_markers = new L.MarkerClusterGroup().addTo(map);
    drawnItems = new L.FeatureGroup().addTo(map);

    $('#school_info').empty();
    $('#building_business_info').empty();
    $('#academy_info_nopigon').empty();
    $('#amd_info17').text('4~9세 (추정)');
    $('#amd_info19_03').text('초등 (추정)');
    $('#amd_info17_01').text('유.초 학교');
    $('#amd_info17_02').text('경쟁(시설형)');
    $('#amd_info18').text('-등급');
    $('#polygon_bjdong_nm').text('');

});

function map_reset(){
    map.removeLayer(kinder_layerGroup);
    map.removeLayer(el_layerGroup);
    map.removeLayer(edu_markers);
    map.removeLayer(building_markers);
    map.removeLayer(asobi_markers);
    map.removeLayer(competition_markers);
    map.removeLayer(choropleth_b);
    map.removeLayer(drawnItems);

    choropleth_b = new L.featureGroup().addTo(map);
    kinder_layerGroup = new L.layerGroup().addTo(map);
    el_layerGroup = new L.layerGroup().addTo(map);
    edu_markers = new L.MarkerClusterGroup().addTo(map);
    building_markers = new L.MarkerClusterGroup().addTo(map);
    asobi_markers = new L.MarkerClusterGroup().addTo(map);
    competition_markers = new L.MarkerClusterGroup().addTo(map);
    drawnItems = new L.FeatureGroup().addTo(map);

    $('#school_info').empty();
    $('#building_business_info').empty();
    $('#academy_info_nopigon').empty();
    $('#amd_info17').text('4~9세 (추정)');
    $('#amd_info19_03').text('초등 (추정)');
    $('#amd_info17_01').text('유.초 학교');
    $('#amd_info17_02').text('경쟁(시설형)');
    $('#amd_info18').text('-등급');
    $('#polygon_bjdong_nm').text('');
}

var layer_control = {
    base_layers : {
        "openstreetmap" : tile_layer
    },
    overlays :  {
        "법정동 경계" : choropleth_b,
        "유아(유치원)" : kinder_layerGroup,
        "초등학교" : el_layerGroup,
        "학원" : edu_markers,
        "아소비 공부방": asobi_markers,
        "경쟁시설 가맹": competition_markers
    },
};

var drawnItems = L.featureGroup()

var layerControl= L.control.layers(
    layer_control.base_layers,
    layer_control.overlays,
    {"autoZIndex": true, "collapsed": true, "position": "topright"},
    {"drawlayer": drawnItems }
).addTo(map);

var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

var customIcon = L.icon({
    iconUrl: '/static/images/pin.png',
    // iconSize: [100, 0], // 아이콘 크기 조절
    iconAnchor: [9, 20], // 아이콘 앵커 조절
    // popupAnchor: [-3, -76] // 팝업 앵커 조절
});

var drawControl = new L.Control.Draw({
    // edit: {
    //     featureGroup: drawnItems,
    //     poly: {
    //         allowIntersection: false
    //     }
    // },
    draw: {
        polygon: {
            allowIntersection: false,
            showArea: true,
            icon: customIcon
        },
        circle: false, // 원 그리기 기능 사용 여부
        circlemarker: false,
        marker: false, // 마커 그리기 기능 사용 여부
        polyline: {
            icon: customIcon
        }, // 선 그리기 기능 사용 여부
        rectangle: false, // 사각형 그리기 기능 사용 여부
    }
});

map.addControl(drawControl);
drawControl.setPosition('topright');

map.on(L.Draw.Event.CREATED, function (event) {
    var layer = event.layer,
        type = event.layerType;

    // console.log(type);
    // if (type === 'circle') {
    //     console.log(layer.getLatLng());
    //     console.log(layer.getRadius());
    // }

    // if (type === 'rectangle') {
    //     // console.log(layer.getLatLng());
    //     // console.log(layer.getRadius());
    //     var latlngs = layer.getLatLngs();
    //     console.log("Coordinates:", latlngs);
    //     var bounds = layer.getBounds();
    //     var coords = bounds.toBBoxString().split;
    //
    //     console.log(bounds);
    //     console.log(coords);
    // }

    if(type === 'marker'){
        var getLatLngs = layer.getLatLng();
        var lat = getLatLngs.lat;
        var lon = getLatLngs.lng;
        map.setView([lat, lon], 16, {zoomControl: false});
        myhouse(lat, lon);
    };

    if (type === 'rectangle') {
        var getLatLngs = layer.getLatLngs();
        var draw_start= getLatLngs[0][0];
        var lat = draw_start.lat;
        var lon = draw_start.lng;
        map.setView([lat, lon], 16, {zoomControl: false});
        polygon_get_info(lat, lon, getLatLngs);
    }drawnItems.addLayer(layer);

    if (type === 'polygon') {
        var getLatLngs = layer.getLatLngs();
        var latlngs_cnt = getLatLngs[0].length;
        var draw_start= getLatLngs[0][0];
        var lat = draw_start.lat;
        var lon = draw_start.lng;
        map.setView([lat, lon], 16, {zoomControl: false});

        var area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
        var n1 = area.toFixed();
        var cn1 = n1.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        // console.log(n1, '면적:', cn1, '제곱미터');
        var pyong = Math.ceil(n1 * 0.3025);
        var pyong1 = pyong.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        layer.bindTooltip("<span> 약 "+cn1+" m<sup>2</sup> (약 "+pyong1+" 평)</span>");

        let polygon_bjdong_nm = document.getElementById('polygon_bjdong_nm');
        while(polygon_bjdong_nm.hasChildNodes()){ //자식 요소가 있는지 확인-false가 될때까지 반복
            polygon_bjdong_nm.removeChild(polygon_bjdong_nm.firstChild); // 첫번째 자식 요소를 삭제
        }

        poly_R = false;
        // academy_cnt = 0;
        polygon_search_history = [];
        for( var i=0; i< latlngs_cnt; i++){
            var draw_start= getLatLngs[0][i];
            var lat2 = draw_start.lat;
            var lon2 = draw_start.lng;
            polygon_get_info(lat2, lon2, getLatLngs, n1);
        }
        // get_polygon_info2(getLatLngs, n1);

    }drawnItems.addLayer(layer);
});
