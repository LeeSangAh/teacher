from flask import Flask, Blueprint, session, render_template, jsonify, request, flash
from werkzeug.security import generate_password_hash, check_password_hash
import pymysql
import requests
import json
from werkzeug.utils import secure_filename
from datetime import datetime
import random
import os
import config

academy_info = Blueprint("academy_info", __name__, url_prefix="/academy_info")

# 회사 서버올릴때
dbhost = config.dbhost
userid = config.userid
userpw = config.userpw
dbnm = config.dbnm
port = config.port

ALLOWED_EXTENSIONS = config.ALLOWED_EXTENSIONS
UPLOAD_FOLDER = config.ACADEMY_UPLOAD_FOLDER

now = datetime.now()



@academy_info.route("/academy_info_normal", methods=['GET', 'POST'])
def academy_info_normal():
    return render_template('/academy_info/academy_info.html')



# =============== 학원 관리 ================

@academy_info.route("/academy_search", methods=['GET', 'POST'])
def academy_search():
    user_idx = session.get('user_idx')
    data = request.get_json()
    academy_search_nm =  data.get('academy_search_nm', '')
    bjdong_cd_loc = data.get('bjdong_cd_loc', False)
    print("academy_search_nm: ", academy_search_nm)
    print("bjdong_cd_loc: ", bjdong_cd_loc)

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    academy_sql = "select idx, concat(add_01, add_02), academy_nm, bjdong_cd from academy_info ai where bjdong_cd = '"+str(bjdong_cd_loc)+"' and academy_nm like '%"+academy_search_nm+"%'"

    academy_sql = cursor.execute(academy_sql)
    academy_sql = cursor.fetchall()

    cursor.close()
    conn.close()

    count = 0

    for i in academy_sql:
        count += 1
        idx = i[0]
        addr = i[1]
        academy_nm = i[2]
        bjdong = i[3]
        strcount = str(count)
        data['idx_'+strcount] = idx
        data['addr_'+strcount] = addr
        data['academy_nm_'+strcount] = academy_nm
        data['bjdong_'+strcount] = bjdong
    data['id_counter'] = count
    return jsonify(result = "success", result2=data)

@academy_info.route('/academy_list', methods=['POST'])
def academy_list():
    now = datetime.now()
    start_time = now
    data = request.get_json()
    user_idx = data.get('user_idx')

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    academy_list_sql = "select mi.idx, sti.teacher_type, sti.belong_idx, ai.academy_nm, sti.represent  " \
                       " from member_info mi, st_teacher_info sti, academy_info ai" \
                       " where mi.idx = sti.member_idx" \
                       " and sti.belong_idx = ai.IDX" \
                       " and mi.member_type = 4" \
                       " and sti.belong_type = 7 " \
                       " and sti.belong_yn = 1" \
                       " and mi.idx = '"+str(user_idx)+"'"

    academy_list = cursor.execute(academy_list_sql)
    academy_list = cursor.fetchall()

    count = 0
    for i in academy_list:
        count += 1
        idx = i[0]
        teacher_type = i[1]
        belong_idx = i[2]
        academy_nm = i[3]
        represent = i[4]

        strcount = str(count)
        data['idx_'+strcount] = idx
        data['teacher_type_'+strcount] = teacher_type
        data['belong_idx_'+strcount] = belong_idx
        data['academy_nm_'+strcount] = academy_nm
        data['represent_'+strcount] = represent

    data['id_counter'] = count
    cursor.close()
    conn.close()
    return jsonify(result = "success", result2= data)

@academy_info.route('/academy_change', methods=['POST'])
def academy_change():
    now = datetime.now()
    start_time = now
    data = request.get_json()
    belong_idx = data.get('belong_idx')
    user_idx = data.get('user_idx')

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    belong_update_sql1 = "update st_teacher_info set represent = '0' where member_idx = '"+user_idx+"'"

    belong_update_sql2 = "update st_teacher_info set represent = '1' where idx = '"+belong_idx+"'"

    cursor.execute(belong_update_sql1)
    cursor.execute(belong_update_sql2)

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify(result = "success")


@academy_info.route("/academy_del", methods=['GET', 'POST'])
def academy_del():
    data = request.get_json()
    academy_idx =  data.get('academy_idx', False)

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    academy_sql = "update ma_belong set belong_yn = 'n' where idx = "+str(academy_idx)+""

    cursor.execute(academy_sql)
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify(result = "success")

@academy_info.route("/academy_reg", methods=['GET', 'POST'])
def academy_reg():
    data = request.get_json()
    academy_select_idx = data.get('academy_select_idx', False)
    business_num =  data.get('business_num', False)
    business_start_date = data.get('business_start_date', False)
    business_boss_nm = data.get('business_boss_nm', False)
    user_idx = data.get('user_idx', False)

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    teacher_insert_sql = "INSERT INTO st_teacher_info (teacher_name, member_idx, teacher_type, belong_idx, belong_type, belong_yn, represent, INSERT_DATE) " \
                         "VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
    print(teacher_insert_sql)
    val1=[
        (business_boss_nm),
        (user_idx),
        ('1'),
        (academy_select_idx),
        ('1'),
        ('1'),
        ('1'),
        (now)
    ]
    cursor.execute(teacher_insert_sql, val1)
    conn.commit()

    academy_info_sql = "update academy_info " \
                       "set business_num = %s, academy_reg_date = %s, business_boss_nm = %s, reg_date = %s " \
                       "where idx = %s" \

    val = [
        (business_num),
        (business_start_date),
        (business_boss_nm),
        (now),
        (academy_select_idx)
    ]

    cursor.execute(academy_info_sql, val)
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify(result = "success")


@academy_info.route("/academy_reg_normal", methods=['GET', 'POST'])
def academy_reg_normal():
    data = request.get_json()
    academy_select_idx = data.get('academy_select_idx', False)
    privacy_info_nm = data.get('privacy_info_nm', False)
    privacy_info_telnum = data.get('privacy_info_telnum', False)
    user_idx = data.get('user_idx', False)
    print("user_idx: ", user_idx)
    print("user_idx: ", type(user_idx))

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    teacher_insert_sql = "INSERT INTO st_teacher_info (teacher_name, tel_number, member_idx, teacher_type, belong_idx, belong_type, belong_yn, represent, INSERT_DATE) " \
                         "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
    print(teacher_insert_sql)
    val1=[
        (privacy_info_nm),
        (privacy_info_telnum),
        (user_idx),
        ('4'),
        (academy_select_idx),
        ('7'),
        ('3'),
        ('1'),
        (now)
    ]
    cursor.execute(teacher_insert_sql, val1)
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify(result = "success")

@academy_info.route('/academy_info_desc', methods=['GET', 'POST'])
def academy_info_desc():
    now = datetime.now()

    data = request.get_json()
    user_idx = data.get('user_idx')
    belong_idx = data.get('belong_idx')

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    academy_info_sql = "select  shop_img_01, shop_img_02, shop_img_03, academy_desc, tel_num, " \
                       "        school_target_nm, teaching_line_nm, teaching_subject_nm_02, tuition_desc, class_peaple_cnt, " \
                       "        people_sum, like_cnt, add_01, add_02, zip_code, represent_img, category_nm, reg_state" \
                       " from academy_info ai " \
                       " where idx = '"+str(belong_idx)+"'"

    academy_info = cursor.execute(academy_info_sql)
    academy_info = cursor.fetchall()

    shop_img_01 = academy_info[0][0]
    shop_img_02 = academy_info[0][1]
    shop_img_03 = academy_info[0][2]
    academy_desc = academy_info[0][3]
    tel_num = academy_info[0][4]
    school_target_nm = academy_info[0][5]
    teaching_line_nm = academy_info[0][6]
    teaching_subject_nm_02 = academy_info[0][7]
    tuition_desc = academy_info[0][8]
    class_peaple_cnt = academy_info[0][9]
    people_sum = academy_info[0][10]
    like_cnt = academy_info[0][11]
    add_01 = academy_info[0][12]
    add_02 = academy_info[0][13]
    zip_code = academy_info[0][14]
    represent_img = academy_info[0][15]
    category_nm = academy_info[0][16]
    reg_state = academy_info[0][17]

    data['shop_img_01'] = shop_img_01
    data['shop_img_02'] = shop_img_02
    data['shop_img_03'] = shop_img_03
    data['academy_desc'] = academy_desc
    data['tel_num'] = tel_num
    data['school_target_nm'] = school_target_nm
    data['teaching_line_nm'] = teaching_line_nm
    data['teaching_subject_nm_02'] = teaching_subject_nm_02
    data['tuition_desc'] = tuition_desc
    data['class_peaple_cnt'] = class_peaple_cnt
    data['people_sum'] = people_sum
    data['like_cnt'] = like_cnt
    data['add_01'] = add_01
    data['add_02'] = add_02
    data['zip_code'] = zip_code
    data['represent_img'] = represent_img
    data['category_nm'] = category_nm
    data['reg_state'] = reg_state

    academy_attach_info_sql = "select idx, file_name from academy_attach aa where academy_idx = "+str(belong_idx)+" and service_type = '1' and delete_yn = '1'"

    print(academy_attach_info_sql)
    academy_attach_info_sql = cursor.execute(academy_attach_info_sql)
    academy_attach_info_sql = cursor.fetchall()

    count = 0

    for i in academy_attach_info_sql:
        count += 1
        idx = i[0]
        file_name = i[1]
        strcount = str(count)
        data['idx_'+strcount] = idx
        data['file_name_'+strcount] = file_name
    data['id_counter'] = count
    print(data)

    cursor.close()
    conn.close()
    return jsonify(result = "success", result2= data)

@academy_info.route('/academy_info_mod', methods=['GET', 'POST'])
def academy_info_mod():
    return render_template('/academy_info/academy_info_mod.html')

@academy_info.route('academy_mod_save', methods=['POST'])
def academy_mod_save():
    tel_num = request.form.get('tel_num')
    school_target_nm = request.form.get('school_target_nm')
    category_nm = request.form.get('category_nm')
    teaching_line_nm = request.form.get('teaching_line_nm')
    teaching_subject_nm_02 = request.form.get('teaching_subject_nm_02')
    tuition_desc = request.form.get('tuition_desc')
    class_peaple_cnt = request.form.get('class_peaple_cnt')
    people_sum = request.form.get('people_sum')
    address1 = request.form.get('address1')
    address2 = request.form.get('address2')
    reg_state = request.form.get('reg_state')
    academy_desc = request.form.get('academy_desc')
    belong_idx = request.form.get('belong_idx')


    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    academy_update_sql = " update academy_info "\
                      " set tel_num = %s," \
                      " school_target_nm = %s," \
                      " category_nm = %s," \
                      " teaching_line_nm = %s," \
                      " teaching_subject_nm_02 = %s," \
                      " tuition_desc = %s," \
                      " class_peaple_cnt = %s," \
                      " people_sum = %s," \
                      " add_01 = %s," \
                      " add_02 = %s," \
                      " reg_state = %s, academy_desc = %s" \
                      " where idx =  %s"
    # print(blog_insert_sql)
    val = [
        (tel_num),
        (school_target_nm),
        (category_nm),
        (teaching_line_nm),
        (teaching_subject_nm_02),
        (tuition_desc),
        (class_peaple_cnt),
        (people_sum),
        (address1),
        (address2),
        (reg_state),
        (academy_desc),
        (belong_idx)
    ]
    cursor.execute(academy_update_sql, val)
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify(result = "success")

@academy_info.route('academy_attach_add', methods=['POST'])
def academy_attach_add():
    now_date = now.strftime('%Y%m%d%H%M%S')
    files = request.files.getlist('file[]')
    belong_idx = request.form.get('belong_idx')

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    for file in files:
        print("file: ", file)

        filename = secure_filename(file.filename)
        now_date = str(now_date)
        new_filename = now_date+"_"+filename

        file.save(os.path.join(UPLOAD_FOLDER, new_filename))
        print(os.path.join(UPLOAD_FOLDER))

        attach_insert_sql = " insert into academy_attach (academy_idx, service_type, file_name, delete_yn, insert_date)" \
                            " values (%s, %s, %s, %s, %s)"
        val_02 = [
            (belong_idx),
            ('1'),
            (new_filename),
            ('1'),
            (now)
        ]

        # print(attach_insert_sql)
        cursor.execute(attach_insert_sql, val_02)
        conn.commit()

        last_insert_id_sql = "SELECT LAST_INSERT_ID()"
        last_insert_id_sql = cursor.execute(last_insert_id_sql)
        last_insert_id = cursor.fetchall()[0]

    cursor.close()
    conn.close()

    return jsonify(result = "success", result2 = last_insert_id)


@academy_info.route('academy_attach_del', methods=['GET', 'POST'])
def academy_attach_del():
    data = request.get_json()
    academy_file_idx = data.get('academy_file_idx')

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    academy_delete_sql = " update academy_attach set delete_yn = '0' where idx = "+str(academy_file_idx)

    print(academy_delete_sql)

    cursor.execute(academy_delete_sql)
    conn.commit()

    return jsonify(result = "success", result2= data)