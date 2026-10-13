import os
import unittest
from werkzeug.security import check_password_hash
import database
from app import app

class Phase1TestCase(unittest.TestCase):
    def setUp(self):
        # Configure app for testing
        app.config['TESTING'] = True
        app.config['WTF_CSRF_ENABLED'] = False
        self.client = app.test_client()

        # Remove test database if exists to start fresh
        if os.path.exists(database.DB_PATH):
            os.remove(database.DB_PATH)
        database.init_db()

    def test_branches_seeded(self):
        branches = database.get_all_branches()
        branch_codes = [b['code'] for b in branches]
        expected_branches = ['AIML', 'CE', 'CSE', 'ECE', 'EEE', 'ISE', 'ME', 'OTHER']
        for b in expected_branches:
            self.assertIn(b, branch_codes)

    def test_student_registration_and_login(self):
        # Register a CSE student
        response = self.client.post('/register/student', data={
            'full_name': 'Aarav Patel',
            'usn': '1RV21CS001',
            'email': 'aarav.cs21@college.edu',
            'password': 'password123',
            'confirm_password': 'password123',
            'branch_code': 'CSE',
            'semester': '6',
            'section': 'A'
        }, follow_redirects=True)
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Student registration successful', response.data)

        # Check DB directly
        user = database.find_user_for_login('1RV21CS001', 'student')
        self.assertIsNotNone(user)
        self.assertEqual(user['full_name'], 'Aarav Patel')
        self.assertEqual(user['branch_code'], 'CSE')
        self.assertTrue(check_password_hash(user['password_hash'], 'password123'))
        self.assertFalse(check_password_hash(user['password_hash'], 'wrongpassword'))

        # Duplicate USN rejection
        response_dup = self.client.post('/register/student', data={
            'full_name': 'Duplicate User',
            'usn': '1RV21CS001',
            'email': 'another@college.edu',
            'password': 'password123',
            'confirm_password': 'password123',
            'branch_code': 'CSE',
            'semester': '6',
            'section': 'A'
        }, follow_redirects=True)
        self.assertIn(b'already registered', response_dup.data)

        # Login using USN
        login_res_usn = self.client.post('/login', data={
            'role': 'student',
            'identifier': '1RV21CS001',
            'password': 'password123'
        }, follow_redirects=True)
        self.assertEqual(login_res_usn.status_code, 200)
        self.assertIn(b'Welcome back, Aarav Patel', login_res_usn.data)
        self.assertIn(b'Student Dashboard', login_res_usn.data)

        # Logout
        logout_res = self.client.get('/logout', follow_redirects=True)
        self.assertIn(b'logged out successfully', logout_res.data)

        # Login using Email
        login_res_email = self.client.post('/login', data={
            'role': 'student',
            'identifier': 'aarav.cs21@college.edu',
            'password': 'password123'
        }, follow_redirects=True)
        self.assertEqual(login_res_email.status_code, 200)
        self.assertIn(b'Welcome back, Aarav Patel', login_res_email.data)

    def test_teacher_registration_and_login(self):
        # Register a Teacher
        response = self.client.post('/register/teacher', data={
            'full_name': 'Dr. Meera N',
            'employee_id': 'EMP5010',
            'email': 'meera.ece@college.edu',
            'password': 'teacherpass',
            'confirm_password': 'teacherpass',
            'branch_code': 'ECE'
        }, follow_redirects=True)
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Teacher registration successful', response.data)

        # Login with Employee ID
        login_res = self.client.post('/login', data={
            'role': 'teacher',
            'identifier': 'EMP5010',
            'password': 'teacherpass'
        }, follow_redirects=True)
        self.assertEqual(login_res.status_code, 200)
        self.assertIn(b'Welcome back, Dr. Meera N', login_res.data)
        self.assertIn(b'Faculty Dashboard', login_res.data)

    def test_role_authorization_and_url_tampering(self):
        # 1. Unauthenticated access blocked
        unauth_res = self.client.get('/student/dashboard', follow_redirects=True)
        self.assertIn(b'Please log in', unauth_res.data)

        # 2. Log in as Student
        self.client.post('/register/student', data={
            'full_name': 'Student One',
            'usn': '1RV21CS099',
            'email': 's1@college.edu',
            'password': 'password123',
            'confirm_password': 'password123',
            'branch_code': 'CSE',
            'semester': '4',
            'section': 'B'
        })
        self.client.post('/login', data={
            'role': 'student',
            'identifier': '1RV21CS099',
            'password': 'password123'
        })

        # 3. Student tries to access Teacher Dashboard URL directly
        tamper_res = self.client.get('/teacher/dashboard', follow_redirects=True)
        self.assertIn(b'Access denied', tamper_res.data)
        self.assertIn(b'Student Dashboard', tamper_res.data)

    def test_branch_grouping_and_isolation(self):
        # Register 1 CSE student
        database.register_student(
            full_name='CSE Student 1',
            usn='1RV21CS010',
            email='cs1@college.edu',
            password_hash='hash1',
            branch_code='CSE',
            semester=6,
            section='A'
        )

        # Register 1 ECE student
        database.register_student(
            full_name='ECE Student 1',
            usn='1RV21EC020',
            email='ec1@college.edu',
            password_hash='hash2',
            branch_code='ECE',
            semester=6,
            section='B'
        )

        # Filter CSE roster
        cse_students = database.get_students_filtered(branch_code='CSE')
        cse_usns = [s['usn'] for s in cse_students]
        self.assertIn('1RV21CS010', cse_usns)
        self.assertNotIn('1RV21EC020', cse_usns)

        # Filter ECE roster
        ece_students = database.get_students_filtered(branch_code='ECE')
        ece_usns = [s['usn'] for s in ece_students]
        self.assertIn('1RV21EC020', ece_usns)
        self.assertNotIn('1RV21CS010', ece_usns)

        # Filter with Semester and Section
        filtered = database.get_students_filtered(branch_code='CSE', semester=6, section='A')
        self.assertEqual(len(filtered), 1)
        self.assertEqual(filtered[0]['usn'], '1RV21CS010')

        # Filter mismatch returns empty
        mismatch = database.get_students_filtered(branch_code='CSE', semester=4, section='A')
        self.assertEqual(len(mismatch), 0)

if __name__ == '__main__':
    unittest.main()
