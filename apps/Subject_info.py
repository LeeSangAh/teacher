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

subject_info = Blueprint("subject_info", __name__, url_prefix="/subject_info")

# 회사 서버올릴때
dbhost = config.dbhost
userid = config.userid
userpw = config.userpw
dbnm = config.dbnm
port = config.port

ALLOWED_EXTENSIONS = config.ALLOWED_EXTENSIONS
UPLOAD_FOLDER = config.ACADEMY_UPLOAD_FOLDER

now = datetime.now()

@subject_info.route("/subject_info_normal", methods=['GET', 'POST'])
def subject_info_normal():
    return render_template('/subject_info/subject_info.html')

@subject_info.route("/subject_info_predetail", methods=['GET', 'POST'])
def subject_info_predetail():
    subject_idx = request.args.get('subject_idx')
    return render_template('/subject_info/subject_info_detail.html', subject_idx=subject_idx)

@subject_info.route("/subject_info_mod_ready", methods=['GET', 'POST'])
def subject_info_mod_ready():
    subject_idx = request.args.get('subject_idx')
    return render_template('/subject_info/subject_info_mod.html', subject_idx=subject_idx)

@subject_info.route("/subject_info_create_ready", methods=['GET', 'POST'])
def subject_info_create_ready():
    return render_template('/subject_info/subject_info_create.html')


@subject_info.route('/subject_info_list', methods=['POST','GET'])
def subject_info_list():
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

    subject_sql = "select COUNT(idx) from st_subject_info where belong_type = 7 and belong_idx = "+belong_idx
    cursor.execute(subject_sql)
    total = cursor.fetchone()[0]

    subject_list_sql_page = " select idx, subject_nm, subject_sub_nm, insert_date from st_subject_info ssi " \
                       " where belong_idx = "+str(belong_idx)+" " \
                       " and belong_type = 7 and status= '1' order by insert_date desc limit %s OFFSET %s"

    cursor.execute(subject_list_sql_page, (items_per_page, start_idx))
    posts = cursor.fetchall()
    cursor.close()
    conn.close()

    # Slice the data to get the items for the current page
    paginated_data = posts
    post_cnt = len(paginated_data)
    # Calculate the total number of pages for pagination
    total_pages = total // items_per_page + (1 if total % items_per_page > 0 else 0)

    # Render the HTML template for the data and pagination links
    data_html = render_template('/subject_info/subject_info_data.html', data=paginated_data)

    # Generate the HTML for the pagination links
    pagination_html = ''.join([
        f'<a href="javascript:void(0);" onclick="loadPage({page}, {belong_idx})" return false;>{page}</a>' for page in range(1, total_pages + 1)
    ])

    return jsonify(data=data_html, pagination=pagination_html, total=total, page=page, post_cnt=post_cnt)

@subject_info.route("/subject_info_detail", methods=['GET', 'POST'])
def subject_info_detail():
    data = request.get_json()
    subject_idx = data.get('subject_idx')
    print(subject_idx)
    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    subject_info_detail_sql = " select idx, subject_nm, subject_sub_nm, subject_desc, insert_date " \
                            " from st_subject_info sli " \
                            " where idx = "+str(subject_idx)+""

    print(subject_info_detail_sql)

    subject_info_detail_sql = cursor.execute(subject_info_detail_sql)
    subject_info_detail_sql = cursor.fetchall()

    idx = subject_info_detail_sql[0][0]
    subject_nm = subject_info_detail_sql[0][1]
    subject_sub_nm = subject_info_detail_sql[0][2]
    subject_desc = subject_info_detail_sql[0][3]
    insert_date = subject_info_detail_sql[0][4]

    data['idx'] = idx
    data['subject_nm'] = subject_nm
    data['subject_sub_nm'] = subject_sub_nm
    data['subject_desc'] = subject_desc
    data['insert_date'] = insert_date

    return jsonify(result = "success", result2=data)



@subject_info.route('subject_mod_save', methods=['POST'])
def subject_mod_save():
    now_date = now.strftime('%Y%m%d%H%M%S')
    subject_nm = request.form.get('subject_nm')
    subject_sub_nm = request.form.get('subject_sub_nm')
    subject_desc = request.form.get('subject_desc')
    subject_idx = request.form.get('subject_idx')

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    subject_update_sql = " update st_subject_info " \
                         " set subject_nm = %s, subject_sub_nm = %s, subject_desc = %s, reg_date = %s" \
                         " where idx =  %s"

    val = [
        (subject_nm),
        (subject_sub_nm),
        (subject_desc),
        (now_date),
        (subject_idx)
    ]

    cursor.execute(subject_update_sql, val)
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify(result = "success")

@subject_info.route('subject_info_del', methods=['GET', 'POST'])
def subject_info_del():
    data = request.get_json()
    subject_idx = data.get('subject_idx')

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    subject_del_sql = " update st_subject_info " \
                      " set status = '0'" \
                      " where idx = "+str(subject_idx)

    cursor.execute(subject_del_sql)
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify(result = "success")

@subject_info.route('subject_info_create', methods=['GET', 'POST'])
def subject_info_create():
    now_date = now.strftime('%Y%m%d%H%M%S')
    subject_nm = request.form.get('subject_nm')
    subject_sub_nm = request.form.get('subject_sub_nm')
    level_desc = request.form.get('subject_desc')
    belong_idx = request.form.get('belong_idx')

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    subject_insert_sql = " insert into st_subject_info (belong_idx, belong_type, subject_nm, subject_sub_nm, subject_desc, status, insert_date) values (%s, %s, %s, %s, %s, %s, %s)"

    val = [
        (belong_idx),
        ("7"),
        (subject_nm),
        (subject_sub_nm),
        (level_desc),
        ("1"),
        (now_date)
    ]

    cursor.execute(subject_insert_sql, val)
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify(result = "success")

