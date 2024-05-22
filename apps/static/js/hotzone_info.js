var map;
var tile_layer;
var geo_add_b;
var geo_add_h;
var user_loc_lat;
var user_loc_lon;
var bjdong_cd;
var sido_cd;
var lat;
var lon;

var choropleth_b = L.featureGroup().addTo(map);
var choropleth_h = L.featureGroup().addTo(map);
var circle_group1 = L.featureGroup().addTo(map);
var circle_group2 = L.featureGroup().addTo(map);

var kinder_layerGroup = L.layerGroup().addTo(map);
var el_layerGroup = L.layerGroup().addTo(map);
var mi_layerGroup = L.layerGroup().addTo(map);
var hi_layerGroup = L.layerGroup().addTo(map);

var myloc_layerGroup = L.featureGroup().addTo(map);
// var myhouse_layerGroup = L.featureGroup().addTo(map);
var hotzone_layerGroup = L.featureGroup().addTo(map);
var hotzone_polygon_layerGroup = L.featureGroup().addTo(map);

var near_layerGroup = new L.MarkerClusterGroup().addTo(map);
var shop_markers = new L.MarkerClusterGroup().addTo(map);
var edu_markers = new L.MarkerClusterGroup().addTo(map);
// var building_markers = new L.MarkerClusterGroup().addTo(map);
// var platon_markers = new L.MarkerClusterGroup().addTo(map);
// var platon_member_markers = new L.MarkerClusterGroup().addTo(map);
// var singi_member_markers = new L.MarkerClusterGroup().addTo(map);
// var platon_stop_member_markers = new L.MarkerClusterGroup().addTo(map);
// var singi_stop_member_markers = new L.MarkerClusterGroup().addTo(map);
// var asobi_markers = new L.MarkerClusterGroup().addTo(map);

// var mcgLayerSupportGroup = L.markerClusterGroup.layerSupport(),
//     group1 = L.layerGroup(),
//     group2 = L.layerGroup(),
//     group3 = L.layerGroup(),
//     group4 = L.layerGroup(),
//     control = L.control.layers(null, null, { collapsed: false }),
//     i, a, title, marker;
//
// mcgLayerSupportGroup.addTo(map);
var search_history = new Array();
var hot_zone = new Array();
var sh_R;

var all_bjdong_cd;
var sido_cd;
var category_01;
var category_02;
var category_03;

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
    // console.log(search_history);
    sh_R = search_history.includes(new_bjdong_cd);
    return sh_R
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

$('#search_bnt').click(function(){
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
                    document.getElementById('loc_info_nm').innerText = dong_nm + " 정보보기";
                    // map 이동
                    map.setView([data.result2['lat'], data.result2['lon']], 15, {zoomControl: false});
                    // layer_clear();
                    geo_add_b = JSON.parse(data.result2['coordi_geojson']);
                    geo_json_add(geo_add_b);
                    // heang_area(sigugun+dong)

                    var new_bjdong = sigugun+dong;
                    b_check(new_bjdong);
                    kinder_toggle(sigugun+dong);
                    el_toggle(sigugun+dong);
                    mi_toggle(sigugun+dong);
                    hi_toggle(sigugun+dong);
                    // ed_toggle(sigugun+dong);
                    academy_toggle(sigugun+dong, school_type, subject_type, search)
                    shop_toggle(sigugun+dong);
                    // platon_toggle(sigugun+dong);
                    // platon_custom_toggle(sigugun+dong);
                    // singi_custom_toggle(sigugun+dong);
                    // platon_stop_custom_toggle(sigugun+dong);
                    // singi_stop_custom_toggle(sigugun+dong);
                    // asobi_toggle(sigugun+dong);
                    // building_toggle(sigugun+dong);
                    // pup_cnt(sigugun+dong)
                    academy_best_info(sigugun+dong, dong_nm);
                    select_set_value(sido_cd, all_bjdong_cd)
                }
        },
        error: function(request, status, error){
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    })
}
});

$('#search_btn').click(function(){
    document.getElementById('category_001').value = '';
    document.getElementById('index_search_type').value = '';
    setting_save();
    $("#hotzone-data-container").empty();
    myloc_stop();
    myloc_start();
    // map.on('locationfound', onLocationFound);
});

function search_result(bjdong_cd){
    bjdong_area(bjdong_cd);
    b_check(bjdong_cd);
    if (session_id){
        setting_load();
    }
    // academy_hotzone_toggle(bjdong_cd);
    // king_zone_toggle(bjdong_cd);
};

function setting_save(){
    var category_01 = $('#indsLclsCd option:selected').val();
    var category_02 = $('#indsMclsCd option:selected').val();
    var category_03 = $('#indsSclsCd option:selected').val();
    var radius = $('#radius option:selected').val();
    if (category_01 == "0"){
        category_02 = "0"
        category_03 = "0"
    }
    var postdata = {
       'category_01': category_01, 'category_02': category_02, 'category_03': category_03, 'radius': radius
    }
    $.ajax({
        type: 'POST',
        url: '/member_activity/hotzone_setting',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data){
            alert('검색 설정을 저장하였습니다.');
        },
        error: function(request, status, error){
        alert('설정 저장에 실패했습니다. 다시 한번 저장해주세요.');
        alert(error);
    }
})
};

function setting_load(){
    var postdata = {
    }
    $.ajax({
        type: 'POST',
        url: '/member_activity/hotzone_load',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data){
            var category_01 = data.result2['category_01']
            var category_02 = data.result2['category_02']
            var category_03 = data.result2['category_03']
            var radius = data.result2['radius']

            // console.log("setting_load: ",category_01, category_02, category_03, radius)
            if (category_01 == 0) {
                $('#indsLclsCd').val("0").prop("selected",true);
                $('#indsMclsCd').val("0").prop("selected",true);
                $('#indsSclsCd').val("0").prop("selected",true);
            }else{
                shop_select_set_value(category_01, category_02, category_03);
            }
            $("#radius").val(radius).prop("selected", true);
        },
        error: function(request, status, error){
            alert('설정 저장에 실패했습니다. 다시 한번 저장해주세요.');
            alert(error);
        }
    })
};

function near_shop_academy_list(bjdong_cd, lat, lon){
    var category_01 = $('#indsLclsCd option:selected').val();
    var category_02 = $('#indsMclsCd option:selected').val();
    var category_03 = $('#indsSclsCd option:selected').val();
    var radius = $('#radius option:selected').val();
    var index_search_type = $('#index_search_type').val();
    var category_001 = $('#category_001').val();
    var category_002 = $('#category_002').val();
    var category_003 = $('#category_003').val();
    if (category_01 == "0"){
        category_02 = "0"
    }else if(category_02 = "0"){
        category_03 = "0"
    }
    // console.log(category_01, category_02, category_03, radius);
    var postdata = {
        'lat':lat, 'lon':lon, 'bjdong_cd':bjdong_cd, 'category_01': category_01, 'category_02': category_02, 'category_03': category_03, 'radius': radius,
        'index_search_type': index_search_type, 'category_001': category_001, 'category_002': category_002, 'category_003': category_003
    }
    $.ajax({
        type: 'POST',
        url: '/member_activity/all_hotzone_ajax',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data){
            var near_shop = data.near_data['near_shop_academy_list'];
            var near_shop_json = JSON.parse(near_shop);
            var near_cnt = near_shop_json.length;

            map.removeLayer( near_layerGroup );
            near_layerGroup= new L.MarkerClusterGroup().addTo(map);

            let today = new Date();
            let year = today.getFullYear(); // 년도
            let month = today.getMonth() + 1;  // 월
            let date = today.getDate();  // 날짜
            let visit_today = year + '-' + month + '-' + date;
            let length = 8; // 표시할 글자수 기준
            if (near_cnt >= 20){
                near_cnt = 20;
            }
            if (near_cnt > 0){

                    // document.getElementById('visit_today').innerText = visit_today;
                    for (var i = 0; i < near_cnt; i++) {
                        var zone_idx = near_shop_json[i]['idx'];
                        var academy_nm = "academy_nm_"+i;
                        var distance = "distance_"+i;
                        var zone_nm = near_shop_json[i]['zone_nm'];
                        var lat = near_shop_json[i]['lat'];
                        var lon = near_shop_json[i]['lon'];
                        var category_nm_01 = near_shop_json[i]['category_nm_01'];
                        var category_nm_02 = near_shop_json[i]['category_nm_02'];

                        if (zone_nm.length > length) {
                            var zone_nm = zone_nm.substr(0, length - 1) + '...';
                        }

                        var distance = near_shop_json[i]['distance']+"미터";
                        var cate1 = "'"+near_shop_json[i]['gubun']+"'";
                        var cate2 = "'"+near_shop_json[i]['category_cd']+"'";

                        // console.log(cate1, cate2)
                        var marker_i = L.marker([near_shop_json[i]['lat'], near_shop_json[i]['lon']], {});
                        near_layerGroup.addLayer(marker_i);

                        // console.log("cate1: ", cate1)
                        if (near_shop_json[i]['gubun'] == "02"){
                            var icon = "../static/icons/shop/"+near_shop_json[i]['category_cd']+".png"
                        }else if (near_shop_json[i]['gubun'] == "01"){
                            var icon = "../static/icons/academy/00.png"
                        }

                        var cu_icon = L.icon({
                            iconUrl: icon,
                            iconSize:     [22, 34],
                            popupAnchor:  [0, -10]
                        });
                        // console.log(icon);
                        marker_i.setIcon(cu_icon);
                        marker_i.bindTooltip('<div><a href="#" onclick="zone_info('+zone_idx+','+cate1+', all_bjdong_cd)">'+zone_nm+' / '+distance+'</a></div>', {"sticky": true});

                        var html_list = '<tr id="zone_timeline_'+i+'" class="border-top border-gray">' +
                                        // '  <td class="align-middle border-0"><img src='+icon+'></td>' +
                                        // '  <td class="align-middle border-0">'+zone_nm+' ('+distance+')</td>' +
                                        '  <td class="align-middle border-0" style="width: 62%;">' +
                                        '       <a href="#" onclick="zone_info('+zone_idx+','+cate1+', all_bjdong_cd)"><b>'+zone_nm+'</b>('+distance+')<br>'+category_nm_01+', '+category_nm_02+'</a>'+
                                        // '       <img src="/static/images/shop_delete.png"  onclick="visit_cancle('+i+')" id="delete_btn_'+i+'" width="40" style="float:right; margin-bottom: 5px;">' +
                                        '  </td>' +
                                        '  <td class="border-0" style="width: 38%;">' +
                                        '       <div style="display: flex">' +
                                        '           <div style="margin: auto; text-align: center;"><img src="/static/images/check_in.png" onclick="zone_timeline_visit('+zone_idx+',\''+zone_nm+'\','+cate1+','+cate2+', all_bjdong_cd)" id="visit_btn_'+i+'" width="38"><br>방문</div>' +
                                        '           <div style="margin: auto; text-align: center;"><img src="/static/images/check_loc.png" onclick="shop_loc('+lat+','+lon+','+cate1+','+cate2+',\''+zone_nm+'\',\''+distance+'\')" id="visit_btn_'+i+'" width="38"><br>위치</div>' +
                                        '       </div>' +
                                        '  </td>' +
                                        '</tr>' +
                                        '<tr class="border-0">' +
                                        '  <td class="border-0" colspan="2">' +
                                        '       <div style="overflow: auto; white-space: nowrap; margin-bottom: 5px; margin:0 auto; display: flex;" id="friends_pic_'+i+'"></div>' +
                                        '  </td>' +
                                        '</tr>'+
                        $("#hotzone-data-container").append(html_list);

                        zone_friends(i, zone_idx, cate1);
                        // document.getElementById(academy_nm).innerHTML = near_shop_json[i]['academy_nm'];
                        // document.getElementById(distance).innerHTML = near_shop_json[i]['distance']+"미터";
                }
            // 핫존을 잠시 접어 둔다. ㅠ,.ㅜ;;;;;;
            // king_zone_toggle(bjdong_cd);
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
    })
};

function zone_friends(i, zone_idx, cate1){
    if (session_id){
        var postdata2 = {
            'zone_idx': zone_idx, 'gubun_01': cate1
        }
        $.ajax({
            type: 'POST',
            url: '/member_activity/hotzone_load_friends',
            data: JSON.stringify(postdata2),
            dataType : 'JSON',
            contentType: "application/json",
            success: function(data) {
                var cnt = data.result2['id_counter'];
                if (cnt != 0){
                    for (var j = 0; j < cnt; j++) {
                        var pic_css_id = "#friends_pic_"+i
                        var friends_pic = "'"+data.result2['friends_picture_'+j]+"'"
                        var html2 = '<img style="border-radius: 100%; width: 45px; height: 45px; margin-left: 2px;" src='+friends_pic+' onclick="javascript:alert(\'다녀간 친구들, 프로필로 이동\')">'
                        console.log(html2)
                        $(pic_css_id).append(html2);
                    }
                }
            },
            error: function(xhr) {
                console.log('Error occurred while fetching data.');
            }
        });
    }
}


function shop_loc(lat, lon, cat1, cat2, zone_nm, distance) {
    var targetDiv = document.getElementById('map');
    targetDiv.scrollIntoView();

    var marker_i = L.marker([lat, lon], {});
    near_layerGroup.addLayer(marker_i);
    if (cat1 == "02"){
        var icon = "../static/icons/shop/"+cat2+".png"
    }else if (cat1 == "01"){
        var icon = "../static/icons/academy/00.png"
    }
    var cu_icon = L.icon({
        iconUrl: icon,
        iconSize:     [22, 34],
        popupAnchor:  [0, -10]
    });
    marker_i.setIcon(cu_icon);
    marker_i.bindTooltip('<div>'+zone_nm+' / '+distance+'</div>', {"sticky": true});
    map.setView([lat, lon], 18, {zoomControl: false});
}

var current_page = 0;

$('#timeline-load').click(function() {
    var page = current_page + 1;
    zonetime_line_list(page, all_bjdong_cd);
});

function zone_info(zone_idx, gubun_01, bjdong_cd){
    location.href="/zone_sns/zone_sns_user_post?zone_id="+zone_idx+"&gubun_01="+gubun_01+"&bjdong_cd="+bjdong_cd+""
}

function zonetime_line_list(page, bjdong_cd){
    $.ajax({
        url: '/member_activity/zone_timeline',
        type: 'GET',
        data: {page: page, bjdong_cd: bjdong_cd},
        success: function(response){
            current_page = response.page;
            $('#hotzone-past-data-container').append(response.data);
            if (response.post_cnt < 10) {
                $("#timeline-load-div").empty();
                $("#timeline-load-div").append("" +
                    "   <div align='center'>" +
                    "      <h5 class='card-title fs-4 text-uppercase m-0'>더 이상 타임라인이 없습니다.</h5>" +
                    "   </div>");
            }
            document.getElementById('past_visit_info').innerText = '과거에 방문했던 장소들입니다.'
        },
        error: function(request, status, error) {
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    })
};

function visit_cancle(number){
    var cancle_t = "#zone_timeline_"+number
    $(cancle_t).empty();
};
// zone_idx+','+cate1+','+cate2+','+zone_nm+', all_bjdong_cd
function zone_timeline_visit(zone_idx, zone_nm, gubun_01, gubun_02, bjdong_cd ){
    // gubun = gubun.toString();
    // gubun = "0"+gubun;
    if(session_id){
        if (confirm("존에 방문하셨나요?") == true){    //확인
            location.href="/zone_sns/zone_sns_info?zone_id="+zone_idx+"&zone_nm="+zone_nm+"&gubun_01="+gubun_01+"&gubun_02="+gubun_02+"&bjdong_cd="+bjdong_cd
        }else{   //취소
            return false;
        }
    }else{
        alert("로그인이 필요합니다.");
        location.href="/login";
    }
};


function first_hotzone_toggle(bjdong_cd){
    var marker_i;
    var cu_icon;
    var c;
    var popup_i;
    var html_i;
    var popup_j;
    var html_j;
    var bjdong2 = $('#bjdong2').val();
    var bjdong_cd = bjdong_cd;
    var reg_gubun = "01";
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
            // console.log(sh_R);
            hot_zone = new Array();
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
                // polygon.bindTooltip('<div>여기는 내 핫존이야</div>', {"sticky": true});
                // var polyline = L.polylin(latlngs, {color: 'red'}).addTo(map)
                // map.fitBounds(polyline.getBounds());
        },
        error: function(request, status, error){
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    });
}

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
            if (sh_R == false) {
                geo_add_b = JSON.parse(data.result2['coordi_geojson']);
                geo_json_add(geo_add_b);
                document.getElementById('bjdong2').value = data.result2['bjdong2']
            }
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

function pup_cnt(bjdong) {
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
            const initDiv1= document.getElementById("amd_info1");
            const initDiv2= document.getElementById("amd_info2");
            const initDiv3= document.getElementById("amd_info3");
            const initDiv4= document.getElementById("amd_info4");

            while(initDiv1.hasChildNodes()){ //자식 요소가 있는지 확인-false가 될때까지 반복
                initDiv1.removeChild(initDiv1.firstChild); // 첫번째 자식 요소를 삭제
            }
            while(initDiv2.hasChildNodes()){ //자식 요소가 있는지 확인-false가 될때까지 반복
                initDiv2.removeChild(initDiv2.firstChild); // 첫번째 자식 요소를 삭제
            }
            while(initDiv3.hasChildNodes()){ //자식 요소가 있는지 확인-false가 될때까지 반복
                initDiv3.removeChild(initDiv3.firstChild); // 첫번째 자식 요소를 삭제
            }
            while(initDiv4.hasChildNodes()){ //자식 요소가 있는지 확인-false가 될때까지 반복
                initDiv4.removeChild(initDiv4.firstChild); // 첫번째 자식 요소를 삭제
            }
            // popcnt_dictObject = {};
            for (var i = 1; i <= c; i++) {
                var amd_info = "amd_info"+i

                const targetDiv1 = document.getElementById(amd_info);
                const newElement1 = document.createElement("p");
                newElement1.textContent = "- 행정동: "+data.result2['emd_' + i];
                targetDiv1.appendChild(newElement1);

                const targetDiv2 = document.getElementById(amd_info);
                const newElement2 = document.createElement("p");
                newElement2.textContent = "> 0~4세: "+data.result2['kids_cnt_01_' + i] + "명";
                targetDiv2.appendChild(newElement2);

                const targetDiv3 = document.getElementById(amd_info);
                const newElement3 = document.createElement("p");
                newElement3.textContent = "> 5~9세: "+data.result2['kids_cnt_02_' + i] + "명";
                targetDiv3.appendChild(newElement3);

                const targetDiv4 = document.getElementById(amd_info);
                const newElement4 = document.createElement("p");
                newElement4.textContent = "> 10~14세: "+data.result2['kids_cnt_03_' + i] + "명";
                targetDiv4.appendChild(newElement4);

                const targetDiv5 = document.getElementById(amd_info);
                const newElement5 = document.createElement("p");
                newElement5.textContent = "> 가구수: "+data.result2['household_cnt_' + i];
                targetDiv5.appendChild(newElement5);

                const targetDiv6 = document.getElementById(amd_info);
                const newElement6 = document.createElement("p");
                newElement6.textContent = "> 총 가구원 수: "+data.result2['family_cnt_' + i];
                targetDiv6.appendChild(newElement6);

                const targetDiv7 = document.getElementById(amd_info);
                const newElement7 = document.createElement("p");
                newElement7.textContent = "> 평균가구원수: "+data.result2['avg_family_cnt_' + i];
                targetDiv7.appendChild(newElement7);

                // popcnt_dictObject[i+"_"+data.result2['emd_' + i]+"인구수: "] = data.result2['kids_cnt_01_' + i]+" 명, "+ data.result2['kids_cnt_02_' + i] +" 명, "+ data.result2['kids_cnt_03_' + i] +" 명, " +
                //     ""+ data.result2['household_cnt_' + i] +", " + data.result2['family_cnt_' + i] +", "+ data.result2['avg_family_cnt_' + i];

            }
            // for (var key in popcnt_dictObject) {
            //     console.log("key : " + key +", value : " + popcnt_dictObject[key]);
            // }
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

    // center = map.getCenter();
    // center_y = center.lat;
    // center_x = center.lng;

    // var sido = $('#sido').val();
    // var gugun = $('#gugun').val();
    // var dong = $('#dong').val();
    var bjdong2 = $('#bjdong2').val();
    var bjdong_cd = bjdong_cd
    // var postdata = {
    //     'sido':sido, 'gugun':gugun, 'dong':dong, 'center_y':center_y, 'center_x':center_x, 'bjdong2': bjdong2, 'bjdong_cd':bjdong_cd
    // }
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
            // alert("유지원 수 = "+c);
            // kinder_dictObject = {};
            // var new_bjdong = data.result2['bjdong2'];
            // b_check(new_bjdong);
            if (sh_R == false){
                for (var i = 1; i <= c; i++) {
                    // kinder_dictObject[i+"_"+data.result2['kinder_nm_' + i]] = data.result2['kinder_sum_' + i]+"명, "+ data.result2['kinder_cnt_03_' + i] +"명, "
                    //     + data.result2['kinder_cnt_04_' + i] +"명, "+ data.result2['kinder_cnt_05_' + i] +"명, " + data.result2['lat_' + i] +", "+ data.result2['lon_' + i];

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

                    // kinder_dictObject[i+"_"+data.result2['kinder_nm_' + i]] = data.result2['kinder_sum_' + i]+"명, "+ data.result2['kinder_cnt_03_' + i] +"명, "+ data.result2['kinder_cnt_04_' + i] +"명, "+ data.result2['kinder_cnt_05_' + i] +"명, " + data.result2['lat_' + i] +", "+ data.result2['lon_' + i];
                document.getElementById('bjdong2').value = data.result2['bjdong2'];
                }
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
            // alert("초등학교 수 = "+c);
            // el_school_dictObject = {};
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
                    // el_school_dictObject[i+"_"+data.result2['school_nm_' + i]] = data.result2['school_cnt_' + i]+"명, "+ data.result2['school_cnt_01' + i] +"명, "+ data.result2['school_cnt_02' + i] +"명, "+ data.result2['school_cnt_03' + i] +"명, "+ data.result2['school_cnt_04' + i] +"명, "+ data.result2['school_cnt_05' + i] +"명, "+ data.result2['school_cnt_06' + i] + data.result2['lat_' + i] +", "+ data.result2['lon_' + i];
                document.getElementById('bjdong2').value = data.result2['bjdong2']
                }
                // alert(Object.keys(el_school_dictObject).length);
                // for (var key in el_school_dictObject) {
                //     console.log("key : " + key +", value : " + el_school_dictObject[key]);
                // }
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

    // center = map.getCenter();
    // center_y = center.lat;
    // center_x = center.lng;

    // var sido = $('#sido').val();
    // var gugun = $('#gugun').val();
    // var dong = $('#dong').val();
    var bjdong2 = $('#bjdong2').val();
    var bjdong_cd = bjdong_cd
    // var postdata = {
    //     'sido':sido, 'gugun':gugun, 'dong':dong, 'center_y':center_y, 'center_x':center_x, 'bjdong2': bjdong2, 'bjdong_cd':bjdong_cd
    // }
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
            // alert("중학교 수 = "+c);
            // mi_school_dictObject = {};
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
                    // mi_school_dictObject[i+"_"+data.result2['school_nm_' + i]] = data.result2['school_cnt_' + i]+"명, "+ data.result2['school_cnt_01' + i]+"명, "+ data.result2['school_cnt_02' + i] +"명, "+ data.result2['school_cnt_03' + i]+ data.result2['lat_' + i] +", "+ data.result2['lon_' + i];
                document.getElementById('bjdong2').value = data.result2['bjdong2']
                }
                // alert(Object.keys(mi_school_dictObject).length);
                // for (var key in mi_school_dictObject) {
                //     console.log("key : " + key +", value : " + mi_school_dictObject[key]);
                // }
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

    // center = map.getCenter();
    // center_y = center.lat;
    // center_x = center.lng;

    // var sido = $('#sido').val();
    // var gugun = $('#gugun').val();
    // var dong = $('#dong').val();
    var bjdong2 = $('#bjdong2').val();
    var bjdong_cd = bjdong_cd
    // var postdata = {
    //     'sido':sido, 'gugun':gugun, 'dong':dong, 'center_y':center_y, 'center_x':center_x, 'bjdong2': bjdong2, 'bjdong_cd':bjdong_cd
    // }
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
                    // hi_school_dictObject[i+"_"+data.result2['school_nm_' + i]] = data.result2['school_cnt_' + i]+"명, " + data.result2['school_cnt_01' + i]+"명, " + data.result2['school_cnt_02' + i]+"명, " + data.result2['school_cnt_03' + i] + data.result2['lat_' + i] +", "+ data.result2['lon_' + i];
                document.getElementById('bjdong2').value = data.result2['bjdong2']
                }
                // alert(Object.keys(hi_school_dictObject).length);
                // for (var key in hi_school_dictObject) {
                //     console.log("key : " + key +", value : " + hi_school_dictObject[key]);
                // }
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
    // var postdata = {
    //     'sido':sido, 'gugun':gugun, 'dong':dong, 'center_y':center_y, 'center_x':center_x, 'bjdong2': bjdong2, 'bjdong_cd':bjdong_cd
    // }
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

                    // small_busi_dictObject[i+"_"+data.result2['indsSclsNm_' + i]+"_"+data.result2['bizesNm_' + i]] = data.result2['lat_' + i] +", "+ data.result2['lon_' + i];
                document.getElementById('bjdong2').value = data.result2['bjdong2']
                }
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
    })
};

function academy_toggle(bjdong_cd, school_type, subject_type, search){
    var marker_i;
    var cu_icon;
    var c;
    var popup_i;
    var html_i;
    var bjdong2 = $('#bjdong2').val();
    var bjdong_cd = bjdong_cd;
    var reg_gubun = "01";
    var zone_reg_state = "1";

    var postdata = {
        'bjdong2': bjdong2, 'bjdong_cd':bjdong_cd,
        'school_type':school_type, 'subject_type':subject_type,
        'search':search
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
                        '- <a href="/edu_info/academy_info_detail?id='+idx+'+&bjdong2='+data.result2['bjdong2']+'">학원 정보</a><br> ' +
                        '- <a href="#">커뮤니티</a><br> '+
                        // '- <a href="javascript:void(0);" onclick="hotzone_reg('+idx+', '+reg_gubun+', '+zone_reg_state+',  this );">핫존 등록</a> ' +
                        '- <a href="javascript:void(0);" onclick="hotzone_reg('+idx+', '+reg_gubun+', '+zone_reg_state+', '+ bjdong_cd +');">핫존 등록</a> ' +
                        '</div>')[0];
                    popup_i.setContent(html_i);
                    marker_i.bindPopup(popup_i);
                    marker_i.bindTooltip('<div><b>' + data.result2['academy_nm_' + i] +'</b><br>' +
                        data.result2['category_nm_' + i] + " / " + data.result2['teaching_subject_nm_01_' + i] + " / " + data.result2['teaching_line_nm_' + i]+'</div>', {"sticky": true});
                    document.getElementById('bjdong2').value = data.result2['bjdong2'];
                }
            academy_hotzone_toggle(data.result2['bjdong2']);
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
    var reg_gubun = "01";
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
                    marker_i = L.marker([data.result2['lat_' + i], data.result2['lon_' + i]], {}).addTo(hotzone_layerGroup);
                    var lat_lon = {};
                    lat_lon['lat'] = data.result2['lat_' + i];
                    lat_lon['lon'] = data.result2['lon_' + i];
                    hot_zone[i-1] = new Array(lat_lon);
                    icon = data.result2['category_cd_' + i];
                    cu_icon = L.icon({
                        iconUrl: '../static/icons/red_king_map.png',
                        iconSize: [30, 30],
                        popupAnchor: [0, -10]
                    });
                    marker_i.setIcon(cu_icon);
                    latlngs.push(marker_i.getLatLng());

                    popup_i = L.popup({"maxWidth": "100%"});
                    html_i = $('<div id="html_i" style="width: 200px; height: 100.0%; align: center;" xmlns="http://www.w3.org/1999/html">' +
                        '<a href="/edu_info/academy_info_detail?id='+idx+'+&bjdong2='+data.result2['bjdong2']+'"><h6><li>정보</li></h6></a><br> ' +
                        '<a href="#"><h6><li>커뮤니티</li></h6></a><br> '+
                        // '<a href="javascript:void(0);" onclick="hotzone_reg('+idx+', '+reg_gubun+', '+zone_reg_state+', '+ bjdong_cd +');"><h6><li>핫존 해지</li></h6></a> ' +
                        '</div>')[0];
                    popup_i.setContent(html_i);
                    marker_i.bindPopup(popup_i);
                    marker_i.bindTooltip('<div><h6>' + data.result2['academy_nm_' + i] +'</h6><br>' +
                        data.result2['category_nm_' + i] + " / " + data.result2['teaching_subject_nm_01_' + i] + " / " + data.result2['teaching_line_nm_' + i]+'</div>', {"sticky": true});
                    document.getElementById('bjdong2').value = data.result2['bjdong2']

                }
                // 핫존 처리
                var polygon = L.polygon(latlngs).setStyle({
                    fillColor: '#FF1493',
                    color: "#FF1493",
                    weight: 3,
                    opacity: 1,
                    fillOpacity: 0.1
                }).addTo(hotzone_layerGroup);
                popup_j = L.popup({"maxWidth": "100%"});
                html_j = $('<div id="html_j" style="width: 200px; height: 100.0%; align: center;">' +
                    '<b>여기는 내 핫존이야</b><br><br> ' +
                    '- <a href="#">핫플 <img src="/static/images/Ghost.gif"></a><br> ' +
                    '- <a href="#">핫친 <img src="/static/images/Ghost.gif"></a><br><br> ' +
                    '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/t1qq60p8rz8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>'+
                    '</div>')[0];
                popup_j.setContent(html_j);
                polygon.bindPopup(popup_j);

                var area = L.GeometryUtil.geodesicArea(polygon.getLatLngs()[0]);
                var n1 = area.toFixed();
                var cn1 = n1.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
                var pyong = Math.ceil(n1 * 0.3025);
                var pyong1 = pyong.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
                polygon.bindTooltip("<span> 약 "+cn1+" m<sup>2</sup> (약 "+pyong1+" 평)</span>");

                // polygon.bindTooltip('<div>여기는 내 핫존이야</div>', {"sticky": true});
                // var polyline = L.polylin(latlngs, {color: 'red'}).addTo(map)
                // map.fitBounds(polyline.getBounds());
            }
        },
        error: function(request, status, error){
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    });
}


function king_zone_toggle(bjdong_cd){
    var marker_i;
    var cu_icon;
    var c;
    var popup_i;
    var html_i;
    var popup_j;
    var html_j;
    var bjdong2 = $('#bjdong2').val();
    var bjdong_cd = bjdong_cd;
    var latlngs = Array();
    var postdata = {
        'bjdong_cd':bjdong_cd
    }
    $.ajax({
        type: 'POST',
        url: '/member_activity/visit_hotzone_ajax',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data){
            c = data.result2['id_counter'];
            hot_zone = new Array();
            if (sh_R == false){
                for (var i = 1; i <= c; i++) {
                    var zone_idx = data.result2['shop_idx_' + i];

                    marker_i = L.marker([data.result2['lat_' + i], data.result2['lon_' + i]], {}).addTo(hotzone_layerGroup);
                    // marker_i = L.marker([data.result2['lat_' + i], data.result2['lon_' + i]], {});
                    // hotzone_layerGroup.addLayer(marker_i);

                    var lat_lon = {};
                    lat_lon['lat'] = data.result2['lat_' + i];
                    lat_lon['lon'] = data.result2['lon_' + i];
                    hot_zone[i-1] = new Array(lat_lon);

                    var gubun_01 = data.result2['gubun_01_'+i];
                    var gubun_02 = data.result2['category_cd_'+i];
                    var shop_nm = data.result2['shop_nm_'+i];

                    icon = data.result2['gubun_01_' + i];
                    cu_icon = L.icon({
                        iconUrl: '../static/icons/red_king_map.png',
                        iconSize: [30, 30],
                        popupAnchor: [0, -10]
                    });
                    marker_i.setIcon(cu_icon);
                    latlngs.push(marker_i.getLatLng());

                    popup_i = L.popup({"maxWidth": "100%"});
                    html_i = $('<div id="html_i" style="width: 200px; height: 100.0%; align: center;" xmlns="http://www.w3.org/1999/html">' +
                               '<li>나의 레드킹</li><br>' +
                               ' <a href="/zone_sns/zone_sns_info?zone_id='+zone_idx+'&gubun_01='+gubun_01+'&gubun_02='+gubun_02+'&bjdong_cd='+bjdong_cd+'">'+shop_nm+'</a>' +
                                // '- <a href="#">핫플 <img src="/static/images/Ghost.gif"></a><br> ' +
                                // '- <a href="#">핫친 <img src="/static/images/Ghost.gif"></a><br><br> ' +
                                // '  <iframe width="100%" height="100%" src="https://www.youtube.com/embed/t1qq60p8rz8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>'+
                               '</div>')[0];
                    popup_i.setContent(html_i);
                    marker_i.bindPopup(popup_i);

                    // marker_i.bindTooltip('<div><h6>' + data.result2['academy_nm_' + i] +'</h6><br>' +
                    //     data.result2['category_nm_' + i] + " / " + data.result2['teaching_subject_nm_01_' + i] + " / " + data.result2['teaching_line_nm_' + i]+'</div>', {"sticky": true});
                    // document.getElementById('bjdong2').value = data.result2['bjdong2']

                }
                // 핫존 처리
                var polygon = L.polygon(latlngs).setStyle({
                    fillColor: '#FF1493',
                    color: '#FF1493',
                    weight: 3,
                    opacity: 1
                }).addTo(hotzone_polygon_layerGroup);
                console.log(polygon);
                var area = L.GeometryUtil.geodesicArea(polygon.getLatLngs()[0]);
                var n1 = area.toFixed();
                var cn1 = n1.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
                var pyong = Math.ceil(n1 * 0.3025);
                var pyong1 = pyong.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");

                popup_j = L.popup({"maxWidth": "100%"});
                html_j = $('<div id="html_j" style="width: 200px; height: 100.0%; align: center;">' +
                            '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/t1qq60p8rz8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>'+
                           '</div>')[0];
                // console.log(html_j);
                popup_j.setContent(html_j);
                polygon.bindTooltip("<span> 약 "+cn1+" m<sup>2</sup> (약 "+pyong1+" 평)</span>");

                // var polyline = L.polygon(latlngs, {color: 'red'}).addTo(map);
                // polyline.bindTooltip('<div>여기는 내 핫존이야</div>', {"sticky": true});
                // map.fitBounds(polyline.getBounds());
                $('#hotzone_area').empty();
                $('#hotzone_area').append("(나의 핫존: "+pyong1+"평)");
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
    var reg_gubun = "01";
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
        url: '/map_info/shop_info_target_ajax',
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
                    document.getElementById('bjdong2').value = data.result2['bjdong2']
                }
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
                // console.log(i-1, bizesNm, indsSclsNm, academy_url, academy_img)

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


function btn_call($href, bjdong_cd){
    if(bjdong_cd){
    layer_popup($href);
    btn_bjdong_info(bjdong_cd);
    }else{
        alert("지역을 선택하세요.");
    }
};

function btn_bjdong_info (bjdong_cd){
    pup_cnt_button(bjdong_cd);
    kinder_button(bjdong_cd);
    el_button(bjdong_cd);
    mi_button(bjdong_cd);
    hi_button(bjdong_cd);
    ed_button(bjdong_cd);
    building_button(bjdong_cd);
    // platon_button(bjdong_cd);
    // platon_custom_button(bjdong_cd);
    // singi_custom_button(bjdong_cd);
    // platon_stop_custom_button(bjdong_cd);
    // singi_stop_custom_button(bjdong_cd);
    // asobi_button(bjdong_cd);
};

function get_polygon_info(bjdong, polygon) {
    layer_popup('#info_open_div');
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

            let pop_con = document.getElementById('popcnt');
            while(pop_con.hasChildNodes()){ //자식 요소가 있는지 확인-false가 될때까지 반복
                pop_con.removeChild(pop_con.firstChild); // 첫번째 자식 요소를 삭제
            }
            let pop_con_kinder = document.getElementById('kinder_info');
            while(pop_con_kinder.hasChildNodes()){ //자식 요소가 있는지 확인-false가 될때까지 반복
                pop_con_kinder.removeChild(pop_con_kinder.firstChild); // 첫번째 자식 요소를 삭제
            }
            let pop_con_el = document.getElementById('el_info');
            while(pop_con_el.hasChildNodes()){ //자식 요소가 있는지 확인-false가 될때까지 반복
                pop_con_el.removeChild(pop_con_el.firstChild); // 첫번째 자식 요소를 삭제
            }
            let pop_con_mi = document.getElementById('mi_info');
            while(pop_con_mi.hasChildNodes()){ //자식 요소가 있는지 확인-false가 될때까지 반복
                pop_con_mi.removeChild(pop_con_mi.firstChild); // 첫번째 자식 요소를 삭제
            }
            let pop_con_hi = document.getElementById('hi_info');
            while(pop_con_hi.hasChildNodes()){ //자식 요소가 있는지 확인-false가 될때까지 반복
                pop_con_hi.removeChild(pop_con_hi.firstChild); // 첫번째 자식 요소를 삭제
            }
            let pop_con_ed = document.getElementById('ed_info');
            while(pop_con_ed.hasChildNodes()){ //자식 요소가 있는지 확인-false가 될때까지 반복
                pop_con_ed.removeChild(pop_con_ed.firstChild); // 첫번째 자식 요소를 삭제
            }
            let pop_con_bu = document.getElementById('buinding_info');
            while(pop_con_bu.hasChildNodes()){ //자식 요소가 있는지 확인-false가 될때까지 반복
                pop_con_bu.removeChild(pop_con_bu.firstChild); // 첫번째 자식 요소를 삭제
            }
            let pop_con_pla = document.getElementById('platon_live_info');
            while(pop_con_pla.hasChildNodes()){ //자식 요소가 있는지 확인-false가 될때까지 반복
                pop_con_pla.removeChild(pop_con_pla.firstChild); // 첫번째 자식 요소를 삭제
            }
            let pop_con_singi = document.getElementById('singi_live_info');
            while(pop_con_singi.hasChildNodes()){ //자식 요소가 있는지 확인-false가 될때까지 반복
                pop_con_singi.removeChild(pop_con_singi.firstChild); // 첫번째 자식 요소를 삭제
            }
            let pop_con_pla_off = document.getElementById('platon_off_info');
            while(pop_con_pla_off.hasChildNodes()){ //자식 요소가 있는지 확인-false가 될때까지 반복
                pop_con_pla_off.removeChild(pop_con_pla_off.firstChild); // 첫번째 자식 요소를 삭제
            }
            let pop_con_sin_off = document.getElementById('singi_off_info');
            while(pop_con_sin_off.hasChildNodes()){ //자식 요소가 있는지 확인-false가 될때까지 반복
                pop_con_sin_off.removeChild(pop_con_sin_off.firstChild); // 첫번째 자식 요소를 삭제
            }


            var c = data.result2['id_counter'];
            for (var i = 1; i <= c; i++) {
                let popcnt = document.getElementById('popcnt');
                let new_pTag1 = document.createElement('p');
                new_pTag1.setAttribute('class', 'pTag');
                new_pTag1.innerHTML = "&nbsp;<b>"+i+". "+data.result2['emd_'+[i]]+" (행정동) 인구수</b><br><br> "+
                    "&nbsp;&nbsp; - 만 0~4세: "+data.result2['kids_cnt_01_'+[i]]+" 명 <br> "+
                    "&nbsp;&nbsp; - 만 5~8세 (유아 6세~초2): "+ data.result2['kids_cnt_02_'+[i]] +" 명 <br> "+
                    "&nbsp;&nbsp; - 만 9~12세 (초1~초6): "+ data.result2['kids_cnt_03_'+[i]] +" 명 <br>"+
                    "&nbsp;&nbsp; - 만 13~15세 (중등): "+ data.result2['kids_cnt_04_'+[i]] +" 명 <br><br>"
                popcnt.appendChild(new_pTag1);
            }

            var kinder = data.kinder_data['kinder_info_result'];
            var kinder_json = JSON.parse(kinder);
            var kinder_cnt = kinder_json.length;

            for (var i = 0; i < kinder_cnt; i++) {
                let popcnt = document.getElementById('kinder_info');
                let new_pTag1 = document.createElement('p');
                let new_pTag2 = document.createElement('p');
                new_pTag1.setAttribute('class', 'pTag');
                new_pTag1.innerHTML = "<b>"+i+". "+kinder_json[i]['kinder']+"</b>";

                new_pTag2.setAttribute('class', 'pTag');
                new_pTag2.innerHTML = "&nbsp;&nbsp; - 총원: "+kinder_json[i]['cnt_sum']+" 명 <br> "+
                    "&nbsp;&nbsp; - 만 3세: "+ kinder_json[i]['cnt_3'] +" 명 <br> "+
                    "&nbsp;&nbsp; - 만 4세: "+kinder_json[i]['cnt_4'] +" 명 <br> "+
                    "&nbsp;&nbsp; - 만 5세: "+ kinder_json[i]['cnt_5'] +"<br><br> ";
                popcnt.appendChild(new_pTag1);
                popcnt.appendChild(new_pTag2);
            }

            var el_school = data.el_school_data['el_school_info_result'];
            var el_json = JSON.parse(el_school);
            var el_cnt = el_json.length;
            for (var i = 0; i < el_cnt; i++) {
                let popcnt = document.getElementById('el_info');
                let new_pTag1 = document.createElement('p');
                let new_pTag2 = document.createElement('p');
                new_pTag1.setAttribute('class', 'pTag');
                new_pTag1.innerHTML = "<b>"+i+". "+el_json[i]['SCHUL_NM']+"</b>";

                new_pTag2.setAttribute('class', 'pTag');
                new_pTag2.innerHTML = "&nbsp;&nbsp; - 총원: "+el_json[i]['SUM_CNT']+" 명 <br> "+
                    "&nbsp;&nbsp; - 1학년: "+ el_json[i]['school_cnt_01'] +" 명 <br> "+
                    "&nbsp;&nbsp; - 2학년: "+el_json[i]['school_cnt_02'] +" 명 <br> "+
                    "&nbsp;&nbsp; - 3학년: "+ el_json[i]['school_cnt_03'] +" 명 <br> "+
                    "&nbsp;&nbsp; - 4학년: "+el_json[i]['school_cnt_04'] +" 명 <br> "+
                    "&nbsp;&nbsp; - 5학년: "+el_json[i]['school_cnt_05'] +" 명 <br> "+
                    "&nbsp;&nbsp; - 6학년: "+ el_json[i]['school_cnt_06'] +" 명 <br><br> ";
                popcnt.appendChild(new_pTag1);
                popcnt.appendChild(new_pTag2);
            }
            var mi_school = data.mi_school_data['mi_school_info_result'];
            var mi_json = JSON.parse(mi_school);
            var mi_cnt = mi_json.length;
            for (var i = 0; i < mi_cnt; i++) {
                let popcnt = document.getElementById('mi_info');
                let new_pTag1 = document.createElement('p');
                let new_pTag2 = document.createElement('p');
                new_pTag1.setAttribute('class', 'pTag');
                new_pTag1.innerHTML = "<b>"+i+". "+mi_json[i]['SCHUL_NM']+"</b>";

                new_pTag2.setAttribute('class', 'pTag');
                new_pTag2.innerHTML = "&nbsp;&nbsp; - 총원: "+mi_json[i]['SUM_CNT']+" 명 <br> "+
                    "&nbsp;&nbsp; - 1학년: "+ mi_json[i]['school_cnt_01'] +" 명 <br> "+
                    "&nbsp;&nbsp; - 2학년: "+mi_json[i]['school_cnt_02'] +" 명 <br> "+
                    "&nbsp;&nbsp; - 3학년: "+ mi_json[i]['school_cnt_03'] +" 명 <br><br> ";
                popcnt.appendChild(new_pTag1);
                popcnt.appendChild(new_pTag2);
            }
            var hi_school = data.hi_school_data['hi_school_info_result'];
            var hi_json = JSON.parse(hi_school);
            var hi_cnt = hi_json.length;
            for (var i = 0; i < hi_cnt; i++) {
                let popcnt = document.getElementById('hi_info');
                let new_pTag1 = document.createElement('p');
                let new_pTag2 = document.createElement('p');
                new_pTag1.setAttribute('class', 'pTag');
                new_pTag1.innerHTML = "<b>"+i+". "+hi_json[i]['SCHUL_NM']+"</b>";

                new_pTag2.setAttribute('class', 'pTag');
                new_pTag2.innerHTML = "&nbsp;&nbsp; - 총원: "+hi_json[i]['SUM_CNT']+" 명 <br> "+
                    "&nbsp;&nbsp; - 1학년: "+ hi_json[i]['school_cnt_01'] +" 명 <br> "+
                    "&nbsp;&nbsp; - 2학년: "+hi_json[i]['school_cnt_02'] +" 명 <br> "+
                    "&nbsp;&nbsp; - 3학년: "+ hi_json[i]['school_cnt_03'] +" 명 <br><br> ";
                popcnt.appendChild(new_pTag1);
                popcnt.appendChild(new_pTag2);
            }
            var building = data.building_data['building_info_result'];
            var building_json = JSON.parse(building);
            var building_cnt = building_json.length;
            for (var i = 0; i < building_cnt; i++) {
                let popcnt = document.getElementById('buinding_info');
                let new_pTag1 = document.createElement('p');
                let new_pTag2 = document.createElement('p');
                new_pTag1.setAttribute('class', 'pTag');
                new_pTag1.innerHTML = i+". "+building_json[i]['BUILDING_NM']+"_"+building_json[i]['DONGNM']+": "+building_json[i]['HO_CNT']+" 세대 ";
                popcnt.appendChild(new_pTag1);

            }
            var shop = data.shop_data['shop_info_result'];
            var shop_json = JSON.parse(shop);
            var shop_cnt = shop_json.length;
            for (var i = 0; i < shop_cnt; i++) {
                let popcnt = document.getElementById('ed_info');
                let new_pTag1 = document.createElement('p');
                let new_pTag2 = document.createElement('p');
                new_pTag1.setAttribute('class', 'pTag');
                new_pTag1.innerHTML = i+". "+shop_json[i]['indsSclsNm']+"_"+shop_json[i]['bizesNm'];
                popcnt.appendChild(new_pTag1);
            }
            // var platon = data.platon_data['platon_info_result'];
            // var platon_json = JSON.parse(platon);
            // var pla_cnt = platon_json.length;

            var platon_member = data.platon_member_data['platon_member_info_result'];
            var pla_m_json = JSON.parse(platon_member);
            var pla_m_cnt = pla_m_json.length;
            for (var i = 0; i < pla_m_cnt; i++) {
                var birthDate  = pla_m_json[i]['birth'];
                var y = birthDate .substr(0, 4);
                var m = birthDate .substr(4, 2);
                var d = birthDate .substr(6, 2);
                var today = new Date();
                birthDate = new Date(y,m-1,d);
                var age = today.getFullYear() - birthDate.getFullYear() + 1;

                let popcnt = document.getElementById('platon_live_info');
                let new_pTag1 = document.createElement('p');
                let new_pTag2 = document.createElement('p');
                new_pTag1.setAttribute('class', 'pTag');
                new_pTag1.innerHTML = i+". "+pla_m_json[i]['member_nm']+": "+pla_m_json[i]['birth']+"/"+age+" 세, "+ pla_m_json[i]['sap_num']+", "+pla_m_json[i]['center_nm']
                    +", "+pla_m_json[i]['teacher_nm']+", "+pla_m_json[i]['lectuer_type']+", "+pla_m_json[i]['parents_nm']+", "+pla_m_json[i]['parents_cell']+", "+pla_m_json[i]['edu_nm'];
                popcnt.appendChild(new_pTag1);
            }
            var singi_member = data.singi_member_data['singi_member_info_result'];
            var sin_m_json = JSON.parse(singi_member);
            var sin_m_cnt = sin_m_json.length;
            for (var i = 0; i < sin_m_cnt; i++) {
                var birthDate  = sin_m_json[i]['birth'];
                var y = birthDate .substr(0, 4);
                var m = birthDate .substr(4, 2);
                var d = birthDate .substr(6, 2);
                var today = new Date();
                birthDate = new Date(y,m-1,d);
                var age = today.getFullYear() - birthDate.getFullYear() + 1;

                let popcnt = document.getElementById('singi_live_info');
                let new_pTag1 = document.createElement('p');
                let new_pTag2 = document.createElement('p');
                new_pTag1.setAttribute('class', 'pTag');
                new_pTag1.innerHTML = i+". "+sin_m_json[i]['member_nm']+": "+sin_m_json[i]['birth']+"/"+age+" 세, "+ sin_m_json[i]['sap_num']+", "+sin_m_json[i]['center_nm']
                    +", "+sin_m_json[i]['teacher_nm']+", "+sin_m_json[i]['lectuer_type']+", "+sin_m_json[i]['parents_nm']+", "+sin_m_json[i]['parents_cell']+", "+sin_m_json[i]['edu_nm'];
                popcnt.appendChild(new_pTag1);
            }

            var platon_stop = data.platon_stop_data['platon_stop_member_info_result'];
            var platon_stop_json = JSON.parse(platon_stop);
            var pla_stop_cnt = platon_stop_json.length;
            for (var i = 0; i < pla_stop_cnt; i++) {
                var birthDate  = platon_stop_json[i]['birth'];
                var y = birthDate .substr(0, 4);
                var m = birthDate .substr(4, 2);
                var d = birthDate .substr(6, 2);
                var today = new Date();
                birthDate = new Date(y,m-1,d);
                var age = today.getFullYear() - birthDate.getFullYear() + 1;

                let popcnt = document.getElementById('platon_off_info');
                let new_pTag1 = document.createElement('p');
                let new_pTag2 = document.createElement('p');
                new_pTag1.setAttribute('class', 'pTag');
                new_pTag1.innerHTML = i+". "+platon_stop_json[i]['member_nm']+": "+platon_stop_json[i]['birth']+"/"+age+" 세, "+ platon_stop_json[i]['sap_num']+", "+platon_stop_json[i]['center_nm']
                    +", "+platon_stop_json[i]['teacher_nm']+", "+platon_stop_json[i]['lectuer_type']+", "+platon_stop_json[i]['parents_nm']+", "+platon_stop_json[i]['parents_cell']+", "+platon_stop_json[i]['edu_nm'];
                popcnt.appendChild(new_pTag1);
            }

            var singi_stop = data.singi_stop_data['singi_stop_member_info_result'];
            var sin_stop_json = JSON.parse(singi_stop);
            var sin_stop_cnt = sin_stop_json.length;
            for (var i = 0; i < sin_stop_cnt; i++) {
                var birthDate  = sin_stop_json[i]['birth'];
                var y = birthDate .substr(0, 4);
                var m = birthDate .substr(4, 2);
                var d = birthDate .substr(6, 2);
                var today = new Date();
                birthDate = new Date(y,m-1,d);
                var age = today.getFullYear() - birthDate.getFullYear() + 1;

                let popcnt = document.getElementById('singi_off_info');
                let new_pTag1 = document.createElement('p');
                let new_pTag2 = document.createElement('p');
                new_pTag1.setAttribute('class', 'pTag');
                new_pTag1.innerHTML = i+". "+sin_stop_json[i]['member_nm']+": "+sin_stop_json[i]['birth']+"/"+age+" 세, "+ sin_stop_json[i]['sap_num']+", "+sin_stop_json[i]['center_nm']
                    +", "+sin_stop_json[i]['teacher_nm']+", "+sin_stop_json[i]['lectuer_type']+", "+sin_stop_json[i]['parents_nm']+", "+sin_stop_json[i]['parents_cell']+", "+sin_stop_json[i]['edu_nm'];
                popcnt.appendChild(new_pTag1);
            }
        },
        beforeSend:function(){
            // (이미지 보여주기 처리)
            $('.wrap-loading2').removeClass('display-none');
        },complete:function(){
            // (이미지 감추기 처리)
            $('.wrap-loading2').addClass('display-none');
        },
        error: function (request, status, error) {
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    })
};

function bjdong_get_info(latlon){
    user_loc_lat = Number(Object.values(latlon)[0]);
    user_loc_lon = Number(Object.values(latlon)[1]);
    var postdata = {
        'center_y':user_loc_lat, 'center_x':user_loc_lon
    }
    $.ajax({
        type: 'POST',
        url: '/map_info/loc_info',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data){
            var new_bjdong = data.result2['bjdong_cd'];
            var new_bjdong_nm = data.result2['bjdong_nm'];
            sido_cd = data.result2['sido_cd'];
            bjdong_cd = data.result2['bjdong_cd'];
            all_bjdong_cd = new_bjdong;
            // console.log(new_bjdong);
            near_shop_academy_list(new_bjdong, user_loc_lat, user_loc_lon);

            // document.getElementById('bjdong_nm').innerText = new_bjdong_nm + " 타임라인";
            document.getElementById('bjdong_nm').innerText = "5분 안에 도착할 수 있는 곳, 여긴어때?";
        },
        error: function(request, status, error){
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    })
};

function polygon_get_info(lat, lon, getLatLngs){
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
            var new_bjdong = data.result2['bjdong_cd'];
            var new_bjdong_nm = data.result2['bjdong_nm'];
            all_bjdong_cd = new_bjdong;
            document.getElementById('loc_info_nm').innerText = new_bjdong_nm + " 정보보기";
            b_check(new_bjdong);
            if (sh_R == false) {
                bjdong_area(data.result2['bjdong_cd']);
                heang_area(data.result2['bjdong_cd']);
                kinder_toggle(data.result2['bjdong_cd']);
                el_toggle(data.result2['bjdong_cd']);
                mi_toggle(data.result2['bjdong_cd']);
                hi_toggle(data.result2['bjdong_cd']);
                ed_toggle(data.result2['bjdong_cd']);
                platon_toggle(data.result2['bjdong_cd'])
                platon_custom_toggle(data.result2['bjdong_cd']);
                singi_custom_toggle(data.result2['bjdong_cd']);
                platon_stop_custom_toggle(data.result2['bjdong_cd']);
                singi_stop_custom_toggle(data.result2['bjdong_cd']);
                asobi_toggle(data.result2['bjdong_cd']);
                building_toggle(data.result2['bjdong_cd']);
            }
            get_polygon_info(data.result2['bjdong_cd'], getLatLngs);
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
    map.locate();
    map.removeLayer( myloc_layerGroup );
    myloc_layerGroup = L.featureGroup().addTo(map);
}

function myloc_stop(){
    // clearInterval(mylocation);
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
    // return inside;
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
//
// map.on("mouseup", function(e){
//     center = map.getCenter();
//     center_y = center.lat;
//     center_x = center.lng;
//     var school_type = $('#school option:selected').val();
//     var subject_type = $('#subject option:selected').val();
//     var search = $('#search_txt').val();
//     var search_type = $('#search_type').val();
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
//             // alert(data.result2['sido_cd']);
//             sido_cd = data.result2['sido_cd'];
//             var new_bjdong = data.result2['bjdong_cd'];
//             var new_bjdong_nm = data.result2['bjdong_nm'];
//
//             all_bjdong_cd = new_bjdong;
//             // document.getElementById('loc_info_nm').innerText = new_bjdong_nm + " 정보보기";
//             b_check(new_bjdong);
//             if (sh_R == false) {
//                 bjdong_area(data.result2['bjdong_cd']);
//                 kinder_toggle(data.result2['bjdong_cd']);
//                 el_toggle(data.result2['bjdong_cd']);
//                 mi_toggle(data.result2['bjdong_cd']);
//                 hi_toggle(data.result2['bjdong_cd']);
//                 // ed_toggle(data.result2['bjdong_cd']);
//                 academy_toggle(data.result2['bjdong_cd'], school_type, subject_type, search);
//                 if (search_type != "1"){
//                     shop_toggle(data.result2['bjdong_cd']);
//                 }
//                 // platon_toggle(data.result2['bjdong_cd'])
//                 // platon_custom_toggle(data.result2['bjdong_cd']);
//                 // singi_custom_toggle(data.result2['bjdong_cd']);
//                 // platon_stop_custom_toggle(data.result2['bjdong_cd']);
//                 // singi_stop_custom_toggle(data.result2['bjdong_cd']);
//                 // asobi_toggle(data.result2['bjdong_cd']);
//                 // building_toggle(data.result2['bjdong_cd']);
//                 // pup_cnt(data.result2['bjdong_cd']);
//             }
//             select_set_value(sido_cd, data.result2['bjdong_cd']);
//             academy_best_info(data.result2['bjdong_cd'], new_bjdong_nm);
//         },
//         error: function(request, status, error){
//             alert('데이터를 가지고 오는데 실패했습니다.')
//             alert(error);
//         }
//     })
// });

//
// map.on("mouseup", function(e){
//     center = map.getCenter();
//     center_y = center.lat;
//     center_x = center.lng;
//     var school_type = $('#school option:selected').val();
//     var subject_type = $('#subject option:selected').val();
//     var search = $('#search_txt').val();
//     var search_type = $('#search_type').val();
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
//             // alert(data.result2['sido_cd']);
//             sido_cd = data.result2['sido_cd'];
//             var new_bjdong = data.result2['bjdong_cd'];
//             var new_bjdong_nm = data.result2['bjdong_nm'];
//
//             all_bjdong_cd = new_bjdong;
//             // document.getElementById('loc_info_nm').innerText = new_bjdong_nm + " 정보보기";
//             console.log(new_bjdong);
//             b_check(new_bjdong);
//             if (sh_R == false) {
//                 // bjdong_area(data.result2['bjdong_cd']);
//                 // kinder_toggle(data.result2['bjdong_cd']);
//                 // el_toggle(data.result2['bjdong_cd']);
//                 // mi_toggle(data.result2['bjdong_cd']);
//                 // hi_toggle(data.result2['bjdong_cd']);
//                 // // ed_toggle(data.result2['bjdong_cd']);
//                 // academy_toggle(data.result2['bjdong_cd'], school_type, subject_type, search);
//                 // if (search_type != "1"){
//                 //     shop_toggle(data.result2['bjdong_cd']);
//                 // }
//                 // platon_toggle(data.result2['bjdong_cd'])
//                 // platon_custom_toggle(data.result2['bjdong_cd']);
//                 // singi_custom_toggle(data.result2['bjdong_cd']);
//                 // platon_stop_custom_toggle(data.result2['bjdong_cd']);
//                 // singi_stop_custom_toggle(data.result2['bjdong_cd']);
//                 // asobi_toggle(data.result2['bjdong_cd']);
//                 // building_toggle(data.result2['bjdong_cd']);
//                 // pup_cnt(data.result2['bjdong_cd']);
//                 first_hotzone_toggle(data.result2['bjdong_cd']);
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

// 오른쪽 마우스 클릭 시
map.on("contextmenu", function(e){
    map.removeLayer( circle_group1 );
    map.removeLayer( circle_group2 );

    circle_group1 = L.featureGroup().addTo(map);
    circle_group2 = L.featureGroup().addTo(map);
});

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

function onLocationFound(e) {
    var radius = e.accuracy / 6;
    var marker_i = L.marker(e.latlng).addTo(myloc_layerGroup);
    cu_icon = L.icon({
        iconUrl: '../static/images/50908ccfcc433ef83b28c042bb87a6c0.gif',
        iconSize: [55, 50], // size of the icon                                iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -10] // point from which the popup should open relative to the iconAnchor
    });

    marker_i.setIcon(cu_icon);

    L.circle(e.latlng, radius, {"bubblingMouseEvents": true, "color": "skyblue",
        "dashArray": null, "dashOffset": null,
        "fill": true, "fillColor": "skyblue",
        "fillOpacity": 0.2, "fillRule": "evenodd",
        "lineCap": "round", "lineJoin": "round",
        "opacity": 1.0, "radius": 500,
        "stroke": true, "weight": 3}).addTo(myloc_layerGroup);
    // hotzone_polygon_info(e.latlng);
    map.setView(e.latlng, 16);
    polygon_inside(e.latlng, hot_zone);
    // polygon_test(point, polygon);
    bjdong_get_info(e.latlng);
    console.log(e.latlng);
    lat = e.latlng[0];
    lon = e.latlng[1];
}

function bjdong_loc_n_info(){
    $.ajax({
        type: 'POST',
        url: '/member_info/user_loc',
        contentType: "application/json",
        success: function(data){
            user_loc_lat = data.loc_lat;
            user_loc_lon = data.loc_lon;
            sido_cd= data.sido_cd;
            bjdong_cd = data.bjdong_cd;
            console.log(user_loc_lat, user_loc_lon, sido_cd, bjdong_cd);
            var latlon = {};
            latlon['lat'] = user_loc_lat;
            latlon['lon'] = user_loc_lon;
            bjdong_get_info(latlon);
        },
        error: function(request, status, error){
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    })
}

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);
function onLocationError(e) {
    bjdong_loc_n_info();
}



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
    ).addTo(circle_group1).bindTooltip('우리집 반경 250M').openPopup();
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

// var layer_control = {
//     base_layers : {
//         "openstreetmap" : tile_layer
//     },
//     overlays :  {
//         "법정동 경계" : choropleth_b,
//         "유아(유치원)" : kinder_layerGroup,
//         "초등학교" : el_layerGroup,
//         "중학교" : mi_layerGroup,
//         "고등학교" : hi_layerGroup,
//         "학원/교습소" : edu_markers,
//         "소상공인" : shop_markers
//     },
// };

// var drawnItems = L.featureGroup()

// var layerControl= L.control.layers(
//     layer_control.base_layers,
//     layer_control.overlays,
//     {"autoZIndex": true, "collapsed": true, "position": "topright"},
//     {"drawlayer": drawnItems }
// ).addTo(map);

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
        },
        circle: false, // 원 그리기 기능 사용 여부
        circlemarker: false,
        marker: true, // 마커 그리기 기능 사용 여부
        polyline: true, // 선 그리기 기능 사용 여부
        rectangle: true, // 사각형 그리기 기능 사용 여부
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

        var area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
        var n1 = area.toFixed();
        var cn1 = n1.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        // console.log('면적:', cn1, '제곱미터');
        var pyong = Math.ceil(n1 * 0.3025);
        var pyong1 = pyong.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        layer.bindTooltip("<span> 약 "+cn1+" m<sup>2</sup> (약 "+pyong1+" 평)</span>");
        // polygon_get_info(lat, lon, getLatLngs);
    }drawnItems.addLayer(layer);

    if (type === 'polygon') {
        var getLatLngs = layer.getLatLngs();
        // console.log(getLatLngs);
        var draw_start= getLatLngs[0][0];
        var lat = draw_start.lat;
        var lon = draw_start.lng;
        map.setView([lat, lon], 16, {zoomControl: false});
        // polygon_get_info(lat, lon, getLatLngs);

        var area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
        var n1 = area.toFixed();
        var cn1 = n1.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        // console.log('면적:', cn1, '제곱미터');
        var pyong = Math.ceil(n1 * 0.3025);
        var pyong1 = pyong.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        layer.bindTooltip("<span> 약 "+cn1+" m<sup>2</sup> (약 "+pyong1+" 평)</span>");
    }drawnItems.addLayer(layer);
});
