@echo off
title Autodence AI Attendance Server
cls
echo ========================================================
echo        Starting Autodence AI Attendance Server
echo ========================================================
echo.
echo 1. Initializing database and OpenCV face recognition engines...
echo 2. Once started, open your browser at:
echo.
echo    http://127.0.0.1:5000/
echo.
echo Press Ctrl+C in this window anytime to stop the server.
echo ========================================================
echo.
python app.py
pause
