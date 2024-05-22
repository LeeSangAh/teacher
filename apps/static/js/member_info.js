
function login_Proc(){
    var id_= document.getElementById('id_').value
    var pw_= document.getElementById('pw_').value
    var sess_yn_= document.getElementById('sess_yn_').value

    if (id_ == ""){
        alert("아이디를 입력해주세요.");
    }else if (pw_ == ""){
        alert("패스워드를 입력해주세요.");
    }else {
        const form_data = new FormData();
        form_data.append('id_', id_);
        form_data.append('pw_', pw_);
        form_data.append('sess_yn_', sess_yn_);

        console.log(form_data.get['sess_yn_'])

        $.ajax({
            type: "POST",
            url: '/member_info/login_proc',
            data: form_data,
            dataType : 'JSON',
            contentType: false,
            cache:  false,
            processData: false,
            success: function(data) {
                location.href="/map_info/results?lat="+data.lat+"&lon="+data.lon+"&bjdong_cd="+data.bjdong_cd+"&bjdong_nm="+data.emd+"&sido_cd="+data.sido_cd
                // location.href="/edu_info/academy_info_list"
                location.href="/index"
            },
            error: function(xhr) {
                console.log('Error occurred while fetching data.');
            }
        });
    }
}

function kakao_login_Proc(){

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
}

//
// function id_check(email){
//     const id = email
//     var postdata = {
//         'id_':id
//     }
//     if (id != ''){
//         $.ajax({
//             type: 'POST',
//             url: '/member_check',
//             data: JSON.stringify(postdata),
//             dataType : 'JSON',
//             contentType: "application/json",
//             success: function(data){
//                 var id_chk = data.result2['check_id'];
//                 if (id_chk == 0){
//                     alert ("사용 가능한 ID 입니다.");
//                 }
//                 else {
//                     alert ("이미 사용 중인 ID 입니다.");
//                 }
//             },
//             error: function(request, status, error){
//                 alert('데이터를 가지고 오는데 실패했습니다.')
//                 alert(error);
//             }
//         })
//     }else{
//         alert("ID를 입력하세요.");
//     }
// }
//
// function email_check(){
//     const email = document.getElementById('email').value;
//     var reg_email = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
//     if(!reg_email.test(email)) {
//         alert("이메일 형식을 확인해주세요.");
//         return false;
//     }
//     else {
//         return true;
//     }
// }
//
// function tel_check(){
//     const tel_num = document.getElementById('tel_num').value;
//     var reg_tel_num = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
//     if(!reg_tel_num.test(tel_num)) {
//         alert("휴대전화 양식을 확인해주세요.");
//         return false;
//     }
//     else {
//         return true;
//     }
// }
//
// isNull = function(object) {
//     try {
//         if (typeof object == "boolean"){
//             return false;
//         } else {
//             return (object == null || typeof object == "undefined" || object === "" || object == "undefined");
//         }
//
//     } catch (e) {
//         alert("isNull: " + object +"::"+ e.message);
//         WebSquare.exception.printStackTrace(e);
//     }
// };
//
// // 참고 URL
// // https://gongcha.tistory.com/38
// function getPwContent(key){
//     // const pw = document.getElementById('cre_pw').value;
//     var pwd = key;
//
//     var passed = validatePassword(pwd);
//
//     return passed;
// };
//
// function confirmContent(key){
//     const pw_first = document.getElementById('ch_new_pw').value;
//     const pw_second = key;
//     // console.log(pw_first, pw_second)
//     if (pw_first != pw_second) {
//         return "<p style='line-height:200%;'><span style='color:#E3691E; font-weight:bold;'>비밀번호 확인</span> : 비밀번호 불일치"
//             + "<br/>"
//             + "<span style='color:#999; font-weight:bold;'>입력한 비밀번호를 일치해주세요.</span></p>";
//     }else{
//         return "<p style='line-height:200%;'><span style='color:#E3691E; font-weight:bold;'>비밀번호 확인</span> : 비밀번호 일치"
//             + "<br/>"
//             + "<span style='color:#999; font-weight:bold;'>비밀번호가 일치합니다.</span></p>";
//     }
// }

// function tel_num_chk(key){
//     console.log(key)
//     if ( /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/.test( key ) ) {
//         console.log("1번")
//         return "<p style='line-height:200%;'><span style='color:#E3691E; font-weight:bold;'>휴대 전화번호 양식 확인</span> : 비밀번호 불일치"
//             + "<br/>"
//             + "<span style='color:#999; font-weight:bold;'>휴대 전화번호 양식이 맞습니다.</span></p>";
//     } else {
//         console.log("2번")
//         return "<p style='line-height:200%;'><span style='color:#E3691E; font-weight:bold;'>휴대 전화번호 양식 확인</span> : 비밀번호 불일치"
//             + "<br/>"
//             + "<span style='color:#999; font-weight:bold;'>휴대 전화번호 양식을 지켜주세요.</span></p>";
//     }
// }
//
// //비밀번호 안정성 체크
// function validatePassword (pw, options) {
//     var o = {
//         length:   [6, 16],
//         lower:    1,
//         upper:    1,
//         alpha:    1, /* lower + upper */
//         numeric:  1,
//         special:  1,
//         custom:   [ /* regexes and/or functions */ ],
//         badWords: [],
//         badSequenceLength: 5,
//         noQwertySequences: true,
//         spaceChk: true,
//         noSequential:      false
//     };
//
//     // space bar check
//     if (o.spaceChk && /\s/g.test(pw)) {
//         return "<p style='line-height:200%;'><span style='color:#E3691E; font-weight:bold;'>사용불가</span> : 비밀번호 재작성 필요"
//             + "<br/>"
//             + "<span style='color:#999; font-weight:bold;'>영문 대소문자, 숫자 및 특수문자 사용</span></p>";
//     }
//
//     //password 길이 체크
//     if (pw.length < o.length[0])
//         return "<p style='line-height:200%;'><span style='color:#E3691E; font-weight:bold;'>사용불가</span>"
//             + "<br/>"
//             + "<span style='color:#999; font-weight:bold;'>비밀번호는 " + o.length[0] + "자 이상 입력하셔야 합니다.</span></p>";
//
//     if (pw.length > o.length[1])
//         return "<p style='line-height:200%;'><span style='color:#E3691E; font-weight:bold;'>사용불가</span>"
//             + "<br/>"
//             + "<span style='color:#999;'>비밀번호는 " + o.length[1] + "자 이내로 입력하셔야 합니다.</span></p>";
//
//     // bad sequence check
//     if (o.badSequenceLength && pw.length >= o.length[0]) {
//         var lower   = "abcdefghijklmnopqrstuvwxyz",
//             upper   = lower.toUpperCase(),
//             numbers = "0123456789",
//             qwerty  = "qwertyuiopasdfghjklzxcvbnm",
//             start   = o.badSequenceLength - 1,
//             seq     = "_" + pw.slice(0, start);
//         for (i = start; i < pw.length; i++) {
//             seq = seq.slice(1) + pw.charAt(i);
//             if (
//                 lower.indexOf(seq)   > -1 ||
//                 upper.indexOf(seq)   > -1 ||
//                 numbers.indexOf(seq) > -1 ||
//                 (o.noQwertySequences && qwerty.indexOf(seq) > -1)
//             ) {
//                 return "<p style='line-height:200%;'>비밀번호 안전도 <span style='color:#E5E5E5'>|</span> <span style='color:#E3691E; font-weight:bold;'>낮음</span>  "
//                     + "<span style='color:#E3691E; font-weight:bold; font-size:20px; position: relative; top: 1.5px;'>―</span>"
//                     + "<span style='color:#E5E5E5; font-weight:bold; font-size:20px; position: relative; top: 1.5px;''>―</span>"
//                     + "<span style='color:#E5E5E5; font-weight:bold; font-size:20px; position: relative; top: 1.5px;''>―</span>"
//                     + "<br/>"
//                     + "<span style='color:#999; font-weight:bold;'>안전도가 높은 비밀번호를 권장합니다.</span></p>";
//             }
//         }
//     }
//
//     //password 정규식 체크
//     var re = {
//             lower:   /[a-z]/g,
//             upper:   /[A-Z]/g,
//             alpha:   /[A-Z]/gi,
//             numeric: /[0-9]/g,
//             special: /[\W_]/g
//         },
//         rule, i;
//
//     var lower = (pw.match(re['lower']) || []).length > 0 ? 1 : 0;
//     var upper = (pw.match(re['upper']) || []).length > 0 ? 1 : 0;
//     var numeric = (pw.match(re['numeric']) || []).length > 0 ? 1 : 0;
//     var special = (pw.match(re['special']) || []).length > 0 ? 1 : 0;
//
//     //숫자로만 이루어지면 낮음
//     if((pw.match(re['numeric']) || []).length == pw.length  ) {
//         return "<p style='line-height:200%;'><span style='color:#E3691E; font-weight:bold;'>사용불가</span> : 비밀번호 재작성 필요"
//             + "<br/>"
//             + "<span style='color:#999; font-weight:bold;'>영문 대소문자, 숫자 및 특수문자 사용</span></p>";
//     }
//     //숫자, 알파벳(대문자, 소문자), 특수문자 2가지 조합
//     else if(lower + upper + numeric + special <= 2){
//         return "<p style='line-height:200%;'>비밀번호 안전도 <span style='color:#E5E5E5'>|</span> <span style='color:#E3691E; font-weight:bold;'>낮음</span>  "
//             + "<span style='color:#E3691E; font-weight:bold; font-size:20px; position: relative; top: 1.5px;'>―</span>"
//             + "<span style='color:#E5E5E5; font-weight:bold; font-size:20px; position: relative; top: 1.5px;''>―</span>"
//             + "<span style='color:#E5E5E5; font-weight:bold; font-size:20px; position: relative; top: 1.5px;''>―</span>"
//             + "<br/>"
//             + "<span style='color:#999; font-weight:bold;'>안전도가 높은 비밀번호를 권장합니다.</span></p>";
//     }
//     //숫자, 알파벳(대문자, 소문자), 특수문자 4가지 조합
//     else if(lower + upper + numeric + special <= 3) {
//         return "<p style='line-height:200%;'>비밀번호 안전도 <span style='color:#E5E5E5'>|</span> <span style='color:#E3691E; font-weight:bold;'>적정</span>  "
//             + "<span style='color:#E3691E; font-weight:bold; font-size:20px; position: relative; top: 1.5px;'>―</span>"
//             + "<span style='color:#E3691E; font-weight:bold; font-size:20px; position: relative; top: 1.5px;''>―</span>"
//             + "<span style='color:#E5E5E5; font-weight:bold; font-size:20px; position: relative; top: 1.5px;''>―</span>"
//             + "<br/>"
//             + "<span style='color:#999; font-weight:bold;'>안전하게 사용하실 수 있는 비밀번호 입니다.</span></p>";
//     }
//     //숫자, 알파벳(대문자, 소문자), 특수문자 4가지 조합
//     else {
//         return "<p style='line-height:200%;'>비밀번호 안전도 <span style='color:#E5E5E5'>|</span> <span style='color:#E3691E; font-weight:bold;'>높음</span>  "
//             + "<span style='color:#E3691E; font-weight:bold; font-size:20px; position: relative; top: 1.5px;'>―</span>"
//             + "<span style='color:#E3691E; font-weight:bold; font-size:20px; position: relative; top: 1.5px;''>―</span>"
//             + "<span style='color:#E3691E; font-weight:bold; font-size:20px; position: relative; top: 1.5px;''>―</span>"
//             + "<br/>"
//             + "<span style='color:#999; font-weight:bold;'>예측하기 힘든 비밀번호로 더욱 안전합니다.</span></p>";
//     }
//
//     // enforce the no sequential, identical characters rule
//     if (o.noSequential && /([\S\s])\1/.test(pw))
//         return "no sequential";
//
//     // enforce word ban (case insensitive)
//     for (i = 0; i < o.badWords.length; i++) {
//         if (pw.toLowerCase().indexOf(o.badWords[i].toLowerCase()) > -1)
//             return "bad word";
//     }
//
//     // enforce custom regex/function rules
//     for (i = 0; i < o.custom.length; i++) {
//         rule = o.custom[i];
//         if (rule instanceof RegExp) {
//             if (!rule.test(pw))
//                 return "custom";
//         } else if (rule instanceof Function) {
//             if (!rule(pw))
//                 return "custom";
//         }
//     }
// };
//
// $(document).ready(function() {
//     $("#ch_new_pw").off("focus").on("focus", function() {
//         var value = $(this).val();
//         // console.log(value)
//         $('.js-mytooltip-pw').myTooltip('updateContent', getPwContent(value));
//     });
//
//     $("#ch_new_pw").off("click").on("click", function() {
//         var value = $(this).val();
//         if(!isNull(value)) {
//             $('.js-mytooltip-pw').myTooltip('updateContent', getPwContent(value));
//         }
//     });
//
//     $("#ch_new_pw").off("keyup").on("keyup", function() {
//         $("#ch_new_pw").blur();
//         $("#ch_new_pw").focus();
//     });
//
//     //비밀번호 안정성 tooltip
//     $('.js-mytooltip-pw').myTooltip({
//         'offset': 30,
//         'theme': 'light',
//         'customClass': 'mytooltip-content',
//         'content':
//             '<p>t</p>'
//     });
//
//     // 비밀번호 확인
//     $("#ch_re_pw").off("focus").on("focus", function() {
//         var value_chk = $(this).val();
//         // console.log(value_chk)
//         $('.js-mytooltop-pw-chk').myTooltip('updateContent', confirmContent(value_chk));
//     });
//
//     $("#ch_re_pw").off("click").on("click", function() {
//         var value_chk = $(this).val();
//         if(!isNull(value_chk)) {
//             $('.js-mytooltop-pw-chk').myTooltip('updateContent', confirmContent(value_chk));
//         }
//     });
//
//     $("#ch_re_pw").off("keyup").on("keyup", function() {
//         $("#ch_re_pw").blur();
//         $("#ch_re_pw").focus();
//     });
//
//     //비밀번호 확인 tooltip
//     $('.js-mytooltop-pw-chk').myTooltip({
//         'offset': 30,
//         'theme': 'light',
//         'customClass': 'mytooltip-content',
//         'content':
//             '<p>t</p>'
//     });
//
//     $('#login_form').keypress(function(e){
//         if (e.keyCode === 13){
//             login_Proc();
//         }
//     });

    //
    // //전화번호 유효성
    // $("#tel_num").off("focus").on("focus", function() {
    //     var value_chk = $(this).val();
    //     // console.log(value_chk)
    //     $('.js-mytooltip-tel').myTooltip('updateContent', tel_num_chk(value_chk));
    // });
    //
    // $("#tel_num").off("click").on("click", function() {
    //     var value_chk = $(this).val();
    //     if(!isNull(value_chk)) {
    //         $('.js-mytooltip-tel').myTooltip('updateContent', tel_num_chk(value_chk));
    //     }
    // });
    //
    // $("#tel_num").off("keyup").on("keyup", function() {
    //     $("#tel_num").blur();
    //     $("#tel_num").focus();
    // });
    //
    // //비밀번호 확인 tooltip
    // $('.js-mytooltip-tel').myTooltip({
    //     'offset': 30,
    //     'theme': 'light',
    //     'customClass': 'mytooltip-content',
    //     'content':
    //         '<p>t</p>'
    // });
// });

function introduce(user_id){
    var postdata = {
        'user_id': user_id
    }
    $.ajax({
        type: "POST",
        url: '/member_activity/member_introduce',
        data: JSON.stringify(postdata),
        async: false,
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data) {
            $('#my_pic').attr("src", data.result2['my_picture']);
            $('#textArea').val(data.result2['introduce']);
            $('#user_name').text(data.result2['user_name']);
            $('#e-mail').text(data.result2['id']);
            // console.log(data.result2['my_picture']);
            // console.log(data.result2['introduce']);
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
}


// const form_name = document.getElementById('post_form');

// 이미지 업로드 참고 --> url https://velog.io/@minkyeong-ko/HTMLCSSJS-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EC%97%85%EB%A1%9C%EB%93%9C-%ED%8C%8C%EC%9D%BC%EC%9D%B4%EB%A6%84-%EB%82%98%ED%83%80%EB%82%B4%EA%B8%B0-%ED%99%94%EB%A9%B4%EC%97%90-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EB%B3%B4%EC%97%AC%EC%A3%BC%EA%B8%B0
// 이미지 편집 툴 --> https://arikong.tistory.com/25
let img_cnt = 0;
let file = new Array();
const my_pic_form_data = new FormData();
function my_pic_loadFile(input) {
        file.push(input.files[0]);	//선택된 파일 가져오기
        my_pic_form_data.append('file', document.getElementById('file').files[0]);

        //새로운 이미지 div 추가
        var newImage = document.createElement("img");
        newImage.setAttribute("style", 'border-radius: 50%;')
        newImage.setAttribute("class", 'img');

        //이미지 source 가져오기
        newImage.src = URL.createObjectURL(file[0]);

        newImage.style.width = "120px";
        newImage.style.height = "120px";
        // newImage.style.visibility = "hidden";   //버튼을 누르기 전까지는 이미지를 숨긴다
        newImage.style.objectFit = "contain";

        //이미지를 image-show div에 추가
        var container = document.getElementById('img_container');
        container.replaceWith(newImage);

        //이미지는 화면에 나타나고
        newImage.style.visibility = "visible";
        // console.log(file);

        $.ajax({
            type: "POST",
            url: '/member_activity/my_pic',
            data: my_pic_form_data,
            dataType : 'JSON',
            contentType: false,
            cache:  false,
            processData: false,
            success: function(data) {
                alert("정상적으로 등록되었습니다.");
                location.href='/member_activity/myhome?bjdong2='+bjdong_cd+'&sido_cd='+sido_cd+'&user_loc_lat='+user_loc_lat+'&user_loc_lon='+user_loc_lon;
            },
            error: function(xhr) {
                console.log('Error occurred while fetching data.');
            }
        });
};

function file_browse(){
    document.pic_form.file.click();
    // document.pic_form.text1.value=document.pic_form.file.value;
}
