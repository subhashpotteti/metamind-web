<?php
require_once '../../backend/config/auth.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Attendance - META MINDS PVT LTD</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <link rel="icon" type="image/png" href="../assets/images/meta_minds_logo.png">
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body>
    <div class="dashboard">
        <?php include 'sidebar.php'; ?>


        <main class="main-content">
            <div class="top-bar">
                <h1>Attendance Records</h1>
                <div class="user-info">
                    <div class="notification-icon" onclick="window.location.href='notifications.php'">
                        <i data-lucide="bell"></i>
                        <span class="notification-dot" id="notifDot"></span>
                    </div>
                    <div class="user-avatar">A</div>
                    <span>Admin</span>
                </div>
            </div>
            
            <div id="alertContainer"></div>
            
            <div class="card">
                <div class="card-header">
                    <h2 class="card-title">Attendance Records</h2>
                    <label for="attendanceFromDate">From Date</label>
                    <input type="date" class="form-control" id="attendanceFromDate" onchange="loadAttendance()">
                    <label for="attendanceToDate">To Date</label>
                    <input type="date" class="form-control" id="attendanceToDate" onchange="loadAttendance()">
                    <label for="attendanceEmployee">Employee</label>
                    <select class="form-control" id="attendanceEmployee" onchange="loadAttendance()"><option value="">All Employees</option></select>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Department</th>
                                <th>Designation</th>
                                <th>Check In</th>
                                <th>Check Out</th>
                                <th>Reason</th>
                                <th>Total Hours</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody id="attendanceTableBody">
                            <tr>
                                <td colspan="8" style="text-align: center;">Loading...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    </div>
    
    <script src="../assets/js/attendance.js"></script>
</body>
</html>


