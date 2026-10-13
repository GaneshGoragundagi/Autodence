import sqlite3
import os
import supabase_client

DB_PATH = os.path.join(os.path.dirname(__file__), 'autodence.db')
SCHEMA_PATH = os.path.join(os.path.dirname(__file__), 'schema.sql')

def is_supabase_configured():
    return supabase_client.is_configured()

def get_supabase_client():
    return supabase_client

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

def init_db():
    conn = get_db()
    with open(SCHEMA_PATH, 'r', encoding='utf-8') as f:
        conn.executescript(f.read())
    conn.commit()
    conn.close()

def get_all_branches():
    conn = get_db()
    branches = conn.execute("SELECT code, name FROM branches ORDER BY name ASC").fetchall()
    conn.close()
    return branches

def get_user_by_email(email):
    conn = get_db()
    user = conn.execute("SELECT * FROM users WHERE LOWER(email) = LOWER(?)", (email.strip(),)).fetchone()
    conn.close()
    return user

def get_user_by_id(user_id):
    conn = get_db()
    user = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    conn.close()
    return user

def find_user_for_login(identifier, role):
    conn = get_db()
    identifier = identifier.strip()
    
    if role == 'student':
        query = """
            SELECT u.*, s.usn, s.branch_code, s.semester, s.section, s.profile_photo, s.id as student_id
            FROM users u
            JOIN students s ON u.id = s.user_id
            WHERE u.role = 'student' AND (LOWER(u.email) = LOWER(?) OR LOWER(s.usn) = LOWER(?))
        """
        user = conn.execute(query, (identifier, identifier)).fetchone()
    elif role == 'teacher':
        query = """
            SELECT u.*, t.employee_id, t.branch_code, t.is_approved, t.id as teacher_id
            FROM users u
            JOIN teachers t ON u.id = t.user_id
            WHERE u.role = 'teacher' AND (LOWER(u.email) = LOWER(?) OR LOWER(t.employee_id) = LOWER(?))
        """
        user = conn.execute(query, (identifier, identifier)).fetchone()
    else:
        user = None
        
    conn.close()
    return user

def register_student(full_name, usn, email, password_hash, branch_code, semester, section, profile_photo=None):
    conn = get_db()
    try:
        existing_email = conn.execute("SELECT id FROM users WHERE LOWER(email) = LOWER(?)", (email.strip(),)).fetchone()
        if existing_email:
            return False, "An account with this email address already exists.", None

        existing_usn = conn.execute("SELECT id FROM students WHERE LOWER(usn) = LOWER(?)", (usn.strip(),)).fetchone()
        if existing_usn:
            return False, f"A student with USN '{usn.strip().upper()}' is already registered.", None

        branch = conn.execute("SELECT code FROM branches WHERE code = ?", (branch_code,)).fetchone()
        if not branch:
            return False, "Invalid branch selected.", None

        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO users (email, password_hash, role, full_name) VALUES (?, ?, 'student', ?)",
            (email.strip().lower(), password_hash, full_name.strip())
        )
        user_id = cursor.lastrowid

        face_reg = 1 if profile_photo else 0
        cursor.execute(
            """INSERT INTO students (user_id, usn, branch_code, semester, section, profile_photo, face_registered)
               VALUES (?, ?, ?, ?, ?, ?, ?)""",
            (user_id, usn.strip().upper(), branch_code, int(semester), section.strip().upper(), profile_photo, face_reg)
        )
        conn.commit()
        return True, None, user_id
    except sqlite3.IntegrityError as e:
        conn.rollback()
        return False, f"Database constraint violation: {str(e)}", None
    except Exception as e:
        conn.rollback()
        return False, f"Unexpected error: {str(e)}", None
    finally:
        conn.close()

def register_teacher(full_name, employee_id, email, password_hash, branch_code):
    conn = get_db()
    try:
        existing_email = conn.execute("SELECT id FROM users WHERE LOWER(email) = LOWER(?)", (email.strip(),)).fetchone()
        if existing_email:
            return False, "An account with this email address already exists.", None

        existing_emp = conn.execute("SELECT id FROM teachers WHERE LOWER(employee_id) = LOWER(?)", (employee_id.strip(),)).fetchone()
        if existing_emp:
            return False, f"A teacher with Employee ID '{employee_id.strip().upper()}' is already registered.", None

        branch = conn.execute("SELECT code FROM branches WHERE code = ?", (branch_code,)).fetchone()
        if not branch:
            return False, "Invalid branch selected.", None

        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO users (email, password_hash, role, full_name) VALUES (?, ?, 'teacher', ?)",
            (email.strip().lower(), password_hash, full_name.strip())
        )
        user_id = cursor.lastrowid

        cursor.execute(
            """INSERT INTO teachers (user_id, employee_id, branch_code, is_approved)
               VALUES (?, ?, ?, 1)""",
            (user_id, employee_id.strip().upper(), branch_code)
        )
        conn.commit()
        return True, None, user_id
    except sqlite3.IntegrityError as e:
        conn.rollback()
        return False, f"Database constraint violation: {str(e)}", None
    except Exception as e:
        conn.rollback()
        return False, f"Unexpected error: {str(e)}", None
    finally:
        conn.close()

def get_student_by_user_id(user_id):
    conn = get_db()
    query = """
        SELECT u.id as user_id, u.email, u.full_name, u.created_at as joined_date,
               s.id as student_id, s.usn, s.branch_code, s.semester, s.section, s.profile_photo,
               s.face_registered, b.name as branch_name
        FROM users u
        JOIN students s ON u.id = s.user_id
        JOIN branches b ON s.branch_code = b.code
        WHERE u.id = ?
    """
    student = conn.execute(query, (user_id,)).fetchone()
    conn.close()
    return student

def update_student_profile(user_id, full_name, profile_photo=None):
    conn = get_db()
    try:
        conn.execute("UPDATE users SET full_name = ? WHERE id = ?", (full_name.strip(), user_id))
        if profile_photo:
            conn.execute(
                "UPDATE students SET profile_photo = ?, face_registered = 1 WHERE user_id = ?",
                (profile_photo, user_id)
            )
        conn.commit()
        return True, None
    except Exception as e:
        conn.rollback()
        return False, str(e)
    finally:
        conn.close()

def get_teacher_by_user_id(user_id):
    conn = get_db()
    query = """
        SELECT u.id as user_id, u.email, u.full_name, u.created_at as joined_date,
               t.id as teacher_id, t.employee_id, t.branch_code, t.is_approved,
               b.name as branch_name
        FROM users u
        JOIN teachers t ON u.id = t.user_id
        JOIN branches b ON t.branch_code = b.code
        WHERE u.id = ?
    """
    teacher = conn.execute(query, (user_id,)).fetchone()
    conn.close()
    return teacher

def get_students_filtered(branch_code=None, semester=None, section=None, search=None):
    conn = get_db()
    query = """
        SELECT s.id, s.usn, s.semester, s.section, s.profile_photo, s.face_registered, s.created_at,
               u.full_name, u.email, b.code as branch_code, b.name as branch_name
        FROM students s
        JOIN users u ON s.user_id = u.id
        JOIN branches b ON s.branch_code = b.code
        WHERE 1=1
    """
    params = []

    if branch_code and branch_code != 'ALL':
        query += " AND s.branch_code = ?"
        params.append(branch_code)

    if semester:
        try:
            sem_int = int(semester)
            query += " AND s.semester = ?"
            params.append(sem_int)
        except ValueError:
            pass

    if section and section != 'ALL':
        query += " AND UPPER(s.section) = UPPER(?)"
        params.append(section.strip())

    if search:
        search_term = f"%{search.strip().lower()}%"
        query += " AND (LOWER(u.full_name) LIKE ? OR LOWER(s.usn) LIKE ? OR LOWER(u.email) LIKE ?)"
        params.extend([search_term, search_term, search_term])

    query += " ORDER BY b.code ASC, s.semester ASC, s.section ASC, s.usn ASC"
    students = conn.execute(query, params).fetchall()
    conn.close()
    return students

# ----------------- PHASE 2: STUDENT ATTENDANCE ANALYTICS ----------------- #

def get_student_attendance_summary(student_id):
    conn = get_db()
    # Total conducted classes for which this student has records
    query = """
        SELECT 
            COUNT(ar.id) as total_conducted,
            SUM(CASE WHEN ar.status = 'Present' THEN 1 ELSE 0 END) as attended,
            SUM(CASE WHEN ar.status = 'Absent' THEN 1 ELSE 0 END) as missed
        FROM attendance_records ar
        WHERE ar.student_id = ?
    """
    res = conn.execute(query, (student_id,)).fetchone()
    conn.close()

    total = res['total_conducted'] or 0
    attended = res['attended'] or 0
    missed = res['missed'] or 0
    percentage = round((attended / total * 100), 1) if total > 0 else 0.0

    return {
        'total_conducted': total,
        'attended': attended,
        'missed': missed,
        'percentage': percentage,
        'is_low_attendance': percentage < 75.0 if total > 0 else False
    }

def get_student_subject_attendance(student_id):
    conn = get_db()
    query = """
        SELECT 
            s.subject_name,
            COUNT(ar.id) as total_conducted,
            SUM(CASE WHEN ar.status = 'Present' THEN 1 ELSE 0 END) as attended,
            SUM(CASE WHEN ar.status = 'Absent' THEN 1 ELSE 0 END) as missed
        FROM attendance_sessions s
        JOIN attendance_records ar ON s.id = ar.session_id
        WHERE ar.student_id = ?
        GROUP BY s.subject_name
        ORDER BY s.subject_name ASC
    """
    rows = conn.execute(query, (student_id,)).fetchall()
    conn.close()

    subjects = []
    for r in rows:
        tot = r['total_conducted']
        att = r['attended']
        pct = round((att / tot * 100), 1) if tot > 0 else 0.0
        subjects.append({
            'subject_name': r['subject_name'],
            'total_conducted': tot,
            'attended': att,
            'missed': r['missed'],
            'percentage': pct,
            'status': 'Good' if pct >= 75.0 else 'Low'
        })
    return subjects

def get_student_recent_records(student_id, limit=10):
    conn = get_db()
    query = """
        SELECT ar.id as record_id, ar.status, ar.confidence, ar.marking_method, ar.created_at,
               s.id as session_id, s.subject_name, s.session_date, s.session_time,
               cr.id as request_id, cr.status as request_status
        FROM attendance_records ar
        JOIN attendance_sessions s ON ar.session_id = s.id
        LEFT JOIN correction_requests cr ON ar.id = cr.record_id
        WHERE ar.student_id = ?
        ORDER BY s.session_date DESC, s.session_time DESC
        LIMIT ?
    """
    records = conn.execute(query, (student_id, limit)).fetchall()
    conn.close()
    return records

def submit_correction_request(record_id, student_id, reason):
    conn = get_db()
    try:
        # Check if request already exists
        existing = conn.execute(
            "SELECT id FROM correction_requests WHERE record_id = ? AND student_id = ?",
            (record_id, student_id)
        ).fetchone()
        if existing:
            return False, "A correction request for this attendance record is already pending."

        conn.execute(
            "INSERT INTO correction_requests (record_id, student_id, reason, status) VALUES (?, ?, ?, 'Pending')",
            (record_id, student_id, reason.strip())
        )
        conn.commit()
        return True, None
    except Exception as e:
        conn.rollback()
        return False, str(e)
    finally:
        conn.close()

def get_student_correction_requests(student_id):
    conn = get_db()
    query = """
        SELECT cr.*, s.subject_name, s.session_date, ar.status as current_status
        FROM correction_requests cr
        JOIN attendance_records ar ON cr.record_id = ar.id
        JOIN attendance_sessions s ON ar.session_id = s.id
        WHERE cr.student_id = ?
        ORDER BY cr.created_at DESC
    """
    reqs = conn.execute(query, (student_id,)).fetchall()
    conn.close()
    return reqs

# ----------------- PHASE 3: TEACHER ATTENDANCE ANALYTICS ----------------- #

def get_teacher_dashboard_stats(branch_code=None):
    conn = get_db()
    # 1. Total students in branch
    query_students = "SELECT COUNT(id) as count FROM students WHERE 1=1"
    params_s = []
    if branch_code and branch_code != 'ALL':
        query_students += " AND branch_code = ?"
        params_s.append(branch_code)
    total_students = conn.execute(query_students, params_s).fetchone()['count'] or 0

    # 2. Total sessions conducted
    query_sess = "SELECT COUNT(id) as count FROM attendance_sessions WHERE 1=1"
    params_sess = []
    if branch_code and branch_code != 'ALL':
        query_sess += " AND branch_code = ?"
        params_sess.append(branch_code)
    total_sessions = conn.execute(query_sess, params_sess).fetchone()['count'] or 0

    # 3. Present and Absent counts
    query_recs = """
        SELECT 
            SUM(CASE WHEN ar.status = 'Present' THEN 1 ELSE 0 END) as present,
            SUM(CASE WHEN ar.status = 'Absent' THEN 1 ELSE 0 END) as absent
        FROM attendance_records ar
        JOIN attendance_sessions s ON ar.session_id = s.id
        WHERE 1=1
    """
    params_r = []
    if branch_code and branch_code != 'ALL':
        query_recs += " AND s.branch_code = ?"
        params_r.append(branch_code)
    rec_counts = conn.execute(query_recs, params_r).fetchone()
    present_cnt = rec_counts['present'] or 0
    absent_cnt = rec_counts['absent'] or 0
    total_marked = present_cnt + absent_cnt
    overall_percentage = round((present_cnt / total_marked * 100), 1) if total_marked > 0 else 0.0

    conn.close()
    return {
        'total_students': total_students,
        'total_sessions': total_sessions,
        'present_count': present_cnt,
        'absent_count': absent_cnt,
        'overall_percentage': overall_percentage
    }

def get_low_attendance_students(branch_code=None, threshold=75.0):
    conn = get_db()
    query = """
        SELECT s.id as student_id, s.usn, s.semester, s.section, s.branch_code, u.full_name, u.email,
               COUNT(ar.id) as total_conducted,
               SUM(CASE WHEN ar.status = 'Present' THEN 1 ELSE 0 END) as attended,
               SUM(CASE WHEN ar.status = 'Absent' THEN 1 ELSE 0 END) as missed
        FROM students s
        JOIN users u ON s.user_id = u.id
        LEFT JOIN attendance_records ar ON s.id = ar.student_id
        WHERE 1=1
    """
    params = []
    if branch_code and branch_code != 'ALL':
        query += " AND s.branch_code = ?"
        params.append(branch_code)
    query += " GROUP BY s.id HAVING total_conducted > 0"

    rows = conn.execute(query, params).fetchall()
    conn.close()

    low_list = []
    for r in rows:
        tot = r['total_conducted']
        att = r['attended'] or 0
        pct = round((att / tot * 100), 1) if tot > 0 else 0.0
        if pct < threshold:
            low_list.append({
                'student_id': r['student_id'],
                'usn': r['usn'],
                'full_name': r['full_name'],
                'branch_code': r['branch_code'],
                'semester': r['semester'],
                'section': r['section'],
                'email': r['email'],
                'total_conducted': tot,
                'attended': att,
                'missed': r['missed'] or 0,
                'percentage': pct
            })
    return low_list

def get_subjects_by_branch_and_semester(branch_code, semester=None):
    conn = get_db()
    query = "SELECT * FROM subjects WHERE branch_code = ?"
    params = [branch_code]
    if semester:
        query += " AND semester = ?"
        params.append(int(semester))
    query += " ORDER BY name ASC"
    subs = conn.execute(query, params).fetchall()
    conn.close()
    return subs

def get_attendance_sessions_list(branch_code=None, semester=None, section=None):
    conn = get_db()
    query = """
        SELECT s.id, s.subject_name, s.branch_code, s.semester, s.section,
               s.session_date, s.session_time, s.faces_detected, s.faces_matched,
               u.full_name as teacher_name,
               SUM(CASE WHEN ar.status = 'Present' THEN 1 ELSE 0 END) as present_count,
               SUM(CASE WHEN ar.status = 'Absent' THEN 1 ELSE 0 END) as absent_count
        FROM attendance_sessions s
        JOIN teachers t ON s.teacher_id = t.id
        JOIN users u ON t.user_id = u.id
        LEFT JOIN attendance_records ar ON s.id = ar.session_id
        WHERE 1=1
    """
    params = []
    if branch_code and branch_code != 'ALL':
        query += " AND s.branch_code = ?"
        params.append(branch_code)
    if semester:
        query += " AND s.semester = ?"
        params.append(int(semester))
    if section and section != 'ALL':
        query += " AND UPPER(s.section) = UPPER(?)"
        params.append(section.strip())

    query += " GROUP BY s.id ORDER BY s.session_date DESC, s.session_time DESC"
    sessions = conn.execute(query, params).fetchall()
    conn.close()
    return sessions

def get_session_details(session_id):
    conn = get_db()
    session_info = conn.execute("""
        SELECT s.*, u.full_name as teacher_name, b.name as branch_name
        FROM attendance_sessions s
        JOIN teachers t ON s.teacher_id = t.id
        JOIN users u ON t.user_id = u.id
        JOIN branches b ON s.branch_code = b.code
        WHERE s.id = ?
    """, (session_id,)).fetchone()

    if not session_info:
        conn.close()
        return None, []

    records = conn.execute("""
        SELECT ar.*, st.usn, st.semester, st.section, u.full_name as student_name, u.email
        FROM attendance_records ar
        JOIN students st ON ar.student_id = st.id
        JOIN users u ON st.user_id = u.id
        WHERE ar.session_id = ?
        ORDER BY st.usn ASC
    """, (session_id,)).fetchall()
    conn.close()
    return session_info, records

# ----------------- PHASE 4: SAVE ATTENDANCE TRANSACTION ----------------- #

def save_attendance_session(teacher_id, branch_code, semester, section, subject_name,
                            session_date, session_time, photo_filename, records,
                            faces_detected=0, faces_matched=0, faces_unrecognized=0):
    """
    Atomically saves an attendance session and student records with SQLite transaction.
    """
    conn = get_db()
    try:
        cursor = conn.cursor()
        cursor.execute(
            """INSERT INTO attendance_sessions 
               (teacher_id, branch_code, semester, section, subject_name, session_date, session_time,
                classroom_photo, faces_detected, faces_matched, faces_unrecognized)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (teacher_id, branch_code, int(semester), section.strip().upper(), subject_name.strip(),
             session_date, session_time, photo_filename, faces_detected, faces_matched, faces_unrecognized)
        )
        session_id = cursor.lastrowid

        for rec in records:
            student_id = rec['student_id']
            status = rec['status']
            confidence = rec.get('confidence')
            marking_method = rec.get('marking_method', 'AI_Photo')
            remarks = rec.get('remarks', '')

            cursor.execute(
                """INSERT INTO attendance_records 
                   (session_id, student_id, status, confidence, marking_method, remarks)
                   VALUES (?, ?, ?, ?, ?, ?)""",
                (session_id, student_id, status, confidence, marking_method, remarks)
            )

        conn.commit()
        return True, None, session_id
    except sqlite3.IntegrityError as e:
        conn.rollback()
        return False, f"Constraint error saving attendance: {str(e)}", None
    except Exception as e:
        conn.rollback()
        return False, f"Unexpected error: {str(e)}", None
    finally:
        conn.close()

def get_all_attendance_records_for_export(branch_code=None, semester=None, section=None):
    conn = get_db()
    query = """
        SELECT s.session_date, s.session_time, s.subject_name, s.branch_code, s.semester, s.section,
               st.usn, u.full_name as student_name, ar.status, ar.marking_method, ar.confidence,
               t_u.full_name as teacher_name
        FROM attendance_records ar
        JOIN attendance_sessions s ON ar.session_id = s.id
        JOIN students st ON ar.student_id = st.id
        JOIN users u ON st.user_id = u.id
        JOIN teachers t ON s.teacher_id = t.id
        JOIN users t_u ON t.user_id = t_u.id
        WHERE 1=1
    """
    params = []
    if branch_code and branch_code != 'ALL':
        query += " AND s.branch_code = ?"
        params.append(branch_code)
    if semester:
        query += " AND s.semester = ?"
        params.append(int(semester))
    if section and section != 'ALL':
        query += " AND UPPER(s.section) = UPPER(?)"
        params.append(section.strip())

    query += " ORDER BY s.session_date DESC, s.subject_name ASC, st.usn ASC"
    rows = conn.execute(query, params).fetchall()
    conn.close()
    return rows

def get_pending_correction_requests(branch_code=None):
    conn = get_db()
    query = """
        SELECT cr.id as request_id, cr.reason, cr.status as request_status, cr.created_at,
               st.id as student_id, st.usn, u.full_name as student_name, st.branch_code, st.semester, st.section,
               s.id as session_id, s.subject_name, s.session_date, ar.id as record_id, ar.status as current_attendance_status
        FROM correction_requests cr
        JOIN students st ON cr.student_id = st.id
        JOIN users u ON st.user_id = u.id
        JOIN attendance_records ar ON cr.record_id = ar.id
        JOIN attendance_sessions s ON ar.session_id = s.id
        WHERE cr.status = 'Pending'
    """
    params = []
    if branch_code and branch_code != 'ALL':
        query += " AND st.branch_code = ?"
        params.append(branch_code)
    query += " ORDER BY cr.created_at DESC"
    requests = conn.execute(query, params).fetchall()
    conn.close()
    return requests

def review_correction_request(request_id, decision, review_remarks, new_status=None):
    conn = get_db()
    try:
        req = conn.execute("SELECT record_id FROM correction_requests WHERE id = ?", (request_id,)).fetchone()
        if not req:
            return False, "Correction request not found."

        conn.execute(
            "UPDATE correction_requests SET status = ?, review_remarks = ? WHERE id = ?",
            (decision, review_remarks.strip(), request_id)
        )

        if decision == 'Approved' and new_status:
            conn.execute(
                "UPDATE attendance_records SET status = ?, remarks = ? WHERE id = ?",
                (new_status, f"Corrected via request #{request_id}: {review_remarks}", req['record_id'])
            )

        conn.commit()
        return True, None
    except Exception as e:
        conn.rollback()
        return False, str(e)
    finally:
        conn.close()
