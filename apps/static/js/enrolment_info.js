function class_list(belong_idx){
    var postdata1 = {
        "belong_idx": belong_idx
    }
    $.ajax({
        type: "POST",
        url: '/enrolment_info/class_list',
        data: JSON.stringify(postdata1),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data) {
            var cnt = data.result2['id_counter'];
            for (var i = 1; i <= cnt; i++) {
                var status_nm;
                var status = data.result2['status_'+i];
                if (status == 0){
                    status_nm = "폐강"
                }else if(status == 1){
                    status_nm = "강의중"
                }
                var option= $("<option value='"+data.result2['idx_'+i]+"'>"+data.result2['class_nm_'+i]+" ("+status_nm+")</option>");
                $('#class_select').append(option)
            }
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
}

function class_list2(belong_idx, class_idx){
    var postdata1 = {
        "belong_idx": belong_idx
    }
    $.ajax({
        type: "POST",
        url: '/enrolment_info/class_list',
        data: JSON.stringify(postdata1),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data) {
            var cnt = data.result2['id_counter'];
            for (var i = 1; i <= cnt; i++) {
                var status_nm;
                var status = data.result2['status_'+i];
                if (status == 0){
                    status_nm = "폐강"
                }else if(status == 1){
                    status_nm = "강의중"
                }
                if (class_idx == data.result2['idx_'+i]){
                    var option= $("<option value='"+data.result2['idx_'+i]+"' selected>"+data.result2['class_nm_'+i]+" ("+status_nm+")</option>");
                }else{
                    var option= $("<option value='"+data.result2['idx_'+i]+"'>"+data.result2['class_nm_'+i]+" ("+status_nm+")</option>");
                }
                $('#class_select').append(option)
            }
            enrolment_info_standby(1, belong_idx);
            enrolment_info_student(1, belong_idx);
            enrolment_info_completion(1, belong_idx);
            enrolment_info_out(1, belong_idx);
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
}

function status_select_01(){
    $('#status_select_01_div').css('display','block');
    $('#status_select_02_div').css('display','none');
    $('#status_select_03_div').css('display','none');
    $('#status_select_04_div').css('display','none');
};

function status_select_02(){
    $('#status_select_02_div').css('display','block');
    $('#status_select_01_div').css('display','none');
    $('#status_select_03_div').css('display','none');
    $('#status_select_04_div').css('display','none');
};

function status_select_03(){
    $('#status_select_03_div').css('display','block');
    $('#status_select_02_div').css('display','none');
    $('#status_select_01_div').css('display','none');
    $('#status_select_04_div').css('display','none');
};

function status_select_04(){
    $('#status_select_03_div').css('display','none');
    $('#status_select_02_div').css('display','none');
    $('#status_select_01_div').css('display','none');
    $('#status_select_04_div').css('display','block');
};

function selectAll(selectAll)  {
    const checkboxes
        = document.getElementsByName('standby_student_check');
    checkboxes.forEach((checkbox) => {
        checkbox.checked = selectAll.checked;
    })
};

function selectAll_student(selectAll)  {
    const checkboxes
        = document.getElementsByName('student_check');
    checkboxes.forEach((checkbox) => {
        checkbox.checked = selectAll.checked;
    })
};

function selectAll_completion(selectAll){
    const checkboxes
        = document.getElementsByName('completion_student_check');
    checkboxes.forEach((checkbox) => {
        checkbox.checked = selectAll.checked;
    })
}

function selectAll_out(selectAll){
    const checkboxes
        = document.getElementsByName('out_student_check');
    checkboxes.forEach((checkbox) => {
        checkbox.checked = selectAll.checked;
    })
}

function enrolment_info_all(){
    $('#data-container-student').empty();
    $('#data-container-standby').empty();
    $('#data-container-completion').empty();
    $('#data-container-out').empty();

    $('#student-nomore-div').empty();
    $('#standby-nomore-div').empty();
    $('#completion-nomore-div').empty();
    $('#out-nomore-div').empty();

    $("#load-more-student-button-div").css('display', 'block');
    $("#load-more-standby-button-div").css('display', 'block');
    $("#load-more-completion-button-div").css('display', 'block');
    $("#load-more-out-button-div").css('display', 'block');

    current_page_ready =0;
    current_page_close =0;

    enrolment_info_student(1, belong_idx);
    enrolment_info_standby(1, belong_idx);
    enrolment_info_completion(1, belong_idx);
    enrolment_info_out(1, belong_idx);
}

var current_page_student;
function enrolment_info_student(page, belong_idx){
    status_select_01();
    var class_select =$('#class_select').val();
    $.ajax({
        url: '/enrolment_info/enrolment_info_list_student',
        type: 'GET',
        data: {page: page, belong_idx: belong_idx, class_select: class_select},
        success: function(response) {
            current_page_student = response.page;
            $('#data-container-student').append(response.data);
            $('#student_paging_info').html('수업중 ('+response.total+'명)');
            if (response.post_cnt < 9) {
                $("#load-more-student-button-div").css('display', 'none');
                if (current_page_student >1 ) {
                    $("#student-nomore-div").append("<p class=\"fs--1\" style='text-align: center; margin-top: 20px;'>더 이상 등록된 학생이 없습니다.</p>");
                }
            }
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
}

var current_page_standby;
function enrolment_info_standby(page, belong_idx){
    var class_select =$('#class_select').val();
    $.ajax({
        url: '/enrolment_info/enrolment_info_list_standby',
        type: 'GET',
        data: {page: page, belong_idx: belong_idx, class_select: class_select},
        success: function(response) {
            current_page_standby = response.page;
            $('#data-container-standby').html(response.data);
            $('#standby_paging_info').html('대기 ('+response.total+'명)');
            if (response.post_cnt < 9) {
                $("#load-more-standby-button-div").css('display', 'none');
                if (current_page_standby >1 ) {
                    $("#standby-nomore-div").append("<p class=\"fs--1\" style='text-align: center; margin-top: 20px;'>더 이상 등록된 학생이 없습니다.</p>");
                }
            }
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
};

var current_page_completion;
function enrolment_info_completion(page, belong_idx){
    var class_select =$('#class_select').val();
    $.ajax({
        url: '/enrolment_info/enrolment_info_list_completion',
        type: 'GET',
        data: {page: page, belong_idx: belong_idx, class_select: class_select},
        success: function(response) {
            current_page_completion = response.page;
            $('#data-container-completion').html(response.data);
            $('#completion_paging_info').html('수료 ('+response.total+'명)');
            if (response.post_cnt < 9) {
                $("#load-more-completion-button-div").css('display', 'none');
                if (current_page_completion >1 ) {
                    $("#out-nomore-div").append("<p class=\"fs--1\" style='text-align: center; margin-top: 20px;'>더 이상 등록된 학생이 없습니다.</p>");
                }
            }
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
}


var current_page_out_student;
function enrolment_info_out(page, belong_idx){
    var class_select =$('#class_select').val();
    $.ajax({
        url: '/enrolment_info/enrolment_info_list_out',
        type: 'GET',
        data: {page: page, belong_idx: belong_idx, class_select: class_select},
        success: function(response) {
            current_page_out_student = response.page;
            $('#data-container-out').html(response.data);
            $('#out_paging_info').html('퇴출 ('+response.total+'명)');
            if (response.post_cnt < 9) {
                $("#load-more-out-button-div").css('display', 'none');
                if (current_page_out_student >1 ) {
                    $("#load-more-out-div").append("<p class=\"fs--1\" style='text-align: center; margin-top: 20px;'>더 이상 등록된 학생이 없습니다.</p>");
                }
            }
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
}

$('#load-more-student').click(function() {
    enrolment_info_student(current_page_student+1, belong_idx);
});

$('#load-more-standby').click(function() {
    enrolment_info_standby(current_page_standby+1, belong_idx);
});

$('#load-more-completion').click(function() {
    enrolment_info_completion(current_page_completion+1, belong_idx);
});

$('#load-more-out').click(function() {
    enrolment_info_out(current_page_out_student+1, belong_idx);
});

function student_apply(){
    var select_type = document.getElementById('status_select_02').value;
    if (select_type == 1){
        var chk_arr = [];
        $("input[name=standby_student_check]:checked").each(function() {
            var chk = $(this).val();
            chk_arr.push(chk);
        });
        postdata = {
            "chk_arr": chk_arr,
            "belong_idx": belong_idx
        }
        $.ajax({
            type: 'POST',
            url: '/student_info/student_admission',
            data: JSON.stringify(postdata),
            dataType : 'JSON',
            contentType: "application/json",
            success: function(data) {
                alert("정삭적으로 등록되었습니다.");
                location.reload();
            },
            error: function(xhr) {
                console.log('Error occurred while fetching data.');
            }
        });
    }else{
        alert("학생의 상태를 선택하세요.");
    }
};

function out_apply(){
    var select_type = document.getElementById('status_select_01').value;
    if (select_type != ""){
        var chk_arr = [];
        $("input[name=student_check]:checked").each(function() {
            var chk = $(this).val();
            chk_arr.push(chk);
        });
        postdata = {
            "chk_arr": chk_arr,
            "belong_idx": belong_idx
        }
        if (select_type == "2"){
            $.ajax({
                type: 'POST',
                url: '/student_info/student_standby',
                data: JSON.stringify(postdata),
                dataType : 'JSON',
                contentType: "application/json",
                success: function(data) {
                    alert("정삭적으로 등록되었습니다.");
                    location.reload();
                },
                error: function(xhr) {
                    console.log('Error occurred while fetching data.');
                }
            });
        }else if (select_type == "0"){
            $.ajax({
                type: 'POST',
                url: '/student_info/student_out',
                data: JSON.stringify(postdata),
                dataType : 'JSON',
                contentType: "application/json",
                success: function(data) {
                    alert("정삭적으로 등록되었습니다.");
                    location.reload();
                },
                error: function(xhr) {
                    console.log('Error occurred while fetching data.');
                }
            });
        }
    }else{
        alert("학생의 상태를 선택하세요.");
    }
}

function student_apply(type){
    var chk_arr = [];
    var select_type;
        if (type == 1){
            select_type = document.getElementById('status_select_01').value;
            $("input[name=student_check]:checked").each(function() {
                var chk = $(this).val();
                chk_arr.push(chk);
            });
        }else if (type == 2) {
            select_type = document.getElementById('status_select_02').value;
            $("input[name=standby_student_check]:checked").each(function () {
                var chk = $(this).val();
                chk_arr.push(chk);
            });
        }else if (type == 3) {
            select_type = document.getElementById('status_select_03').value;
            $("input[name=completion_student_check]:checked").each(function () {
                var chk = $(this).val();
                chk_arr.push(chk);
            });
        }else if (type == 4) {
            select_type = document.getElementById('status_select_04').value;
            $("input[name=out_student_check]:checked").each(function () {
                var chk = $(this).val();
                chk_arr.push(chk);
            });
        }

    if (select_type == "" || chk_arr.length == 0){
        alert("학생을 선택하거나 상태를 선택하세요.");
    }else{
        postdata = {
            "status": select_type,
            "chk_arr": chk_arr,
            "belong_idx": belong_idx
        }

        $.ajax({
            type: 'POST',
            url: '/enrolment_info/enrolment_status_apply',
            data: JSON.stringify(postdata),
            dataType : 'JSON',
            contentType: "application/json",
            success: function(data) {
                alert("정삭적으로 등록되었습니다.");
                location.reload();
            },
            error: function(xhr) {
                console.log('Error occurred while fetching data.');
            }
        });
    }
}