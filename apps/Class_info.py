from flask import Flask, Blueprint, session, render_template, jsonify, request, flash
from werkzeug.security import generate_password_hash, check_password_hash
import pymysql
import requests
import json
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta
import random
import os
import config


class_info = Blueprint("class_info", __name__, url_prefix="/class_info")

# 회사 서버올릴때
dbhost = config.dbhost
userid = config.userid
userpw = config.userpw
dbnm = config.dbnm
port = config.port

ALLOWED_EXTENSIONS = config.ALLOWED_EXTENSIONS
UPLOAD_FOLDER = config.ACADEMY_UPLOAD_FOLDER

now = datetime.now()

@class_info.route("/class_info_normal", methods=['GET', 'POST'])
def class_info_normal():
    return render_template('/class_info/class_info.html')

@class_info.route("/class_info_predetail", methods=['GET', 'POST'])
def class_info_predetail():
    class_idx = request.args.get('class_idx')
    return render_template('/class_info/class_info_detail.html', class_idx=class_idx)

@class_info.route("/class_info_mod_ready", methods=['GET', 'POST'])
def class_info_mod_ready():
    class_idx = request.args.get('class_idx')
    return render_template('/class_info/class_info_mod.html', class_idx=class_idx)

@class_info.route("/class_info_create_ready", methods=['GET', 'POST'])
def class_info_create_ready():
    return render_template('/class_info/class_info_create.html')

@class_info.route("/class_info_detail", methods=['GET', 'POST'])
def class_info_detail():
    data = request.get_json()
    class_idx = data.get('class_idx')
    # print(class_idx)
    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    class_info_detail_sql = "select sci.idx, sci.status, sci.class_nm, ssi2.subject_nm, scl.level_nm,   " \
                            "(select COUNT(ssi.idx) from st_enrolment_info ssi " \
                            " where ssi.class_idx = sci.idx and sci.status = 1 and delete_yn = 1) as student_cnt, " \
                            " sci.class_limit_student, sci.level_test_yn, sci.level_test_limit,  sti.teacher_picture,sti.teacher_name," \
                            " sbi.book_nm, sci.tution_fee, sci.class_enrolment_start, sci.class_enrolment_end, sci.start_date, sci.end_date, " \
                            " sci.class_desc, sci.book_idx, sti.idx, sci.class_level_idx, sci.subject_idx, " \
                            " sci.lec_day_arr, sci.lec_start_time_arr, sci.lec_end_time_arr, sci.again_yn_arr " \
                            " from st_class_info sci, st_teacher_info sti, st_class_level scl, st_subject_info ssi2, st_book_info sbi " \
                            " where sci.teacher_idx = sti.idx " \
                            " and sci.class_level_idx = scl.idx " \
                            " and sci.subject_idx = ssi2.idx " \
                            " and sci.book_idx = sbi.idx and sci.idx = "+str(class_idx)

    class_info_detail_sql = cursor.execute(class_info_detail_sql)
    class_info_detail_sql = cursor.fetchall()

    class_idx = class_info_detail_sql[0][0]
    class_status = class_info_detail_sql[0][1]
    class_nm = class_info_detail_sql[0][2]
    subject_nm = class_info_detail_sql[0][3]
    level_nm = class_info_detail_sql[0][4]
    student_cnt = class_info_detail_sql[0][5]
    class_limit_student = class_info_detail_sql[0][6]
    level_test_yn = class_info_detail_sql[0][7]
    level_test_limit = class_info_detail_sql[0][8]
    teacher_picture = class_info_detail_sql[0][9]
    teacher_name = class_info_detail_sql[0][10]
    book_nm = class_info_detail_sql[0][11]
    tution_fee = class_info_detail_sql[0][12]
    class_enrolment_start = class_info_detail_sql[0][13]
    if class_enrolment_start:
        class_enrolment_start = class_enrolment_start.strftime('%Y-%m-%d')
    class_enrolment_end = class_info_detail_sql[0][14]
    if class_enrolment_end:
        class_enrolment_end = class_enrolment_end.strftime('%Y-%m-%d')
    start_date = class_info_detail_sql[0][15]
    if start_date:
        start_date = start_date.strftime('%Y-%m-%d')
    end_date = class_info_detail_sql[0][16]
    if end_date:
        end_date = end_date.strftime('%Y-%m-%d')
    class_desc = class_info_detail_sql[0][17]
    book_idx = class_info_detail_sql[0][18]
    teacher_idx = class_info_detail_sql[0][19]
    class_level_idx = class_info_detail_sql[0][20]
    subject_idx = class_info_detail_sql[0][21]
    lec_day_arr = class_info_detail_sql[0][22]
    lec_start_time_arr = class_info_detail_sql[0][23]
    lec_end_time_arr = class_info_detail_sql[0][24]
    again_yn_arr = class_info_detail_sql[0][25]

    data['class_idx'] = class_idx
    data['class_status'] = class_status
    data['class_nm'] = class_nm
    data['subject_nm'] = subject_nm
    data['level_nm'] = level_nm
    data['student_cnt'] = student_cnt
    data['class_limit_student'] = class_limit_student
    data['level_test_yn'] = level_test_yn
    data['level_test_limit'] = level_test_limit
    data['teacher_picture'] = teacher_picture
    data['teacher_name'] = teacher_name
    data['book_nm'] = book_nm
    data['tution_fee'] = tution_fee
    data['class_enrolment_start'] = class_enrolment_start
    data['class_enrolment_end'] = class_enrolment_end
    data['start_date'] = start_date
    data['end_date'] = end_date
    data['class_desc'] = class_desc
    data['book_idx'] = book_idx
    data['teacher_idx'] = teacher_idx
    data['class_level_idx'] = class_level_idx
    data['subject_idx'] = subject_idx
    data['lec_day_arr'] = lec_day_arr
    data['lec_start_time_arr'] = lec_start_time_arr
    data['lec_end_time_arr'] = lec_end_time_arr
    data['again_yn_arr'] = again_yn_arr

    return jsonify(result = "success", result2=data)


@class_info.route('/class_info_list', methods=['POST','GET'])
def class_info_list():
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

    shop_sql = "select COUNT(sci.idx) from st_class_info sci, st_teacher_info sti, st_class_level scl, st_subject_info ssi2 " \
               " where sci.teacher_idx = sti.idx " \
               " and sci.class_level_idx = scl.idx " \
               " and sci.subject_idx = ssi2.idx " \
               " and sci.belong_idx = "+str(belong_idx)+" " \
               " and sci.belong_type = '7' " \
               " and sci.status = 1" \

    cursor.execute(shop_sql)
    total = cursor.fetchone()[0]

    shop_sql_page = "select sci.idx, sci.class_nm, ssi2.subject_nm, sti.teacher_picture, sti.teacher_name, scl.level_nm, "\
                    "(select COUNT(ssi.idx) from st_enrolment_info ssi " \
                    " where ssi.class_idx = sci.idx and ssi.status = 1) as student_cnt, " \
                    " sci.class_limit_student, sci.start_date, sci.end_date, sci.status " \
                    " from st_class_info sci, st_teacher_info sti, st_class_level scl, st_subject_info ssi2 " \
                    " where sci.teacher_idx = sti.idx " \
                    " and sci.class_level_idx = scl.idx " \
                    " and sci.subject_idx = ssi2.idx " \
                    " and sci.belong_idx = "+str(belong_idx)+" " \
                    " and sci.belong_type = '7' " \
                    " and sci.status = 1" \
                    " order by teacher_name desc limit %s OFFSET %s"

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
    data_html = render_template('/class_info/class_info_data.html', data=paginated_data)

    # Generate the HTML for the pagination links
    pagination_html = ''.join([
        f'<a href="javascript:void(0);" onclick="loadPage({page}, {belong_idx})" return false;>{page}</a>' for page in range(1, total_pages + 1)
    ])

    return jsonify(data=data_html, pagination=pagination_html, total=total, page=page, post_cnt=post_cnt)


@class_info.route('teacher_list', methods=['GET', 'POST'])
def teacher_list():
    data = request.get_json()
    belong_idx = data.get('belong_idx')

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    teacher_sql = " select idx, teacher_name from st_teacher_info sti "\
                       " where  belong_type = 7 " \
                      " and delete_yn = 1 " \
                      " and belong_idx = "+str(belong_idx)

    teacher_sql = cursor.execute(teacher_sql)
    teacher_sql = cursor.fetchall()

    cursor.close()
    conn.close()

    count = 0
    for i in teacher_sql:
        count += 1
        idx = i[0]
        teacher_nm = i[1]

        strcount = str(count)
        data['idx_'+strcount] = idx
        data['teacher_nm_'+strcount] = teacher_nm

    data['id_counter'] = count

    return jsonify(result="success", result2=data)

@class_info.route('class_level_list', methods=['GET', 'POST'])
def class_level_list():
    data = request.get_json()
    belong_idx = data.get('belong_idx')

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    class_level_sql = " select idx, belong_idx, level_nm from st_class_level sti " \
                  " where  belong_type = 7 " \
                  " and delete_yn = 1 " \
                  " and belong_idx in (0, "+str(belong_idx)+")"

    class_level_sql = cursor.execute(class_level_sql)
    class_level_sql = cursor.fetchall()

    cursor.close()
    conn.close()

    count = 0
    for i in class_level_sql:
        count += 1
        idx = i[0]
        belong_idx = i[1]
        class_level_nm = i[2]

        strcount = str(count)
        data['idx_'+strcount] = idx
        data['belong_idx_'+strcount] = belong_idx
        data['class_level_nm_'+strcount] = class_level_nm

    data['id_counter'] = count

    return jsonify(result="success", result2=data)


@class_info.route('class_level_del', methods=['GET', 'POST'])
def class_level_del():
    now_date = now.strftime('%Y%m%d%H%M%S')
    data = request.get_json()
    academy_level_idx = data.get('academy_level_idx')

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    class_level_sql = " update st_class_level set delete_yn = '0', reg_date = %s" \
                      " where idx = %s"

    val = [
        (now_date),
        (academy_level_idx)
    ]

    cursor.execute(class_level_sql, val)
    conn.commit()

    return jsonify(result="success")

@class_info.route('class_level_add', methods=['GET', 'POST'])
def class_level_add():
    now_date = now.strftime('%Y%m%d%H%M%S')
    data = request.get_json()
    belong_idx = data.get('belong_idx')
    level_nm = data.get('level_nm')

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    class_level_sql = " insert into st_class_level (belong_idx, belong_type, level_nm, delete_yn, insert_date) values (%s, %s, %s, %s, %s)"

    val = [
        (belong_idx),
        ("7"),
        (level_nm),
        ("1"),
        (now_date)
    ]

    cursor.execute(class_level_sql, val)
    conn.commit()

    last_insert_idx_sql = "SELECT LAST_INSERT_ID()"
    last_insert_idx_sql = cursor.execute(last_insert_idx_sql)
    last_insert_idx = cursor.fetchall()[0]
    data['idx'] = last_insert_idx

    return jsonify(result="success", result2=data)



@class_info.route('book_list', methods=['GET', 'POST'])
def book_list():
    data = request.get_json()
    belong_idx = data.get('belong_idx')

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    book_sql = " select idx, book_nm from st_book_info sti " \
                      " where  belong_type = 7 " \
                      " and belong_idx = "+str(belong_idx)

    book_sql = cursor.execute(book_sql)
    book_sql = cursor.fetchall()

    cursor.close()
    conn.close()

    count = 0
    for i in book_sql:
        count += 1
        idx = i[0]
        book_nm = i[1]

        strcount = str(count)
        data['idx_'+strcount] = idx
        data['book_nm_'+strcount] = book_nm

    data['id_counter'] = count

    return jsonify(result="success", result2=data)

@class_info.route('subject_list', methods=['GET', 'POST'])
def subject_list():
    data = request.get_json()
    belong_idx = data.get('belong_idx')

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    subject_sql = " select idx, subject_nm from st_subject_info sti " \
               " where  belong_type = 7 and status = '1' " \
               " and belong_idx = "+str(belong_idx)

    subject_sql = cursor.execute(subject_sql)
    subject_sql = cursor.fetchall()

    cursor.close()
    conn.close()

    count = 0
    for i in subject_sql:
        count += 1
        idx = i[0]
        subject_nm = i[1]

        strcount = str(count)
        data['idx_'+strcount] = idx
        data['subject_nm_'+strcount] = subject_nm
    data['id_counter'] = count

    return jsonify(result="success", result2=data)

@class_info.route('class_info_create_save', methods=['GET', 'POST'])
def class_info_create():
    now_date = now.strftime('%Y%m%d%H%M%S')

    teacher_info = request.form.get('teacher_info')
    class_nm = request.form.get('class_nm')
    subject_info = request.form.get('subject_info')
    level_info = request.form.get('level_info')
    class_limit_student = request.form.get('class_limit_student')
    if class_limit_student == "":
        class_limit_student = 0

    level_test_yn = request.form.get('level_test_yn')
    level_test_limit = request.form.get('level_test_limit')
    if level_test_limit == "":
        level_test_limit = 0

    book_info = request.form.get('book_info')
    tution_fee = request.form.get('tution_fee')
    class_enrolment_start = request.form.get('class_enrolment_start')
    class_enrolment_end = request.form.get('class_enrolment_end')
    start_date = request.form.get('start_date')
    end_date = request.form.get('end_date')
    start_date = datetime.strptime(start_date, "%Y-%m-%d")
    end_date = datetime.strptime(end_date, "%Y-%m-%d")

    class_desc = request.form.get('class_desc')
    belong_idx = request.form.get('belong_idx')

    lec_day = request.form.get('lec_day_arr')
    lec_start_time = request.form.get('lec_start_time_arr')
    lec_end_time = request.form.get('lec_end_time_arr')
    again_yn = request.form.get('again_yn_arr')

    lec_day_arr = lec_day.split(',')
    lec_start_time_arr = lec_start_time.split(',')
    lec_end_time_arr = lec_end_time.split(',')
    again_yn_arr = again_yn.split(',')

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    class_insert_sql = " insert into st_class_info (belong_idx, belong_type, " \
                         " teacher_idx, class_nm, subject_idx, class_level_idx, class_limit_student, " \
                         " level_test_yn, level_test_limit, book_idx, tution_fee, class_enrolment_start," \
                         " class_enrolment_end, start_date, end_date, class_desc, status," \
                         " insert_date, lec_day_arr, lec_start_time_arr, lec_end_time_arr, again_yn_arr)" \
                         " values ( %s, %s, "\
                         " %s, %s, %s, %s, %s," \
                         " %s, %s, %s, %s, %s, " \
                         " %s, %s, %s, %s, %s, " \
                         " %s, %s, %s, %s, %s)"

    val = [
        (belong_idx),
        ("7"),

        (teacher_info),
        (class_nm),
        (subject_info),
        (level_info),
        (class_limit_student),

        (level_test_yn),
        (level_test_limit),
        (book_info),
        (tution_fee),
        (class_enrolment_start),

        (class_enrolment_end),
        (start_date),
        (end_date),
        (class_desc),
        ("1"),

        (now_date),
        (lec_day),
        (lec_start_time),
        (lec_end_time),
        (again_yn)
    ]

    cursor.execute(class_insert_sql, val)
    conn.commit()

    last_insert_idx_sql = "SELECT LAST_INSERT_ID()"
    last_insert_idx_sql = cursor.execute(last_insert_idx_sql)
    last_insert_idx = cursor.fetchall()[0]

    for i in range(len(lec_day_arr)):
        lec_day = datetime.strptime(lec_day_arr[i], "%Y-%m-%d")
        if again_yn_arr[i] == "true":
            while lec_day <= end_date:
                if lec_day > end_date:
                    break
                lec_time_save_sql = "insert into st_lecture_info" \
                                    "(class_idx, lecture_day, lecture_start_time, lecture_end_time, insert_date) values " \
                                    "(%s, %s, %s, %s, %s)"
                val1 = [
                    (last_insert_idx),
                    (lec_day),
                    (lec_start_time_arr[i]),
                    (lec_end_time_arr[i]),
                    (now_date)
                ]
                cursor.execute(lec_time_save_sql, val1)
                conn.commit()

                lec_day = lec_day + timedelta(days=7)

        else:
            lec_time_save_sql = "insert into st_lecture_info" \
                                "(class_idx, lecture_day, lecture_start_time, lecture_end_time, insert_date) values " \
                                "(%s, %s, %s, %s, %s)"
            val1 = [
                (last_insert_idx),
                (lec_day),
                (lec_start_time_arr[i]),
                (lec_end_time_arr[i]),
                (now_date)
            ]
            cursor.execute(lec_time_save_sql, val1)
            conn.commit()

    cursor.close()
    conn.close()

    return jsonify(result = "success")


@class_info.route('teacher_attach_mod', methods=['POST'])
def teacher_attach_mod():
    now_date = now.strftime('%Y%m%d%H%M%S')
    file = request.files.getlist('file')[0]
    teacher_idx = request.form.get('teacher_idx')

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    filename = secure_filename(file.filename)
    now_date = str(now_date)
    new_filename = now_date+"_"+filename

    academy_info_upload_folder = UPLOAD_FOLDER+"class_info/"

    file.save(os.path.join(academy_info_upload_folder, new_filename))
    print(os.path.join(academy_info_upload_folder))

    attach_update_sql = "update st_class_info " \
                        " set teacher_picture = '"+new_filename+"' " \
                                                                " where idx = "+str(teacher_idx)
    print(attach_update_sql)

    cursor.execute(attach_update_sql)
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify(result = "success")


@class_info.route('class_mod_save', methods=['POST'])
def class_mod_save():
    now_date = now.strftime('%Y%m%d%H%M%S')

    teacher_info = request.form.get('teacher_info')
    class_nm = request.form.get('class_nm')
    subject_info = request.form.get('subject_info')
    level_info = request.form.get('level_info')
    print("level_info: ", level_info)
    class_limit_student = request.form.get('class_limit_student')
    if class_limit_student == "":
        class_limit_student = 0

    level_test_yn = request.form.get('level_test_yn')
    level_test_limit = request.form.get('level_test_limit')
    if level_test_limit == "":
        level_test_limit = 0

    book_info = request.form.get('book_info')
    tution_fee = request.form.get('tution_fee')
    class_enrolment_start = request.form.get('class_enrolment_start')

    class_enrolment_end = request.form.get('class_enrolment_end')
    start_date = request.form.get('start_date')
    end_date = request.form.get('end_date')

    start_date = datetime.strptime(start_date, "%Y-%m-%d")
    end_date = datetime.strptime(end_date, "%Y-%m-%d")
    print("start_date", start_date)
    print("end_date", end_date)

    class_desc = request.form.get('class_desc')
    class_idx = int(request.form.get('class_idx'))
    print(class_idx)
    print(type(class_idx))

    lec_day = request.form.get('lec_day_arr')
    lec_start_time = request.form.get('lec_start_time_arr')
    lec_end_time = request.form.get('lec_end_time_arr')
    again_yn = request.form.get('again_yn_arr')
    print("lec_day", lec_day)
    print("lec_start_time", lec_start_time)
    print("lec_end_time", lec_end_time)
    print("again_yn", again_yn)

    lec_day_arr = lec_day.split(',')
    lec_start_time_arr = lec_start_time.split(',')
    lec_end_time_arr = lec_end_time.split(',')
    again_yn_arr = again_yn.split(',')

    print("lec_day_arr", lec_day_arr)
    print("lec_start_time_arr", lec_start_time_arr)
    print("lec_end_time_arr", lec_end_time_arr)
    print("again_yn_arr", again_yn_arr)

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    class_insert_sql = " update st_class_info set  " \
                       " teacher_idx = %s, class_nm = %s, subject_idx= %s, class_level_idx= %s, class_limit_student= %s, " \
                       " level_test_yn= %s, level_test_limit= %s, book_idx= %s, tution_fee= %s, class_enrolment_start= %s," \
                       " class_enrolment_end= %s, start_date= %s, end_date= %s, class_desc= %s, status= %s, reg_date= %s," \
                       " lec_day_arr= %s, lec_start_time_arr= %s, lec_end_time_arr= %s, again_yn_arr= %s" \
                       " where idx = %s"

    val = [
        (teacher_info),
        (class_nm),
        (subject_info),
        (level_info),
        (class_limit_student),

        (level_test_yn),
        (level_test_limit),
        (book_info),
        (tution_fee),
        (class_enrolment_start),

        (class_enrolment_end),
        (start_date),
        (end_date),
        (class_desc),
        ("1"),

        (now_date),
        (lec_day),
        (lec_start_time),
        (lec_end_time),
        (again_yn),
        (class_idx)
    ]

    cursor.execute(class_insert_sql, val)
    conn.commit()

    delete_lecture_sql = "delete from st_lecture_info where class_idx ="+str(class_idx)
    cursor.execute(delete_lecture_sql)
    conn.commit()

    for i in range(len(lec_day_arr)):
        lec_day = datetime.strptime(lec_day_arr[i], "%Y-%m-%d")
        print(lec_day)
        print(type(lec_day))
        print(end_date)
        print(type(end_date))
        if again_yn_arr[i] == "true":
            while lec_day <= end_date:
                if lec_day > end_date:
                    break
                lec_time_save_sql = "insert into st_lecture_info" \
                                    "(class_idx, lecture_day, lecture_start_time, lecture_end_time, insert_date) values " \
                                    "(%s, %s, %s, %s, %s)"
                val1 = [
                    (class_idx),
                    (lec_day),
                    (lec_start_time_arr[i]),
                    (lec_end_time_arr[i]),
                    (now_date)
                ]
                cursor.execute(lec_time_save_sql, val1)
                conn.commit()

                lec_day = lec_day + timedelta(days=7)

        else:
            lec_time_save_sql = "insert into st_lecture_info" \
                                "(class_idx, lecture_day, lecture_start_time, lecture_end_time, insert_date) values " \
                                "(%s, %s, %s, %s, %s)"
            val1 = [
                (class_idx),
                (lec_day),
                (lec_start_time_arr[i]),
                (lec_end_time_arr[i]),
                (now_date)
            ]
            cursor.execute(lec_time_save_sql, val1)
            conn.commit()

    cursor.close()
    conn.close()

    return jsonify(result = "success")

@class_info.route('class_info_close', methods=['GET', 'POST'])
def class_info_close():
    data = request.get_json()
    class_idx = data.get('class_idx')

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    class_close_sql = " update st_class_info " \
                      " set status = '0'" \
                      " where idx = "+str(class_idx)

    cursor.execute(class_close_sql)
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify(result = "success")

@class_info.route('class_info_attach_create', methods=['GET', 'POST'])
def class_info_attach_create():
    data = request.get_json()
    teacher_idx = data.get('teacher_idx')

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    teacher_del_sql = " update st_class_info " \
                      " set belong_yn = '0'" \
                      " where idx = "+str(teacher_idx)

    cursor.execute(teacher_del_sql)
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify(result = "success")
