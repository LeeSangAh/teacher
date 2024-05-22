var map;
var tile_layer;
var geo_add_b;
var geo_add_h;
var user_loc_lat;
var user_loc_lon;
var bjdong_cd;
var all_bjdong_cd;
var sido_cd;
var bjdong_nm;
var user_loc;

var choropleth_b = L.featureGroup().addTo(map);
var choropleth_h = L.featureGroup().addTo(map);
var circle_group1 = L.featureGroup().addTo(map);
var circle_group2 = L.featureGroup().addTo(map);

var myloc_layerGroup = L.featureGroup().addTo(map);
var myhouse_layerGroup = L.featureGroup().addTo(map);
var hotzone_layerGroup = L.featureGroup().addTo(map);

var shop_markers = new L.MarkerClusterGroup().addTo(map);
var edu_markers = new L.MarkerClusterGroup().addTo(map);
var building_markers = new L.MarkerClusterGroup().addTo(map);
var search_academy = new L.MarkerClusterGroup().addTo(map);

var search_history = new Array();
var sh_R;
var polygon_search_history = new Array();
var poly_R = false;
var hot_zone = new Array();

var academy_cnt = 0;

function b_check(new_bjdong_cd){
    // console.log("search_history: "+search_history);
    sh_R = search_history.includes(new_bjdong_cd);
    // return sh_R
};

function p_check(polygon_bjdong_cd){
    // console.log("new_bjdong_cd"+polygon_bjdong_cd);
    poly_R = polygon_search_history.includes(polygon_bjdong_cd);
    return poly_R
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
    document.getElementById('new_bjdong_nm').innerHTML= bjdong_nm;

    bjdong_area(bjdong_cd);
    b_check(bjdong_cd);
    academy_toggle(bjdong_cd, school_type, subject_type, search)

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

function academy_toggle(bjdong_cd, school_type, subject_type, search){
    var marker_i;
    var cu_icon;
    var c;
    var popup_i;
    var html_i;
    var bjdong2 = $('#bjdong2').val();
    var bjdong_cd = bjdong_cd;
    var reg_gubun = "00";
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
            // console.log("sh_R: "+sh_R);
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
                        '<a href="/edu_info/academy_info_detail?id='+idx+'+&bjdong2='+data.result2['bjdong2']+'"><h6><li>학원 정보</li></h6></a><br> ' +
                        // '<a href="#"><h6><li>커뮤니티</li></h6></a><br> '+
                        // '- <a href="javascript:void(0);" onclick="hotzone_reg('+idx+', '+reg_gubun+', '+zone_reg_state+',  this );">핫존 등록</a> ' +
                        // '<a href="javascript:void(0);" onclick="hotzone_reg('+idx+', '+reg_gubun+', '+zone_reg_state+', '+ bjdong_cd +');"><h6><li>핫존 등록</li></h6></a> ' +
                        '</div>')[0];
                    popup_i.setContent(html_i);
                    marker_i.bindPopup(popup_i);
                    marker_i.bindTooltip('<div><h6>' + data.result2['academy_nm_' + i] +'</h6><br>' +
                        data.result2['category_nm_' + i] + " / " + data.result2['teaching_subject_nm_01_' + i] + " / " + data.result2['teaching_line_nm_' + i]+'</div>', {"sticky": true});
                    document.getElementById('bjdong2').value = data.result2['bjdong2'];
                }
                // academy_hotzone_toggle(data.result2['bjdong2']);
                search_history.push(data.result2['bjdong2']);
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
                    html_i = $('<div id="html_i" style="width: 200px; height: 100.0%; align: center;" xmlns="http://www.w3.org/1999/html">' +
                        '<a href="/edu_info/academy_info_detail?id='+idx+'+&bjdong2='+data.result2['bjdong2']+'"><h6><li>학원 정보</li></h6></a><br> ' +
                        '<a href="#"><h6><li>커뮤니티</li></h6></a><br> '+
                        // '- <a href="javascript:void(0);" onclick="hotzone_reg('+idx+', '+reg_gubun+', '+zone_reg_state+',  this );">핫존 등록</a> ' +
                        '<a href="javascript:void(0);" onclick="hotzone_reg('+idx+', '+reg_gubun+', '+zone_reg_state+', '+ bjdong_cd +');"><h6><li>핫존 해지</li></h6></a> ' +
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
                html_j = $('<div id="html_i" style="width: 200px; height: 100.0%; align: center;">' +
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
                // console.log('면적:', cn1, '제곱미터');
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
                $("#"+academy_img+"").attr("src", "/static/images/"+data.result2['shop_img_'+i]+"");
                document.getElementById(bizesNm).innerHTML = data.result2['bizesNm_'+i];
                document.getElementById(indsSclsNm).innerHTML = data.result2['indsSclsNm_'+i];
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


function building_toggle(bjdong_cd){
    var marker_i;
    var cu_icon;
    var c;

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
        url: '/map_info/building_info',
        data: JSON.stringify(postdata),
        dataType: 'JSON',
        contentType: "application/json",
        success: function (data) {
            c = data.result2['id_counter'];
            // alert("공공주택 개수 = "+c);
            // building_dictObject = {};
            if (sh_R == false){
                for (var i = 1; i <= c; i++) {
                    // marker_i = L.marker([data.result2['lat_'+i], data.result2['lon_'+i]], {}).addTo(building_layerGroup);
                    marker_i = L.marker([data.result2['lat_' + i], data.result2['lon_' + i]], {});
                    building_markers.addLayer(marker_i);
                    // map.addLayer(building_markers);

                    cu_icon = L.icon({
                        iconUrl: '../static/icons/building/' + data.result2['mainPurpsCd_' + i] + '.png',
                        iconSize: [16, 16],
                        popupAnchor: [0, -10]
                    });
                    marker_i.setIcon(cu_icon);
                    marker_i.bindTooltip('<div>' + data.result2['bldNm_' + i] + '<br>' + data.result2['dongnm_' + i] + '<br>' + data.result2['hhldCnt_' + i] + '세대</div>', {"sticky": true});
                    // building_dictObject[i+"_"+data.result2['bldNm_' + i]+"_"+data.result2['dongnm_' + i]] = data.result2['hhldCnt_' + i]+" 세대, "+ data.result2['lat_' + i] +", "+ data.result2['lon_' + i];
                    document.getElementById('bjdong2').value = data.result2['bjdong2']
                }
                // alert(Object.keys(building_dictObject).length);
                // for (var key in building_dictObject) {
                //     console.log("key : " + key +", value : " + building_dictObject[key]);
                // }
            }
        },
        error: function (request, status, error) {
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
        ,timeout:100000 //"응답제한시간 ms"
    })
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
        url: '/map_info/academy_cal_polygon_front',
        data: JSON.stringify(postdata),
        dataType: 'JSON',
        contentType: "application/json",
        success: function (data) {
            academy_cnt = academy_cnt + data.post_cnt;
            $("#polygon-data-container").append(data.data_html);
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

function polygon_get_info(lat, lon, getLatLngs){
    var postdata = {
        'center_y':lat, 'center_x':lon
    }
    // console.log("polygon_get_info");
    $.ajax({
        type: 'POST',
        url: '/map_info/loc_info',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data){
            var new_bjdong = data.result2['bjdong_cd'];
            var new_bjdong_nm = data.result2['bjdong_nm'];

            // console.log(polygon_search_history);
            // console.log("체크1", data.result2['bjdong_nm']);
            // console.log("poly_R: ", poly_R);

            all_bjdong_cd = new_bjdong;
            // document.getElementById('polygon_bjdong_nm').append() = new_bjdong_nm + " 정보보기";
            // $("#polygon_bjdong_nm").append(new_bjdong_nm+" ");
            let polygon_bjdong_nm = document.getElementById('polygon_bjdong_nm');
            while(polygon_bjdong_nm.hasChildNodes()){ //자식 요소가 있는지 확인-false가 될때까지 반복
                polygon_bjdong_nm.removeChild(polygon_bjdong_nm.firstChild); // 첫번째 자식 요소를 삭제
            }
            let polygon_container = document.getElementById('polygon-data-container');
            while(polygon_container.hasChildNodes()){ //자식 요소가 있는지 확인-false가 될때까지 반복
                polygon_container.removeChild(polygon_container.firstChild); // 첫번째 자식 요소를 삭제
            }
            $("#polygon_bjdong_nm").append("선택한 지역의 학원");
            poly_R = p_check(new_bjdong);
            polygon_search_history.push(data.result2['bjdong_cd']);

            if (!poly_R ) {
                // console.log("체크2", data.result2['bjdong_nm']);
                get_polygon_info(data.result2['bjdong_cd'], getLatLngs);
            }
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
        mapElement.style.height = "50%";
        document.getElementById(imgElement).src = "/static/images/plus_zoom.png";
        document.getElementById(imgElement).setAttribute("id", "plusButton");
    } else if (imgElement == 'plusButton')
    {
        mapElement.style.height = "65%";
        document.getElementById(imgElement).src = "/static/images/minus_zoom.png";
        document.getElementById(imgElement).setAttribute("id", "minusButton");
    }
}

function show_map_Div(lat, lon) {
    document.getElementById("map").style.display = "";
    map.invalidateSize()
    map.setView([lat, lon], 18, {zoomControl: false});
}


function off_map_Div() {
    document.getElementById("map").style.display = "none";
}

function btn_call($href, lat, lon){
    layer_popup($href);
    show_map_Div(lat, lon);
}

// function show_map_Div(lat, lon, i) {
//     var imgElement= $('.map-toggle-'+i+'').attr('id');
//     if (imgElement == 'map_act_Button') {
//         document.getElementById(imgElement).src = "/static/images/toggle_02.png";
//         document.getElementById(imgElement).setAttribute("id", "map_off_Button");
//         document.getElementById("map").style.display = "";
//         map.invalidateSize()
//         map.setView([lat, lon], 18, {zoomControl: false});
//
//     } else if (imgElement == 'map_off_Button')
//     {
//         document.getElementById(imgElement).src = "/static/images/toggle_01.png";
//         document.getElementById(imgElement).setAttribute("id", "map_act_Button");
//         document.getElementById("map").style.display = "none";
//     }
// }

function pic(e, idx) {
    var unlike = "unlike_"+idx;
    var like = "like_"+idx;
    var imgElement= $(e).attr('id');
    var like_status;
    var gubun_01 = "01";
    if (imgElement == like) {
        document.getElementById(imgElement).src = "/static/images/like_02.png";
        document.getElementById(imgElement).setAttribute("id", unlike);
        like_status = 1;
    } else if (imgElement == unlike)
    {
        document.getElementById(imgElement).src = "/static/images/like_01.png";
        document.getElementById(imgElement).setAttribute("id", like);
        like_status = 0;
    }
    var postdata = {
        'zone_idx':idx, 'like_status':like_status, 'gubun_01': gubun_01
    }
    $.ajax({
        type: 'POST',
        url: '/member_activity/zone_like',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(){
            if (like_status == 1){
                alert("좋아요!");
            }
        },
        error: function(request, status, error){
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    })
}

function go_rate(item) {
    location.href="/edu_info/academy_info_detail?id="+item+"&review_state=1";
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

// var currentPage = 1;
// var isLoading = false;
//
// function loadPosts() {
//     if (isLoading) return;
//     isLoading = true;
//     $.ajax({
//         url: '/edu_info/academy_info_list_ajax?page=' + currentPage,
//         method: 'GET',
//         success: function (data) {
//             var posts = data.posts;
//             if (posts.length > 0) {
//                 var postList = $('#postList');
//                 posts.forEach(function (post) {
//                     // postList.append('<p>' + post.title + '</p>');
//                     postList.append('<p>' + post[1] + '</p>');
//                         // '<div className="col-lg-4 col-md-6">' +
//                         //     '<div className="product-card mb-4">' +
//                         //         '<div className="image-holder">' +
//                         //             '<a href="/edu_info/academy_info_detail?'+id=post[0]+'">' +
//                         //                 '<img src="/static/images/"'+post[9]+' alt="product-item" className="img-fluid">' +
//                         //             '</a>' +
//                         //         '</div>' +
//                         //         '<div className="card-detail text-center pt-3 pb-2">' +
//                         //             '<h5 className="card-title fs-4 text-uppercase m-0">' +
//                         //             '<a href="/edu_info/academy_info_detail?"'+id=post[0]+'>'+post[1]+'</a>' +
//                         //             '</h5>' +
//                         //             '<span className="item-price text-primary fs-4">'+post[6]+'</span>' +
//                         //             '<div className="cart-button mt-1">' +
//                         //                 '<a href="#" className="btn">Add to cart</a>' +
//                         //             '</div>' +
//                         //         '</div>' +
//                         //     '</div>' +
//                         // '</div>'
//                     // );
//                 });
//
//                 currentPage += 1;
//             }
//             isLoading = false;
//         },
//         error: function (error) {
//             isLoading = false;
//         }
//     });
// }
// ajax 게시판인지만... 아래것은 우선 안쓰는 걸로
// $(document).ready(function () {
//     loadPosts();
//
//     $('#loadMore').on('click', function () {
//         loadPosts();
//     });
//
//     // Optional: Implement a scroll-based loading mechanism
//     $(window).on('scroll', function () {
//         if ($(window).scrollTop() + $(window).height() >= $(document).height() - 100) {
//             loadPosts();
//         }
//     });
// });


$('#search_btn').click(function(){
    var sido = $('#sido option:selected').val();
    var sigungun = $('#sigugun option:selected').val();
    var bjdong = $('#dong option:selected').val();
    var school_type = $('#school option:selected').val();
    var subject_type = $('#subject option:selected').val();
    var search = $('#search_txt').val();

    if (sido == "" || sigugun == "" || dong == "") {
        alert("행정구역을 선택하세요.");
    }else {
        location.href = "/edu_info/academy_info_list?search_type=1&sido=" + sido + "&sigungun=" + sigungun + "&bjdong=" + bjdong +
            "&school_type=" + school_type + "&subject_type=" + subject_type + "&search=" + search + "";
    }
});

function search_do(){
    var sido = $('#sido option:selected').val();
    var sigungun = $('#sigugun option:selected').val();
    var bjdong = $('#dong option:selected').val();
    var school_type = $('#school option:selected').val();
    var subject_type = $('#subject option:selected').val();
    var search = $('#search_txt').val();

    // console.log("왜 안넘어오는걸까?"+sido+sigungun+bjdong+school_type+subject_type+search);

    if (sido == "" || sigugun == "" || dong == "") {
        alert("행정구역을 선택하세요.");
    }else {
        location.href = "/edu_info/academy_info_list?search_type=1&sido=" + sido + "&sigungun=" + sigungun + "&bjdong=" + bjdong +
            "&school_type=" + school_type + "&subject_type=" + subject_type + "&search=" + search + "";
    }
}

const mySchool = document.getElementById('school_01');
const mySubject = document.getElementById('subject_01');

var current_page;
// AJAX request to load paginated data
function loadPage(page, bjdong) {
    var school_type = $('#school option:selected').val();
    var subject_type = $('#subject option:selected').val();
    var search = $('#search_txt').val();
    $.ajax({
        url: '/edu_info/academy_info_list_ajax',
        type: 'GET',
        data: {page: page, bjdong: bjdong, school_type: school_type, subject_type: subject_type, search: search},
        success: function(response) {
            current_page = response.page;
            // Update the data container with the new data
            $('#data-container').html(response.data);
            // Update the pagination container with the new links
            // $('#pagination-container').html(response.pagination);
            // $('#paging_info').html(' 총 '+response.total+'개의 결과 중 '+response.page+'페이지');
            $('#paging_info').html(response.total+'개 /');
            // if (response.post_cnt < 9) {
            //     $("#load-more").remove();
            // }
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
};

mySchool.addEventListener('change', function() {
    var school_type = $('#school_01 option:selected').val();
    var subject_type = $('#subject_01 option:selected').val();
    var search = "";
    var page = 1;
    var bjdong = all_bjdong_cd;
    $.ajax({
        url: '/edu_info/academy_info_list_ajax',
        type: 'GET',
        data: {page: page, bjdong: bjdong, school_type: school_type, subject_type: subject_type, search: search},
        success: function(response) {
            current_page = response.page;
            // Update the data container with the new data
            $('#data-container').html(response.data);
            // Update the pagination container with the new links
            // $('#pagination-container').html(response.pagination);
            // $('#paging_info').html(' 총 '+response.total+'개의 결과 중 '+response.page+'페이지');
            $('#paging_info').html(response.total+'개 /');
            // if (response.post_cnt < 9) {
            //     $("#load-more").remove();
            // }
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
});

mySubject.addEventListener('change', function() {
    var school_type = $('#school_01 option:selected').val();
    var subject_type = $('#subject_01 option:selected').val();
    var search = "";
    var page = 1;
    var bjdong = all_bjdong_cd;
    $.ajax({
        url: '/edu_info/academy_info_list_ajax',
        type: 'GET',
        data: {page: page, bjdong: bjdong, school_type: school_type, subject_type: subject_type, search: search},
        success: function(response) {
            current_page = response.page;
            // Update the data container with the new data
            $('#data-container').html(response.data);
            // Update the pagination container with the new links
            // $('#pagination-container').html(response.pagination);
            // $('#paging_info').html(' 총 '+response.total+'개의 결과 중 '+response.page+'페이지');
            $('#paging_info').html(response.total+'개 /');
            // if (response.post_cnt < 9) {
            //     $("#load-more").remove();
            // }
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
});

function set_map(lat, lon){
    map.setView([lat, lon], 18, {zoomControl: false});
}

function loadPage_more(page, bjdong) {
    var school_type = $('#school_01 option:selected').val();
    var subject_type = $('#subject_01 option:selected').val();
    if (school_type == "0"){
        var school_type = $('#school option:selected').val();
    }
    if (subject_type == "0"){
        var subject_type = $('#subject option:selected').val();
    }
    var search = $('#search_txt').val();
    $.ajax({
        url: '/edu_info/academy_info_list_ajax',
        type: 'GET',
        data: {page: page, bjdong: bjdong, school_type: school_type, subject_type: subject_type, search: search},
        success: function(response) {
            current_page = response.page;
            // Update the data container with the new data
            $("#data-container").append(response.data);
            // Update the pagination container with the new links
            // $('#pagination-container').html(response.pagination);
            $("#paging_info").html("총 "+response.total+"개의 결과 중 "+response.page+"페이지");
            // console.log(response.post_cnt)
            if (response.post_cnt < 9) {
                // $("#load-more").remove();
                $("#data-container").append("" +
                    "   <div align='center'>" +
                    "      <h5 class='card-title fs-4 text-uppercase m-0'>더 이상 등록된 학원이 없습니다.</h5>" +
                    "   </div>");
            }
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
};


// Load more items when the "Load More" button is clicked
$('#load-more').click(function() {
    loadPage_more(current_page+1, all_bjdong_cd);
});

map.on("mouseup", function(e){
    center = map.getCenter();
    center_y = center.lat;
    center_x = center.lng;
    var school_type = $('#school option:selected').val();
    var subject_type = $('#subject option:selected').val();
    var search = $('#search_txt').val();
    var search_type = $('#search_type').val();
    var postdata = {
        'center_y':center_y, 'center_x':center_x
    }
    $.ajax({
        type: 'POST',
        url: '/map_info/loc_info',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data){
            // alert(data.result2['sido_cd']);
            sido_cd = data.result2['sido_cd'];
            var new_bjdong = data.result2['bjdong_cd'];
            var new_bjdong_nm = data.result2['bjdong_nm'];
            document.getElementById('new_bjdong_nm').innerHTML= new_bjdong_nm;
            all_bjdong_cd = new_bjdong;
            b_check(new_bjdong);
            if (sh_R == false) {
                bjdong_area(data.result2['bjdong_cd']);
                // kinder_toggle(data.result2['bjdong_cd']);
                // el_toggle(data.result2['bjdong_cd']);
                // mi_toggle(data.result2['bjdong_cd']);
                // hi_toggle(data.result2['bjdong_cd']);
                // ed_toggle(data.result2['bjdong_cd']);
                academy_toggle(data.result2['bjdong_cd'], school_type, subject_type, search);
                // if (search_type != "1"){
                //     shop_toggle(data.result2['bjdong_cd']);
                // }
                // platon_toggle(data.result2['bjdong_cd'])
                // platon_custom_toggle(data.result2['bjdong_cd']);
                // singi_custom_toggle(data.result2['bjdong_cd']);
                // platon_stop_custom_toggle(data.result2['bjdong_cd']);
                // singi_stop_custom_toggle(data.result2['bjdong_cd']);
                // asobi_toggle(data.result2['bjdong_cd']);
                // building_toggle(data.result2['bjdong_cd']);
                // pup_cnt(data.result2['bjdong_cd']);
            }
            select_set_value(sido_cd, data.result2['bjdong_cd']);
            // location.href="/edu_info/academy_info_list?bjdong2="+data.result2['bjdong_cd'];
            // academy_best_info(data.result2['bjdong_cd'], new_bjdong_nm);
            // loadPosts();
            // console.log(data.result2['bjdong_cd']);
            loadPage(1, data.result2['bjdong_cd']);
        },
        error: function(request, status, error){
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    })
});

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

    // L.marker(e.latlng).addTo(myloc_layerGroup)
    // .bindPopup("약 " + radius.toFixed(1) + " 미터 이내").openPopup();

    L.marker(e.latlng).addTo(myloc_layerGroup);
    // L.circle(e.latlng, radius, {}).add(myloc_layerGroup);
    L.circle(e.latlng, radius, {"bubblingMouseEvents": true, "color": "skyblue",
        "dashArray": null, "dashOffset": null,
        "fill": true, "fillColor": "skyblue",
        "fillOpacity": 0.2, "fillRule": "evenodd",
        "lineCap": "round", "lineJoin": "round",
        "opacity": 1.0, "radius": 500,
        "stroke": true, "weight": 3}).addTo(myloc_layerGroup);
    // console.log(e.latlng);
    // hotzone_polygon_info(e.latlng);
    map.setView(e.latlng, 17);
    polygon_inside(e.latlng, hot_zone);
    // polygon_test(point, polygon);
}

map.on('locationfound', onLocationFound);

function onLocationError(e) {
    alert(e.message);
}

map.on('locationerror', onLocationError);

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
    // overlays :  {
    //     "법정동 경계" : choropleth_b,
    //     // "유아(유치원)" : kinder_layerGroup,
    //     // "초등학교" : el_layerGroup,
    //     // "중학교" : mi_layerGroup,
    //     // "고등학교" : hi_layerGroup,
    //     "학원/교습소" : edu_markers
    //     // "소상공인" : shop_markers
    // },
// };

// var drawnItems = L.featureGroup()

// layer_control= L.control.layers(
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
    if (type === 'circle') {
        console.log(layer.getLatLng());
        console.log(layer.getRadius());
    }

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
        var latlngs_cnt = getLatLngs[0].length;
        academy_cnt = 0;
        polygon_search_history = new Array();
        for( var i=0; i< latlngs_cnt; i++){
            var draw_start= getLatLngs[0][i];
            var lat = draw_start.lat;
            var lon = draw_start.lng;
            polygon_get_info(lat, lon, getLatLngs);
        }
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
        var latlngs_cnt = getLatLngs[0].length;
        academy_cnt = 0;
        polygon_search_history = new Array();
        for( var i=0; i< latlngs_cnt; i++){
            // console.log("i: "+i);
            var draw_start= getLatLngs[0][i];
            var lat = draw_start.lat;
            var lon = draw_start.lng;
            polygon_get_info(lat, lon, getLatLngs);
        }
        map.setView([lat, lon], 16, {zoomControl: false});

        // 폴리곤의 좌표 배열은 getLatLngs() 메서드를 사용합니다.
        // 폴리곤이 닫힌 형태이므로, 첫번째 배열 요소 [0]을 사용합니다.
        // L.GeometryUtil.geodesicArea() 함수는 기본적으로 미터 단위의 면적을 반환합니다.
        // 면적을 원하는 형식으로 변환하여 출력하거나 다른 작업을 수행할 수 있습니다.
        var area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
        var n1 = area.toFixed();
        var cn1 = n1.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        // console.log('면적:', cn1, '제곱미터');
        var pyong = Math.ceil(n1 * 0.3025);
        var pyong1 = pyong.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        layer.bindTooltip("<span> 약 "+cn1+" m<sup>2</sup> (약 "+pyong1+" 평)</span>");
    }drawnItems.addLayer(layer);
});

function myloc_start(){
    map.locate();
}

// 현재 위치에 대한 법정동 정보 알아오기
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
            var new_sido_cd = data.result2['sido_cd'];
            all_bjdong_cd = new_bjdong;
            bjdong_cd = new_bjdong;
            sido_cd = new_sido_cd;


        },
        error: function(request, status, error){
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    })
};

// 위치 허용 안된 사람에 대해서 등록된 법정동 위치 정보
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
        },
        error: function(request, status, error){
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    })
}

function onLocationFound(e) {
    bjdong_get_info(e.latlng);
}
function onLocationError(e) {
    bjdong_loc_n_info();
}

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

function login_mov(){
    alert("로그인이 필요합니다.");
    location.href="/login";
}