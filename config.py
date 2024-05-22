# import os
# from datetime import timedelta
# from flask import Flask, request, redirect

# basedir = os.path.abspath(os.path.dirname(__file__))
# ============ kakao =========================================
kakao_CLIENT_ID = 'aa5d940b189279503ddbd221d56f9b8b'
kakao_CLIENT_SECRET = 'M5Jvfsq0xRWl4i0xPEbQvRclCRBmTzhX'
kakao_REDIRECT_URI = 'http://172.17.28.57:8888/kakao/oauth'
# kakao_REDIRECT_URI = 'https://fankids.co.kr/kakao/oauth'
kakao_SIGNOUT_REDIRECT_URI = 'https://fankids.co.kr/member_info/logout'

# ============ kakao 한솔맵=========================================
# kakao_CLIENT_ID = 'c5048a781462ef987c91b79593523fcb'
# kakao_CLIENT_SECRET = '5Z6EGdQfStwnWFH0JMsCO15lcgtH6fyW'
# kakao_REDIRECT_URI = 'https://map.eduhansol.com/kakao/oauth'
# # kakao_REDIRECT_URI = 'http://172.17.28.57:5555/kakao/oauth'
# kakao_SIGNOUT_REDIRECT_URI = 'https://map.eduhansol.com/member_info/logout'


# ============ naver =========================================
naver_CLIENT_ID = 'Ox7Dy3U12weOJAEaxsfA'
naver_CLIENT_SECRET = 'Ksqk7Q08BP'
naver_REDIRECT_URI = 'https://172.17.28.57:8888/naver/oauth'
# naver_REDIRECT_URI = 'https://fankids.co.kr/naver/oauth'
naver_SIGNOUT_REDIRECT_URI = 'https://fankids.co.kr/member_info/logout'

# =========== kt DB 정보 =====================================
# dbhost = '210.179.172.64'
# userid = 'hansol'
# userpw = 'hansol150_'
# dbnm = 'map'
# port = 6033

# =========== aws DB 정보 =====================================
dbhost = '13.209.253.117'
userid = 'root'
userpw = 'zkffktls150_'
dbnm = 'map'
port = 3306

# =========== it서버 DB 정보 =====================================
# dbhost = '202.89.125.86'
# userid = 'hansol'
# userpw = 'gksthf12!@QW'
# dbnm = 'hansol_map'
# port = 3306

# =========== aws DB 정보 =====================================
# dbhost = 'localhost'
# userid = 'root'
# userpw = 'zkffktls150_'
# dbnm = 'map'
# port = 3306

# =========== 첨부파일 경로 =====================================
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])
LECTURE_ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif', 'pdf', 'docx', 'xlsx', 'pptx'])
# UPLOAD_FOLDER = "/home/platformmap/nopigom_map/apps/static/file_upload/picture/blog_sns/"
# ACADEMY_UPLOAD_FOLDER = "/home/platformmap/nopigom_map/apps/static/file_upload/picture/"
# LECTURE_UPLOAD_FOLDER = "/home/platformmap/nopigom_map/apps/static/file_upload/lecture/"
UPLOAD_FOLDER = "D://Project/python/flask/test/teacher/apps/static/file_upload/picture/blog_sns/"
ACADEMY_UPLOAD_FOLDER = "D://Project/python/flask/test/teacher/apps/static/file_upload/picture/"
LECTURE_UPLOAD_FOLDER = "D://Project/python/flask/test/teacher/apps/static/file_upload/lecture/"

# class Config:
#     app = Flask(__name__)
#     SECRET_KEY = os.environ.get('SECRET_KEY')
#     # SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URI') or 'sqlite:///' + os.path.join(basedir, 'app.db')
#     # SQLALCHEMY_TRACK_MODIFICATIONS = False
#
#     app.config["DEBUG"] = False
#     app.config["APPLICATION_ROOT"] = "/"
#     # app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
#
#     app.config["UPLOAD_FOLDER"] = "D://Project/python/flask/pass/second-life/apps/static/file_upload/picture/blog_sns/"
#     # app.config["MAX_CONTENT_LENGTH"] = 16*1024*1024
#     app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(hours=720)
#     app.secret_key = os.urandom(24)