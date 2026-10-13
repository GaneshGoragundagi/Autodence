@echo off
title Autodence — Push to GitHub
cls
set GIT="C:\Users\ganig\AppData\Local\GitHubDesktop\app-3.5.6\resources\app\git\cmd\git.exe"
echo ========================================================
echo        Pushing to GitHub (Autodence Repository)
echo ========================================================
echo.
%GIT% add -A
%GIT% commit -m "Update Autodence system" 2>nul
%GIT% push -u origin main
echo.
echo ========================================================
echo        Push completed!
echo ========================================================
pause
