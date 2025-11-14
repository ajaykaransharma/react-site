# PowerShell script to push files to GitHub
# Make sure Git is installed before running this script

Write-Host "Checking if Git is installed..." -ForegroundColor Yellow

# Check if git is available
try {
    $gitVersion = git --version
    Write-Host "Git is installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Git is not installed or not in PATH!" -ForegroundColor Red
    Write-Host "Please install Git from: https://git-scm.com/downloads" -ForegroundColor Yellow
    Write-Host "After installing Git, restart your terminal and run this script again." -ForegroundColor Yellow
    exit 1
}

Write-Host "`nInitializing Git repository..." -ForegroundColor Yellow
git init

Write-Host "`nAdding all files to staging area..." -ForegroundColor Yellow
git add .

Write-Host "`nCreating initial commit..." -ForegroundColor Yellow
git commit -m "Initial commit: Service management site"

Write-Host "`nAdding remote repository..." -ForegroundColor Yellow
git remote add origin https://github.com/ajaykaransharma/react-site.git

# Check if remote already exists and update if needed
if ($LASTEXITCODE -ne 0) {
    Write-Host "Remote already exists, updating..." -ForegroundColor Yellow
    git remote set-url origin https://github.com/ajaykaransharma/react-site.git
}

Write-Host "`nPushing to GitHub..." -ForegroundColor Yellow
Write-Host "Note: You may be prompted for your GitHub credentials." -ForegroundColor Cyan

# Try to push to main branch
git branch -M main
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nSUCCESS! Files have been pushed to GitHub!" -ForegroundColor Green
    Write-Host "Repository: https://github.com/ajaykaransharma/react-site" -ForegroundColor Cyan
} else {
    Write-Host "`nERROR: Push failed. You may need to:" -ForegroundColor Red
    Write-Host "1. Set up authentication (GitHub Personal Access Token)" -ForegroundColor Yellow
    Write-Host "2. Or use GitHub Desktop for easier authentication" -ForegroundColor Yellow
    Write-Host "3. Check if you have write access to the repository" -ForegroundColor Yellow
}

