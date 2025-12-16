<#
.SYNOPSIS
Automates the generation of Daily Performance Reports from Aloha POS.

.DESCRIPTION
This script uses the Aloha 'rpt.exe' utility to generate a report for a specific date (default: Yesterday).
It assumes you have created a Saved Report Setting in Aloha Manager.

.NOTES
File Name      : auto_generate_aloha_report.ps1
Author         : Decades Bar Management System
Prerequisite   : Must be run on the Aloha File Server (BOH).
#>

# Configuration
$AlohaBaseDir = "C:\BootDrv\Aloha"  # Change if your Aloha is on D: or elsewhere
$BinDir = "$AlohaBaseDir\BIN"
$OutDir = "C:\AlohaExports"
$ReportSettingName = "DailyExport"  # NAME EXACTLY COMPATIBLE with your saved report in Aloha Manager

# Calculate Date (Yesterday in YYYYMMDD format)
$TargetDate = (Get-Date).AddDays(-1).ToString("yyyyMMdd")
$OutputFilename = "Performance_$TargetDate.csv"
$OutputFile = Join-Path -Path $OutDir -ChildPath $OutputFilename

# Ensure Output Directory Exists
if (-not (Test-Path -Path $OutDir)) {
    New-Item -ItemType Directory -Path $OutDir | Out-Null
    Write-Host "Created output directory: $OutDir"
}

# Check if Aloha BIN exists
if (-not (Test-Path -Path $BinDir)) {
    Write-Error "Aloha BIN directory not found at $BinDir. Please update the script configuration."
    exit 1
}

# Construct the Command
# Syntax: rpt.exe /DATE <YYYYMMDD> /LOAD <SettingName.set> /NOSTOP /XC /OP <OutputPath>
# /XC = Export CSV (if supported by specific rpt.exe version, otherwise assumes setting handles it)
# /NOSTOP = Don't wait for user input (Headless mode)

$RptExe = "$BinDir\rpt.exe"
$LoadFlag = "$ReportSettingName.set"

Write-Host "Generating report for $TargetDate using setting '$ReportSettingName'..."

try {
    # Execute the command
    $ProcessArgs = @("/DATE", $TargetDate, "/LOAD", $LoadFlag, "/NOSTOP", "/OP", $OutDir)
    
    # Run rpt.exe
    $Process = Start-Process -FilePath $RptExe -ArgumentList $ProcessArgs -Wait -PassThru -NoNewWindow
    
    if ($Process.ExitCode -eq 0) {
        Write-Host "SUCCESS: Report generated at $OutDir"
    } else {
        Write-Warning "Aloha rpt.exe exited with code $($Process.ExitCode). Check Aloha logs."
    }

} catch {
    Write-Error "Failed to execute Aloha Report: $_"
}

# Optional: Upload to Supabase (Advanced)
# If you have curl or a helper script, you could POST the file here.
# Example:
# Invoke-RestMethod -Uri "https://YOUR_PROJECT.functions.supabase.co/upload-report" -Method Post -InFile $OutputFile ...
