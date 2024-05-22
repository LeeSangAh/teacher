import pandas as pd
from sklearn.preprocessing import StandardScaler
# DB접속 라이브러리
from flask import Blueprint, request, jsonify
import pymysql
import joblib
import numpy as np
import config

predict = Blueprint("predict", __name__, url_prefix="/predict")

# 회사 서버올릴때
dbhost = config.dbhost
userid = config.userid
userpw = config.userpw
dbnm = config.dbnm
port = config.port

# 로컬작업용
# dbhost = 'localhost'
# userid = 'hansol'
# userpw = 'hansol150_'
# dbnm = 'map'
# port = 3306

datapath = 'D:/Project/python/flask/test/teacher/apps/model/'
scaler = StandardScaler()

def predict_data(bjdong):
    try:
        conn = pymysql.connect(host=dbhost, user=userid, password=userpw, db=dbnm, charset='utf8', port=port)
        cursor = conn.cursor()

        # 시설 사업자 (공부방)
        siseol_sql_predict = "select BJDONG, count(IDX) \
                              from affiliation_detail_info \
                              where BJDONG = "+bjdong
        cursor.execute(siseol_sql_predict)
        siseol_sql_predict = cursor.fetchall()
        siseol_sql_predict = pd.DataFrame(siseol_sql_predict)
        siseol_sql_predict.rename(columns = {0: 'BJDONG', 1: 'siseol'}, inplace = True)
        print("siseol_sql_predict: ", siseol_sql_predict['BJDONG'][0])
        print("siseol_sql_predict: ", siseol_sql_predict['siseol'][0])
        if siseol_sql_predict['BJDONG'][0] is None or siseol_sql_predict['siseol'][0] == 0:
            siseol_sql_predict.loc[0, 'BJDONG']= bjdong
            siseol_sql_predict.loc[0, 'siseol']= 0
        siseol_sql_predict['BJDONG'] = siseol_sql_predict['BJDONG'].str.strip()


        # 유치원
        kinder_sql_predict = "select bjdong, count(IDX)\
                        from kinder_info \
                        where BJDONG = "+bjdong
        cursor.execute(kinder_sql_predict)
        kinder_sql_predict = cursor.fetchall()
        kinder_sql_predict = pd.DataFrame(kinder_sql_predict)
        kinder_sql_predict.rename(columns = {0: 'BJDONG', 1: 'KINDER'}, inplace = True)
        if kinder_sql_predict['BJDONG'][0] is None or kinder_sql_predict['KINDER'][0] == 0:
            kinder_sql_predict.loc[0, 'BJDONG']= bjdong
            kinder_sql_predict.loc[0, 'KINDER']= 0
        kinder_sql_predict['BJDONG'] = kinder_sql_predict['BJDONG'].str.strip()

        # 초등학교
        el_sql_predict = "select bjdong, count(idx) \
        from school_info si \
        where SCHULKNDCODE = '02' \
        and BJDONG = "+bjdong
        cursor.execute(el_sql_predict)
        el_sql_predict = cursor.fetchall()
        el_sql_predict = pd.DataFrame(el_sql_predict)
        el_sql_predict.rename(columns = {0: 'BJDONG', 1: 'El'}, inplace = True)
        if el_sql_predict['BJDONG'][0] is None or el_sql_predict['El'][0] == 0:
            el_sql_predict.loc[0, 'BJDONG']= bjdong
            el_sql_predict.loc[0, 'El']= 0
        el_sql_predict['BJDONG'] = el_sql_predict['BJDONG'].str.strip()

        # 중학교
        mi_sql_predict = "select bjdong, count(idx) \
        from school_info si \
        where SCHULKNDCODE = '03' \
        and BJDONG = "+bjdong
        cursor.execute(mi_sql_predict)
        mi_sql_predict = cursor.fetchall()
        mi_sql_predict = pd.DataFrame(mi_sql_predict)
        mi_sql_predict.rename(columns = {0: 'BJDONG', 1: 'Mi'}, inplace = True)
        if mi_sql_predict['BJDONG'][0] is None or mi_sql_predict['Mi'][0] == 0:
            mi_sql_predict.loc[0, 'BJDONG']= bjdong
            mi_sql_predict.loc[0, 'Mi']= 0
        mi_sql_predict['BJDONG'] = mi_sql_predict['BJDONG'].str.strip()

        # 고등학교
        hi_sql_predict = "select bjdong, count(idx) \
                            from school_info si \
                            where SCHULKNDCODE = '04' \
                            and BJDONG = "+bjdong
        cursor.execute(hi_sql_predict)
        hi_sql_predict = cursor.fetchall()
        hi_sql_predict = pd.DataFrame(hi_sql_predict)
        hi_sql_predict.rename(columns = {0: 'BJDONG', 1: 'Hi'}, inplace = True)
        if hi_sql_predict['BJDONG'][0] is None or hi_sql_predict['Hi'][0] == 0:
            hi_sql_predict.loc[0, 'BJDONG']= bjdong
            hi_sql_predict.loc[0, 'Hi']= 0
        hi_sql_predict['BJDONG'] = hi_sql_predict['BJDONG'].str.strip()

        # 소상공인 - 교육 카테고리
        Shop_sql1_predict = "select ldongCd, count(idx)  \
                             from shop_info_all_23 sia \
                             where indsLclsCd = 'P1' \
                             and ldongCd = "+bjdong
        cursor.execute(Shop_sql1_predict)
        Shop_sql1_predict = cursor.fetchall()
        Shop_sql1_predict = pd.DataFrame(Shop_sql1_predict)
        Shop_sql1_predict.rename(columns = {0: 'BJDONG', 1: 'Shop1'}, inplace = True)
        if Shop_sql1_predict['BJDONG'][0] is None or Shop_sql1_predict['Shop1'][0] == 0:
            Shop_sql1_predict.loc[0, 'BJDONG']= bjdong
            Shop_sql1_predict.loc[0, 'Shop1']= 0
        Shop_sql1_predict['BJDONG'] = Shop_sql1_predict['BJDONG'].str.strip()

        # 소상공인 - 소매
        Shop_sql2_predict = "select ldongCd, count(idx)  \
                            from shop_info_all_23 sia \
                            where indsLclsCd = 'G2' \
                            and ldongCd = "+bjdong
        cursor.execute(Shop_sql2_predict)
        Shop_sql2_predict = cursor.fetchall()
        Shop_sql2_predict = pd.DataFrame(Shop_sql2_predict)
        Shop_sql2_predict.rename(columns = {0: 'BJDONG', 1: 'Shop2'}, inplace = True)
        if Shop_sql2_predict['BJDONG'][0] is None or Shop_sql2_predict['Shop2'][0] == 0:
            Shop_sql2_predict.loc[0, 'BJDONG']= bjdong
            Shop_sql2_predict.loc[0, 'Shop2']= 0
        Shop_sql2_predict['BJDONG'] = Shop_sql2_predict['BJDONG'].str.strip()

        # 소상공인 - 숙박
        Shop_sql3_predict = "select ldongCd, count(idx)  \
        from shop_info_all_23 sia \
        where indsLclsCd = 'I1' \
        and ldongCd = "+bjdong
        cursor.execute(Shop_sql3_predict)
        Shop_sql3_predict = cursor.fetchall()
        Shop_sql3_predict = pd.DataFrame(Shop_sql3_predict)
        Shop_sql3_predict.rename(columns = {0: 'BJDONG', 1: 'Shop3'}, inplace = True)
        if Shop_sql3_predict['BJDONG'][0] is None or Shop_sql3_predict['Shop3'][0] == 0:
            Shop_sql3_predict.loc[0, 'BJDONG']= bjdong
            Shop_sql3_predict.loc[0, 'Shop3']= 0
        Shop_sql3_predict['BJDONG'] = Shop_sql3_predict['BJDONG'].str.strip()

        # 소상공인 - 음식
        Shop_sql4_predict = "select ldongCd, count(idx)  \
        from shop_info_all_23 sia \
        where indsLclsCd = 'I2' \
        and ldongCd = "+bjdong
        cursor.execute(Shop_sql4_predict)
        Shop_sql4_predict = cursor.fetchall()
        Shop_sql4_predict = pd.DataFrame(Shop_sql4_predict)
        Shop_sql4_predict.rename(columns = {0: 'BJDONG', 1: 'Shop4'}, inplace = True)
        if Shop_sql4_predict['BJDONG'][0] is None or Shop_sql4_predict['Shop4'][0] == 0:
            Shop_sql4_predict.loc[0, 'BJDONG']= bjdong
            Shop_sql4_predict.loc[0, 'Shop4']= 0
        Shop_sql4_predict['BJDONG'] = Shop_sql4_predict['BJDONG'].str.strip()

        # 소상공인 - 부동산
        Shop_sql5_predict = "select ldongCd, count(idx)  \
        from shop_info_all_23 sia \
        where indsLclsCd = 'L1' \
        and ldongCd = "+bjdong
        cursor.execute(Shop_sql5_predict)
        Shop_sql5_predict = cursor.fetchall()
        Shop_sql5_predict = pd.DataFrame(Shop_sql5_predict)
        Shop_sql5_predict.rename(columns = {0: 'BJDONG', 1: 'Shop5'}, inplace = True)
        if Shop_sql5_predict['BJDONG'][0] is None or Shop_sql5_predict['Shop5'][0] == 0:
            Shop_sql5_predict.loc[0, 'BJDONG']= bjdong
            Shop_sql5_predict.loc[0, 'Shop5']= 0
        Shop_sql5_predict['BJDONG'] = Shop_sql5_predict['BJDONG'].str.strip()

        # 소상공인-과학.기술
        Shop_sql6_predict = "select ldongCd, count(idx)  \
        from shop_info_all_23 sia \
        where indsLclsCd = 'M1' \
        and ldongCd = "+bjdong
        cursor.execute(Shop_sql6_predict)
        Shop_sql6_predict = cursor.fetchall()
        Shop_sql6_predict = pd.DataFrame(Shop_sql6_predict)
        Shop_sql6_predict.rename(columns = {0: 'BJDONG', 1: 'Shop6'}, inplace = True)
        if Shop_sql6_predict['BJDONG'][0] is None or Shop_sql6_predict['Shop6'][0] == 0:
            Shop_sql6_predict.loc[0, 'BJDONG']= bjdong
            Shop_sql6_predict.loc[0, 'Shop6']= 0
        Shop_sql6_predict['BJDONG'] = Shop_sql6_predict['BJDONG'].str.strip()

        # 소상공인-시설관리.임대
        Shop_sql7_predict = "select ldongCd, count(idx)  \
        from shop_info_all_23 sia \
        where indsLclsCd = 'N1' \
        and ldongCd = "+bjdong
        cursor.execute(Shop_sql7_predict)
        Shop_sql7_predict = cursor.fetchall()
        Shop_sql7_predict = pd.DataFrame(Shop_sql7_predict)
        Shop_sql7_predict.rename(columns = {0: 'BJDONG', 1: 'Shop7'}, inplace = True)
        if Shop_sql7_predict['BJDONG'][0] is None or Shop_sql7_predict['Shop7'][0] == 0:
            Shop_sql7_predict.loc[0, 'BJDONG']= bjdong
            Shop_sql7_predict.loc[0, 'Shop7']= 0
        Shop_sql7_predict['BJDONG'] = Shop_sql7_predict['BJDONG'].str.strip()

        # 소상공인 - 보건의료
        Shop_sql8_predict = "select ldongCd, count(idx)  \
        from shop_info_all_23 sia \
        where indsLclsCd = 'Q1' \
        and ldongCd = "+bjdong
        cursor.execute(Shop_sql8_predict)
        Shop_sql8_predict = cursor.fetchall()
        Shop_sql8_predict = pd.DataFrame(Shop_sql8_predict)
        Shop_sql8_predict.rename(columns = {0: 'BJDONG', 1: 'Shop8'}, inplace = True)
        if Shop_sql8_predict['BJDONG'][0] is None or Shop_sql8_predict['Shop8'][0] == 0:
            Shop_sql8_predict.loc[0, 'BJDONG']= bjdong
            Shop_sql8_predict.loc[0, 'Shop8']= 0
        Shop_sql8_predict['BJDONG'] = Shop_sql8_predict['BJDONG'].str.strip()

        # 소상공인 - 예술.스포츠
        Shop_sql9_predict = "select ldongCd, count(idx)  \
        from shop_info_all_23 sia \
        where indsLclsCd = 'R1' \
        and ldongCd = "+bjdong
        cursor.execute(Shop_sql9_predict)
        Shop_sql9_predict = cursor.fetchall()
        Shop_sql9_predict = pd.DataFrame(Shop_sql9_predict)
        Shop_sql9_predict.rename(columns = {0: 'BJDONG', 1: 'Shop9'}, inplace = True)
        if Shop_sql9_predict['BJDONG'][0] is None or Shop_sql9_predict['Shop9'][0] == 0:
            Shop_sql9_predict.loc[0, 'BJDONG']= bjdong
            Shop_sql9_predict.loc[0, 'Shop9']= 0
        Shop_sql9_predict['BJDONG'] = Shop_sql9_predict['BJDONG'].str.strip()

        # 소상공인 - 수리.개인
        Shop_sql10_predict = "select ldongCd, count(idx)  \
        from shop_info_all_23 sia \
        where indsLclsCd = 'S2' \
        and ldongCd = "+bjdong
        cursor.execute(Shop_sql10_predict)
        Shop_sql10_predict = cursor.fetchall()
        Shop_sql10_predict = pd.DataFrame(Shop_sql10_predict)
        Shop_sql10_predict.rename(columns = {0: 'BJDONG', 1: 'Shop10'}, inplace = True)
        if Shop_sql10_predict['BJDONG'][0] is None or Shop_sql10_predict['Shop10'][0] == 0:
            Shop_sql10_predict.loc[0, 'BJDONG']= bjdong
            Shop_sql10_predict.loc[0, 'Shop10']= 0
        Shop_sql10_predict['BJDONG'] = Shop_sql10_predict['BJDONG'].str.strip()

        sigungu_cd = bjdong[0:5]
        bjdong_cd = bjdong[5:10]
        print(sigungu_cd)
        print(bjdong_cd)
        # 공공주택
        Building_sql_predict = "select concat(SIGUNGU_CD, BJDONG_CD), count(IDX) \
                        from building_info \
                        where 1=1 \
                        and BUILDING_TYPE_CD = '02000' \
                        and SIGUNGU_CD = "+sigungu_cd+" \
                        and bjdong_Cd = "+bjdong_cd
        cursor.execute(Building_sql_predict)
        Building_sql_predict = cursor.fetchall()
        Building_sql_predict = pd.DataFrame(Building_sql_predict)
        Building_sql_predict.rename(columns = {0: 'BJDONG', 1: 'Building'}, inplace = True)
        if Building_sql_predict['BJDONG'][0] is None or Building_sql_predict['Building'][0] == 0:
            Building_sql_predict.loc[0, 'BJDONG']= bjdong
            Building_sql_predict.loc[0, 'Building']= 0
        Building_sql_predict['BJDONG'] = Building_sql_predict['BJDONG'].str.strip()

        # 유아 인구수
        kids_pop_sql_predict = "select zz.bjdong, sum(pc.m_cnt_5 + pc.m_cnt_5 + pc.m_cnt_6 + pc.w_cnt_4 + pc.w_cnt_5 + pc.w_cnt_6) as total_cnt_4to7 \
                        from pop_cnt pc, \
                             heang_bj_mapping zz \
                        where 1=1 \
                        and pc.heang_num = zz.heang_num_t1 \
                        and zz.bjdong ="+bjdong
        cursor.execute(kids_pop_sql_predict)
        kids_pop_sql_predict = cursor.fetchall()
        kids_pop_sql_predict = pd.DataFrame(kids_pop_sql_predict)
        kids_pop_sql_predict.rename(columns = {0: 'BJDONG', 1: 'kids_pop_cnt'}, inplace = True)
        if kids_pop_sql_predict['BJDONG'][0] is None or kids_pop_sql_predict['kids_pop_cnt'][0] == 0:
            kids_pop_sql_predict.loc[0, 'BJDONG']= bjdong
            kids_pop_sql_predict.loc[0, 'kids_pop_cnt']= 0
        kids_pop_sql_predict['BJDONG'] = kids_pop_sql_predict['BJDONG'].str.strip()
        kids_pop_sql_predict["kids_pop_cnt"] = pd.to_numeric(kids_pop_sql_predict["kids_pop_cnt"])
        kids_pop_sql_predict["kids_pop_cnt"].dtypes

        # 초등 인구수
        el_pop_sql_predict = "select zz.bjdong,	\
                          sum(pc.m_cnt_7 + pc.m_cnt_8 + pc.m_cnt_9 +pc.m_cnt_10 + pc.m_cnt_11 + pc.m_cnt_12 + pc.w_cnt_7 + pc.w_cnt_8 + pc.w_cnt_9 + pc.w_cnt_10 + pc.w_cnt_11 + pc.w_cnt_12) as total_cnt_7to12 \
                    from pop_cnt pc, \
                         heang_bj_mapping zz \
                    where 1=1 \
                    and pc.heang_num = zz.heang_num_t1 \
                    and zz.bjdong ="+bjdong
        cursor.execute(el_pop_sql_predict)
        el_pop_sql_predict = cursor.fetchall()
        el_pop_sql_predict = pd.DataFrame(el_pop_sql_predict)
        el_pop_sql_predict.rename(columns = {0: 'BJDONG', 1: 'el_pop_cnt'}, inplace = True)
        if el_pop_sql_predict['BJDONG'][0] is None or el_pop_sql_predict['el_pop_cnt'][0] == 0:
            el_pop_sql_predict.loc[0, 'BJDONG']= bjdong
            el_pop_sql_predict.loc[0, 'el_pop_cnt']= 0
        el_pop_sql_predict['BJDONG'] = el_pop_sql_predict['BJDONG'].str.strip()
        el_pop_sql_predict["el_pop_cnt"] = pd.to_numeric(el_pop_sql_predict["el_pop_cnt"])
        el_pop_sql_predict["el_pop_cnt"].dtypes

        siseol_sql_predict = siseol_sql_predict.set_index("BJDONG")
        # print(siseol_sql_predict)
        kinder_sql_predict = kinder_sql_predict.set_index("BJDONG")
        # print(kinder_sql_predict)
        el_sql_predict = el_sql_predict.set_index("BJDONG")
        print(el_sql_predict)
        mi_sql_predict = mi_sql_predict.set_index("BJDONG")
        # print(mi_sql_predict)
        hi_sql_predict = hi_sql_predict.set_index("BJDONG")
        # print(hi_sql_predict)
        Shop_sql1_predict = Shop_sql1_predict.set_index("BJDONG")
        # print(Shop_sql1_predict)
        Shop_sql2_predict = Shop_sql2_predict.set_index("BJDONG")
        # print(Shop_sql2_predict)
        Shop_sql3_predict = Shop_sql3_predict.set_index("BJDONG")
        # print(Shop_sql3_predict)
        Shop_sql4_predict = Shop_sql4_predict.set_index("BJDONG")
        print(Shop_sql4_predict)
        Shop_sql5_predict = Shop_sql5_predict.set_index("BJDONG")
        # print(Shop_sql5_predict)
        Shop_sql6_predict = Shop_sql6_predict.set_index("BJDONG")
        # print(Shop_sql6_predict)
        Shop_sql7_predict = Shop_sql7_predict.set_index("BJDONG")
        # print(Shop_sql7_predict)
        Shop_sql8_predict = Shop_sql8_predict.set_index("BJDONG")
        # print(Shop_sql8_predict)
        Shop_sql9_predict = Shop_sql9_predict.set_index("BJDONG")
        print(Shop_sql8_predict)
        Shop_sql10_predict = Shop_sql10_predict.set_index("BJDONG")
        # print(Shop_sql10_predict)
        Building_sql_predict = Building_sql_predict.set_index("BJDONG")
        # print(Building_sql_predict)
        kids_pop_sql_predict = kids_pop_sql_predict.set_index("BJDONG")
        # print(kids_pop_sql_predict)
        el_pop_sql_predict = el_pop_sql_predict.set_index("BJDONG")
        print(el_pop_sql_predict)

        merge0_predict=pd.merge(siseol_sql_predict, kinder_sql_predict, left_index=True, right_index=True, how='outer')
        print(merge0_predict)
        merge1_predict=pd.merge(merge0_predict, el_sql_predict, left_index=True, right_index=True, how='outer')
        # print(merge1_predict)
        merge2_predict=pd.merge(merge1_predict, mi_sql_predict, left_index=True, right_index=True, how='outer')
        # print(merge2_predict)
        merge3_predict=pd.merge(merge2_predict, hi_sql_predict, left_index=True, right_index=True, how='outer')
        # print(merge3_predict)
        merge4_predict=pd.merge(merge3_predict, Shop_sql1_predict, left_index=True, right_index=True, how='outer')
        # print(merge4_predict)
        merge5_predict=pd.merge(merge4_predict, Shop_sql2_predict, left_index=True, right_index=True, how='outer')
        print(merge5_predict)
        merge6_predict=pd.merge(merge5_predict, Shop_sql3_predict, left_index=True, right_index=True, how='outer')
        # print(merge6_predict)
        merge7_predict=pd.merge(merge6_predict, Shop_sql4_predict, left_index=True, right_index=True, how='outer')
        # print(merge7_predict)
        merge8_predict=pd.merge(merge7_predict, Shop_sql5_predict, left_index=True, right_index=True, how='outer')
        # print(merge8_predict)
        merge9_predict=pd.merge(merge8_predict, Shop_sql6_predict, left_index=True, right_index=True, how='outer')
        # print(merge9_predict)
        merge10_predict=pd.merge(merge9_predict, Shop_sql7_predict, left_index=True, right_index=True, how='outer')
        # print(merge10_predict)
        merge11_predict=pd.merge(merge10_predict, Shop_sql8_predict, left_index=True, right_index=True, how='outer')
        # print(merge11_predict)
        merge12_predict=pd.merge(merge11_predict, Shop_sql9_predict, left_index=True, right_index=True, how='outer')
        # print(merge12_predict)
        merge13_predict=pd.merge(merge12_predict, Shop_sql10_predict, left_index=True, right_index=True, how='outer')
        # print(merge13_predict)
        merge14_predict=pd.merge(merge13_predict, Building_sql_predict, left_index=True, right_index=True, how='outer')
        # print(merge14_predict)
        merge15_predict=pd.merge(merge14_predict, kids_pop_sql_predict, left_index=True, right_index=True, how='outer')
        # print(merge15_predict)
        merge16_predict=pd.merge(merge15_predict, el_pop_sql_predict, left_index=True, right_index=True, how='outer')
        print(merge16_predict)

        merge16_predict.rename(columns = {0: 'siseol', 1: 'KINDER', 2: 'El', 3: 'Mi', 4: 'Hi',
                                          5: 'Shop1', 6: 'Shop2', 7: 'Shop3', 8: 'Shop4', 9: 'Shop5',
                                          10: 'Shop6', 11: 'Shop7', 12: 'Shop8', 13: 'Shop9', 14: 'Shop10',
                                          15: 'Building', 16: 'kids_pop_cnt', 17: 'el_pop_cnt'}, inplace = True)

        # print(merge16_predict)
        # scaler.fit(merge16_predict)
        # X_predic = scaler.transform(merge16_predict)
        X_predic = pd.DataFrame(merge16_predict)

        print(X_predic)
    finally:
        cursor.close()
        conn.close()
    return X_predic

@predict.route('/predict_result', methods = ['GET','POST'])
def predict_result():
    data = request.get_json()
    bjdong = data.get('bjdong')

    X_predic = predict_data(bjdong)
    clf_from_joblib = joblib.load(datapath+'forest_model_2023-10-07.pkl')
    predic_result = clf_from_joblib.predict(X_predic)
    predic_proba = clf_from_joblib.predict_proba(X_predic)
    predic_proba = np.max(predic_proba, axis=1)
    print("predic_result: ", predic_result[0])
    print("predic_proba: ", predic_proba[0])

    data['predic_result'] = int(predic_result[0])
    data['predic_proba'] = float(predic_proba[0])

    return jsonify(result = "success", result2= data)
