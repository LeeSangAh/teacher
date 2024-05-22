from flask import Flask, request, redirect
from . import Map_info, Member_info, Home, Kakao, Dashboard, public_api
from . import Academy_info, Teacher_info, Student_info, Level_info, Class_info, Enrolment_info, Subject_info, Lecture_info
from datetime import timedelta
from flask_cors import CORS
import os
from flask_jwt_extended import JWTManager

def create_app():
    app = Flask(__name__)
    app.config["DEBUG"] = True
    app.config["APPLICATION_ROOT"] = "/"
    app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'

    app.register_blueprint(Member_info.member_info)
    app.register_blueprint(Map_info.map_info)
    app.register_blueprint(Home.home)
    app.register_blueprint(Kakao.kakao)
    app.register_blueprint(Dashboard.dash_board)
    app.register_blueprint(public_api.public_api)
    app.register_blueprint(Academy_info.academy_info)
    app.register_blueprint(Teacher_info.teacher_info)
    app.register_blueprint(Student_info.student_info)
    app.register_blueprint(Level_info.level_info)
    app.register_blueprint(Class_info.class_info)
    app.register_blueprint(Enrolment_info.enrolment_info)
    app.register_blueprint(Subject_info.subject_info)
    app.register_blueprint(Lecture_info.lecture_info)

    app.config['JWT_SECRET_KEY'] = "I'M IML."
    app.config['JWT_TOKEN_LOCATION'] = ['cookies']
    app.config['JWT_COOKIE_SECURE'] = False
    app.config['JWT_COOKIE_CSRF_PROTECT'] = True
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 30
    app.config['JWT_REFRESH_TOKEN_EXPIRES'] = 100
    jwt = JWTManager(app)

    CORS(app, support_credentials=True)

    return app