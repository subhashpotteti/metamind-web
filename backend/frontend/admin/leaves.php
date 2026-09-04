<?php
require_once '../../backend/config/auth.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Leave Requests - META MINDS PVT LTD</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <link rel="icon" type="image/png" href="../assets/images/meta_minds_logo.png">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body>
    <div class="dashboard">
        <?php include 'sidebar.php'; ?>


        <main class="main-content">
            <div class="top-bar">
                <h1>Leave Requests</h1>
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
            
            <!-- Stats Cards -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon warning">
                        <i data-lucide="clock"></i>
                    </div>
                    <div class="stat-info">
                        <h3 id="pendingRequests">0</h3>
                        <p>Pending Requests</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon success">
                        <i data-lucide="check-circle"></i>
                    </div>
                    <div class="stat-info">
                        <h3 id="approvedThisMonth">0</h3>
                        <p>Approved This Month</p>
                    </div>
                </div>
            </div>
            
            <!-- Leave Requests Table -->
            <div class="card">
                <div class="card-header">
                    <h2 class="card-title">All Leave Requests</h2>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Department</th>
                                <th>Leave Type</th>
                                <th>Duration</th>
                                <th>Days</th>
                                <th>Reason</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="leavesTableBody">
                            <tr>
                                <td colspan="8" style="text-align: center;">Loading...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    </div>
    
    <!-- Leave Details Modal -->
    <div class="modal" id="leaveModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Leave Request Details</h3>
                <button class="modal-close" onclick="closeLeaveModal()">&times;</button>
            </div>
            <div id="leaveModalBody"></div>
        </div>
    </div>
    
    <div id="pageLoader" class="page-loader">
        <div class="loader-spinner"></div>
    </div>
    
    <script src="../assets/js/leaves.js?v=20260816-13"></script>
</body>
</html>


