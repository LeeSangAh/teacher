var user_email = localStorage.getItem("user_email");
var user_idx = localStorage.getItem("user_idx");
var user_thumbnail = localStorage.getItem("user_thumbnail");
var nick_name = localStorage.getItem("nick_name");
var member_type = localStorage.getItem("member_type");
var bjdong_cd_01 = localStorage.getItem("bjdong_cd_01");
var bjdong_cd_01_nm = localStorage.getItem("bjdong_cd_01_nm");
var bjdong_cd_02 = localStorage.getItem("bjdong_cd_02");
var bjdong_cd_02_nm = localStorage.getItem("bjdong_cd_02_nm");
var bjdong_cd_03 = localStorage.getItem("bjdong_cd_03");
var bjdong_cd_03_nm = localStorage.getItem("bjdong_cd_03_nm");
var select_bjdong = localStorage.getItem("select_bjdong");
var create_type = localStorage.getItem("create_type");
var belong_idx = localStorage.getItem("belong_idx");
var bjdong_cd;

let today = new Date();

let year = today.getFullYear(); // 년도
let month = today.getMonth() + 1;  // 월
let date = today.getDate();  // 날짜
let day = today.getDay();  // 요일
let hours = today.getHours(); // 시
let minutes = today.getMinutes();  // 분
let seconds = today.getSeconds();  // 초
let milliseconds = today.getMilliseconds(); // 밀리초

// if (select_bjdong == "1"){
//     bjdong_cd = localStorage.getItem("bjdong_cd_01")
// }else if (select_bjdong == "2"){
//     bjdong_cd = localStorage.getItem("bjdong_cd_02")
// }else if (select_bjdong == "3") {
//     bjdong_cd = localStorage.getItem("bjdong_cd_03")
// };
//
// $(document).ready(function(){
//     $('#LocItemSelectBox_Item1').hide();
//     $('#LocItemSelectBox_Item2').hide();
//     $('#LocItemSelectBox_Item3').hide();
//     if (bjdong_cd_01 != "" && bjdong_cd_01 != "None"){
//         $('#LocItemSelectBox_Item1').show();
//         // document.getElementById("LocItemSelectBox_Item1").value = 1;
//         document.getElementById("LocItemSelectBox_Item1").text = bjdong_cd_01_nm;
//     }
//     if (bjdong_cd_02 != "" && bjdong_cd_02 != "None") {
//         $('#LocItemSelectBox_Item2').show();
//         // document.getElementById("LocItemSelectBox_Item2").value = 2;
//         document.getElementById("LocItemSelectBox_Item2").text = bjdong_cd_02_nm;
//     }
//     if (bjdong_cd_03 != "" && bjdong_cd_03 != "None") {
//         $('#LocItemSelectBox_Item3').show();
//         // document.getElementById("LocItemSelectBox_Item3").value = 3;
//         document.getElementById("LocItemSelectBox_Item3").text = bjdong_cd_03_nm;
//     }
//     // if (bjdong_cd_01 != "" || bjdong_cd_02 != "" || bjdong_cd_03 != ""){
//     //     $('#LocItemSelectBox_Item4').show();
//     //     document.getElementById("LocItemSelectBox_Item4").value = 4;
//     //     document.getElementById("LocItemSelectBox_Item4").text = "동네 설정";
//     // }else if (bjdong_cd_01 != "" && bjdong_cd_02 != "" && bjdong_cd_03 != ""){
//     //     $('#LocItemSelectBox_Item4').hide();
//     // }
//     $('#LocItemSelectBox').val(select_bjdong).prop("selected",true);
// });

// ================== 새로운 알림 ====================

function new_alert(){
    var postdata = {
        'user_idx': user_idx
    }
    $.ajax({
        type: 'POST',
        url: '/member_info/new_alert',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data) {
            if (data.new_alert_status == 1){
                // alert("새로운 알림이 있다.");
                $('#new_alert').attr("src", "/static/images/main_alert_new_02.png");
            }
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
}

function alert_list(){
    var postdata = {
        'user_idx': user_idx
    }
    $.ajax({
        type: 'POST',
        url: '/member_info/alert_center_list',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data) {
            var c = data.result2['id_counter'];
            if (c==0){
                var html_list =
                    '<div class = "col-lg-4 col-md-6" >'+
                    '<div class = "product-card mb-4" >'+
                    '<p>검색 결과가 없습니다.</p>'+
                    '</div>'+
                    '</div>'
                $("#alert_list").append(html_list);
            }else{
                for (var i = 1; i <= c; i++) {
                    var alert_idx = data.result2["idx_"+i];
                    var user_id_from = data.result2["user_id_from_"+i];
                    var user_id_to = data.result2["user_id_to_"+i];
                    var method_nm = data.result2["method_nm_"+i];
                    var descript = data.result2["descript_"+i];
                    var confirm_yn = data.result2["confirm_yn_" + i];
                    var alert_type = data.result2["alert_type_" + i];
                    var insert_date = data.result2["insert_date_" + i];
                    var alert_type_dec = ''
                    var confirm_yn_dec = ''
                    if (alert_type == 1){
                        alert_type_dec = '부모 신청'
                    }else if(alert_type == 2){
                        alert_type_dec = '친구 신청'
                    }
                    if (confirm_yn == 0){
                        confirm_yn_dec = '미확인'
                    }else{
                        confirm_yn_dec = '확인'
                    }
                    var html_list = '<div style="margin-bottom: 20px;">' +
                        '<div style="margin-bottom: 5px; display: flex; height: 40px; background-color: #4c6079; border-radius: 5px 5px 5px 5px;" onclick="alert_read('+alert_idx+', \''+user_id_from+'\', \''+method_nm+'\', \''+descript+'\', '+alert_type+', \''+insert_date+'\', '+confirm_yn+')">'+
                        '<div style="width: 70%; margin-left: 10px; margin-top:10px; "><li style="color: #fff3cd;">'+alert_type_dec+'</li></div>' +
                        '<div style="width: 30%; text-align: right; margin-right: 20px; margin-top: 10px;"><p id="conf_'+alert_idx+'" style="font-size: 12px;">'+confirm_yn_dec+'</p></div>'+
                        '</div>'+
                        '<div id="conf_read_'+alert_idx+'" style="border-radius: 5px 5px 5px 5px;""></div>' +
                        '</div>'
                    $("#alert_list").append(html_list);
                }
            }
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
}

var alert_click_count = 0;

function alert_read(alert_idx, user_id_from, method_nm, descript, alert_type, insert_date, confirm_yn) {
    var postdata = {
        'alert_idx': alert_idx, 'confirm_yn': confirm_yn
    }
    if (alert_click_count == 0){
        $.ajax({
            type: 'POST',
            url: '/member_info/alert_center_read',
            data: JSON.stringify(postdata),
            dataType: 'JSON',
            contentType: "application/json",
            success: function (data) {
                $('#conf_'+alert_idx).text('확인');
                if (alert_type==1){
                    $.ajax({
                        type: 'POST',
                        url: '/member_info/child_confirm_yn',
                        data: JSON.stringify(postdata),
                        dataType: 'JSON',
                        contentType: "application/json",
                        success: function (data) {

                            if (data.new_alert_status > 0){
                                var html = '<div style="margin-bottom: 10px; background-color: #4c6079; border-radius: 5px 5px 5px 5px;">' +
                                    '<div style="margin-left: 10px; margin-right: 10px;">' +
                                    '<p style="font-size: 12px;"><span style="color: #fff3cd;">'+user_id_from+'</span> 님으로부터 부모 신청이 도착하였습니다. 확인하시겠습니까?</p>'+
                                    '</div>' +
                                    '<div id="parents_confirm_yn" style="text-align: center;">'+
                                    '<button class="common-button" style="width: 70px; border-radius: 5px 5px 5px 5px;" id="confirm" name="commit" onClick="child_confirm_read_ok(\''+user_id_from+'\');">수락</button>'+
                                    '<button class="common-button" style="width: 70px; border-radius: 5px 5px 5px 5px;" id="confirm" name="commit" onClick="child_confirm_read_reject(\''+user_id_from+'\');">거절</button>'+
                                    '</div>'+
                                    '</div>'
                                $('#conf_read_'+alert_idx).append(html);
                            }else{
                                var html = '<div style="margin-bottom: 10px;">' +
                                    '<div style="margin-left: 10px; margin-right: 10px; height: 40px;">' +
                                    '<p style="font-size: 12px; margin-top: 20px;">이미 수락 하셨습니다.</p>'+
                                    '</div>'
                                '</div>'

                                $('#conf_read_'+alert_idx).append(html);
                            }
                        },
                        error: function (xhr) {
                            console.log('Error occurred while fetching data.');
                        }
                    });
                }
            },
            error: function (xhr) {
                console.log('Error occurred while fetching data.');
            }
        });
        alert_click_count +=1;
    }
}

function child_confirm_read_ok(user_id_from){
    var postdata = {
        'user_id_from': user_id_from,
        'user_idx': user_idx
    }
    $.ajax({
        type: 'POST',
        url: '/member_info/child_confirm_read_ok',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data) {
            alert("부모 매칭이 되었습니다.");
            index_page_type();
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
}

function child_confirm_read_reject(user_id_from){
    var postdata = {
        'user_id_from': user_id_from,
        'user_idx': user_idx
    }
    $.ajax({
        type: 'POST',
        url: '/member_info/child_confirm_read_reject',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data) {
            alert("부모 매칭을 거절하셨습니다. \n알림 센터에서 다시 확인하실 수 있습니다.");
            index_page_type();
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
}


function menu_home(){
    index_page_type();
}

function menu_myhome(){
    location.href="/member_activity/myhome";
}

function index_page_type(){
    if (create_type == "1"){
        $.ajax({
            type: "POST",
            url: '/kakao/kko_callback',
            dataType : 'JSON',
            contentType: false,
            cache:  false,
            processData: false,
            success: function(data) {
                location.href=data.kakao_oauth_url;
            },
            error: function(xhr) {
                console.log('Error occurred while fetching data.');
            }
        });
    }else if(create_type == "2"){
        $.ajax({
            type: "POST",
            url: '/naver/naver_callback',
            dataType : 'JSON',
            contentType: false,
            cache:  false,
            processData: false,
            success: function(data) {
                location.href=data.naver_oauth_url;
            },
            error: function(xhr) {
                console.log('Error occurred while fetching data.');
            }
        });
    }
};

function loc_change(){
    var LocItemSelectBox  = document.getElementById("LocItemSelectBox");
    // var LocItemSelect_num = (LocItemSelectBox.options[LocItemSelectBox.selectedIndex].value);
    var LocItemSelect_num = document.getElementById("LocItemSelectBox").value;

    console.log('LocItemSelect_num', LocItemSelect_num);

    var postdata = {
        'LocItemSelect_num' : LocItemSelect_num
    }
    if (LocItemSelect_num != 4){
        $.ajax({
            type: 'POST',
            url: '/member_info/bjdong_select',
            data: JSON.stringify(postdata),
            dataType : 'JSON',
            contentType: "application/json",
            success: function(data) {
                // localStorage.setItem("select_bjdong", data.result2["select_bjdong"]);
                // localStorage.setItem("bjdong_cd_01", data.result2["bjdong_cd_01"]);
                // localStorage.setItem("bjdong_cd_01_nm", data.result2["bjdong_cd_01_nm"]);
                // localStorage.setItem("bjdong_cd_02", data.result2["bjdong_cd_02"]);
                // localStorage.setItem("bjdong_cd_02_nm", data.result2["bjdong_cd_02_nm"]);
                // localStorage.setItem("bjdong_cd_03", data.result2["bjdong_cd_03"] );
                // localStorage.setItem("bjdong_cd_03_nm", data.result2["bjdong_cd_03_nm"]);
                index_page_type();
            },
            error: function(xhr) {
                console.log('Error occurred while fetching data.');
            }
        });
    }else{
        alert("지역 설정으로 이동합니다.");
        location.href="/member_info/user_loc_add";
    }
}

function get_now_date(get_type){
    let today = new Date();

    let year = today.getFullYear(); // 년도
    let month = today.getMonth() + 1;  // 월
    let date = today.getDate();  // 날짜
    let day = today.getDay();  // 요일
    let weeday = ['일', '월', '화', '수', '목', '금', '토'];
    day = weeday[day];
    let hours = today.getHours(); // 시
    let minutes = today.getMinutes();  // 분
    let seconds = today.getSeconds();  // 초
    let milliseconds = today.getMilliseconds(); // 밀리초
    let get_now_date_result;
    if (get_type === 1){
        get_now_date_result = year+'년 '+month+'월 '+date+'일 '+day+'요일'
    }else if(get_type === 2){
        get_now_date_result = year+'년 '+month+'월 '+date+'일 '+day+'요일'+' '+hours+':'+minutes+':'+seconds
    }else if(get_type ===3){
        get_now_date_result = hours+':'+minutes+':'+seconds
    }
    return get_now_date_result
};

function remove_str(all_text, target_text, type){
    // 1: 특정문자 제거, 2. 개행제거, 3. 앞뒤공백제거, 4. 특수문자 모두 제거, 5. 숫자 제거, 6. 모두 제거
    console.log(all_text, target_text, type);
    var replaced_str = '';
    if (type=='1'){
        replaced_str = all_text.replace(target_text, '');
    }else if(type=='2'){
        replaced_str = all_text.replace(/\n/g, '');
    }else if(type=='3'){
        replaced_str = all_text.replace(/^\s+|\s+$/g, '');
    }else if(type=='4'){
        const reg = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
        replaced_str = all_text.replace(reg,'');
    }else if(type=='5'){
        replaced_str = all_text.replace(/[0-9]/g,'');
    }else{
        replaced_str = all_text.replace(target_text, '');
        replaced_str = replaced_str.replace(/\n/g, '');
        replaced_str = replaced_str.replace(/^\s+|\s+$/g, '');
        const reg2 = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
        replaced_str = replaced_str.replace(reg2,'');
        replaced_str = replaced_str.replace(/[0-9]/g,'')
    };
    return replaced_str
};

function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
};

function getDayOfWeek(yyyyMMdd){
    const week = ['일', '월', '화', '수', '목', '금', '토'];
    const dayOfWeek = week[new Date(yyyyMMdd).getDay()];

    return dayOfWeek;
}