from flask import Flask, Blueprint, session, render_template, jsonify, request, flash, redirect

home = Blueprint("home", __name__, url_prefix="/")

@home.before_request
def before_request():
    # if request.scheme == 'http' and not request.is_secure:
    #     # Redirect to HTTPS version of the same URL
    #     url = request.url.replace('http://', 'https://', 1)
    #     return redirect(url, code=301)
    scheme = request.headers.get('X-Forwarded-Proto')
    if scheme and scheme == 'http' and request.url.startswith('http://'):
        url = request.url.replace('http://', 'https://', 1)
        code = 301
        return redirect(url, code=code)

@home.route("/")
@home.route("/index")
def home_index():
    return render_template('/index.html')
    # return render_template('/map_info/edu_analy_map_nopigom.html')

@home.route("/login")
def home_login():
    return render_template('/pages/authentication/simple/login.html')

@home.route("/teacher_type")
def teacher_type():
    return render_template('/member_info/teacher_type_select.html')

@home.route("/oauth_teacher")
def oauth_teacher():
    return render_template('/member_info/oauth_academy.html')33

@home.route("/oauth_teacher_normal")
def oauth_teacher_normal():
    return render_template('/member_info/oauth_academy_normal.html')

@home.route("/nopigom_map")
def nopigom_map():
    return render_template('/map_info/edu_analy_map_nopigom.html')

