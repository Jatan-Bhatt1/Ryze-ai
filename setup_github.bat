@echo off
setlocal

echo.
echo === Ryze AI GitHub Setup ===
echo.

:: Check for Git
where git >nul 2>nul
if %errorlevel% equ 0 (
    goto :git_found
)

echo [INFO] Git is not installed or not in PATH.
echo.
echo === Installing Git via Windows Package Manager (winget) ===
echo This requires administrator privileges (UAC prompt may appear).
echo.
winget install --id Git.Git -e --source winget

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Failed to install Git automatically.
    echo Please download and install manually from: https://git-scm.com/download/win
    echo After installing, restart your terminal and run this script again.
    pause
    exit /b
)

echo.
echo [SUCCESS] Git installed! You may need to restart terminal for PATH changes.
echo Please close this window and run 'setup_github.bat' again.
pause
exit /b

:git_found
echo [SUCCESS] Git is installed!
echo.

:: Configure Git User (if needed)
git config --global user.name >nul 2>nul
if %errorlevel% neq 0 (
    echo Git user not configured.
    set /p git_name="Enter your name for commits: "
    set /p git_email="Enter your email for commits: "
    git config --global user.name "%git_name%"
    git config --global user.email "%git_email%"
)

:: Initialize Repo
if not exist ".git" (
    echo Initializing git repository...
    git init
    git branch -M main
) else (
    echo Git repository already initialized.
)

:: Add and Commit
echo Adding files...
git add .
git commit -m "Initial commit of Ryze AI"

:: Remote Setup
echo.
echo === GitHub Repository Setup ===
echo Create a new repository on GitHub: https://github.com/new
echo Do NOT initialize with README, .gitignore, or license.
echo.
set /p repo_url="Enter your GitHub Repository URL (ends in .git): "

git remote remove origin >nul 2>nul
git remote add origin %repo_url%

echo.
echo Pushing to GitHub...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo [SUCCESS] Code pushed to GitHub successfully!
) else (
    echo.
    echo [ERROR] Failed to push. Check your URL and credentials.
)

pause
