jQuery(document).ready(function () {
    //sido option 추가
    jQuery.each(hangjungdong.sido, function (idx, code) {
        //append를 이용하여 option 하위에 붙여넣음
        jQuery('#sido').append(fn_option(code.sido, code.codeNm));
    });
    //sido 변경시 시군구 option 추가
    jQuery('#sido').change(function () {
    jQuery('#sigugun').show();
    jQuery('#sigugun').empty();
    jQuery('#sigugun').append(fn_option('', '선택')); //
    jQuery.each(hangjungdong.sigugun, function (idx, code) {
        if (jQuery('#sido > option:selected').val() == code.sido)
        jQuery('#sigugun').append(fn_option(code.sigugun, code.codeNm));
    });

    //세종특별자치시 예외처리
    //옵션값을 읽어 비교
        if (jQuery('#sido option:selected').val() == '29') {
        jQuery('#sigugun').hide();
        //index를 이용해서 selected 속성(attr)추가
        //기본 선택 옵션이 최상위로 index 0을 가짐
        jQuery('#sigugun option:eq(1)').attr('selected', 'selected');
        //trigger를 이용해 change 실행
        jQuery('#sigugun').trigger('change');
        }
    }
    );
    //시군구 변경시 행정동 옵션추가
    jQuery('#sigugun').change(function () {
    //option 제거
    jQuery('#dong').empty();
    jQuery.each(hangjungdong.dong, function (idx, code) {
    if (jQuery('#sido > option:selected').val() == code.sido && jQuery('#sigugun > option:selected').val() == code.sigugun)
    jQuery('#dong').append(fn_option(code.dong, code.codeNm));
    });
    //option의 맨앞에 추가
    jQuery('#dong').prepend(fn_option('', '선택'));
    //option중 선택을 기본으로 선택
    jQuery('#dong option:eq("")').attr('selected', 'selected');
    }
    );

    jQuery('#dong').change(function () {
    var sido = jQuery('#sido option:selected');
    var sigugun = jQuery('#sigugun option:selected');
    var dong = jQuery('#dong option:selected');

    // var single_dongName = dong.text();
    // jQuery('#s_dongName').text(single_dongName);
    var dongName = sido.text() + ' / ' + sigugun.text() + ' / ' + dong.text(); // 시도/시군구/읍면동 이름
    jQuery('#dongName').text(dongName);

    var dongCode = sido.val() + sigugun.val() + dong.val() + '00'; // 읍면동코드
    jQuery('#dongCode').text(dongCode);
    //동네예보 URL
    // var url = 'https://www.weather.go.kr/weather/process/timeseries-dfs-body-ajax.jsp?myPointCode=' + dongCode + '&unit=K';
    //iframe으로 결과 보기
    // fn_iframe(url);
});
});
    function fn_option(code, name) {
        return '<option value="' + code + '">' + name + '</option>';
    }
//     function fn_iframe(url) {
//     jQuery('#iframe').attr('src', url);
// }
// }

function select_set_value(sido_cd, all_bjdong_cd){
    var sido_select = sido_cd;
    var sigungu_select = all_bjdong_cd.substring(0, 5);
    var dong_select = all_bjdong_cd.substring(5, 10);
    // console.log(all_bjdong_cd, " : ", sido_select," : ",sigungu_select," : ",dong_select)
    $('#sido').val(sido_select).prop("selected",true);

    if ($('#sido').val() === sido_select) {
            jQuery('#sigugun').show();
            jQuery('#sigugun').empty();
            jQuery('#sigugun').append(fn_option('', '선택')); //
            jQuery.each(hangjungdong.sigugun, function (idx, code) {
                if (jQuery('#sido > option:selected').val() == code.sido)
                    jQuery('#sigugun').append(fn_option(code.sigugun, code.codeNm));
            });

            //세종특별자치시 예외처리
            //옵션값을 읽어 비교
            if (jQuery('#sido option:selected').val() == '29') {
                jQuery('#sigugun').hide();
                //index를 이용해서 selected 속성(attr)추가
                //기본 선택 옵션이 최상위로 index 0을 가짐
                jQuery('#sigugun option:eq(1)').attr('selected', 'selected');
                //trigger를 이용해 change 실행
                jQuery('#sigugun').trigger('change');
            };
    };

    $('#sigugun').val(sigungu_select).prop("selected",true);

    if ($('#sido').val() === sido_select && $('#sigugun').val() === sigungu_select){
            //option 제거
            jQuery('#dong').empty();
            jQuery.each(hangjungdong.dong, function (idx, code) {
                if (jQuery('#sido > option:selected').val() == code.sido && jQuery('#sigugun > option:selected').val() == code.sigugun)
                    jQuery('#dong').append(fn_option(code.dong, code.codeNm));
            });
            //option의 맨앞에 추가
            jQuery('#dong').prepend(fn_option('', '선택'));
            //option중 선택을 기본으로 선택
            jQuery('#dong option:eq("")').attr('selected', 'selected');
    };

    $('#dong').val(dong_select).prop("selected",true);

    var sido = jQuery('#sido option:selected');
    var sigugun = jQuery('#sigugun option:selected');
    var dong = jQuery('#dong option:selected');

    var dongName = sido.text() + ' / ' + sigugun.text() + ' / ' + dong.text(); // 시도/시군구/읍면동 이름
    jQuery('#s_dongName').text(dongName);
    var shotdongName = dong.text()+" 이웃";
    jQuery('#new_bjdong_nm').text(shotdongName);

    var dongCode = sido.val() + sigugun.val() + dong.val() + '00'; // 읍면동코드
    jQuery('#s_dongCode').text(dongCode);

}
