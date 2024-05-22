from geopy.geocoders import Nominatim
import requests
import json
import pymysql
from datetime import datetime
import config

# 카카오API를 사용하여 주소->좌표 변환
# 개인꺼
# kakaokey = "KakaoAK 8d1a1d76ff4fc3af431468fedd88be1c"
# 팀계정
kakaokey = "KakaoAK 12000c244d87be3588f16230cf88c60c"
# 희철 계정
# kakaokey = "KakaoAK 7d8ae49f7cb88aeb42e8847036285d14"
# 가람대리
# kakaokey = "KakaoAK d968ee63b72b90b9dd1eefef82c58573"
# 지원 계정
# kakaokey = "KakaoAK 4c13beb9c537e887ef58d7db955fd9d4"

dbhost = config.dbhost
userid = config.userid
userpw = config.userpw
dbnm = config.dbnm
port = config.port

########### 주소로 위도 경도 가지고 오기 ###############
def geocoding(address):
    geolocoder = Nominatim(user_agent = 'South Korea', timeout=None)
    geo = geolocoder.geocode(address)
    print(geo)
    if geo is None:
        crd = ''
    else:
        crd = {"lat": str(geo.latitude), "lng": str(geo.longitude)}
    return crd

def get_location(address):
    url = 'https://dapi.kakao.com/v2/local/search/address.json?query=' + address
    # 'KaKaoAK '는 그대로 두시고 개인키만 지우고 입력해 주세요.
    # ex) KakaoAK 6af8d4826f0e56c54bc794fa8a294
    print(address)
    headers = {"Authorization": kakaokey}
    api_json = json.loads(str(requests.get(url,headers=headers).text))
    # print("api_json: ", api_json)
    count = api_json['meta']['total_count']
    if count == 0:
        crd = ''
    else:
        address = api_json['documents'][0]['address']
        crd = {"lat": str(address['y']), "lng": str(address['x'])}
    print(crd)

    return crd

########### 역지오코딩 ###############
# 가입 없이 좌표->주소 변환

def geocoding_reverse(lat_lng_str):
    geolocoder = Nominatim(user_agent = 'South Korea', timeout=None)
    address = geolocoder.reverse(lat_lng_str)
    return address

# 카카오API를 사용하여 좌표->주소 변환
def get_address(lat, lng):
    url = "https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x="+lng+"&y="+lat
    headers = {"Authorization": kakaokey}
    api_json = requests.get(url, headers=headers)
    full_address = json.loads(api_json.text)
    if "documents" in full_address:
        if "code" in full_address['documents'][0]:
            bupaddr = full_address['documents'][0]
            bup_cd = bupaddr['code']
        else:
            bup_cd = '0000000000'
    else:
        print("주소 정보가 없습니다.")
        bup_cd = '0000000000'
    return bup_cd


def get_address2(idx, lat, lng):
    url = "https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x="+lng+"&y="+lat
    headers = {"Authorization": kakaokey}
    api_json = requests.get(url, headers=headers)
    full_address = json.loads(api_json.text)
    if "documents" in full_address:
        bupaddr = full_address['documents'][0]
        bup_cd = bupaddr['code']
    else:
        bup_cd = '0'
        print("주소정보가 없습니다.")
        print(idx)
    return bup_cd

def get_address3(lat, lng):
    url = "https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x="+lng+"&y="+lat
    headers = {"Authorization": kakaokey}
    api_json = requests.get(url, headers=headers)
    full_address = json.loads(api_json.text)
    # print(full_address)
    if "documents" in full_address:
        if "code" in full_address['documents'][0]:
            bupaddr = full_address['documents'][0]
            bup_cd = bupaddr['code']
            sido_nm = bupaddr['region_1depth_name']
            bup_nm = bupaddr['region_3depth_name']
            # print("bupaddr: ", bupaddr)
            # print("bup_nm: ", bup_nm)
        else:
            bup_cd = '0000000000'
    else:
        print("주소 정보가 없습니다.")
        bup_cd = '0000000000'
        bup_nm = ''
    return bup_cd, bup_nm, sido_nm


def add_trans():
    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8')
    cursor = conn.cursor()

    select_sql = "select idx, place_address from affiliation_detail_info"

    select_sql = cursor.execute(select_sql)
    select_sql = cursor.fetchall()

    count = 0

    for i in select_sql:
        count += 1
        idx = i[0]
        address = i[1]

        crd = get_location(address)

        # crd = geocoding(addr)
        if crd:
            lat = str(crd['lat'])
            lon = str(crd['lng'])
        else:
            lat = ''
            lon = ''

        add_update_sql = "update affiliation_detail_info set lat = %s, lon = %s where idx = %s"
        val = [
            (lat),
            (lon),
            (idx)
        ]

        cursor.execute(add_update_sql, val)
        conn.commit()
    conn.close()


def add_trans_bjdong():
    conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8')
    cursor = conn.cursor()

    select_sql = "select idx, lat, lon from affiliation_detail_info"

    select_sql = cursor.execute(select_sql)
    select_sql = cursor.fetchall()

    count = 0

    for i in select_sql:
        count += 1
        idx = i[0]
        lat = i[1]
        lon = i[2]

        bup_cd = get_address(lat, lon)

        # crd = geocoding(addr)
        if bup_cd:
            add_update_sql = "update affiliation_detail_info set bjdong = %s where idx = %s"
            val = [
                (bup_cd),
                (idx)
            ]
            cursor.execute(add_update_sql, val)
            conn.commit()
        else:
            pass
    conn.close()

# add_trans()
# add_trans_bjdong()
