<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Leave Requests - META MINDS PVT LTD</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <link rel="icon" type="image/png" href="../assets/images/meta_minds_logo.png">
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body>
    <div class="dashboard">
        <?php include 'sidebar.php'; ?>`n`n        <main class="main-content">
            <div class="top-bar">
                <h1>Leave Requests</h1>
                <div class="user-info">
                    <div class="notification-icon" onclick="window.location.href='notifications.php'">
                        <i data-lucide="bell"></i>
                        <span class="notification-dot" id="notifDot"></span>
                    </div>
                    <div class="user-avatar" id="userAvatar">E</div>
                    <span id="userName">Employee</span>
                </div>
            </div>
            
            <div id="alertContainer"></div>
            
            <div class="card">
                <div class="card-header">
                    <h2 class="card-title">My Leave Requests</h2>
                    <button class="btn btn-primary" onclick="openLeaveModal()">
                        <i data-lucide="plus"></i>
                        New Leave Request
                    </button>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
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
                                <td colspan="6" style="text-align: center;">Loading...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    </div>
    
    <!-- Leave Request Modal -->
    <div class="modal" id="leaveModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>New Leave Request</h3>
                <button class="modal-close" onclick="closeLeaveModal()">&times;</button>
            </div>
            <form id="leaveForm">
                <div class="form-group">
                    <label class="form-label">Leave Type *</label>
                    <select class="form-control" id="leaveType" required>
                        <option value="">Select Type</option>
                        <option value="sick">Sick Leave</option>
                        <option value="casual">Casual Leave</option>
                        <option value="earned">Earned Leave</option>
                        <option value="maternity">Maternity Leave</option>
                        <option value="paternity">Paternity Leave</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label class="form-label">Start Date *</label>
                        <input type="date" class="form-control" id="startDate" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">End Date *</label>
                        <input type="date" class="form-control" id="endDate" required>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Total Days</label>
                    <input type="number" class="form-control" id="totalDays" readonly>
                </div>
                <div class="form-group">
                    <label class="form-label">Reason</label>
                    <textarea class="form-control" id="leaveReason" rows="3"></textarea>
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%;">Submit Request</button>
            </form>
        </div>
    </div>
    
    <script src="../assets/js/employee-leaves.js"></script>
</body>
</html>


