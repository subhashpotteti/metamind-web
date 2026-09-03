<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profile - META MINDS PVT LTD</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <link rel="icon" type="image/png" href="../assets/images/meta_minds_logo.png">
    <script src="https://unpkg.com/lucide@latest"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>
<body>
    <div class="dashboard">
        <?php include 'sidebar.php'; ?>`n`n        <main class="main-content">
            <div class="top-bar">
                <h1>My Profile</h1>
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
                <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
                    <h2 class="card-title">Employee Information</h2>
                    <button id="editProfileBtn" class="btn btn-primary" onclick="toggleEditMode()">
                        <i data-lucide="edit" style="width: 16px; height: 16px;"></i>
                        Edit Profile
                    </button>
                </div>
                <div id="profileContent" style="padding: 2rem;">
                    <div style="text-align: center;">Loading...</div>
                </div>
            </div>
        </main>
    </div>
    
    <!-- Page Loader -->
    <div id="pageLoader" class="page-loader">
        <div class="loader-spinner"></div>
        <p>Updating profile...</p>
    </div>
    
    <script src="../assets/js/employee-profile.js"></script>
</body>
</html>


