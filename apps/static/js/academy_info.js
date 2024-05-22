function academy_search(){
    var academy_search_nm = document.getElementById('academy_search_nm').value;
    console.log(academy_search_nm)
    var sido = $('#sido option:selected').val();
    var sigungun = $('#sigugun option:selected').val();
    var bjdong = $('#dong option:selected').val();
    var bjdong_nm = $('#dong option:selected').text();
    var bjdong_cd_loc = sigungun+bjdong;

    if (sido == "" || sigungun == "" || bjdong == ""){
        alert('행정 구역을 선택하세요.');
    }else if (academy_search_nm == null || academy_search_nm == ""){
        alert('학원 이름을 입력하세요.');
    }
    else{
        var postdata = {
            'bjdong_cd_loc': bjdong_cd_loc,
            'academy_search_nm':academy_search_nm
        }
        $.ajax({
            type: 'POST',
            url: '/academy_info/academy_search',
            data: JSON.stringify(postdata),
            dataType : 'JSON',
            contentType: "application/json",
            success: function(data) {
                var c = data.result2['id_counter'];
                $("#academy_search_list").empty();
                if (c==0){
                    var html_list =
                        '<div class = "col-lg-4 col-md-6" >'+
                        '<div class = "product-card mb-4" >'+
                        '<p>검색 결과가 없습니다.</p>'+
                        '</div>'+
                        '</div>'
                    $("#academy_search_list").append(html_list);
                }else{
                    for (var i = 1; i <= c; i++) {
                        var academy_nm = data.result2["academy_nm_" + i]
                        var html_list = '' +
                            '<div id = "academy_list" style="margin-bottom: 10px;" onclick="academy_select(\''+academy_nm+'\', '+ data.result2["idx_" + i]+', '+data.result2["bjdong_" + i]+');">'+
                            '<div>' +
                            '<div>'+data.result2["academy_nm_" + i]+'</div>'+
                            '<div>'+data.result2["addr_" + i]+'</div>'+
                            '</div>'+
                            '</div>'
                        $('#academy_search_list').height(200);
                        $("#academy_search_list").append(html_list);
                    }
                }
            },
            error: function(xhr) {
                console.log('Error occurred while fetching data.');
            }
        });
    }
}

function academy_select(academy_nm, idx, bjdong){
    $('input[id=academy_select_idx]').attr('value', idx);
    $('input[id=academy_bjdong]').attr('value', bjdong);
    $('input[id=academy_search]').attr('value', academy_nm);

    $('input[id=academy_nm]').attr('value', academy_nm);
    $('#academy_search_list').empty();
    $('#academy_search_list').css("margin-top", 0);
    $('#academy_search_list').height(0);
    $('#academy_search_result').css("margin-top", 10);

    $("#business_num_div").css('display', 'block');
    $("#business_num_div").css('display', 'flex');
    $("#academy_search_result").css('display', 'block');
    // $("#save_div").css('display', 'block');
}

function academy_search_normal(){
    var academy_search_nm = document.getElementById('academy_search_nm').value;
    console.log(academy_search_nm)
    var sido = $('#sido option:selected').val();
    var sigungun = $('#sigugun option:selected').val();
    var bjdong = $('#dong option:selected').val();
    var bjdong_nm = $('#dong option:selected').text();
    var bjdong_cd_loc = sigungun+bjdong;

    if (sido == "" || sigungun == "" || bjdong == ""){
        alert('행정 구역을 선택하세요.');
    }else if (academy_search_nm == null || academy_search_nm == ""){
        alert('학원 이름을 입력하세요.');
    }
    else{
        var postdata = {
            'bjdong_cd_loc': bjdong_cd_loc,
            'academy_search_nm':academy_search_nm
        }
        $.ajax({
            type: 'POST',
            url: '/academy_info/academy_search',
            data: JSON.stringify(postdata),
            dataType : 'JSON',
            contentType: "application/json",
            success: function(data) {
                var c = data.result2['id_counter'];
                $("#academy_search_list").empty();
                if (c==0){
                    var html_list =
                        '<div class = "col-lg-4 col-md-6" >'+
                        '<div class = "product-card mb-4" >'+
                        '<p>검색 결과가 없습니다.</p>'+
                        '</div>'+
                        '</div>'
                    $("#academy_search_list").append(html_list);
                }else{
                    for (var i = 1; i <= c; i++) {
                        var academy_nm = data.result2["academy_nm_" + i]
                        var html_list = '' +
                            '<div id = "academy_list" style="margin-bottom: 10px;" onclick="academy_select_normal(\''+academy_nm+'\', '+ data.result2["idx_" + i]+', '+data.result2["bjdong_" + i]+');">'+
                            '<div>' +
                            '<div>'+data.result2["academy_nm_" + i]+'</div>'+
                            '<div>'+data.result2["addr_" + i]+'</div>'+
                            '</div>'+
                            '</div>'
                        $('#academy_search_list').height(200);
                        $("#academy_search_list").append(html_list);
                    }
                }
            },
            error: function(xhr) {
                console.log('Error occurred while fetching data.');
            }
        });
    }
}

function academy_select_normal(academy_nm, idx, bjdong){
    $('input[id=academy_select_idx]').attr('value', idx);
    $('input[id=academy_bjdong]').attr('value', bjdong);
    $('input[id=academy_search]').attr('value', academy_nm);

    $('input[id=academy_nm]').attr('value', academy_nm);
    $('#academy_search_list').empty();
    $('#academy_search_list').css("margin-top", 0);
    $('#academy_search_list').height(0);
    $('#academy_search_result').css("margin-top", 10);

    $("#academy_search_result").css('display', 'block');
    $("#privacy_info_div").css('display', 'block');
    $("#save_div").css('display', 'block');
}


function academy_info_save(){
    var child_selected = $('#ChildItemSelectBox option:selected').val();
    var academy_select_idx = $('#academy_select_idx').val();
    var academy_bjdong = $('#academy_bjdong').val();
    var academy_nm = $('#academy_nm').val();
    var class_nm = $('#class_nm').val();

    console.log("child_selected", child_selected);
    console.log("academy_select_idx", academy_select_idx);
    console.log("academy_bjdong", academy_bjdong);
    console.log("academy_nm", academy_nm);
    console.log("class_nm", class_nm);

    var postdata = {
        "parents_idx": user_idx,
        "child_selected": child_selected,
        "academy_select_idx": academy_select_idx,
        "academy_bjdong": academy_bjdong,
        "academy_nm": academy_nm,
        "class_nm": class_nm
    }
    $.ajax({
        type: 'POST',
        url: '/academy_info/belong_insert',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data) {
            alert("정상적으로 입력되었습니다.");
            $('#save_div').css('display', 'none');
            $('#academy_search_nm').val("");
            $('#academy_search_result').empty();
            $('#class_nm_div').empty('');

            $('#reg_academy_info').empty();
            academy_manage();
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
            location.href="/index"
        }
    });
}

// ======================== 학원 찾기 끝 ====================
// ======================== 학원 관리 =======================

function academy_oauth(){
    location.href="/oauth_teacher";
}

function academy_manage(){
    var postdata = {
        "teacher_idx": user_idx
    }
    $.ajax({
        type: 'POST',
        url: '/academy_info/academy_list',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data) {
            var c = data.result2['id_counter'];
            if (c==0){
                var html1 =
                    '<div class = "col-lg-4 col-md-6" >'+
                    '<div class = "product-card mb-4" >'+
                    '<p>등록된 학원이 없습니다.</p>'+
                    '</div>'+
                    '</div>'
                $("#reg_academy_info").append(html1);
            }else{
                for (var i = 1; i <= c; i++) {
                    var html1 = "<div id='aca_div_"+ data.result2['idx_' + i]+"' style='border-radius: 5px 5px 5px 5px; background-color: #14c1c1; width: 100%; margin-bottom: 5px; display: flex;'> "+
                        "<div style='width: 80%;' onclick='academy_move("+ data.result2['belong_idx_' + i]+");'>"+
                        "<p style='color: #2c3034; margin-left: 30px; font-size: 14px; margin-top: 12px;'>"+data.result2["academy_nm_" + i]+"</p>"+
                        "</div>"+
                        "<div style='width: 10%;' id='now_loc_01_del'>"+
                        "<img src='/static/images/category_manage.png' style='width: 20px; margin-top: 14px;'>"+
                        "</div>"+
                        "<div style='width: 10%;' id='now_loc_01_del'>"+
                        "<img id='minusButton1' src='/static/images/picture_del.png' width='20px' height='20px' class='zoom-image' onclick='academy_del("+ data.result2['idx_' + i]+");' style='position: relative; margin-top: 14px;'>"+
                        "</div>"+
                        "</div>";
                    $("#reg_academy_info").append(html1);
                }
            }
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
            location.href="/index"
        }
    });
}

function academy_del(academy_idx){
    if (confirm("학원을 삭제 하시면 이력도 삭제 됩니다.. \n삭제하시겠습니까?") == true){
        var postdata = {
            "academy_idx": academy_idx
        }
        $.ajax({
            type: 'POST',
            url: '/academy_info/academy_del',
            data: JSON.stringify(postdata),
            dataType : 'JSON',
            contentType: "application/json",
            success: function(data) {
                alert("정상적으로 삭제 되었습니다.")
                // var del_div = '#aca_div_'+academy_idx
                // $(del_div).css('display', 'none');
                $('#reg_academy_info').empty();
                academy_manage();
            },
            error: function(xhr) {
                console.log('Error occurred while fetching data.');
                location.href="/index"
            }
        });
    }else{
        return false;
    }
}

function academy_move(academy_idx, review_state){
    location.href="/edu_info/academy_info_detail?id="+academy_idx+"&review_state="+review_state
}

function academy_list(){
    var postdata = {
        'user_idx': user_idx
    }
    $.ajax({
        type: "POST",
        url: '/academy_info/academy_list',
        data: JSON.stringify(postdata),
        async: false,
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data) {
            var c = data.result2['id_counter'];

            if (c == 0){
                $("#AcademyItemSelectBox").append('<option value="" selected>등록된 학원이 없습니다.</option>');
            }else{
                for (var i = 1; i <= c; i++) {
                    var select_item = data.result2['academy_nm_'+i];
                    var belong_idx = data.result2['belong_idx_'+i];
                    var represent = data.result2['represent_'+i];
                    if (represent == 1){
                        $("#AcademyItemSelectBox").append('<option value='+belong_idx+' selected>'+select_item+'</option>');
                    }else{
                        $("#AcademyItemSelectBox").append('<option value='+belong_idx+'>'+select_item+'</option>');
                    }
                }
            }
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    })
}

function academy_change(){
    var AcademyItemSelectBox_num = document.getElementById("AcademyItemSelectBox").value;
    console.log('AcademyItemSelectBox_num', AcademyItemSelectBox_num);
    var postdata = {
        'belong_idx' : AcademyItemSelectBox_num,
        'user_idx': user_idx
    }
    $.ajax({
        type: 'POST',
        url: '/academy_info/academy_change',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data) {
            alert("대표 학원이 변경되었습니다.");
            location.reload();
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
}

function academy_business_search(){
    var servicekey = '';
    var business_result = '';
    var business_num = $('#business_num').val();
    var business_start_date = $('#business_start_date').val();
    var business_boss_nm = $('#business_boss_nm').val();
    if (business_num == "" || business_start_date == "" || business_boss_nm == "") {
        alert('사업자등록 정보를 입력하세요.');
    }else{
        business_num = remove_str(business_num, ' ', 4);
        business_start_date = remove_str(business_start_date, ' ', 4);
        business_boss_nm = remove_str(business_boss_nm, ' ', 4);
        var postdata1 = {}
        var data = {
            'businesses':[
                {
                    'b_no': business_num,
                    'start_dt': business_start_date,
                    'p_nm': business_boss_nm
                }
            ]
        }
        $.ajax({
            type: 'POST',
            url: '/public_api/academy_servicekey',
            data: JSON.stringify(postdata1),
            dataType : 'JSON',
            contentType: "application/json",
            success: function(result_data) {
                servicekey = result_data.result2['dataportal_servicekey'];
                $.ajax({
                    url: "http://api.odcloud.kr/api/nts-businessman/v1/validate?serviceKey="+servicekey+"&returnType=json",
                    type: "POST",
                    data: JSON.stringify(data),
                    dataType: "JSON",
                    contentType: "application/json",
                    accept: "application/json",
                    success: function(result) {
                        console.log(result);
                        business_result =result.valid_cnt;
                        if (business_result=='1'){
                            $("#academy_business_result").val(business_result);
                            alert("사업자 정보가 정상적으로 확인 되었습니다.");
                            $("#save_div").css('display', 'block');
                        }else{
                            alert("사업자 정보 조회에 실패하였습니다.");
                        };
                    },
                    error: function(result) {
                        console.log(result.responseText); //responseText의 에러메세지 확인
                    }
                });
            },
            error: function(xhr) {
                console.log('Error occurred while fetching data.');
            }
        });
    }
};

function academy_reg(){
    var academy_select_idx =$('#academy_select_idx').val();
    var business_num = $('#business_num').val();
    var business_start_date = $('#business_start_date').val();
    var business_boss_nm = $('#business_boss_nm').val();
    var academy_business_result = $('#academy_business_result').val();
    console.log(academy_select_idx, business_num, business_start_date, business_boss_nm, academy_business_result);
    if (academy_business_result == 1){
        var postdata = {
            'academy_select_idx': academy_select_idx,
            'business_num' : business_num,
            'business_start_date': business_start_date,
            'business_boss_nm': business_boss_nm,
            'user_idx': user_idx
        }
        $.ajax({
            type: 'POST',
            url: '/academy_info/academy_reg',
            data: JSON.stringify(postdata),
            dataType : 'JSON',
            contentType: "application/json",
            success: function(data) {
                localStorage.setItem("teacher_type", 1);
                localStorage.setItem("belong_idx", academy_select_idx);

                if (confirm("학원 등록이 완료되었습니다. \n추가 정보를 확인하시겠습니까?") == true){
                    location.href="/academy_info/academy_info_normal";
                }else{
                    location.reload();
                }
            },
            error: function(xhr) {
                console.log('Error occurred while fetching data.');
            }
        });
    }else{
        alert("사업자 정보를 다시 확인하세요.");
    };
};

function academy_reg_normal(){
    var academy_select_idx =$('#academy_select_idx').val();
    var privacy_info_nm =$('#privacy_info_nm').val();
    var privacy_info_telnum =$('#privacy_info_telnum').val();
    if (privacy_info_nm == "" || privacy_info_telnum == ""){
        alert("이름과 전화번호를 입력하세요.");
    }else{
        var postdata = {
            'academy_select_idx': academy_select_idx,
            'privacy_info_nm': privacy_info_nm,
            'privacy_info_telnum': privacy_info_telnum,
            'user_idx': user_idx
        }
        $.ajax({
            type: 'POST',
            url: '/academy_info/academy_reg_normal',
            data: JSON.stringify(postdata),
            dataType : 'JSON',
            contentType: "application/json",
            success: function(data) {
                if (confirm("교사 신청을 완료하였습니다. \n원장님께서 승인을 해주셔야 정식 교사로 등록할 수 있습니다.") == true){
                    location.href="/login";
                }else{
                    location.reload();
                }
            },
            error: function(xhr) {
                console.log('Error occurred while fetching data.');
            }
        });
    }
};

function academy_info(belong_idx){
    var postdata = {
        'user_idx': user_idx,
        'belong_idx': belong_idx
    }
    $.ajax({
        type: "POST",
        url: '/academy_info/academy_info_desc',
        data: JSON.stringify(postdata),
        async: false,
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data) {
            var c = data.result2['id_counter'];
            console.log("ccccc", c)
            if (c == 1){
                var shop_img_01 = data.result2['shop_img_01'];
                var shop_img_02 = data.result2['shop_img_02'];
                var shop_img_03 = data.result2['shop_img_03'];

                $('#img_container').append("<div class=\"mb-4 col-md-6 col-lg-4\">\n" +
                                            "    <div class=\"h-100 d-flex flex-column justify-content-between pb-3\">\n" +
                                            "        <div class=\"overflow-hidden\">\n" +
                                            "            <div class=\"h-100\"><img id=\"shop_img_01\" class=\"rounded-1 object-fit-cover h-100 w-100\" src=\"/static/images/"+shop_img_01+"\"></div>\n" +
                                            "            </div>\n" +
                                            "        </div>\n" +
                                            "    </div> "+
                                            "<div class=\"mb-4 col-md-6 col-lg-4\">\n" +
                                            "    <div class=\"h-100 d-flex flex-column justify-content-between pb-3\">\n" +
                                            "        <div class=\"overflow-hidden\">\n" +
                                            "            <div class=\"h-100\"><img id=\"shop_img_01\" class=\"rounded-1 object-fit-cover h-100 w-100\" src=\"/static/images/"+shop_img_02+"\"></div>\n" +
                                            "            </div>\n" +
                                            "        </div>\n" +
                                            "    </div> "+
                                            "<div class=\"mb-4 col-md-6 col-lg-4\">\n" +
                                            "    <div class=\"h-100 d-flex flex-column justify-content-between pb-3\">\n" +
                                            "        <div class=\"overflow-hidden\">\n" +
                                            "            <div class=\"h-100\"><img id=\"shop_img_01\" class=\"rounded-1 object-fit-cover h-100 w-100\" src=\"/static/images/"+shop_img_03+"\"></div>\n" +
                                            "            </div>\n" +
                                            "        </div>\n" +
                                            "    </div>")
            }else{
                for (var i = 1; i <= c; i++) {
                    var file_idx = data.result2['idx_'+i];
                    var shop_img = data.result2['file_name_'+i];

                    $('#img_container').append("<div class=\"mb-4 col-md-6 col-lg-4\">\n" +
                        "    <div class=\"h-100 d-flex flex-column justify-content-between pb-3\">\n" +
                        "        <div class=\"overflow-hidden\">\n" +
                        "            <div class=\"h-100\"><img id=\"shop_img_01\" class=\"rounded-1 object-fit-cover h-100 w-100\" src='/static/file_upload/picture/academy_info/"+shop_img+"'></div>\n" +
                        "            </div>\n" +
                        "        </div>\n" +
                        "    </div> ")
                }
            }
            var represent_img = data.result2['represent_img'];
            var academy_desc = data.result2['academy_desc'];

            if (academy_desc == "" || academy_desc == null){
                academy_desc = "정보 없음"
            }
            var tel_num = data.result2['tel_num'];
            if (tel_num == "" || tel_num == null){
                tel_num = "정보 없음"
            }
            var school_target_nm = data.result2['school_target_nm'];
            if (school_target_nm == "" || school_target_nm == null){
                school_target_nm = "정보 없음"
            }
            var category_nm = data.result2['category_nm'];
            if (category_nm == "" || category_nm == null){
                category_nm = "정보 없음"
            }
            var teaching_line_nm = data.result2['teaching_line_nm'];
            if (teaching_line_nm == "" || teaching_line_nm == null){
                teaching_line_nm = "정보 없음"
            }
            var teaching_subject_nm_02 = data.result2['teaching_subject_nm_02'];
            if (teaching_subject_nm_02 == "" || teaching_subject_nm_02 == null){
                teaching_subject_nm_02 = "정보 없음"
            }
            var tuition_desc = data.result2['tuition_desc'];
            if (tuition_desc == "" || tuition_desc == null){
                tuition_desc = "정보 없음"
            }
            var class_peaple_cnt = data.result2['class_peaple_cnt'];
            if (class_peaple_cnt == "" || class_peaple_cnt == null){
                class_peaple_cnt = "정보 없음"
            }

            var people_sum = data.result2['people_sum'];
            if (people_sum == "" || people_sum == null){
                people_sum = "정보 없음"
            }
            var like_cnt = data.result2['like_cnt'];
            if (like_cnt == "" || like_cnt == null){
                like_cnt = "정보 없음"
            }
            var add_01 = data.result2['add_01'];
            if (add_01 == "" || add_01 == null){
                add_01 = "정보 없음"
            }
            var add_02 = data.result2['add_02'];
            if (add_02 == "" || add_02 == null){
                add_02 = "정보 없음"
            }
            var zip_code = data.result2['zip_code'];
            if (zip_code == "" || zip_code == null){
                zip_code = "정보 없음"
            }
            var address = add_01+""+add_02+" ("+zip_code+")"
            if (address == "" || address == null){
                address = "정보 없음"
            }
            var reg_state = data.result2['reg_state'];
            if (reg_state == "" || reg_state == null){
                reg_state = "정보 없음"
            }


            $("#academy_desc").text(academy_desc);

            $("#tel_num").text(tel_num);
            $("#school_target_nm").text(school_target_nm);
            $("#category_nm").text(category_nm);
            $("#teaching_line_nm").text(teaching_line_nm);
            $("#teaching_subject_nm_02").text(teaching_subject_nm_02);
            $("#tuition_desc").text(tuition_desc);
            $("#class_peaple_cnt").text(class_peaple_cnt);

            $("#people_sum").text(people_sum);
            $("#like_cnt").text(like_cnt);
            $("#address1").text(add_01);
            $("#address2").text(add_02);
            $("#reg_state").text(reg_state);

        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    })
}

function academy_info_mod_move(){
    location.href="/academy_info/academy_info_mod"
};

let a_img_cnt = 0;
let attach_cnt = 0;
let pic_del_list = new Array();
let ready_img_cnt = 0;
let total_img_cnt = 0;

let a_file = new Array();
const form_data_file = new FormData();
const form_data_info = new FormData();

function loadFile(input) {
    if (total_img_cnt >= 3) {
        alert('이미지는 최대 3개까지 업로드가 가능합니다.');
        return;
    }else{
        var file_idx;
        a_file.push(input.files[0]);	//선택된 파일 가져오기
        // input.value="";
        // var nowtime = year +''+ month +''+ date +''+ hours +''+ minutes +''+ seconds +''+ milliseconds;
        // var filename = input.files[0].name+'_'+nowtime;
        form_data_file.append('file[]', document.getElementById('file').files[0]);
        form_data_file.append('belong_idx', belong_idx);

        $.ajax({
            type: "POST",
            url: '/academy_info/academy_attach_add',
            data: form_data_file,
            dataType : 'JSON',
            async:false,
            contentType: false,
            cache:  false,
            processData: false,
            success: function(data) {
                alert("정상적으로 등록되었습니다.");
                file_idx = 'pic_'+data.result2[0]
            },
            error: function(xhr) {
                console.log('Error occurred while fetching data.');
            }
        });

        //새로운 이미지 div 추가
        var newImage = document.createElement("img");
        newImage.setAttribute("class", 'rounded-1 object-fit-cover h-100 w-100');

        //이미지 source 가져오기90
        newImage.src = URL.createObjectURL(a_file[attach_cnt]);
        // newImage.style.width = "100%";
        // newImage.style.height = "100%";
        // newImage.style.visibility = "hidden";   //버튼을 누르기 전까지는 이미지를 숨긴다
        // newImage.style.objectFit = "contain";

        //이미지를 image-show div에 추가
        var img_id = 'image-show-'+a_img_cnt
        $('#img_container').append("<div class=\"mb-4 col-md-6 col-lg-4\"  id="+file_idx+">\n" +
            "    <div class=\"h-100 d-flex flex-column justify-content-between pb-3\">\n" +
            "        <div class=\"overflow-hidden\">\n" +
            "            <div class=\"h-100\" id="+img_id+"2>" +
            "               <img id='minusButton' src='/static/images/picture_del.png' width='25px' height='25px' class='zoom-image' onclick='pic_ready_del(\""+file_idx+"\");' style='position: relative; z-index: 2000; top: 35px; right: -210px;'>" +
            "            </div>\n" +
            "            </div>\n" +
            "        </div>\n" +
            "    </div> ")

        var container = document.getElementById(img_id+"2");
        container.appendChild(newImage);
        console.log("newImage: ", newImage);

        //이미지는 화면에 나타나고
        newImage.style.visibility = "visible";
        a_img_cnt ++;
        attach_cnt ++;

        total_img_cnt = a_img_cnt + ready_img_cnt;

        console.log("a_img_cnt: ", a_img_cnt);
        console.log("attach_cnt: ", attach_cnt);
        console.log("total_img_cnt: ", total_img_cnt);


    }
};

function academy_mod_ready(belong_idx){
    var postdata = {
        'user_idx': user_idx,
        'belong_idx': belong_idx
    }
    $.ajax({
        type: "POST",
        url: '/academy_info/academy_info_desc',
        data: JSON.stringify(postdata),
        async: false,
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data) {
            var c = data.result2['id_counter'];
            // console.log("ccccc", c)

            for (var i = 1; i <= c; i++) {
                ready_img_cnt++;
                var file_idx = 'pic_'+data.result2['idx_'+i];
                var shop_img = data.result2['file_name_'+i];
                $('#img_container').append("<div class=\"mb-4 col-md-6 col-lg-4\" id="+file_idx+">\n" +
                    "    <div class=\"h-100 d-flex flex-column justify-content-between pb-3\">\n" +
                    "        <div class=\"overflow-hidden\">\n" +
                    "            <div class=\"h-100\">" +
                    "               <img id='minusButton' src='/static/images/picture_del.png' width='25px' height='25px' class='zoom-image' onclick='pic_ready_del(\""+file_idx+"\");' style='position: relative; z-index: 2000;  top: 35px; right: -210px;'>" +
                    "               <img id=\"shop_img_01\" class=\"rounded-1 object-fit-cover h-100 w-100\" src='/static/file_upload/picture/academy_info/"+shop_img+"'>" +
                    "            </div>\n" +
                    "            </div>\n" +
                    "        </div>\n" +
                    "    </div> ")
            }
            total_img_cnt += ready_img_cnt;
            console.log("ready_img_cnt", ready_img_cnt);
            console.log("total_img_cnt: ", total_img_cnt)
            var represent_img = data.result2['represent_img'];

            var academy_desc = data.result2['academy_desc'];

            if (academy_desc == "" || academy_desc == null){
                academy_desc = "정보 없음"
            }
            var tel_num = data.result2['tel_num'];
            if (tel_num == "" || tel_num == null){
                tel_num = "정보 없음"
            }
            var school_target_nm = data.result2['school_target_nm'];
            if (school_target_nm == "" || school_target_nm == null){
                school_target_nm = "정보 없음"
            }
            var category_nm = data.result2['category_nm'];
            if (category_nm == "" || category_nm == null){
                category_nm = "정보 없음"
            }
            var teaching_line_nm = data.result2['teaching_line_nm'];
            if (teaching_line_nm == "" || teaching_line_nm == null){
                teaching_line_nm = "정보 없음"
            }
            var teaching_subject_nm_02 = data.result2['teaching_subject_nm_02'];
            if (teaching_subject_nm_02 == "" || teaching_subject_nm_02 == null){
                teaching_subject_nm_02 = "정보 없음"
            }
            var tuition_desc = data.result2['tuition_desc'];
            if (tuition_desc == "" || tuition_desc == null){
                tuition_desc = "정보 없음"
            }
            var class_peaple_cnt = data.result2['class_peaple_cnt'];
            if (class_peaple_cnt == "" || class_peaple_cnt == null){
                class_peaple_cnt = 0
            }
            var people_sum = data.result2['people_sum'];
            if (people_sum == "" || people_sum == null){
                people_sum = 0
            }
            var like_cnt = data.result2['like_cnt'];
            if (like_cnt == "" || like_cnt == null){
                like_cnt = 0
            }
            var add_01 = data.result2['add_01'];
            if (add_01 == "" || add_01 == null){
                add_01 = "정보 없음"
            }
            var add_02 = data.result2['add_02'];
            if (add_02 == "" || add_02 == null){
                add_02 = "정보 없음"
            }
            var zip_code = data.result2['zip_code'];
            if (zip_code == "" || zip_code == null){
                zip_code = "정보 없음"
            }
            var address = add_01+""+add_02+" ("+zip_code+")"
            if (address == "" || address == null){
                address = "정보 없음"
            }
            var reg_state = data.result2['reg_state'];
            if (reg_state == "" || reg_state == null){
                reg_state = "정보 없음"
            }

            $("#academy_desc").text(academy_desc);

            $("#tel_num").val(tel_num);
            $("#school_target_nm").val(school_target_nm);
            $("#category_nm").val(category_nm);
            $("#teaching_line_nm").val(teaching_line_nm);
            $("#teaching_subject_nm_02").val(teaching_subject_nm_02);
            $("#tuition_desc").val(tuition_desc);
            $("#class_peaple_cnt").val(class_peaple_cnt);

            $("#people_sum").val(people_sum);
            $("#like_cnt").val(like_cnt);
            $("#address1").val(add_01);
            $("#address2").val(add_02);
            $("#reg_state").val(reg_state);

        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    })
};

// function pic_del(file_idx, filename){
//     $("#"+file_idx).remove();
//     if (a_img_cnt != 0){
//         a_img_cnt--;
//         total_img_cnt = a_img_cnt + ready_img_cnt;
//         form_data.delete(filename);
//     }
//     console.log("a_img_cntdown", a_img_cnt);
//     console.log("total_img_cnt", total_img_cnt);
//     console.log("form_dataform_dataform_dataform_dataform_data:", form_data);
// };

function pic_ready_del(file_idx){
    if (confirm("등록된 사진을 삭제하시겠습니까?") == true){
    $("#"+file_idx).remove();
    if (ready_img_cnt != 0){
        ready_img_cnt --;
        total_img_cnt = a_img_cnt + ready_img_cnt;
    }
    var academy_file_idx = file_idx.substring(4);
    postdata = {
        'academy_file_idx': academy_file_idx
    }
    $.ajax({
        type: "POST",
        url: '/academy_info/academy_attach_del',
        data: JSON.stringify(postdata),
        async: false,
        dataType : 'JSON',
        contentType: "application/json",

        success: function(response) {
            alert("정상적으로 삭제되었습니다.");
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
    }else{
        return false;
    }
};

function academy_info_mod(){
    form_data_info.append('tel_num', document.getElementById('tel_num').value);
    form_data_info.append('school_target_nm', document.getElementById('school_target_nm').value);
    form_data_info.append('category_nm', document.getElementById('category_nm').value);
    form_data_info.append('teaching_line_nm', document.getElementById('teaching_line_nm').value);
    form_data_info.append('teaching_subject_nm_02', document.getElementById('teaching_subject_nm_02').value);
    form_data_info.append('tuition_desc', document.getElementById('tuition_desc').value);
    form_data_info.append('class_peaple_cnt', document.getElementById('class_peaple_cnt').value);
    form_data_info.append('people_sum', document.getElementById('people_sum').value);
    form_data_info.append('address1', document.getElementById('address1').value);
    form_data_info.append('address2', document.getElementById('address2').value);
    form_data_info.append('reg_state', document.getElementById('reg_state').value);
    form_data_info.append('academy_desc', document.getElementById('academy_desc').value);
    form_data_info.append('belong_idx', belong_idx);

    console.log(form_data_info.get('belong_idx'));
    console.log(form_data_info.get('school_target_nm'));

    $.ajax({
            type: "POST",
            url: '/academy_info/academy_mod_save',
            data: form_data_info,
            dataType : 'JSON',
            contentType: false,
            cache:  false,
            processData: false,
            success: function(response) {
                alert("정상적으로 등록되었습니다.");
                location.href="/academy_info/academy_info_normal"
            },
            error: function(xhr) {
                console.log('Error occurred while fetching data.');
            }
        });
}
// ======================== 학원 정보 등록 관리 끝=======================