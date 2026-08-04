# Chạy file này 1 lần với quyền Administrator để đăng ký auto-start
# Chuột phải → "Run with PowerShell" (hoặc Run as Administrator)

$scriptPath = "$PSScriptRoot\start-k8s.ps1"

$action = New-ScheduledTaskAction -Execute "powershell.exe" `
    -Argument "-WindowStyle Hidden -ExecutionPolicy Bypass -File `"$scriptPath`""

$trigger  = New-ScheduledTaskTrigger -AtLogon
$settings = New-ScheduledTaskSettingsSet `
    -ExecutionTimeLimit (New-TimeSpan -Minutes 10) `
    -RestartCount 2 -RestartInterval (New-TimeSpan -Minutes 1)

Register-ScheduledTask `
    -TaskName "KetoanDashboard - K8s Port Forward" `
    -TaskPath "\MISA" `
    -Action   $action `
    -Trigger  $trigger `
    -Settings $settings `
    -RunLevel Highest `
    -Force

Write-Host "Da dang ky thanh cong!" -ForegroundColor Green
Write-Host "Tu nay moi lan dang nhap Windows, port-forward tu dong bat." -ForegroundColor Cyan
Pause
