# Auto-start port-forward cho ketoan-dashboard sau khi Windows khởi động
# Được gọi bởi Task Scheduler khi user đăng nhập

$logFile = "$PSScriptRoot\start-k8s.log"
function Log($msg) { "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') $msg" | Tee-Object -Append $logFile }

Log "=== Khoi dong ketoan-dashboard port-forward ==="

# Chờ Docker Desktop sẵn sàng (tối đa 120 giây)
Log "Cho Docker Desktop khoi dong..."
$timeout = 120
$elapsed = 0
while ($elapsed -lt $timeout) {
    $info = docker info 2>&1
    if ($LASTEXITCODE -eq 0) { Log "Docker san sang"; break }
    Start-Sleep -Seconds 5
    $elapsed += 5
}
if ($elapsed -ge $timeout) { Log "TIMEOUT: Docker khong san sang"; exit 1 }

# Chờ Kubernetes sẵn sàng
Log "Cho Kubernetes khoi dong..."
$elapsed = 0
while ($elapsed -lt $timeout) {
    $nodes = kubectl get nodes 2>&1
    if ($LASTEXITCODE -eq 0) { Log "Kubernetes san sang"; break }
    Start-Sleep -Seconds 5
    $elapsed += 5
}
if ($elapsed -ge $timeout) { Log "TIMEOUT: Kubernetes khong san sang"; exit 1 }

# Chờ pod Running
Log "Cho pod ketoan-dashboard Running..."
$elapsed = 0
while ($elapsed -lt 60) {
    $status = kubectl get pods -l app=ketoan-dashboard -o jsonpath='{.items[0].status.phase}' 2>&1
    if ($status -eq "Running") { Log "Pod dang Running"; break }
    Start-Sleep -Seconds 5
    $elapsed += 5
}

# Kill port-forward cũ nếu còn
Get-Process -Name "kubectl" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*port-forward*" } | Stop-Process -Force

# Bắt đầu port-forward
Log "Bat dau port-forward :30080 -> service/ketoan-dashboard:80"
Start-Process -FilePath "kubectl" `
    -ArgumentList "port-forward service/ketoan-dashboard 30080:80 --address 0.0.0.0" `
    -WindowStyle Hidden

Log "Hoan tat. Truy cap: http://localhost:30080"
