
var current_page;
function teacher_info(page, belong_idx){
    $.ajax({
        url: '/teacher_info/teacher_info_list',
        type: 'GET',
        data: {page: page, belong_idx: belong_idx},
        success: function(response) {
            current_page = response.page;
            $('#data-container').append(response.data);
            $('#paging_info').html('등록된 교사 총 '+response.total+'명');
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
    teacher_info(current_page+1, belong_idx);
});

function teacher_info_detail(teacher_idx){
    console.log(teacher_idx)
    var postdata = {
        "teacher_idx": teacher_idx
    }
    $.ajax({
        type: 'POST',
        url: '/teacher_info/teacher_info_detail',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data) {
            var belong_yn = "";
            if (data.result2['belong_yn'] == '1'){ belong_yn = '재직'}else if(data.result2['belong_yn'] == '0'){belong_yn = '퇴사'}else if(data.result2['belong_yn'] == '3'){belong_yn = '(대기)'};
            if (belong_yn != null){$('#teacher_status').text(belong_yn)};

            var teacher_type = "";
            if (data.result2['teacher_type'] == '1'){ teacher_type = '원장'}else if(data.result2['teacher_type'] == '0'){teacher_type = '관리'}else if(data.result2['teacher_type'] == '3'){teacher_type = '교사'};
            if (teacher_type != null){$('#teacher_type').text(teacher_type)};

            if (data.result2['teacher_picture'] != null){$('#teacher_picture').attr('src', '/static/file_upload/picture/teacher_info/'+data.result2['teacher_picture'])};
            if (data.result2['teacher_name'] != null){$('#teacher_name').text(data.result2['teacher_name'])};
            if (data.result2['teacher_desc'] != null){$('#teacher_desc').text(data.result2['teacher_desc'])};

            if (data.result2['teacher_email'] != null){$('#teacher_email').attr('href', "mailto:"+data.result2['teacher_email'])};
            if (data.result2['teacher_email'] != null){$('#teacher_email').text(data.result2['teacher_email'])};

            if (data.result2['tel_number'] != null){$('#tel_number').attr('href', "tel:"+data.result2['tel_number'])};
            if (data.result2['tel_number'] != null){$('#tel_number').text(data.result2['tel_number'])};

            var teacher_addr = data.result2['addr1']+" "+data.result2['addr2']
            if (data.result2['addr1'] != null){$('#teacher_addr').text(teacher_addr)};
            if (data.result2['major_subject'] != null){$('#major_subject').text(data.result2['major_subject'])};
            if (data.result2['university'] != null){$('#university').text(data.result2['university'])};

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

function teacher_info_mod_ready(teacher_idx){
    console.log(teacher_idx)
    var postdata = {
        "teacher_idx": teacher_idx
    }
    $.ajax({
        type: 'POST',
        url: '/teacher_info/teacher_info_detail',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data) {
            if (data.result2['teacher_type']){$('#teacher_type').val(data.result2['teacher_type'])};
            if (data.result2['belong_yn']){$('#teacher_status').val(data.result2['belong_yn'])};
            if (data.result2['teacher_picture']){$('#teacher_picture').attr('src', '/static/file_upload/picture/teacher_info/'+data.result2['teacher_picture'])};
            if (data.result2['teacher_name']){$('#teacher_name').val(data.result2['teacher_name'])};
            if (data.result2['teacher_desc']){$('#teacher_desc').val(data.result2['teacher_desc'])};
            if (data.result2['teacher_email']){$('#teacher_email').val(data.result2['teacher_email'])};
            if (data.result2['tel_number']){$('#tel_number').val(data.result2['tel_number'])};

            if (data.result2['addr1']){$('#teacher_addr1').val(data.result2['addr1'])};
            if (data.result2['addr2']){$('#teacher_addr2').val(data.result2['addr2'])};

            if (data.result2['major_subject']){$('#major_subject').val(data.result2['major_subject'])};
            if (data.result2['university']){$('#university').val(data.result2['university'])};
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
}

let t_file = new Array();
const teacher_pic_form_data = new FormData();
function teacher_picture_mod(input) {
    t_file.push(input.files[0]);	//선택된 파일 가져오기

    teacher_pic_form_data.append('file', document.getElementById('file').files[0]);
    teacher_pic_form_data.append('teacher_idx', document.getElementById('teacher_idx').value);

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
        url: '/teacher_info/teacher_attach_mod',
        data: teacher_pic_form_data,
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

    teacher_pic_form_data.delete('file');
    teacher_pic_form_data.delete('teacher_idx');
    t_file = [];
};

function teacher_file_browse(){
    document.pic_form.file.click();
    // document.pic_form.text1.value=document.pic_form.file.value;
}

const teacher_info_form_data = new FormData();
function teacher_info_mod(teacher_idx){
    teacher_info_form_data.append('teacher_status', document.getElementById("teacher_status").value);
    teacher_info_form_data.append('teacher_name', document.getElementById('teacher_name').value);
    teacher_info_form_data.append('teacher_desc', document.getElementById('teacher_desc').value);
    teacher_info_form_data.append('teacher_email', document.getElementById('teacher_email').value);
    teacher_info_form_data.append('tel_number', document.getElementById('tel_number').value);
    teacher_info_form_data.append('teacher_addr1', document.getElementById('teacher_addr1').value);
    teacher_info_form_data.append('teacher_addr2', document.getElementById('teacher_addr2').value);
    teacher_info_form_data.append('major_subject', document.getElementById('major_subject').value);
    teacher_info_form_data.append('university', document.getElementById('university').value);
    teacher_info_form_data.append('teacher_idx', teacher_idx);

    $.ajax({
        type: "POST",
        url: '/teacher_info/teacher_mod_save',
        data: teacher_info_form_data,
        dataType : 'JSON',
        contentType: false,
        cache:  false,
        processData: false,
        success: function(response) {
            alert("정상적으로 등록되었습니다.");
            location.href="/teacher_info/teacher_info_predetail?teacher_idx="+teacher_idx;
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
}

function teacher_del(teacher_idx){
    if (confirm("선생님 정보를 삭제하시겠습니까?") == true){
    var postdata = {
        "teacher_idx": teacher_idx
    }
    $.ajax({
        type: 'POST',
        url: '/teacher_info/teacher_info_del',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data) {
            alert("정삭적으로 삭제되었습니다.");
            location.href="/teacher_info/teacher_info_normal";
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
    }else{
        return false;
    }
}

let t_file_c = new Array();
const teacher_pic_form_data_c = new FormData();
function teacher_picture_add(input) {
    t_file_c.push(input.files[0]);	//선택된 파일 가져오기

    teacher_pic_form_data_c.append('file', document.getElementById('file').files[0]);
    teacher_pic_form_data_c.append('teacher_idx', document.getElementById('teacher_idx').value);

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

    teacher_pic_form_data_c.delete('file');
    teacher_pic_form_data_c.delete('teacher_idx');
    t_file_c = [];
};


function teacher_info_create(){
    teacher_pic_form_data_c.append('teacher_type', document.getElementById("AcademyItemSelectBox").value);
    teacher_pic_form_data_c.append('teacher_name', document.getElementById('teacher_name').value);
    teacher_pic_form_data_c.append('teacher_desc', document.getElementById('teacher_desc').value);
    teacher_pic_form_data_c.append('teacher_email', document.getElementById('teacher_email').value);
    teacher_pic_form_data_c.append('tel_number', document.getElementById('tel_number').value);
    teacher_pic_form_data_c.append('teacher_addr1', document.getElementById('teacher_addr1').value);
    teacher_pic_form_data_c.append('teacher_addr2', document.getElementById('teacher_addr2').value);
    teacher_pic_form_data_c.append('major_subject', document.getElementById('major_subject').value);
    teacher_pic_form_data_c.append('university', document.getElementById('university').value);

    $.ajax({
        type: "POST",
        url: '/teacher_info/teacher_info_create_save',
        data: teacher_pic_form_data_c,
        dataType : 'JSON',
        contentType: false,
        cache:  false,
        processData: false,
        success: function(response) {
            alert("정상적으로 등록되었습니다.");
            location.href="/teacher_info/teacher_info_normal";
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
}

var current_page_out_teacher_lecture
function teacher_info_lecture(page, teacher_idx){
    $.ajax({
        url: '/teacher_info/teacher_info_lecture',
        type: 'GET',
        data: {page: page, belong_idx: belong_idx, teacher_idx: teacher_idx},
        success: function(response) {
            current_page_out_teacher_lecture = response.page;
            $('#data-container-teacher-lecture').append(response.data);
            $('#student_lecture_paging_info').html('대기 ('+response.total+'명)');
            if (response.post_cnt < 8) {
                $("#load-more-lecture").remove();
                if (current_page_out_teacher_lecture >1 ) {
                    $("#load-more-lecture-div").append("<p class=\"fs--1\" style='text-align: center; margin-top: 20px;'>더 이상 등록된 수업이 없습니다.</p>");
                }
            }
        },
    });
}

function load_more_lecture(teacher_idx) {
    teacher_info_lecture(current_page_out_teacher_lecture+1, teacher_idx);
};

function lecture_expected(teacher_idx){
    postdata = {
        "belong_idx": belong_idx,
        "teacher_idx": teacher_idx
    }
    $.ajax({
        type: 'POST',
        url: '/teacher_info/lecture_expected_info',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data) {
            var c = data.result2['id_counter'];
            for (var i = 1; i <= c; i++) {
                $('#lecture_expected_container').append("<label class=\"form-check-label w-100 pe-3\" for=\"ticket-checkbox-todo-0\"><span class=\"mb-1 text-700 d-block\">"+data.result2['class_nm_'+i]+" ("+data.result2['lecture_day_'+i]+") </span></label>")
            }
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
}