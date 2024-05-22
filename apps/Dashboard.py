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
import config

# =========== aws DB 정보 =====================================
dbhost = config.dbhost
userid = config.userid
userpw = config.userpw
dbnm = config.dbnm
port = config.port

dash_board = Blueprint("dash_board", __name__, url_prefix="/dash_board")


@dash_board.route('/dash_board_total_sin', methods = ['POST'])
def dash_board_total_sin():
    id = session.get('id', None)
    print(id)
    data = request.get_json()
    months_data = data.get('months_data')

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    monthsnumber_data = []

    for i in months_data:
        data_list = []
        select_sql = "SELECT count(INTG_EDU_CNTR_ID) FROM SVC_MH_EDU_CNTR "\
                     " where DATE_FORMAT(EDU_CNTR_REG_DT, '%Y') = '"+i+"' and EDU_STAT_CD in ('DA21010', 'DA51010', 'DA61001', 'DA22031', 'DA41013', 'DA22041') "\
                     " GROUP BY MONTH(EDU_CNTR_REG_DT) "

        select_sql = cursor.execute(select_sql)
        select_sql = cursor.fetchall()

        for j in range(len(select_sql)):
            data_list.append(select_sql[j][0])
        # print(select_sql[0][0])
        # print(len(select_sql))

        # print(select_sql)
        # print(type(select_sql))

        monthsnumber_data.append(data_list)

    cursor.close()
    conn.close()

    return jsonify(result = "success", result2= monthsnumber_data)

@dash_board.route('/dash_board_total_platon', methods = ['POST'])
def dash_board_total_platon():
    id = session.get('id', None)
    print(id)
    data = request.get_json()
    months_data = data.get('months_data')

    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
    cursor = conn.cursor()

    monthsnumber_data = []

    for i in months_data:
        data_list = []
        select_sql = "SELECT count(INTG_EDU_CNTR_ID) FROM svc_mh_edu_cntr_cp " \
                     " where DATE_FORMAT(REGIST_DATE, '%Y') = '"+i+"' and EDU_STAT_CD in ('DA21010', 'DA51010', 'DA61001', 'DA22031', 'DA41013', 'DA22041') " \
                     " GROUP BY MONTH(REGIST_DATE) "

        select_sql = cursor.execute(select_sql)
        select_sql = cursor.fetchall()

        for j in range(len(select_sql)):
            data_list.append(select_sql[j][0])

        monthsnumber_data.append(data_list)

    cursor.close()
    conn.close()

    return jsonify(result = "success", result2= monthsnumber_data)