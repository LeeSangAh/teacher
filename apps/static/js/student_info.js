var current_page_standby;
function student_info_standby(page, belong_idx){
    $.ajax({
        url: '/student_info/student_info_list_standby',
        type: 'GET',
        data: {page: page, belong_idx: belong_idx},
        success: function(response) {
            current_page_standby = response.page;
            $('#data-container-standby').append(response.data);
            $('#standby_paging_info').html('대기 ('+response.total+'명)');
            if (response.post_cnt < 9) {
                $("#load-more-standby").remove();
                if (current_page_standby >1 ) {
                    $("#load-more-standby-div").append("<p class=\"fs--1\" style='text-align: center; margin-top: 20px;'>더 이상 등록된 학생이 없습니다.</p>");
                }
            }
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
};

var current_page_student;
function student_info_student(page, belong_idx){
    $('#status_select_01_div').css('display','block');
    $.ajax({
        url: '/student_info/student_info_list_student',
        type: 'GET',
        data: {page: page, belong_idx: belong_idx},
        success: function(response) {
            current_page_student = response.page;
            $('#data-container-student').html(response.data);
            $('#student_paging_info').html('재원 ('+response.total+'명)');
            if (response.post_cnt < 9) {
                $("#load-more-student").remove();
                if (current_page_student >1 ) {
                    $("#load-more-student-div").append("<p class=\"fs--1\" style='text-align: center; margin-top: 20px;'>더 이상 등록된 학생이 없습니다.</p>");
                }
            }
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
};

var current_page_out_student;

function student_info_out(page, belong_idx){
    $.ajax({
        url: '/student_info/student_info_list_out',
        type: 'GET',
        data: {page: page, belong_idx: belong_idx},
        success: function(response) {
            current_page_out_student = response.page;
            $('#data-container-out').html(response.data);
            $('#out_paging_info').html('퇴출 ('+response.total+'명)');
            if (response.post_cnt < 9) {
                $("#load-more-out").remove();
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

$('#student_info_standby').click(function() {
    lecture_info_ready(current_page_standby+1, belong_idx);
});

$('#load-more-standby').click(function() {
    student_info_student(current_page_student+1, belong_idx);
});

$('#load-more-out').click(function() {
    student_info_out(current_page_out_student+1, belong_idx);
});


function student_info_detail(student_idx, child_idx){
    console.log(student_idx)
    var postdata = {
        "student_idx": student_idx,
        "child_idx": child_idx
    }
    $.ajax({
        type: 'POST',
        url: '/student_info/student_info_detail',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data) {
            if (data.result2['child_nm'] != null){$('#student_name').text(data.result2['child_nm'])};
            if (data.result2['student_picture'] != null){$('#student_picture').attr('src', '/static/file_upload/picture/student_info/'+data.result2['child_picture'])};

            if (data.result2['email'] != null){$('#student_email').attr('href', "mailto:"+data.result2['email'])};
            if (data.result2['email'] != null){$('#student_email').text(data.result2['email'])};

            if (data.result2['tel_number'] != null){$('#tel_number').attr('href', "tel:"+data.result2['tel_number'])};
            if (data.result2['tel_number'] != null){$('#tel_number').text(data.result2['tel_number'])};

            if (data.result2['p_tel_number'] != null){$('#p_tel_number').attr('href', "tel:"+data.result2['p_tel_number'])};
            if (data.result2['p_tel_number'] != null){$('#p_tel_number').text(data.result2['p_tel_number'])};

            var level_nm = data.result2['level_nm'];
            console.log("level_nm: ", level_nm);
            if (level_nm != null){$('#level_nm').text(level_nm)}else{$('#level_nm').text('반편성전')};

            var c = data.result2['id_counter'];
            for (var i = 1; i <= c; i++) {
                $('#class_nm_div').append("<div><a class='fs--1' href='/class_info/class_info_predetail?class_idx="+data.result2['class_idx_'+i]+"'>"+data.result2['class_nm_'+i]+"</a></div>");
            }

        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
            // location.href="/index"
        }
    });
}

var current_page_out_student_attendance;
function student_info_attendance(page, student_idx, child_idx){
    $.ajax({
        url: '/student_info/student_info_attendance',
        type: 'GET',
        data: {page: page, belong_idx: belong_idx, student_idx: student_idx, child_idx: child_idx},
        success: function(response) {
            current_page_out_student_attendance = response.page;
            $('#data-container-student-attendance').append(response.data);
            $('#student_attendance_paging_info').html('대기 ('+response.total+'명)');
            if (response.post_cnt < 8) {
                $("#load-more-attendance").remove();
                if (current_page_out_student_attendance >1 ) {
                    $("#load-more-attendance-div").append("<p class=\"fs--1\" style='text-align: center; margin-top: 20px;'>더 이상 등록된 학생이 없습니다.</p>");
                }
            }
        },
    });
}

function load_more_attendance(student_idx, class_idx) {
    console.log("student_idx, class_idx: ", student_idx, class_idx);
    student_info_attendance(current_page_out_student_attendance+1, student_idx, class_idx);
};


function student_info_mod_ready(student_idx){
    console.log(student_idx)
    var postdata = {
        "student_idx": student_idx
    }
    $.ajax({
        type: 'POST',
        url: '/student_info/student_info_detail',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data) {
            console.log(data.result2['child_picture'])
            if (data.result2['child_nm'] != null){$('#student_name').val(data.result2['child_nm'])};
            if (data.result2['child_picture'] != null){$('#student_picture').attr('src', '/static/file_upload/picture/student_info/'+data.result2['child_picture'])};

            if (data.result2['email'] != null){$('#student_email').val(data.result2['email'])};
            if (data.result2['tel_number'] != null){$('#tel_number').val(data.result2['tel_number'])};
            if (data.result2['p_tel_number'] != null){$('#p_tel_number').val(data.result2['p_tel_number'])};
            if (data.result2['p_idx'] != null){$('#p_idx').val(data.result2['p_idx'])};

            var level_idx = data.result2['level_idx'];
            console.log("level_idx", level_idx);
            if (level_idx != null){$('#level_type').val(level_idx)};
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
}

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

function selectAll_out(selectAll){
    const checkboxes
        = document.getElementsByName('out_student_check');
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

function feedback_view(div_nm){
    $('#'+div_nm+'').toggle();
}

function student_apply(){
    var select_type = document.getElementById('status_select_02').value;
    console.log(select_type);
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
    console.log(select_type);
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

function student_standby_apply(){
    var select_type = document.getElementById('status_select_03').value;
    console.log(select_type);
    if (select_type != ""){
        var chk_arr = [];
        $("input[name=out_student_check]:checked").each(function() {
            var chk = $(this).val();
            chk_arr.push(chk);
        });
        postdata = {
            "chk_arr": chk_arr,
            "belong_idx": belong_idx
        }
        if (select_type == "1"){
            $.ajax({
                type: 'POST',
                url: '/student_info/student_readmission',
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
        }else if (select_type == "2"){
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
        }
    }else{
        alert("학생의 상태를 선택하세요.");
    }
}

function level_info(belong_idx){
    postdata = {
        "belong_idx": belong_idx
    }
    $.ajax({
        type: 'POST',
        url: '/student_info/level_info',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data) {
            var c = data.result2['id_counter'];
            for (var i = 1; i <= c; i++) {
                var option= $("<option value='"+data.result2['idx_'+i]+"'>"+data.result2['level_nm_'+i]+"</option>");
                $("#level_type").append(option);
            }
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
}

function homework_expected(child_idx){
    postdata = {
        "belong_idx": belong_idx,
        "child_idx": child_idx
    }
    $.ajax({
        type: 'POST',
        url: '/student_info/homework_expected_info',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data) {
            var c = data.result2['id_counter'];
            for (var i = 1; i <= c; i++) {
                $('#homework_expected_container').append("<div style='margin-bottom: 10px;'>" +
                                                            "<a href=\"/lecture_info/lecture_info_predetail?lecture_idx="+data.result2['lecture_idx_'+i]+"&class_idx="+data.result2['class_idx_'+i]+"&lecture_day="+data.result2['lecture_day_'+i]+"&lecture_start_time="+data.result2['lecture_start_time_'+i]+"&lecture_end_time="+data.result2['lecture_end_time_'+i]+"&class_nm="+data.result2['class_nm_'+i]+"\">" +
                                                            "<div  class=\"mb-0 me-3 text-800\">"+data.result2['class_nm_'+i]+"</div>" +
                                                            "<div class=\"fs--1 text-600\">- 숙제: "+data.result2['homework_title_'+i]+"</div>" +
                                                            "<div class=\"fs--1 text-600\">- 기간: "+data.result2['end_date_'+i]+"까지</div>" +
                                                            "</a>" +
                                                         "</div>")
            }
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
}

let t_file = new Array();
const student_pic_form_data = new FormData();
function student_picture_mod(input) {
    t_file.push(input.files[0]);	//선택된 파일 가져오기

    student_pic_form_data.append('file', document.getElementById('file').files[0]);
    student_pic_form_data.append('student_idx', document.getElementById('student_idx').value);

    //새로운 이미지 div 추가
    var newImage = document.createElement("img");
    newImage.setAttribute("style", 'border-radius: 50%;')
    newImage.setAttribute("class", 'img');

    //이미지 source 가져오기
    newImage.src = URL.createObjectURL(t_file[0]);

    newImage.style.width = "90px";
    newImage.style.height = "90px";
    // newImage.style.visibility = "hidden";   //버튼을 누르기 전까지는 이미지를 숨긴다
    newImage.style.objectFit = "contain";

    //이미지를 image-show div에 추가
    var container = document.getElementById('img_container');
    container.innerHTML = "";
    container.appendChild(newImage);

    //이미지는 화면에 나타나고
    newImage.style.visibility = "visible";

    $.ajax({
        type: "POST",
        url: '/student_info/student_attach_mod',
        data: student_pic_form_data,
        dataType : 'JSON',
        contentType: false,
        cache:  false,
        processData: false,
        success: function(data) {
            alert("사진이 정상적으로 등록되었습니다.");
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });

    student_pic_form_data.delete('file');
    student_pic_form_data.delete('student_idx');
    t_file = [];
};

function student_file_browse(){
    document.pic_form.file.click();
    // document.pic_form.text1.value=document.pic_form.file.value;
}

const student_info_form_data = new FormData();
function student_info_mod(student_idx){
    console.log("document.getElementById('p_tel_number').value", document.getElementById('p_tel_number').value);
    student_info_form_data.append('student_name', document.getElementById('student_name').value);
    student_info_form_data.append('level_type', document.getElementById('level_type').value);
    student_info_form_data.append('student_email', document.getElementById('student_email').value);
    student_info_form_data.append('tel_number', document.getElementById('tel_number').value);
    student_info_form_data.append('p_tel_number', document.getElementById('p_tel_number').value);
    student_info_form_data.append('p_idx', document.getElementById('p_idx').value);
    student_info_form_data.append('student_idx', student_idx);


    $.ajax({
        type: "POST",
        url: '/student_info/student_mod_save',
        data: student_info_form_data,
        dataType : 'JSON',
        contentType: false,
        cache:  false,
        processData: false,
        success: function(response) {
            alert("정상적으로 등록되었습니다.");
            location.href="/student_info/student_info_predetail?student_idx="+student_idx;
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
}


let t_file_c = new Array();
const student_pic_form_data_c = new FormData();
function student_picture_add(input) {
    t_file_c.push(input.files[0]);	//선택된 파일 가져오기

    student_pic_form_data_c.append('file', document.getElementById('file').files[0]);
    student_pic_form_data_c.append('student_idx', document.getElementById('student_idx').value);

    //새로운 이미지 div 추가
    var newImage = document.createElement("img");
    newImage.setAttribute("style", 'border-radius: 50%;')
    newImage.setAttribute("class", 'img');

    //이미지 source 가져오기
    newImage.src = URL.createObjectURL(t_file_c[0]);

    newImage.style.width = "90px";
    newImage.style.height = "90px";
    // newImage.style.visibility = "hidden";   //버튼을 누르기 전까지는 이미지를 숨긴다
    newImage.style.objectFit = "contain";

    //이미지를 image-show div에 추가
    var container = document.getElementById('img_container');
    container.innerHTML = "";
    container.appendChild(newImage);

    //이미지는 화면에 나타나고
    newImage.style.visibility = "visible";

    student_pic_form_data_c.delete('file');
    student_pic_form_data_c.delete('student_idx');
    t_file_c = [];
};


function student_info_create(){
    student_pic_form_data_c.append('student_type', document.getElementById("AcademyItemSelectBox").value);
    student_pic_form_data_c.append('student_name', document.getElementById('student_name').value);
    student_pic_form_data_c.append('student_desc', document.getElementById('student_desc').value);
    student_pic_form_data_c.append('student_email', document.getElementById('student_email').value);
    student_pic_form_data_c.append('tel_number', document.getElementById('tel_number').value);
    student_pic_form_data_c.append('student_addr1', document.getElementById('student_addr1').value);
    student_pic_form_data_c.append('student_addr2', document.getElementById('student_addr2').value);
    student_pic_form_data_c.append('major_subject', document.getElementById('major_subject').value);
    student_pic_form_data_c.append('university', document.getElementById('university').value);

    $.ajax({
        type: "POST",
        url: '/student_info/student_info_create_save',
        data: student_pic_form_data_c,
        dataType : 'JSON',
        contentType: false,
        cache:  false,
        processData: false,
        success: function(response) {
            alert("정상적으로 등록되었습니다.");
            location.href="/student_info/student_info_normal";
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
}