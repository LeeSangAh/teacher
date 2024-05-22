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

teacher_info = Blueprint("teacher_info", __name__, url_prefix="/teacher_info")

# 회사 서버올릴때
dbhost = config.dbhost
userid = config.userid
userpw = config.userpw
dbnm = config.dbnm
port = config.port

ALLOWED_EXTENSIONS = config.ALLOWED_EXTENSIONS
UPLOAD_FOLDER = config.ACADEMY_UPLOAD_FOLDER

now = datetime.now()

@teacher_info.route("/teacher_info_normal", methods=['GET', 'POST'])
def teacher_info_normal():
    return render_template('/teacher_info/teacher_info.html')

@teacher_info.route("/teacher_info_predetail", methods=['GET', 'POST'])
def teacher_info_predetail():
    teacher_idx = request.args.get('teacher_idx')
    return render_template('/teacher_info/teacher_info_detail.html', teacher_idx=teacher_idx)

@teacher_info.route("/teacher_info_mod_ready", methods=['GET', 'POST'])
def teacher_info_mod_ready():
    teacher_idx = request.args.get('teacher_idx')
    return render_template('/teacher_info/teacher_info_mod.html', teacher_idx=teacher_idx)

@teacher_info.route("/teacher_info_create_ready", methods=['GET', 'POST'])
def teacher_info_create_ready():
    return render_template('/teacher_info/teacher_info_create.html')

@teacher_info.route("/teacher_info_detail", methods=['GET', 'POST'])
def teacher_info_detail():
    data = request.get_json()
    teacher_idx = data.get('teacher_idx')

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    teacher_info_detail_sql = "select teacher_type, teacher_picture, teacher_name, tel_number, major_subject, belong_yn, university, teacher_desc, email, add1, add2  " \
                              " from st_teacher_info " \
                              " where idx = "+str(teacher_idx)

    teacher_info_detail_sql = cursor.execute(teacher_info_detail_sql)
    teacher_info_detail_sql = cursor.fetchall()

    teacher_type = teacher_info_detail_sql[0][0]
    teacher_picture = teacher_info_detail_sql[0][1]
    teacher_name = teacher_info_detail_sql[0][2]
    tel_number = teacher_info_detail_sql[0][3]
    major_subject = teacher_info_detail_sql[0][4]
    belong_yn = teacher_info_detail_sql[0][5]
    university = teacher_info_detail_sql[0][6]
    teacher_desc = teacher_info_detail_sql[0][7]
    teacher_email = teacher_info_detail_sql[0][8]
    addr1 = teacher_info_detail_sql[0][9]
    addr2 = teacher_info_detail_sql[0][10]

    data['teacher_type'] = teacher_type
    data['teacher_picture'] = teacher_picture
    data['teacher_name'] = teacher_name
    data['tel_number'] = tel_number
    data['major_subject'] = major_subject
    data['belong_yn'] = belong_yn
    data['university'] = university
    data['teacher_desc'] = teacher_desc
    data['teacher_email'] = teacher_email
    data['addr1'] = addr1
    data['addr2'] = addr2

    lecture_list_sql="select idx, class_nm from st_class_info sci "\
                     " where teacher_idx = "+str(teacher_idx)

    lecture_list_sql = cursor.execute(lecture_list_sql)
    lecture_list_sql = cursor.fetchall()

    count=0
    for i in lecture_list_sql:
        count +=1
        class_idx = i[0]
        class_nm = i[1]

        strcount = str(count)
        data['class_idx_'+strcount] = class_idx
        data['class_nm_'+strcount] = class_nm

    data['id_counter'] = count
    cursor.close()
    conn.close()

    return jsonify(result = "success", result2=data)


@teacher_info.route('/teacher_info_list', methods=['POST','GET'])
def teacher_info_list():
    belong_idx = request.args.get('belong_idx')

    # Number of items per page
    items_per_page = 9

    # Get the requested page number from the AJAX request
    page = int(request.args.get('page', 1))

    # Calculate the start and end index for slicing the data
    start_idx = (page - 1) * items_per_page
    end_idx = start_idx + items_per_page


    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    shop_sql = "select COUNT(idx) from st_teacher_info where belong_idx = "+belong_idx
    cursor.execute(shop_sql)
    total = cursor.fetchone()[0]

    shop_sql_page = "select idx, teacher_type, teacher_picture, teacher_name, tel_number, major_subject, belong_yn from st_teacher_info where belong_idx = "+str(belong_idx)+" order by teacher_name desc limit %s OFFSET %s"

    cursor.execute(shop_sql_page, (items_per_page, start_idx))
    posts = cursor.fetchall()
    cursor.close()
    conn.close()

    # Slice the data to get the items for the current page
    paginated_data = posts
    post_cnt = len(paginated_data)
    # Calculate the total number of pages for pagination
    total_pages = total // items_per_page + (1 if total % items_per_page > 0 else 0)

    # Render the HTML template for the data and pagination links
    data_html = render_template('/teacher_info/teacher_info_data.html', data=paginated_data)

    # Generate the HTML for the pagination links
    pagination_html = ''.join([
        f'<a href="javascript:void(0);" onclick="loadPage({page}, {belong_idx})" return false;>{page}</a>' for page in range(1, total_pages + 1)
    ])

    return jsonify(data=data_html, pagination=pagination_html, total=total, page=page, post_cnt=post_cnt)


@teacher_info.route('teacher_attach_mod', methods=['POST'])
def teacher_attach_mod():
    now_date = now.strftime('%Y%m%d%H%M%S')
    file = request.files.getlist('file')[0]
    teacher_idx = request.form.get('teacher_idx')

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    filename = secure_filename(file.filename)
    now_date = str(now_date)
    new_filename = now_date+"_"+filename

    academy_info_upload_folder = UPLOAD_FOLDER+"teacher_info/"

    file.save(os.path.join(academy_info_upload_folder, new_filename))
    print(os.path.join(academy_info_upload_folder))

    attach_update_sql = "update st_teacher_info " \
                        " set teacher_picture = '"+new_filename+"' " \
                        " where idx = "+str(teacher_idx)
    print(attach_update_sql)

    cursor.execute(attach_update_sql)
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify(result = "success")


@teacher_info.route('teacher_mod_save', methods=['POST'])
def teacher_mod_save():
    teacher_status = request.form.get('teacher_status')
    print(teacher_status)
    teacher_name = request.form.get('teacher_name')
    teacher_desc = request.form.get('teacher_desc')
    teacher_email = request.form.get('teacher_email')
    tel_number = request.form.get('tel_number')
    teacher_addr1 = request.form.get('teacher_addr1')
    teacher_addr2 = request.form.get('teacher_addr2')
    major_subject = request.form.get('major_subject')
    university = request.form.get('university')

    teacher_idx = request.form.get('teacher_idx')

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    academy_update_sql = " update st_teacher_info " \
                         " set belong_yn = %s," \
                         " teacher_name = %s," \
                         " teacher_desc = %s," \
                         " email = %s," \
                         " tel_number = %s," \
                         " add1 = %s," \
                         " add2 = %s," \
                         " major_subject = %s," \
                         " university = %s" \
                         " where idx =  %s"

    val = [
        (teacher_status),
        (teacher_name),
        (teacher_desc),
        (teacher_email),
        (tel_number),
        (teacher_addr1),
        (teacher_addr2),
        (major_subject),
        (university),
        (teacher_idx)
    ]
    cursor.execute(academy_update_sql, val)
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify(result = "success")

@teacher_info.route('teacher_info_del', methods=['GET', 'POST'])
def teacher_info_del():
    data = request.get_json()
    teacher_idx = data.get('teacher_idx')

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    teacher_del_sql = " update st_teacher_info " \
                         " set delete_yn = '0'" \
                         " where idx = "+str(teacher_idx)

    cursor.execute(teacher_del_sql)
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify(result = "success")

@teacher_info.route('teacher_info_attach_create', methods=['GET', 'POST'])
def teacher_info_attach_create():
    data = request.get_json()
    teacher_idx = data.get('teacher_idx')

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    teacher_del_sql = " update st_teacher_info " \
                      " set belong_yn = '0'" \
                      " where idx = "+str(teacher_idx)

    cursor.execute(teacher_del_sql)
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify(result = "success")


@teacher_info.route('/teacher_info_lecture', methods=['POST','GET'])
def teacher_info_lecture():
    teacher_idx = request.args.get('teacher_idx')
    belong_idx = request.args.get('belong_idx')

    # Number of items per page
    items_per_page = 8

    # Get the requested page number from the AJAX request
    page = int(request.args.get('page', 1))

    # Calculate the start and end index for slicing the data
    start_idx = (page - 1) * items_per_page
    end_idx = start_idx + items_per_page


    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    lectuer_cnt_sql = " select count(sli.idx)"\
                      " from st_class_info sci, st_lecture_info sli" \
                      " where sci.idx = sli.class_idx" \
                      " and sli.lecture_day <= CURRENT_DATE()" \
                      " and sci.teacher_idx = "+str(teacher_idx)+"" \
                      " and sci.belong_idx = "+str(belong_idx)

    cursor.execute(lectuer_cnt_sql)
    total = cursor.fetchone()[0]

    lecture_sql = " select sli.idx, sci.class_nm, date_format(sli.lecture_day, '%%y-%%m-%%d') as lecture_day, lec_start_time_arr, lec_end_time_arr, sli.status, "\
                     " (select count(sai.idx) from st_attendance_info sai" \
                     " where sai.lecture_idx = sli.idx) as attendance, sci.idx, sli.lecture_day" \
                     " from st_class_info sci, st_lecture_info sli" \
                     " where sci.idx = sli.class_idx" \
                     " and sli.lecture_day <= CURRENT_DATE()" \
                     " and sci.teacher_idx = "+str(teacher_idx)+"" \
                     " and sci.belong_idx = "+str(belong_idx)+"" \
                     " order by sli.lecture_day desc limit %s OFFSET %s"

    cursor.execute(lecture_sql, (items_per_page, start_idx))
    posts = cursor.fetchall()
    cursor.close()
    conn.close()

    # Slice the data to get the items for the current page
    paginated_data = posts
    post_cnt = len(paginated_data)
    # Calculate the total number of pages for pagination
    total_pages = total // items_per_page + (1 if total % items_per_page > 0 else 0)

    # Render the HTML template for the data and pagination links
    data_html = render_template('/teacher_info/teacher_info_data_lecture.html', data=paginated_data)

    # Generate the HTML for the pagination links


    return jsonify(data=data_html, total=total, page=page, post_cnt=post_cnt)


@teacher_info.route('lecture_expected_info', methods=['GET', 'POST'])
def lecture_expected_info():
    data = request.get_json()
    belong_idx = data.get('belong_idx')
    teacher_idx = data.get('teacher_idx')

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    lecture_expected_sql = " select sli.idx, sci.class_nm, date_format(sli.lecture_day, '%y-%m-%d') as lecture_day, lec_start_time_arr, lec_end_time_arr, sli.lecture_day "\
                           " from st_class_info sci, st_lecture_info sli " \
                           " where sci.idx = sli.class_idx " \
                           " and sli.lecture_day >= CURRENT_DATE() " \
                           " and sci.teacher_idx = "+str(teacher_idx)+"" \
                           " and sci.belong_idx = "+str(belong_idx)+"" \
                           " order by sli.lecture_day limit 10"

    select_sql = cursor.execute(lecture_expected_sql)
    select_sql = cursor.fetchall()

    count = 0
    for i in select_sql:
        count += 1
        lecture_idx = i[0]
        class_nm = i[1]
        lecture_day = i[2]
        lecture_starttime = i[3]
        lecture_endtime = i[4]

        strcount = str(count)
        data['lecture_idx_'+strcount] = lecture_idx
        data['class_nm_'+strcount] = class_nm
        data['lecture_day_'+strcount] = lecture_day
        data['lecture_starttime_'+strcount] = lecture_starttime
        data['lecture_endtime_'+strcount] = lecture_endtime

    data['id_counter'] = count
    cursor.close()
    conn.close()

    return jsonify(result = "success", result2=data)

