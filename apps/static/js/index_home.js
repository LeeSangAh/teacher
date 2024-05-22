var map;
var sido_cd;
var bjdong_cd;
var bjdong_nm;
var user_loc_lat;
var user_loc_lon;
var user_loc;
var select_bjdong;

$('#type_select_01').click(function (){
    location.href="/oauth_teacher";
});

$('#type_select_02').click(function (){
    location.href="/oauth_teacher_normal";
});

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



function myloc_start(){
    map.locate();
}

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
                    $layerPopup.style.display = 'none';
                    $.ajax({
                        type: 'POST',
                        url: '/member_info/user_loc',
                        contentType: "application/json",
                        success: function(data){
                            select_bjdong = data.select_bjdong;
                            user_loc_lat = data.loc_lat;
                            user_loc_lon = data.loc_lon;
                            sido_cd= data.sido_cd;
                            bjdong_nm = data.emd;
                            $('#bjdong_nm').empty();
                            $('#bjdong_nm').append("지역: "+bjdong_nm);
                            if (select_bjdong == '1'){
                                $('#bjdong_nm').append("( 집)");
                            }else if (select_bjdong == '2'){
                                $('#bjdong_nm').append("( 회사)");
                            }else if (select_bjdong == '3'){
                                $('#bjdong_nm').append("( 기타)");
                            }
                        },
                        error: function(request, status, error){
                            alert('데이터를 가지고 오는데 실패했습니다.')
                            alert(error);
                        }
                    })
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
            bjdong_cd = data.result2['bjdong_cd'];
            bjdong_nm = data.result2['bjdong_nm'];
            sido_cd = data.result2['sido_cd'];
            // console.log("사용자 위치", bjdong_cd, bjdong_nm, sido_cd);

            document.getElementById('bjdong_nm').innerText = "현재 위치 "+bjdong_nm+" 근처" ;
            // document.getElementById('bjdong_nm2').innerText = bjdong_nm+" 근처" ;
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

function onLocationFound(e) {
    user_loc = 'Y';
    document.getElementById('loc_select').style.display = 'none';
    var todaypop = getCookie("todaypopup");
    bjdong_get_info(e.latlng);
    $('#loc_type_comment').empty();
    $('#loc_type_comment').append('현재 위치를 관심 지역으로 등록하실래요?');
    /***
    if (todaypop=='Y'){
        document.querySelector('.pop-layer2').style.display = 'none';
    }else{
        member_layer_call('#info_open_div');
    }***/
}

function onLocationError(e) {
    user_loc = 'N';
    $.ajax({
        type: 'POST',
        url: '/member_info/user_loc',
        contentType: "application/json",
        success: function(data){
            select_bjdong = data.select_bjdong;
            user_loc_lat = data.loc_lat;
            user_loc_lon = data.loc_lon;
            sido_cd= data.sido_cd;
            bjdong_nm = data.emd;
            bjdong_cd = data.bjdong_cd;
            $('#bjdong_nm').append("지역: "+bjdong_nm);
            if (select_bjdong == '1'){
                $('#bjdong_nm').append(" (집)");
            }else if (select_bjdong == '2'){
                $('#bjdong_nm').append(" (회사)");
            }else if (select_bjdong == '3'){
                $('#bjdong_nm').append(" (기타)");
            }
            console.log(user_loc_lat, user_loc_lon, sido_cd);
            if (user_loc_lat == '' || user_loc_lat == null){
                if (confirm("사용자의 위치 확인이 거부되었습니다. \n수동으로 위치를 설정하시겠습니까?") == true){
                    member_layer_call('#info_open_div');
                }else{
                    location.href="/login";
                }
            }
        },
        error: function(request, status, error){
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    })
}

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

//=============== 오늘 다시 보지 않기 팝업 처리 ======================
var $layerPopup = document.querySelector('.pop-layer2');
var $btnLayerPopupClose = document.querySelector('.pop-layer2 .btn-layerClose2');
var $btnLayerPopupTodayHide = document.querySelector('.pop-layer2 .btnTodayHide');

//최초 레이어팝업 노출
// layerPopupShow();

//레이어팝업 닫기 버튼 클릭
$btnLayerPopupClose.addEventListener('click', function(){
    layerPopupHide(0);
});

//레이어팝업 오늘 하루 보지 않기 버튼 클릭
$btnLayerPopupTodayHide.addEventListener('click', function(){
    layerPopupHide(1);
});

//레이어팝업 노출
// function layerPopupShow(){
//     $layerPopup.style.display = 'block'
// }
//레이어팝업 비노출
function layerPopupHide(state){
    $layerPopup.style.display = 'none'
    if(state === 1){
        setCookie( "todaypopup", "Y" , 1 );
        //cookie처리
        //'testCookie' 이름의 쿠키가 있는지 체크한다.

        /**
        if($.cookie('todaypopup') == undefined){
            //쿠키가 없는 경우 testCookie 쿠키를 추가
            $.cookie('todaypopup', 'Y', { expires: 1, path: '/' });
             설명 :
             임의로 testCookie라는 이름에 Y라는 값을 넣어주었고,
             expires값으로 1을 주어 1일 후 쿠키가 삭제되도록 하였다.
             path값을 '/'로 주면 해당사이트 모든페이지에서 유효한 쿠키를 생성한다.
             특정페이지에서만 작동하려면 페이지 경로를 작성하면 된다.

        }    **/
    }
}
// ============== 오늘 다시 보지 않기 팝업 끝 ===============

// ============== 쿠키 생성 ==============================
function setCookie( name, value, exDay ) {
    var todayDate = new Date();
    todayDate.setDate( todayDate.getDate() + exDay );
    document.cookie = name + "=" + escape( value ) + "; path=/; expires=" + todayDate.toGMTString() + ";"
}

// 쿠키 가져오기 함수
function getCookie(cName) {
    cName = cName + '=';
    var cookieData = document.cookie;
    var start = cookieData.indexOf(cName);
    var cValue = '';
    if(start != -1){
        start += cName.length;
        var end = cookieData.indexOf(';', start);
        if(end == -1)end = cookieData.length;
        cValue = cookieData.substring(start, end);
    }
    return unescape(cValue);
}