import os
import io
import unittest
from werkzeug.security import generate_password_hash
import database
from app import app
import seed_demo

class FullAppTestSuite(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        app.config['WTF_CSRF_ENABLED'] = False
        self.client = app.test_client()
        seed_demo.seed()

    def test_homepage(self):
        res = self.client.get('/')
        self.assertEqual(res.status_code, 200)
        self.assertIn(b'AUTODENCE', res.data)
        self.assertIn(b'Student Portal', res.data)
        self.assertIn(b'Teacher Portal', res.data)

    def test_student_workflow(self):
        # 1. Login as student Rahul Verma
        res = self.client.post('/login', data={
            'role': 'student',
            'identifier': '1RV21CS001',
            'password': 'password123'
        }, follow_redirects=True)
        self.assertEqual(res.status_code, 200)
        self.assertIn(b'Rahul Verma', res.data)
        self.assertIn(b'Student Dashboard', res.data)

        # 2. View student profile
        res_prof = self.client.get('/student/profile')
        self.assertEqual(res_prof.status_code, 200)
        self.assertIn(b'Profile Settings', res_prof.data)
        self.assertIn(b'1RV21CS001', res_prof.data)

        # 3. Update student profile
        res_prof_update = self.client.post('/student/profile', data={
            'full_name': 'Rahul V. Sharma'
        }, follow_redirects=True)
        self.assertEqual(res_prof_update.status_code, 200)
        self.assertIn(b'Profile updated successfully', res_prof_update.data)

        # 4. View face registration page
        res_face = self.client.get('/student/register-face')
        self.assertEqual(res_face.status_code, 200)
        self.assertIn(b'Facial Biometric Enrollment', res_face.data)

        # 5. Enroll face photo (simulate upload)
        dummy_img = (io.BytesIO(b"fake image data"), 'rahul_face.jpg')
        res_face_upload = self.client.post('/student/register-face', data={
            'face_photo': dummy_img
        }, content_type='multipart/form-data', follow_redirects=True)
        self.assertEqual(res_face_upload.status_code, 200)
        self.assertIn(b'Biometric face photo registered successfully', res_face_upload.data)

        # 6. View student disputes page
        res_disp = self.client.get('/student/disputes')
        self.assertEqual(res_disp.status_code, 200)
        self.assertIn(b'Attendance Correction Requests', res_disp.data)

        # 7. Student submits a new dispute / correction request
        # First get a record ID
        student = database.get_student_by_user_id(database.get_user_by_email('rahul.cs21@college.edu')['id'])
        recent = database.get_student_recent_records(student['student_id'])
        if recent:
            record_id = recent[0]['record_id']
            res_sub = self.client.post('/student/request-correction', data={
                'record_id': record_id,
                'reason': 'Present in lecture hall, need confirmation'
            }, follow_redirects=True)
            self.assertEqual(res_sub.status_code, 200)

        # Logout
        self.client.get('/logout')

    def test_teacher_workflow(self):
        # 1. Login as teacher Dr. Ramesh Sharma
        res = self.client.post('/login', data={
            'role': 'teacher',
            'identifier': 'EMP1024',
            'password': 'password123'
        }, follow_redirects=True)
        self.assertEqual(res.status_code, 200)
        self.assertIn(b'Dr. Ramesh Sharma', res.data)
        self.assertIn(b'Faculty Dashboard', res.data)

        # 2. View AI Attendance capture page
        res_ai_att = self.client.get('/teacher/ai-attendance')
        self.assertEqual(res_ai_att.status_code, 200)
        self.assertIn(b'AI Classroom Attendance Capture', res_ai_att.data)

        # 3. View Attendance Session History
        res_hist = self.client.get('/teacher/history')
        self.assertEqual(res_hist.status_code, 200)
        self.assertIn(b'Classroom Attendance Archive', res_hist.data)
        self.assertIn(b'Machine Learning', res_hist.data)

        # 4. View Session Details
        sessions = database.get_attendance_sessions_list(branch_code='CSE')
        self.assertTrue(len(sessions) > 0)
        sess_id = sessions[0]['id']
        res_det = self.client.get(f'/teacher/session/{sess_id}')
        self.assertEqual(res_det.status_code, 200)
        self.assertIn(b'Student Roster Attendance Records', res_det.data)

        # 5. Export Attendance CSV
        res_csv = self.client.get('/teacher/export-csv?branch=CSE')
        self.assertEqual(res_csv.status_code, 200)
        self.assertIn('text/csv', res_csv.content_type)
        self.assertIn(b'Session Date', res_csv.data)

        # 6. View Corrections Inbox
        res_corr = self.client.get('/teacher/corrections')
        self.assertEqual(res_corr.status_code, 200)
        self.assertIn(b'Student Attendance Dispute Inbox', res_corr.data)
        self.assertIn(b'Ananya Rao', res_corr.data)

        # 7. Approve Dispute
        pending = database.get_pending_correction_requests(branch_code='CSE')
        self.assertTrue(len(pending) > 0)
        req_id = pending[0]['request_id']
        res_app = self.client.post('/teacher/corrections', data={
            'request_id': req_id,
            'decision': 'Approved',
            'review_remarks': 'Verified via seat arrangement'
        }, follow_redirects=True)
        self.assertEqual(res_app.status_code, 200)
        self.assertIn(b'has been Approved', res_app.data)

        # 8. Save a manual / review attendance session
        cse_students = database.get_students_filtered(branch_code='CSE', semester=6, section='A')
        save_data = {
            'branch_code': 'CSE',
            'semester': '6',
            'section': 'A',
            'subject_name': 'Full Stack Engineering',
            'session_date': '2026-10-14',
            'session_time': '11:00:00',
            'photo_filename': '',
            'faces_detected': '4',
            'faces_matched': '4',
            'faces_unrecognized': '0',
            'student_id[]': [str(s['id']) for s in cse_students]
        }
        for s in cse_students:
            save_data[f'status_{s["id"]}'] = 'Present'
            save_data[f'confidence_{s["id"]}'] = '95.0'

        res_save = self.client.post('/teacher/save-attendance', data=save_data, follow_redirects=True)
        self.assertEqual(res_save.status_code, 200)
        self.assertIn(b'saved successfully', res_save.data)

if __name__ == '__main__':
    unittest.main()
