
function info_open($href, search){
    // var $href = $(this).attr('href');
    layer_popup($href);
    gameng_info(search);
};

function member_layer_call($href){
    layer_popup($href);
}

function gameng_info(search) {
    var postdata = {
        'brand': search
    }
    $.ajax({
        type: 'POST',
        url: '/map_info/gameang_info',
        data: JSON.stringify(postdata),
        dataType: 'JSON',
        contentType: "application/json",
        success: function (data) {
            c = data.result2['id_counter'];
            for (var i = 1; i <= c; i++) {
                document.getElementById('item1').value = data.result2['company_nm_' + i];
                document.getElementById('item2').value = data.result2['brand_nm_' + i];
                document.getElementById('item3').value = data.result2['boss_' + i];
                document.getElementById('item4').value = data.result2['reg_date_' + i];
                document.getElementById('item5').value = data.result2['store_type_' + i];
                document.getElementById('item6').value = data.result2['url_' + i];
                document.getElementById('item7').value = data.result2['all_count_' + i];
                document.getElementById('item8').value = data.result2['gm_count_' + i];
                document.getElementById('item9').value = data.result2['jy_count_' + i];
                document.getElementById('item10').value = data.result2['aver_sales_' + i];
                document.getElementById('item11').value = data.result2['unit_aver_sales_' + i];
                document.getElementById('item12').value = data.result2['subs_fee_' + i];
                document.getElementById('item13').value = data.result2['edu_fee_' + i];
                document.getElementById('item14').value = data.result2['deposit_fee_' + i];
                document.getElementById('item15').value = data.result2['etc_fee_' + i];
                document.getElementById('item16').value = data.result2['total_fee_' + i];
            }

        },
        error: function (request, status, error) {
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    })
}
function layer_popup_iframe(el){
    var $el = $(el);    //레이어의 id를 $el 변수에 저장
    var isDim = $el.prev().hasClass('dimBg'); //dimmed 레이어를 감지하기 위한 boolean 변수

    isDim ? $('.dim-layer').fadeIn() : $el.fadeIn();

    var $elWidth = ~~($el.outerWidth()),
        $elHeight = ~~($el.outerHeight()),
        docWidth = $(document).width(),
        docHeight = $(document).height();

    // 화면의 중앙에 레이어를 띄운다.
    if ($elHeight < docHeight || $elWidth < docWidth) {
        $el.css({
            marginTop: -$elHeight /2,
            marginLeft: -$elWidth/2
        })
    } else {
        $el.css({top: 0, left: 0});
    }

    $el.find('a.btn-layerClose').click(function(){
        isDim ? $('.dim-layer').fadeOut() : $el.fadeOut(); // 닫기 버튼을 클릭하면 레이어가 닫힌다.
        return false;
    });

    $('.layer .dimBg').click(function(){
        $('.dim-layer').fadeOut();
        return false;
    });

    var url = 'https://franchise.ftc.go.kr//mnu/00013/program/userRqst/view.do?firMstSn=442836';
    fn_iframe(url);
}

function fn_iframe(url) {
    jQuery('#iframe').attr('src', url);
}

function layer_popup(el){
    console.log(el);
    var $el = $(el);    //레이어의 id를 $el 변수에 저장
    var isDim = $el.prev().hasClass('dimBg'); //dimmed 레이어를 감지하기 위한 boolean 변수

    isDim ? $('.dim-layer').fadeIn() : $el.fadeIn();

    var $elWidth = ~~($el.outerWidth()),
        $elHeight = ~~($el.outerHeight()),
        docWidth = $(document).width(),
        docHeight = $(document).height();

    // 화면의 중앙에 레이어를 띄운다.
    if ($elHeight < docHeight || $elWidth < docWidth) {
        $el.css({
            marginTop: -$elHeight /2,
            marginLeft: -$elWidth/2
        })
    } else {
        $el.css({top: 0, left: 0});
    }

    $el.find('a.btn-layerClose').click(function(){
        isDim ? $('.dim-layer').fadeOut() : $el.fadeOut(); // 닫기 버튼을 클릭하면 레이어가 닫힌다.
        return false;
    });

    $('.layer .dimBg').click(function(){
        $('.dim-layer').fadeOut();
        return false;
    });
}

// var tabMenu = document.querySelector('.tab-menu');
// var tabs = document.querySelectorAll('.tab-menu li');
// var tabContents = document.querySelectorAll('.tab-content');
//
// tabMenu.addEventListener('click', function(e) {
//     if (e.target.tagName === 'A') {
//         e.preventDefault();
//         var tabId = e.target.getAttribute('href');
//         tabs.forEach(function(tab) {
//             tab.classList.remove('active');
//         });
//         tabContents.forEach(function(tabContent) {
//             tabContent.classList.remove('active');
//         });
//         e.target.parentNode.classList.add('active');
//         document.querySelector(tabId).classList.add('active');
//     }
// });