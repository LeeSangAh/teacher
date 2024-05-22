var bjdong_cd;
var sido_cd;
var all_bjdong_cd;
var user_loc_lat;
var user_loc_lon;
function add_friend(session_id, user_id){
    var postdata = {
        'session_id': session_id, 'user_id': user_id
    }
    $.ajax({
        type: "POST",
        url: '/zone_sns/add_friend',
        data: JSON.stringify(postdata),
        async: false,
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data) {
            alert("친구 신청을 했습니다. \n 상대방이 수락하면 친구가 됩니다.");
            $('#add_friend').empty();
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
};

function friends(gubun) {
    var postdata = {
        'gubun': gubun
    }
    $.ajax({
        type: 'POST',
        url: '/zone_sns/friends_list',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data) {
            console.log(data.result2);
            var c = data.result2['id_counter'];
            if (c==0){
                var html_list =
                    '<tr id="zone_timeline_' + i + '" class="border-0">' +
                    '  <td class="align-middle border-0">' +
                    '       <p>친구가 없습니다.</p> '+
                    '  </td>' +
                    '</tr>'
                $("#friends-data-container").append(html_list);
            }else{
                for (var i = 1; i <= c; i++) {
                    var html_list =
                        '<tr id="zone_timeline_' + i + '" class="border-0">' +
                        '  <td class="align-middle border-0">' +
                        '       <div class="box"><img class="profile" src="'+data.result2["friends_picture_" + i]+'" onclick="javascript:location.href=\'/member_activity/myhome?user_idx=\'+(\''+data.result2['friends_idx_' + i]+'\')"></div>' +
                        '       <p>'+data.result2["friends_name_" + i]+'</p> '+
                        '  </td>' +
                        '</tr>'
                    $("#friends-data-container").append(html_list);
                }
            }
            $("#friends_cnt").append(c);
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
};

function wait_friends(gubun) {
    var postdata = {
        'gubun': gubun
    }
    $.ajax({
        type: 'POST',
        url: '/zone_sns/friends_wait_list',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data) {
            // console.log(data.result2);
            var c = data.result2['id_counter'];
            if (c==0){
                var html_list =
                    '<tr id="zone_timeline_' + i + '" class="border-0">' +
                    '  <td class="align-middle border-0">' +
                    '       <p>친구가 없습니다.</p> '+
                    '  </td>' +
                    '</tr>'
                $("#friends-wait-data-container").append(html_list);
            }else {
                for (var i = 1; i <= c; i++) {
                    var html_list =
                        '<tr id="zone_timeline_' + i + '">' +
                        '  <td class="align-middle border-0">' +
                        '     <div>' +
                        '        <div><img style="border-radius: 50%; width: 45px; height: 45px;" src="' + data.result2["friends_picture_" + i] + '" onclick="javascript:location.href=\'/member_activity/myhome?user_idx=\'+(\'' + data.result2['friends_idx_' + i] + '\')">' +
                        '        <p>' + data.result2["friends_name_" + i] + '</p><img src="/static/images/add_user.png" onclick="commit_friend(\''+data.result2["user_id_" + i]+'\', \''+data.result2["idx_" + i]+'\', '+i+')"></div>' +
                        '     </div>'+
                        '  </td>' +
                        '</tr>'
                    $("#friends-wait-data-container").append(html_list);
                }
            }
            $("#friends_wait_cnt").append(c);
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
};

function commit_friend(friend_id, friend_idx){
    var postdata = {
        'friend_id': friend_id, 'friend_idx': friend_idx
    }
    $.ajax({
        type: 'POST',
        url: '/zone_sns/commit_friend',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function() {
            alert("친구가 되었습니다. \n친하게 지내세요. 싸우지 말고요.");
            location.href="/zone_sns/friends";
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
}

function confirm_friend(user_id){
    var postdata = {
        'user_id': user_id
    }
    $.ajax({
        type: 'POST',
        url: '/zone_sns/confirm_friend',
        data: JSON.stringify(postdata),
        dataType : 'JSON',
        contentType: "application/json",
        success: function(data) {
            var friends_cnt = data.result2['friends_cnt']
            console.log(friends_cnt);
            if (friends_cnt != 0){
                $('#add_friend').empty();
            }
        },
        error: function(xhr) {
            console.log('Error occurred while fetching data.');
        }
    });
}
