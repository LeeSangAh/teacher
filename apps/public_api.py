from flask import Flask, Blueprint, session, render_template, jsonify, request, flash
import requests
import json
from datetime import datetime
import pymysql
import pandas as pd
# import geocoding
import time
import config

public_api = Blueprint("public_api", __name__, url_prefix="/public_api")

# 공공데이터포털
# - Encoding
dataportal_servicekey = 'ZQYNSSKrncBe2wVk9u9g8AxcplmCYnxFwG7jATTurcy43rPJClfuSMBYdko4%2FiXUEX%2Fbw8nS5wYSJkeZrITh%2FA%3D%3D'

# - Decoding
# dataportal_servicekey = 'ZQYNSSKrncBe2wVk9u9g8AxcplmCYnxFwG7jATTurcy43rPJClfuSMBYdko4/iXUEX/bw8nS5wYSJkeZrITh/A=='

# 학교알리미
school_servicekey = '100070fbb9f0449386fada882d58b0be'

# SGIS
consumer_key = 'a0ecdc414fe1447c8438'
consumer_secret = 'f1bdc156a5af4ee09f47'

datatype = 'json'

# 회사 서버올릴때
dbhost = config.dbhost
userid = config.userid
userpw = config.userpw
dbnm = config.dbnm
port = config.port

@public_api.route("/academy_servicekey", methods = ['POST'])
def academy_servicekey():
    data = request.get_json()
    data['dataportal_servicekey'] = dataportal_servicekey
    return jsonify(result = "success", result2= data)

def shop_info(numrow, radius, lon, lat):
    now = datetime.now()
    formatted_date = now.strftime('%Y-%m-%d %H:%M:%S')

    indsLclsCd = 'R'
    indsMclsCd= 'R08'
    indsSclsCd= 'R08A02'


    # 교육 전체
    url = f"https://apis.data.go.kr/B553077/api/open/sdsc2/storeListInRadius?" \
          f"serviceKey="+ dataportal_servicekey +"&pageNo=1&numOfRows="+ numrow +"&" \
          f"radius="+ radius +"&cx="+ lon +"&cy="+ lat +"&" \
          f"indsLclsCd="+ indsLclsCd +"&type="+ datatype

    # 어린이집
    # url = f"https://apis.data.go.kr/B553077/api/open/sdsc2/storeListInRadius?" \
    #       f"serviceKey="+ servicekey +"&pageNo=1&numOfRows="+ numrow +"&" \
    #       f"radius="+ radius +"&cx="+ lon +"&cy="+ lat +"&" \
    #       f"indsLclsCd="+ indsLclsCd +"&indsMclsCd="+ indsMclsCd +"&indsSclsCd="+ indsSclsCd +"&" \
    #       f"type="+ datatype

    # # 실내골프장
    # url = f"https://apis.data.go.kr/B553077/api/open/sdsc2/storeListInRadius?" \
    #       f"serviceKey="+ servicekey +"&pageNo=1&numOfRows="+ numrow +"&" \
    #       f"radius="+ radius +"&cx="+ lon +"&cy="+ lat +"&" \
    #       f"indsLclsCd="+ indsLclsCd +"&indsMclsCd="+ indsMclsCd +"&indsSclsCd="+ indsSclsCd +"&" \
    #       f"type="+ datatype

    # url = f"https://apis.data.go.kr/B553077/api/open/sdsc2/storeListInRadius?" \
    #       f"serviceKey="+ servicekey +"&pageNo=1&numOfRows="+ numrow +"&" \
    #       f"radius="+ radius +"&cx="+ lon +"&cy="+ lat +"&type="+ datatype
    return url

# 전국 학교 api 조회, 안쓴다.
def school_info(pbanYr, schulKndCode):
    url = "https://www.schoolinfo.go.kr/openApi.do?apiKey="+school_servicekey+"&apiType=0&pbanYr="+pbanYr+"&schulKndCode="+schulKndCode
    print(url)
    return url

def human_cnt(year, adm_cd):
    url =  "http://sgisapi.kostat.go.kr/OpenAPI3/auth/authentication.json?consumer_key="+consumer_key+"&consumer_secret="+consumer_secret
    response = requests.get(url)
    tokenkey = json.loads(response.text)
    tokenkey = tokenkey['result']['accessToken']
    tokenkey = str(tokenkey)

    url1 =  "http://sgisapi.kostat.go.kr/OpenAPI3/stats/searchpopulation.json?accessToken="+tokenkey+"&year="+year+"" \
           "&gender=0&adm_cd="+adm_cd+"&age_type=01"
    response1 = requests.get(url1)
    human_cnt_data1 = json.loads(response1.text)

    # print(human_cnt_data1)

    url2 =  "http://sgisapi.kostat.go.kr/OpenAPI3/stats/searchpopulation.json?accessToken="+tokenkey+"&year="+year+"" \
             "&gender=0&adm_cd="+adm_cd+"&age_type=02"
    response2 = requests.get(url2)
    human_cnt_data2 = json.loads(response2.text)

    # print(human_cnt_data2)

    url3 =  "http://sgisapi.kostat.go.kr/OpenAPI3/stats/searchpopulation.json?accessToken="+tokenkey+"&year="+year+"" \
             "&gender=0&adm_cd="+adm_cd+"&age_type=03"
    response3 = requests.get(url3)
    human_cnt_data3 = json.loads(response3.text)

    # print(human_cnt_data3)

    return human_cnt_data1, human_cnt_data2, human_cnt_data3

def house_cnt(year, adm_cd):
    url =  "http://sgisapi.kostat.go.kr/OpenAPI3/auth/authentication.json?consumer_key="+consumer_key+"&consumer_secret="+consumer_secret

    response = requests.get(url)
    tokenkey = json.loads(response.text)
    tokenkey = tokenkey['result']['accessToken']
    tokenkey = str(tokenkey)

    household_type = '01,02,03'

    url1 =  "http://sgisapi.kostat.go.kr/OpenAPI3/stats/household.json?accessToken="+tokenkey+"&year="+year+"&adm_cd="+adm_cd+"&household_type="+household_type

    response1 = requests.get(url1)
    house_cnt_data = json.loads(response1.text)
    return house_cnt_data

def building_info_test():
    url = f"http://apis.data.go.kr/1613000/BldRgstService_v2/getBrTitleInfo?" \
          f"serviceKey="+ dataportal_servicekey +"&sigunguCd=42730&bjdongCd=38022&_type="+ datatype +"&numOfRows=10000"

    response = requests.get(url)
    gg_data = json.loads(response.text)
    print("gg_data1111111111: ", gg_data)
    gg_data_cnt = gg_data['response']['body']['totalCount']
    print("gg_data_cnt: ", gg_data_cnt)
    if gg_data_cnt > 1 :
        print(gg_data_cnt)
        gg_data = gg_data['response']['body']['items']['item']
        print("gg_data222222222", gg_data)
        cnt = len(gg_data)
        count = 0
        for j in range(len(gg_data)):
            count += 1
            print(j)
            mainPurpsCd= str(gg_data[j]['mainPurpsCd'])
            print("mainPurpsCd가 하나이상", mainPurpsCd)
    elif gg_data_cnt == 1:
        print(gg_data)
        mainPurpsCd= gg_data['response']['body']['items']['item']['mainPurpsCd']
        print("mainPurpsCd가 하나", mainPurpsCd)
    else:
        print("건물 정보 없음")

    # check_data = gg_data['response']
    # print("check_data: ", check_data)
    # print(len(check_data))
    # print(gg_data['response']['body']['totalCount'])
    # gg_data = gg_data['response']['body']['items']['item']


def building_info_file():
    # data = pd.read_table('./static/data/mart_djy_03.txt', sep='|', encoding='cp949')
    # print(data.head(100))

    M = 0
    N = 30
    with open('../static/data/mart_djy_03.txt', encoding='cp949') as myfile:
        head = [next(myfile) for x in range(M, N)]
    print(len(head))

    for l in head:
        print(l)
        print(l.count('|'))
        l.split('|')



# building_info_api()
# building_info_test()
# building_info_file()

# year = '2020'
# gender = '0'
# adm_cd = '27'
# age_type = '09'
# edu_level = '0'
# low_search = '0'
# household_type = '03'
# ocptn_type = '1'

# human_cnt_data = human_cnt(year, '11680')
# print(human_cnt_data)
# print(human_cnt_data['result'][0]['population'])
# shop_insert_info()