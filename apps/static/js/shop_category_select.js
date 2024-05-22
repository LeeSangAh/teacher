jQuery(document).ready(function () {
    //indsLclsCd option 추가
    jQuery.each(shop_category.indsLclsCd, function (idx, code) {
        //append를 이용하여 option 하위에 붙여넣음
        jQuery('#indsLclsCd').append(shop_fn_option(code.indsLclsCd, code.codeNm));
    });
    //indsLclsCd 변경시 시군구 option 추가
    jQuery('#indsLclsCd').change(function () {
            jQuery('#indsMclsCd').show();
            jQuery('#indsMclsCd').empty();
            jQuery('#indsMclsCd').append(shop_fn_option('', '선택')); //
            jQuery('#indsSclsCd').empty();
            jQuery('#indsSclsCd').append(shop_fn_option('', '선택')); //
            jQuery.each(shop_category.indsMclsCd, function (idx, code) {
                if (jQuery('#indsLclsCd > option:selected').val() == code.indsLclsCd)
                    jQuery('#indsMclsCd').append(shop_fn_option(code.indsMclsCd, code.codeNm));
            });

        }
    );
    //시군구 변경시 행정동 옵션추가
    jQuery('#indsMclsCd').change(function () {
            //option 제거
            jQuery('#indsSclsCd').empty();
            jQuery.each(shop_category.indsSclsCd, function (idx, code) {
                if (jQuery('#indsLclsCd > option:selected').val() == code.indsLclsCd && jQuery('#indsMclsCd > option:selected').val() == code.indsMclsCd)
                    jQuery('#indsSclsCd').append(shop_fn_option(code.indsSclsCd, code.codeNm));
            });
            //option의 맨앞에 추가
            jQuery('#indsSclsCd').prepend(shop_fn_option('', '선택'));
            //option중 선택을 기본으로 선택
            jQuery('#indsSclsCd option:eq("")').attr('selected', 'selected');
        }
    );

    jQuery('#indsSclsCd').change(function () {
        var indsLclsCd = jQuery('#indsLclsCd option:selected');
        var indsMclsCd = jQuery('#indsMclsCd option:selected');
        var indsSclsCd = jQuery('#indsSclsCd option:selected');

        // var single_indsSclsCdName = indsSclsCd.text();
        // jQuery('#s_indsSclsCdName').text(single_indsSclsCdName);
        var indsSclsCdName = indsLclsCd.text() + ' / ' + indsMclsCd.text() + ' / ' + indsSclsCd.text(); // 시도/시군구/읍면동 이름
        jQuery('#indsSclsCdName').text(indsSclsCdName);

        var indsSclsCdCode = indsLclsCd.val() + indsMclsCd.val() + indsSclsCd.val() + '00'; // 읍면동코드
        jQuery('#indsSclsCdCode').text(indsSclsCdCode);
    });
});
function shop_fn_option(code, name) {
    return '<option value="' + code + '">' + name + '</option>';
}
//     function fn_iframe(url) {
//     jQuery('#iframe').attr('src', url);
// }
// }

function shop_select_set_value(indsLclsCd, indsMclsCd, indsSclsCd){
    console.log(indsLclsCd, " : ", indsMclsCd," : ",indsSclsCd);
    $('#indsLclsCd').val(indsLclsCd).prop("selected",true);

    if ($('#indsLclsCd').val() === indsLclsCd) {
        jQuery('#indsMclsCd').show();
        jQuery('#indsMclsCd').empty();
        jQuery('#indsMclsCd').append(shop_fn_option('', '선택')); //
        jQuery('#indsSclsCd').empty();
        jQuery('#indsSclsCd').append(shop_fn_option('', '선택')); //
        jQuery.each(shop_category.indsMclsCd, function (idx, code) {
            if (jQuery('#indsLclsCd > option:selected').val() == code.indsLclsCd)
                jQuery('#indsMclsCd').append(shop_fn_option(code.indsMclsCd, code.codeNm));
        });
    };
    $('#indsMclsCd').val(indsMclsCd).prop("selected",true);

    if ($('#indsLclsCd').val() === indsLclsCd && $('#indsMclsCd').val() === indsMclsCd){
        //option 제거
        jQuery('#indsSclsCd').empty();
        jQuery.each(shop_category.indsSclsCd, function (idx, code) {
            if (jQuery('#indsLclsCd > option:selected').val() == code.indsLclsCd && jQuery('#indsMclsCd > option:selected').val() == code.indsMclsCd)
                jQuery('#indsSclsCd').append(shop_fn_option(code.indsSclsCd, code.codeNm));
        });
        //option의 맨앞에 추가
        jQuery('#indsSclsCd').prepend(shop_fn_option('', '선택'));
        //option중 선택을 기본으로 선택
        jQuery('#indsSclsCd option:eq("")').attr('selected', 'selected');
    };

    $('#indsSclsCd').val(indsSclsCd).prop("selected",true);
}
