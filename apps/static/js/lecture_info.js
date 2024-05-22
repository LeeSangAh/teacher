
var current_page_ready;
function lecture_info_ready(page, belong_idx, class_idx){
    $.ajax({
        url: '/lecture_info/lecture_info_list_ready',
        type: 'GET',
        data: {page: page, belong_idx: belong_idx, class_idx: class_idx},

        success: function(response) {

            current_page_ready = response.page;
            $('#data-container-ready').append(response.data);
            $('#ready_paging_info').html('수업 예정 ('+response.total+'개)');
            if (response.post_cnt < 9) {
                $("#load-more-ready-button-div").css('display', 'none');
                if (current_page_ready >1 ) {
                    $("#ready-nomore-div").append("<p class=\"fs--1\" style='text-align: center; margin-top: 20px;'>더 이상 등록된 수업이 없습니다.</p>");
                }
            }
            console.log(current_page_ready);
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
};

var current_page_close;

function lecture_info_close(page, belong_idx, class_idx){
    $.ajax({
        url: '/lecture_info/lecture_info_list_close',
        type: 'GET',
        data: {page: page, belong_idx: belong_idx, class_idx:class_idx},
        success: function(response) {
            current_page_close = response.page;
            $('#data-container-close').append(response.data);
            $('#close_paging_info').html('수업 종료 ('+response.total+'개 )');
            if (response.post_cnt < 9) {
                $("#load-more-close-button-div").css('display', 'none');
                if (current_page_close >1 ) {
                    $("#close-nomore-div").append("<p class=\"fs--1\" style='text-align: center; margin-top: 20px;'>더 이상 등록된 수업이 없습니다.</p>");
                }
            }
            console.log(current_page_close);
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
}

$('#load-more-ready').click(function() {
    var class_idx = $('#class_select').val();
    lecture_info_ready(current_page_ready+1, belong_idx, class_idx);
});

$('#load-more-close').click(function() {
    var class_idx = $('#class_select').val();
    lecture_info_close(current_page_close+1, belong_idx, class_idx);
});

function class_list(){
    var postdata = {
        "belong_idx": belong_idx
    }
    $.ajax({
        type: 'POST',
        url: '/lecture_info/class_list',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data) {
            var c = data.result2['id_counter'];
            for (var i = 1; i <= c; i++) {
                var option= $("<option value='"+data.result2['idx_'+i]+"'>"+data.result2['class_nm_'+i]+"</option>");
                $("#class_select").append(option);
            }
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
            // location.href="/index"
        }
    });
}

function class_info_change(){
    var class_idx = $('#class_select').val();
    $('#data-container-ready').empty();
    $('#data-container-close').empty();
    $('#ready-nomore-div').empty();
    $('#close-nomore-div').empty();
    $("#load-more-ready-button-div").css('display', 'block');
    $("#load-more-close-button-div").css('display', 'block');
    current_page_ready =0;
    current_page_close =0;
    lecture_info_ready(1, belong_idx, class_idx);
    lecture_info_close(1, belong_idx, class_idx);
}


var current_page_attendance_y;
function attendance_info_y(page, lecture_idx){
    console.log("lecture_idx", lecture_idx)
    $.ajax({
        url: '/lecture_info/lecture_info_attendance_y',
        type: 'GET',
        data: {page: page, lecture_idx: lecture_idx},
        success: function(response) {
            current_page_attendance_y = response.page;
            $('#data-container-attendance_y').append(response.data);
            $('#attendance_y_paging_info').html('출석 ('+response.total+'명)');
            if(response.post_cnt == 0){
                $("#status_select_01_div").css('display', 'none');
            }
            if (response.post_cnt < 9) {
                $("#load-more-attendance-y-div").css('display', 'none');
                if (current_page_attendance_y > 1 ) {
                    $("#attendance-y-nomore-div").append("<p class=\"fs--1\" style='text-align: center; margin-top: 20px;'>더 이상 등록된 학생이 없습니다.</p>");
                }
            }

        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
};

var current_page_attendance_n;
function attendance_info_n(page, class_idx, lecture_idx){
    console.log("class_idx", class_idx)
    $.ajax({
        url: '/lecture_info/lecture_info_attendance_n',
        type: 'GET',
        data: {page: page, class_idx: class_idx, lecture_idx: lecture_idx},
        success: function(response) {
            current_page_attendance_n = response.page;
            $('#data-container-attendance_n').append(response.data);
            $('#attendance_n_paging_info').html('결석 ('+response.total+'명)');
            if(response.post_cnt == 0){
                $("#status_select_02_div").css('display', 'none');
            }
            if (response.post_cnt < 9) {
                $("#load-more-attendance-n-div").css('display', 'none');
                if (current_page_attendance_n > 1 ) {
                    $("#attendance-n-nomore-div").append("<p class=\"fs--1\" style='text-align: center; margin-top: 20px;'>더 이상 등록된 학생이 없습니다.</p>");
                }
            }
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
};

var current_page_attendance_all;
function attendance_info_all(page, class_idx){
    console.log("class_idx", class_idx)
    $.ajax({
        url: '/lecture_info/lecture_info_attendance_all',
        type: 'GET',
        data: {page: page, class_idx: class_idx},
        success: function(response) {
            current_page_attendance_n = response.page;
            $('#data-container-attendance_all').append(response.data);
            $('#attendance_all_paging_info').html('수강생 ('+response.total+'명)');
            if(response.post_cnt == 0){
                $("#status_select_03_div").css('display', 'none');
            }
            if (response.post_cnt < 9) {
                $("#load-more-attendance-all-div").css('display', 'none');
                if (current_page_attendance_all > 1 ) {
                    $("#attendance-all-nomore-div").append("<p class=\"fs--1\" style='text-align: center; margin-top: 20px;'>더 이상 등록된 학생이 없습니다.</p>");
                }
            }
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
};

$('#load-more-attendance-y').click(function() {
    var lecture_idx = $('#lecture_idx').val();
    attendance_info_y(current_page_attendance_y+1, lecture_idx);
});

$('#load-more-attendance-n').click(function() {
    var class_idx = $('#class_idx').val();
    var lecture_idx = $('#lecture_idx').val();
    attendance_info_n(current_page_attendance_n+1, class_idx, lecture_idx);
});

$('#load-more-attendance-all').click(function() {
    var class_idx = $('#class_idx').val();
    attendance_info_all(current_page_attendance_all+1, class_idx);
});

function lecture_info_detail(lecture_idx){
    var postdata = {
        "lecture_idx": lecture_idx
    }
    $.ajax({
        type: 'POST',
        url: '/lecture_info/lecture_info_detail',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data) {
            if (data.result2['lecture_day'] != null){$('#lecture_day').val(data.result2['lecture_day'])};
            if (data.result2['lecture_start_time'] != null){$('#lecture_start_time').val(data.result2['lecture_start_time'])};
            if (data.result2['lecture_end_time'] != null){$('#lecture_end_time').val(data.result2['lecture_end_time'])};
            if (data.result2['lecture_desc'] != null){$('#lecture_desc').val(data.result2['lecture_desc'])};

            if (data.result2['homework_title'] != null){$('#homework_title').val( data.result2['homework_title'])};
            if (data.result2['homework_detail'] != null){$('#homework_detail').val(data.result2['homework_detail'])};

            var c = data.result2['id_counter'];
            for (var i = 1; i <= c; i++) {
                    $('#lecture_attach_div').before('<div id="attach_'+data.result2['attach_idx_'+i]+'"><a class="fs--1" id="lecture_attach_'+i+'" href="/static/file_upload/lecture/'+data.result2['attach_path_'+i]+'" download>'+data.result2['attach_path_'+i]+'</a>' +
                        '<span class="fs-1 bi-dash-square-dotted" style="margin-left: 5px;" onclick="lefture_attach_del('+data.result2['attach_idx_'+i]+')"></span></div>');
                    lecture_file_cnt +=1;
            }

            var sh_c = data.result2['sh_id_counter'];
            if (sh_c == 0 || sh_c == null){
                simple_homework_add();
            }
            for (var j = 1; j <= sh_c; j++) {
                var div_id = "simple_homework_"+homework_cnt;
                $('#simple_homework_div').after('<div class="d-flex" style="margin-bottom: 2px;" id='+div_id+'>' +
                                                    '<input class="mb-0 form-control form-control-sm" name="simple_homework_input" value="'+data.result2['simple_homework_title_'+j]+'" placeholder="숙제 제목을 입력하세요. (최대 100자)" maxlength="100">\n' +
                                                    '</span><span class="fs-1 bi-dash-square-dotted" style="margin-left: 5px;" onclick="simple_homework_del('+div_id+');"></span>' +
                                                '</div>');
                homework_cnt +=1;
            }

            if (data.result2['homework_start_date'] != null){$('#homework_start_date').val(data.result2['homework_start_date'])};
            if (data.result2['homework_end_date'] != null){$('#homework_end_date').val(data.result2['homework_end_date'])};

        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
            // location.href="/index"
        }
    });
}

function lefture_attach_del(lecture_attach_idx){
    var postdata = {
        "lecture_attach_idx": lecture_attach_idx
    }
    console.log(lecture_attach_idx);
    $.ajax({
        type: 'POST',
        url: '/lecture_info/lecture_attach_del',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(response) {
           alert("수업 자료가 정상적으로 삭제되었습니다.");
           $('#attach_'+lecture_attach_idx).remove();
            lecture_file_cnt -= 1;

            console.log(lecture_file_cnt);
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
}

function selectAll_attendance_y(selectAll)  {
    const checkboxes = document.getElementsByName('attendance_y_check');
    checkboxes.forEach((checkbox) => {
        checkbox.checked = selectAll.checked;
    })
};

function selectAll_attendance_n(selectAll)  {
    const checkboxes = document.getElementsByName('attendance_n_student_check');
    checkboxes.forEach((checkbox) => {
        checkbox.checked = selectAll.checked;
    })
};

function selectAll_attendance_all(selectAll){
    const checkboxes = document.getElementsByName('attendance_all_student_check');
    checkboxes.forEach((checkbox) => {
        checkbox.checked = selectAll.checked;
    })
}

function selectAll_homework_all(selectAll){
    const checkboxes = document.getElementsByName('homework_n_student_check');
    checkboxes.forEach((checkbox) => {
        checkbox.checked = selectAll.checked;
    })
}

function status_select_01(){
    $('#status_select_01_div').css('display','block');
    $('#status_select_02_div').css('display','none');
    $('#status_select_03_div').css('display','none');
};

function status_select_02(){
    $('#status_select_02_div').css('display','block');
    $('#status_select_01_div').css('display','none');
    $('#status_select_03_div').css('display','none');
};

function status_select_03(){
    $('#status_select_03_div').css('display','block');
    $('#status_select_02_div').css('display','none');
    $('#status_select_01_div').css('display','none');
};

let lecture_file = new Array();
const lecture_attach_form_data = new FormData();
let lecture_file_cnt = 0;

function lecture_attach_reg(input) {
    if (lecture_file_cnt >= 5){
        alert("수업 자료는 최대 5개까지 등록 가능합니다.");
    }else{
        let maxSize = 2 * 1024 * 1024; //* 5MB 사이즈 제한
        let fileSize = input.files[0].size; //업로드한 파일용량

        if(fileSize > maxSize){
            alert("파일첨부 사이즈는 5MB 이내로 가능합니다.");
            $('#file').val('');
            return;
        }else{
            lecture_file.push(input.files[0]);	//선택된 파일 가져오기
            lecture_attach_form_data.append('file', document.getElementById('file').files[0]);
            lecture_attach_form_data.append('lecture_idx', document.getElementById('lecture_idx').value);

            $.ajax({
                type: "POST",
                url: '/lecture_info/lecture_attach_add',
                data: lecture_attach_form_data,
                dataType : 'JSON',
                contentType: false,
                cache:  false,
                processData: false,
                success: function(data) {
                    var attach_yn = data.result3;
                    if (attach_yn == "fail"){
                        alert("등록할 수 없는 종류의 첨부파일입니다.");
                    }else if(attach_yn == ""){
                        $('#lecture_attach_div').before('<div id="attach_'+data.attach_idx+'"><a class="fs--1" id="lecture_attach" href="/static/file_upload/lecture/'+data.attach_path+'" download>'+data.attach_path+'</a>' +
                            '<span class="fs-1 bi-dash-square-dotted" style="margin-left: 5px;" onclick="lefture_attach_del('+data.attach_idx+')"></span></div>');
                        alert("수업 자료가 정상적으로 등록되었습니다.");
                    }
                },
                error: function(xhr) {
                    console.log('Error occurred while fetching data.');
                }
            });

        lecture_attach_form_data.delete('file[]');
        lecture_file = [];
        lecture_file_cnt +=1;
        $('#file').val('');
        }
    }
};

const lecture_info_form_data = new FormData();
function lecture_info_mod(lecture_idx, class_idx, lecture_day, lecture_start_time, class_nm){
    var simple_homework_arr = [];

    $("input[name=simple_homework_input]").each(function() {
        var homework = $(this).val();
        simple_homework_arr.push(homework);
    });
    console.log(simple_homework_arr);

    lecture_info_form_data.append('lecture_day', document.getElementById('lecture_day').value);
    lecture_info_form_data.append('lecture_start_time', document.getElementById('lecture_start_time').value);
    lecture_info_form_data.append('lecture_end_time', document.getElementById('lecture_end_time').value);
    lecture_info_form_data.append('lecture_desc', document.getElementById('lecture_desc').value);

    lecture_info_form_data.append('simple_homework_arr', simple_homework_arr);
    lecture_info_form_data.append('homework_title', document.getElementById('homework_title').value);
    lecture_info_form_data.append('homework_detail', document.getElementById('homework_detail').value);
    lecture_info_form_data.append('homework_start_date', document.getElementById('homework_start_date').value);
    lecture_info_form_data.append('homework_end_date', document.getElementById('homework_end_date').value);

    lecture_info_form_data.append('simple_homework_arr', simple_homework_arr);
    lecture_info_form_data.append('lecture_idx', lecture_idx);
    lecture_info_form_data.append('class_idx', class_idx);

    $.ajax({
        type: "POST",
        url: '/lecture_info/lecture_mod_save',
        data: lecture_info_form_data,
        dataType : 'JSON',
        contentType: false,
        cache:  false,
        processData: false,
        success: function(response) {
            alert("정상적으로 등록되었습니다.");
            location.href="/lecture_info/lecture_info_predetail?lecture_idx="+lecture_idx+"&class_idx="+class_idx+"&lecture_day="+lecture_day+"&lecture_start_time="+lecture_start_time+"&class_nm="+class_nm
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
}

function feedback_save(){
    var feedback_ready = $('input[name=lecture_ready_feedback]:checked').val();
    var feedback_parti = $('input[name=lecture_parti_feedback]:checked').val();
    var feedback_present = $('input[name=lecture_present_feedback]:checked').val();
    var feedback_total = $('#lecture_total_feedback').val();

    var feedback_ready_yn = $('input[name=lecture_ready_feedback]').is(":checked");
    var feedback_parti_yn = $('input[name=lecture_parti_feedback]').is(":checked");
    var feedback_present_yn = $('input[name=lecture_present_feedback]').is(":checked");

    var chk_arr_attendance = [];

    $("input[name=attendance_y_check]:checked").each(function() {
        var chk = $(this).val();
        chk_arr_attendance.push(chk);
    });

    if (chk_arr_attendance.length >= 1){
        if (feedback_ready_yn == false && feedback_parti_yn == false && feedback_present_yn == false && feedback_total == ""){
            alert("피드백할 항목 1개 이상은 작성해주세요.");
        }else{
            var postdata = {
                "feedback_ready": feedback_ready,
                "feedback_parti": feedback_parti,
                "feedback_present": feedback_present,
                "feedback_total": feedback_total,
                "chk_arr_attendance": chk_arr_attendance
            }
            $.ajax({
                type: 'POST',
                url: '/lecture_info/lecture_feedback_save',
                data: JSON.stringify(postdata),
                dataType : 'JSON',
                contentType: "application/json",
                success: function(data) {
                    alert("성공적으로 입력되었습니다.");
                    $('#feedback-modal').modal('hide');
                    $("input[name='attendance_y_check']").removeAttr('checked');
                },
                error: function(xhr) {
                    console.log('Error occurred while fetching data.');
                }
            });
        }
    }else{
        alert("피드백할 학생들을 선택하세요.");
    }
}

function attendance_apply(lecture_idx){
    var chk_arr = [];
    $("input[name=attendance_n_student_check]:checked").each(function() {
        var chk = $(this).val();
        chk_arr.push(chk);
    });
    var lecture_day = $('#lecture_day').val();
    var attendance_start_time = lecture_day+" "+$('#attendance_start_time').val()+":00";
    var attendance_end_time = lecture_day+" "+$('#attendance_end_time').val()+":00";

    if (chk_arr.length >= 1) {
        var postdata = {
            "chk_arr": chk_arr,
            "attendance_start_time": attendance_start_time,
            "attendance_end_time": attendance_end_time,
            "lecture_idx": lecture_idx
        }
        $.ajax({
            type: 'POST',
            url: '/lecture_info/lecture_attendance_save',
            data: JSON.stringify(postdata),
            dataType: 'JSON',
            contentType: "application/json",
            success: function (data) {
                alert("성공적으로 입력되었습니다.");
                location.reload(true);
            },
            error: function (xhr) {
                console.log('Error occurred while fetching data.');
            }
        });
    }else{
        alert("출석할 학생을 선택하세요.");
    }
}

let homework_cnt = 0;

function simple_homework_add(){
    if (homework_cnt <= 9 ){
    var div_id = "simple_homework_"+homework_cnt;
    $('#simple_homework_div').after('<div class="d-flex" style="margin-bottom: 2px;" id='+div_id+'><input class="mb-0 form-control form-control-sm" name="simple_homework_input" placeholder="숙제 제목을 입력하세요. (최대 100자)" maxlength="100">\n' +
                                    '</span><span class="fs-1 bi-dash-square-dotted" style="margin-left: 5px;" onclick="simple_homework_del('+div_id+');"></span>' +
                                    '</div>');
    homework_cnt += 1;
    }else{
        alert("숙제는 최대 10개까지 입력할 수 있습니다.");
    }
}

function simple_homework_del(del_div){
    $(del_div).remove();
    homework_cnt -= 1;
}

var textarea1 = document.getElementById('lecture_desc');
var remainingCharsSpan1 = document.getElementById('remainingChars1');
var maxChars1 = 250; // 최대 글자수 설정

textarea1.addEventListener('input', function() {
    var currentChars = textarea1.value.length;
    var charsLeft = maxChars1 - currentChars;
    console.log(charsLeft);
    remainingCharsSpan1.textContent = "내용("+charsLeft+"자)";

    if (charsLeft < 0) {
        textarea1.value = textarea1.value.substring(0, maxChars1);
        remainingCharsSpan1.textContent = "내용("+0+"자)";
        alert("입력 글자수를 초과하였습니다.");
        return false;
    }
});

var textarea2 = document.getElementById('homework_detail');
var remainingCharsSpan2 = document.getElementById('remainingChars2');
var maxChars2 = 250; // 최대 글자수 설정

textarea2.addEventListener('input', function() {
    var currentChars = textarea2.value.length;
    var charsLeft = maxChars2 - currentChars;
    console.log(charsLeft);
    remainingCharsSpan2.textContent = "내용("+charsLeft+"자)";

    if (charsLeft < 0) {
        textarea2.value = textarea2.value.substring(0, maxChars2);
        remainingCharsSpan2.textContent = "내용("+0+"자)";
        alert("입력 글자수를 초과하였습니다.");
        return false;
    }
});

var textarea3 = document.getElementById('lecture_total_feedback');
var remainingCharsSpan3 = document.getElementById('remainingChars3');
var maxChars3 = 250; // 최대 글자수 설정

textarea3.addEventListener('input', function() {
    var currentChars = textarea3.value.length;
    var charsLeft = maxChars3 - currentChars;
    console.log(charsLeft);
    remainingCharsSpan3.textContent = "내용("+charsLeft+"자)";

    if (charsLeft < 0) {
        textarea3.value = textarea3.value.substring(0, maxChars3);
        remainingCharsSpan3.textContent = "내용("+0+"자)";
        alert("입력 글자수를 초과하였습니다.");
        return false;
    }
});