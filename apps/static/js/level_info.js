
var current_page;
function level_list(page, belong_idx){
    $.ajax({
        url: '/level_info/level_info_list_standby',
        type: 'GET',
        data: {page: page, belong_idx: belong_idx},
        success: function(response) {
            current_page = response.page;
            $('#data-container-level').append(response.data);
            $('#paging_info').html('등록된 반 총 '+response.total+'개');
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
    level_list(current_page+1, belong_idx);
});

function level_info_detail(level_idx){
    console.log(level_idx)
    var postdata = {
        "level_idx": level_idx
    }
    $.ajax({
        type: 'POST',
        url: '/level_info/level_info_detail',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data) {
            if (data.result2['level_nm'] != null){$('#level_nm').text(data.result2['level_nm'])};
            if (data.result2['class_level'] != null){$('#class_level').text(data.result2['class_level'])};
            if (data.result2['limit_cnt'] != null){$('#limit_cnt').text(data.result2['limit_cnt'])};
            if (data.result2['level_desc'] != null){$('#level_desc').text(data.result2['level_desc'])};

            var status = data.result2['status'];
            console.log("status: ", status);
            if (status == 0){$('#status').text('중지')}else{$('#status').text('운영')};
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
            // location.href="/index"
        }
    });
}

function student_info_student2(page, belong_idx, level_idx){
    $('#status_select_01_div').css('display','block');
    $.ajax({
        url: '/student_info/student_info_list_student2',
        type: 'GET',
        data: {page: page, belong_idx: belong_idx, level_idx: level_idx},
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
        = document.getElementsByName('level_check');
    checkboxes.forEach((checkbox) => {
        checkbox.checked = selectAll.checked;
    })
};

function level_apply(){
    var select_type = document.getElementById('level_type').value;
    // var select_type = $("select[name=level_type] option:selected").val();

    var chk_arr = [];
    $("input[name=level_check]:checked").each(function() {
        var chk = $(this).val();
        chk_arr.push(chk);
    });

    console.log(chk_arr.length)
    if (chk_arr.length != 0){
        postdata = {
            "chk_arr": chk_arr,
            "select_type": select_type,
            "belong_idx": belong_idx
        }

        $.ajax({
            type: 'POST',
            url: '/level_info/level_type_trans',
            data: JSON.stringify(postdata),
            dataType : 'JSON',
            contentType: "application/json",
            success: function(data) {
                alert("정삭적으로 등록되었습니다.");
                // location.href="/level_info/level_info_predetail?level_idx="+select_type
                location.reload();
            },
            error: function(xhr) {
                console.log('Error occurred while fetching data.');
            }
        });

    }else{
        alert("학생을 선택하세요.");
    }
}

function level_info2(belong_idx, level_idx){
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
                if (data.result2['idx_'+i] == level_idx){
                    var option= $("<option value='"+data.result2['idx_'+i]+"' selected>"+data.result2['level_nm_'+i]+"</option>");
                }else{
                    var option= $("<option value='"+data.result2['idx_'+i]+"'>"+data.result2['level_nm_'+i]+"</option>");
                }
                $("#level_type").append(option);
            }
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
}


function level_info_mod_ready(level_idx){
    var postdata = {
        "level_idx": level_idx
    }
    $.ajax({
        type: 'POST',
        url: '/level_info/level_info_detail',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data) {
            if (data.result2['level_nm'] != null){$('#level_nm').val(data.result2['level_nm'])};
            if (data.result2['class_level'] != null){$('#class_level').val(data.result2['class_level'])};
            if (data.result2['limit_cnt'] != null){$('#limit_cnt').val(data.result2['limit_cnt'])};
            if (data.result2['status'] != null){$('#status').val(data.result2['status']).prop("selected",true)};
            if (data.result2['level_desc'] != null){$('#level_desc').val(data.result2['level_desc'])};
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
}

const level_info_form_data = new FormData();
function level_info_mod(level_idx){
    console.log("document.getElementById('level_nm').value", document.getElementById('level_nm').value);
    level_info_form_data.append('level_nm', document.getElementById('level_nm').value);
    level_info_form_data.append('class_level', document.getElementById('class_level').value);
    level_info_form_data.append('limit_cnt', document.getElementById('limit_cnt').value);
    level_info_form_data.append('status', document.getElementById('status').value);
    level_info_form_data.append('level_desc', document.getElementById('level_desc').value);
    level_info_form_data.append('level_idx', level_idx);

    $.ajax({
        type: "POST",
        url: '/level_info/level_mod_save',
        data: level_info_form_data,
        dataType : 'JSON',
        contentType: false,
        cache:  false,
        processData: false,
        success: function(response) {
            alert("정상적으로 등록되었습니다.");
            location.href="/level_info/level_info_predetail?level_idx="+level_idx;
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

const textarea = document.getElementById('level_desc');
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

const level_info_form_data_create = new FormData();
function level_info_create(){
    console.log("document.getElementById('level_nm').value", document.getElementById('level_nm').value);
    level_info_form_data_create.append('level_nm', document.getElementById('level_nm').value);
    level_info_form_data_create.append('class_level', document.getElementById('class_level').value);
    level_info_form_data_create.append('limit_cnt', document.getElementById('limit_cnt').value);
    level_info_form_data_create.append('status', document.getElementById('status').value);
    level_info_form_data_create.append('level_desc', document.getElementById('level_desc').value);
    level_info_form_data_create.append('belong_idx', belong_idx);

    $.ajax({
        type: "POST",
        url: '/level_info/level_info_create',
        data: level_info_form_data_create,
        dataType : 'JSON',
        contentType: false,
        cache:  false,
        processData: false,
        success: function(response) {
            alert("정상적으로 등록되었습니다.");
            location.href="/level_info/level_info_normal";
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
}