from shapely.geometry import Point
from shapely.geometry.polygon import Polygon
import pandas as pd

def cal_polygon_info(draw_poly, kinder_info, el_school_info, mi_school_info, hi_school_info,
                     building_info, academy_info, asobi_info, competition_info, shop_info, platon_info, platon_member_info, singi_member_info,
                     platon_stop_member_info, singi_stop_member_info):
    # 사용자가 그린 폴리곤
    polygon = Polygon(draw_poly)
    # print(polygon)
    kinder_info['lat'] = kinder_info['lat'].astype(float)
    kinder_info['lon'] = kinder_info['lon'].astype(float)

    el_school_info['lat'] = el_school_info['lat'].astype(float)
    el_school_info['lon'] = el_school_info['lon'].astype(float)

    mi_school_info['lat'] = mi_school_info['lat'].astype(float)
    mi_school_info['lon'] = mi_school_info['lon'].astype(float)

    hi_school_info['lat'] = hi_school_info['lat'].astype(float)
    hi_school_info['lon'] = hi_school_info['lon'].astype(float)

    building_info['lat'] = building_info['lat'].astype(float)
    building_info['lon'] = building_info['lon'].astype(float)

    academy_info['lat'] = academy_info['lat'].astype(float)
    academy_info['lon'] = academy_info['lon'].astype(float)

    asobi_info['lat'] = asobi_info['lat'].astype(float)
    asobi_info['lon'] = asobi_info['lon'].astype(float)

    competition_info['lat'] = competition_info['lat'].astype(float)
    competition_info['lon'] = competition_info['lon'].astype(float)

    shop_info['lat'] = shop_info['lat'].astype(float)
    shop_info['lon'] = shop_info['lon'].astype(float)

    platon_info['lat'] = platon_info['lat'].astype(float)
    platon_info['lon'] = platon_info['lon'].astype(float)

    platon_member_info['lat'] = platon_member_info['lat'].astype(float)
    platon_member_info['lon'] = platon_member_info['lon'].astype(float)

    singi_member_info['lat'] = singi_member_info['lat'].astype(float)
    singi_member_info['lon'] = singi_member_info['lon'].astype(float)

    platon_stop_member_info['lat'] = platon_stop_member_info['lat'].astype(float)
    platon_stop_member_info['lon'] = platon_stop_member_info['lon'].astype(float)

    singi_stop_member_info['lat'] = singi_stop_member_info['lat'].astype(float)
    singi_stop_member_info['lon'] = singi_stop_member_info['lon'].astype(float)

    if len(kinder_info.index) > 0:
        kinder_info['inside'] = kinder_info.apply(lambda x: polygon.contains(Point(x['lon'], x['lat'])), axis=1)
        kinder_info_result = kinder_info.loc[kinder_info['inside'] == True]
    else:
        kinder_info_result = pd.DataFrame()
    if len(el_school_info.index) > 0:
        el_school_info['inside'] = el_school_info.apply(lambda x: polygon.contains(Point(x['lon'], x['lat'])), axis=1)
        el_school_info_result = el_school_info.loc[el_school_info['inside'] == True]
    else:
        el_school_info_result = pd.DataFrame()
    if len(mi_school_info.index) > 0:
        mi_school_info['inside'] = mi_school_info.apply(lambda x: polygon.contains(Point(x['lon'], x['lat'])), axis=1)
        mi_school_info_result = mi_school_info.loc[mi_school_info['inside'] == True]
    else:
        mi_school_info_result = pd.DataFrame()
    if len(hi_school_info.index) > 0:
        hi_school_info['inside'] = hi_school_info.apply(lambda x: polygon.contains(Point(x['lon'], x['lat'])), axis=1)
        hi_school_info_result = hi_school_info.loc[hi_school_info['inside'] == True]
    else:
        hi_school_info_result = pd.DataFrame()
    if len(building_info.index) > 0:
        building_info['inside'] = building_info.apply(lambda x: polygon.contains(Point(x['lon'], x['lat'])), axis=1)
        building_info_result = building_info.loc[building_info['inside'] == True]
    else:
        building_info_result = pd.DataFrame()

    if len(academy_info.index) > 0:
        academy_info['inside'] = academy_info.apply(lambda x: polygon.contains(Point(x['lon'], x['lat'])), axis=1)
        academy_info_result = academy_info.loc[academy_info['inside'] == True]
    else:
        academy_info_result = pd.DataFrame()

    if len(asobi_info.index) > 0:
        asobi_info['inside'] = asobi_info.apply(lambda x: polygon.contains(Point(x['lon'], x['lat'])), axis=1)
        asobi_info_result = asobi_info.loc[asobi_info['inside'] == True]
    else:
        asobi_info_result = pd.DataFrame()

    if len(competition_info.index) > 0:
        competition_info['inside'] = competition_info.apply(lambda x: polygon.contains(Point(x['lon'], x['lat'])), axis=1)
        competition_info_result = competition_info.loc[competition_info['inside'] == True]
    else:
        competition_info_result = pd.DataFrame()

    if len(shop_info.index) > 0:
        shop_info['inside'] = shop_info.apply(lambda x: polygon.contains(Point(x['lon'], x['lat'])), axis=1)
        shop_info_result = shop_info.loc[shop_info['inside'] == True]
    else:
        shop_info_result = pd.DataFrame()
    if len(platon_info.index) > 0:
        platon_info['inside'] = platon_info.apply(lambda x: polygon.contains(Point(x['lon'], x['lat'])), axis=1)
        platon_info_result = platon_info.loc[platon_info['inside'] == True]
    else:
        platon_info_result = pd.DataFrame()
    if len(platon_member_info.index) > 0:
        platon_member_info['inside'] = platon_member_info.apply(lambda x: polygon.contains(Point(x['lon'], x['lat'])), axis=1)
        platon_member_info_result = platon_member_info.loc[platon_member_info['inside'] == True]
    else:
        platon_member_info_result = pd.DataFrame()
    if len(singi_member_info.index) > 0:
        singi_member_info['inside'] = singi_member_info.apply(lambda x: polygon.contains(Point(x['lon'], x['lat'])), axis=1)
        singi_member_info_result = singi_member_info.loc[singi_member_info['inside'] == True]
    else:
        singi_member_info_result = pd.DataFrame()
    if len(platon_stop_member_info.index) > 0:
        platon_stop_member_info['inside'] = platon_stop_member_info.apply(lambda x: polygon.contains(Point(x['lon'], x['lat'])), axis=1)
        platon_stop_member_info_result = platon_stop_member_info.loc[platon_stop_member_info['inside'] == True]
    else:
        platon_stop_member_info_result = pd.DataFrame()
    if len(singi_stop_member_info.index) > 0:
        singi_stop_member_info['inside'] = singi_stop_member_info.apply(lambda x: polygon.contains(Point(x['lon'], x['lat'])), axis=1)
        singi_stop_member_info_result = singi_stop_member_info.loc[singi_stop_member_info['inside'] == True]
    else:
        singi_stop_member_info_result = pd.DataFrame()

    return kinder_info_result, el_school_info_result, mi_school_info_result, hi_school_info_result, building_info_result, academy_info_result, \
           asobi_info_result, competition_info_result, shop_info_result, platon_info_result, platon_member_info_result, singi_member_info_result, \
           platon_stop_member_info_result, singi_stop_member_info_result


def cal_polygon_info_nopigon(draw_poly, kinder_info, el_school_info,
                     building_info, academy_info, asobi_info, competition_info, shop_info):
    # 사용자가 그린 폴리곤
    polygon = Polygon(draw_poly)
    # print(polygon)
    kinder_info['lat'] = kinder_info['lat'].astype(float)
    kinder_info['lon'] = kinder_info['lon'].astype(float)

    el_school_info['lat'] = el_school_info['lat'].astype(float)
    el_school_info['lon'] = el_school_info['lon'].astype(float)

    building_info['lat'] = building_info['lat'].astype(float)
    building_info['lon'] = building_info['lon'].astype(float)

    academy_info['lat'] = academy_info['lat'].astype(float)
    academy_info['lon'] = academy_info['lon'].astype(float)

    asobi_info['lat'] = asobi_info['lat'].astype(float)
    asobi_info['lon'] = asobi_info['lon'].astype(float)

    competition_info['lat'] = competition_info['lat'].astype(float)
    competition_info['lon'] = competition_info['lon'].astype(float)

    shop_info['lat'] = shop_info['lat'].astype(float)
    shop_info['lon'] = shop_info['lon'].astype(float)

    if len(kinder_info.index) > 0:
        kinder_info['inside'] = kinder_info.apply(lambda x: polygon.contains(Point(x['lon'], x['lat'])), axis=1)
        kinder_info_result = kinder_info.loc[kinder_info['inside'] == True]
    else:
        kinder_info_result = pd.DataFrame()
    if len(el_school_info.index) > 0:
        el_school_info['inside'] = el_school_info.apply(lambda x: polygon.contains(Point(x['lon'], x['lat'])), axis=1)
        el_school_info_result = el_school_info.loc[el_school_info['inside'] == True]
    else:
        el_school_info_result = pd.DataFrame()

    if len(building_info.index) > 0:
        building_info['inside'] = building_info.apply(lambda x: polygon.contains(Point(x['lon'], x['lat'])), axis=1)
        building_info_result = building_info.loc[building_info['inside'] == True]
    else:
        building_info_result = pd.DataFrame()

    if len(academy_info.index) > 0:
        academy_info['inside'] = academy_info.apply(lambda x: polygon.contains(Point(x['lon'], x['lat'])), axis=1)
        academy_info_result = academy_info.loc[academy_info['inside'] == True]
    else:
        academy_info_result = pd.DataFrame()

    if len(asobi_info.index) > 0:
        asobi_info['inside'] = asobi_info.apply(lambda x: polygon.contains(Point(x['lon'], x['lat'])), axis=1)
        asobi_info_result = asobi_info.loc[asobi_info['inside'] == True]
    else:
        asobi_info_result = pd.DataFrame()

    if len(competition_info.index) > 0:
        competition_info['inside'] = competition_info.apply(lambda x: polygon.contains(Point(x['lon'], x['lat'])), axis=1)
        competition_info_result = competition_info.loc[competition_info['inside'] == True]
    else:
        competition_info_result = pd.DataFrame()

    if len(shop_info.index) > 0:
        shop_info['inside'] = shop_info.apply(lambda x: polygon.contains(Point(x['lon'], x['lat'])), axis=1)
        shop_info_result = shop_info.loc[shop_info['inside'] == True]
    else:
        shop_info_result = pd.DataFrame()

    return kinder_info_result, el_school_info_result, building_info_result, academy_info_result, \
        asobi_info_result, competition_info_result, shop_info_result

def cal_polygon_front_radius(lat1, lon1, zone_sql, radius):
    lat1 = float(lat1)
    lon1 = float(lon1)
    zone_sql['lat'] = zone_sql['lat'].astype(float)
    zone_sql['lon'] = zone_sql['lon'].astype(float)

    points_within_radius = pd.DataFrame(columns=['idx', 'zone_nm', 'category_cd', 'lat', 'lon', 'gubun',  'category_nm_01', 'category_nm_02', 'distance'])

    for idx, row in zone_sql.iterrows():
        distance = haversine(lat1, lon1, row[3], row[4])
        distance = int(distance)
        if distance <= radius:
            df2 = pd.DataFrame({'idx': [row[0]], 'zone_nm': [row[1]], 'category_cd': [row[2]], 'lat': [row[3]], 'lon': [row[4]], 'gubun': [row[5]], 'category_nm_01': [row[6]], 'category_nm_02': [row[7]], 'distance':[distance]})
            points_within_radius = pd.concat ([points_within_radius, df2])
    points_within_radius = points_within_radius.sort_values('distance')
    # print(points_within_radius)
    return points_within_radius

# 반경 100미터 이내 찾기
# 앞에 두개가 기준점, 뒤에 두개가 비교 대상
def haversine(lat1, lon1, lat2, lon2):
    R = 6371000  # 지구의 반지름 (미터 단위)
    dLat = math.radians(lat2 - lat1)
    dLon = math.radians(lon2 - lon1)
    a = math.sin(dLat / 2) * math.sin(dLat / 2) + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dLon / 2) * math.sin(dLon / 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    distance = R * c
    return distance