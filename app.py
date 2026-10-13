import os
import csv
import io
from functools import wraps
from datetime import datetime
from flask import Flask, render_template, request, redirect, url_for, session, flash, make_response
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import database
import face_engine

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'autodence-ai-attendance-secret-key-2026')

# Upload configs
PROFILE_UPLOAD_FOLDER = os.path.join(app.root_path, 'static', 'uploads', 'profiles')
SESSION_UPLOAD_FOLDER = os.path.join(app.root_path, 'static', 'uploads', 'sessions')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}

app.config['PROFILE_UPLOAD_FOLDER'] = PROFILE_UPLOAD_FOLDER
app.config['SESSION_UPLOAD_FOLDER'] = SESSION_UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB max

os.makedirs(PROFILE_UPLOAD_FOLDER, exist_ok=True)
os.makedirs(SESSION_UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

with app.app_context():
    database.init_db()

# ----------------- AUTHENTICATION HELPERS & DECORATORS ----------------- #

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('Please log in to access this page.', 'warning')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

def role_required(*allowed_roles):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if 'user_id' not in session:
                flash('Please log in first.', 'warning')
                return redirect(url_for('login'))
            user_role = session.get('role')
            if user_role not in allowed_roles:
                flash(f'Access denied. Your account ({user_role}) does not have permission to access that portal.', 'danger')
                if user_role == 'student':
                    return redirect(url_for('student_dashboard'))
                elif user_role == 'teacher':
                    return redirect(url_for('teacher_dashboard'))
                return redirect(url_for('index'))
            return f(*args, **kwargs)
        return decorated_function
    return decorator

@app.context_processor
def inject_user():
    return {
        'current_user': {
            'is_authenticated': 'user_id' in session,
            'id': session.get('user_id'),
            'role': session.get('role'),
            'full_name': session.get('full_name'),
            'email': session.get('email')
        }
    }

# ----------------- COMMON ROUTES ----------------- #

@app.route('/')
def index():
    if 'user_id' in session:
        if session.get('role') == 'student':
            return redirect(url_for('student_dashboard'))
        elif session.get('role') == 'teacher':
            return redirect(url_for('teacher_dashboard'))
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if 'user_id' in session:
        if session.get('role') == 'student':
            return redirect(url_for('student_dashboard'))
        elif session.get('role') == 'teacher':
            return redirect(url_for('teacher_dashboard'))

    selected_role = request.args.get('role', 'student')
    if selected_role not in ['student', 'teacher']:
        selected_role = 'student'

    if request.method == 'POST':
        role = request.form.get('role', '').strip().lower()
        identifier = request.form.get('identifier', '').strip()
        password = request.form.get('password', '')

        if not identifier or not password or not role:
            flash('All fields are required.', 'danger')
            return render_template('login.html', selected_role=role or 'student', identifier=identifier)

        if role not in ['student', 'teacher']:
            flash('Please select a valid role.', 'danger')
            return render_template('login.html', selected_role='student', identifier=identifier)

        user = database.find_user_for_login(identifier, role)

        if not user or not check_password_hash(user['password_hash'], password):
            flash('Invalid credentials. Please verify your Email/ID and password.', 'danger')
            return render_template('login.html', selected_role=role, identifier=identifier)

        session.clear()
        session['user_id'] = user['id']
        session['role'] = user['role']
        session['full_name'] = user['full_name']
        session['email'] = user['email']

        flash(f'Welcome back, {user["full_name"]}!', 'success')
        if user['role'] == 'student':
            return redirect(url_for('student_dashboard'))
        elif user['role'] == 'teacher':
            return redirect(url_for('teacher_dashboard'))
        return redirect(url_for('index'))

    return render_template('login.html', selected_role=selected_role)

@app.route('/register/student', methods=['GET', 'POST'])
def register_student():
    if 'user_id' in session:
        return redirect(url_for('index'))

    branches = database.get_all_branches()

    if request.method == 'POST':
        full_name = request.form.get('full_name', '').strip()
        usn = request.form.get('usn', '').strip().upper()
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')
        confirm_password = request.form.get('confirm_password', '')
        branch_code = request.form.get('branch_code', '').strip().upper()
        semester = request.form.get('semester', '').strip()
        section = request.form.get('section', '').strip().upper()

        form_data = {
            'full_name': full_name, 'usn': usn, 'email': email,
            'branch_code': branch_code, 'semester': semester, 'section': section
        }

        if not (full_name and usn and email and password and confirm_password and branch_code and semester and section):
            flash('All fields marked with * are required.', 'danger')
            return render_template('register_student.html', branches=branches, data=form_data)

        if len(password) < 6:
            flash('Password must be at least 6 characters long.', 'danger')
            return render_template('register_student.html', branches=branches, data=form_data)

        if password != confirm_password:
            flash('Passwords do not match. Please re-enter.', 'danger')
            return render_template('register_student.html', branches=branches, data=form_data)

        try:
            sem_int = int(semester)
            if sem_int < 1 or sem_int > 8:
                raise ValueError()
        except ValueError:
            flash('Semester must be an integer between 1 and 8.', 'danger')
            return render_template('register_student.html', branches=branches, data=form_data)

        profile_filename = None
        if 'profile_photo' in request.files:
            file = request.files['profile_photo']
            if file and file.filename != '' and allowed_file(file.filename):
                safe_name = f"{usn}_{secure_filename(file.filename)}"
                file.save(os.path.join(app.config['PROFILE_UPLOAD_FOLDER'], safe_name))
                profile_filename = safe_name

        password_hash = generate_password_hash(password)
        success, error_msg, user_id = database.register_student(
            full_name=full_name, usn=usn, email=email,
            password_hash=password_hash, branch_code=branch_code,
            semester=sem_int, section=section, profile_photo=profile_filename
        )

        if not success:
            flash(error_msg, 'danger')
            return render_template('register_student.html', branches=branches, data=form_data)

        flash(f'Student registration successful for {usn}! You can now log in.', 'success')
        return redirect(url_for('login', role='student'))

    return render_template('register_student.html', branches=branches, data={})

@app.route('/register/teacher', methods=['GET', 'POST'])
def register_teacher():
    if 'user_id' in session:
        return redirect(url_for('index'))

    branches = database.get_all_branches()

    if request.method == 'POST':
        full_name = request.form.get('full_name', '').strip()
        employee_id = request.form.get('employee_id', '').strip().upper()
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')
        confirm_password = request.form.get('confirm_password', '')
        branch_code = request.form.get('branch_code', '').strip().upper()

        form_data = {
            'full_name': full_name, 'employee_id': employee_id,
            'email': email, 'branch_code': branch_code
        }

        if not (full_name and employee_id and email and password and confirm_password and branch_code):
            flash('All fields are required.', 'danger')
            return render_template('register_teacher.html', branches=branches, data=form_data)

        if len(password) < 6:
            flash('Password must be at least 6 characters long.', 'danger')
            return render_template('register_teacher.html', branches=branches, data=form_data)

        if password != confirm_password:
            flash('Passwords do not match. Please re-enter.', 'danger')
            return render_template('register_teacher.html', branches=branches, data=form_data)

        password_hash = generate_password_hash(password)
        success, error_msg, user_id = database.register_teacher(
            full_name=full_name, employee_id=employee_id, email=email,
            password_hash=password_hash, branch_code=branch_code
        )

        if not success:
            flash(error_msg, 'danger')
            return render_template('register_teacher.html', branches=branches, data=form_data)

        flash(f'Teacher registration successful for ID {employee_id}! (Prototype policy: Approved). You can now log in.', 'success')
        return redirect(url_for('login', role='teacher'))

    return render_template('register_teacher.html', branches=branches, data={})

# ----------------- PHASE 2: STUDENT PORTAL ROUTES ----------------- #

@app.route('/student/dashboard')
@role_required('student')
def student_dashboard():
    student = database.get_student_by_user_id(session['user_id'])
    if not student:
        flash('Student record not found.', 'danger')
        return redirect(url_for('logout'))

    student_id = student['student_id']
    summary = database.get_student_attendance_summary(student_id)
    subjects = database.get_student_subject_attendance(student_id)
    recent_records = database.get_student_recent_records(student_id, limit=8)

    return render_template(
        'student_dashboard.html',
        student=student,
        summary=summary,
        subjects=subjects,
        recent_records=recent_records
    )

@app.route('/student/profile', methods=['GET', 'POST'])
@role_required('student')
def student_profile():
    student = database.get_student_by_user_id(session['user_id'])
    if not student:
        flash('Student record not found.', 'danger')
        return redirect(url_for('logout'))

    if request.method == 'POST':
        full_name = request.form.get('full_name', '').strip()
        if not full_name:
            flash('Name cannot be empty.', 'danger')
            return render_template('student_profile.html', student=student)

        profile_filename = student['profile_photo']
        if 'profile_photo' in request.files:
            file = request.files['profile_photo']
            if file and file.filename != '' and allowed_file(file.filename):
                safe_name = f"{student['usn']}_{secure_filename(file.filename)}"
                file.save(os.path.join(app.config['PROFILE_UPLOAD_FOLDER'], safe_name))
                profile_filename = safe_name

        success, err = database.update_student_profile(session['user_id'], full_name, profile_filename)
        if success:
            session['full_name'] = full_name
            flash('Profile updated successfully!', 'success')
            return redirect(url_for('student_profile'))
        else:
            flash(f'Error updating profile: {err}', 'danger')

    return render_template('student_profile.html', student=student)

@app.route('/student/register-face', methods=['GET', 'POST'])
@role_required('student')
def student_register_face():
    student = database.get_student_by_user_id(session['user_id'])
    if not student:
        flash('Student record not found.', 'danger')
        return redirect(url_for('logout'))

    if request.method == 'POST':
        if 'face_photo' not in request.files:
            flash('No file was uploaded.', 'danger')
            return render_template('student_register_face.html', student=student)

        file = request.files['face_photo']
        if file.filename == '' or not allowed_file(file.filename):
            flash('Please upload a valid image (JPG, PNG, WEBP).', 'danger')
            return render_template('student_register_face.html', student=student)

        safe_name = f"{student['usn']}_face_{secure_filename(file.filename)}"
        save_path = os.path.join(app.config['PROFILE_UPLOAD_FOLDER'], safe_name)
        file.save(save_path)

        # Update database with validated photo
        success, err = database.update_student_profile(session['user_id'], student['full_name'], safe_name)
        if success:
            flash('Biometric face photo registered successfully! Ready for AI group-photo matching.', 'success')
            return redirect(url_for('student_dashboard'))
        else:
            flash(f'Failed to register photo: {err}', 'danger')

    return render_template('student_register_face.html', student=student)

@app.route('/student/request-correction', methods=['POST'])
@role_required('student')
def student_request_correction():
    student = database.get_student_by_user_id(session['user_id'])
    if not student:
        return redirect(url_for('logout'))

    record_id = request.form.get('record_id')
    reason = request.form.get('reason', '').strip()

    if not record_id or not reason:
        flash('Correction reason is required.', 'danger')
        return redirect(url_for('student_dashboard'))

    success, err = database.submit_correction_request(int(record_id), student['student_id'], reason)
    if success:
        flash('Attendance correction request submitted to your faculty for review.', 'success')
    else:
        flash(f'Unable to submit request: {err}', 'warning')

    return redirect(url_for('student_dashboard'))

@app.route('/student/disputes')
@role_required('student')
def student_disputes():
    student = database.get_student_by_user_id(session['user_id'])
    if not student:
        return redirect(url_for('logout'))

    disputes = database.get_student_correction_requests(student['student_id'])
    return render_template('student_disputes.html', student=student, disputes=disputes)

# ----------------- PHASE 3 & 4: TEACHER PORTAL ROUTES ----------------- #

@app.route('/teacher/dashboard')
@role_required('teacher')
def teacher_dashboard():
    teacher = database.get_teacher_by_user_id(session['user_id'])
    if not teacher:
        flash('Teacher record not found.', 'danger')
        return redirect(url_for('logout'))

    branches = database.get_all_branches()
    selected_branch = request.args.get('branch', teacher['branch_code'])
    selected_semester = request.args.get('semester', '')
    selected_section = request.args.get('section', '')
    search_query = request.args.get('search', '')

    students = database.get_students_filtered(
        branch_code=selected_branch,
        semester=selected_semester,
        section=selected_section,
        search=search_query
    )

    stats = database.get_teacher_dashboard_stats(branch_code=selected_branch)
    low_attendance_list = database.get_low_attendance_students(branch_code=selected_branch, threshold=75.0)

    return render_template(
        'teacher_dashboard.html',
        teacher=teacher,
        branches=branches,
        students=students,
        stats=stats,
        low_attendance_list=low_attendance_list,
        selected_branch=selected_branch,
        selected_semester=selected_semester,
        selected_section=selected_section,
        search_query=search_query
    )

@app.route('/teacher/ai-attendance', methods=['GET', 'POST'])
@role_required('teacher')
def teacher_ai_attendance():
    teacher = database.get_teacher_by_user_id(session['user_id'])
    if not teacher:
        return redirect(url_for('logout'))

    branches = database.get_all_branches()
    subjects = database.get_subjects_by_branch_and_semester(teacher['branch_code'])

    if request.method == 'POST':
        branch_code = request.form.get('branch_code', teacher['branch_code']).strip()
        semester = request.form.get('semester', '6').strip()
        section = request.form.get('section', 'A').strip().upper()
        subject_name = request.form.get('subject_name', '').strip()
        session_date = request.form.get('session_date', datetime.now().strftime('%Y-%m-%d'))
        session_time = request.form.get('session_time', datetime.now().strftime('%H:%M:%S'))

        if 'classroom_photo' not in request.files or not subject_name:
            flash('Please select a subject and upload a classroom photo.', 'danger')
            return render_template('teacher_ai_attendance.html', teacher=teacher, branches=branches, subjects=subjects)

        photo = request.files['classroom_photo']
        if photo.filename == '' or not allowed_file(photo.filename):
            flash('Please upload a valid classroom group image (JPG, PNG, WEBP).', 'danger')
            return render_template('teacher_ai_attendance.html', teacher=teacher, branches=branches, subjects=subjects)

        # Save uploaded classroom photo
        timestamp_str = datetime.now().strftime('%Y%m%d_%H%M%S')
        raw_filename = f"group_{branch_code}_sem{semester}_{timestamp_str}_{secure_filename(photo.filename)}"
        raw_path = os.path.join(app.config['SESSION_UPLOAD_FOLDER'], raw_filename)
        photo.save(raw_path)

        annotated_filename = f"annotated_{raw_filename}"
        annotated_path = os.path.join(app.config['SESSION_UPLOAD_FOLDER'], annotated_filename)

        # Fetch eligible students strictly in this branch, semester, section
        roster_students = database.get_students_filtered(branch_code=branch_code, semester=semester, section=section)

        if not roster_students:
            flash(f'No students registered in roster: {branch_code} Sem {semester} Section {section}.', 'warning')
            return render_template('teacher_ai_attendance.html', teacher=teacher, branches=branches, subjects=subjects)

        # Process OpenCV face detection and recognition
        ai_result = face_engine.process_classroom_attendance(
            group_photo_path=raw_path,
            annotated_save_path=annotated_path,
            roster_students=roster_students,
            upload_folder=app.config['PROFILE_UPLOAD_FOLDER']
        )

        # Store session payload in session for confirmation
        provisional_data = {
            'teacher_id': teacher['teacher_id'],
            'branch_code': branch_code,
            'semester': semester,
            'section': section,
            'subject_name': subject_name,
            'session_date': session_date,
            'session_time': session_time,
            'photo_filename': annotated_filename,
            'ai_result': ai_result
        }

        return render_template('teacher_review_attendance.html', teacher=teacher, data=provisional_data)

    return render_template('teacher_ai_attendance.html', teacher=teacher, branches=branches, subjects=subjects)

@app.route('/teacher/save-attendance', methods=['POST'])
@role_required('teacher')
def teacher_save_attendance():
    teacher = database.get_teacher_by_user_id(session['user_id'])
    if not teacher:
        return redirect(url_for('logout'))

    branch_code = request.form.get('branch_code')
    semester = request.form.get('semester')
    section = request.form.get('section')
    subject_name = request.form.get('subject_name')
    session_date = request.form.get('session_date')
    session_time = request.form.get('session_time')
    photo_filename = request.form.get('photo_filename')
    faces_detected = int(request.form.get('faces_detected', 0))
    faces_matched = int(request.form.get('faces_matched', 0))
    faces_unrecognized = int(request.form.get('faces_unrecognized', 0))

    # Parse student records from review form
    student_ids = request.form.getlist('student_id[]')
    records = []
    for s_id in student_ids:
        status = request.form.get(f'status_{s_id}', 'Absent')
        confidence_val = request.form.get(f'confidence_{s_id}', '0.0')
        try:
            conf = float(confidence_val)
        except ValueError:
            conf = 0.0

        records.append({
            'student_id': int(s_id),
            'status': status,
            'confidence': conf,
            'marking_method': 'AI_Photo',
            'remarks': 'Confirmed by teacher review'
        })

    success, err, session_id = database.save_attendance_session(
        teacher_id=teacher['teacher_id'],
        branch_code=branch_code,
        semester=semester,
        section=section,
        subject_name=subject_name,
        session_date=session_date,
        session_time=session_time,
        photo_filename=photo_filename,
        records=records,
        faces_detected=faces_detected,
        faces_matched=faces_matched,
        faces_unrecognized=faces_unrecognized
    )

    if success:
        flash(f'Attendance session #{session_id} saved successfully! {len(records)} students recorded.', 'success')
        return redirect(url_for('teacher_session_details', session_id=session_id))
    else:
        flash(f'Failed to save attendance: {err}', 'danger')
        return redirect(url_for('teacher_ai_attendance'))

@app.route('/teacher/history')
@role_required('teacher')
def teacher_history():
    teacher = database.get_teacher_by_user_id(session['user_id'])
    if not teacher:
        return redirect(url_for('logout'))

    branches = database.get_all_branches()
    selected_branch = request.args.get('branch', teacher['branch_code'])
    selected_semester = request.args.get('semester', '')
    selected_section = request.args.get('section', '')

    sessions = database.get_attendance_sessions_list(
        branch_code=selected_branch,
        semester=selected_semester,
        section=selected_section
    )

    return render_template(
        'teacher_history.html',
        teacher=teacher,
        branches=branches,
        sessions=sessions,
        selected_branch=selected_branch,
        selected_semester=selected_semester,
        selected_section=selected_section
    )

@app.route('/teacher/session/<int:session_id>')
@role_required('teacher')
def teacher_session_details(session_id):
    teacher = database.get_teacher_by_user_id(session['user_id'])
    if not teacher:
        return redirect(url_for('logout'))

    session_info, records = database.get_session_details(session_id)
    if not session_info:
        flash('Attendance session not found.', 'danger')
        return redirect(url_for('teacher_history'))

    return render_template('teacher_session_detail.html', teacher=teacher, session_info=session_info, records=records)

@app.route('/teacher/export-csv')
@role_required('teacher')
def teacher_export_csv():
    teacher = database.get_teacher_by_user_id(session['user_id'])
    if not teacher:
        return redirect(url_for('logout'))

    selected_branch = request.args.get('branch', teacher['branch_code'])
    selected_semester = request.args.get('semester', '')
    selected_section = request.args.get('section', '')

    records = database.get_all_attendance_records_for_export(
        branch_code=selected_branch,
        semester=selected_semester,
        section=selected_section
    )

    si = io.StringIO()
    cw = csv.writer(si)
    cw.writerow(['Session Date', 'Session Time', 'Subject', 'Branch', 'Semester', 'Section', 
                 'Student USN', 'Student Name', 'Status', 'Marking Method', 'Confidence (%)', 'Teacher Name'])

    for r in records:
        cw.writerow([
            r['session_date'], r['session_time'], r['subject_name'], r['branch_code'],
            r['semester'], r['section'], r['usn'], r['student_name'],
            r['status'], r['marking_method'], f"{r['confidence'] or 0.0}%", r['teacher_name']
        ])

    output = make_response(si.getvalue())
    output.headers["Content-Disposition"] = f"attachment; filename=autodence_{selected_branch}_attendance_{datetime.now().strftime('%Y%m%d')}.csv"
    output.headers["Content-type"] = "text/csv"
    return output

@app.route('/teacher/corrections', methods=['GET', 'POST'])
@role_required('teacher')
def teacher_corrections():
    teacher = database.get_teacher_by_user_id(session['user_id'])
    if not teacher:
        return redirect(url_for('logout'))

    if request.method == 'POST':
        request_id = request.form.get('request_id')
        decision = request.form.get('decision')  # Approved or Rejected
        remarks = request.form.get('review_remarks', '')

        if request_id and decision in ['Approved', 'Rejected']:
            new_status = 'Present' if decision == 'Approved' else None
            success, err = database.review_correction_request(int(request_id), decision, remarks, new_status)
            if success:
                flash(f'Correction request #{request_id} has been {decision}.', 'success')
            else:
                flash(f'Failed to update request: {err}', 'danger')
        return redirect(url_for('teacher_corrections'))

    pending_requests = database.get_pending_correction_requests(branch_code=teacher['branch_code'])
    return render_template('teacher_corrections.html', teacher=teacher, requests=pending_requests)

@app.route('/logout')
def logout():
    session.clear()
    flash('You have been logged out successfully.', 'info')
    return redirect(url_for('login'))

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug_mode = os.environ.get('FLASK_DEBUG', '1') == '1'
    app.run(host='0.0.0.0', port=port, debug=debug_mode)
