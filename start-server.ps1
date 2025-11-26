Write-Host "Checking for existing Node.js processes..."
Get-Process | Where-Object { $_.ProcessName -eq "node" } | ForEach-Object { 
    Write-Host "Stopping process: $($_.Id)"
    Stop-Process -Id $_.Id -Force 
}

Write-Host "Setting up environment..."
$env:PORT = 4000

Write-Host "Starting server..."
try {
    node server.js
} catch {
    Write-Host "Error starting server: $_"
    Write-Host "Stack trace: $($_.ScriptStackTrace)"
}