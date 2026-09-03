<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Notifications - META MINDS PVT LTD</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <link rel="icon" type="image/png" href="../assets/images/meta_minds_logo.png">
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body>
    <div class="dashboard">
        <?php include 'sidebar.php'; ?>`n`n        <main class="main-content">
            <div class="top-bar">
                <h1>Notifications</h1>
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
                    <h2 class="card-title">All Notifications</h2>
                    <button class="btn btn-secondary" onclick="markAllAsRead()">
                        <i data-lucide="check-double"></i>
                        Mark All as Read
                    </button>
                </div>
                <div id="notificationsList">
                    <div style="text-align: center; padding: 2rem;">Loading...</div>
                </div>
            </div>
        </main>
    </div>
    
    <script src="../assets/js/employee-notifications.js"></script>
</body>
</html>


