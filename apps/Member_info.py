from flask import Flask, Blueprint, session, render_template, jsonify, request, flash
from werkzeug.security import generate_password_hash, check_password_hash
import pymysql
import requests
import json
from datetime import datetime
import random
import config

member_info = Blueprint("member_info", __name__, url_prefix="/member_info")

# 회사 서버올릴때
dbhost = config.dbhost
userid = config.userid
userpw = config.userpw
dbnm = config.dbnm
port = config.port

now = datetime.now()

@member_info.route("/login", methods=['GET', 'POST'])
def login():
    print("test1")
    if request.method == 'POST':
        id_ = request.form.get('id_', False)
        pw_ = request.form.get('pw_', False)

        if id_ == "":
            flash("아이디를 입력하세요.")
            return render_template('/member_info/login.html')
        elif pw_ == "":
            flash("패스워드를 입력하세요.")
            return render_template('/member_info/login.html')
        elif id_ and pw_:
            # print(id_)
            conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
            cursor = conn.cursor()

            select_sql = "SELECT id, pw, user_name, select_bjdong, bjdong_cd_01, bjdong_cd_02, bjdong_cd_03, member_type, tel_number FROM member_info where id = '"+id_+"'"
            print(select_sql)
            select_sql = cursor.execute(select_sql)
            select_sql = cursor.fetchall()
            conn.close()
            print("select_sql", select_sql)
            if len(select_sql) != 0 :
                db_id = select_sql[0][0]
                db_pw = select_sql[0][1]
                name = select_sql[0][2]
                select_bjdong = select_sql[0][3]
                bjdong_cd_01 = select_sql[0][4]
                bjdong_cd_02 = select_sql[0][5]
                bjdong_cd_03 = select_sql[0][6]
                member_type = select_sql[0][7]
                tel_num = select_sql[0][8]

                if select_bjdong == "1":
                    bjdong_cd = bjdong_cd_01
                elif select_bjdong == "2":
                    bjdong_cd = bjdong_cd_02
                elif select_bjdong == "3":
                    bjdong_cd = bjdong_cd_03

                if bjdong_cd:
                    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
                    cursor = conn.cursor()

                    bjdong_select_sql = "SELECT lat, lon FROM b_num_info where concat(SIGUNGU_NUM, BJDONG_NUM) = '" + bjdong_cd + "'"

                    bjdong_select_sql = cursor.execute(bjdong_select_sql)
                    bjdong_select_sql = cursor.fetchall()
                    conn.close()
                else:
                    return render_template('/member_info/login.html')

                if len(bjdong_select_sql) != 0 :
                    lat = bjdong_select_sql[0][0]
                    lon = bjdong_select_sql[0][1]
                else:
                    flash("법정동 정보가 정확하지 않아 기본 지역으로 이동합니다.")
                    lat =  37.577
                    lon = 126.8916
                print("db_pw, pw: ", db_pw, pw_)
                if check_password_hash(db_pw, pw_):
                    session['id'] = id_
                    return render_template('/map_info/results.html', lat = lat, lon = lon)
                else:
                    flash("패스워드가 일치하지 않습니다.")
                    return render_template('/member_info/login.html')
            else:
                flash("아이디가 없습니다.")
                return render_template('/member_info/login.html')
    else:
        return render_template('/member_info/login.html')

    # if id_ == ('hansol_v') and pw_ == ('hansol_v'):
    #     print("들어오나?3")
    #     session['id'] = id_
    #     return render_template('/map_info/results.html', lat = lat, lon = lon)
    # else:
    #     print("들어오나?4")
    #     return render_template('/member_info/login.html')

@member_info.route("/home")
def home():
    return render_template('/member_info/login.html')

@member_info.route("/logout")
def logout():
    session.clear()
    return render_template('/member_info/login.html')

@member_info.route("/join")
def join():
    return render_template('/member_info/join.html')

@member_info.route("/member_insert", methods=['GET', 'POST'])
def member_insert():
    if request.method == 'POST':
        id =  request.form.get('ch_userId_', False)
        pw = request.form.get('ch_new_pw_', False)
        tel_number = request.form.get('tel_num_', False)
        email = request.form.get('email_', False)
        sido = request.form.get('sido_', False)
        sigungu =  request.form.get('sigugu_', False)
        dong =  request.form.get('dong_', False)
        bjdong_cd_01 = sigungu+dong

        if tel_number != '' and id != '' and pw != '' and sigungu != '' and dong != '' and email != '':
            # id = "hansol_v"
            # pw = "hansol_v"
            pw_ = generate_password_hash(pw)
            name = ""
            select_bjdong = "1"
            bjdong_cd_02 = ""
            bjdong_cd_03 = ""
            member_type = "1"
            insert_date = datetime.now()

            try:
                conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
                cursor = conn.cursor()

                member_insert_sql = "INSERT INTO member_info (id, pw, user_name, select_bjdong, bjdong_cd_01, " \
                                    "bjdong_cd_02, bjdong_cd_03, member_type, tel_number, e_mail, INSERT_DATE) " \
                                 "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"

                val = [
                    (id),
                    (pw_),
                    (name),
                    (select_bjdong),
                    (bjdong_cd_01),
                    (bjdong_cd_02),
                    (bjdong_cd_03),
                    (member_type),
                    (tel_number),
                    (email),
                    (insert_date)
                ]

                cursor.execute(member_insert_sql, val)
                conn.commit()
                conn.close()
                flash("회원 가입이 정상적으로 되었습니다.")
                return render_template('/member_info/login.html')
            except:
                flash("회원 가입이 정상적으로 이루어지지 않았습니다.")
                return render_template('/member_info/join.html')
        else:
            flash("필수값을 입력하세요.")
            return render_template('/member_info/join.html')

@member_info.route("/member_check", methods = ['POST'])
def member_check():
    data = request.get_json()
    id_ = data.get('id_')
    print("들어오긴 하나?")
    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    check_select_sql = "SELECT id FROM member_info where id = '"+id_+"'"
    check_select_sql = cursor.execute(check_select_sql)
    check_select_sql = cursor.fetchall()
    cursor.close()
    conn.close()

    check_id = len(check_select_sql)

    data['check_id'] = check_id

    return jsonify(result = "success", result2= data)

def kko_member_check(kko_id):
    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    member_check_sql = " select idx, member_type from member_info " \
                       " where member_type in (3, 4) " \
                       " and id = '"+kko_id+"' and create_type='1'"

    member_check = cursor.execute(member_check_sql)
    member_check = cursor.fetchall()

    check_id_yn = len(member_check)
    idx = ''
    teacher_type = ''
    belong_idx = ''

    idx = member_check[0][0]

    if check_id_yn > 0:
        teacher_check_select_sql = "select mi.idx, sti.teacher_type, sti.belong_idx from member_info mi, st_teacher_info sti" \
                           " where mi.idx = sti.member_idx" \
                           " and mi.member_type in (3, 4)" \
                           " and mi.id = '"+kko_id+"' and create_type='1'"

        teacher_check_select_sql = cursor.execute(teacher_check_select_sql)
        teacher_check_select_sql = cursor.fetchall()
        cursor.close()
        conn.close()

        teacher_check_id_yn = len(teacher_check_select_sql)

        if teacher_check_id_yn > 0:
            teacher_type = teacher_check_select_sql[0][1]
            belong_idx = teacher_check_select_sql[0][2]

    return check_id_yn, teacher_check_id_yn, idx, teacher_type, belong_idx

def kko_member_insert(user_info):
    id = user_info['kakao_account']['email']
    nick_name = user_info['properties']['nickname']

    age_range = ''
    my_picture = ''
    my_picture_thumb = ''
    last_insert_idx = ''
    idx = ''
    user_id = ''

    if 'age_range' in user_info['kakao_account']:
        age_range = user_info['kakao_account']['age_range']

    if 'profile_image' in user_info['properties']:
        my_picture =  user_info['properties']['profile_image']
    else:
        my_picture = '/static/images/user.png'

    if 'thumbnail_image' in user_info['properties']:
        my_picture_thumb =  user_info['properties']['thumbnail_image']
    else:
        my_picture_thumb = '/static/images/user.png'

    insert_date = datetime.now()
    result = 1
    select_bjdong = '0'
    try:
        conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
        cursor = conn.cursor()

        member_insert_sql = "INSERT INTO member_info (id, age_range, nick_name, my_picture, my_picture_thumb, create_type, member_type, select_bjdong, INSERT_DATE) " \
                            "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"

        val = [
            (id),
            (age_range),
            (nick_name),
            (my_picture),
            (my_picture_thumb),
            ('1'),
            ('4'),
            (select_bjdong),
            (insert_date)
        ]

        cursor.execute(member_insert_sql, val)
        conn.commit()

        last_insert_idx_sql = "SELECT LAST_INSERT_ID()"
        last_insert_idx_sql = cursor.execute(last_insert_idx_sql)
        last_insert_idx = cursor.fetchall()[0]
        print("last_insert_idx: ", last_insert_idx)

        check_select_sql = "SELECT idx FROM member_info where id = '"+last_insert_idx+"' and create_type='1'"
        check_select_sql = cursor.execute(check_select_sql)
        check_select_sql = cursor.fetchall()

        check_id_yn = len(check_select_sql)

        if check_id_yn > 0:
            idx = check_select_sql[0][0]

        cursor.close()
        conn.close()

        return result, idx
    except:
        result = 0
        return result, idx

def member_log(user_idx):
    insert_date = datetime.now()
    result = 'success'
    print(user_idx)
    try:
        conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
        cursor = conn.cursor()

        log_insert_sql = "INSERT INTO log (user_idx, INSERT_DATE) " \
                         "VALUES (%s, %s)"
        print(log_insert_sql)
        val_log=[
            (user_idx),
            (insert_date),
        ]
        cursor.execute(log_insert_sql, val_log)
        conn.commit()
        cursor.close()
        conn.close()

        return result
    except:
        result = 'errors'
        return result

@member_info.route("/member_info_update", methods = ['POST'])
def member_info_update():
    data = request.get_json()
    type = data.get('type')
    bjdong_cd = data.get('bjdong_cd')
    user_loc = data.get('user_loc')

    user_id = session.get('id')
    login_type = session.get('login_type')

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()
    if user_loc == 'N':
        if type == '1':
            update_sql = "update member_info set bjdong_cd_01 = '"+str(bjdong_cd)+"', select_bjdong = '1', loc_denine = '1' where id ='"+user_id+"' and create_type = "+login_type
        elif type == '2':
            update_sql = "update member_info set bjdong_cd_02 = '"+str(bjdong_cd)+"', select_bjdong = '2', loc_denine = '1' where id ='"+user_id+"' and create_type = "+login_type
        elif type == '3':
            update_sql = "update member_info set bjdong_cd_03 = '"+str(bjdong_cd)+"', select_bjdong = '3', loc_denine = '1' where id ='"+user_id+"' and create_type = "+login_type
    else:
        if type == '1':
            update_sql = "update member_info set bjdong_cd_01 = '"+str(bjdong_cd)+"' where id ='"+user_id+"' and create_type = "+login_type
        elif type == '2':
            update_sql = "update member_info set bjdong_cd_02 = '"+str(bjdong_cd)+"' where id ='"+user_id+"' and create_type = "+login_type
        elif type == '3':
            update_sql = "update member_info set bjdong_cd_03 = '"+str(bjdong_cd)+"' where id ='"+user_id+"' and create_type = "+login_type

    # print(update_sql)

    update_sql = cursor.execute(update_sql)
    update_sql = cursor.fetchall()
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify(result = "success")


@member_info.route("/user_loc", methods=['GET', 'POST'])
def user_loc():
    user_idx = session.get('user_idx')
    bjdong_cd = ''

    if user_idx:
        conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
        cursor = conn.cursor()

        select_sql = " SELECT select_bjdong, bjdong_cd_01, bjdong_cd_02, bjdong_cd_03, loc_denine" \
                     " FROM member_info " \
                     " where idx ='"+str(user_idx)+"'"

        select_sql = cursor.execute(select_sql)
        select_sql = cursor.fetchall()

        select_bjdong = select_sql[0][0]
        bjdong_cd_01 = select_sql[0][1]
        bjdong_cd_02 = select_sql[0][2]
        bjdong_cd_03 = select_sql[0][3]
        loc_denine = select_sql[0][4]

        if select_bjdong == "1":
            bjdong_cd = bjdong_cd_01
        elif select_bjdong == "2":
            bjdong_cd = bjdong_cd_02
        elif select_bjdong == "3":
            bjdong_cd = bjdong_cd_03

        if bjdong_cd != '':
            bjdong_select_sql = "SELECT lat, lon, emd, sido_num FROM b_num_info where concat(SIGUNGU_NUM, BJDONG_NUM) = '" + bjdong_cd + "'"
            bjdong_select_sql = cursor.execute(bjdong_select_sql)
            bjdong_select_sql = cursor.fetchall()
        else:
            bjdong_select_sql = ''

        if len(bjdong_select_sql) != 0 :
            lat = bjdong_select_sql[0][0]
            lon = bjdong_select_sql[0][1]
            emd = bjdong_select_sql[0][2]
            sido_cd = bjdong_select_sql[0][3]
        else:
            lat = ''
            lon = ''
            sido_cd = ''
            loc_denine = ''
            select_bjdong = ''
            emd = ''
        # session['loc_n_bjdong_cd'] = bjdong_cd
        # session['loc_n_sido_cd'] = sido_cd
        # session['loc_n_lat'] = lat
        # session['loc_n_lon'] = lon
        return jsonify(result="success", loc_lat = lat, loc_lon = lon, sido_cd = sido_cd, bjdong_cd=bjdong_cd, loc_denine=loc_denine, emd=emd, select_bjdong=select_bjdong)
    else:
        lat = ''
        lon = ''
        sido_cd = ''
        loc_denine = ''
        select_bjdong = ''
        emd = ''
        return jsonify(result="success", loc_lat = lat, loc_lon = lon, sido_cd = sido_cd, bjdong_cd=bjdong_cd, loc_denine=loc_denine, emd=emd, select_bjdong=select_bjdong)

#=========================학원 관리 끝===============================

def random_num(k):
    myList = []
    random_num = ''
    num = random.randrange(0, 10)
    for i in range(k) :
        while num in myList : # 중복될 경우
            num = random.randrange(0, 10) # 다시 난수 생성
        myList.append(num) # 중복 되지 않은 경우만 추가
        random_num = random_num + str(num)
        # myList.sort() # 정렬이 필요하다면
    return random_num




