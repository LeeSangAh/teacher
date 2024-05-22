// var kinder_dictObject = {};
// var el_school_dictObject = {};
// var mi_school_dictObject = {};
// var hi_school_dictObject = {};
// var small_busi_dictObject = {};
// var building_dictObject = {};
// var popcnt_dictObject = {};
// var platon_center_dictObject = {};
// var singi_live_dictObject = {};
// var platon_live_dictObject = {};
// var singi_off_dictObject = {};
// var platon_off_dictObject = {};
// var asobi_dictObject = {};

function pup_cnt_button(bjdong) {
    var postdata = {
        'bjdong': bjdong
    }
    $.ajax({
        type: 'POST',
        url: '/map_info/bjdong_heang',
        data: JSON.stringify(postdata),
        dataType: 'JSON',
        contentType: "application/json",
        success: function (data) {
            c = data.result2['id_counter'];
            // popcnt_dictObject = {};

            let pop_con = document.getElementById('popcnt');
            while(pop_con.hasChildNodes()){ //자식 요소가 있는지 확인-false가 될때까지 반복
                pop_con.removeChild(pop_con.firstChild); // 첫번째 자식 요소를 삭제
            }

            for (var i = 1; i <= c; i++) {

                let popcnt = document.getElementById('popcnt');
                let new_pTag1 = document.createElement('p');
                let new_pTag2 = document.createElement('p');

                new_pTag1.setAttribute('class', 'pTag');
                new_pTag1.innerHTML = "&nbsp;<b> * "+ c +"개의 행정동 </b><br><br> "+
                    "&nbsp;<b>"+i+". "+data.result2['emd_' + i]+" (행정동)인구수</b><br>";
                new_pTag2.setAttribute('class', 'pTag');
                new_pTag2.innerHTML = "&nbsp;&nbsp; - 만 0~4세: "+data.result2['kids_cnt_01_' + i]+" 명 <br> "+
                    "&nbsp;&nbsp; - 만 5~8세 (유아 6세~초2): "+ data.result2['kids_cnt_02_' + i] +" 명 <br> "+
                    "&nbsp;&nbsp; - 만 9~12세 (초1~초6): "+ data.result2['kids_cnt_03_' + i] +" 명 <br> "+
                    "&nbsp;&nbsp; - 만 13~15세 (중등): "+data.result2['kids_cnt_04_' + i] +" 명 <br><br> ";
                    // "&nbsp;&nbsp; - 가구수: "+ data.result2['household_cnt_' + i] +"<br> "+
                    // "&nbsp;&nbsp; - 총 가구원 수: "+ data.result2['family_cnt_' + i] +"명 <br> "+
                    // "&nbsp;&nbsp; - 평균가구원수: "+ data.result2['avg_family_cnt_' + i]+"명 <br><br> ";
                popcnt.appendChild(new_pTag1);
                popcnt.appendChild(new_pTag2);
            }

            // for (var key in popcnt_dictObject) {
            //     console.log("key : " + key +", value : " + popcnt_dictObject[key]);
            // }
        },
        beforeSend:function(){
            // (이미지 보여주기 처리)
            $('.wrap-loading2').removeClass('display-none');
        },complete:function(){
            // (이미지 감추기 처리)
            $('.wrap-loading2').addClass('display-none');
        },
        error: function (request, status, error) {
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    })
}

function kinder_button(bjdong_cd){
    var c;
    var bjdong_cd = bjdong_cd
    var postdata = {
        'bjdong_cd':bjdong_cd
    }
    $.ajax({
        type: 'POST',
        url: '/map_info/kinder_info',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data){
            c = data.result2['id_counter'];
            // kinder_dictObject = {};

            let pop_con = document.getElementById('kinder_info');
            while(pop_con.hasChildNodes()){ //자식 요소가 있는지 확인-false가 될때까지 반복
                pop_con.removeChild(pop_con.firstChild); // 첫번째 자식 요소를 삭제
            }

            for (var i = 1; i <= c; i++) {
                // kinder_dictObject[i+"_"+data.result2['kinder_nm_' + i]] = data.result2['kinder_sum_' + i]+"명, "+ data.result2['kinder_cnt_03_' + i] +"명, "
                //     + data.result2['kinder_cnt_04_' + i] +"명, "+ data.result2['kinder_cnt_05_' + i] +"명, " + data.result2['lat_' + i] +", "+ data.result2['lon_' + i];

                let popcnt = document.getElementById('kinder_info');
                let new_pTag1 = document.createElement('p');
                let new_pTag2 = document.createElement('p');

                new_pTag1.setAttribute('class', 'pTag');
                new_pTag1.innerHTML = "<b>"+i+". "+data.result2['kinder_nm_' + i]+"</b>";

                new_pTag2.setAttribute('class', 'pTag');
                new_pTag2.innerHTML = "&nbsp;&nbsp; - 총원: "+data.result2['kinder_sum_' + i]+" 명 <br> "+
                    "&nbsp;&nbsp; - 만 3세: "+ data.result2['kinder_cnt_03_' + i] +" 명 <br> "+
                    "&nbsp;&nbsp; - 만 4세: "+data.result2['kinder_cnt_04_' + i] +" 명 <br> "+
                    "&nbsp;&nbsp; - 만 5세: "+ data.result2['kinder_cnt_05_' + i] +"<br><br> ";
                popcnt.appendChild(new_pTag1);
                popcnt.appendChild(new_pTag2);

            }
            // for (var key in kinder_dictObject) {
            //     console.log("key : " + key +", value : " + kinder_dictObject[key]);
            // }
        },
        error: function(request, status, error){
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    })

}

function el_button(bjdong_cd){
    var c;
    var bjdong_cd = bjdong_cd
    var postdata = {
        'bjdong_cd':bjdong_cd
    }
    $.ajax({
        type: 'POST',
        url: '/map_info/el_school_info',
        data: JSON.stringify(postdata),
        dataType: 'JSON',
        contentType: "application/json",
        success: function (data) {
            c = data.result2['id_counter'];
            // el_school_dictObject = {};

            let pop_con = document.getElementById('el_info');
            while(pop_con.hasChildNodes()){ //자식 요소가 있는지 확인-false가 될때까지 반복
                pop_con.removeChild(pop_con.firstChild); // 첫번째 자식 요소를 삭제
            }

            for (var i = 1; i <= c; i++) {
                // el_school_dictObject[i+"_"+data.result2['school_nm_' + i]] = data.result2['school_cnt_' + i]+"명, "+ data.result2['school_cnt_01' + i] +"명, "+ data.result2['school_cnt_02' + i] +"명, "+ data.result2['school_cnt_03' + i] +"명, "+ data.result2['school_cnt_04' + i] +"명, "+ data.result2['school_cnt_05' + i] +"명, "+ data.result2['school_cnt_06' + i] + data.result2['lat_' + i] +", "+ data.result2['lon_' + i];

                let popcnt = document.getElementById('el_info');
                let new_pTag1 = document.createElement('p');
                let new_pTag2 = document.createElement('p');

                new_pTag1.setAttribute('class', 'pTag');
                new_pTag1.innerHTML = "<b>"+i+". "+data.result2['school_nm_' + i]+"</b>";

                new_pTag2.setAttribute('class', 'pTag');
                new_pTag2.innerHTML = "&nbsp;&nbsp; - 총원: "+data.result2['school_cnt_' + i]+" 명 <br> "+
                    "&nbsp;&nbsp; - 1학년: "+ data.result2['school_cnt_01' + i] +" 명 <br> "+
                    "&nbsp;&nbsp; - 2학년: "+data.result2['school_cnt_02' + i] +" 명 <br> "+
                    "&nbsp;&nbsp; - 3학년: "+ data.result2['school_cnt_03' + i] +" 명 <br> "+
                    "&nbsp;&nbsp; - 4학년: "+data.result2['school_cnt_04' + i] +" 명 <br> "+
                    "&nbsp;&nbsp; - 5학년: "+data.result2['school_cnt_05' + i] +" 명 <br> "+
                    "&nbsp;&nbsp; - 6학년: "+ data.result2['school_cnt_06' + i] +"<br><br> ";
                popcnt.appendChild(new_pTag1);
                popcnt.appendChild(new_pTag2);
            }
            // alert(Object.keys(el_school_dictObject).length);
            // for (var key in el_school_dictObject) {
            //     console.log("key : " + key +", value : " + el_school_dictObject[key]);
            // }
        },
        error: function (request, status, error) {
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    })

}

function mi_button(bjdong_cd){
    var c;
    var bjdong_cd = bjdong_cd
    var postdata = {
       'bjdong_cd':bjdong_cd
    }
    $.ajax({
        type: 'POST',
        url: '/map_info/mi_school_info',
        data: JSON.stringify(postdata),
        dataType: 'JSON',
        contentType: "application/json",
        success: function (data) {
            c = data.result2['id_counter'];
            // mi_school_dictObject = {};
            let pop_con = document.getElementById('mi_info');
            while(pop_con.hasChildNodes()){ //자식 요소가 있는지 확인-false가 될때까지 반복
                pop_con.removeChild(pop_con.firstChild); // 첫번째 자식 요소를 삭제
            }
            for (var i = 1; i <= c; i++) {
                // mi_school_dictObject[i+"_"+data.result2['school_nm_' + i]] = data.result2['school_cnt_' + i]+"명, "+ data.result2['school_cnt_01' + i]+"명, "+ data.result2['school_cnt_02' + i] +"명, "+ data.result2['school_cnt_03' + i]+ data.result2['lat_' + i] +", "+ data.result2['lon_' + i];

                let popcnt = document.getElementById('mi_info');
                let new_pTag1 = document.createElement('p');
                let new_pTag2 = document.createElement('p');

                new_pTag1.setAttribute('class', 'pTag');
                new_pTag1.innerHTML = "<b>"+i+". "+data.result2['school_nm_' + i]+"</b>";

                new_pTag2.setAttribute('class', 'pTag');
                new_pTag2.innerHTML = "&nbsp;&nbsp; - 총원: "+data.result2['school_cnt_' + i]+" 명 <br> "+
                    "&nbsp;&nbsp; - 1학년: "+ data.result2['school_cnt_01' + i] +" 명 <br> "+
                    "&nbsp;&nbsp; - 2학년: "+data.result2['school_cnt_02' + i] +" 명 <br> "+
                    "&nbsp;&nbsp; - 3학년: "+ data.result2['school_cnt_03' + i] +" 명 <br><br> ";
                popcnt.appendChild(new_pTag1);
                popcnt.appendChild(new_pTag2);

            }
            // alert(Object.keys(mi_school_dictObject).length);
            // for (var key in mi_school_dictObject) {
            //     console.log("key : " + key +", value : " + mi_school_dictObject[key]);
            // }
        },
        error: function (request, status, error) {
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    })

}

function hi_button(bjdong_cd){
    var c;
    var bjdong_cd = bjdong_cd
    var postdata = {
        'bjdong_cd':bjdong_cd
    }
    $.ajax({
        type: 'POST',
        url: '/map_info/hi_school_info',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data){
            c = data.result2['id_counter'];
            // hi_school_dictObject = {};
            let pop_con = document.getElementById('hi_info');
            while(pop_con.hasChildNodes()){ //자식 요소가 있는지 확인-false가 될때까지 반복
                pop_con.removeChild(pop_con.firstChild); // 첫번째 자식 요소를 삭제
            }
            for (var i = 1; i <= c; i++) {

                // hi_school_dictObject[i+"_"+data.result2['school_nm_' + i]] = data.result2['school_cnt_' + i]+"명, " + data.result2['school_cnt_01' + i]+"명, " + data.result2['school_cnt_02' + i]+"명, " + data.result2['school_cnt_03' + i] + data.result2['lat_' + i] +", "+ data.result2['lon_' + i];

                let popcnt = document.getElementById('hi_info');
                let new_pTag1 = document.createElement('p');
                let new_pTag2 = document.createElement('p');

                new_pTag1.setAttribute('class', 'pTag');
                new_pTag1.innerHTML = "<b>"+i+". "+data.result2['school_nm_' + i]+"</b>";

                new_pTag2.setAttribute('class', 'pTag');
                new_pTag2.innerHTML = "&nbsp;&nbsp; - 총원: "+data.result2['school_cnt_' + i]+" 명 <br> "+
                    "&nbsp;&nbsp; - 1학년: "+ data.result2['school_cnt_01' + i] +" 명 <br> "+
                    "&nbsp;&nbsp; - 2학년: "+data.result2['school_cnt_02' + i] +" 명 <br> "+
                    "&nbsp;&nbsp; - 3학년: "+ data.result2['school_cnt_03' + i] +" 명 <br><br> ";
                popcnt.appendChild(new_pTag1);
                popcnt.appendChild(new_pTag2);


            }
            // alert(Object.keys(hi_school_dictObject).length);
            // for (var key in hi_school_dictObject) {
            //     console.log("key : " + key +", value : " + hi_school_dictObject[key]);
            // }

        },
        error: function(request, status, error){
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    })

}

function ed_button(bjdong_cd){
    var c;
    var bjdong_cd = bjdong_cd
    var postdata = {
        'bjdong_cd':bjdong_cd
    }
    $.ajax({
        type: 'POST',
        url: '/map_info/shop_info_ajax',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data){
            c = data.result2['id_counter'];
            // small_busi_dictObject = {};
            let pop_con = document.getElementById('ed_info');
            while(pop_con.hasChildNodes()){ //자식 요소가 있는지 확인-false가 될때까지 반복
                pop_con.removeChild(pop_con.firstChild); // 첫번째 자식 요소를 삭제
            }
            for (var i = 1; i <= c; i++) {

                // small_busi_dictObject[i+"_"+data.result2['indsSclsNm_' + i]+"_"+data.result2['bizesNm_' + i]] = data.result2['lat_' + i] +", "+ data.result2['lon_' + i];

                let popcnt = document.getElementById('ed_info');
                let new_pTag1 = document.createElement('p');
                let new_pTag2 = document.createElement('p');

                new_pTag1.setAttribute('class', 'pTag');
                new_pTag1.innerHTML = i+". "+data.result2['indsSclsNm_' + i]+"_"+data.result2['bizesNm_' + i];

                popcnt.appendChild(new_pTag1);

            }
            // alert(Object.keys(small_busi_dictObject).length);
            // for (var key in small_busi_dictObject) {
            //     console.log("key : " + key +", value : " + small_busi_dictObject[key]);
            // }

        },
        error: function(request, status, error){
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    })
}

function building_button(bjdong_cd){
    var c;
    var bjdong_cd = bjdong_cd

    var postdata = {
       'bjdong_cd':bjdong_cd
    }
    $.ajax({
        type: 'POST',
        url: '/map_info/building_info',
        data: JSON.stringify(postdata),
        dataType: 'JSON',
        contentType: "application/json",
        success: function (data) {
            c = data.result2['id_counter'];

            // building_dictObject = {};
            let pop_con = document.getElementById('buinding_info');
            while(pop_con.hasChildNodes()){ //자식 요소가 있는지 확인-false가 될때까지 반복
                pop_con.removeChild(pop_con.firstChild); // 첫번째 자식 요소를 삭제
            }
            for (var i = 1; i <= c; i++) {

                // building_dictObject[i+"_"+data.result2['bldNm_' + i]+"_"+data.result2['dongnm_' + i]] = data.result2['hhldCnt_' + i]+" 세대, "+ data.result2['lat_' + i] +", "+ data.result2['lon_' + i];

                let popcnt = document.getElementById('buinding_info');
                let new_pTag1 = document.createElement('p');
                let new_pTag2 = document.createElement('p');

                new_pTag1.setAttribute('class', 'pTag');
                new_pTag1.innerHTML = i+". "+data.result2['bldNm_' + i]+"_"+data.result2['dongnm_' + i]+": "+data.result2['hhldCnt_' + i]+" 세대 ";

                popcnt.appendChild(new_pTag1);


            }
            // alert(Object.keys(building_dictObject).length);
            // for (var key in building_dictObject) {
            //     console.log("key : " + key +", value : " + building_dictObject[key]);
            // }

        },
        error: function (request, status, error) {
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
        ,timeout:100000 //"응답제한시간 ms"
    })
}

function platon_button(bjdong_cd) {
    var c;
    var bjdong_cd = bjdong_cd
    var postdata = {
        'bjdong_cd':bjdong_cd
    }
    $.ajax({
        type: 'POST',
        url: '/map_info/platon_info',
        data: JSON.stringify(postdata),
        dataType: 'JSON',
        contentType: "application/json",
        success: function (data) {
            c = data.result2['id_counter'];
            // platon_center_dictObject = {};

            for (var i = 1; i <= c; i++) {
                // platon_center_dictObject[i+"_"+data.result2['loc_info_' + i]] = data.result2['mem_cnt_' + i]+" 명, "+ data.result2['lat_' + i] +", "+ data.result2['lon_' + i];
            }
            // for (var key in platon_center_dictObject) {
            //     console.log("key : " + key +", value : " + platon_center_dictObject[key]);
            // }
        },
        error: function (request, status, error) {
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    })
    // }
};

function platon_custom_button(bjdong_cd){
    var c;
    var bjdong_cd = bjdong_cd
    var postdata = {
        'bjdong_cd':bjdong_cd
    }
    $.ajax({
        type: 'POST',
        url: '/map_info/platon_member_info',
        data: JSON.stringify(postdata),
        dataType: 'JSON',
        contentType: "application/json",
        success: function (data) {
            c = data.result2['id_counter'];
            // platon_live_dictObject = {};
            let pop_con = document.getElementById('platon_live_info');
            while(pop_con.hasChildNodes()){ //자식 요소가 있는지 확인-false가 될때까지 반복
                pop_con.removeChild(pop_con.firstChild); // 첫번째 자식 요소를 삭제
            }
            for (var i = 1; i <= c; i++) {
                var birthDate  = data.result2['birth_' + i]
                var y = birthDate .substr(0, 4);
                var m = birthDate .substr(4, 2);
                var d = birthDate .substr(6, 2);
                var today = new Date();
                birthDate = new Date(y,m-1,d);
                var age = today.getFullYear() - birthDate.getFullYear() + 1;

                // platon_live_dictObject[i+"_"+data.result2['member_nm_' + i]] = data.result2['birth_' + i]+"/"+age+" 세, "+ data.result2['sap_num_' + i]+", "
                //     + data.result2['center_nm_' + i]+", "+ data.result2['teacher_nm_' + i]+", "+ data.result2['lectuer_type_' + i]+", "+ data.result2['parents_nm_' + i]+", "
                //     + data.result2['parents_cell_' + i]+", "+ data.result2['edu_nm_' + i]+ data.result2['lat_' + i] +", "+ data.result2['lon_' + i];

                let popcnt = document.getElementById('platon_live_info');
                let new_pTag1 = document.createElement('p');
                let new_pTag2 = document.createElement('p');

                new_pTag1.setAttribute('class', 'pTag');
                new_pTag1.innerHTML = i+". "+data.result2['member_nm_' + i]+": "+data.result2['birth_' + i]+"/"+age+" 세, "+ data.result2['sap_num_' + i]+", "
                    + data.result2['center_nm_' + i]+", "+ data.result2['teacher_nm_' + i]+", "+ data.result2['lectuer_type_' + i]+", "+ data.result2['parents_nm_' + i]+", "
                    + data.result2['parents_cell_' + i]+", "+ data.result2['edu_nm_' + i];

                popcnt.appendChild(new_pTag1);

            }
            // for (var key in platon_live_dictObject) {
            //     console.log("key : " + key +", value : " + platon_live_dictObject[key]);
            // }
        },
        error: function (request, status, error) {
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    })
    // }
};

function singi_custom_button(bjdong_cd){
    var c;
    var bjdong_cd = bjdong_cd;
    var postdata = {
        'bjdong_cd':bjdong_cd
    }
    $.ajax({
        type: 'POST',
        url: '/map_info/singi_member_info',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data){
            c = data.result2['id_counter'];
            // singi_live_dictObject = {};
            let pop_con = document.getElementById('singi_live_info');
            while(pop_con.hasChildNodes()){ //자식 요소가 있는지 확인-false가 될때까지 반복
                pop_con.removeChild(pop_con.firstChild); // 첫번째 자식 요소를 삭제
            }
            for (var i = 1; i <= c; i++) {
                var birthDate  = data.result2['birth_' + i]
                var y = birthDate .substr(0, 4);
                var m = birthDate .substr(4, 2);
                var d = birthDate .substr(6, 2);
                var today = new Date();
                birthDate = new Date(y,m-1,d);
                var age = today.getFullYear() - birthDate.getFullYear() + 1;

                // singi_live_dictObject[i+"_"+data.result2['member_nm_' + i]] = data.result2['birth_' + i]+"/"+age+" 세, "+ data.result2['sap_num_' + i]+", "
                //     + data.result2['center_nm_' + i]+", "+ data.result2['teacher_nm_' + i]+", "+ data.result2['lectuer_type_' + i]+", "+ data.result2['parents_nm_' + i]+", "
                //     + data.result2['parents_cell_' + i]+", "+ data.result2['edu_nm_' + i]+ data.result2['lat_' + i] +", "+ data.result2['lon_' + i];

                let popcnt = document.getElementById('singi_live_info');
                let new_pTag1 = document.createElement('p');
                let new_pTag2 = document.createElement('p');

                new_pTag1.setAttribute('class', 'pTag');
                new_pTag1.innerHTML = i+". "+data.result2['member_nm_' + i]+": "+data.result2['birth_' + i]+"/"+age+" 세, "+ data.result2['sap_num_' + i]+", "
                    + data.result2['center_nm_' + i]+", "+ data.result2['teacher_nm_' + i]+", "+ data.result2['lectuer_type_' + i]+", "+ data.result2['parents_nm_' + i]+", "
                    + data.result2['parents_cell_' + i]+", "+ data.result2['edu_nm_' + i];

                popcnt.appendChild(new_pTag1);
            }
            // for (var key in singi_live_dictObject) {
            //     console.log("key : " + key +", value : " + singi_live_dictObject[key]);
            // }
        },
        error: function(request, status, error){
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    })
};

function platon_stop_custom_button(bjdong_cd){
    var c;
    var bjdong_cd = bjdong_cd;
    var postdata = {
        'bjdong_cd':bjdong_cd
    }
    $.ajax({
        type: 'POST',
        url: '/map_info/platon_stop_member_info',
        data: JSON.stringify(postdata),
        dataType: 'JSON',
        contentType: "application/json",
        success: function (data) {
            c = data.result2['id_counter'];
            // platon_off_dictObject = {};
            let pop_con = document.getElementById('platon_off_info');
            while(pop_con.hasChildNodes()){ //자식 요소가 있는지 확인-false가 될때까지 반복
                pop_con.removeChild(pop_con.firstChild); // 첫번째 자식 요소를 삭제
            }
            for (var i = 1; i <= c; i++) {
                var birthDate  = data.result2['birth_' + i]
                var y = birthDate .substr(0, 4);
                var m = birthDate .substr(4, 2);
                var d = birthDate .substr(6, 2);
                var today = new Date();
                birthDate = new Date(y,m-1,d);
                var age = today.getFullYear() - birthDate.getFullYear() + 1;

                // platon_off_dictObject[i+"_"+data.result2['member_nm_' + i]] = data.result2['birth_' + i]+"/"+age+" 세, "+ data.result2['sap_num_' + i]+", "
                //     + data.result2['center_nm_' + i]+", "+ data.result2['teacher_nm_' + i]+", "+ data.result2['lectuer_type_' + i]+", "+ data.result2['parents_nm_' + i]+", "
                //     + data.result2['parents_cell_' + i]+", "+ data.result2['edu_nm_' + i]+ data.result2['lat_' + i] +", "+ data.result2['lon_' + i];

                let popcnt = document.getElementById('platon_off_info');
                let new_pTag1 = document.createElement('p');
                let new_pTag2 = document.createElement('p');

                new_pTag1.setAttribute('class', 'pTag');
                new_pTag1.innerHTML = i+". "+data.result2['member_nm_' + i]+": "+data.result2['birth_' + i]+"/"+age+" 세, "+ data.result2['sap_num_' + i]+", "
                    + data.result2['center_nm_' + i]+", "+ data.result2['teacher_nm_' + i]+", "+ data.result2['lectuer_type_' + i]+", "+ data.result2['parents_nm_' + i]+", "
                    + data.result2['parents_cell_' + i]+", "+ data.result2['edu_nm_' + i];

                popcnt.appendChild(new_pTag1);
            }
            // for (var key in platon_off_dictObject) {
            //     console.log("key : " + key +", value : " + platon_off_dictObject[key]);
            // }
        },
        error: function (request, status, error) {
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    })
    // }
};

function singi_stop_custom_button(bjdong_cd){
    var c;
    var bjdong_cd = bjdong_cd;
    var postdata = {
        'bjdong_cd':bjdong_cd
    }
    $.ajax({
        type: 'POST',
        url: '/map_info/singi_stop_member_info',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data){
            c = data.result2['id_counter'];
            // singi_off_dictObject = {};
            let pop_con = document.getElementById('singi_off_info');
            while(pop_con.hasChildNodes()){ //자식 요소가 있는지 확인-false가 될때까지 반복
                pop_con.removeChild(pop_con.firstChild); // 첫번째 자식 요소를 삭제
            }
            for (var i = 1; i <= c; i++) {
                var birthDate  = data.result2['birth_' + i]
                var y = birthDate .substr(0, 4);
                var m = birthDate .substr(4, 2);
                var d = birthDate .substr(6, 2);
                var today = new Date();
                birthDate = new Date(y,m-1,d);
                var age = today.getFullYear() - birthDate.getFullYear() + 1;

                // singi_off_dictObject[i+"_"+data.result2['member_nm_' + i]] = data.result2['birth_' + i]+"/"+age+" 세, "+ data.result2['sap_num_' + i]+", "
                //     + data.result2['center_nm_' + i]+", "+ data.result2['teacher_nm_' + i]+", "+ data.result2['lectuer_type_' + i]+", "+ data.result2['parents_nm_' + i]+", "
                //     + data.result2['parents_cell_' + i]+", "+ data.result2['edu_nm_' + i]+ data.result2['lat_' + i] +", "+ data.result2['lon_' + i];

                let popcnt = document.getElementById('singi_off_info');
                let new_pTag1 = document.createElement('p');
                let new_pTag2 = document.createElement('p');

                new_pTag1.setAttribute('class', 'pTag');
                new_pTag1.innerHTML = i+". "+data.result2['member_nm_' + i]+": "+data.result2['birth_' + i]+"/"+age+" 세, "+ data.result2['sap_num_' + i]+", "
                    + data.result2['center_nm_' + i]+", "+ data.result2['teacher_nm_' + i]+", "+ data.result2['lectuer_type_' + i]+", "+ data.result2['parents_nm_' + i]+", "
                    + data.result2['parents_cell_' + i]+", "+ data.result2['edu_nm_' + i];

                popcnt.appendChild(new_pTag1);

            }
            // for (var key in singi_off_dictObject) {
            //     console.log("key : " + key +", value : " + singi_off_dictObject[key]);
            // }
        },
        error: function(request, status, error){
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    })
    // }
};

function asobi_button(bjdong_cd) {
    var c;
    var bjdong_cd = bjdong_cd
    var postdata = {
        'bjdong_cd':bjdong_cd
    }
    $.ajax({
        type: 'POST',
        url: '/map_info/asobi_bjdong_info',
        data: JSON.stringify(postdata),
        dataType: 'JSON',
        contentType: "application/json",
        success: function (data) {
            c = data.result2['id_counter'];
            // asobi_dictObject = {};
            for (var i = 1; i <= c; i++) {
                // asobi_dictObject[i+"_"+data.result2['storeNm_' + i]] = data.result2['Addr_' + i] +", "+ data.result2['lat_' + i] +", "+ data.result2['lon_' + i];
            }
            // for (var key in asobi_dictObject) {
            //     console.log("key : " + key +", value : " + asobi_dictObject[key]);
            // }
        },
        error: function (request, status, error) {
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    })
};

