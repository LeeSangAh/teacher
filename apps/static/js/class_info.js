var current_page;
function class_info(page, belong_idx){
    $.ajax({
        url: '/class_info/class_info_list',
        type: 'GET',
        data: {page: page, belong_idx: belong_idx},
        success: function(response) {
            current_page = response.page;
            $('#data-container').append(response.data);
            $('#paging_info').html('등록된 수업 총 '+response.total+'개');
            if (response.post_cnt < 9) {
                $("#load-more").remove();
                if (current_page >1 ){
                    $("#load-more-div").append("<p class=\"fs--1\" style='text-align: center; margin-top: 20px;'>더 이상 등록된 교사가 없습니다.</p>");
                }
            }
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
};

$('#load-more').click(function() {
    class_info(current_page+1, belong_idx);
});


function class_info_detail(class_idx){
    var postdata = {
        "class_idx": class_idx
    }
    $.ajax({
        type: 'POST',
        url: '/class_info/class_info_detail',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data) {
            var class_status = "";
            if (data.result2['class_status'] == '1'){ class_status = '수업중'}else if(data.result2['class_status'] == '0'){class_status = '종료'};
            if (class_status != null){$('#class_status').text(class_status)};

            if (data.result2['class_nm'] != null){$('#class_nm').text(data.result2['class_nm'])};
            if (data.result2['subject_nm'] != null){$('#subject_nm').text(data.result2['subject_nm'])};
            if (data.result2['level_nm'] != null){$('#level_nm').text(data.result2['level_nm'])};

            if (data.result2['student_cnt'] != null){$('#student_cnt').text(data.result2['student_cnt'])};
            if (data.result2['class_limit_student'] != null){$('#class_limit_student').text(data.result2['class_limit_student'])};

            var level_test_limit = "";
            if (data.result2['level_test_limit'] != null){ level_test_limit = +data.result2['level_test_limit']}else if(data.result2['level_test_limit'] == null){level_test_limit = '0'};

            var level_test_yn = "";
            if (data.result2['level_test_yn'] == '1'){ level_test_yn = '있음'}else if(data.result2['level_test_yn'] == '0'){level_test_yn = '없음'};
            if (level_test_yn != null){$('#level_test_yn').text(level_test_yn+' / '+level_test_limit)};

            if (data.result2['teacher_picture'] != null){$('#teacher_picture').attr('src', '/static/file_upload/picture/teacher_info/'+data.result2['teacher_picture'])};
            if (data.result2['teacher_name'] != null){$('#teacher_name').text(data.result2['teacher_name'])};

            if (data.result2['book_dix'] != null){$('#book_nm').attr('src', '/static/file_upload/picture/class_info/'+data.result2['book_dix'])};
            if (data.result2['book_nm'] != null){$('#book_nm').text(data.result2['book_nm'])};
            if (data.result2['tution_fee'] != null){$('#tution_fee').text(data.result2['tution_fee'].toLocaleString('ko-KR'))};

            if (data.result2['class_enrolment_start'] != null){$('#class_enrolment_start').text(data.result2['class_enrolment_start'])};
            if (data.result2['class_enrolment_end'] != null){$('#class_enrolment_end').text(data.result2['class_enrolment_end'])};
            if (data.result2['start_date'] != null){$('#start_date').text(data.result2['start_date'])};
            if (data.result2['end_date'] != null){$('#end_date').text(data.result2['end_date'])};
            if (data.result2['class_desc'] != null){$('#class_desc').text(data.result2['class_desc'])};

            var lec_day_arr = [];
            var lec_start_time_arr = [];
            var lec_end_time_arr = [];
            var again_yn_arr = [];
            var lec_day = data.result2['lec_day_arr'];
            var lec_start_time = data.result2['lec_start_time_arr'];
            var lec_end_time = data.result2['lec_end_time_arr'];
            var again_yn = data.result2['again_yn_arr'];

            if (lec_day != null && lec_start_time && lec_end_time){
                lec_day_arr = lec_day.split(',');
                lec_start_time_arr = lec_start_time.split(',');
                lec_end_time_arr = lec_end_time.split(',');
                again_yn_arr = again_yn.split(',');

                for (i = 0; i < lec_day_arr.length; i++) {
                    var lec_day_week = getDayOfWeek(lec_day_arr[i]);
                    var again_yn_ok = again_yn_arr[i];
                    if (again_yn_ok == 'true'){
                        var html = "<div class='d-flex' id='lec_div_cnt_"+i+"'>" +
                                        "<p class=\"fs--1\" id=\"start_date\" href=\"\">매주&nbsp;</p><p class=\"fs--1\" id=\"end_date\" href=\"\">"+lec_day_week+"요일 </p><p class=\"fs--1\" id=\"end_date\" href=\"\">"+lec_start_time_arr[i]+"</p>~<p class=\"fs--1\" id=\"end_date\" href=\"\">"+lec_end_time_arr[i]+"</p>" +
                                    "</div>"
                    }else{
                        var html = "<div class='d-flex' id='lec_div_cnt_"+i+"'>" +
                                        "<p class=\"fs--1\" id=\"end_date\" href=\"\">"+lec_day_arr[i]+"</p><p class=\"fs--1\" id=\"end_date\" href=\"\">"+lec_start_time_arr[i]+"</p>~<p class=\"fs--1\" id=\"end_date\" href=\"\">"+lec_end_time_arr[i]+"</p>" +
                                    "</div>"
                    }
                    $('#lec_time').append(html);
                }
            }

        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
            // location.href="/index"
        }
    });
}

function class_info_mod_ready(class_idx){
    console.log("class_idx:", class_idx)

    var select_teacher_idx;
    var select_class_level_idx;
    var select_book_idx;
    var select_subject_idx;
    var postdata = {
        "class_idx": class_idx
    }
    $.ajax({
        type: 'POST',
        url: '/class_info/class_info_detail',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data) {
            if (data.result2['teacher_idx'] != null){select_teacher_idx = data.result2['teacher_idx']};
            if (data.result2['class_level_idx'] != null){select_class_level_idx = data.result2['class_level_idx']};
            if (data.result2['book_idx'] != null){select_book_idx = data.result2['book_idx']};
            if (data.result2['subject_idx'] != null){select_subject_idx = data.result2['subject_idx']};
            var postdata1 = {
                "belong_idx": belong_idx
            }
            $.ajax({
                type: "POST",
                url: '/class_info/teacher_list',
                data: JSON.stringify(postdata1),
                dataType : 'JSON',
                contentType: "application/json",
                success: function(data2) {
                    var cnt = data2.result2['id_counter'];
                    for (var i = 1; i <= cnt; i++) {
                        if (select_teacher_idx == data2.result2['idx_'+i]){
                            var option= $("<option value='"+data2.result2['idx_'+i]+"' selected>"+data2.result2['teacher_nm_'+i]+"</option>");
                        }else{
                            var option= $("<option value='"+data2.result2['idx_'+i]+"'>"+data2.result2['teacher_nm_'+i]+"</option>");
                        }
                        $('#teacher_info').append(option)
                    }
                },
                error: function(xhr) {
                    console.log('Error occurred while fetching data.');
                }
            });

            if (data.result2['class_status'] != null){$('#class_status').val(data.result2['class_status'])};
            if (data.result2['class_nm'] != null){$('#class_nm').val(data.result2['class_nm'])};
            // if (data.result2['subject_nm'] != null){$('#subject_nm').val(data.result2['subject_nm'])};
            if (data.result2['level_nm'] != null){$('#level_nm').val(data.result2['level_nm'])};

            $.ajax({
                type: "POST",
                url: '/class_info/subject_list',
                data: JSON.stringify(postdata1),
                dataType : 'JSON',
                contentType: "application/json",
                success: function(data2) {
                    var cnt = data2.result2['id_counter'];
                    for (var i = 1; i <= cnt; i++) {
                        if (select_subject_idx == data2.result2['idx_'+i]){
                            var option= $("<option value='"+data2.result2['idx_'+i]+"' selected>"+data2.result2['subject_nm_'+i]+"</option>");
                        }else{
                            var option= $("<option value='"+data2.result2['idx_'+i]+"'>"+data2.result2['subject_nm_'+i]+"</option>");
                        }
                        $('#subject_info').append(option)
                    }
                },
                error: function(xhr) {
                    console.log('Error occurred while fetching data.');
                }
            });


            // $.ajax({
            //     type: "POST",
            //     url: '/class_info/class_level_list',
            //     data: JSON.stringify(postdata1),
            //     dataType : 'JSON',
            //     contentType: "application/json",
            //     success: function(data2) {
            //         var cnt = data2.result2['id_counter'];
            //         for (var i = 1; i <= cnt; i++) {
            //             if (select_class_level_idx == data2.result2['idx_'+i]){
            //                 var option= $("<option value='"+data2.result2['idx_'+i]+"' selected>"+data2.result2['class_level_nm_'+i]+"</option>");
            //             }else{
            //                 var option= $("<option value='"+data2.result2['idx_'+i]+"'>"+data2.result2['class_level_nm_'+i]+"</option>");
            //             }
            //             $('#level_info').append(option)
            //         }
            //     },
            //     error: function(xhr) {
            //         console.log('Error occurred while fetching data.');
            //     }
            // });

            $.ajax({
                type: "POST",
                url: '/class_info/class_level_list',
                data: JSON.stringify(postdata1),
                dataType : 'JSON',
                contentType: "application/json",
                success: function(data2) {
                    var cnt = data2.result2['id_counter'];
                    for (var i = 1; i <= cnt; i++) {
                        if (select_class_level_idx == data2.result2['idx_'+i]){
                            var option= $("<option value='"+data2.result2['idx_'+i]+"' selected>"+data2.result2['class_level_nm_'+i]+"</option>");
                        }else{
                            var option= $("<option value='"+data2.result2['idx_'+i]+"'>"+data2.result2['class_level_nm_'+i]+"</option>");
                        };
                        $('#level_info').append(option);
                        var belong_level = data2.result2['belong_idx_'+i];
                        if (belong_level == belong_idx){
                            $('#academy_level_list').append("<div class='d-flex' id='academy_level_list_"+i+"'>" +
                                "<div><p class='fs--1' style='margin-top: 5px;'>"+data2.result2['class_level_nm_'+i]+"</p></div>" +
                                "<div><span class='fs-1 bi-dash-square-dotted' style='margin-left: 5px;' onclick='level_del(\"academy_level_list_"+i+"\", "+data2.result2['idx_'+i]+")'></span></div>" +
                                "</div>");
                        }
                    }
                },
                error: function(xhr) {
                    console.log('Error occurred while fetching data.');
                }
            });

            if (data.result2['class_limit_student'] != null){$('#class_limit_student').val(data.result2['class_limit_student'])};
            if (data.result2['level_test_yn'] != null){$('#level_test_yn').val(data.result2['level_test_yn'])};
            if (data.result2['level_test_limit'] != null){$('#level_test_limit').val(data.result2['level_test_limit'])};


            if (data.result2['book_dix'] != null){$('#book_nm').attr('src', '/static/file_upload/picture/class_info/'+data.result2['book_dix'])};
            if (data.result2['book_nm'] != null){$('#book_nm').val(data.result2['book_nm'])};

            $.ajax({
                type: "POST",
                url: '/class_info/book_list',
                data: JSON.stringify(postdata1),
                dataType : 'JSON',
                contentType: "application/json",
                success: function(data2) {
                    var cnt = data2.result2['id_counter'];
                    for (var i = 1; i <= cnt; i++) {
                        if (select_book_idx == data2.result2['idx_'+i]){
                            var option= $("<option value='"+data2.result2['idx_'+i]+"' selected>"+data2.result2['book_nm_'+i]+"</option>");
                        }else{
                            var option= $("<option value='"+data2.result2['idx_'+i]+"'>"+data2.result2['book_nm_'+i]+"</option>");
                        }
                        $('#book_info').append(option)
                    }
                },
                error: function(xhr) {
                    console.log('Error occurred while fetching data.');
                }
            });


            if (data.result2['tution_fee'] != null){$('#tution_fee').val(data.result2['tution_fee'])};
            if (data.result2['class_enrolment_start'] != null){$('#class_enrolment_start').val(data.result2['class_enrolment_start'])};
            if (data.result2['class_enrolment_end'] != null){$('#class_enrolment_end').val(data.result2['class_enrolment_end'])};

            if (data.result2['start_date'] != null){$('#start_date').val(data.result2['start_date'])};
            if (data.result2['end_date'] != null){$('#end_date').val(data.result2['end_date'])};
            if (data.result2['class_desc'] != null){$('#class_desc').val(data.result2['class_desc'])};

            var lec_day_arr = [];
            var lec_start_time_arr = [];
            var lec_end_time_arr = [];
            var again_yn_arr = [];
            var lec_day = data.result2['lec_day_arr'];
            var lec_start_time = data.result2['lec_start_time_arr'];
            var lec_end_time = data.result2['lec_end_time_arr'];
            var again_yn = data.result2['again_yn_arr'];

            if (lec_day != null && lec_start_time && lec_end_time){
                lec_day_arr = lec_day.split(',');
                lec_start_time_arr = lec_start_time.split(',');
                lec_end_time_arr = lec_end_time.split(',');
                again_yn_arr = again_yn.split(',');

                for (var i = 0; i < lec_day_arr.length; i++) {
                    div_cnt += 1
                    var lec_day_week = getDayOfWeek(lec_day_arr[i]);
                    var again_yn_ok = again_yn_arr[i];
                    if (again_yn_ok == 'true'){
                        var html = "<div class='d-flex' id='lec_div_cnt_"+i+"'>" +
                                    "<p class=\"fs--1\" id=\"start_date\">매주&nbsp;</p><p class=\"fs--1\" id=\"end_date\" href=\"\">"+lec_day_week+"요일 </p><p class=\"fs--1\" id=\"end_date\" href=\"\">"+lec_start_time_arr[i]+"</p>~<p class=\"fs--1\" id=\"end_date\" href=\"\">"+lec_end_time_arr[i]+"</p>" +
                                    "<input class='form-control' name ='lec_day_result' id='lec_day_"+div_cnt+"' type='hidden' value='"+lec_day_arr[i]+"' />" +
                                    "<input class='form-control' name ='lec_start_time_result' id='lec_start_time_"+div_cnt+"' type='hidden' value='"+lec_start_time_arr[i]+"' />" +
                                    "<input class='form-control' name ='lec_end_time_result' id='lec_end_time_"+div_cnt+"' type='hidden' value='"+lec_end_time_arr[i]+"' />" +
                                    "<input class='form-control' name ='again_yn_result' id='lec_again_"+div_cnt+"' type='hidden' value='"+again_yn_ok+"' />"+
                                    "<span class='fs-1 bi-dash-square-dotted' style='float: right; margin-left: 5px;' onclick='lecture_del(\"lec_div_cnt_"+div_cnt+"\")'></span>" +
                                    "</div>"
                    }else{
                        var html = "<div class='d-flex' id='lec_div_cnt_"+i+"'>" +
                                    "<p class=\"fs--1\" id=\"end_date\">"+lec_day_arr[i]+"</p><p class=\"fs--1\" id=\"end_date\" href=\"\">"+lec_start_time_arr[i]+"</p>~<p class=\"fs--1\" id=\"end_date\" href=\"\">"+lec_end_time_arr[i]+"</p>" +
                                    "<input class='form-control' name ='lec_day_result' id='lec_day_"+div_cnt+"' type='hidden' value='"+lec_day_arr[i]+"' />" +
                                    "<input class='form-control' name ='lec_start_time_result' id='lec_start_time_"+div_cnt+"' type='hidden' value='"+lec_start_time_arr[i]+"' />" +
                                    "<input class='form-control' name ='lec_end_time_result' id='lec_end_time_"+div_cnt+"' type='hidden' value='"+lec_end_time_arr[i]+"' />" +
                                    "<input class='form-control' name ='again_yn_result' id='lec_again_"+div_cnt+"' type='hidden' value='"+again_yn_ok+"' />"+
                                    "<span class='fs-1 bi-dash-square-dotted' style='float: right; margin-left: 5px;' onclick='lecture_del(\"lec_div_cnt_"+div_cnt+"\")'></span>" +
                                    "</div>"
                    }
                    $('#lecture_day_week').append(html);
                }
            }
            console.log("div_cnt_ready:", div_cnt)

        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
}

function class_info_close(class_idx){
    var postdata = {
        "class_idx": class_idx
    }
    $.ajax({
        type: "POST",
        url: '/class_info/class_info_close',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data2) {
            alert("수업이 정상적으로 종료되었습니다.")
            location.href="/class_info/class_info_normal";
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
}

const class_info_form_data = new FormData();
function class_info_mod(class_idx){
    var lec_day_arr = [];
    var lec_start_time_arr = [];
    var lec_end_time_arr = [];
    var again_yn_arr = [];
    console.log("div_cnt_mod", div_cnt);

    $("input[name='lec_day_result']").each(function (i) {
        lec_day_arr.push($("input[name='lec_day_result']").eq(i).attr("value"));
    });

    $("input[name='lec_start_time_result']").each(function (i) {
        lec_start_time_arr.push($("input[name='lec_start_time_result']").eq(i).attr("value"));
    });

    $("input[name='lec_end_time_result']").each(function (i) {
        lec_end_time_arr.push($("input[name='lec_end_time_result']").eq(i).attr("value"));
    });

    $("input[name='again_yn_result']").each(function (i) {
        again_yn_arr.push($("input[name='again_yn_result']").eq(i).attr("value"));
    });

    console.log(lec_day_arr, lec_start_time_arr, lec_end_time_arr, again_yn_arr)

    //
    // for (var i = 1; i <= div_cnt; i++) {
    //     console.log(i);
    //     var lec_day = $('#lec_day_'+i).val();
    //     console.log(lec_day);
    //     lec_day_arr.push(lec_day);
    //     var lec_start_time = $('#lec_start_time_'+i).val();
    //     lec_start_time_arr.push(lec_start_time);
    //     var lec_end_time = $('#lec_end_time_'+i).val();
    //     lec_end_time_arr.push(lec_end_time);
    //     var again_yn = $('#lec_again_'+i).val();
    //     again_yn_arr.push(again_yn);
    // }
    //
    // console.log(lec_day_arr)
    // console.log(lec_start_time_arr)
    // console.log(lec_end_time_arr)
    // console.log(again_yn_arr)
    var class_nm = document.getElementById('class_nm').value;
    var teacher_info = document.getElementById("teacher_info").value;
    var class_enrolment_start = document.getElementById('class_enrolment_start').value;
    var class_enrolment_end = document.getElementById('class_enrolment_end').value

    if (class_nm == "" || teacher_info == ""){
        alert("필수값을 체크하세요.");
    }else{
        class_info_form_data.append('teacher_info', document.getElementById("teacher_info").value);
        class_info_form_data.append('class_nm', document.getElementById('class_nm').value);
        class_info_form_data.append('subject_info', document.getElementById('subject_info').value);
        class_info_form_data.append('level_info', document.getElementById('level_info').value);
        class_info_form_data.append('class_limit_student', document.getElementById('class_limit_student').value);

        class_info_form_data.append('level_test_yn', document.getElementById('level_test_yn').value);
        class_info_form_data.append('level_test_limit', document.getElementById('level_test_limit').value);
        class_info_form_data.append('book_info', document.getElementById('book_info').value);
        class_info_form_data.append('tution_fee', document.getElementById('tution_fee').value);
        class_info_form_data.append('class_enrolment_start', document.getElementById('class_enrolment_start').value);

        class_info_form_data.append('class_enrolment_end', document.getElementById('class_enrolment_end').value);
        class_info_form_data.append('start_date', document.getElementById('start_date').value);
        class_info_form_data.append('end_date', document.getElementById('end_date').value);
        class_info_form_data.append('class_desc', document.getElementById('class_desc').value);
        class_info_form_data.append('lec_day_arr', lec_day_arr);
        class_info_form_data.append('lec_start_time_arr', lec_start_time_arr);
        class_info_form_data.append('lec_end_time_arr', lec_end_time_arr);
        class_info_form_data.append('again_yn_arr', again_yn_arr);
        class_info_form_data.append('class_idx', class_idx);

        $.ajax({
            type: "POST",
            url: '/class_info/class_mod_save',
            data: class_info_form_data,
            dataType : 'JSON',
            contentType: false,
            cache:  false,
            processData: false,
            success: function(response) {
                alert("정상적으로 등록되었습니다.");
                location.href="/class_info/class_info_predetail?class_idx="+class_idx;
            },
            error: function(xhr) {
                console.log('Error occurred while fetching data.');
            }
        });
    }
}

function class_info_create_ready(){
    var postdata1 = {
        "belong_idx": belong_idx
    }
    $.ajax({
        type: "POST",
        url: '/class_info/teacher_list',
        data: JSON.stringify(postdata1),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data2) {
            var cnt = data2.result2['id_counter'];
            for (var i = 1; i <= cnt; i++) {
                var option= $("<option value='"+data2.result2['idx_'+i]+"'>"+data2.result2['teacher_nm_'+i]+"</option>");
                $('#teacher_info').append(option)
            }
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });

    $.ajax({
        type: "POST",
        url: '/class_info/class_level_list',
        data: JSON.stringify(postdata1),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data2) {
            var cnt = data2.result2['id_counter'];
            for (var i = 1; i <= cnt; i++) {
                var option= $("<option value='"+data2.result2['idx_'+i]+"'>"+data2.result2['class_level_nm_'+i]+"</option>");
                $('#level_info').append(option);
                var belong_level = data2.result2['belong_idx_'+i];
                if (belong_level == belong_idx){
                    $('#academy_level_list').append("<div class='d-flex' id='academy_level_list_"+i+"'>" +
                                                        "<div><p class='fs--1' style='margin-top: 5px;'>"+data2.result2['class_level_nm_'+i]+"</p></div>" +
                                                        "<div><span class='fs-1 bi-dash-square-dotted' style='margin-left: 5px;' onclick='level_del(\"academy_level_list_"+i+"\", "+data2.result2['idx_'+i]+")'></span></div>" +
                                                    "</div>");
                }
            }
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });

    $.ajax({
        type: "POST",
        url: '/class_info/book_list',
        data: JSON.stringify(postdata1),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data2) {
            var cnt = data2.result2['id_counter'];
            for (var i = 1; i <= cnt; i++) {
                var option= $("<option value='"+data2.result2['idx_'+i]+"'>"+data2.result2['book_nm_'+i]+"</option>");
                $('#book_info').append(option)
            }
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });

    $.ajax({
        type: "POST",
        url: '/class_info/subject_list',
        data: JSON.stringify(postdata1),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data2) {
            var cnt = data2.result2['id_counter'];
            for (var i = 1; i <= cnt; i++) {
                var option= $("<option value='"+data2.result2['idx_'+i]+"'>"+data2.result2['subject_nm_'+i]+"</option>");
                $('#subject_info').append(option)
            }
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
}

function level_del(div_cnt, option_value){
    $('#'+div_cnt+'').remove();
    $("select#level_info option[value='"+option_value+"']").remove();
    var postdata = {
        "academy_level_idx": option_value
    }
    $.ajax({
        type: "POST",
        url: '/class_info/class_level_del',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data2) {
            alert("정상적으로 삭제되었습니다.");
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
}

function level_add(){
    var level_nm = $('#level_list_add').val();
    console.log(level_nm);
    var postdata = {
        "belong_idx": belong_idx,
        "level_nm": level_nm
    }
    $.ajax({
        type: "POST",
        url: '/class_info/class_level_add',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data2) {
            var option= $("<option value='"+data2.result2['idx']+"'>"+level_nm+"</option>");
            $('#level_info').append(option);
            $('#academy_level_list').append("<div class='d-flex' id='academy_level_list_" + data2.result2['idx'] + "'>" +
                "<div><p class='fs--1' style='margin-top: 5px;'>" + level_nm+ "</p></div>" +
                "<div><span class='fs-1 bi-dash-square-dotted' style='margin-left: 5px;' onclick='level_del(\"academy_level_list_" + data2.result2['idx'] + "\", " + data2.result2['idx'] + ")'></span></div>" +
                "</div>");
            alert("정상적으로 추가되었습니다.");
            $('#level_list_add').val("");
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });

}

var div_cnt = 0;

function lecture_add(){
    div_cnt +=1;
    if (div_cnt <= 10){
        var lec_day = $('#lec_day').val();
        var day_week_text = getDayOfWeek(lec_day);
        var lec_start_time = $('#lec_start_time').val();
        var lec_end_time = $('#lec_end_time').val();

        var again_yn;
        var lec_again_check = $('#lec_check').is(':checked');

        if (lec_again_check == true){
            again_yn = "매주"
        }else{
            again_yn = lec_day
        }

        if (lec_day =="" || lec_start_time == "" || lec_end_time == ""){
            alert("요일과 시간을 선택하세요.");
        }else{
            var html="<div id='lec_div_day_"+div_cnt+"' style='margin-bottom: 5px;'>" +
                "<div class='d-flex'>" +
                "<p class=\"fs--1\">"+again_yn+"&nbsp;</p><p class=\"fs--1\"> "+day_week_text+"요일 </p><p class=\"fs--1\"> "+lec_start_time+"</p>~<p class=\"fs--1\">"+lec_end_time+"</p>"+
                "<input class='form-control' name ='lec_day_result' id='lec_day_"+div_cnt+"' type='hidden' value='"+lec_day+"' />" +
                "<input class='form-control' name ='lec_start_time_result' id='lec_start_time_"+div_cnt+"' type='hidden' value='"+lec_start_time+"' />" +
                "<input class='form-control' name ='lec_end_time_result' id='lec_end_time_"+div_cnt+"' type='hidden' value='"+lec_end_time+"' />" +
                "<input class='form-control' name ='again_yn_result' id='lec_again_"+div_cnt+"' type='hidden' value='"+lec_again_check+"' /><span class='fs-1 bi-dash-square-dotted' style='float: right; margin-left: 5px;' onclick='lecture_del(\"lec_div_day_"+div_cnt+"\")'></span>" +
                "</div>" +
                "</div>";
            $('#lecture_day_week').append(html);
            $('input[name="lec_again_check"]').removeAttr('checked');
            $('#lec_day').val("");
            $('#lec_start_time').val("");
            $('#lec_end_time').val("");
        }
    }else if (div_cnt > 10){
        alert("시간표 등록은 최대 10개까지 등록할 수 있습니다.");
    }
}

function lecture_del(div_cnt_del){
    div_cnt -=1;
    $('#'+div_cnt_del).remove();
}

function start_set(){
    var start_day = $('#start_date').val();
    $('#lec_day').val(start_day);
}

function class_info_create(){
    var lec_day_arr = [];
    var lec_start_time_arr = [];
    var lec_end_time_arr = [];
    var again_yn_arr = [];

    $("input[name='lec_day_result']").each(function (i) {
        lec_day_arr.push($("input[name='lec_day_result']").eq(i).attr("value"));
    });
    $("input[name='lec_start_time_result']").each(function (i) {
        lec_start_time_arr.push($("input[name='lec_start_time_result']").eq(i).attr("value"));
    });
    $("input[name='lec_end_time_result']").each(function (i) {
        lec_end_time_arr.push($("input[name='lec_end_time_result']").eq(i).attr("value"));
    });
    $("input[name='again_yn_result']").each(function (i) {
        again_yn_arr.push($("input[name='again_yn_result']").eq(i).attr("value"));
    });

    var class_nm = document.getElementById('class_nm').value;
    var teacher_info = document.getElementById("teacher_info").value;
    var class_enrolment_start = document.getElementById('class_enrolment_start').value;
    var class_enrolment_end = document.getElementById('class_enrolment_end').value

    if (class_nm == "" || teacher_info == ""){
        alert("필수값을 체크하세요.");
    }else{
        class_info_form_data.append('teacher_info', document.getElementById("teacher_info").value);
        class_info_form_data.append('class_nm', document.getElementById('class_nm').value);
        class_info_form_data.append('subject_info', document.getElementById('subject_info').value);
        class_info_form_data.append('level_info', document.getElementById('level_info').value);
        class_info_form_data.append('class_limit_student', document.getElementById('class_limit_student').value);

        class_info_form_data.append('level_test_yn', document.getElementById('level_test_yn').value);
        class_info_form_data.append('level_test_limit', document.getElementById('level_test_limit').value);
        class_info_form_data.append('book_info', document.getElementById('book_info').value);
        class_info_form_data.append('tution_fee', document.getElementById('tution_fee').value);
        class_info_form_data.append('class_enrolment_start', document.getElementById('class_enrolment_start').value);

        class_info_form_data.append('class_enrolment_end', document.getElementById('class_enrolment_end').value);
        class_info_form_data.append('start_date', document.getElementById('start_date').value);
        class_info_form_data.append('end_date', document.getElementById('end_date').value);
        class_info_form_data.append('class_desc', document.getElementById('class_desc').value);
        class_info_form_data.append('lec_day_arr', lec_day_arr);
        class_info_form_data.append('lec_start_time_arr', lec_start_time_arr);
        class_info_form_data.append('lec_end_time_arr', lec_end_time_arr);
        class_info_form_data.append('again_yn_arr', again_yn_arr);

        class_info_form_data.append('belong_idx', belong_idx);


        $.ajax({
            type: "POST",
            url: '/class_info/class_info_create_save',
            data: class_info_form_data,
            dataType : 'JSON',
            contentType: false,
            cache:  false,
            processData: false,
            success: function(response) {
                alert("정상적으로 등록되었습니다.");
                location.href="/class_info/class_info_normal";
            },
            error: function(xhr) {
                console.log('Error occurred while fetching data.');
            }
        });
    }
}

function check_select(){
    var level_test_yn = $('#level_test_yn').val();
    if (level_test_yn == 0){
        $('#level_test_limit').css('display', 'none');
    }else{
        $('#level_test_limit').css('display', 'block');
    }
}


const textarea = document.getElementById('class_desc');
const remainingCharsSpan = document.getElementById('remainingChars');
const maxChars = 500; // 최대 글자수 설정

textarea.addEventListener('input', function() {
    const currentChars = textarea.value.length;
    const charsLeft = maxChars - currentChars;
    console.log(charsLeft);
    remainingCharsSpan.textContent = "내용("+charsLeft+"자)";

    if (charsLeft < 0) {
        textarea.value = textarea.value.substring(0, maxChars);
        remainingCharsSpan.textContent = "내용("+0+"자)";
        alert("입력 글자수를 초과하였습니다.");
        return false;
    }
});