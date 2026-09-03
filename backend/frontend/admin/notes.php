<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Notes - META MINDS PVT LTD</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <link rel="icon" type="image/png" href="../assets/images/meta_minds_logo.png">
    <script src="https://unpkg.com/lucide@latest"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>
<body>
    <div class="dashboard">
        <?php include 'sidebar.php'; ?>
        <main class="main-content">
            <div class="top-bar">
                <h1>Notes</h1>
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
                <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
                    <h2>Send Note to Employee</h2>
                    <button class="btn btn-primary" onclick="openComposeModal()">
                        <i data-lucide="plus" style="width: 16px; height: 16px; margin-right: 8px;"></i>
                        Compose Note
                    </button>
                </div>
                <div class="card-body">
                    <div id="notesList">
                        <div class="loading">Loading notes...</div>
                    </div>
                </div>
            </div>
        </main>
    </div>
    
    <!-- Compose Note Modal -->
    <div id="composeModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Compose Note</h3>
                <button class="modal-close" onclick="closeComposeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <form id="composeForm">
                    <div class="form-group">
                        <label class="form-label">Select Employee *</label>
                        <select class="form-control" id="employeeSelect" required>
                            <option value="">Select an employee...</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Subject</label>
                        <input type="text" class="form-control" id="noteSubject" placeholder="Enter subject (optional)">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Message *</label>
                        <textarea class="form-control" id="noteMessage" rows="5" placeholder="Enter your message..." required></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">
                        <span id="composeBtnText">Send Note</span>
                        <span id="composeBtnSpinner" class="spinner" style="display: none;"></span>
                    </button>
                </form>
            </div>
        </div>
    </div>
    
    <!-- View Note Modal -->
    <div id="viewModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>View Note</h3>
                <button class="modal-close" onclick="closeViewModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div id="noteDetails"></div>
            </div>
        </div>
    </div>
    
    <!-- Page Loader -->
    <div id="pageLoader" class="page-loader">
        <div class="loader-spinner"></div>
        <p>Processing...</p>
    </div>
    
    <script src="../assets/js/notes.js"></script>
</body>
</html>
