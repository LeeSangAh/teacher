from flask import Flask, Blueprint, session, render_template, jsonify, request, flash, redirect, make_response
from werkzeug.security import generate_password_hash, check_password_hash
import pymysql
from datetime import datetime
import requests
from . import Member_info
import config
from .kakao_auth import Oauth


from flask_jwt_extended import (
    JWTManager, create_access_token,
    get_jwt_identity, jwt_required,
    set_access_cookies, set_refresh_cookies,
    unset_jwt_cookies, create_refresh_token
)

kakao = Blueprint("kakao", __name__, url_prefix="/kakao")

# =========== aws DB 정보 =====================================
dbhost = config.dbhost
userid = config.userid
userpw = config.userpw
dbnm = config.dbnm
port = config.port

CLIENT_ID = config.kakao_CLIENT_ID
REDIRECT_URI = config.kakao_REDIRECT_URI
CLIENT_SECRET = config.kakao_CLIENT_SECRET

auth_server = "https://kauth.kakao.com%s"
api_server = "https://kapi.kakao.com%s"
default_header = {
    "Content-Type": "application/x-www-form-urlencoded",
    "Cache-Control": "no-cache",
}

@kakao.route("/kko_callback", methods=['GET', 'POST'])
def kko_callback():
    return jsonify(kakao_oauth_url="https://kauth.kakao.com/oauth/authorize?client_id=%s&redirect_uri=%s&response_type=code" \
                                   % (CLIENT_ID, REDIRECT_URI)
    )

@kakao.route("/oauth", methods=['GET', 'POST'])
def oauth_api():
    # 사용자로부터 authorization code를 인자로 받음
    code = str(request.args.get('code'))
    print(code)
    # // 전달받은 authorization code를 통해서
    # // access_token, refresh_token을 발급
    oauth = Oauth()
    auth_info = oauth.auth(code)

    # // access_token을 이용해서, Kakao에서 사용자 식별 정보 획득
    user = oauth.userinfo("Bearer " + auth_info['access_token'])
    token = auth_info['access_token']
    expires = auth_info['refresh_token_expires_in']

    # // 해당 식별 정보를 서비스 DB에 저장 (회원가입)
    # // 만약 이미 있을 경우, 과정 스킵
    # user = UserData(user)
    # UserModel().upsert_user(user=

    # print(user)

    user_email = user['kakao_account']['email']

    teacher_type = ''
    check_id_yn, teacher_check_id_yn, idx, teacher_type, belong_idx = Member_info.kko_member_check(user_email)

    if check_id_yn == 0:
        result, last_insert_idx = Member_info.kko_member_insert(user)
        idx = last_insert_idx

    # // 사용자 식별 id를 바탕으로 서비스 전용 access_token, refresh_token 발급
    resp = make_response(render_template('index.html'))
    access_token = create_access_token(identity=user_email)
    refresh_token = create_refresh_token(identity=user_email)
    resp.set_cookie("logined", "true")
    set_access_cookies(resp, access_token)
    set_refresh_cookies(resp, refresh_token)

    Member_info.member_log(idx)

    # my_picture_thumb = ''
    nick_name = ''

    # if 'thumbnail_image' in user['properties']:
    #     my_picture_thumb = user['properties']['thumbnail_image']

    nick_name = user['properties']['nickname']

    return render_template('/pages/authentication/simple/oauth.html', user_email=user_email, user_idx=idx, teacher_type=teacher_type, belong_idx=belong_idx, create_type="1", nick_name = nick_name)

    # code = request.args.get('code')
    # access_token_request_url = f"https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&code={code}"
    # response_token = requests.get(access_token_request_url).json()
    # token = response_token['access_token']
    # user_info_request_url="https://kapi.kakao.com/v2/user/me"
    # user_info = requests.get(user_info_request_url, headers={"Authorization":f"Bearer {token}"})
    # print(user_info.json())
    #
    # user_info_json = user_info.json()
    # print(user_info_json)
    # print(type(user_info_json))
    #
    # user_email = user_info_json['kakao_account']['email']
    # print(user_email)
    # # #
    # check_id_yn = Member_info.kko_member_check(user_email)
    # # #
    # if check_id_yn == 0:
    #    Member_info.kko_member_insert(user_info.json())
    # else:
    #    print('계정이 있다.')

    # return jsonify(user_info.json())
