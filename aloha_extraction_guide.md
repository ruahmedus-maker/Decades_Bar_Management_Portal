# How to Extract Data from Aloha POS

Since the Aloha POS server is a local machine and cannot be directly accessed by the cloud-based web app, you will need to export a report periodically (e.g., monthly) and import it here.

## Step 1: Access Aloha Manager (or CFC)
Log into the back-office computer where **Aloha Manager** or **Aloha Configuration Center (CFC)** is installed.

## Step 2: Generate the Report
We need a report that contains **Sales**, **Labor (Hours)**, and **Guest Counts** by employee.

1.  Go to **Reports** > **Aloha Point-of-Sale** > **Employee** > **Performance**.
2.  Select the **Date Range** (e.g., Last Month: `01/01/2024` to `01/31/2024`).
3.  Filter by **Job Code**: Select `Bartender` and `Trainee`.
4.  Ensure the following columns are included:
    *   Employee Name (or ID)
    *   Net Sales
    *   Guest Count (Checks)
    *   Hours Worked
    *   (Optional) Void/Comp Amount
5.  Click **View** to generate the report.

## Step 3: Export to CSV
1.  Once the report is visible on screen, look for the **Export** button (usually a disk icon or "File > Export").
2.  Select **Comma Separated Values (.csv)** or **Excel (.xls)**.
    *   *Note: CSV is preferred.*
3.  Save the file as `performance_nov_2024.csv` (or relevant month).

## Step 4: Import into Dashboard
1.  Go to the **Key Performance Indicators** section in this app.
2.  Click **"Import Aloha Data"**.
3.  Upload the CSV file you just saved.
4.  The system will automatically parse:
    *   **Sales** -> Total Sales
    *   **Guest Count / Checks** -> Check Average (Sales / Checks)
    *   **Hours** -> Shifts Worked (approx)
    *   **Clock-in Times** (if available in detailed labor report) -> Punctuality

## Option 2: Automated Generation (Script)
If you want to automate this process, I have created a PowerShell script located at `scripts/auto_generate_aloha_report.ps1`.

### Prerequisites
1.  **Create a Saved Report**: In Aloha Manager, create a report setting named `DailyExport` (or update the script to match your name).
2.  **Verify Paths**: Open the script and check that `$AlohaBaseDir` points to your Aloha installation (usually `C:\BootDrv\Aloha`).

### How to use
1.  Copy the script to your Aloha BOH Server.
2.  Open **Windows Task Scheduler**.
3.  Create a Basic Task:
    *   **Trigger**: Daily at 4:00 AM (after End of Day).
    *   **Action**: Start a Program.
    *   **Program**: `powershell.exe`
    *   **Arguments**: `-ExecutionPolicy Bypass -File "C:\Path\To\auto_generate_aloha_report.ps1"`
4.  The script will generate a file like `Performance_20241125.csv` in `C:\AlohaExports`.

### Importing
You will still need to upload this file to the web dashboard manually, OR we can set up a "Cloud Uploader" if you provide us with an API Key in the future.
