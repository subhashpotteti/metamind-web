<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registration Requests - META MINDS PVT LTD</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <link rel="icon" type="image/png" href="../assets/images/meta_minds_logo.png">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body>
    <div class="dashboard">
        <?php include 'sidebar.php'; ?>`n`n        <main class="main-content">
            <div class="top-bar">
                <h1>Registration Requests</h1>
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
                    <h2 class="card-title">Registration Requests</h2>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-secondary btn-sm" onclick="loadRequests('pending')">Pending</button>
                        <button class="btn btn-secondary btn-sm" onclick="loadRequests('all')">All</button>
                    </div>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Department</th>
                                <th>Designation</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="requestsTableBody">
                            <tr>
                                <td colspan="7" style="text-align: center;">Loading...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    </div>
    
    <!-- Request Modal -->
    <div class="modal" id="requestModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Request Details</h3>
                <button class="modal-close" onclick="closeModal()">&times;</button>
            </div>
            <div id="modalBody"></div>
        </div>
    </div>

    <!-- Approval Modal -->
    <div class="modal" id="approvalModal">
        <div class="modal-content" style="max-width: 500px;">
            <div class="modal-header">
                <h3>Create Employee ID</h3>
                <button class="modal-close" type="button" onclick="closeApprovalModal()">&times;</button>
            </div>
            <form id="approvalForm" style="padding: 1.5rem 0 0;">
                <input type="hidden" id="approvalRequestId">
                <div class="form-group">
                    <label class="form-label" for="approvalEmployeeCode">Create Employee ID *</label>
                    <input class="form-control" id="approvalEmployeeCode" maxlength="50" placeholder="ID Format: MM-EMP-001" required>
                    <small style="color: var(--gray-500);">Enter a unique ID using letters, numbers, hyphens, or underscores.</small>
                </div>
                <div class="form-group">
                    <label class="form-label" for="approvalNotes">Admin Notes</label>
                    <textarea class="form-control" id="approvalNotes" rows="3" placeholder="Optional notes"></textarea>
                </div>
                <div style="display: flex; justify-content: flex-end; gap: .75rem; margin-top: 1.25rem;">
                    <button class="btn btn-secondary" type="button" onclick="closeApprovalModal()">Cancel</button>
                    <button class="btn btn-success" type="submit">Submit &amp; Approve</button>
                </div>
            </form>
        </div>
    </div>
    
    <!-- Photo Preview Modal -->
    <div class="modal" id="photoModal">
        <div class="modal-content photo-modal-content">
            <div class="modal-header">
                <h3>Photo Preview</h3>
                <button class="modal-close" onclick="closePhotoModal()">&times;</button>
            </div>
            <div id="photoModalBody" style="text-align: center; padding: 2rem;">
                <img id="previewImage" src="" alt="Employee Photo" style="max-width: 100%; max-height: 500px; border-radius: 8px; object-fit: contain;">
            </div>
        </div>
    </div>
    
    <div id="pageLoader" class="page-loader">
        <div class="loader-spinner"></div>
    </div>
    
    <script src="../assets/js/requests.js?v=20260816-12"></script>
</body>
</html>

