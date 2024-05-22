from flask import Flask, Blueprint, session, render_template, jsonify, request, flash
from geopy.geocoders import Nominatim
import pymysql
import requests
import json
from datetime import datetime
from . import geocoding
from . import cal_polygon
from . import map_info_figure
from . import public_api
import pandas as pd
import math
import config

map_info = Blueprint("map_info", __name__, url_prefix="/map_info")

dbhost = config.dbhost
userid = config.userid
userpw = config.userpw
dbnm = config.dbnm
port = config.port

@map_info.route('/edu_analy_premap', methods = ['GET','POST'])
def edu_analy_premap():
    return render_template('/map_info/edu_analy_map.html')


@map_info.route('/draw', methods = ['GET','POST'])
def draw():
    return render_template('/map_info/Leaflet_Draw.html')

@map_info.route('/asobi', methods = ['GET','POST'])
def asobi():
    return render_template('/map_info/asobi.html')

@map_info.route('/member_info', methods = ['GET','POST'])
def member_info():
    return render_template('/map_info/member.html')

@map_info.route('/results', methods = ['GET','POST'])
def results():
    # lat = 37.577
    # lon = 126.8916
    id_ = session.get('id', None)
    print(id_)
    bjdong2 = request.args.get("bjdong2")
    user_loc_lat = request.args.get("user_loc_lat")
    user_loc_lon = request.args.get("user_loc_lon")

    req_sido = request.args.get("sido", "0")
    req_sigugun = request.args.get("sigungun", "0")
    req_bjdong = request.args.get("bjdong", "0")
    index_search_type = request.args.get("index_search_type", "0")
    category_001 = request.args.get("category_001", "0")
    category_002 = request.args.get("category_002", "0")
    category_003 = request.args.get("category_003", "0")

    search_type = request.args.get("search_type", "0")
    school_type = request.args.get("school_type", "0")
    subject_type = request.args.get("subject_type", "0")
    search = request.args.get("search", "")

    bjdong_cd = ""

    print(req_sigugun)
    print(req_bjdong)

    if id_ :
        conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
        cursor = conn.cursor()

        select_sql = "SELECT id, pw, user_name, select_bjdong, bjdong_cd_01, bjdong_cd_02, bjdong_cd_03, member_type, tel_number FROM member_info where id = '"+id_+"'"
        print(select_sql)
        select_sql = cursor.execute(select_sql)
        select_sql = cursor.fetchall()

        # print("select_sql", select_sql)
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

            if req_bjdong != "0":
                bjdong_cd = req_sigugun+req_bjdong

            if bjdong_cd == "":
                bjdong_cd = bjdong2

            if bjdong_cd:
                conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
                cursor = conn.cursor()

                bjdong_select_sql = "SELECT lat, lon, emd FROM b_num_info where concat(SIGUNGU_NUM, BJDONG_NUM) = '" + bjdong_cd + "'"

                bjdong_select_sql = cursor.execute(bjdong_select_sql)
                bjdong_select_sql = cursor.fetchall()
                cursor.close()
                conn.close()
            else:
                return render_template('/member_info/login.html')

            if len(bjdong_select_sql) != 0 :
                lat = bjdong_select_sql[0][0]
                lon = bjdong_select_sql[0][1]
                emd = bjdong_select_sql[0][2]
                print(emd)
            else:
                flash("법정동 정보가 정확하지 않아 기본 지역으로 이동합니다.")
                lat =  37.577
                lon = 126.8916
        else:
            flash("로그인이 필요합니다.")
            return render_template('/member_info/login.html')

        return render_template('/map_info/hotzone.html', lat = user_loc_lat, lon = user_loc_lon, bjdong_cd = bjdong_cd, bjdong_nm = emd,
                               reqsido=req_sido, req_sigugun=req_sigugun, req_bjdong=req_bjdong,
                               search_type=search_type, school_type=school_type, subject_type=subject_type, search=search,
                               category_001=category_001, category_002=category_002, category_003=category_003, index_search_type=index_search_type)
    else:
        if bjdong2:
            return render_template('/map_info/hotzone.html', bjdong_cd=bjdong2, lat=user_loc_lat, lon=user_loc_lon,
                                   category_001=category_001, category_002=category_002, category_003=category_003, index_search_type=index_search_type)
        else:
            return render_template('/member_info/login.html')

@map_info.route('/select_sido_ajax', methods = ['POST'])
def select_diso_ajax():
    return jsonify(result = "success")

@map_info.route('/loc_info', methods = ['POST'])
def loc_info():
    data = request.get_json()
    lat = str(data.get('center_y'))
    lon = str(data.get('center_x'))
    print(lat, lon)
    bjdong_cd, bjdong_nm, sido_nm = geocoding.get_address3(lat, lon)

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    sido_select_sql = "SELECT sido_num FROM b_num_info where sido = '"+sido_nm+"' LIMIT 1"
    sido_select_sql = cursor.execute(sido_select_sql)
    sido_select_sql = cursor.fetchall()
    conn.close()

    data['sido_cd'] = sido_select_sql[0][0]
    data['bjdong_cd'] = bjdong_cd
    data['bjdong_nm'] = bjdong_nm

    return jsonify(result = "success", result2= data)

# 검색 버튼을 눌렀을 때
@map_info.route('/search_ajax', methods = ['POST'])
def search_ajax():
    id = session.get('id', None)

    sido1 = "서울특별시"
    gugun1 = "마포구"
    search = "상암동"
    result_search = "서울특별시 마포구 상암동"

    lat =  37.577
    lon = 126.8916

    data = request.get_json()
    sido = data.get('sido')
    sigugun = data.get('sigugun')
    dong = data.get('dong')

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    # 행정동 중심으로 찾을 때 썼으나...
    # select_sql = "SELECT COORDI_GEOJSON_H, LAT, LON, heang_num FROM emd_loc_info " \
    #                  " where emd_type = 'H' and heang_num = "+ dong

    select_sql = "SELECT COORDI_GEOJSON_b, LAT, LON, bjdong_num FROM emd_loc_info " \
                 " where emd_type = 'B' and sigungu_num= "+ sigugun +" and bjdong_num = "+ dong

    select_sql = cursor.execute(select_sql)
    select_sql = cursor.fetchall()
    cursor.close()
    conn.close()

    if len(select_sql) != 0 :
        coordi_geojson = select_sql[0][0]
        lat = select_sql[0][1]
        lon = select_sql[0][2]
        # heang_num = select_sql[0][3]
        result_type = 'ok'
    else:
        coordi_geojson = ''
        lat =  37.577
        lon = 126.8916
        result_type = 'fail'

    if len(coordi_geojson) > 0:
        coordi_geojson = eval(coordi_geojson)
        # adm_cd = coordi_geojson['properties']['adm_cd8']
        # adm_cd2 = coordi_geojson['properties']['adm_cd2']
        # adm_cd = heang_num
        # ## print("adm_cd: ", adm_cd)

    coordi_geojson = str(coordi_geojson)
    coordi_geojson = coordi_geojson.replace("'", '"')

    data["bjdong"] = sigugun+dong
    data['coordi_geojson'] = coordi_geojson
    data['lat'] = lat
    data['lon'] = lon
    data['result_type'] = result_type
    return jsonify(result = "success", result2= data)

@map_info.route('/search_area_b_ajax', methods = ['POST'])
def search_area_b_ajax():
    id = session.get('id', None)

    data = request.get_json()
    lat = str(data.get('center_y'))
    lon = str(data.get('center_x'))
    bjdong_chk = data.get('bjdong2')
    bjdong_cd = data.get('bjdong_cd')

    sigugun = bjdong_cd[0:5]
    dong = bjdong_cd[5:10]

    if bjdong_cd != bjdong_chk:
        conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
        cursor = conn.cursor()

        select_sql = "SELECT COORDI_GEOJSON_b FROM emd_loc_info " \
                     " where emd_type = 'B' and sigungu_num= "+ sigugun +" and bjdong_num = "+ dong

        select_sql = cursor.execute(select_sql)
        select_sql = cursor.fetchall()
        cursor.close()
        conn.close()

        if len(select_sql) != 0 :
            coordi_geojson = select_sql[0][0]
            result_type = 'ok'
        else:
            coordi_geojson = ''
            result_type = 'fail'

        if len(coordi_geojson) > 0:
            coordi_geojson = eval(coordi_geojson)

        coordi_geojson = str(coordi_geojson)
        coordi_geojson = coordi_geojson.replace("'", '"')

        data['coordi_geojson'] = coordi_geojson
        data['result_type'] = result_type
        data['bjdong2'] = bjdong_cd
    else:
        data['check'] = 'same_bjdong'

    return jsonify(result = "success", result2= data)

@map_info.route('/search_area_h_ajax', methods = ['POST'])
def search_area_h_ajax():
    data = request.get_json()
    bjdong_chk = data.get('bjdong2')
    bjdong_cd = data.get('bjdong_cd')

    if bjdong_cd != bjdong_chk:
        bjdong_sql = bjdong_trans(bjdong_cd)
        count = 0

        for i in bjdong_sql:
            count += 1
            adm_cd = i[0]
            if adm_cd is not None:
                conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
                cursor = conn.cursor()

                select_sql = "SELECT COORDI_GEOJSON_h FROM emd_loc_info " \
                             " where emd_type = 'H' and heang_num = '"+adm_cd+"'"

                select_sql = cursor.execute(select_sql)
                select_sql = cursor.fetchall()
                cursor.close()
                conn.close()

                if len(select_sql) != 0 :
                    coordi_geojson = select_sql[0][0]

                    if len(coordi_geojson) > 0:
                        coordi_geojson = eval(coordi_geojson)

                    coordi_geojson = str(coordi_geojson)
                    coordi_geojson = coordi_geojson.replace("'", '"')

                    strcount = str(count)
                    # print(strcount)
                    data['coordi_geojson_'+strcount] = coordi_geojson
                else:
                    coordi_geojson = ''
        data['id_counter'] = count
    else:
        data['check'] = 'same_bjdong'

    return jsonify(result = "success", result2= data)


@map_info.route('/sigungu_area_unit', methods = ['POST'])
def sigungu_area_unit():
    data = request.get_json()
    sigungu_cd = data.get('sigungu_cd')
    count = 0
    if sigungu_cd is not None:
        conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
        cursor = conn.cursor()

        select_sql = "select sum(bi2.ho_cnt), ai.use_area, ai.sigungu_nm " \
                     " from building_info bi2, area_info ai " \
                     " where building_type_cd in ('02000') " \
                     " and bi2.sigungu_cd = '"+sigungu_cd+"'" \
                     " and bi2.SIGUNGU_CD = ai.sigungu_cd" \

        select_sql = cursor.execute(select_sql)
        select_sql = cursor.fetchall()
        cursor.close()
        conn.close()

        ho_sum = select_sql[0][0]
        sigungu_user_area = select_sql[0][1]
        sigungu_nm = select_sql[0][2]
        data['ho_sum'] = ho_sum
        data['sigungu_user_area'] = sigungu_user_area
        data['sigungu_nm'] = sigungu_nm
    return jsonify(result = "success", result2= data)


@map_info.route('/sigungu_elstudent_unit', methods = ['POST'])
def sigungu_elstudent_unit():
    data = request.get_json()
    sigungu_cd = data.get('sigungu_cd')
    count = 0
    if sigungu_cd is not None:
        conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
        cursor = conn.cursor()

        select_sql = "select sum(a.SUM_CNT), a.use_area, a.sigungu_nm from (select sc.SUM_CNT, ai.use_area, ai.sigungu_nm " \
                     " from school_info si, student_cnt sc, area_info ai where si.SCHULKNDCODE = 02" \
                     " and si.SCHUL_CODE = sc.SCHUL_CODE" \
                     " and SUBSTRING(si.bjdong, 1, 5) = ai.sigungu_cd" \
                     " and SUBSTRING(si.bjdong, 1, 5) = '"+sigungu_cd+"'" \
                     " group by si.SCHUL_CODE) as a" \

        select_sql = cursor.execute(select_sql)
        select_sql = cursor.fetchall()
        cursor.close()
        conn.close()

        el_sum = select_sql[0][0]
        sigungu_user_area = select_sql[0][1]
        sigungu_nm = select_sql[0][2]
        data['el_sum'] = el_sum
        data['sigungu_user_area'] = sigungu_user_area
        data['sigungu_nm'] = sigungu_nm
    return jsonify(result = "success", result2= data)


@map_info.route('/bjdong_heang', methods = ['POST'])
def bjdong_heang():
    data = request.get_json()
    bjdong = data.get('bjdong')

    pop_sql = pop_info(bjdong)
    print("bjdong: ", bjdong)
    print("pop_sql: ", pop_sql)

    if len(pop_sql) != 0 :
        h_count = 0
        for i in pop_sql:
            h_count += 1
            bjdong = i[0]
            emd = i[1]
            human_cnt_data1 = i[2]
            human_cnt_data2 = i[3]
            human_cnt_data3 = i[4]
            human_cnt_data4 = i[5]
            human_total_cnt = i[6]

            strcount = str(h_count)

            data['emd_'+strcount] = emd
            data['kids_cnt_01_'+strcount] = human_cnt_data1
            data['kids_cnt_02_'+strcount] = human_cnt_data2
            data['kids_cnt_03_'+strcount] = human_cnt_data3
            data['kids_cnt_04_'+strcount] = human_cnt_data4
            data['human_total_cnt_'+strcount] = human_total_cnt
        data['id_counter'] = h_count
    return jsonify(result = "success", result2= data,)

@map_info.route('/bjdong_heang_gg', methods = ['POST'])
def bjdong_heang_gg():
    data = request.get_json()
    bjdong = data.get('bjdong')
    # db에서 법정동과 매칭되는 행정동 리스트 찾아오기
    bjdong_sql = bjdong_trans(bjdong)
    # print("bjdong_sql:", bjdong_sql)
    if len(bjdong_sql) != 0 :
        h_count = 0
        for i in bjdong_sql:
            h_count += 1
            adm_cd = i[0]
            sido = i[1]
            sigungu = i[2]
            emd = i[3]
            if adm_cd is not None :
                year = '2021'
                human_cnt_data1, human_cnt_data2, human_cnt_data3 = public_api.human_cnt(year, adm_cd)
                house_cnt_data = public_api.house_cnt(year, adm_cd)

                if "population" in human_cnt_data1['result'][0]:
                    kid_cnt_01 = human_cnt_data1['result'][0]['population']
                    kid_cnt_02 = human_cnt_data2['result'][0]['population']
                    kid_cnt_03 = human_cnt_data3['result'][0]['population']
                    family_cnt = house_cnt_data['result'][0]['family_member_cnt']
                    avg_family_cnt = house_cnt_data['result'][0]['avg_family_member_cnt']
                    household_cnt = house_cnt_data['result'][0]['household_cnt']
                else:
                    kid_cnt_01 = 0
                    kid_cnt_02 = 0
                    kid_cnt_03 = 0
                    family_cnt = 0
                    avg_family_cnt = 0
                    household_cnt = 0
            else:
                kid_cnt_01 = 0
                kid_cnt_02 = 0
                kid_cnt_03 = 0
                family_cnt = 0
                avg_family_cnt = 0
                household_cnt = 0
            strcount = str(h_count)
            # data['sido_'+strcount] = sido
            # data['sigungu_'+strcount] = sigungu
            data['emd_'+strcount] = emd
            data['kids_cnt_01_'+strcount] = kid_cnt_01
            data['kids_cnt_02_'+strcount] = kid_cnt_02
            data['kids_cnt_03_'+strcount] = kid_cnt_03
            data['family_cnt_'+strcount] = family_cnt
            data['avg_family_cnt_'+strcount] = avg_family_cnt
            data['household_cnt_'+strcount] = household_cnt
        data['id_counter'] = h_count
    return jsonify(result = "success", result2= data,)

def bjdong_trans(bjdong):
    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()
    bjdong_sql = "select heang_num, sido, sigungu, emd from heang_bj_mapping where bjdong = "+bjdong

    bjdong_sql = cursor.execute(bjdong_sql)
    bjdong_sql = cursor.fetchall()
    cursor.close()
    conn.close()
    return bjdong_sql

def pop_info(bjdong):
    sigungu = bjdong[0:5]
    print("pop_info - sigungu: ", sigungu)
    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()
    pop_sql = " select zz.bjdong, pc.emd," \
              " sum(pc.m_cnt_0 + pc.m_cnt_1 + pc.m_cnt_2 + pc.m_cnt_3 + pc.m_cnt_4 + pc.w_cnt_0 + pc.w_cnt_1 + pc.w_cnt_2 + pc.w_cnt_3 + pc.w_cnt_4) as total_cnt_0_4, " \
              " sum(pc.m_cnt_4 + pc.m_cnt_5 + pc.m_cnt_6 + pc.m_cnt_7 + pc.m_cnt_8 + pc.w_cnt_4+ pc.w_cnt_5 + pc.w_cnt_6 + pc.w_cnt_7 + pc.w_cnt_8) as total_cnt_4_8," \
              " sum(pc.m_cnt_7 + pc.m_cnt_8 + pc.m_cnt_9 + pc.m_cnt_10 + pc.m_cnt_11 + pc.m_cnt_12 + pc.w_cnt_7 + pc.w_cnt_8 + pc.w_cnt_9 + pc.w_cnt_10 + pc.w_cnt_11 + pc.w_cnt_12) as total_cnt_7_12," \
              " sum(pc.m_cnt_13 + pc.m_cnt_14 + pc.m_cnt_15 + pc.w_cnt_13 + pc.w_cnt_14 + pc.w_cnt_15) as total_cnt_13_15,  pc.total_sum " \
              " from pop_cnt pc, heang_bj_mapping zz " \
              " where pc.heang_num = zz.heang_num_t1 " \
              " and zz.bjdong = '"+ bjdong + "'" \
              " group by zz.heang_num"

    pop_sql = cursor.execute(pop_sql)
    pop_sql = cursor.fetchall()
    cursor.close()
    conn.close()
    return pop_sql


# 공공데이터 포털을 이용하여 상점 정보 가지고 오는 api
@map_info.route('/shop_info_ajax_gg', methods=['POST'])
def shop_info_ajax_gg():
    data = request.get_json()

    # 공공데이터포털 API 파라미터
    lat = str(data.get('lat')) #위도
    lon = str(data.get('lon')) #경도
    numrow = '200' #한 페이지 결과 수
    radius = '500' #반경입력, (미터, 최대 2000)

    url = public_api.shop_info(numrow, radius, lon, lat)
    # API 요청 보내기
    response = requests.get(url)
    # 응답 파싱
    gg_data = json.loads(response.text)
    # Initialize variables
    gg_data = gg_data['body']['items']
    # ### print(gg_data)
    cnt = len(gg_data)
    count = 0

    for cnt in gg_data:
        count += 1
        shop_brand = cnt['bizesNm']
        ship_cate1 = cnt['indsLclsCd']
        shop_cate3 = cnt['indsMclsNm']
        shop_cate2 = cnt['indsMclsCd']

        lat_cnt = cnt['lat']
        lon_cnt = cnt['lon']

        strcount = str(count)

        data['shop_brand_'+strcount] = shop_brand
        data['shop_cate3_'+strcount] = shop_cate3
        data['shop_cate2_icon_'+strcount] = shop_cate2
        data['shop_cate1_'+strcount] = ship_cate1
        data['lat_'+strcount] = lat_cnt
        data['lon_'+strcount] = lon_cnt

    data['id_counter'] = count

    return jsonify(result = "success", result2= data)


@map_info.route('/shop_info_best_ajax', methods=['POST'])
def shop_info_best_ajax():
    now = datetime.now()
    data = request.get_json()
    bjdong_chk = data.get('bjdong2')
    bjdong_cd = data.get('bjdong_cd')

    if bjdong_cd != bjdong_chk:
        conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
        cursor = conn.cursor()
        shop_sql = "select idx, bizesNm, indsLclsCd, indsMclsCd, indsSclsNm, lat, lon, shop_img, like_cnt from shop_info where ldongCd = "+bjdong_cd+" order by like_cnt desc limit 10;"

        shop_sql = cursor.execute(shop_sql)
        shop_sql = cursor.fetchall()
        cursor.close()
        conn.close()
        now = datetime.now()
        db_end_time = now
        cnt = len(shop_sql)
        count = 0

        for i in shop_sql:
            count += 1
            idx = i[0]
            bizesNm = i[1]
            indsLclsCd = i[2]
            indsMclsCd = i[3]
            indsSclsNm = i[4]
            lat = i[5]
            lon = i[6]
            shop_img = i[7]
            like_cnt = i[8]
            strcount = str(count)
            data['idx_'+strcount] = idx
            data['bizesNm_'+strcount] = bizesNm
            data['indsLclsCd_'+strcount] = indsLclsCd
            data['indsMclsCd_'+strcount] = indsMclsCd
            data['indsSclsNm_'+strcount] = indsSclsNm
            data['lat_'+strcount]  = lat
            data['lon_'+strcount] = lon
            data['shop_img_'+strcount]  = shop_img
            data['like_cnt_'+strcount] = like_cnt
        data['id_counter'] = count
        data['bjdong2'] = bjdong_cd
        now = datetime.now()
        parsing_end_time = now
    else:
        data['check'] = 'same_bjdong'
    return jsonify(result = "success", result2= data)

@map_info.route('/shop_info_ajax', methods=['POST'])
def shop_info_ajax():
    now = datetime.now()
    start_time = now

    data = request.get_json()

    lat = str(data.get('center_y'))
    lon = str(data.get('center_x'))
    bjdong_chk = data.get('bjdong2')
    bjdong_cd = data.get('bjdong_cd')

    if bjdong_cd != bjdong_chk:
        conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
        cursor = conn.cursor()
        shop_sql = "select bizesNm, indsLclsCd, indsMclsCd, indsSclsNm, lat, lon, shop_img from shop_info where ldongCd = "+bjdong_cd+" order by bizesNm "

        shop_sql = cursor.execute(shop_sql)
        shop_sql = cursor.fetchall()
        cursor.close()
        conn.close()
        now = datetime.now()
        db_end_time = now
        cnt = len(shop_sql)
        count = 0
        # print("shop_sql1", shop_sql)
        for i in shop_sql:
            count += 1

            bizesNm = i[0]
            indsLclsCd = i[1]
            indsMclsCd = i[2]
            indsSclsNm = i[3]
            lat = i[4]
            lon = i[5]

            strcount = str(count)

            data['bizesNm_'+strcount] = bizesNm
            data['indsLclsCd_'+strcount] = indsLclsCd
            data['indsMclsCd_'+strcount] = indsMclsCd
            data['indsSclsNm_'+strcount] = indsSclsNm
            data['lat_'+strcount]  = lat
            data['lon_'+strcount] = lon
        data['id_counter'] = count
        data['bjdong2'] = bjdong_cd
        now = datetime.now()
        parsing_end_time = now
    else:
        data['check'] = 'same_bjdong'
    return jsonify(result = "success", result2= data)

@map_info.route('/academy_info_ajax', methods=['POST'])
def academy_info_ajax():
    now = datetime.now()
    start_time = now

    data = request.get_json()

    user_idx = session.get('user_idx')
    bjdong_chk = data.get('bjdong2')
    bjdong_cd = data.get('bjdong_cd')
    # school_type = data.get('school_type')
    # subject_type = data.get('subject_type')
    # search = data.get('search')

    # if school_type != "0":
    #     query_01 = " and school_target="+school_type
    # else:
    #     query_01 = ""
    #
    # if subject_type != "0":
    #     query_02 =  " and subject_target="+subject_type
    # else:
    #     query_02 = ""
    #
    # if search != "":
    #     query_03 =  " and academy_nm like '%"+search+"%'"
    # else:
    #     query_03 = ""

    if bjdong_cd != bjdong_chk:
        conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
        cursor = conn.cursor()
        shop_sql = "select a.academy_nm, a.category_cd, a.category_nm, a.teaching_subject_nm_01, a.teaching_line_nm, " \
                   " a.like_cnt, a.shop_img_01, a.lat, a.lon, a.gubun_nm, a.idx, '0' " \
                   " from academy_info a where bjdong_cd =  "+bjdong_cd

        # print(shop_sql)

        shop_sql = cursor.execute(shop_sql)
        shop_sql = cursor.fetchall()
        cursor.close()
        conn.close()
        now = datetime.now()
        db_end_time = now
        cnt = len(shop_sql)
        count = 0

        for i in shop_sql:
            count += 1

            academy_nm = i[0]
            category_cd = i[1]
            category_nm = i[2]
            teaching_subject_nm_01 = i[3]
            teaching_line_nm = i[4]
            like_cnt = i[5]
            shop_img_01 = i[6]
            lat = i[7]
            lon = i[8]
            gubun_nm = i[9]
            idx = i[10]
            like_yn = i[11]

            strcount = str(count)

            data['academy_nm_'+strcount] = academy_nm
            data['category_cd_'+strcount] = category_cd
            data['category_nm_'+strcount] = category_nm
            data['teaching_subject_nm_01_'+strcount] = teaching_subject_nm_01
            data['teaching_line_nm_'+strcount] = teaching_line_nm
            data['like_cnt_'+strcount] = like_cnt
            data['shop_img_01_'+strcount] = shop_img_01
            data['lat_'+strcount]  = lat
            data['lon_'+strcount] = lon
            data['gubun_nm_'+strcount] = gubun_nm
            data['idx_'+strcount] = idx
            data['like_yn_'+strcount] = like_yn
        data['id_counter'] = count
        data['bjdong2'] = bjdong_cd
        now = datetime.now()
        parsing_end_time = now
    else:
        data['check'] = 'same_bjdong'
    return jsonify(result = "success", result2= data)

@map_info.route('/academy_best_info_ajax', methods=['POST'])
def academy_best_info_ajax():
    now = datetime.now()
    start_time = now

    data = request.get_json()

    lat = str(data.get('center_y'))
    lon = str(data.get('center_x'))
    bjdong_chk = data.get('bjdong2')
    bjdong_cd = data.get('bjdong_cd')

    if bjdong_cd != bjdong_chk:
        conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
        cursor = conn.cursor()
        shop_sql = "select academy_nm, category_cd, category_nm, teaching_subject_nm_01, teaching_line_nm, " \
                   " like_cnt, shop_img_01, lat, lon, gubun_nm, idx " \
                   " from academy_info where bjdong_cd =  "+bjdong_cd+" order by like_cnt desc limit 10"

        shop_sql = cursor.execute(shop_sql)
        shop_sql = cursor.fetchall()
        cursor.close()
        conn.close()
        now = datetime.now()
        db_end_time = now
        cnt = len(shop_sql)
        count = 0
        # print("shop_sql1", shop_sql)
        for i in shop_sql:
            count += 1

            academy_nm = i[0]
            category_cd = i[1]
            category_nm = i[2]
            teaching_subject_nm_01 = i[3]
            teaching_line_nm = i[4]
            like_cnt = i[5]
            shop_img_01 = i[6]
            lat = i[7]
            lon = i[8]
            gubun_nm = i[9]
            idx = i[10]

            strcount = str(count)

            data['academy_nm_'+strcount] = academy_nm
            data['category_cd_'+strcount] = category_cd
            data['category_nm_'+strcount] = category_nm
            data['teaching_subject_nm_01_'+strcount] = teaching_subject_nm_01
            data['teaching_line_nm_'+strcount] = teaching_line_nm
            data['like_cnt_'+strcount] = like_cnt
            data['shop_img_01_'+strcount] = shop_img_01
            data['lat_'+strcount]  = lat
            data['lon_'+strcount] = lon
            data['gubun_nm_'+strcount] = gubun_nm
            data['idx_'+strcount] = idx
        data['id_counter'] = count
        data['bjdong2'] = bjdong_cd
        now = datetime.now()
        parsing_end_time = now
    else:
        data['check'] = 'same_bjdong'
    return jsonify(result = "success", result2= data)

@map_info.route('/shop_info_target_ajax', methods=['POST'])
def shop_info_target_ajax():
    now = datetime.now()
    start_time = now

    data = request.get_json()

    bjdong_chk = data.get('bjdong2')
    bjdong_cd = data.get('bjdong_cd')

    if bjdong_cd != bjdong_chk:
        conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
        cursor = conn.cursor()
        shop_sql = "select bizesNm, indsLclsCd, indsMclsCd, indsSclsNm, lat, lon from shop_info_all_23 " \
                   " where ldongCd = "+bjdong_cd+" and service_priority in (1, 2, 3)"

        shop_sql = cursor.execute(shop_sql)
        shop_sql = cursor.fetchall()
        cursor.close()
        conn.close()
        now = datetime.now()
        db_end_time = now
        cnt = len(shop_sql)
        count = 0
        # print("shop_sql2", shop_sql)
        for i in shop_sql:
            count += 1

            bizesNm = i[0]
            indsLclsCd = i[1]
            indsMclsCd = i[2]
            indsSclsNm = i[3]
            lat = i[4]
            lon = i[5]

            strcount = str(count)

            data['bizesNm_'+strcount] = bizesNm
            data['indsLclsCd_'+strcount] = indsLclsCd
            data['indsMclsCd_'+strcount] = indsMclsCd
            data['indsSclsNm_'+strcount] = indsSclsNm
            data['lat_'+strcount]  = lat
            data['lon_'+strcount] = lon
        data['id_counter'] = count
        data['bjdong2'] = bjdong_cd
        now = datetime.now()
    else:
        data['check'] = 'same_bjdong'
    return jsonify(result = "success", result2= data)


@map_info.route('/shop_info_23', methods=['POST'])
def shop_info_23():
    now = datetime.now()
    start_time = now

    data = request.get_json()

    bjdong_chk = data.get('bjdong2')
    bjdong_cd = data.get('bjdong_cd')

    if bjdong_cd != bjdong_chk:
        conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
        cursor = conn.cursor()
        shop_sql = "select bizesNm, indsLclsCd, indsMclsCd, indsSclsNm, lat, lon from shop_info_all_23 " \
                   " where ldongCd = "+bjdong_cd

        shop_sql = cursor.execute(shop_sql)
        shop_sql = cursor.fetchall()
        cursor.close()
        conn.close()
        now = datetime.now()
        db_end_time = now
        cnt = len(shop_sql)
        count = 0
        # print("shop_sql2", shop_sql)
        for i in shop_sql:
            count += 1

            bizesNm = i[0]
            indsLclsCd = i[1]
            indsMclsCd = i[2]
            indsSclsNm = i[3]
            lat = i[4]
            lon = i[5]

            strcount = str(count)

            data['bizesNm_'+strcount] = bizesNm
            data['indsLclsCd_'+strcount] = indsLclsCd
            data['indsMclsCd_'+strcount] = indsMclsCd
            data['indsSclsNm_'+strcount] = indsSclsNm
            data['lat_'+strcount]  = lat
            data['lon_'+strcount] = lon
        data['id_counter'] = count
        data['bjdong2'] = bjdong_cd
        now = datetime.now()
    else:
        data['check'] = 'same_bjdong'
    return jsonify(result = "success", result2= data)

# 유치원 정보
@map_info.route('/kinder_info', methods=['POST'])
def kinder_info():
    # now = datetime.now()
    # start_time = now
    # ## print("start_time:", start_time)
    data = request.get_json()

    # sido = data.get('sido')
    # sigugun = data.get('sigugun')
    # dong = data.get('dong')
    # lat = str(data.get('center_y'))
    # lon = str(data.get('center_x'))
    bjdong_chk = str(data.get('bjdong2'))
    bjdong_cd = str(data.get('bjdong_cd'))
    # bjdong_cd = geocoding.get_address(lat, lon)
    # # print(bjdong_cd, '=', bjdong_chk)

    if bjdong_cd != bjdong_chk:
        conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
        cursor = conn.cursor()
        kinder_sql = "select kindername, establish, lat, lon, ppcnt3 + ppcnt4 + ppcnt5, ppcnt3, ppcnt4, ppcnt5 " \
                     " from kinder_info " \
                     " where bjdong = '"+ bjdong_cd +"'"

        kinder_sql = cursor.execute(kinder_sql)
        kinder_sql = cursor.fetchall()
        cursor.close()
        conn.close()
        now = datetime.now()
        db_end_time = now
        ### print("db_end_time:", db_end_time)
        cnt = len(kinder_sql)
        count = 0

        for i in kinder_sql:
            count += 1

            kinder_nm = i[0]
            kinder_type = i[1]
            lat = i[2]
            lon = i[3]
            kinder_sum = i[4]
            kinder_cnt_03 = i[5]
            kinder_cnt_04 = i[6]
            kinder_cnt_05 = i[7]

            strcount = str(count)

            data['kinder_nm_'+strcount] = kinder_nm
            data['kinder_type_'+strcount] = kinder_type
            data['lat_'+strcount]  = lat
            data['lon_'+strcount] = lon
            data['kinder_sum_'+strcount] = kinder_sum
            data['kinder_cnt_03_'+strcount] = kinder_cnt_03
            data['kinder_cnt_04_'+strcount] = kinder_cnt_04
            data['kinder_cnt_05_'+strcount] = kinder_cnt_05

        data['id_counter'] = count
        data['bjdong2'] = bjdong_cd
    else:
        data['check'] = 'same_bjdong'
    now = datetime.now()
    parsing_end_time = now
    ### print("parsing_end_time: ", parsing_end_time)
    return jsonify(result = "success", result2= data)

# 초등학교 정보
@map_info.route('/el_school_info', methods=['POST'])
def el_school_info():
    data = request.get_json()

    # sido1 = data.get('sido1')
    # if sido1 == "시/도 선택":
    #     sido1 = ""
    # gugun1 = data.get('gugun1')
    # result_search = sido1+gugun1
    data = request.get_json()
    # sido = data.get('sido')
    # sigugun = data.get('sigugun')
    # dong = data.get('dong')
    # lat = str(data.get('center_y'))
    # lon = str(data.get('center_x'))
    bjdong_chk = str(data.get('bjdong2'))
    bjdong_cd = str(data.get('bjdong_cd'))
    # bjdong_cd = geocoding.get_address(lat, lon)
    if bjdong_cd != bjdong_chk:
        conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
        cursor = conn.cursor()
        select_sql = "select si.SCHUL_NM, si.LTTUD, si.LGTUD, sc.SUM_CNT, " \
                     "sc.COL_M1_E+sc.COL_W1_E as '1학년', " \
                     "sc.COL_M2_E+sc.COL_W2_E as '2학년'," \
                     "sc.COL_M3_E+sc.COL_W3_E as '3학년'," \
                     "sc.COL_M4_E+sc.COL_W4_E as '4학년'," \
                     "sc.COL_M5_E+sc.COL_W5_E as '5학년', " \
                     "sc.COL_M6_E+sc.COL_W6_E as '6학년'," \
                     "sc.COL_M6_E+sc.COL_W7_E as '특수'," \
                     "sc.COL_M6_E+sc.COL_W8_E as '순회'" \
                     " from school_info si, student_cnt sc " \
                     " where si.SCHULKNDCODE = '02'" \
                     " and si.adrcd_cd = '"+bjdong_cd+"' and si.SCHUL_CODE = sc.SCHUL_CODE group by si.SCHUL_CODE order by si.SCHUL_NM"
        select_sql = cursor.execute(select_sql)
        select_sql = cursor.fetchall()
        cursor.close()
        conn.close()

        cnt = len(select_sql)
        count = 0
        for i in select_sql:
            count += 1

            school_nm = i[0]
            lat = i[1]
            lon = i[2]
            school_cnt = i[3]
            school_cnt_01 = i[4]
            school_cnt_02 = i[5]
            school_cnt_03 = i[6]
            school_cnt_04 = i[7]
            school_cnt_05 = i[8]
            school_cnt_06 = i[9]

            strcount = str(count)

            data['school_nm_'+strcount] = school_nm
            data['lat_'+strcount]  = lat
            data['lon_'+strcount] = lon
            data['school_cnt_'+strcount] = school_cnt
            data['school_cnt_01'+strcount] = school_cnt_01
            data['school_cnt_02'+strcount] = school_cnt_02
            data['school_cnt_03'+strcount] = school_cnt_03
            data['school_cnt_04'+strcount] = school_cnt_04
            data['school_cnt_05'+strcount] = school_cnt_05
            data['school_cnt_06'+strcount] = school_cnt_06

        data['id_counter'] = count
        data['bjdong2'] = bjdong_cd
    else:
        data['check'] = 'same_bjdong'
    return jsonify(result = "success", result2= data)

# 중학교 정보
@map_info.route('/mi_school_info', methods=['POST'])
def mi_school_info():
    data = request.get_json()


    # sido1 = data.get('sido1')
    # if sido1 == "시/도 선택":
    #     sido1 = ""
    # gugun1 = data.get('gugun1')
    # result_search = sido1+gugun1
    data = request.get_json()
    # sido = data.get('sido')
    # sigugun = data.get('sigugun')
    # dong = data.get('dong')
    # lat = str(data.get('center_y'))
    # lon = str(data.get('center_x'))
    bjdong_chk = str(data.get('bjdong2'))
    bjdong_cd = str(data.get('bjdong_cd'))

    # bjdong_cd = geocoding.get_address(lat, lon)
    if bjdong_cd != bjdong_chk:

        conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
        cursor = conn.cursor()
        select_sql = "select si.SCHUL_NM, si.LTTUD, si.LGTUD, sc.SUM_CNT, " \
                     "sc.COL_M1_E+sc.COL_W1_E as '1학년', " \
                     "sc.COL_M2_E+sc.COL_W2_E as '2학년'," \
                     "sc.COL_M3_E+sc.COL_W3_E as '3학년' " \
                     " from school_info si, student_cnt sc " \
                     " where si.SCHULKNDCODE = '03'" \
                     " and si.adrcd_cd = '"+bjdong_cd+"' and si.SCHUL_CODE = sc.SCHUL_CODE group by si.SCHUL_CODE order by si.SCHUL_NM"

        select_sql = cursor.execute(select_sql)
        select_sql = cursor.fetchall()
        cursor.close()
        conn.close()

        cnt = len(select_sql)
        count = 0

        for i in select_sql:
            count += 1

            school_nm = i[0]
            lat = i[1]
            lon = i[2]
            school_cnt = i[3]
            school_cnt_01 = i[4]
            school_cnt_02 = i[5]
            school_cnt_03 = i[6]

            strcount = str(count)

            data['school_nm_'+strcount] = school_nm
            data['lat_'+strcount] = lat
            data['lon_'+strcount] = lon
            data['school_cnt_'+strcount] = school_cnt
            data['school_cnt_01'+strcount] = school_cnt_01
            data['school_cnt_02'+strcount] = school_cnt_02
            data['school_cnt_03'+strcount] = school_cnt_03
            # ### print(data)

        data['id_counter'] = count
        data['bjdong2'] = bjdong_cd
    else:
        data['check'] = 'same_bjdong'
    return jsonify(result = "success", result2= data)

# 고등학교 정보
@map_info.route('/hi_school_info', methods=['POST'])
def hi_school_info():
    data = request.get_json()
    # sido = data.get('sido')
    # sigugun = data.get('sigugun')
    # dong = data.get('dong')
    # lat = str(data.get('center_y'))
    # lon = str(data.get('center_x'))
    bjdong_chk = str(data.get('bjdong2'))
    bjdong_cd = str(data.get('bjdong_cd'))

    # bjdong_cd = geocoding.get_address(lat, lon)
    if bjdong_cd != bjdong_chk:
        conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
        cursor = conn.cursor()
        select_sql = "select si.SCHUL_NM, si.LTTUD, si.LGTUD, sc.SUM_CNT, " \
                     "sc.COL_M1_E+sc.COL_W1_E as '1학년', " \
                     "sc.COL_M2_E+sc.COL_W2_E as '2학년'," \
                     "sc.COL_M3_E+sc.COL_W3_E as '3학년' " \
                     " from school_info si, student_cnt sc " \
                     " where si.SCHULKNDCODE = '04'" \
                     " and si.adrcd_cd = '"+bjdong_cd+"' and si.SCHUL_CODE = sc.SCHUL_CODE group by si.SCHUL_CODE order by si.SCHUL_NM"
        select_sql = cursor.execute(select_sql)
        select_sql = cursor.fetchall()
        cursor.close()
        conn.close()

        cnt = len(select_sql)
        count = 0
        for i in select_sql:
            count += 1
            school_nm = i[0]
            lat = i[1]
            lon = i[2]
            school_cnt = i[3]
            school_cnt_01 = i[4]
            school_cnt_02 = i[5]
            school_cnt_03 = i[6]
            strcount = str(count)
            data['school_nm_'+strcount] = school_nm
            data['lat_'+strcount] = lat
            data['lon_'+strcount] = lon
            data['school_cnt_'+strcount] = school_cnt
            data['school_cnt_01'+strcount] = school_cnt_01
            data['school_cnt_02'+strcount] = school_cnt_02
            data['school_cnt_03'+strcount] = school_cnt_03

        data['id_counter'] = count
        data['bjdong2'] = bjdong_cd
    else:
        data['check'] = 'sampe_bjdong'
    return jsonify(result = "success", result2= data)

# 공공 api는 못쓴다. 느려서
@map_info.route('/building_info_gg', methods=['POST'])
def building_info_gg():
    data = request.get_json()

    adm_cd_real = data.get('adm_cd_real')
    bjdong_cd = data.get('bjdong_cd')
    ### print(adm_cd_real)
    ### print(bjdong_cd)
    url = public_api.building_info(adm_cd_real, bjdong_cd)
    # API 요청 보내기
    response = requests.get(url)
    # 응답 파싱
    gg_data = json.loads(response.text)
    gg_data = gg_data['response']['body']['items']['item']
    cnt = len(gg_data)
    count = 0

    for cnt in gg_data:
        count += 1
        mainPurpsCd = cnt['mainPurpsCd']
        if mainPurpsCd == '01000' or '01001' or '1000' or '1001' or '1002' \
                or '01002' or '1003' or '02000' or '2000' or '01003' \
                or '02001' or '02002' or '02003' or '2002' or '2003':

            bldNm = cnt['bldNm']
            mainPurpsCdNm = cnt['mainPurpsCdNm']
            hhldCnt = cnt['hhldCnt']
            addr = cnt['platPlc']
            ### print(addr)
            crd = geocoding.get_location(addr)
            ### print(crd)
            if crd:
                lat = crd['lat']
                lon = crd['lng']
            else:
                lat = ''
                lon = ''

            strcount = str(count)
            data['bldNm_'+strcount] = bldNm
            data['mainPurpsCdNm_'+strcount] = mainPurpsCdNm
            data['mainPurpsCd_'+strcount] = mainPurpsCd
            data['hhldCnt_'+strcount] = hhldCnt
            data['lat_'+strcount] = lat
            data['lon_'+strcount] = lon

    data['id_counter'] = count

    return jsonify(result = "success", result2= data)

@map_info.route('/building_info', methods=['POST'])
def building_info():
    data = request.get_json()

    bjdong_chk = str(data.get('bjdong2'))
    bup_cd = str(data.get('bjdong_cd'))

    if bup_cd != bjdong_chk:
        sigugun_cd = bup_cd[0:5]
        bjdong_cd = bup_cd[5:10]

        conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
        cursor = conn.cursor()

        select_sql = "select BUILDING_NM, BUILDING_TYPE_NM, DONGNM, BUILDING_TYPE_CD, HO_CNT, lat, lon " \
                     " from building_info bi" \
                     " where BUILDING_TYPE_CD in('02000')" \
                     " and SIGUNGU_CD = "+sigugun_cd+" and BJDONG_CD = "+bjdong_cd+" order by BUILDING_NM "

                    #'02001', '02002', '02003', '01000', '01000', '01003'

        select_sql = cursor.execute(select_sql)
        select_sql = cursor.fetchall()
        cursor.close()
        conn.close()
        cnt = len(select_sql)
        count = 0

        for i in select_sql:
            count += 1
            bldNm = i[0]
            mainPurpsCdNm = i[1]
            dongnm = i[2]
            mainPurpsCd = i[3]
            hhldCnt = i[4]
            lat = i[5]
            lon = i[6]

            strcount = str(count)
            data['bldNm_'+strcount] = bldNm
            data['mainPurpsCdNm_'+strcount] = mainPurpsCdNm
            data['dongnm_'+strcount] = dongnm
            data['mainPurpsCd_'+strcount] = mainPurpsCd
            data['hhldCnt_'+strcount] = hhldCnt
            data['lat_'+strcount] = lat
            data['lon_'+strcount] = lon

        data['id_counter'] = count
        data['bjdong2'] = bup_cd
    else:
        data['check'] = 'same_bjdong'
        ### print('같은 법정동_건물')
    return jsonify(result = "success", result2= data)

@map_info.route('/platon_info', methods=['POST'])
def platon_info():
    data = request.get_json()
    # sido = data.get('sido')
    # sigugun = data.get('sigugun')
    # dong = data.get('dong')
    # lat = str(data.get('center_y'))
    # lon = str(data.get('center_x'))
    bjdong_chk = str(data.get('bjdong2'))
    bjdong_cd = str(data.get('bjdong_cd'))
    # bjdong_cd = geocoding.get_address(lat, lon)
    ## print("platon_info: ", bjdong_chk, "=", bjdong_cd)
    if bjdong_cd != bjdong_chk:
        conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
        cursor = conn.cursor()
        select_sql = "select center_nm, center_loc_nm, center_owner, owner_num, center_type1, " \
                     " center_type2, chief_yn, mem_cnt, lat, lon from platon_info where bjdong like '%"+bjdong_cd+"%'"
        select_sql = cursor.execute(select_sql)
        select_sql = cursor.fetchall()
        cursor.close()
        conn.close()

        cnt = len(select_sql)
        count = 0
        for i in select_sql:
            count += 1
            center_nm = i[0]
            center_loc_nm = i[1]
            center_owner = i[2]
            owner_num = i[3]
            center_type1 = i[4]
            center_type2 = i[5]
            chief_yn = i[6]
            loc_info = center_nm+"_"+center_loc_nm+"_"+center_owner+"_"+owner_num+"_"+center_type1+"_"+center_type2+"_"+chief_yn
            mem_cnt = i[7]
            lat = i[8]
            lon = i[9]
            strcount = str(count)
            data['loc_info_'+strcount] = loc_info
            data['lat_'+strcount] = lat
            data['lon_'+strcount] = lon
            data['mem_cnt_'+strcount] = mem_cnt
        data['id_counter'] = count
        data['bjdong2'] = bjdong_cd
    else:
        data['check'] = 'sampe_bjdong'
    return jsonify(result = "success", result2= data)

@map_info.route('/platon_member_info', methods=['POST'])
def platon_member_info():
    data = request.get_json()
    # sido = data.get('sido')
    # sigugun = data.get('sigugun')
    # dong = data.get('dong')
    # lat = str(data.get('center_y'))
    # lon = str(data.get('center_x'))
    bjdong_chk = str(data.get('bjdong2'))
    bjdong_cd = str(data.get('bjdong_cd'))
    # bjdong_cd = geocoding.get_address(lat, lon)
    ## print("platon_member_info: ", bjdong_chk, "=", bjdong_cd)
    if bjdong_cd != bjdong_chk:
        conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
        cursor = conn.cursor()
        select_sql = "select member_nm, sap_num, center_nm, teacher_nm, lectuer_type, parents_nm, parents_cell, edu_nm, lat, lon, birth " \
                     " from hansol_member where lat is not null and center_nm like '%센터%' and lectuer_type like '%수업중%' and bjdong= '"+bjdong_cd+"'"

        select_sql = cursor.execute(select_sql)
        select_sql = cursor.fetchall()
        cursor.close()
        conn.close()
        cnt = len(select_sql)
        count = 0
        # # print(select_sql)
        for i in select_sql:
            count += 1
            member_nm = i[0]
            sap_num = i[1]
            center_nm = i[2]
            teacher_nm = i[3]
            lectuer_type = i[4]
            parents_nm = i[5]
            parents_cell = str(i[6])
            parents_cell = parents_cell[:3]+"-****-"+parents_cell[-4:]
            edu_nm = i[7]
            lat = i[8]
            lon = i[9]
            birth = i[10]

            strcount = str(count)
            data['member_nm_'+strcount] = member_nm
            data['sap_num_'+strcount] = sap_num
            data['center_nm_'+strcount] = center_nm
            data['teacher_nm_'+strcount] = teacher_nm
            data['lectuer_type_'+strcount] = lectuer_type
            data['parents_nm_'+strcount] = parents_nm
            data['parents_cell_'+strcount] = parents_cell
            data['edu_nm_'+strcount] = edu_nm
            data['lat_'+strcount] = lat
            data['lon_'+strcount] = lon
            data['birth_'+strcount] = birth

        data['id_counter'] = count
        data['bjdong2'] = bjdong_cd
    else:
        data['check'] = 'sampe_bjdong'

    return jsonify(result = "success", result2= data)

@map_info.route('/singi_member_info', methods=['POST'])
def singi_member_info():
    data = request.get_json()
    # sido = data.get('sido')
    # sigugun = data.get('sigugun')
    # dong = data.get('dong')
    # lat = str(data.get('center_y'))
    # lon = str(data.get('center_x'))
    bjdong_chk = str(data.get('bjdong2'))
    bjdong_cd = str(data.get('bjdong_cd'))
    # bjdong_cd = geocoding.get_address(lat, lon)

    if bjdong_cd != bjdong_chk:
        conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
        cursor = conn.cursor()
        select_sql = "select member_nm, sap_num, center_nm, teacher_nm, lectuer_type, parents_nm, parents_cell, edu_nm, lat, lon, birth " \
                     " from hansol_member where lat is not null and center_nm like '%지점%' and lectuer_type like '%수업중%' and bjdong = '"+ bjdong_cd+"'"
        select_sql = cursor.execute(select_sql)
        select_sql = cursor.fetchall()
        cursor.close()
        conn.close()
        cnt = len(select_sql)
        count = 0
        # # print(select_sql)
        for i in select_sql:
            count += 1
            member_nm = i[0]
            sap_num = i[1]
            center_nm = i[2]
            teacher_nm = i[3]
            lectuer_type = i[4]
            parents_nm = i[5]
            parents_cell = str(i[6])
            parents_cell = parents_cell[:3]+"-****-"+parents_cell[-4:]
            edu_nm = i[7]
            lat = i[8]
            lon = i[9]
            birth = i[10]

            strcount = str(count)
            data['member_nm_'+strcount] = member_nm
            data['sap_num_'+strcount] = sap_num
            data['center_nm_'+strcount] = center_nm
            data['teacher_nm_'+strcount] = teacher_nm
            data['lectuer_type_'+strcount] = lectuer_type
            data['parents_nm_'+strcount] = parents_nm
            data['parents_cell_'+strcount] = parents_cell
            data['edu_nm_'+strcount] = edu_nm
            data['lat_'+strcount] = lat
            data['lon_'+strcount] = lon
            data['birth_'+strcount] = birth

        data['id_counter'] = count
        data['bjdong2'] = bjdong_cd
        # ## print(data)
    else:
        data['check'] = 'sampe_bjdong'
    return jsonify(result = "success", result2= data)

@map_info.route('/platon_stop_member_info', methods=['POST'])
def platon_stop_member_info():
    data = request.get_json()
    # sido = data.get('sido')
    # sigugun = data.get('sigugun')
    # dong = data.get('dong')
    # lat = str(data.get('center_y'))
    # lon = str(data.get('center_x'))
    bjdong_chk = str(data.get('bjdong2'))
    bjdong_cd = str(data.get('bjdong_cd'))
    # bjdong_cd = geocoding.get_address(lat, lon)
    ## print("platon_member_info: ", bjdong_chk, "=", bjdong_cd)
    if bjdong_cd != bjdong_chk:
        conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
        cursor = conn.cursor()
        select_sql = "select member_nm, sap_num, center_nm, teacher_nm, lectuer_type, parents_nm, parents_cell, edu_nm, lat, lon, birth " \
                     " from hansol_member where lat is not null and center_nm like '%센터%' and lectuer_type like '%휴회%' and DATE(insert_date) BETWEEN '2022-01-01' AND DATE_FORMAT(NOW(), '%Y/%m/%d') " \
                     " and bjdong= '"+bjdong_cd+"'"

        select_sql = cursor.execute(select_sql)
        select_sql = cursor.fetchall()
        cursor.close()
        conn.close()
        cnt = len(select_sql)
        count = 0
        # # print(select_sql)
        for i in select_sql:
            count += 1
            member_nm = i[0]
            sap_num = i[1]
            center_nm = i[2]
            teacher_nm = i[3]
            lectuer_type = i[4]
            parents_nm = i[5]
            parents_cell = str(i[6])
            parents_cell = parents_cell[:3]+"-****-"+parents_cell[-4:]
            edu_nm = i[7]
            lat = i[8]
            lon = i[9]
            birth = i[10]

            strcount = str(count)
            data['member_nm_'+strcount] = member_nm
            data['sap_num_'+strcount] = sap_num
            data['center_nm_'+strcount] = center_nm
            data['teacher_nm_'+strcount] = teacher_nm
            data['lectuer_type_'+strcount] = lectuer_type
            data['parents_nm_'+strcount] = parents_nm
            data['parents_cell_'+strcount] = parents_cell
            data['edu_nm_'+strcount] = edu_nm
            data['lat_'+strcount] = lat
            data['lon_'+strcount] = lon
            data['birth_'+strcount] = birth

        data['id_counter'] = count
        data['bjdong2'] = bjdong_cd
    else:
        data['check'] = 'sampe_bjdong'

    return jsonify(result = "success", result2= data)

@map_info.route('/singi_stop_member_info', methods=['POST'])
def singi_stop_member_info():
    data = request.get_json()
    # sido = data.get('sido')
    # sigugun = data.get('sigugun')
    # dong = data.get('dong')
    # lat = str(data.get('center_y'))
    # lon = str(data.get('center_x'))
    bjdong_chk = str(data.get('bjdong2'))
    bjdong_cd = str(data.get('bjdong_cd'))
    # bjdong_cd = geocoding.get_address(lat, lon)

    if bjdong_cd != bjdong_chk:
        conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
        cursor = conn.cursor()
        select_sql = "select member_nm, sap_num, center_nm, teacher_nm, lectuer_type, parents_nm, parents_cell, edu_nm, lat, lon, birth " \
                     " from hansol_member where lat is not null and center_nm like '%지점%' and lectuer_type like '%휴회%' and DATE(insert_date) BETWEEN '2022-01-01' AND DATE_FORMAT(NOW(), '%Y/%m/%d')" \
                     " and bjdong = '"+ bjdong_cd+"'"
        select_sql = cursor.execute(select_sql)
        select_sql = cursor.fetchall()
        cursor.close()
        conn.close()
        cnt = len(select_sql)
        count = 0
        # # print(select_sql)
        for i in select_sql:
            count += 1
            member_nm = i[0]
            sap_num = i[1]
            center_nm = i[2]
            teacher_nm = i[3]
            lectuer_type = i[4]
            parents_nm = i[5]
            parents_cell = str(i[6])
            parents_cell = parents_cell[:3]+"-****-"+parents_cell[-4:]
            edu_nm = i[7]
            lat = i[8]
            lon = i[9]
            birth = i[10]

            strcount = str(count)
            data['member_nm_'+strcount] = member_nm
            data['sap_num_'+strcount] = sap_num
            data['center_nm_'+strcount] = center_nm
            data['teacher_nm_'+strcount] = teacher_nm
            data['lectuer_type_'+strcount] = lectuer_type
            data['parents_nm_'+strcount] = parents_nm
            data['parents_cell_'+strcount] = parents_cell
            data['edu_nm_'+strcount] = edu_nm
            data['lat_'+strcount] = lat
            data['lon_'+strcount] = lon
            data['birth_'+strcount] = birth

        data['id_counter'] = count
        data['bjdong2'] = bjdong_cd
        # ## print(data)
    else:
        data['check'] = 'sampe_bjdong'
    return jsonify(result = "success", result2= data)


@map_info.route('/platon_all_member_info', methods=['POST'])
def platon_all_member_info():
    data = request.get_json()

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()
    select_sql = "select member_nm, sap_num, center_nm, teacher_nm, lectuer_type, parents_nm, parents_cell, edu_nm, lat, lon, birth " \
                 " from hansol_member where lat is not null and center_nm like '%센터%' and lectuer_type like '%수업중%'"

    select_sql = cursor.execute(select_sql)
    select_sql = cursor.fetchall()
    cursor.close()
    conn.close()
    cnt = len(select_sql)
    count = 0
    # # print(select_sql)
    for i in select_sql:
        count += 1
        member_nm = i[0]
        sap_num = i[1]
        center_nm = i[2]
        teacher_nm = i[3]
        lectuer_type = i[4]
        parents_nm = i[5]
        parents_cell = str(i[6])
        parents_cell = parents_cell[:3]+"-****-"+parents_cell[-4:]
        edu_nm = i[7]
        lat = i[8]
        lon = i[9]
        birth = i[10]

        strcount = str(count)
        data['member_nm_'+strcount] = member_nm
        data['sap_num_'+strcount] = sap_num
        data['center_nm_'+strcount] = center_nm
        data['teacher_nm_'+strcount] = teacher_nm
        data['lectuer_type_'+strcount] = lectuer_type
        data['parents_nm_'+strcount] = parents_nm
        data['parents_cell_'+strcount] = parents_cell
        data['edu_nm_'+strcount] = edu_nm
        data['lat_'+strcount] = lat
        data['lon_'+strcount] = lon
        data['birth_'+strcount] = birth
    data['id_counter'] = count
    return jsonify(result = "success", result2= data)

@map_info.route('/singi_all_member_info', methods=['POST'])
def singi_all_member_info():
    data = request.get_json()

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()
    select_sql = "select member_nm, sap_num, center_nm, teacher_nm, lectuer_type, parents_nm, parents_cell, edu_nm, lat, lon, birth " \
                 " from hansol_member where lat is not null and center_nm like '%지점%' and lectuer_type like '%수업중%'"
    select_sql = cursor.execute(select_sql)
    select_sql = cursor.fetchall()
    cursor.close()
    conn.close()
    cnt = len(select_sql)
    count = 0
    # # print(select_sql)
    for i in select_sql:
        count += 1
        member_nm = i[0]
        sap_num = i[1]
        center_nm = i[2]
        teacher_nm = i[3]
        lectuer_type = i[4]
        parents_nm = i[5]
        parents_cell = str(i[6])
        parents_cell = parents_cell[:3]+"-****-"+parents_cell[-4:]
        edu_nm = i[7]
        lat = i[8]
        lon = i[9]
        birth = i[10]

        strcount = str(count)
        data['member_nm_'+strcount] = member_nm
        data['sap_num_'+strcount] = sap_num
        data['center_nm_'+strcount] = center_nm
        data['teacher_nm_'+strcount] = teacher_nm
        data['lectuer_type_'+strcount] = lectuer_type
        data['parents_nm_'+strcount] = parents_nm
        data['parents_cell_'+strcount] = parents_cell
        data['edu_nm_'+strcount] = edu_nm
        data['lat_'+strcount] = lat
        data['lon_'+strcount] = lon
        data['birth_'+strcount] = birth
    data['id_counter'] = count
    return jsonify(result = "success", result2= data)

@map_info.route('/platon_stop_all_member_info', methods=['POST'])
def platon_stop_all_member_info():
    data = request.get_json()
    # sido = data.get('sido')
    # sigugun = data.get('sigugun')
    # dong = data.get('dong')
    # lat = str(data.get('center_y'))
    # lon = str(data.get('center_x'))

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()
    select_sql = "select member_nm, sap_num, center_nm, teacher_nm, lectuer_type, parents_nm, parents_cell, edu_nm, lat, lon, birth " \
                 " from hansol_member where lat is not null and center_nm like '%센터%' and DATE(insert_date) BETWEEN '2022-01-01' AND DATE_FORMAT(NOW(), '%Y/%m/%d')" \
                 " and lectuer_type like '%휴회%'"
    select_sql = cursor.execute(select_sql)
    select_sql = cursor.fetchall()
    cursor.close()
    conn.close()
    cnt = len(select_sql)
    count = 0
    # # print(select_sql)
    for i in select_sql:
        count += 1
        member_nm = i[0]
        sap_num = i[1]
        center_nm = i[2]
        teacher_nm = i[3]
        lectuer_type = i[4]
        parents_nm = i[5]
        parents_cell = str(i[6])
        parents_cell = parents_cell[:3]+"-****-"+parents_cell[-4:]
        edu_nm = i[7]
        lat = i[8]
        lon = i[9]
        birth = i[10]

        strcount = str(count)
        data['member_nm_'+strcount] = member_nm
        data['sap_num_'+strcount] = sap_num
        data['center_nm_'+strcount] = center_nm
        data['teacher_nm_'+strcount] = teacher_nm
        data['lectuer_type_'+strcount] = lectuer_type
        data['parents_nm_'+strcount] = parents_nm
        data['parents_cell_'+strcount] = parents_cell
        data['edu_nm_'+strcount] = edu_nm
        data['lat_'+strcount] = lat
        data['lon_'+strcount] = lon
        data['birth_'+strcount] = birth
    data['id_counter'] = count
    return jsonify(result = "success", result2= data)

@map_info.route('/singi_stop_all_member_info', methods=['POST'])
def singi_stop_all_member_info():
    data = request.get_json()

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()
    select_sql = "select member_nm, sap_num, center_nm, teacher_nm, lectuer_type, parents_nm, parents_cell, edu_nm, lat, lon, birth " \
                 " from hansol_member where lat is not null and center_nm like '%지점%' and DATE(insert_date) BETWEEN '2022-01-01' AND DATE_FORMAT(NOW(), '%Y/%m/%d')" \
                 " and lectuer_type like '%휴회%'"
    select_sql = cursor.execute(select_sql)
    select_sql = cursor.fetchall()
    cursor.close()
    conn.close()
    cnt = len(select_sql)
    count = 0
    # # print(select_sql)
    for i in select_sql:
        count += 1
        member_nm = i[0]
        sap_num = i[1]
        center_nm = i[2]
        teacher_nm = i[3]
        lectuer_type = i[4]
        parents_nm = i[5]
        parents_cell = str(i[6])
        parents_cell = parents_cell[:3]+"-****-"+parents_cell[-4:]
        edu_nm = i[7]
        lat = i[8]
        lon = i[9]
        birth = i[10]

        strcount = str(count)
        data['member_nm_'+strcount] = member_nm
        data['sap_num_'+strcount] = sap_num
        data['center_nm_'+strcount] = center_nm
        data['teacher_nm_'+strcount] = teacher_nm
        data['lectuer_type_'+strcount] = lectuer_type
        data['parents_nm_'+strcount] = parents_nm
        data['parents_cell_'+strcount] = parents_cell
        data['edu_nm_'+strcount] = edu_nm
        data['lat_'+strcount] = lat
        data['lon_'+strcount] = lon
        data['birth_'+strcount] = birth
    data['id_counter'] = count
    return jsonify(result = "success", result2= data)

@map_info.route('/hansol_member_info', methods=['POST', 'GET'])
def hansol_member_info():
    data = request.get_json()
    bjdong_cd = str(data.get('bjdong_cd'))

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    select_sql = "select count(idx) from hansol_member where bjdong = "+bjdong_cd

    select_sql = cursor.execute(select_sql)
    select_sql = cursor.fetchall()
    cursor.close()
    conn.close()
    print("member_cnt: ", select_sql)
    select_sql = select_sql[0][0]

    data['member_cnt'] = select_sql
    print(data['member_cnt'])

    return jsonify(result = "success", result2= data)

@map_info.route('/asobi_info', methods=['POST'])
def asobi_info():
    data = request.get_json()

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()
    select_sql = "select asobi_nm, a_type, addr, lat, lon from asobi_info"
    select_sql = cursor.execute(select_sql)
    select_sql = cursor.fetchall()
    cursor.close()
    conn.close()

    cnt = len(select_sql)
    count = 0
    # # print(select_sql)
    for i in select_sql:
        count += 1
        asobi_nm = i[0]
        a_type = i[1]
        storeNm = asobi_nm+"_"+a_type
        Addr = i[2]
        lat = i[3]
        lon = i[4]

        strcount = str(count)
        data['storeNm_'+strcount] = storeNm
        data['Addr_'+strcount] = Addr
        data['lat_'+strcount] = lat
        data['lon_'+strcount] = lon
    data['id_counter'] = count
    return jsonify(result = "success", result2= data)

@map_info.route('/asobi_bjdong_info', methods=['POST'])
def asobi_bjdong_info():
    data = request.get_json()
    bjdong_chk = str(data.get('bjdong2'))
    bjdong_cd = str(data.get('bjdong_cd'))
    # bjdong_cd = geocoding.get_address(lat, lon)

    if bjdong_cd != bjdong_chk:

        conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
        cursor = conn.cursor()
        select_sql = "select asobi_nm, a_type, addr, lat, lon from asobi_info where BJDONG_NUM = '"+ bjdong_cd+"'"
        select_sql = cursor.execute(select_sql)
        select_sql = cursor.fetchall()
        cursor.close()
        conn.close()
        # # print(select_sql)

        cnt = len(select_sql)
        count = 0
        # # print(select_sql)
        for i in select_sql:
            count += 1
            asobi_nm = i[0]
            a_type = i[1]
            storeNm = asobi_nm+"_"+a_type
            Addr = i[2]
            lat = i[3]
            lon = i[4]

            strcount = str(count)
            data['storeNm_'+strcount] = storeNm
            data['Addr_'+strcount] = Addr
            data['lat_'+strcount] = lat
            data['lon_'+strcount] = lon
        data['id_counter'] = count
        data['bjdong2'] = bjdong_cd
        # ## print(data)
    else:
        data['check'] = 'sampe_bjdong'
    return jsonify(result = "success", result2= data)

@map_info.route('/gameang_info', methods=['POST'])
def gameang_info():
    data = request.get_json()
    search_nm = str(data.get('brand'))

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()
    select_sql = "select * from affiliation_info where mutual_nm like '%"+search_nm+"%'"
    select_sql = cursor.execute(select_sql)
    select_sql = cursor.fetchall()
    cursor.close()
    conn.close()

    cnt = len(select_sql)
    count = 0
    # # print(select_sql)
    for i in select_sql:
        count += 1
        company_nm = i[2]
        brand_nm = i[3]
        boss = i[4]
        reg_date = i[6]
        store_type = i[7]
        url = i[8]
        all_count = i[9]
        gm_count = i[10]
        jy_count = i[11]
        aver_sales = i[12]
        unit_aver_sales = i[13]
        subs_fee = i[14]
        edu_fee = i[15]
        deposit_fee = i[16]
        etc_fee = i[17]
        total_fee = i[18]

        strcount = str(count)
        data['company_nm_'+strcount] = company_nm
        data['brand_nm_'+strcount] = brand_nm
        data['boss_'+strcount] = boss
        data['reg_date_'+strcount] = reg_date
        data['store_type_'+strcount] = store_type
        data['url_'+strcount] = url
        data['all_count_'+strcount] = all_count
        data['gm_count_'+strcount] = gm_count
        data['jy_count_'+strcount] = jy_count
        data['aver_sales_'+strcount] = aver_sales
        data['unit_aver_sales_'+strcount] = unit_aver_sales
        data['subs_fee_'+strcount] = subs_fee
        data['edu_fee_'+strcount] = edu_fee
        data['deposit_fee_'+strcount] = deposit_fee
        data['etc_fee_'+strcount] = etc_fee
        data['total_fee_'+strcount] = total_fee
    data['id_counter'] = count
    return jsonify(result = "success", result2= data)


@map_info.route('/compete_bjdong_info', methods=['POST'])
def compete_bjdong_info():
    data = request.get_json()
    bjdong_chk = str(data.get('bjdong2'))
    bjdong_cd = str(data.get('bjdong_cd'))

    if bjdong_cd != bjdong_chk:
        conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
        cursor = conn.cursor()
        select_sql = "select * from affiliation_detail_info where bjdong = '"+ bjdong_cd+"'"
        select_sql = cursor.execute(select_sql)
        select_sql = cursor.fetchall()
        cursor.close()
        conn.close()
        # # print(select_sql)

        cnt = len(select_sql)
        count = 0
        # # print(select_sql)
        for i in select_sql:
            count += 1
            place_name = i[2]
            place_category = i[3]
            place_add = i[4]
            place_tel = i[6]
            lat = i[8]
            lon = i[9]

            strcount = str(count)
            data['place_name_'+strcount] = place_name
            data['place_category_'+strcount] = place_category
            data['place_add_'+strcount] = place_add
            data['place_tel_'+strcount] = place_tel
            data['lat_'+strcount] = lat
            data['lon_'+strcount] = lon
        data['id_counter'] = count
        data['bjdong2'] = bjdong_cd
    else:
        data['check'] = 'sampe_bjdong'
    return jsonify(result = "success", result2= data)


@map_info.route('/get_address_ajax', methods=['POST'])
def get_address_ajax():
    data = request.get_json()
    lat = data.get('lat')
    lon = data.get('lon')

    ### print(lat, lon)

    add_lat_str = str(lat)
    add_lon_str = str(lon)

    add_coordi = add_lat_str + ", " + add_lon_str

    # 선택 좌표한 좌표 중심으로 법정동 영역 가지고 오기
    # geolocoder = Nominatim(user_agent = 'South Korea', timeout=None)
    # address = geolocoder.reverse(add_coordi)

    address = geocoding.get_address(add_lat_str, add_lon_str)
    ### print(type(address))

    sido1 = address['documents'][0]['region_1depth_name']
    gugun1 = address['documents'][0]['region_2depth_name']
    search = address['documents'][0]['region_3depth_name']

    # address_02 = address.split(',')[-4].replace(" " , "")

    data['sido1'] = sido1
    data['gugun1'] = gugun1
    data['search'] = search

    return jsonify(result = "success", result2= data)

@map_info.route('/cal_polygon_front', methods=['POST'])
def cal_polygon_front():
    data = request.get_json()
    kinder_data = {}
    el_school_data = {}
    mi_school_data = {}
    hi_school_data = {}
    building_data = {}
    academy_data = {}
    asobi_data = {}
    competition_data = {}
    shop_data = {}
    platon_data = {}
    platon_member_data = {}
    singi_member_data = {}
    platon_stop_data = {}
    singi_stop_data = {}

    bjdong = data.get('bjdong')

    pop_info_cnt = pop_info(bjdong)
    kinder_info = map_info_figure.kinder_info(bjdong)
    el_school_info = map_info_figure.el_school_info(bjdong)
    mi_school_info = map_info_figure.mi_school_info(bjdong)
    hi_school_info = map_info_figure.hi_school_info(bjdong)
    building_info = map_info_figure.building_info(bjdong)
    academy_info = map_info_figure.academy_info(bjdong)

    asobi_info = map_info_figure.asobi_info(bjdong)
    competition_info = map_info_figure.competition_info(bjdong)

    shop_info = map_info_figure.shop_info(bjdong)
    platon_info = map_info_figure.platon_info(bjdong)
    platon_member_info = map_info_figure.platon_member_info(bjdong)
    singi_member_info = map_info_figure.singi_member_info(bjdong)
    platon_stop_member_info = map_info_figure.platon_stop_member_info(bjdong)
    singi_stop_member_info = map_info_figure.singi_stop_member_info(bjdong)

    draw_poly = data.get('draw_poly')
    draw_poly = draw_poly[0]
    draw_poly_new = []
    for i in range(len(draw_poly)):
        poly_info_new = ()
        lat = draw_poly[i].get("lat")
        lon = draw_poly[i].get("lng")
        poly_info_new = lon, lat
        draw_poly_new.append(poly_info_new)

    if len(pop_info_cnt) != 0 :
        h_count = 0
        for i in pop_info_cnt:
            h_count += 1
            bjdong = i[0]
            emd = i[1]
            human_cnt_data1 = i[2]
            human_cnt_data2 = i[3]
            human_cnt_data3 = i[4]
            human_cnt_data4 = i[5]
            human_total_cnt = i[6]

            strcount = str(h_count)

            data['emd_'+strcount] = emd
            data['kids_cnt_01_'+strcount] = human_cnt_data1
            data['kids_cnt_02_'+strcount] = human_cnt_data2
            data['kids_cnt_03_'+strcount] = human_cnt_data3
            data['kids_cnt_04_'+strcount] = human_cnt_data4
            data['human_total_cnt_'+strcount] = human_total_cnt
        data['id_counter'] = h_count

    kinder_info_result, el_school_info_result, mi_school_info_result, hi_school_info_result, building_info_result, academy_info_result, asobi_info_result, competition_info_result,\
    shop_info_result, platon_info_result, platon_member_info_result, singi_member_info_result, platon_stop_member_info_result, \
    singi_stop_member_info_result = cal_polygon.cal_polygon_info(draw_poly_new, kinder_info, el_school_info, mi_school_info, hi_school_info,
                                                                 building_info, academy_info, asobi_info, competition_info, shop_info, platon_info, platon_member_info,
                                                                 singi_member_info, platon_stop_member_info, singi_stop_member_info)

    kinder_info_result = kinder_info_result.to_json(orient='records', force_ascii=False)
    el_school_info_result = el_school_info_result.to_json(orient='records', force_ascii=False)
    mi_school_info_result = mi_school_info_result.to_json(orient='records', force_ascii=False)
    hi_school_info_result = hi_school_info_result.to_json(orient='records', force_ascii=False)
    building_info_result = building_info_result.to_json(orient='records', force_ascii=False)
    academy_info_result = academy_info_result.to_json(orient='records', force_ascii=False)
    asobi_info_result = asobi_info_result.to_json(orient='records', force_ascii=False)
    competition_info_result = competition_info_result.to_json(orient='records', force_ascii=False)
    shop_info_result = shop_info_result.to_json(orient='records', force_ascii=False)
    platon_info_result = platon_info_result.to_json(orient='records', force_ascii=False)
    platon_member_info_result = platon_member_info_result.to_json(orient='records', force_ascii=False)
    singi_member_info_result = singi_member_info_result.to_json(orient='records', force_ascii=False)
    platon_stop_member_info_result = platon_stop_member_info_result.to_json(orient='records', force_ascii=False)
    singi_stop_member_info_result = singi_stop_member_info_result.to_json(orient='records', force_ascii=False)

    kinder_data['kinder_info_result'] = kinder_info_result
    el_school_data['el_school_info_result'] = el_school_info_result
    mi_school_data['mi_school_info_result'] = mi_school_info_result
    hi_school_data['hi_school_info_result'] = hi_school_info_result
    building_data['building_info_result'] = building_info_result
    academy_data['academy_info_result'] = academy_info_result
    asobi_data['asobi_info_result'] = asobi_info_result
    competition_data['competition_info_result'] = competition_info_result
    shop_data['shop_info_result'] = shop_info_result
    platon_data['platon_info_result'] = platon_info_result
    platon_member_data['platon_member_info_result'] = platon_member_info_result
    singi_member_data['singi_member_info_result'] = singi_member_info_result
    platon_stop_data['platon_stop_member_info_result'] = platon_stop_member_info_result
    singi_stop_data['singi_stop_member_info_result'] = singi_stop_member_info_result

    return jsonify(result = "success", result2= data, kinder_data= kinder_data, el_school_data = el_school_data, \
                   mi_school_data= mi_school_data, hi_school_data = hi_school_data, building_data = building_data, \
                   academy_data=academy_data, asobi_data=asobi_data, competition_data=competition_data, shop_data = shop_data, \
                   platon_data = platon_data, platon_member_data = platon_member_data, \
                   singi_member_data = singi_member_data, platon_stop_data = platon_stop_data, \
                   singi_stop_data = singi_stop_data)



@map_info.route('/cal_polygon_front_nopigon', methods=['POST'])
def cal_polygon_front_nopigon():
    data = request.get_json()
    kinder_data = {}
    el_school_data = {}

    building_data = {}
    academy_data = {}
    asobi_data = {}
    competition_data = {}
    shop_data = {}

    bjdong = data.get('bjdong')

    pop_info_cnt = pop_info(bjdong)
    kinder_info = map_info_figure.kinder_info(bjdong)
    el_school_info = map_info_figure.el_school_info(bjdong)
    building_info = map_info_figure.building_info(bjdong)
    HO_CNT= building_info.astype({ 'HO_CNT' : 'int' })
    HO_CNT_SUM = HO_CNT['HO_CNT'].sum()
    data['HO_CNT_SUM_result'] = int(HO_CNT_SUM)

    academy_info = map_info_figure.academy_info(bjdong)

    asobi_info = map_info_figure.asobi_info(bjdong)
    competition_info = map_info_figure.competition_info(bjdong)

    shop_info = map_info_figure.shop_info(bjdong)

    draw_poly = data.get('draw_poly')
    draw_poly = draw_poly[0]
    draw_poly_new = []
    for i in range(len(draw_poly)):
        poly_info_new = ()
        lat = draw_poly[i].get("lat")
        lon = draw_poly[i].get("lng")
        poly_info_new = lon, lat
        draw_poly_new.append(poly_info_new)

    if len(pop_info_cnt) != 0 :
        h_count = 0
        for i in pop_info_cnt:
            h_count += 1
            bjdong = i[0]
            emd = i[1]
            human_cnt_data1 = i[2]
            human_cnt_data2 = i[3]
            human_cnt_data3 = i[4]
            human_cnt_data4 = i[5]
            human_total_cnt = i[6]

            strcount = str(h_count)

            data['emd_'+strcount] = emd
            data['kids_cnt_01_'+strcount] = human_cnt_data1
            data['kids_cnt_02_'+strcount] = human_cnt_data2
            data['kids_cnt_03_'+strcount] = human_cnt_data3
            data['kids_cnt_04_'+strcount] = human_cnt_data4
            data['human_total_cnt_'+strcount] = human_total_cnt
        data['id_counter'] = h_count

    # print(data)

    kinder_info_result, el_school_info_result, building_info_result, academy_info_result, asobi_info_result, competition_info_result,\
        shop_info_result = cal_polygon.cal_polygon_info_nopigon(draw_poly_new, kinder_info, el_school_info, building_info, academy_info, asobi_info, competition_info, shop_info)

    kinder_info_result = kinder_info_result.to_json(orient='records', force_ascii=False)
    el_school_info_result = el_school_info_result.to_json(orient='records', force_ascii=False)
    building_info_result = building_info_result.to_json(orient='records', force_ascii=False)
    academy_info_result = academy_info_result.to_json(orient='records', force_ascii=False)
    asobi_info_result = asobi_info_result.to_json(orient='records', force_ascii=False)
    competition_info_result = competition_info_result.to_json(orient='records', force_ascii=False)
    shop_info_result = shop_info_result.to_json(orient='records', force_ascii=False)

    kinder_data['kinder_info_result'] = kinder_info_result
    el_school_data['el_school_info_result'] = el_school_info_result
    building_data['building_info_result'] = building_info_result
    academy_data['academy_info_result'] = academy_info_result
    asobi_data['asobi_info_result'] = asobi_info_result
    competition_data['competition_info_result'] = competition_info_result
    shop_data['shop_info_result'] = shop_info_result

    return jsonify(result = "success", result2= data, kinder_data= kinder_data, el_school_data = el_school_data, building_data = building_data,
                   academy_data=academy_data, asobi_data=asobi_data, competition_data=competition_data, shop_data = shop_data)


@map_info.route('/academy_cal_polygon_front', methods=['POST'])
def academy_cal_polygon_front():
    data = request.get_json()
    academy_data = {}

    bjdong = data.get('bjdong')

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()
    academy_info = "select idx, academy_nm, gubun_nm, category_nm, teaching_subject_nm_01, teaching_line_nm, like_cnt, shop_img_01, lat, lon " \
                   " from academy_info " \
                   " where bjdong_cd = "+bjdong+" order by like_cnt desc"

    academy_info = cursor.execute(academy_info)
    academy_info = cursor.fetchall()
    conn.close()
    # print(academy_info)
    # print("academy_info_type: ", type(academy_info))

    academy_info = pd.DataFrame(academy_info, columns=['idx', 'academy_nm', 'gubun_nm', 'category_nm', 'teaching_subject_nm_01', 'teaching_line_nm', 'like_cnt', 'shop_img_01', 'lat', 'lon'])

    draw_poly = data.get('draw_poly')
    draw_poly = draw_poly[0]
    draw_poly_new = []
    for i in range(len(draw_poly)):
        poly_info_new = ()
        lat = draw_poly[i].get("lat")
        lon = draw_poly[i].get("lng")
        poly_info_new = lon, lat
        draw_poly_new.append(poly_info_new)

    academy_info_result = cal_polygon.academy_cal_polygon_info(draw_poly_new, academy_info)
    # academy_data_result = academy_info_result.to_json(orient='records', force_ascii=False)
    # academy_data['academy_data_result'] = academy_data_result

    # print(academy_info_result)
    # print("academy_info_result_type: ", type(academy_info_result))

    paginated_data = academy_info_result.to_records(index=False).tolist()
    # print("paginated_data: ", paginated_data)
    post_cnt = len(paginated_data)
    # print("paginated_data: ", paginated_data)
    data_html = render_template('/edu_info/polygon_shop_data.html', data=paginated_data)

    return jsonify(result = "success", data_html=data_html, post_cnt=post_cnt)


@map_info.route('/hotzone_polygon_front', methods=['POST'])
def hotzone_polygon_front():
    data = request.get_json()
    session_id = data.get('session_id')
    # bjdong = data.get('bjdong')
    user_loc = data.get('user_loc')
    hot_zone = data.get('hot_zone')
    # print("user_loc: ", user_loc)
    # print("hot_zone: ", hot_zone)
    hot_zone_new = []

    for i in range(len(hot_zone)):
        poly_info_new = ()
        lat = float(hot_zone[i][0].get("lat"))
        lon = float(hot_zone[i][0].get("lon"))
        poly_info_new = lon, lat
        hot_zone_new.append(poly_info_new)

    result = cal_polygon.hotzone_polygon_info(hot_zone_new, user_loc)
    data['loc_result'] = result

    return jsonify(result = "success", result2= data)

def get_address(lat, lon):
    add_lat_str = str(lat)
    add_lon_str = str(lon)
    add_coordi = add_lat_str + ", " + add_lon_str

    # 선택 좌표한 좌표 중심으로 법정동 영역 가지고 오기
    geolocoder = Nominatim(user_agent = 'South Korea', timeout=None)
    address = geolocoder.reverse(add_coordi)

    address = str(address)
    address_02 = address.split(',')[-4].replace(" " , "")

    return address_02

def get_address_sido(lat, lon):
    add_lat_str = str(lat)
    add_lon_str = str(lon)
    add_coordi = add_lat_str + ", " + add_lon_str

    # 선택 좌표한 좌표 중심으로 법정동 영역 가지고 오기
    geolocoder = Nominatim(user_agent = 'South Korea', timeout=None)
    address = geolocoder.reverse(add_coordi)

    address = str(address)
    address_02 = address.split(',')[-3].replace(" " , "")

    return address_02

