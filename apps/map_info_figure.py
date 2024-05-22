import pandas as pd
import pymysql
import config

# 회사 서버올릴때
dbhost = config.dbhost
userid = config.userid
userpw = config.userpw
dbnm = config.dbnm
port = config.port


def kinder_info(bjdong_cd):
    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()
    kinder_sql = "select kindername, establish, lat, lon, ppcnt3 + ppcnt4 + ppcnt5, ppcnt3, ppcnt4, ppcnt5 " \
                 " from kinder_info " \
                 " where bjdong = '"+ bjdong_cd +"' and length(lat) > 0"
    kinder_sql = cursor.execute(kinder_sql)
    kinder_sql = cursor.fetchall()
    conn.close()
    kinder_sql = pd.DataFrame(kinder_sql, columns=['kinder', 'establish', 'lat', 'lon', 'cnt_sum', 'cnt_3', 'cnt_4', 'cnt_5'])

    return kinder_sql

# 초등학교 정보
def el_school_info(bjdong_cd):
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
                 " and si.adrcd_cd = '"+bjdong_cd+"' and length(si.LTTUD) > 0 and si.SCHUL_CODE = sc.SCHUL_CODE group by si.SCHUL_CODE order by si.SCHUL_NM"
    select_sql = cursor.execute(select_sql)
    select_sql = cursor.fetchall()
    conn.close()
    select_sql = pd.DataFrame(select_sql, columns=['SCHUL_NM', 'lat', 'lon', 'SUM_CNT', 'school_cnt_01',
                                                   'school_cnt_02', 'school_cnt_03', 'school_cnt_04', 'school_cnt_05', 'school_cnt_06',
                                                   'school_cnt_07', 'school_cnt_08'])
    return select_sql

# 중학교 정보
def mi_school_info(bjdong_cd):
    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()
    select_sql = "select si.SCHUL_NM, si.LTTUD, si.LGTUD, sc.SUM_CNT, " \
                 "sc.COL_M1_E+sc.COL_W1_E as '1학년', " \
                 "sc.COL_M2_E+sc.COL_W2_E as '2학년'," \
                 "sc.COL_M3_E+sc.COL_W3_E as '3학년' " \
                 " from school_info si, student_cnt sc " \
                 " where si.SCHULKNDCODE = '03'" \
                 " and si.adrcd_cd = '"+bjdong_cd+"' and length(si.LTTUD) > 0 and si.SCHUL_CODE = sc.SCHUL_CODE group by si.SCHUL_CODE order by si.SCHUL_NM"

    select_sql = cursor.execute(select_sql)
    select_sql = cursor.fetchall()
    conn.close()
    select_sql = pd.DataFrame(select_sql, columns=['SCHUL_NM', 'lat', 'lon', 'SUM_CNT', 'school_cnt_01',
                                                   'school_cnt_02', 'school_cnt_03'])
    return select_sql

# 고등학교 정보
def hi_school_info(bjdong_cd):
    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()
    select_sql = "select si.SCHUL_NM, si.LTTUD, si.LGTUD, sc.SUM_CNT, " \
                 "sc.COL_M1_E+sc.COL_W1_E as '1학년', " \
                 "sc.COL_M2_E+sc.COL_W2_E as '2학년'," \
                 "sc.COL_M3_E+sc.COL_W3_E as '3학년' " \
                 " from school_info si, student_cnt sc " \
                 " where si.SCHULKNDCODE = '04'" \
                 " and si.adrcd_cd = '"+bjdong_cd+"'  and length(si.LTTUD) > 0 and si.SCHUL_CODE = sc.SCHUL_CODE group by si.SCHUL_CODE order by si.SCHUL_NM"
    select_sql = cursor.execute(select_sql)
    select_sql = cursor.fetchall()
    conn.close()
    select_sql = pd.DataFrame(select_sql, columns=['SCHUL_NM', 'lat', 'lon', 'SUM_CNT', 'school_cnt_01', 'school_cnt_02', 'school_cnt_03'])
    return select_sql

def shop_info(bjdong_cd):
    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()
    shop_sql = "select bizesNm, indsLclsCd, indsMclsCd, indsSclsNm, lat, lon  from shop_info_all_23 where ldongCd = "+bjdong_cd+" and length(lat) > 0 order by bizesNm "

    shop_sql = cursor.execute(shop_sql)
    shop_sql = cursor.fetchall()
    conn.close()
    shop_sql = pd.DataFrame(shop_sql, columns=['bizesNm', 'indsLclsCd', 'indsMclsCd', 'indsSclsNm', 'lat', 'lon'])
    return shop_sql

def building_info(bjdong_cd):
    sigugun_cd = bjdong_cd[0:5]
    bjdong_cd = bjdong_cd[5:10]

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()
    select_sql = "select BUILDING_NM, BUILDING_TYPE_NM, DONGNM, BUILDING_TYPE_CD, HO_CNT, lat, lon " \
                 " from building_info bi" \
                 " where BUILDING_TYPE_CD = '02000'" \
                 " and SIGUNGU_CD = "+sigugun_cd+" and length(lat) > 0 and BJDONG_CD = "+bjdong_cd+" order by BUILDING_NM "

    select_sql = cursor.execute(select_sql)
    select_sql = cursor.fetchall()
    conn.close()
    select_sql = pd.DataFrame(select_sql, columns=['BUILDING_NM', 'BUILDING_TYPE_NM', 'DONGNM', 'BUILDING_TYPE_CD', 'HO_CNT', 'lat', 'lon'])
    return select_sql

def academy_info(bjdong_cd):
    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()
    select_sql = "select academy_nm, category_cd, category_nm, SCHOOL_TARGET_NM, teaching_subject_nm_01, teaching_line_nm, gubun_nm, lat, lon" \
                 " from academy_info where bjdong_cd =  "+bjdong_cd

    select_sql = cursor.execute(select_sql)
    select_sql = cursor.fetchall()
    conn.close()
    select_sql = pd.DataFrame(select_sql, columns=['ACADEMY_NM', 'category_cd', 'CATEGORY_NM', 'SCHOOL_TARGET_NM', 'teaching_subject_nm_01', 'TEACHING_LINE_NM', 'gubun_nm', 'lat', 'lon'])
    return select_sql

def asobi_info(bjdong_cd):
    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()
    select_sql = "select asobi_nm, a_type, addr, lat, lon from asobi_info where BJDONG_NUM = "+bjdong_cd

    select_sql = cursor.execute(select_sql)
    select_sql = cursor.fetchall()
    conn.close()
    select_sql = pd.DataFrame(select_sql, columns=['asobi_nm', 'a_type', 'addr', 'lat', 'lon'])
    return select_sql

def competition_info(bjdong_cd):
    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()
    select_sql = "select place_name, place_category, place_address, place_tel, lat, lon from affiliation_detail_info where bjdong = "+bjdong_cd

    select_sql = cursor.execute(select_sql)
    select_sql = cursor.fetchall()
    conn.close()
    select_sql = pd.DataFrame(select_sql, columns=['place_name', 'place_category', 'place_address', 'place_tel', 'lat', 'lon'])
    return select_sql


def platon_info(bjdong_cd):
    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()
    select_sql = "select center_nm, center_loc_nm, center_owner, owner_num, center_type1, " \
                 "center_type2, chief_yn, mem_cnt, lat, lon from platon_info where bjdong like '%"+bjdong_cd+"%' and length(lat) > 0"
    select_sql = cursor.execute(select_sql)
    select_sql = cursor.fetchall()
    conn.close()
    select_sql = pd.DataFrame(select_sql, columns=['center_nm', 'center_loc_nm', 'center_owner', 'owner_num','center_type1', 'center_type2', 'chief_yn', 'mem_cnt', 'lat', 'lon'])
    return select_sql

def platon_member_info(bjdong_cd):
    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()
    select_sql = "select member_nm, sap_num, center_nm, teacher_nm, lectuer_type, parents_nm, parents_cell, edu_nm, lat, lon, birth " \
                 " from hansol_member where lat is not null and center_nm like '%센터%' and length(lat) > 0 and lectuer_type like '%수업중%' and bjdong= '"+bjdong_cd+"'"

    select_sql = cursor.execute(select_sql)
    select_sql = cursor.fetchall()
    conn.close()
    select_sql = pd.DataFrame(select_sql, columns=['member_nm', 'sap_num', 'center_nm', 'teacher_nm', 'lectuer_type', 'parents_nm', 'parents_cell', 'edu_nm', 'lat', 'lon', 'birth'])
    return select_sql

def singi_member_info(bjdong_cd):
    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()
    select_sql = "select member_nm, sap_num, center_nm, teacher_nm, lectuer_type, parents_nm, parents_cell, edu_nm, lat, lon, birth " \
                 " from hansol_member where lat is not null and center_nm like '%지점%' and length(lat) > 0 and lectuer_type like '%수업중%' and bjdong = '"+ bjdong_cd+"'"
    select_sql = cursor.execute(select_sql)
    select_sql = cursor.fetchall()
    conn.close()
    select_sql = pd.DataFrame(select_sql, columns=['member_nm', 'sap_num', 'center_nm', 'teacher_nm', 'lectuer_type', 'parents_nm', 'parents_cell', 'edu_nm', 'lat', 'lon', 'birth'])
    return select_sql

def platon_stop_member_info(bjdong_cd):
    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()
    select_sql = "select member_nm, sap_num, center_nm, teacher_nm, lectuer_type, parents_nm, parents_cell, edu_nm, lat, lon, birth " \
                 " from hansol_member where lat is not null and center_nm like '%센터%' and length(lat) > 0 and lectuer_type like '%휴회%' and DATE(insert_date) BETWEEN '2022-01-01' AND DATE_FORMAT(NOW(), '%Y/%m/%d') " \
                 " and bjdong= '"+bjdong_cd+"'"

    select_sql = cursor.execute(select_sql)
    select_sql = cursor.fetchall()
    conn.close()
    select_sql = pd.DataFrame(select_sql, columns=['member_nm', 'sap_num', 'center_nm', 'teacher_nm', 'lectuer_type', 'parents_nm', 'parents_cell', 'edu_nm', 'lat', 'lon', 'birth'])
    return select_sql

def singi_stop_member_info(bjdong_cd):
    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()
    select_sql = "select member_nm, sap_num, center_nm, teacher_nm, lectuer_type, parents_nm, parents_cell, edu_nm, lat, lon, birth " \
                 " from hansol_member where lat is not null and center_nm like '%지점%' and length(lat) > 0 and lectuer_type like '%휴회%' and DATE(insert_date) BETWEEN '2022-01-01' AND DATE_FORMAT(NOW(), '%Y/%m/%d')" \
                 " and bjdong = '"+ bjdong_cd+"'"
    select_sql = cursor.execute(select_sql)
    select_sql = cursor.fetchall()
    conn.close()
    select_sql = pd.DataFrame(select_sql, columns=['member_nm', 'sap_num', 'center_nm', 'teacher_nm', 'lectuer_type', 'parents_nm', 'parents_cell', 'edu_nm', 'lat', 'lon', 'birth'])
    return select_sql