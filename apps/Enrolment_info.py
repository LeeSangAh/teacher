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

enrolment_info = Blueprint("enrolment_info", __name__, url_prefix="/enrolment_info")

# 회사 서버올릴때
dbhost = config.dbhost
userid = config.userid
userpw = config.userpw
dbnm = config.dbnm
port = config.port

ALLOWED_EXTENSIONS = config.ALLOWED_EXTENSIONS
UPLOAD_FOLDER = config.ACADEMY_UPLOAD_FOLDER

now = datetime.now()

@enrolment_info.route("/enrolment_info_normal", methods=['GET', 'POST'])
def enrolment_info_normal():
    return render_template('/enrolment_info/enrolment_info.html')

@enrolment_info.route("/enrolment_info_predetail", methods=['GET', 'POST'])
def enrolment_info_predetail():
    student_idx = request.args.get('student_idx')
    return render_template('/enrolment_info/enrolment_info_detail.html', student_idx=student_idx)

@enrolment_info.route("/enrolment_info_mod_ready", methods=['GET', 'POST'])
def enrolment_info_mod_ready():
    student_idx = request.args.get('student_idx')
    return render_template('/enrolment_info/enrolment_info_mod.html', student_idx=student_idx)

@enrolment_info.route("/enrolment_info_create_ready", methods=['GET', 'POST'])
def enrolment_info_create_ready():
    return render_template('/enrolment_info/enrolment_info_create.html')

@enrolment_info.route("enrolment_status_apply", methods=['GET', 'POST'])
def enrolment_status_apply():
    now_date = now.strftime('%Y%m%d%H%M%S')
    data = request.get_json()
    status = data.get('status')
    chk_arr = data.get('chk_arr')

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    for i in range (0, len(chk_arr)):
        enrolment_update = "update st_enrolment_info set status=%s, reg_date=%s where idx = %s"
        val =[status, now_date, (chk_arr[i])]
        cursor.execute(enrolment_update, val)
        conn.commit()

    cursor.close()
    conn.close()
    return jsonify(result = "success")

@enrolment_info.route('/enrolment_info_list_standby', methods=['POST','GET'])
def enrolment_info_list_standby():
    belong_idx = request.args.get('belong_idx')
    class_select = request.args.get('class_select')
    sub_query = ""
    if class_select == "0":
        sub_query = ""
    else:
        sub_query = "and sei.class_idx ="+class_select
    # Number of items per page
    items_per_page = 9

    # Get the requested page number from the AJAX request
    page = int(request.args.get('page', 1))

    # Calculate the start and end index for slicing the data
    start_idx = (page - 1) * items_per_page
    end_idx = start_idx + items_per_page

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    standby_sql = " select COUNT(sei.idx) " \
                  " from st_enrolment_info sei, " \
                  " ma_child mc, " \
                  " st_class_info sci, st_teacher_info sti " \
                  " where sei.class_idx = sci.idx " \
                  " and sei.child_idx = mc.idx " \
                  " and sci.teacher_idx = sti.idx " \
                  " and sei.status = 3 "+sub_query+"" \
                  " and sci.belong_idx = "+str(belong_idx)+" and sci.belong_type = 7 "
    cursor.execute(standby_sql)
    total = cursor.fetchone()[0]

    standby_sql_page = " select sei.idx, mc.child_nm, sci.class_nm, sti.teacher_name, sei.insert_date, mc.idx as child_idx,  sci.idx as class_idx, sti.idx as teacher_idx " \
                       " from st_enrolment_info sei, " \
                       " ma_child mc, " \
                       " st_class_info sci, st_teacher_info sti " \
                       " where sei.class_idx = sci.idx " \
                       " and sei.child_idx = mc.idx " \
                       " and sci.teacher_idx = sti.idx " \
                       " and sei.status = 3 "+sub_query+"" \
                       " and sci.belong_idx = "+str(belong_idx)+" " \
                       " and sci.belong_type = 7 order by sei.insert_date desc limit %s OFFSET %s"

    cursor.execute(standby_sql_page, (items_per_page, start_idx))
    posts = cursor.fetchall()
    cursor.close()
    conn.close()

    # Slice the data to get the items for the current page
    paginated_data = posts
    post_cnt = len(paginated_data)
    # Calculate the total number of pages for pagination
    total_pages = total // items_per_page + (1 if total % items_per_page > 0 else 0)

    # Render the HTML template for the data and pagination links
    data_html = render_template('/enrolment_info/enrolment_info_data_standby.html', data=paginated_data)

    # Generate the HTML for the pagination links
    pagination_html = ''.join([
        f'<a href="javascript:void(0);" onclick="loadPage({page}, {belong_idx})" return false;>{page}</a>' for page in range(1, total_pages + 1)
    ])
    return jsonify(data=data_html, pagination=pagination_html, total=total, page=page, post_cnt=post_cnt)


@enrolment_info.route('/enrolment_info_list_student', methods=['POST','GET'])
def enrolment_info_list_student():
    belong_idx = request.args.get('belong_idx')
    class_select = request.args.get('class_select')

    sub_query = ""
    if class_select == "0":
        sub_query = ""
    else:
        sub_query = "and sei.class_idx ="+class_select

    # Number of items per page
    items_per_page = 9

    # Get the requested page number from the AJAX request
    page = int(request.args.get('page', 1))

    # Calculate the start and end index for slicing the data
    start_idx = (page - 1) * items_per_page
    end_idx = start_idx + items_per_page


    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    standby_sql = " select COUNT(sei.idx) " \
                  " from st_enrolment_info sei, " \
                  " ma_child mc, " \
                  " st_class_info sci, st_teacher_info sti " \
                  " where sei.class_idx = sci.idx " \
                  " and sei.child_idx = mc.idx " \
                  " and sci.teacher_idx = sti.idx " \
                  " and sei.status = 1 "+sub_query+"" \
                                                   " and sci.belong_idx = "+str(belong_idx)+" and sci.belong_type = 7 "
    cursor.execute(standby_sql)
    total = cursor.fetchone()[0]

    student_sql_page = " select sei.idx, mc.child_nm, sci.class_nm, sti.teacher_name, sei.reg_date, mc.idx as child_idx,  sci.idx as class_idx, sti.idx as teacher_idx " \
                       " from st_enrolment_info sei, " \
                       " ma_child mc, " \
                       " st_class_info sci, st_teacher_info sti " \
                       " where sei.class_idx = sci.idx " \
                       " and sei.child_idx = mc.idx " \
                       " and sci.teacher_idx = sti.idx " \
                       " and sei.status = 1 "+sub_query+"" \
                                                        " and sci.belong_idx = "+str(belong_idx)+" " \
                       " and sci.belong_type = 7 order by sei.insert_date desc limit %s OFFSET %s"

    cursor.execute(student_sql_page, (items_per_page, start_idx))
    posts = cursor.fetchall()
    cursor.close()
    conn.close()

    # Slice the data to get the items for the current page
    paginated_data = posts
    post_cnt = len(paginated_data)
    # Calculate the total number of pages for pagination
    total_pages = total // items_per_page + (1 if total % items_per_page > 0 else 0)

    # Render the HTML template for the data and pagination links
    data_html = render_template('/enrolment_info/enrolment_info_data_student.html', data=paginated_data)

    # Generate the HTML for the pagination links
    pagination_html = ''.join([
        f'<a href="javascript:void(0);" onclick="loadPage({page}, {belong_idx})" return false;>{page}</a>' for page in range(1, total_pages + 1)
    ])

    return jsonify(data=data_html, pagination=pagination_html, total=total, page=page, post_cnt=post_cnt)


@enrolment_info.route('/enrolment_info_list_completion', methods=['POST','GET'])
def enrolment_info_list_completion():
    belong_idx = request.args.get('belong_idx')
    class_select = request.args.get('class_select')
    sub_query = ""
    if class_select == "0":
        sub_query = ""
    else:
        sub_query = "and sei.class_idx ="+class_select
    # Number of items per page
    items_per_page = 9

    # Get the requested page number from the AJAX request
    page = int(request.args.get('page', 1))

    # Calculate the start and end index for slicing the data
    start_idx = (page - 1) * items_per_page
    end_idx = start_idx + items_per_page

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    standby_sql = "select COUNT(sei.idx) " \
                  " from st_enrolment_info sei, " \
                  " ma_child mc, " \
                  " st_class_info sci, st_teacher_info sti " \
                  " where sei.class_idx = sci.idx " \
                  " and sei.child_idx = mc.idx " \
                  " and sci.teacher_idx = sti.idx " \
                  " and sei.status = 0  "+sub_query+"" \
                " and sci.belong_idx = "+str(belong_idx)+" and sci.belong_type = 7 "
    cursor.execute(standby_sql)
    total = cursor.fetchone()[0]

    enrolment_out_sql_page = " select sei.idx, mc.child_nm, sci.class_nm, sti.teacher_name, sei.reg_date, mc.idx as child_idx,  sci.idx as class_idx, sti.idx as teacher_idx " \
                             " from st_enrolment_info sei, " \
                             " ma_child mc, " \
                             " st_class_info sci, st_teacher_info sti " \
                             " where sei.class_idx = sci.idx " \
                             " and sei.child_idx = mc.idx " \
                             " and sci.teacher_idx = sti.idx " \
                             " and sei.status = 0  "+sub_query+"" \
                               " and sci.belong_idx = "+str(belong_idx)+" " \
                             " and sci.belong_type = 7 order by sei.insert_date desc limit %s OFFSET %s"

    cursor.execute(enrolment_out_sql_page, (items_per_page, start_idx))
    posts = cursor.fetchall()
    cursor.close()
    conn.close()

    # Slice the data to get the items for the current page
    paginated_data = posts
    post_cnt = len(paginated_data)
    # Calculate the total number of pages for pagination
    total_pages = total // items_per_page + (1 if total % items_per_page > 0 else 0)

    # Render the HTML template for the data and pagination links
    data_html = render_template('/enrolment_info/enrolment_info_data_completion.html', data=paginated_data)

    # Generate the HTML for the pagination links
    pagination_html = ''.join([
        f'<a href="javascript:void(0);" onclick="loadPage({page}, {belong_idx})" return false;>{page}</a>' for page in range(1, total_pages + 1)
    ])

    return jsonify(data=data_html, pagination=pagination_html, total=total, page=page, post_cnt=post_cnt)


@enrolment_info.route('/enrolment_info_list_out', methods=['POST','GET'])
def enrolment_info_list_out():
    belong_idx = request.args.get('belong_idx')
    class_select = request.args.get('class_select')
    sub_query = ""
    if class_select == "0":
        sub_query = ""
    else:
        sub_query = "and sei.class_idx ="+class_select
    # Number of items per page
    items_per_page = 9

    # Get the requested page number from the AJAX request
    page = int(request.args.get('page', 1))

    # Calculate the start and end index for slicing the data
    start_idx = (page - 1) * items_per_page
    end_idx = start_idx + items_per_page

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    standby_sql = "select COUNT(sei.idx) " \
                  " from st_enrolment_info sei, " \
                  " ma_child mc, " \
                  " st_class_info sci, st_teacher_info sti " \
                  " where sei.class_idx = sci.idx " \
                  " and sei.child_idx = mc.idx " \
                  " and sci.teacher_idx = sti.idx " \
                  " and sei.status = 4 "+sub_query+"" \
                  " and sci.belong_idx = "+str(belong_idx)+" and sci.belong_type = 7 "
    cursor.execute(standby_sql)
    total = cursor.fetchone()[0]

    enrolment_out_sql_page = " select sei.idx, mc.child_nm, sci.class_nm, sti.teacher_name, sei.reg_date, mc.idx as child_idx,  sci.idx as class_idx, sti.idx as teacher_idx " \
                       " from st_enrolment_info sei, " \
                       " ma_child mc, " \
                       " st_class_info sci, st_teacher_info sti " \
                       " where sei.class_idx = sci.idx " \
                       " and sei.child_idx = mc.idx " \
                       " and sci.teacher_idx = sti.idx " \
                       " and sei.status = 4  "+sub_query+"" \
                       " and sci.belong_idx = "+str(belong_idx)+" " \
                       " and sci.belong_type = 7 order by sei.insert_date desc limit %s OFFSET %s"

    cursor.execute(enrolment_out_sql_page, (items_per_page, start_idx))
    posts = cursor.fetchall()
    cursor.close()
    conn.close()

    # Slice the data to get the items for the current page
    paginated_data = posts
    post_cnt = len(paginated_data)
    # Calculate the total number of pages for pagination
    total_pages = total // items_per_page + (1 if total % items_per_page > 0 else 0)

    # Render the HTML template for the data and pagination links
    data_html = render_template('/enrolment_info/enrolment_info_data_out.html', data=paginated_data)

    # Generate the HTML for the pagination links
    pagination_html = ''.join([
        f'<a href="javascript:void(0);" onclick="loadPage({page}, {belong_idx})" return false;>{page}</a>' for page in range(1, total_pages + 1)
    ])

    return jsonify(data=data_html, pagination=pagination_html, total=total, page=page, post_cnt=post_cnt)


@enrolment_info.route('student_attach_mod', methods=['POST'])
def student_attach_mod():
    now_date = now.strftime('%Y%m%d%H%M%S')
    file = request.files.getlist('file')[0]
    student_idx = request.form.get('student_idx')

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    select_child_idx = "select child_idx from st_sign_up_info where idx = %s"
    val2 =[student_idx]
    cursor.execute(select_child_idx, val2)
    child_idx = cursor.fetchall()[0][0]
    print(child_idx)

    filename = secure_filename(file.filename)
    now_date = str(now_date)
    new_filename = now_date+"_"+filename

    academy_info_upload_folder = UPLOAD_FOLDER+"enrolment_info/"

    file.save(os.path.join(academy_info_upload_folder, new_filename))
    print(os.path.join(academy_info_upload_folder))

    attach_update_sql = "update ma_child " \
                        " set child_picture = '"+new_filename+"' " \
                                                              " where idx = "+str(child_idx)
    print(attach_update_sql)

    cursor.execute(attach_update_sql)
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify(result = "success")


@enrolment_info.route('student_mod_save', methods=['POST'])
def student_mod_save():
    now_date = now.strftime('%Y%m%d%H%M%S')
    student_name = request.form.get('student_name')
    level_type = request.form.get('level_type')
    student_email = request.form.get('student_email')
    tel_number = request.form.get('tel_number')
    p_tel_number = request.form.get('p_tel_number')
    p_idx = request.form.get('p_idx')
    student_idx = request.form.get('student_idx')

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    sign_up_update_sql = " update st_sign_up_info " \
                         " set level_idx = %s, reg_date = %s" \
                         " where idx =  %s"

    val = [
        (level_type),
        (now_date),
        (student_idx)
    ]

    cursor.execute(sign_up_update_sql, val)
    conn.commit()

    select_child_idx = "select child_idx from st_sign_up_info where idx = %s"
    val2 =[student_idx]
    cursor.execute(select_child_idx, val2)
    child_idx = cursor.fetchall()[0][0]

    child_update_sql = " update ma_child " \
                       " set child_nm = %s, email = %s, tel_number = %s, reg_date = %s" \
                       " where idx =  %s"

    val3 = [
        (student_name),
        (student_email),
        (tel_number),
        (now_date),
        (child_idx)
    ]
    cursor.execute(child_update_sql, val3)
    conn.commit()

    parents_update_sql = " update member_info " \
                         " set tel_number = %s, reg_date = %s" \
                         " where idx =  %s"

    val4 = [
        (p_tel_number),
        (now_date),
        (p_idx)
    ]
    print(val4)
    cursor.execute(parents_update_sql, val4)
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify(result = "success")

@enrolment_info.route('enrolment_info_del', methods=['GET', 'POST'])
def enrolment_info_del():
    data = request.get_json()
    teacher_idx = data.get('teacher_idx')

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    teacher_del_sql = " update st_enrolment_info " \
                      " set delete_yn = '0'" \
                      " where idx = "+str(teacher_idx)

    cursor.execute(teacher_del_sql)
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify(result = "success")

@enrolment_info.route('enrolment_info_attach_create', methods=['GET', 'POST'])
def enrolment_info_attach_create():
    data = request.get_json()
    teacher_idx = data.get('teacher_idx')

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    teacher_del_sql = " update st_enrolment_info " \
                      " set belong_yn = '0'" \
                      " where idx = "+str(teacher_idx)

    cursor.execute(teacher_del_sql)
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify(result = "success")

@enrolment_info.route('class_list', methods=['GET', 'POST'])
def class_list():
    data = request.get_json()
    belong_idx = data.get('belong_idx')

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    class_sql = " select idx, class_nm, status from st_class_info where belong_idx = "+str(belong_idx)+" and belong_type = '7'"

    class_sql = cursor.execute(class_sql)
    class_sql = cursor.fetchall()

    count = 0
    for i in class_sql:
        count += 1
        idx = i[0]
        class_nm = i[1]
        status = i[2]

        strcount = str(count)
        data['idx_'+strcount] = idx
        data['class_nm_'+strcount] = class_nm
        data['status_'+strcount] = status

    data['id_counter'] = count
    cursor.close()
    conn.close()

    return jsonify(result = "success", result2=data)
