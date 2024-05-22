
var current_page;
function subject_list(page, belong_idx){
    $.ajax({
        url: '/subject_info/subject_info_list',
        type: 'GET',
        data: {page: page, belong_idx: belong_idx},
        success: function(response) {
            current_page = response.page;
            $('#data-container').append(response.data);
            $('#paging_info').html('등록된 과목 총 '+response.total+'개');
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
    subject_list(current_page+1, belong_idx);
});


function subject_info_detail(subject_idx){
    console.log(subject_idx)
    var postdata = {
        "subject_idx": subject_idx
    }
    $.ajax({
        type: 'POST',
        url: '/subject_info/subject_info_detail',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data) {
            if (data.result2['subject_nm'] != null){$('#subject_nm').text(data.result2['subject_nm'])};
            if (data.result2['subject_sub_nm'] != null){$('#subject_sub_nm').text(data.result2['subject_sub_nm'])};
            if (data.result2['subject_desc'] != null){$('#subject_desc').text(data.result2['subject_desc'])};

        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
            // location.href="/index"
        }
    });
}

function student_info_student2(page, belong_idx, subject_idx){
    $('#status_select_01_div').css('display','block');
    $.ajax({
        url: '/student_info/student_info_list_student2',
        type: 'GET',
        data: {page: page, belong_idx: belong_idx, subject_idx: subject_idx},
        success: function(response) {
            current_page_student = response.page;
            // Update the data container with the new data
            $('#data-container-student').html(response.data);
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

function selectAll_student_level(selectAll)  {
    const checkboxes
        = document.getElementsByName('subject_check');
    checkboxes.forEach((checkbox) => {
        checkbox.checked = selectAll.checked;
    })
};

function subject_info_mod_ready(subject_idx){
    var postdata = {
        "subject_idx": subject_idx
    }
    $.ajax({
        type: 'POST',
        url: '/subject_info/subject_info_detail',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data) {
            if (data.result2['subject_nm'] != null){$('#subject_nm').val(data.result2['subject_nm'])};
            if (data.result2['subject_sub_nm'] != null){$('#subject_sub_nm').val(data.result2['subject_sub_nm'])};
            if (data.result2['subject_desc'] != null){$('#subject_desc').val(data.result2['subject_desc'])};
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
}

const subject_info_form_data = new FormData();
function subject_info_mod(subject_idx){
    console.log("document.getElementById('subject_nm').value", document.getElementById('subject_nm').value);
    subject_info_form_data.append('subject_nm', document.getElementById('subject_nm').value);
    subject_info_form_data.append('subject_sub_nm', document.getElementById('subject_sub_nm').value);
    subject_info_form_data.append('subject_desc', document.getElementById('subject_desc').value);
    subject_info_form_data.append('subject_idx', subject_idx);

    $.ajax({
        type: "POST",
        url: '/subject_info/subject_mod_save',
        data: subject_info_form_data,
        dataType : 'JSON',
        contentType: false,
        cache:  false,
        processData: false,
        success: function(response) {
            alert("정상적으로 등록되었습니다.");
            location.href="/subject_info/subject_info_predetail?subject_idx="+subject_idx;
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
}


function autoResize(textarea) {
    if (user_email) {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }else{
        alert("로그인이 필요합니다.");
        location.href="/login";
    }
}

const textarea = document.getElementById('subject_desc');
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

const subject_info_form_data_create = new FormData();
function subject_info_create(){
    subject_info_form_data_create.append('subject_nm', document.getElementById('subject_nm').value);
    subject_info_form_data_create.append('subject_sub_nm', document.getElementById('subject_sub_nm').value);
    subject_info_form_data_create.append('subject_desc', document.getElementById('subject_desc').value);
    subject_info_form_data_create.append('belong_idx', belong_idx);

    $.ajax({
        type: "POST",
        url: '/subject_info/subject_info_create',
        data: subject_info_form_data_create,
        dataType : 'JSON',
        contentType: false,
        cache:  false,
        processData: false,
        success: function(response) {
            alert("정상적으로 등록되었습니다.");
            location.href="/subject_info/subject_info_normal";
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
}

function subject_del(subject_idx){
    var postdata = {
        "subject_idx": subject_idx
    }
    $.ajax({
        type: 'POST',
        url: '/subject_info/subject_info_del',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data) {
            alert("정상적으로 삭제되었습니다.");
            location.href="/subject_info/subject_info_normal";
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
}