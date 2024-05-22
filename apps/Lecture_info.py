from flask import Blueprint, render_template, jsonify, request
import pymysql
from datetime import datetime, timedelta
from werkzeug.utils import secure_filename
import config
import os

lecture_info = Blueprint("lecture_info", __name__, url_prefix="/lecture_info")

# 회사 서버올릴때
dbhost = config.dbhost
userid = config.userid
userpw = config.userpw
dbnm = config.dbnm
port = config.port

ALLOWED_EXTENSIONS = config.LECTURE_ALLOWED_EXTENSIONS
UPLOAD_FOLDER = config.LECTURE_UPLOAD_FOLDER

now = datetime.now()

@lecture_info.route("/lecture_info_normal", methods=['GET', 'POST'])
def lecture_info_normal():
    return render_template('/lecture_info/lecture_info.html')

@lecture_info.route("/lecture_info_predetail", methods=['GET', 'POST'])
def lecture_info_predetail():
    lecture_idx = request.args.get('lecture_idx')
    class_idx = request.args.get('class_idx')
    lecture_day = request.args.get('lecture_day')
    lecture_start_time = request.args.get('lecture_start_time')
    lecture_end_time = request.args.get('lecture_end_time')
    class_nm = request.args.get('class_nm')

    return render_template('/lecture_info/lecture_info_detail.html', lecture_idx=lecture_idx, class_idx=class_idx, lecture_day=lecture_day, lecture_start_time=lecture_start_time, lecture_end_time=lecture_end_time, class_nm=class_nm)

@lecture_info.route("/lecture_info_mod_ready", methods=['GET', 'POST'])
def lecture_info_mod_ready():
    lecture_idx = request.args.get('lecture_idx')
    return render_template('/lecture_info/lecture_info_mod.html', lecture_idx=lecture_idx)

@lecture_info.route("/lecture_info_create_ready", methods=['GET', 'POST'])
def lecture_info_create_ready():
    return render_template('/lecture_info/lecture_info_create.html')

@lecture_info.route("/lecture_info_detail", methods=['GET', 'POST'])
def lecture_info_detail():
    data = request.get_json()
    lecture_idx = data.get('lecture_idx')

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    # 강의 내용
    lecture_info_detail_sql = "select sli.idx, sli.lecture_day, sli.lecture_start_time, sli.lecture_end_time, sli.lecture_desc "\
                              " from st_lecture_info sli " \
                              " where sli.idx = "+str(lecture_idx)

    lecture_info_detail_sql = cursor.execute(lecture_info_detail_sql)
    lecture_info_detail_sql = cursor.fetchall()

    print(lecture_info_detail_sql)

    lecture_idx = lecture_info_detail_sql[0][0]
    lecture_day = lecture_info_detail_sql[0][1]
    if lecture_day:
        lecture_day = lecture_day.strftime('%Y-%m-%d')
    lecture_start_time = str(lecture_info_detail_sql[0][2])
    lecture_end_time = str(lecture_info_detail_sql[0][3])
    lecture_desc = lecture_info_detail_sql[0][4]

    data['lecture_idx'] = lecture_idx
    data['lecture_day'] = lecture_day
    data['lecture_start_time'] = lecture_start_time
    data['lecture_end_time'] = lecture_end_time
    data['lecture_desc'] = lecture_desc

    # 강의 첨부파일
    lecture_info_attach_sql = "select sli.idx, sli.attach_path " \
                              " from st_lecture_attach sli " \
                              " where sli.lecture_idx = "+str(lecture_idx)+" and status = '1'"

    lecture_info_attach_sql = cursor.execute(lecture_info_attach_sql)
    lecture_info_attach_sql = cursor.fetchall()
    count = 0
    for i in lecture_info_attach_sql:
        count +=1

        attach_idx = i[0]
        attach_path = i[1]

        strcount = str(count)

        data['attach_idx_'+strcount] = attach_idx
        data['attach_path_'+strcount] = attach_path
    data['id_counter'] = count

    homework_info_detail_sql = "select idx, homework_title, homework_detail, start_date, end_date " \
                              " from st_homework_info " \
                              " where lecture_idx = "+str(lecture_idx)+" and homework_type = '1'"

    homework_info_detail_sql = cursor.execute(homework_info_detail_sql)
    homework_info_detail_sql = cursor.fetchall()

    if len(homework_info_detail_sql) > 0:
        homework_idx = homework_info_detail_sql[0][0]
        homework_title = homework_info_detail_sql[0][1]
        homework_detail = homework_info_detail_sql[0][2]
        homework_start_date = homework_info_detail_sql[0][3]
        if homework_start_date:
            homework_start_date = homework_start_date.strftime('%Y-%m-%d')
        homework_end_date = homework_info_detail_sql[0][4]
        if homework_end_date:
            homework_end_date = homework_end_date.strftime('%Y-%m-%d')

        data['homework_idx'] = homework_idx
        data['homework_title'] = homework_title
        data['homework_detail'] = homework_detail
        data['homework_start_date'] = homework_start_date
        data['homework_end_date'] = homework_end_date

    simple_homework_info_detail_sql = "select idx, homework_title, end_date " \
                               " from st_homework_info " \
                               " where lecture_idx = "+str(lecture_idx)+" and homework_type = '0'"

    simple_homework_info_detail_sql = cursor.execute(simple_homework_info_detail_sql)
    simple_homework_info_detail_sql = cursor.fetchall()

    cursor.close()
    conn.close()

    if len(simple_homework_info_detail_sql) > 0:
        sh_count = 0
        for i in simple_homework_info_detail_sql:
            sh_count += 1
            simple_homework_idx = i[0]
            simple_homework_title = i[1]
            simple_homework_end_date = i[2]
            if simple_homework_end_date:
                simple_homework_end_date = simple_homework_end_date.strftime('%Y-%m-%d')

            strcount = str(sh_count)
            data['simple_homework_idx_'+strcount] = simple_homework_idx
            data['simple_homework_title_'+strcount] = simple_homework_title
            data['simple_homework_end_date_'+strcount] = simple_homework_end_date
        data['sh_id_counter'] = sh_count

    return jsonify(result = "success", result2=data)


@lecture_info.route('/lecture_info_list_ready', methods=['POST','GET'])
def lecture_info_list_ready():
    belong_idx = request.args.get('belong_idx')
    class_idx = request.args.get('class_idx')

    if class_idx != "0":
        class_sub_query = " and sli.class_idx = "+str(class_idx)
    else:
        class_sub_query = ""

    # Number of items per page
    items_per_page = 9

    # Get the requested page number from the AJAX request
    page = int(request.args.get('page', 1))

    # Calculate the start and end index for slicing the data
    start_idx = (page - 1) * items_per_page
    end_idx = start_idx + items_per_page


    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    shop_sql = "select COUNT(sci.idx) from st_lecture_info sli, st_class_info sci " \
               " where sli.class_idx = sci.idx " \
               " and sci.status = '1' and lecture_day >= CURDATE() " \
               " and sci.belong_idx = "+str(belong_idx)+" and sci.belong_type = '7' "+class_sub_query+"" \
               " and sci.belong_idx = "+belong_idx

    cursor.execute(shop_sql)
    total = cursor.fetchone()[0]

    shop_sql_page = "select sli.idx as lecture_idx, sci.idx as class_idx, sci.class_nm, sli.lecture_day, sli.lecture_start_time, sli.lecture_end_time " \
                    " from st_lecture_info sli, st_class_info sci "\
                    " where sli.class_idx = sci.idx " \
                    " and sci.status = '1' and lecture_day >= CURDATE() " \
                    " and sci.belong_idx = "+str(belong_idx)+" and sci.belong_type = '7' "+class_sub_query+"" \
                    " order by sli.lecture_day, sli.lecture_start_time limit %s OFFSET %s "

    cursor.execute(shop_sql_page, (items_per_page, start_idx))
    posts = cursor.fetchall()

    cursor.close()
    conn.close()

    # Slice the data to get the items for the current page
    paginated_data = posts
    post_cnt = len(paginated_data)
    # Calculate the total number of pages for pagination
    total_pages = total // items_per_page + (1 if total % items_per_page > 0 else 0)

    today = datetime.today().strftime("%Y-%m-%d")

    # Render the HTML template for the data and pagination links
    data_html = render_template('/lecture_info/lecture_info_data_ready.html', data=paginated_data, today=today)

    # Generate the HTML for the pagination links
    pagination_html = ''.join([
        f'<a href="javascript:void(0);" onclick="loadPage({page}, {belong_idx})" return false;>{page}</a>' for page in range(1, total_pages + 1)
    ])

    return jsonify(data=data_html, pagination=pagination_html, total=total, page=page, post_cnt=post_cnt)


@lecture_info.route('/lecture_info_list_close', methods=['POST','GET'])
def lecture_info_list_close():
    belong_idx = request.args.get('belong_idx')
    class_idx = request.args.get('class_idx')

    if class_idx != "0":
        class_sub_query = " and sli.class_idx = "+str(class_idx)
    else:
        class_sub_query = ""
    # Number of items per page
    items_per_page = 9

    # Get the requested page number from the AJAX request
    page = int(request.args.get('page', 1))

    # Calculate the start and end index for slicing the data
    start_idx = (page - 1) * items_per_page
    end_idx = start_idx + items_per_page


    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    shop_sql = "select COUNT(sci.idx) from st_lecture_info sli, st_class_info sci " \
               " where sli.class_idx = sci.idx " \
               " and sci.status = '1' and lecture_day < CURDATE() " \
               " and sci.belong_idx = "+str(belong_idx)+" and sci.belong_type = '7' "+class_sub_query+"" \
               " and sci.belong_idx = "+belong_idx

    cursor.execute(shop_sql)
    total = cursor.fetchone()[0]

    shop_sql_page = "select sli.idx as lecture_idx, sci.idx as class_idx, sci.class_nm, sli.lecture_day, sli.lecture_start_time, sli.lecture_end_time from st_lecture_info sli, st_class_info sci " \
                    " where sli.class_idx = sci.idx " \
                    " and sci.status = '1' and lecture_day < CURDATE() " \
                    " and sci.belong_idx = "+str(belong_idx)+" and sci.belong_type = '7' "+class_sub_query+"" \
                    " order by sli.lecture_day desc, sli.lecture_start_time limit %s OFFSET %s " \

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
    data_html = render_template('/lecture_info/lecture_info_data_close.html', data=paginated_data)

    # Generate the HTML for the pagination links
    pagination_html = ''.join([
        f'<a href="javascript:void(0);" onclick="loadPage({page}, {belong_idx})" return false;>{page}</a>' for page in range(1, total_pages + 1)
    ])

    return jsonify(data=data_html, pagination=pagination_html, total=total, page=page, post_cnt=post_cnt)


@lecture_info.route('/lecture_info_attendance_y', methods=['POST','GET'])
def lecture_info_attendance_y():
    lecture_idx = request.args.get('lecture_idx')

    # Number of items per page
    items_per_page = 9

    # Get the requested page number from the AJAX request
    page = int(request.args.get('page', 1))

    # Calculate the start and end index for slicing the data
    start_idx = (page - 1) * items_per_page
    end_idx = start_idx + items_per_page


    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    shop_sql = "select COUNT(sei.idx) from st_attendance_info sei, ma_child mc " \
               " where sei.child_idx = mc.idx " \
               " and sei.lecture_idx = "+str(lecture_idx)

    cursor.execute(shop_sql)
    total = cursor.fetchone()[0]

    shop_sql_page = "select mc.idx, mc.child_nm, sei.attendance_in, sei.attendance_out, sei.attendance_yn, sei.homework_yn, sei.idx from st_attendance_info sei, ma_child mc "\
                    " where sei.child_idx = mc.idx " \
                    " and sei.lecture_idx ="+str(lecture_idx)+" " \
                    " and sei.attendance_yn = 1 order by mc.child_nm limit %s OFFSET %s "

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
    data_html = render_template('/lecture_info/lecture_info_data_attendance_y.html', data=paginated_data)

    # Generate the HTML for the pagination links
    pagination_html = ''.join([
        f'<a href="javascript:void(0);" onclick="loadPage({page}, {lecture_idx})" return false;>{page}</a>' for page in range(1, total_pages + 1)
    ])

    return jsonify(data=data_html, pagination=pagination_html, total=total, page=page, post_cnt=post_cnt)


@lecture_info.route('/lecture_info_attendance_n', methods=['POST','GET'])
def lecture_info_attendance_n():
    class_idx = request.args.get('class_idx')
    lecture_idx = request.args.get('lecture_idx')

    # Number of items per page
    items_per_page = 9

    # Get the requested page number from the AJAX request
    page = int(request.args.get('page', 1))

    # Calculate the start and end index for slicing the data
    start_idx = (page - 1) * items_per_page
    end_idx = start_idx + items_per_page


    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    shop_sql = "select COUNT(sei.idx) from st_enrolment_info sei, st_class_info sci, ma_child mc" \
               " where sei.class_idx = sci.idx" \
               " and sei.child_idx = mc.idx" \
               " and sei.class_idx = "+str(class_idx)+ "" \
               " and sei.child_idx not in" \
               " (select sei.child_idx from st_attendance_info sei, ma_child mc" \
               " where sei.child_idx = mc.idx" \
               " and sei.lecture_idx = "+str(lecture_idx)+" and sei.attendance_yn = 1)  "

    cursor.execute(shop_sql)
    total = cursor.fetchone()[0]

    shop_sql_page = "select mc.idx, mc.child_nm, sci.class_nm from st_enrolment_info sei, st_class_info sci, ma_child mc" \
                    " where sei.class_idx = sci.idx" \
                    " and sei.child_idx = mc.idx" \
                    " and sei.class_idx = "+str(class_idx)+"" \
                    " and sei.child_idx not in" \
                    " (select sei.child_idx from st_attendance_info sei, ma_child mc" \
                    " where sei.child_idx = mc.idx" \
                    " and sei.lecture_idx = "+str(lecture_idx)+"" \
                    " and sei.attendance_yn = 1) order by mc.child_nm limit %s OFFSET %s "

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
    data_html = render_template('/lecture_info/lecture_info_data_attendance_n.html', data=paginated_data)

    # Generate the HTML for the pagination links
    pagination_html = ''.join([
        f'<a href="javascript:void(0);" onclick="loadPage({page}, {class_idx})" return false;>{page}</a>' for page in range(1, total_pages + 1)
    ])

    return jsonify(data=data_html, pagination=pagination_html, total=total, page=page, post_cnt=post_cnt)

@lecture_info.route('/lecture_info_attendance_all', methods=['POST','GET'])
def lecture_info_attendance_all():
    class_idx = request.args.get('class_idx')

    # Number of items per page
    items_per_page = 9

    # Get the requested page number from the AJAX request
    page = int(request.args.get('page', 1))

    # Calculate the start and end index for slicing the data
    start_idx = (page - 1) * items_per_page
    end_idx = start_idx + items_per_page

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    shop_sql = "select COUNT(sei.idx) from st_enrolment_info sei, st_class_info sci, ma_child mc " \
               " where sei.class_idx = sci.idx " \
               " and sei.child_idx = mc.idx " \
               " and sci.idx = "+str(class_idx)

    cursor.execute(shop_sql)
    total = cursor.fetchone()[0]

    shop_sql_page = "select mc.idx, mc.child_nm, sci.class_nm from st_enrolment_info sei, st_class_info sci, ma_child mc "\
                    " where sei.class_idx = sci.idx " \
                    " and sei.child_idx = mc.idx " \
                    " and sci.idx = "+str(class_idx)+" " \
                    " order by mc.child_nm limit %s OFFSET %s " \

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
    data_html = render_template('/lecture_info/lecture_info_data_attendance_all.html', data=paginated_data)

    # Generate the HTML for the pagination links
    pagination_html = ''.join([
        f'<a href="javascript:void(0);" onclick="loadPage({page}, {class_idx})" return false;>{page}</a>' for page in range(1, total_pages + 1)
    ])

    return jsonify(data=data_html, pagination=pagination_html, total=total, page=page, post_cnt=post_cnt)



@lecture_info.route('class_list', methods=['GET', 'POST'])
def class_list():
    data = request.get_json()
    belong_idx = data.get('belong_idx')

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    class_list_sql = " select idx, class_nm from st_class_info sci "\
                      " where belong_type = '7' " \
                      " and status = '1' " \
                      " and belong_idx =  "+str(belong_idx)

    class_list_sql = cursor.execute(class_list_sql)
    class_list_sql = cursor.fetchall()

    cursor.close()
    conn.close()

    count = 0

    for i in class_list_sql:
        count +=1
        idx = i[0]
        class_nm = i[1]

        strcount = str(count)

        data['idx_'+strcount] = idx
        data['class_nm_'+strcount] = class_nm

    data['id_counter'] = count

    return jsonify(result = "success", result2=data)

@lecture_info.route('lecture_attach_del', methods=['GET', 'POST'])
def lecture_attach_del():
    data = request.get_json()
    lecture_attach_idx = data.get('lecture_attach_idx')
    print(lecture_attach_idx)


    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    lecture_attach_del_sql = " update st_lecture_attach " \
                      " set status = '0'" \
                      " where idx = "+str(lecture_attach_idx)

    cursor.execute(lecture_attach_del_sql)
    conn.commit()

    cursor.close()
    conn.close()
    return jsonify(result = "success")

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

@lecture_info.route('lecture_attach_add', methods=['GET', 'POST'])
def lecture_attach_add():
    # data = request.get_json()
    now_date = now.strftime('%Y%m%d%H%M%S')
    file = request.files.getlist('file')[0]
    lecture_idx = request.form.get('lecture_idx')
    attach_result = ""
    last_insert_id = ""
    new_filename = ""
    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        now_date = str(now_date)
        new_filename = "lecture_"+lecture_idx+"_"+now_date+"_"+filename

        lecture_attach_upload_folder = UPLOAD_FOLDER

        file.save(os.path.join(lecture_attach_upload_folder, new_filename))
        print(os.path.join(lecture_attach_upload_folder))

        attach_update_sql = "insert into st_lecture_attach (lecture_idx, attach_path, status, insert_date) value (%s, %s, %s, %s) "
        print(attach_update_sql)

        val = [
            (lecture_idx),
            (new_filename),
            ("1"),
            (now_date)
        ]

        cursor.execute(attach_update_sql, val)
        conn.commit()

        last_insert_id_sql = "SELECT LAST_INSERT_ID()"
        last_insert_id_sql = cursor.execute(last_insert_id_sql)
        last_insert_id = cursor.fetchall()[0]
    else:
        attach_result = "fail"

    cursor.close()
    conn.close()

    return jsonify(result = "success", attach_idx=last_insert_id, attach_path=new_filename, result3=attach_result)


@lecture_info.route('lecture_mod_save', methods=['POST'])
def lecture_mod_save():
    now_date = now.strftime('%Y%m%d%H%M%S')
    datetime_format = "%Y-%m-%d"
    lecture_day = request.form.get('lecture_day')
    if lecture_day != "":
        lecture_day = datetime.strptime(lecture_day, datetime_format)
    lecture_start_time = request.form.get('lecture_start_time')
    lecture_end_time = request.form.get('lecture_end_time')
    lecture_desc = request.form.get('lecture_desc')

    simple_homework_arr = request.form.get('simple_homework_arr')
    simple_homework_arr = simple_homework_arr.split(',')

    homework_title = request.form.get('homework_title')
    homework_detail = request.form.get('homework_detail')
    homework_start_date = request.form.get('homework_start_date')
    if homework_start_date != "":
        homework_start_date = datetime.strptime(homework_start_date, datetime_format)
    homework_end_date = request.form.get('homework_end_date')
    if homework_end_date != "":
        homework_end_date = datetime.strptime(homework_end_date, datetime_format)

    lecture_idx = int(request.form.get('lecture_idx'))
    class_idx = request.form.get('class_idx')

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    lecture_update_sql = " update st_lecture_info " \
                         " set lecture_day = %s," \
                         " lecture_start_time = %s," \
                         " lecture_end_time = %s," \
                         " lecture_desc = %s," \
                         " reg_date = %s" \
                         " where idx =  %s"

    val = [
        (lecture_day),
        (lecture_start_time),
        (lecture_end_time),
        (lecture_desc),
        (now_date),
        (lecture_idx)
    ]
    cursor.execute(lecture_update_sql, val)
    conn.commit()

    if homework_title != "":
        select_homework_sql = "select idx from st_homework_info where lecture_idx ="+str(lecture_idx)+" and homework_type = '1'"
        select_homework_sql = cursor.execute(select_homework_sql)
        select_homework_idx = cursor.fetchall()

        if select_homework_sql == 0:
            homework_insert_sql = " insert into st_homework_info " \
                                  " (lecture_idx, homework_title, homework_detail, start_date, end_date, homework_type, insert_date)" \
                                  " values (%s, %s, %s, %s, %s, %s, %s)"
            val = [
                (lecture_idx),
                (homework_title),
                (homework_detail),
                (homework_start_date),
                (homework_end_date),
                ("1"),
                (now_date)
            ]
            cursor.execute(homework_insert_sql, val)
            conn.commit()
        else:
            homework_update_sql = " update st_homework_info " \
                                  " set homework_title = %s," \
                                  " homework_detail = %s," \
                                  " start_date = %s," \
                                  " end_date = %s," \
                                  " homework_type = %s," \
                                  " reg_date = %s" \
                                  " where idx =  %s"
            val = [
                (homework_title),
                (homework_detail),
                (homework_start_date),
                (homework_end_date),
                ("1"),
                (now_date),
                (select_homework_idx)
            ]
            cursor.execute(homework_update_sql, val)
            conn.commit()

    next_lecture_idx = lecture_idx + 1
    select_next_lecture_sql = " select idx, class_idx, lecture_day from st_lecture_info sli"\
                              " where class_idx = "+class_idx+"" \
                              " and idx = "+str(next_lecture_idx)

    select_next_lecture_sql = cursor.execute(select_next_lecture_sql)
    select_next_lecture_sql = cursor.fetchall()

    if select_next_lecture_sql:
        next_lecture_idx = select_next_lecture_sql[0][0]
        next_class_idx = select_next_lecture_sql[0][1]
        next_lecture_day = select_next_lecture_sql[0][2]


    if next_class_idx == int(class_idx):
        delete_homework_sql = "delete from st_homework_info where lecture_idx="+str(lecture_idx)+" and homework_type = '0'"
        cursor.execute(delete_homework_sql)
        conn.commit()

        for i in range(len(simple_homework_arr)):
            insert_homework_sql = " insert into st_homework_info(lecture_idx, homework_title, end_date, homework_type, insert_date)" \
                                  " values (%s, %s, %s, %s, %s)"
            val = [
                (lecture_idx),
                (simple_homework_arr[i]),
                (next_lecture_day),
                ("0"),
                (now_date)
            ]
            cursor.execute(insert_homework_sql, val)
            conn.commit()

    cursor.close()
    conn.close()

    return jsonify(result = "success")


@lecture_info.route("lecture_feedback_save", methods=['GET', 'POST'])
def lecture_feedback_save():
    now_date = now.strftime('%Y%m%d%H%M%S')
    data = request.get_json()

    feedback_ready = data.get('feedback_ready')
    feedback_parti = data.get('feedback_parti')
    feedback_present = data.get('feedback_present')
    feedback_total = data.get('feedback_total')
    chk_arr_attendance = data.get('chk_arr_attendance')

    print(chk_arr_attendance)
    print(type(chk_arr_attendance))

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    for i in range (0, len(chk_arr_attendance)):
        attendance_update = " update st_attendance_info " \
                         " set feedback_total = %s, feedback_study_ready = %s, feedback_lecture_parti = %s, feedback_present = %s, reg_date = %s " \
                         " where idx = %s"

        val = [feedback_total, feedback_ready, feedback_parti, feedback_present, now_date, chk_arr_attendance[i]]
        cursor.execute(attendance_update, val)
        conn.commit()

    cursor.close()
    conn.close()
    return jsonify(result = "success")

@lecture_info.route("lecture_attendance_save", methods=['GET', 'POST'])
def lecture_attendance_save():
    now_date = now.strftime('%Y%m%d%H%M%S')
    data = request.get_json()
    datetime_format = "%Y-%m-%d %H:%M:%S"
    attendance_start_time = data.get('attendance_start_time')
    attendance_start_time = datetime.strptime(attendance_start_time, datetime_format)
    attendance_end_time = data.get('attendance_end_time')
    attendance_end_time = datetime.strptime(attendance_end_time, datetime_format)
    lecture_idx = data.get('lecture_idx')
    chk_arr = data.get('chk_arr')

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    for i in range (0, len(chk_arr)):
        attendance_insert = " insert into " \
                            " st_attendance_info (lecture_idx, child_idx, attendance_in, attendance_out, attendance_yn, insert_date) " \
                            " values (%s,%s,%s,%s,%s,%s)"

        val = [lecture_idx, chk_arr[i], attendance_start_time, attendance_end_time, "1",now_date]
        cursor.execute(attendance_insert, val)
        conn.commit()

    cursor.close()
    conn.close()
    return jsonify(result = "success")

