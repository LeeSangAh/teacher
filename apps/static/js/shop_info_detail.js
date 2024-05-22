// var session_id;
var user_loc_lat;
var user_loc_lon;
var bjdong_cd;
var sido_cd;

// **************** 학원 별점 평가 ***********************
$('#academy_rating_submit').click(function(){
    if (session_id){
        var rating_01 = document.getElementById('rating_01');
        var rating_01_checked = rating_01.checked;
        var rating_02 = document.getElementById('rating_02');
        var rating_02_checked = rating_02.checked;
        var rating_03 = document.getElementById('rating_03');
        var rating_03_checked = rating_03.checked;
        var rating_04 = document.getElementById('rating_04');
        var rating_04_checked = rating_04.checked;
        var rating_05 = document.getElementById('rating_05');
        var rating_05_checked = rating_05.checked;
        var rating_06 = document.getElementById('rating_06');
        var rating_06_checked = rating_06.checked;
        var academy_id = document.getElementById('academy_id').value;

        var postdata = {
            'academy_id':academy_id, 'rating_01':rating_01_checked, 'rating_02':rating_02_checked, 'rating_03':rating_03_checked, 'rating_04':rating_04_checked, 'rating_05':rating_05_checked, 'rating_06':rating_06_checked
        }

        if (rating_01_checked == false && rating_02_checked == false && rating_03_checked == false && rating_04_checked == false && rating_05_checked == false && rating_06_checked == false){
            alert("평가를 선택하세요.")
        }else{
            $.ajax({
                type: "post",
                url: "/edu_info/academy_ratting",
                data: JSON.stringify(postdata),
                dataType: 'json',
                contentType: "application/json",
                success: function (data) {
                    alert("감사합니다.");

                    document.getElementById('rating_checked').style.display = 'none';
                    // document.getElementById('star_rate_all').style.display = 'block';
                    //
                    // var zone_rating_01_avg = data.result2['zone_rating_01_avg']
                    // var zone_rating_02_avg = data.result2['zone_rating_02_avg']
                    // var zone_rating_03_avg = data.result2['zone_rating_03_avg']
                    // var zone_rating_04_avg = data.result2['zone_rating_04_avg']
                    // var zone_rating_05_avg = data.result2['zone_rating_05_avg']
                    // var zone_rating_06_avg = data.result2['zone_rating_06_avg']
                    //
                    // console.log(zone_rating_01_avg, zone_rating_02_avg, zone_rating_03_avg, zone_rating_03_avg, zone_rating_04_avg, zone_rating_05_avg, zone_rating_06_avg)
                    // $("#sisul_0").append("- 시설: ");
                    // $("#traffic_0").append("- 교통: ");
                    // $("#price_0").append("- 수업료: ");
                    // $("#friends_0").append("- 맛: ");
                    // $("#personal_0").append("- 분위기: ");
                    // $("#teacher_0").append("- 실력: ");
                    //
                    // if (zone_rating_01_avg >= 0 && zone_rating_01_avg < 0.21 ){
                    //     $("#sisul_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#sisul_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    //     $("#sisul_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    //     $("#sisul_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    //     $("#sisul_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    // }else if(zone_rating_01_avg >= 0.21 && zone_rating_01_avg < 0.41){
                    //     $("#sisul_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#sisul_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#sisul_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    //     $("#sisul_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    //     $("#sisul_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    // }else if(zone_rating_01_avg >= 0.41 && zone_rating_01_avg < 0.61){
                    //     $("#sisul_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#sisul_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#sisul_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#sisul_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    //     $("#sisul_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    // }else if(zone_rating_01_avg >= 0.61 && zone_rating_01_avg < 0.81){
                    //     $("#sisul_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#sisul_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#sisul_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#sisul_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#sisul_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    // }else if(zone_rating_01_avg >= 0.81 && zone_rating_01_avg <= 1){
                    //     $("#sisul_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#sisul_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#sisul_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#sisul_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#sisul_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    // }
                    //
                    // if (zone_rating_02_avg >= 0 && zone_rating_02_avg < 0.21 ){
                    //     $("#traffic_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#traffic_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    //     $("#traffic_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    //     $("#traffic_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    //     $("#traffic_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    // }else if(zone_rating_02_avg >= 0.21 && zone_rating_02_avg < 0.41){
                    //     $("#traffic_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#traffic_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#traffic_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    //     $("#traffic_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    //     $("#traffic_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    // }else if(zone_rating_02_avg >= 0.41 && zone_rating_02_avg < 0.61){
                    //     $("#traffic_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#traffic_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#traffic_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#traffic_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    //     $("#traffic_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    // }else if(zone_rating_02_avg >= 0.61 && zone_rating_02_avg < 0.81){
                    //     $("#traffic_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#traffic_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#traffic_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#traffic_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#traffic_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    // }else if(zone_rating_02_avg >= 0.81 && zone_rating_02_avg <= 1){
                    //     $("#traffic_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#traffic_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#traffic_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#traffic_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#traffic_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    // }
                    //
                    // if (zone_rating_03_avg >= 0 && zone_rating_03_avg < 0.21 ){
                    //     $("#price_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#price_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    //     $("#price_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    //     $("#price_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    //     $("#price_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    // }else if(zone_rating_03_avg >= 0.21 && zone_rating_03_avg < 0.41){
                    //     $("#price_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#price_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#price_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    //     $("#price_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    //     $("#price_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    // }else if(zone_rating_03_avg >= 0.41 && zone_rating_03_avg < 0.61){
                    //     $("#price_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#price_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#price_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#price_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    //     $("#price_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    // }else if(zone_rating_03_avg >= 0.61 && zone_rating_03_avg < 0.81){
                    //     $("#price_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#price_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#price_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#price_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#price_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    // }else if(zone_rating_03_avg >= 0.81 && zone_rating_03_avg <= 1){
                    //     $("#price_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#price_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#price_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#price_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#price_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    // }
                    //
                    // if (zone_rating_04_avg >= 0 && zone_rating_04_avg < 0.21 ){
                    //     $("#friends_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#friends_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    //     $("#friends_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    //     $("#friends_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    //     $("#friends_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    // }else if(zone_rating_04_avg >= 0.21 && zone_rating_04_avg < 0.41){
                    //     $("#friends_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#friends_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#friends_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    //     $("#friends_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    //     $("#friends_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    // }else if(zone_rating_04_avg >= 0.41 && zone_rating_04_avg < 0.61){
                    //     $("#friends_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#friends_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#friends_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#friends_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    //     $("#friends_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    // }else if(zone_rating_04_avg >= 0.61 && zone_rating_04_avg < 0.81){
                    //     $("#friends_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#friends_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#friends_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#friends_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#friends_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    // }else if(zone_rating_04_avg >= 0.81 && zone_rating_04_avg <= 1){
                    //     $("#friends_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#friends_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#friends_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#friends_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#friends_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    // }
                    //
                    // if (zone_rating_05_avg >= 0 && zone_rating_05_avg < 0.21 ){
                    //     $("#personal_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#personal_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    //     $("#personal_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    //     $("#personal_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    //     $("#personal_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    // }else if(zone_rating_05_avg >= 0.21 && zone_rating_05_avg < 0.41){
                    //     $("#personal_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#personal_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#personal_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    //     $("#personal_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    //     $("#personal_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    // }else if(zone_rating_05_avg >= 0.41 && zone_rating_05_avg < 0.61){
                    //     $("#personal_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#personal_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#personal_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#personal_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    //     $("#personal_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    // }else if(zone_rating_05_avg >= 0.61 && zone_rating_05_avg < 0.81){
                    //     $("#personal_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#personal_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#personal_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#personal_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#personal_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    // }else if(zone_rating_05_avg >= 0.81 && zone_rating_05_avg <= 1){
                    //     $("#personal_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#personal_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#personal_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#personal_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#personal_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    // }
                    //
                    // if (zone_rating_06_avg >= 0 && zone_rating_06_avg < 0.21 ){
                    //     $("#teacher_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#teacher_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    //     $("#teacher_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    //     $("#teacher_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    //     $("#teacher_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    // }else if(zone_rating_06_avg >= 0.21 && zone_rating_06_avg < 0.41){
                    //     $("#teacher_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#teacher_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#teacher_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    //     $("#teacher_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    //     $("#teacher_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    // }else if(zone_rating_06_avg >= 0.41 && zone_rating_06_avg < 0.61){
                    //     $("#teacher_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#teacher_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#teacher_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#teacher_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    //     $("#teacher_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    // }else if(zone_rating_06_avg >= 0.61 && zone_rating_06_avg < 0.81){
                    //     $("#teacher_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#teacher_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#teacher_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#teacher_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#teacher_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    // }else if(zone_rating_06_avg >= 0.81 && zone_rating_06_avg <= 1){
                    //     $("#teacher_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#teacher_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#teacher_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#teacher_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    //     $("#teacher_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    // }

                },
                error: function(request, status, error) {
                    alert('데이터를 가지고 오는데 실패했습니다.');
                    alert(error);
                }
            });
        }
    }else{
        alert("로그인이 필요합니다.");
        location.href="/login";
    }
});

function zone_rating(zone_rating_01_avg, zone_rating_02_avg, zone_rating_03_avg, zone_rating_04_avg, zone_rating_05_avg, zone_rating_06_avg){
    $("#sisul_0").append("- 시설: ");
    $("#traffic_0").append("- 교통: ");
    $("#price_0").append("- 수업료: ");
    $("#friends_0").append("- 맛: ");
    $("#personal_0").append("- 분위기: ");
    $("#teacher_0").append("- 실력: ");
    if (zone_rating_01_avg >= 0 && zone_rating_01_avg < 0.21 ){
        $("#sisul_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#sisul_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
        $("#sisul_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
        $("#sisul_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
        $("#sisul_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
    }else if(zone_rating_01_avg >= 0.21 && zone_rating_01_avg < 0.41){
        $("#sisul_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#sisul_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#sisul_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
        $("#sisul_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
        $("#sisul_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
    }else if(zone_rating_01_avg >= 0.41 && zone_rating_01_avg < 0.61){
        $("#sisul_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#sisul_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#sisul_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#sisul_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
        $("#sisul_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
    }else if(zone_rating_01_avg >= 0.61 && zone_rating_01_avg < 0.81){
        $("#sisul_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#sisul_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#sisul_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#sisul_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#sisul_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
    }else if(zone_rating_01_avg >= 0.81 && zone_rating_01_avg <= 1){
        $("#sisul_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#sisul_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#sisul_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#sisul_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#sisul_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
    }

    if (zone_rating_02_avg >= 0 && zone_rating_02_avg < 0.21 ){
        $("#traffic_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#traffic_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
        $("#traffic_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
        $("#traffic_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
        $("#traffic_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
    }else if(zone_rating_02_avg >= 0.21 && zone_rating_02_avg < 0.41){
        $("#traffic_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#traffic_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#traffic_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
        $("#traffic_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
        $("#traffic_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
    }else if(zone_rating_02_avg >= 0.41 && zone_rating_02_avg < 0.61){
        $("#traffic_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#traffic_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#traffic_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#traffic_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
        $("#traffic_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
    }else if(zone_rating_02_avg >= 0.61 && zone_rating_02_avg < 0.81){
        $("#traffic_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#traffic_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#traffic_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#traffic_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#traffic_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
    }else if(zone_rating_02_avg >= 0.81 && zone_rating_02_avg <= 1){
        $("#traffic_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#traffic_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#traffic_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#traffic_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#traffic_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
    }

    if (zone_rating_03_avg >= 0 && zone_rating_03_avg < 0.21 ){
        $("#price_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#price_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
        $("#price_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
        $("#price_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
        $("#price_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
    }else if(zone_rating_03_avg >= 0.21 && zone_rating_03_avg < 0.41){
        $("#price_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#price_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#price_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
        $("#price_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
        $("#price_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
    }else if(zone_rating_03_avg >= 0.41 && zone_rating_03_avg < 0.61){
        $("#price_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#price_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#price_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#price_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
        $("#price_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
    }else if(zone_rating_03_avg >= 0.61 && zone_rating_03_avg < 0.81){
        $("#price_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#price_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#price_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#price_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#price_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
    }else if(zone_rating_03_avg >= 0.81 && zone_rating_03_avg <= 1){
        $("#price_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#price_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#price_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#price_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#price_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
    }

    if (zone_rating_04_avg >= 0 && zone_rating_04_avg < 0.21 ){
        $("#friends_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#friends_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
        $("#friends_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
        $("#friends_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
        $("#friends_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
    }else if(zone_rating_04_avg >= 0.21 && zone_rating_04_avg < 0.41){
        $("#friends_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#friends_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#friends_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
        $("#friends_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
        $("#friends_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
    }else if(zone_rating_04_avg >= 0.41 && zone_rating_04_avg < 0.61){
        $("#friends_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#friends_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#friends_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#friends_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
        $("#friends_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
    }else if(zone_rating_04_avg >= 0.61 && zone_rating_04_avg < 0.81){
        $("#friends_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#friends_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#friends_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#friends_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#friends_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
    }else if(zone_rating_04_avg >= 0.81 && zone_rating_04_avg <= 1){
        $("#friends_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#friends_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#friends_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#friends_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#friends_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
    }

    if (zone_rating_05_avg >= 0 && zone_rating_05_avg < 0.21 ){
        $("#personal_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#personal_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
        $("#personal_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
        $("#personal_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
        $("#personal_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
    }else if(zone_rating_05_avg >= 0.21 && zone_rating_05_avg < 0.41){
        $("#personal_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#personal_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#personal_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
        $("#personal_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
        $("#personal_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
    }else if(zone_rating_05_avg >= 0.41 && zone_rating_05_avg < 0.61){
        $("#personal_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#personal_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#personal_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#personal_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
        $("#personal_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
    }else if(zone_rating_05_avg >= 0.61 && zone_rating_05_avg < 0.81){
        $("#personal_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#personal_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#personal_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#personal_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#personal_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
    }else if(zone_rating_05_avg >= 0.81 && zone_rating_05_avg <= 1){
        $("#personal_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#personal_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#personal_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#personal_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#personal_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
    }

    if (zone_rating_06_avg >= 0 && zone_rating_06_avg < 0.21 ){
        $("#teacher_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#teacher_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
        $("#teacher_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
        $("#teacher_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
        $("#teacher_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
    }else if(zone_rating_06_avg >= 0.21 && zone_rating_06_avg < 0.41){
        $("#teacher_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#teacher_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#teacher_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
        $("#teacher_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
        $("#teacher_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
    }else if(zone_rating_06_avg >= 0.41 && zone_rating_06_avg < 0.61){
        $("#teacher_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#teacher_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#teacher_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#teacher_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
        $("#teacher_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
    }else if(zone_rating_06_avg >= 0.61 && zone_rating_06_avg < 0.81){
        $("#teacher_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#teacher_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#teacher_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#teacher_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#teacher_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
    }else if(zone_rating_06_avg >= 0.81 && zone_rating_06_avg <= 1){
        $("#teacher_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#teacher_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#teacher_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#teacher_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#teacher_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
    }
}

// ************* 학원 별점 평가 끝 ************************

function pic(e, idx) {
    var unlike = "unlike_"+idx;
    var like = "like_"+idx;
    var imgElement= $(e).attr('id');
    var like_status;
    var gubun_01 = "01";
    if (imgElement == like) {
        document.getElementById(imgElement).src = "/static/images/like_02.png";
        document.getElementById(imgElement).setAttribute("id", unlike);
        like_status = 1;
    } else if (imgElement == unlike)
    {
        document.getElementById(imgElement).src = "/static/images/like_01.png";
        document.getElementById(imgElement).setAttribute("id", like);
        like_status = 0;
    }
    var postdata = {
        'zone_idx':idx, 'like_status':like_status, 'gubun_01': gubun_01
    }
    $.ajax({
        type: 'POST',
        url: '/member_activity/zone_like',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(){
            if (like_status == 1){
                alert("좋아요!");
            }
        },
        error: function(request, status, error){
            alert('데이터를 가지고 오는데 실패했습니다.')
            alert(error);
        }
    })
}

// 평 남기기
const form_data = new FormData();
$('#post_submit_review').click(function(){
    if(session_id) {
        var academy_id = document.getElementById('academy_id').value
        var review_textArea = document.getElementById('review_textArea').value
        if (review_textArea != "") {
            form_data.append('academy_id', academy_id);
            form_data.append('review_textArea', review_textArea);

            $.ajax({
                type: "POST",
                url: '/edu_info/academy_review',
                data: form_data,
                dataType: 'JSON',
                contentType: false,
                cache: false,
                processData: false,
                success: function (response) {
                    alert("정상적으로 등록되었습니다.");
                    $('#review_input').empty();
                    $('#data-container').empty();
                    review_loadPage(1)
                },
                error: function (xhr) {
                    console.log('Error occurred while fetching data.');
                }
            });
        } else {
            alert("리뷰를 작성해주세요.");
        }
    }else{
        alert("로그인이 필요합니다.");
        location.href="/login";
    }
});


var current_page;
// AJAX request to load paginated data
function review_loadPage(page) {
    var academy_id = document.getElementById('academy_id').value;
    console.log(academy_id);
    $.ajax({
        url: '/edu_info/review_list',
        type: 'GET',
        data: {page: page, academy_id: academy_id},
        success: function(response) {
            current_page = response.page;
            $('#data-container').append(response.data);

            if (response.post_cnt < 5) {
                $("#load-more-div").empty();
                $("#data-container").append("" +
                    "   <div align='center'>" +
                    "      <h4 class='card-title fs-4 text-uppercase m-0'>등록된 글이 없습니다.</h4>" +
                    "   </div>");
            }
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
};

// Load more items when the "Load More" button is clicked
$('#review_load_more').click(function() {
    review_loadPage(current_page+1);
});

function review_delete(review_idx){
    if (confirm("정말 삭제하시겠습니까?") == true){
        $.ajax({
            url: '/edu_info/academy_review_delete',
            type: 'GET',
            data: {review_idx: review_idx},
            success: function() {
                $('#review_'+review_idx).empty();
            },
            error: function(xhr) {
                console.log('Error occurred while fetching data.');
            }
        });
    }else{   //취소
        return false;
    }
}

function login_mov(){
    alert("로그인이 필요합니다.");
    location.href="/login";
}

function autoResize(textarea) {
    if (session_id) {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }else{
        alert("로그인이 필요합니다.");
        location.href="/login";
    }
}

const textarea = document.getElementById('review_textArea');
const remainingCharsSpan = document.getElementById('remainingChars');
const maxChars = 200; // 최대 글자수 설정

textarea.addEventListener('input', function() {
    const currentChars = textarea.value.length;
    const charsLeft = maxChars - currentChars;
    console.log(charsLeft);
    remainingCharsSpan.textContent = "내용("+charsLeft+"자)";

    if (charsLeft < 0) {
        textarea.value = textarea.value.substring(0, maxChars);
        remainingCharsSpan.textContent = "내용("+0+"자)";
    }
});