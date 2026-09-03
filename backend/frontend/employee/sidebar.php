<?php
$currentPage = basename($_SERVER['PHP_SELF']);
?>
<aside class="sidebar">
    <div class="sidebar-header">
        <div class="logo-container sidebar-logo">
            <img class="company-logo" src="../assets/images/meta_minds_logo.png" alt="META MINDS PVT LTD">
        </div>
    </div>
    
    <ul class="sidebar-nav">
        <li>
            <a href="dashboard.php" <?php echo $currentPage == 'dashboard.php' ? 'class="active"' : ''; ?>>
                <i data-lucide="layout-dashboard"></i>
                Dashboard
            </a>
        </li>
        <li>
            <a href="attendance.php" <?php echo $currentPage == 'attendance.php' ? 'class="active"' : ''; ?>>
                <i data-lucide="clock"></i>
                Attendance
            </a>
        </li>
        <li>
            <a href="leaves.php" <?php echo $currentPage == 'leaves.php' ? 'class="active"' : ''; ?>>
                <i data-lucide="calendar"></i>
                Leave Requests
            </a>
        </li>
        <li>
            <a href="notifications.php" <?php echo $currentPage == 'notifications.php' ? 'class="active"' : ''; ?>>
                <i data-lucide="bell"></i>
                Notifications
                <span class="notification-badge" id="notifBadge">0</span>
            </a>
        </li>
        <li>
            <a href="notes.php" <?php echo $currentPage == 'notes.php' ? 'class="active"' : ''; ?>>
                <i data-lucide="message-square"></i>
                Notes
            </a>
        </li>
        <li>
            <a href="profile.php" <?php echo $currentPage == 'profile.php' ? 'class="active"' : ''; ?>>
                <i data-lucide="user"></i>
                Profile
            </a>
        </li>
        <li>
            <a href="#" onclick="logout()">
                <i data-lucide="log-out"></i>
                Logout
            </a>
        </li>
    </ul>
</aside>
