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

student_info = Blueprint("student_info", __name__, url_prefix="/student_info")

# 회사 서버올릴때
dbhost = config.dbhost
userid = config.userid
userpw = config.userpw
dbnm = config.dbnm
port = config.port

ALLOWED_EXTENSIONS = config.ALLOWED_EXTENSIONS
UPLOAD_FOLDER = config.ACADEMY_UPLOAD_FOLDER

now = datetime.now()

@student_info.route("/student_info_normal", methods=['GET', 'POST'])
def student_info_normal():
    return render_template('/student_info/student_info.html')

@student_info.route("/student_info_predetail", methods=['GET', 'POST'])
def student_info_predetail():
    student_idx = request.args.get('student_idx')
    child_idx = request.args.get('child_idx')
    return render_template('/student_info/student_info_detail.html', student_idx=student_idx, child_idx=child_idx)

@student_info.route("/student_info_mod_ready", methods=['GET', 'POST'])
def student_info_mod_ready():
    student_idx = request.args.get('student_idx')
    return render_template('/student_info/student_info_mod.html', student_idx=student_idx)

@student_info.route("/student_info_create_ready", methods=['GET', 'POST'])
def student_info_create_ready():
    return render_template('/student_info/student_info_create.html')

@student_info.route("student_admission", methods=['GET', 'POST'])
def student_admission():
    now_date = now.strftime('%Y%m%d%H%M%S')
    data = request.get_json()
    chk_arr = data.get('chk_arr')
    belong_idx = data.get('belong_idx')
    print(chk_arr)
    print(type(chk_arr))

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    for i in range (0, len(chk_arr)):

        ma_belong_update = "update ma_belong set belong_yn=1, reg_date=%s where idx = %s"
        val =[now_date, (chk_arr[i])]
        cursor.execute(ma_belong_update, val)
        conn.commit()

        select_child_idx = "select child_idx from ma_belong where idx = %s"
        val2 =[(chk_arr[i])]
        cursor.execute(select_child_idx, val2)
        child_idx = cursor.fetchall()[0]

        select_sign_child_idx = "select idx from st_sign_up_info where belong_idx = %s and child_idx = %s"
        val4 = [belong_idx, child_idx]
        sign_child_idx = cursor.execute(select_sign_child_idx, val4)
        sign_child_idx = cursor.fetchall()

        if len(sign_child_idx) == 0:
            sign_up_insert = " insert into st_sign_up_info (child_idx, belong_yn, belong_idx, belong_type, level_idx, insert_date) values (%s, %s, %s, %s, %s, %s)"
            val3 = [child_idx, '1', belong_idx, '7', '0', now_date]
            cursor.execute(sign_up_insert, val3)
            conn.commit()
        else:
            sign_up_update = " update st_sign_up_info set belong_yn = %s, reg_date = %s where belong_idx = %s and child_idx = %s"
            val3 = ['1', now_date, belong_idx, child_idx]
            cursor.execute(sign_up_update, val3)
            conn.commit()
    cursor.close()
    conn.close()
    return jsonify(result = "success")

@student_info.route("student_standby", methods=['GET', 'POST'])
def student_standby():
    now_date = now.strftime('%Y%m%d%H%M%S')
    data = request.get_json()
    chk_arr = data.get('chk_arr')
    belong_idx = data.get('belong_idx')
    print(chk_arr)
    print(type(chk_arr))

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    for i in range (0, len(chk_arr)):
        sign_up_update = " update st_sign_up_info set belong_yn = %s, reg_date = %s where idx = %s"
        val3 = ['3', now_date, chk_arr[i]]
        cursor.execute(sign_up_update, val3)
        conn.commit()

        select_child_idx = "select child_idx from st_sign_up_info where idx = %s"
        val2 =[(chk_arr[i])]
        cursor.execute(select_child_idx, val2)
        child_idx = cursor.fetchall()[0]

        ma_belong_update = "update ma_belong set belong_yn= 3, reg_date=%s where child_idx = %s and belong_idx = %s"
        val =[now_date, child_idx, belong_idx]
        cursor.execute(ma_belong_update, val)
        conn.commit()

    cursor.close()
    conn.close()
    return jsonify(result = "success")

@student_info.route("student_out", methods=['GET', 'POST'])
def student_out():
    now_date = now.strftime('%Y%m%d%H%M%S')
    data = request.get_json()
    chk_arr = data.get('chk_arr')
    belong_idx = data.get('belong_idx')
    print(chk_arr)
    print(type(chk_arr))

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    for i in range (0, len(chk_arr)):
        sign_up_update = " update st_sign_up_info set belong_yn = %s, reg_date = %s where idx = %s"
        val3 = ['0', now_date, chk_arr[i]]
        cursor.execute(sign_up_update, val3)
        conn.commit()

        select_child_idx = "select child_idx from st_sign_up_info where idx = %s"
        val2 =[(chk_arr[i])]
        cursor.execute(select_child_idx, val2)
        child_idx = cursor.fetchall()[0]

        ma_belong_update = "update ma_belong set belong_yn= 0, reg_date=%s where child_idx = %s and belong_idx = %s"
        val =[now_date, child_idx, belong_idx]
        cursor.execute(ma_belong_update, val)
        conn.commit()

    cursor.close()
    conn.close()
    return jsonify(result = "success")


@student_info.route("student_readmission", methods=['GET', 'POST'])
def student_readmission():
    now_date = now.strftime('%Y%m%d%H%M%S')
    data = request.get_json()
    chk_arr = data.get('chk_arr')
    belong_idx = data.get('belong_idx')
    print(chk_arr)
    print(type(chk_arr))

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    for i in range (0, len(chk_arr)):
        sign_up_update = " update st_sign_up_info set belong_yn = %s, reg_date = %s where idx = %s"
        val3 = ['1', now_date, chk_arr[i]]
        cursor.execute(sign_up_update, val3)
        conn.commit()

        select_child_idx = "select child_idx from st_sign_up_info where idx = %s"
        val2 =[(chk_arr[i])]
        cursor.execute(select_child_idx, val2)
        child_idx = cursor.fetchall()[0]

        ma_belong_update = "update ma_belong set belong_yn= 1, reg_date=%s where child_idx = %s and belong_idx = %s"
        val =[now_date, child_idx, belong_idx]
        cursor.execute(ma_belong_update, val)
        conn.commit()

    cursor.close()
    conn.close()
    return jsonify(result = "success")

@student_info.route("/student_info_detail", methods=['GET', 'POST'])
def student_info_detail():
    data = request.get_json()
    student_idx = data.get('student_idx')
    child_idx = data.get('child_idx')
    print(student_idx)
    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    student_info_detail_sql = " select ssui.idx, mc.child_nm, "\
                              " (select level_nm from st_sign_up_info ssui, st_level_info sli " \
                              " where ssui.level_idx = sli.idx and ssui.idx = "+str(student_idx)+") as level_nm, " \
                              " mc.email, mc.tel_number, mc.child_picture, ssui.level_idx, mi.tel_number, mi.idx " \
                              " from st_sign_up_info ssui, ma_child mc, member_info mi   " \
                              " where ssui.child_idx = mc.idx " \
                              " and mc.parents_idx = mi.idx " \
                              " and ssui.idx = "+str(student_idx)+""
    
    student_info_detail_sql = cursor.execute(student_info_detail_sql)
    student_info_detail_sql = cursor.fetchall()

    idx = student_info_detail_sql[0][0]
    child_nm = student_info_detail_sql[0][1]
    level_nm = student_info_detail_sql[0][2]
    email = student_info_detail_sql[0][3]
    tel_number = student_info_detail_sql[0][4]
    child_picture = student_info_detail_sql[0][5]
    level_idx = student_info_detail_sql[0][6]
    p_tel_number = student_info_detail_sql[0][7]
    p_idx = student_info_detail_sql[0][8]

    data['idx'] = idx
    data['child_nm'] = child_nm
    data['level_nm'] = level_nm
    data['level_idx'] = level_idx
    data['email'] = email
    data['tel_number'] = tel_number
    data['child_picture'] = child_picture
    data['p_tel_number'] = p_tel_number
    data['p_idx'] = p_idx
    
    lecture_list_sql="select sci.idx, sci.class_nm from st_enrolment_info sei, st_class_info sci "\
                     " where sei.class_idx = sci.idx " \
                     " and sci.status = 1 " \
                     " and sei.status = 1 " \
                     " and sei.child_idx = "+str(child_idx)

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

@student_info.route('/student_info_attendance', methods=['POST','GET'])
def student_info_attendance():
    student_idx = request.args.get('student_idx')
    child_idx = request.args.get('child_idx')
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

    attendance_cnt_sql = " select sum(cnt) from ( " \
                  " select count(sli.idx) as cnt" \
                  " from st_sign_up_info ssui, st_enrolment_info sei, st_class_info sci, st_lecture_info sli, st_attendance_info sai" \
                  " where ssui.child_idx = sei.child_idx" \
                  " and sei.class_idx = sci.idx" \
                  " and sci.idx = sli.class_idx" \
                  " and sli.idx = sai.lecture_idx" \
                  " and sei.child_idx = sai.child_idx" \
                  " and sli.status is null" \
                  " and ssui.belong_yn = 1" \
                  " and sei.status = 1" \
                  " and ssui.child_idx = "+child_idx+"" \
                  " and ssui.belong_idx = "+belong_idx+"" \
                  " UNION ALL" \
                  " select count(sli.idx) as cnt" \
                  " from st_sign_up_info ssui, st_enrolment_info sei, st_class_info sci, st_lecture_info sli" \
                  " where ssui.child_idx = sei.child_idx" \
                  " and sei.class_idx = sci.idx" \
                  " and sci.idx = sli.class_idx" \
                  " and sli.idx not in (select sai2.lecture_idx from st_attendance_info sai2 where child_idx = "+child_idx+")" \
                  " and sli.status is null" \
                  " and ssui.belong_yn = 1" \
                  " and sei.status = 1" \
                  " and ssui.child_idx = "+child_idx+"" \
                  " and ssui.belong_idx = "+belong_idx+") as s"

    cursor.execute(attendance_cnt_sql)
    total = cursor.fetchone()[0]

    attendance_sql = " select ssui.idx, ssui.child_idx, sci.idx, sci.class_nm, date_format(sli.lecture_day, '%%y-%%m-%%d') as lecture_day, '출석', "\
                       "  sai.attendance_in, sai.attendance_out, sai.attendance_yn, sai.homework_yn," \
                       " sai.feedback_total, sai.feedback_study_ready, sai.feedback_lecture_parti, sai.feedback_present, sli.lecture_day, sli.idx, sli.lecture_start_time, sli.lecture_end_time  " \
                       " from st_sign_up_info ssui, st_enrolment_info sei, st_class_info sci, st_lecture_info sli, st_attendance_info sai"\
                       " where ssui.child_idx = sei.child_idx"\
                       " and sei.class_idx = sci.idx"\
                       " and sci.idx = sli.class_idx"\
                       " and sli.idx = sai.lecture_idx"\
                       " and sei.child_idx = sai.child_idx"\
                       " and sli.status is null"\
                       " and ssui.belong_yn = 1"\
                       " and sei.status = 1" \
                       " and sli.lecture_day <= CURRENT_DATE()" \
                       " and ssui.child_idx = "+child_idx+"" \
                       " and ssui.belong_idx = "+belong_idx+""\
                       " UNION ALL"\
                       " select ssui.idx, ssui.child_idx, sci.idx, sci.class_nm, date_format(sli.lecture_day, '%%y-%%m-%%d') as lecture_day, '결석',"\
                       " '_','_','_','_',"\
                       " '_','_','_','_', sli.lecture_day, sli.idx, sli.lecture_start_time, sli.lecture_end_time"\
                       " from st_sign_up_info ssui, st_enrolment_info sei, st_class_info sci, st_lecture_info sli "\
                       " where ssui.child_idx = sei.child_idx"\
                       " and sei.class_idx = sci.idx"\
                       " and sci.idx = sli.class_idx"\
                       " and sli.idx not in (select sai2.lecture_idx from st_attendance_info sai2 where sai2.child_idx = "+child_idx+")"\
                       " and sli.status is null"\
                       " and ssui.belong_yn = 1"\
                       " and sei.status = 1" \
                       " and sli.lecture_day <= CURRENT_DATE()" \
                       " and ssui.child_idx = "+child_idx+"" \
                       " and ssui.belong_idx = "+belong_idx+""\
                       " order by 5 desc"\
                       " limit %s OFFSET %s"

    cursor.execute(attendance_sql, (items_per_page, start_idx))
    posts = cursor.fetchall()
    cursor.close()
    conn.close()

    # Slice the data to get the items for the current page
    paginated_data = posts
    post_cnt = len(paginated_data)
    # Calculate the total number of pages for pagination
    total_pages = total // items_per_page + (1 if total % items_per_page > 0 else 0)

    # Render the HTML template for the data and pagination links
    data_html = render_template('/student_info/student_info_data_attendance.html', data=paginated_data)

    # Generate the HTML for the pagination links


    return jsonify(data=data_html, total=total, page=page, post_cnt=post_cnt)



@student_info.route('/student_info_list_standby', methods=['POST','GET'])
def student_info_list_standby():
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

    standby_sql = "select COUNT(mb.idx) " \
                  " from ma_belong mb, ma_child mc, member_info mi, school_info si2" \
                  " where mb.child_idx = mc.idx" \
                  " and mb.parents_idx = mc.parents_idx" \
                  " and mc.parents_idx = mi.idx" \
                  " and mc.belong_idx = si2.IDX" \
                  " and mb.belong_idx = "+str(belong_idx)+" and mb.belong_yn = 3 and mb.belong_type = 7 "
    cursor.execute(standby_sql)
    total = cursor.fetchone()[0]

    standby_sql_page = " select mb.idx, mc.idx, mc.child_nm, si2.SCHUL_NM, mi.id, mi.tel_number, mb.insert_date "\
                    " from ma_belong mb, ma_child mc, member_info mi, school_info si2" \
                    " where mb.child_idx = mc.idx" \
                    " and mb.parents_idx = mc.parents_idx" \
                    " and mc.parents_idx = mi.idx" \
                    " and mc.belong_idx = si2.IDX" \
                    " and mb.belong_idx = "+str(belong_idx)+" " \
                    " and mb.belong_yn = 3 and mb.belong_type = 7 order by mb.insert_date desc limit %s OFFSET %s"

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
    data_html = render_template('/student_info/student_info_data_standby.html', data=paginated_data)

    # Generate the HTML for the pagination links
    pagination_html = ''.join([
        f'<a href="javascript:void(0);" onclick="loadPage({page}, {belong_idx})" return false;>{page}</a>' for page in range(1, total_pages + 1)
    ])

    return jsonify(data=data_html, pagination=pagination_html, total=total, page=page, post_cnt=post_cnt)


@student_info.route('/student_info_list_student', methods=['POST','GET'])
def student_info_list_student():
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

    standby_sql = "select COUNT(st.idx) " \
                  " from st_sign_up_info st, ma_child mc, school_info si, member_info mi, st_level_info sli " \
                  " where st.child_idx = mc.idx " \
                  " and mc.belong_idx = si.IDX " \
                  " and mc.parents_idx = mi.idx " \
                  " and st.level_idx = sli.idx" \
                  " and st.belong_yn = 1 " \
                  " and st.belong_idx = "+str(belong_idx)+" and st.belong_type = 7 "
    cursor.execute(standby_sql)
    total = cursor.fetchone()[0]

    standby_sql_page = " select st.idx, mc.idx, mc.child_nm, " \
                       " sli.level_nm, " \
                       "  si.SCHUL_NM, mc.tel_number, st.insert_date "\
                       " from st_sign_up_info st, ma_child mc, school_info si, member_info mi, st_level_info sli " \
                       " where st.child_idx = mc.idx " \
                       " and mc.belong_idx = si.IDX " \
                       " and mc.parents_idx = mi.idx " \
                       " and st.level_idx = sli.idx" \
                       " and st.belong_yn = 1 " \
                       " and st.belong_idx = "+str(belong_idx)+" " \
                       " and st.belong_type = 7 order by st.insert_date desc limit %s OFFSET %s"

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
    data_html = render_template('/student_info/student_info_data_student.html', data=paginated_data)

    # Generate the HTML for the pagination links
    pagination_html = ''.join([
        f'<a href="javascript:void(0);" onclick="loadPage({page}, {belong_idx})" return false;>{page}</a>' for page in range(1, total_pages + 1)
    ])

    return jsonify(data=data_html, pagination=pagination_html, total=total, page=page, post_cnt=post_cnt)



@student_info.route('/student_info_list_student2', methods=['POST','GET'])
def student_info_list_student2():
    belong_idx = request.args.get('belong_idx')
    level_idx =  request.args.get('level_idx')

    # Number of items per page
    items_per_page = 9

    # Get the requested page number from the AJAX request
    page = int(request.args.get('page', 1))

    # Calculate the start and end index for slicing the data
    start_idx = (page - 1) * items_per_page
    end_idx = start_idx + items_per_page


    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    standby_sql = "select COUNT(st.idx) " \
                  " from st_sign_up_info st, ma_child mc, school_info si, member_info mi, st_level_info sli " \
                  " where st.child_idx = mc.idx " \
                  " and mc.belong_idx = si.IDX " \
                  " and mc.parents_idx = mi.idx " \
                  " and st.level_idx = sli.idx" \
                  " and st.belong_yn = 1 " \
                  " and st.belong_idx = "+str(belong_idx)+" and sli.idx="+str(level_idx)+" and st.belong_type = 7"
    cursor.execute(standby_sql)
    total = cursor.fetchone()[0]

    standby_sql_page = " select st.idx, mc.idx, mc.child_nm, " \
                       " sli.level_nm, " \
                       "  si.SCHUL_NM, mi.tel_number, st.insert_date " \
                       " from st_sign_up_info st, ma_child mc, school_info si, member_info mi, st_level_info sli " \
                       " where st.child_idx = mc.idx " \
                       " and mc.belong_idx = si.IDX " \
                       " and mc.parents_idx = mi.idx " \
                       " and st.level_idx = sli.idx" \
                       " and st.belong_yn = 1 " \
                       " and st.belong_idx = "+str(belong_idx)+" and sli.idx="+str(level_idx)+"" \
                       " and st.belong_type = 7 order by st.insert_date desc limit %s OFFSET %s"

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
    data_html = render_template('/student_info/student_info_data_student2.html', data=paginated_data)

    # Generate the HTML for the pagination links
    pagination_html = ''.join([
        f'<a href="javascript:void(0);" onclick="loadPage({page}, {belong_idx})" return false;>{page}</a>' for page in range(1, total_pages + 1)
    ])

    return jsonify(data=data_html, pagination=pagination_html, total=total, page=page, post_cnt=post_cnt)

@student_info.route('/student_info_list_out', methods=['POST','GET'])
def student_info_list_out():
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

    standby_sql = "select COUNT(idx) from st_sign_up_info where belong_yn = 0 and belong_idx = "+belong_idx
    cursor.execute(standby_sql)
    total = cursor.fetchone()[0]

    standby_sql_page = " select st.idx, mc.idx, mc.child_nm, " \
                       " sli.level_nm, " \
                       "  si.SCHUL_NM, mc.tel_number, st.insert_date " \
                       " from st_sign_up_info st, ma_child mc, school_info si, member_info mi, st_level_info sli " \
                       " where st.child_idx = mc.idx " \
                       " and mc.belong_idx = si.IDX " \
                       " and mc.parents_idx = mi.idx " \
                       " and st.level_idx = sli.idx" \
                       " and st.belong_yn = 1 " \
                       " and st.belong_idx = "+str(belong_idx)+" " \
                       " and st.belong_type = 7 order by st.insert_date desc limit %s OFFSET %s"

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
    data_html = render_template('/student_info/student_info_data_out.html', data=paginated_data)

    # Generate the HTML for the pagination links
    pagination_html = ''.join([
        f'<a href="javascript:void(0);" onclick="loadPage({page}, {belong_idx})" return false;>{page}</a>' for page in range(1, total_pages + 1)
    ])

    return jsonify(data=data_html, pagination=pagination_html, total=total, page=page, post_cnt=post_cnt)


@student_info.route('student_attach_mod', methods=['POST'])
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

    filename = secure_filename(file.filename)
    now_date = str(now_date)
    new_filename = now_date+"_"+filename

    academy_info_upload_folder = UPLOAD_FOLDER+"student_info/"

    file.save(os.path.join(academy_info_upload_folder, new_filename))

    attach_update_sql = "update ma_child " \
                        " set child_picture = '"+new_filename+"' " \
                        " where idx = "+str(child_idx)

    cursor.execute(attach_update_sql)
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify(result = "success")


@student_info.route('student_mod_save', methods=['POST'])
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

@student_info.route('student_info_del', methods=['GET', 'POST'])
def student_info_del():
    data = request.get_json()
    teacher_idx = data.get('teacher_idx')

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    teacher_del_sql = " update st_student_info " \
                      " set delete_yn = '0'" \
                      " where idx = "+str(teacher_idx)

    cursor.execute(teacher_del_sql)
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify(result = "success")

@student_info.route('student_info_attach_create', methods=['GET', 'POST'])
def student_info_attach_create():
    data = request.get_json()
    teacher_idx = data.get('teacher_idx')

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    teacher_del_sql = " update st_student_info " \
                      " set belong_yn = '0'" \
                      " where idx = "+str(teacher_idx)

    cursor.execute(teacher_del_sql)
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify(result = "success")

@student_info.route('level_info', methods=['GET', 'POST'])
def level_info():
    data = request.get_json()
    belong_idx = data.get('belong_idx')

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    teacher_del_sql = " select idx, level_nm, belong_idx from st_level_info where belong_idx = "+str(belong_idx)+" and belong_type = '7'"

    select_sql = cursor.execute(teacher_del_sql)
    select_sql = cursor.fetchall()

    count = 0
    for i in select_sql:
        count += 1
        idx = i[0]
        level_nm = i[1]
        belong_idx = i[2]

        strcount = str(count)
        data['idx_'+strcount] = idx
        data['level_nm_'+strcount] = level_nm
        data['belong_idx_'+strcount] = belong_idx

    data['id_counter'] = count
    cursor.close()
    conn.close()

    return jsonify(result = "success", result2=data)

@student_info.route('homework_expected_info', methods=['GET', 'POST'])
def homework_expected_info():
    data = request.get_json()
    belong_idx = data.get('belong_idx')
    child_idx = data.get('child_idx')

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    lecture_expected_sql = " select sli.idx, sci.idx, sli.lecture_day, sli.lecture_start_time, sli.lecture_end_time, sci.class_nm, shi.homework_title, shi.start_date, shi.end_date, shi.homework_type "\
                           " from st_homework_info shi, st_lecture_info sli, st_class_info sci, st_enrolment_info sei " \
                           " where shi.lecture_idx = sli.idx " \
                           " and sli.class_idx = sci.idx " \
                           " and sci.idx = sei.class_idx " \
                           " and sci.belong_idx = "+str(belong_idx)+"" \
                           " and sei.child_idx = "+str(child_idx)

    select_sql = cursor.execute(lecture_expected_sql)
    select_sql = cursor.fetchall()

    count = 0
    for i in select_sql:
        count += 1
        lecture_idx = i[0]
        class_idx = i[1]
        lecture_day = i[2]
        if lecture_day:
            lecture_day = lecture_day.strftime('%Y-%m-%d')
        lecture_start_time = str(i[3])
        lecture_end_time = str(i[4])
        class_nm = i[5]
        homework_title = i[6]
        start_date = i[7]
        if start_date:
            start_date = start_date.strftime('%Y-%m-%d')
        end_date = i[8]
        if end_date:
            end_date = end_date.strftime('%Y-%m-%d')
        homework_type = i[9]

        strcount = str(count)
        data['lecture_idx_'+strcount] = lecture_idx
        data['class_idx_'+strcount] = class_idx
        data['lecture_day_'+strcount] = lecture_day
        data['lecture_start_time_'+strcount] = lecture_start_time
        data['lecture_end_time_'+strcount] = lecture_end_time
        data['class_nm_'+strcount] = class_nm
        data['homework_title_'+strcount] = homework_title
        data['start_date_'+strcount] = start_date
        data['end_date_'+strcount] = end_date
        data['homework_type_'+strcount] = homework_type

    data['id_counter'] = count
    cursor.close()
    conn.close()

    return jsonify(result = "success", result2=data)
