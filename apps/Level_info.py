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

level_info = Blueprint("level_info", __name__, url_prefix="/level_info")

# 회사 서버올릴때
dbhost = config.dbhost
userid = config.userid
userpw = config.userpw
dbnm = config.dbnm
port = config.port

ALLOWED_EXTENSIONS = config.ALLOWED_EXTENSIONS
UPLOAD_FOLDER = config.ACADEMY_UPLOAD_FOLDER

now = datetime.now()

@level_info.route("/level_info_normal", methods=['GET', 'POST'])
def level_info_normal():
    return render_template('/level_info/level_info.html')

@level_info.route("/level_info_predetail", methods=['GET', 'POST'])
def level_info_predetail():
    level_idx = request.args.get('level_idx')
    return render_template('/level_info/level_info_detail.html', level_idx=level_idx)

@level_info.route("/level_info_mod_ready", methods=['GET', 'POST'])
def level_info_mod_ready():
    level_idx = request.args.get('level_idx')
    return render_template('/level_info/level_info_mod.html', level_idx=level_idx)

@level_info.route("/level_info_create_ready", methods=['GET', 'POST'])
def level_info_create_ready():
    return render_template('/level_info/level_info_create.html')


@level_info.route('/level_info_list_standby', methods=['POST','GET'])
def level_info_list_standby():
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

    standby_sql = "select COUNT(idx) from st_level_info where belong_type = 7 and belong_idx = "+belong_idx
    cursor.execute(standby_sql)
    total = cursor.fetchone()[0]

    standby_sql_page = " select idx, level_nm, class_level, limit_cnt, status, " \
                       " (select COUNT(ssui.idx) from st_sign_up_info ssui "\
                       " where sli.idx = ssui.level_idx and belong_yn = 1) as student "\
                       " from st_level_info sli " \
                       " where belong_idx = "+str(belong_idx)+" " \
                       " and belong_type = 7  order by insert_date desc limit %s OFFSET %s"

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
    data_html = render_template('/level_info/level_info_data.html', data=paginated_data)

    # Generate the HTML for the pagination links
    pagination_html = ''.join([
        f'<a href="javascript:void(0);" onclick="loadPage({page}, {belong_idx})" return false;>{page}</a>' for page in range(1, total_pages + 1)
    ])

    return jsonify(data=data_html, pagination=pagination_html, total=total, page=page, post_cnt=post_cnt)

@level_info.route("/level_info_detail", methods=['GET', 'POST'])
def level_info_detail():
    data = request.get_json()
    level_idx = data.get('level_idx')
    print(level_idx)
    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    level_info_detail_sql = " select level_nm, class_level, limit_cnt, status, level_desc "\
                            " from st_level_info sli "\
                            " where idx = "+str(level_idx)+""

    print(level_info_detail_sql)

    level_info_detail_sql = cursor.execute(level_info_detail_sql)
    level_info_detail_sql = cursor.fetchall()

    level_nm = level_info_detail_sql[0][0]
    class_level = level_info_detail_sql[0][1]
    limit_cnt = level_info_detail_sql[0][2]
    status = level_info_detail_sql[0][3]
    level_desc = level_info_detail_sql[0][4]

    data['level_nm'] = level_nm
    data['class_level'] = class_level
    data['limit_cnt'] = limit_cnt
    data['status'] = status
    data['level_desc'] = level_desc

    return jsonify(result = "success", result2=data)


@level_info.route("/level_type_trans", methods=['GET', 'POST'])
def level_type_trans():
    data = request.get_json()
    chk_arr = data.get('chk_arr')
    select_type = data.get('select_type')
    belong_idx = data.get('belong_idx')
    print(belong_idx)

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    for i in range(0, len(chk_arr)):
        print(i)
        level_info_detail_sql = " update st_sign_up_info set level_idx="+select_type+" where idx="+str(chk_arr[i])

        print(level_info_detail_sql)

        cursor.execute(level_info_detail_sql)
        conn.commit()

    return jsonify(result = "success", result2=data)


@level_info.route('/level_info_list_student', methods=['POST','GET'])
def level_info_list_student():
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

    standby_sql = "select COUNT(idx) from st_sign_up_info where belong_yn = 1 and belong_idx = "+belong_idx
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
                       " and st.belong_idx = "+str(belong_idx)+" " \
                                                               " and st.belong_type = 7 order by st.insert_date desc limit %s OFFSET %s"
    print("standby_sql_page: ", standby_sql_page)

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
    data_html = render_template('/level_info/level_info_data_student.html', data=paginated_data)

    # Generate the HTML for the pagination links
    pagination_html = ''.join([
        f'<a href="javascript:void(0);" onclick="loadPage({page}, {belong_idx})" return false;>{page}</a>' for page in range(1, total_pages + 1)
    ])

    return jsonify(data=data_html, pagination=pagination_html, total=total, page=page, post_cnt=post_cnt)


@level_info.route('level_mod_save', methods=['POST'])
def level_mod_save():
    now_date = now.strftime('%Y%m%d%H%M%S')
    level_nm = request.form.get('level_nm')
    class_level = request.form.get('class_level')
    limit_cnt = request.form.get('limit_cnt')
    status = request.form.get('status')
    level_desc = request.form.get('level_desc')

    level_idx = request.form.get('level_idx')

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    sign_up_update_sql = " update st_level_info " \
                         " set level_nm = %s, class_level = %s, limit_cnt = %s, status = %s, level_desc = %s, reg_date = %s" \
                         " where idx =  %s"

    val = [
        (level_nm),
        (class_level),
        (limit_cnt),
        (status),
        (level_desc),
        (now_date),
        (level_idx)
    ]

    cursor.execute(sign_up_update_sql, val)
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify(result = "success")

@level_info.route('level_info_del', methods=['GET', 'POST'])
def level_info_del():
    data = request.get_json()
    teacher_idx = data.get('teacher_idx')

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    teacher_del_sql = " update st_level_info " \
                      " set delete_yn = '0'" \
                      " where idx = "+str(teacher_idx)

    cursor.execute(teacher_del_sql)
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify(result = "success")

@level_info.route('level_info_create', methods=['GET', 'POST'])
def level_info_create():
    now_date = now.strftime('%Y%m%d%H%M%S')
    level_nm = request.form.get('level_nm')
    class_level = request.form.get('class_level')
    limit_cnt = request.form.get('limit_cnt')
    status = request.form.get('status')
    level_desc = request.form.get('level_desc')
    belong_idx = request.form.get('belong_idx')

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    sign_up_insert_sql = " insert into st_level_info (belong_idx, belong_type, level_nm, class_level, level_desc, limit_cnt, status, insert_date) values (%s, %s, %s, %s, %s, %s, %s, %s)"

    val = [
        (belong_idx),
        ("7"),
        (level_nm),
        (class_level),
        (level_desc),
        (limit_cnt),
        (status),
        (now_date)
    ]

    cursor.execute(sign_up_insert_sql, val)
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify(result = "success")

