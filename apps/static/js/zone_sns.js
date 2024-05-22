var zone_id;
var bjdong_cd;
var gubun_01;
var gubun_02;
var sido_cd;
var all_bjdong_cd;
var session_bjdong_cd;
var session_id;
var user_loc_lat;
var user_loc_lon;

$('#rating_submit').click(function(){
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
    var zone_category = document.getElementById('zone_category').value;

    // console.log(zone_category)

   var postdata = {
        'zone_category': zone_category, 'zone_id':zone_id, 'rating_01':rating_01_checked, 'rating_02':rating_02_checked, 'rating_03':rating_03_checked, 'rating_04':rating_04_checked, 'rating_05':rating_05_checked, 'rating_06':rating_06_checked
    }

    if (rating_01_checked == false && rating_02_checked == false && rating_03_checked == false && rating_04_checked == false && rating_05_checked == false && rating_06_checked == false){
        alert("평가를 선택하세요.")
    }else{
        $.ajax({
            type: "post",
            url: "/member_activity/zone_ratting",
            data: JSON.stringify(postdata),
            dataType: 'json',
            contentType: "application/json",
            success: function (data) {
                alert("평가에 감사합니다.");
                $("#rating_checked").empty();
                $("#rating_checked").append("<h4 style='margin-bottom: 20px;'>평가에 참여하셨습니다.</h4>");

                var zone_rating_01_avg = data.result2['zone_rating_01_avg']
                var zone_rating_02_avg = data.result2['zone_rating_02_avg']
                var zone_rating_03_avg = data.result2['zone_rating_03_avg']
                var zone_rating_04_avg = data.result2['zone_rating_04_avg']
                var zone_rating_05_avg = data.result2['zone_rating_05_avg']
                var zone_rating_06_avg = data.result2['zone_rating_06_avg']

                console.log(zone_rating_01_avg, zone_rating_02_avg, zone_rating_03_avg, zone_rating_03_avg, zone_rating_04_avg, zone_rating_05_avg, zone_rating_06_avg)
                $("#sisul_0").append("- 시설: ");
                $("#traffic_0").append("- 교통: ");
                $("#price_0").append("- 가격: ");
                $("#taste_0").append("- 맛: ");
                $("#atmosphere_0").append("- 분위기: ");
                $("#skill_0").append("- 실력: ");

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
                    $("#taste_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    $("#taste_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    $("#taste_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    $("#taste_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    $("#taste_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                }else if(zone_rating_04_avg >= 0.21 && zone_rating_04_avg < 0.41){
                    $("#taste_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    $("#taste_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    $("#taste_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    $("#taste_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    $("#taste_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                }else if(zone_rating_04_avg >= 0.41 && zone_rating_04_avg < 0.61){
                    $("#taste_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    $("#taste_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    $("#taste_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    $("#taste_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    $("#taste_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                }else if(zone_rating_04_avg >= 0.61 && zone_rating_04_avg < 0.81){
                    $("#taste_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    $("#taste_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    $("#taste_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    $("#taste_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    $("#taste_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                }else if(zone_rating_04_avg >= 0.81 && zone_rating_04_avg <= 1){
                    $("#taste_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    $("#taste_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    $("#taste_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    $("#taste_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    $("#taste_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                }

                if (zone_rating_05_avg >= 0 && zone_rating_05_avg < 0.21 ){
                    $("#atmosphere_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    $("#atmosphere_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    $("#atmosphere_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    $("#atmosphere_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    $("#atmosphere_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                }else if(zone_rating_05_avg >= 0.21 && zone_rating_05_avg < 0.41){
                    $("#atmosphere_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    $("#atmosphere_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    $("#atmosphere_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    $("#atmosphere_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    $("#atmosphere_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                }else if(zone_rating_05_avg >= 0.41 && zone_rating_05_avg < 0.61){
                    $("#atmosphere_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    $("#atmosphere_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    $("#atmosphere_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    $("#atmosphere_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    $("#atmosphere_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                }else if(zone_rating_05_avg >= 0.61 && zone_rating_05_avg < 0.81){
                    $("#atmosphere_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    $("#atmosphere_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    $("#atmosphere_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    $("#atmosphere_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    $("#atmosphere_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                }else if(zone_rating_05_avg >= 0.81 && zone_rating_05_avg <= 1){
                    $("#atmosphere_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    $("#atmosphere_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    $("#atmosphere_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    $("#atmosphere_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    $("#atmosphere_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                }

                if (zone_rating_06_avg >= 0 && zone_rating_06_avg < 0.21 ){
                    $("#skill_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    $("#skill_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    $("#skill_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    $("#skill_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    $("#skill_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                }else if(zone_rating_06_avg >= 0.21 && zone_rating_06_avg < 0.41){
                    $("#skill_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    $("#skill_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    $("#skill_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    $("#skill_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    $("#skill_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                }else if(zone_rating_06_avg >= 0.41 && zone_rating_06_avg < 0.61){
                    $("#skill_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    $("#skill_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    $("#skill_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    $("#skill_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                    $("#skill_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                }else if(zone_rating_06_avg >= 0.61 && zone_rating_06_avg < 0.81){
                    $("#skill_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    $("#skill_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    $("#skill_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    $("#skill_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    $("#skill_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
                }else if(zone_rating_06_avg >= 0.81 && zone_rating_06_avg <= 1){
                    $("#skill_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    $("#skill_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    $("#skill_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    $("#skill_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                    $("#skill_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
                }
            },
            error: function(request, status, error) {
                alert('데이터를 가지고 오는데 실패했습니다.');
                alert(error);
            }
        });
    }
});

function zone_rating(zone_rating_01_avg, zone_rating_02_avg, zone_rating_03_avg, zone_rating_04_avg, zone_rating_05_avg, zone_rating_06_avg){
    $("#sisul_0").append("- 시설: ");
    $("#traffic_0").append("- 교통: ");
    $("#price_0").append("- 가격: ");
    $("#taste_0").append("- 맛: ");
    $("#atmosphere_0").append("- 분위기: ");
    $("#skill_0").append("- 실력: ");
    
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
        $("#taste_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#taste_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
        $("#taste_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
        $("#taste_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
        $("#taste_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
    }else if(zone_rating_04_avg >= 0.21 && zone_rating_04_avg < 0.41){
        $("#taste_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#taste_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#taste_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
        $("#taste_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
        $("#taste_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
    }else if(zone_rating_04_avg >= 0.41 && zone_rating_04_avg < 0.61){
        $("#taste_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#taste_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#taste_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#taste_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
        $("#taste_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
    }else if(zone_rating_04_avg >= 0.61 && zone_rating_04_avg < 0.81){
        $("#taste_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#taste_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#taste_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#taste_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#taste_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
    }else if(zone_rating_04_avg >= 0.81 && zone_rating_04_avg <= 1){
        $("#taste_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#taste_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#taste_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#taste_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#taste_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
    }

    if (zone_rating_05_avg >= 0 && zone_rating_05_avg < 0.21 ){
        $("#atmosphere_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#atmosphere_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
        $("#atmosphere_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
        $("#atmosphere_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
        $("#atmosphere_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
    }else if(zone_rating_05_avg >= 0.21 && zone_rating_05_avg < 0.41){
        $("#atmosphere_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#atmosphere_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#atmosphere_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
        $("#atmosphere_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
        $("#atmosphere_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
    }else if(zone_rating_05_avg >= 0.41 && zone_rating_05_avg < 0.61){
        $("#atmosphere_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#atmosphere_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#atmosphere_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#atmosphere_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
        $("#atmosphere_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
    }else if(zone_rating_05_avg >= 0.61 && zone_rating_05_avg < 0.81){
        $("#atmosphere_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#atmosphere_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#atmosphere_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#atmosphere_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#atmosphere_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
    }else if(zone_rating_05_avg >= 0.81 && zone_rating_05_avg <= 1){
        $("#atmosphere_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#atmosphere_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#atmosphere_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#atmosphere_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#atmosphere_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
    }

    if (zone_rating_06_avg >= 0 && zone_rating_06_avg < 0.21 ){
        $("#skill_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#skill_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
        $("#skill_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
        $("#skill_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
        $("#skill_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
    }else if(zone_rating_06_avg >= 0.21 && zone_rating_06_avg < 0.41){
        $("#skill_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#skill_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#skill_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
        $("#skill_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
        $("#skill_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
    }else if(zone_rating_06_avg >= 0.41 && zone_rating_06_avg < 0.61){
        $("#skill_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#skill_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#skill_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#skill_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
        $("#skill_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
    }else if(zone_rating_06_avg >= 0.61 && zone_rating_06_avg < 0.81){
        $("#skill_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#skill_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#skill_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#skill_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#skill_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-empty'></use></svg>");
    }else if(zone_rating_06_avg >= 0.81 && zone_rating_06_avg <= 1){
        $("#skill_1").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#skill_2").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#skill_3").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#skill_4").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
        $("#skill_5").append("<svg class='bi' width='16' height='16'><use xlink:href='#star-fill'></use></svg>");
    }
}

// $('#post_submit').click(function(){
//     var input_file = document.getElementById('post_form');
//     let data = new FormData(input_file);
//
//     $.ajax({
//         type: "POST",
//         url: '/zone_sns/zone_sns_posting',
//         data: data,
//         contentType: false,
//         processData: false,
//         success: (res) => {
//             console.log(res);
//         }
//     });
// });
let img_cnt = 0;
let file = new Array();

// const form_name = document.getElementById('post_form');
const form_data = new FormData();
// 이미지 업로드 참고 --> url https://velog.io/@minkyeong-ko/HTMLCSSJS-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EC%97%85%EB%A1%9C%EB%93%9C-%ED%8C%8C%EC%9D%BC%EC%9D%B4%EB%A6%84-%EB%82%98%ED%83%80%EB%82%B4%EA%B8%B0-%ED%99%94%EB%A9%B4%EC%97%90-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EB%B3%B4%EC%97%AC%EC%A3%BC%EA%B8%B0
// 이미지 편집 툴 --> https://arikong.tistory.com/25
function loadFile(input) {
    if (img_cnt >= 5) {
        alert('이미지는 최대 5개까지 업로드가 가능합니다.');
        return;
    }else{
        file.push(input.files[0]);	//선택된 파일 가져오기
        form_data.append('file[]', document.getElementById('file').files[0]);

        //새로운 이미지 div 추가
        var newImage = document.createElement("img");
        newImage.setAttribute("class", 'img');

        //이미지 source 가져오기
        newImage.src = URL.createObjectURL(file[img_cnt]);

        newImage.style.width = "100%";
        newImage.style.height = "100%";
        // newImage.style.visibility = "hidden";   //버튼을 누르기 전까지는 이미지를 숨긴다
        newImage.style.objectFit = "contain";

        //이미지를 image-show div에 추가
        var img_id = 'image-show-'+img_cnt
        $("#img_container").append("<div style='margin-right: 5px; margin-bottom: 5px' className='image-show' id="+img_id+">" +
                                        "<img id='minusButton' src='/static/images/picture_del.png' width='45px' height='45px' class='zoom-image' onclick='pic_del(\""+img_id+"\");' style='position: relative; z-index: 2000; top: 20%; right: -88%;'>" +
                                    "</div>");
        var container = document.getElementById(img_id);
        container.appendChild(newImage);

        //이미지는 화면에 나타나고
        newImage.style.visibility = "visible";
        img_cnt++;
        // console.log(file);
    }
};

function pic_del(img_id){
    $("#"+img_id).empty();
}

$('#post_submit').click(function(){
    form_data.append('title', document.getElementById('title').value);
    form_data.append('contents', document.getElementById('contents').value);
    form_data.append('open_yn',  $('input[name=open_yn]:checked').val());
    form_data.append('zone_id', document.getElementById('zone_id').value);
    form_data.append('bjdong_cd', document.getElementById('bjdong_cd').value);
    form_data.append('zone_category', document.getElementById('zone_category').value);
    var gubun_01 = document.getElementById('zone_category').value;
    var zone_idx = document.getElementById('zone_id').value;

    $.ajax({
        type: "POST",
        url: '/zone_sns/zone_sns_posting',
        data: form_data,
        dataType : 'JSON',
        contentType: false,
        cache:  false,
        processData: false,
        success: function(response) {
            alert("정상적으로 등록되었습니다.");
            location.href="/zone_sns/zone_sns_user_post?zone_id="+zone_idx+"&gubun_01="+gubun_01+"&bjdong_cd="+bjdong_cd+""
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
});

$('#post_submit_blog').click(function(){
    form_data.append('title', document.getElementById('title').value);
    form_data.append('contents', document.getElementById('contents').value);
    form_data.append('open_yn',  $('input[name=open_yn]:checked').val());
    form_data.append('blog_category', $('input[name=blog_category]:checked').val());
    form_data.append('bjdong_cd', document.getElementById('bjdong_cd').value);
    console.log(form_data.get('blog_category'));

    $.ajax({
        type: "POST",
        url: '/zone_sns/single_create_posting',
        data: form_data,
        dataType : 'JSON',
        contentType: false,
        cache:  false,
        processData: false,
        success: function(response) {
            alert("정상적으로 등록되었습니다.");
            single_post_read(response.last_insert_id);
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
});


$('#post_modify_submit').click(function(){
    form_data.append('title', document.getElementById('title').value);
    form_data.append('contents', document.getElementById('contents').value);
    form_data.append('open_yn',  $('input[name=open_yn]:checked').val());
    form_data.append('blog_category', $('input[name=blog_category]:checked').val());
    form_data.append('bjdong_cd', document.getElementById('bjdong_cd').value);
    form_data.append('post_idx', document.getElementById('post_idx').value);
    console.log(form_data.get('blog_category'));

    $.ajax({
        type: "POST",
        url: '/zone_sns/single_modify_posting_proc',
        data: form_data,
        dataType : 'JSON',
        contentType: false,
        cache:  false,
        processData: false,
        success: function(response) {
            alert("정상적으로 등록되었습니다.");
            single_post_read(response.post_idx);
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
});


var current_page;
// AJAX request to load paginated data
function loadPage(page) {
    var zone_id = document.getElementById('zone_id').value;
    var gubun_01 = document.getElementById('gubun_01').value;
    var bjdong_cd = document.getElementById('bjdong_cd').value;
    $.ajax({
        url: '/zone_sns/zone_sns_post_list',
        type: 'GET',
        data: {page: page, bjdong_cd: bjdong_cd, gubun_01: gubun_01, zone_id: zone_id},
        success: function(response) {
            current_page = response.page;
            $('#data-container').append(response.data);

            if (response.post_cnt < 9) {
                $("#load-more-div").empty();
                $("#data-container").append("" +
                    "   <div align='center'>" +
                    "      <h5 class='card-title fs-4 text-uppercase m-0'>더 이상 등록된 글이 없습니다.</h5>" +
                    "   </div>");
            }
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
};

// Load more items when the "Load More" button is clicked
$('#load-more').click(function() {
    loadPage(current_page+1);
});

function grade(){
    alert("방문한 횟수가 가장 많은 사람이 핫존을 차지합니다.\n회원님은 이곳의 Red King입니다.");
}

var main_current_page;
// AJAX request to load paginated data
function sns_main_loadPage(page, bjdong_cd) {
    $.ajax({
        url: '/zone_sns/posts_list',
        type: 'GET',
        data: {page: page, bjdong_cd: bjdong_cd},
        success: function(response) {
            main_current_page = response.page;
            $('#data-container').append(response.data);
            if (response.post_cnt < 9) {
                $("#load-more-div").empty();
                $("#data-container").append("" +
                    "   <div align='center'>" +
                    "      <h5 class='card-title fs-4 text-uppercase m-0'>등록된 글이 없습니다.</h5>" +
                    "   </div>");
            }
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
};

// Load more items when the "Load More" button is clicked
$('#sns-main-load-more').click(function() {
    sns_main_loadPage(main_current_page+1, all_bjdong_cd);
});

function single_post_read(blog_idx){
    location.href="/zone_sns/post_detail_info?blog_idx="+blog_idx+"&bjdong2="+bjdong_cd+"&sido_cd="+sido_cd+"&user_loc_lat="+user_loc_lat+"&user_loc_lon="+user_loc_lon;
}

function shop_detail_info(zone_id){
    var postdata = {
        'zone_id': zone_id
    }
    $.ajax({
        type: 'POST',
        url: '/zone_sns/shop_detail_info',
        data: JSON.stringify(postdata),
        dataType: 'JSON',
        contentType: "application/json",
        success: function(data) {
            if (data.result2['id_counter'] != 0){
                $("#store_img_01").append("<img src="+data.result2['shop_src_1']+" alt='product-img' class='img-fluid mb-1'>");
                $("#store_img_02").append("<img src="+data.result2['shop_src_2']+" alt='product-img' class='img-fluid mb-2'>");
                $("#store_img_03").append("<img src="+data.result2['shop_src_3']+" alt='product-img' class='img-fluid mb-3'>");
                $("#store_content_01").append("<p class='fs-3' onclick=javascript:href=url_page('"+data.result2['shop_href_1']+"')>"+data.result2['shop_alt_1']+"</p>");
                $("#store_content_02").append("<p class='fs-3' onclick=javascript:href=url_page('"+data.result2['shop_href_2']+"')>"+data.result2['shop_alt_2']+"</p>");
                $("#store_content_03").append("<p class='fs-3' onclick=javascript:href=url_page('"+data.result2['shop_href_3']+"')>"+data.result2['shop_alt_3']+"</p>");
            }else{
                $("#store_img_01").append("<img src='/static/images/fankids_building.png' alt='product-img' class='img-fluid mb-3'>");
                $("#store_img_02").append("<img src='/static/images/fankids_building.png' alt='product-img' class='img-fluid mb-3'>");
                $("#store_img_03").append("<img src='/static/images/fankids_building.png' alt='product-img' class='img-fluid mb-3'>");
                $("#store_content_01").append("");
                $("#store_content_02").append("");
                $("#store_content_03").append("");
            }
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
}

function url_page(url){
    var $el = $('#info_open_div');    //레이어의 id를 $el 변수에 저장
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
    $('#url_contents').attr("src", url);
}

function sns_search_do(){
    var sido = $('#sido option:selected').val();
    var sigungun = $('#sigugun option:selected').val();
    var bjdong = $('#dong option:selected').val();
    var page = 1;
    var bjdong_cd = sigungun+bjdong;
    if (sido == "" || sigugun == "" || dong == "") {
        alert("행정구역을 선택하세요.");
    }else {
        $.ajax({
            url: '/zone_sns/posts_list',
            type: 'GET',
            data: {page: page, bjdong_cd: bjdong_cd, sido:sido, sigungun:sigungun, bjdong:bjdong, search_type: "1"},
            success: function(data) {
                all_bjdong_cd = data.bjdong_cd

                $("#sido").val(data.req_sido).prop("selected", true);
                $("#sigugun").val(data.req_sigungun).prop("selected", true);
                $("#dong").val(data.req_dong).prop("selected", true);
                document.getElementById('search_type').value = data.req_search_type;
                $("#data-container").empty();
                sns_main_loadPage(page, bjdong_cd);
                select_set_value(sido, bjdong_cd);
                console.log(bjdong_cd, session_bjdong_cd)
                if (bjdong_cd != session_bjdong_cd){
                    $('.floating-button').empty();
                }else{
                    $('.floating-button').empty();
                    $('.floating-button').append('<img src="/static/images/plus.png" onclick="location.href=\'/zone_sns/single_post_create?bjdong_cd=\'+all_bjdong_cd;">');
                }
            },
            error: function(xhr) {
                console.log('Error occurred while fetching data.');
            }
        });
    }
}

function sns_delete(post_idx){
    if (confirm("정말 삭제하시겠습니까?") == true){
        $.ajax({
            url: '/zone_sns/single_delete_posting',
            type: 'GET',
            data: {post_idx: post_idx},
            success: function() {
                location.href="/zone_sns/zone_sns_main";
            },
            error: function(xhr) {
                console.log('Error occurred while fetching data.');
            }
        });
    }else{   //취소
        return false;
    }
}

function sns_modify(post_idx){
    location.href='/zone_sns/single_modify_posting_pre?post_idx='+post_idx
}

function sns_modify_read(post_idx){
    $.ajax({
        url: '/zone_sns/post_detail_info_modify',
        type: 'POST',
        data: JSON.stringify({post_idx: post_idx}),
        dataType: 'JSON',
        contentType: "application/json",
        success: function(data) {
            var blog_category = data.result2['blog_category']
            var open_yn = data.result2['open_yn'];
            // document.getElementById('blog_category'+data.result2['blog_category']).checked;
            // document.querySelector("#blog_category input[value=${blog_category}]").setAttribute('checked' , true);
            $(":radio[name='blog_category'][value="+blog_category+"]").attr('checked', true);
            $(":radio[name='open_yn'][value="+open_yn+"]").attr('checked', true);
            $("input[name='title']").attr('value', data.result2['title']);
            $('#contents').append(data.result2['contents']);
            $("input[name='post_idx']").attr('value', data.result2['post_idx']);

            // console.log(open_yn, data.result2['post_idx'], data.result2['title'], data.result2['contents'])
            c = data.result2['id_counter'];
            for (var i = 0; i < c; i++) {
                //새로운 이미지 div 추가
                var newImage = document.createElement("img");
                newImage.setAttribute("class", 'img');
                var img_idx = data.result2['post_atta_idx_'+i]
                var imgscr = data.result2['post_atta_pic_'+i]

                newImage.src = imgscr;
                newImage.style.width = "100%";
                newImage.style.height = "100%";
                newImage.style.objectFit = "contain";

                //이미지를 image-show div에 추가
                var img_id = 'db-image-show-'+i
                var img_id_c = 'img_idx_'+img_idx
                $("#db_img_container").append("" +
                                "<div style='margin-right: 10px; margin-bottom: 5px' className='image-show' id="+img_id+">" +
                                    "<input type='hidden' id="+img_id_c+" value="+img_idx+">" +
                                    "<img id='minusButton' src='/static/images/picture_del.png' width='45px' height='45px' class='zoom-image' onclick='pic_del_real(\""+img_id+"\", "+img_idx+");' style='position: relative; z-index: 2000; top: 20%; right: -88%;'>" +
                                "</div>");
                var container = document.getElementById(img_id);
                container.appendChild(newImage);

                //이미지는 화면에 나타나고
                newImage.style.visibility = "visible";
            }
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
}

function pic_del_real(img_id, img_idx){
    if (confirm("정말 삭제하시겠습니까?") == true){
        console.log(img_id, img_idx);
        $("#"+img_id).empty();
        $.ajax({
            url: '/zone_sns/post_detail_file_delete',
            type: 'POST',
            data: JSON.stringify({img_idx: img_idx}),
            dataType: 'JSON',
            contentType: "application/json",
            success: function(data) {
                alert("삭제되었습니다.");
            },
            error: function(xhr) {
                console.log('Error occurred while fetching data.');
            }
        });
    }else{   //취소
        return false;
    }
}

$('#post_submit_comment').click(function(){
    var post_idx = document.getElementById('post_idx').value
    var comment_textArea = document.getElementById('comment_textArea').value
    console.log(post_idx, comment_textArea);
    if (comment_textArea != ""){
        form_data.append('post_idx', post_idx);
        form_data.append('comment_textArea', comment_textArea);

        $.ajax({
            type: "POST",
            url: '/zone_sns/post_comment',
            data: form_data,
            dataType : 'JSON',
            contentType: false,
            cache:  false,
            processData: false,
            success: function(data) {
                alert("정상적으로 등록되었습니다.");
                location.href="/zone_sns/post_detail_info?blog_idx="+data.post_idx;
            },
            error: function(xhr) {
                console.log('Error occurred while fetching data.');
            }
        });
    }else{
        alert("댓글을 작성해주세요.");
    }
});


var comment_current_page;
// AJAX request to load paginated data
function comment_loadPage(page, post_idx) {
    $.ajax({
        url: '/zone_sns/review_list',
        type: 'GET',
        data: {page: page, post_idx: post_idx},
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
$('#comment_load_more').click(function() {
    comment_loadPage(comment_current_page+1);
});

function comment_delete(post_comment_idx){
    if (confirm("정말 삭제하시겠습니까?") == true){
        $.ajax({
            url: '/zone_sns/post_comment_delete',
            type: 'GET',
            data: {post_comment_idx: post_comment_idx},
            success: function() {
                $('#review_'+post_comment_idx).empty();
            },
            error: function(xhr) {
                console.log('Error occurred while fetching data.');
            }
        });
    }else{   //취소
        return false;
    }
}


const comment_textarea = document.getElementById('comment_textArea');
const comment_remainingChars = document.getElementById('comment_remainingChars');
const comment_maxChars = 200; // 최대 글자수 설정

comment_textarea.addEventListener('input', function() {
    console.log("session_id: ", session_id);
    if (session_id == "" || session_id == null ){
        alert("로그인이 필요합니다.");
        location.href="/login";
    }else{
        const currentChars = comment_textarea.value.length;
        const charsLeft = comment_maxChars - currentChars;
        console.log(charsLeft);
        comment_remainingChars.textContent = "내용(" + charsLeft + "자)";
        if (charsLeft < 0) {
            comment_textarea.value = comment_textarea.value.substring(0, comment_maxChars);
            comment_remainingChars.textContent = "내용(" + 0 + "자)";
        }
    }
});

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
