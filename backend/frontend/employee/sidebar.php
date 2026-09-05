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
            <a data-permission="dashboard.view" href="dashboard.php" <?php echo $currentPage == 'dashboard.php' ? 'class="active"' : ''; ?>>
                <i data-lucide="layout-dashboard"></i>
                Dashboard
            </a>
        </li>
        <li>
            <a data-permission="projects.read" href="../admin/projects.php" <?php echo $currentPage == 'projects.php' ? 'class="active"' : ''; ?>>
                <i data-lucide="briefcase"></i>
                Projects
            </a>
        </li>
        <li>
            <a data-permission="revenue.read" href="../admin/revenue.php" <?php echo $currentPage == 'revenue.php' ? 'class="active"' : ''; ?>>
                <i data-lucide="dollar-sign"></i>
                Revenue
            </a>
        </li>
        <li>
            <a data-permission="leaves.read" href="../admin/leaves.php" <?php echo $currentPage == 'leaves.php' ? 'class="active"' : ''; ?>>
                <i data-lucide="calendar"></i>
                Leave Requests
            </a>
        </li>
        <li>
            <a data-permission="requests.read" href="../admin/requests.php" <?php echo $currentPage == 'requests.php' ? 'class="active"' : ''; ?>>
                <i data-lucide="user-plus"></i>
                Registration Requests
            </a>
        </li>
        <li>
            <a data-permission="employees.read" href="../admin/employees.php" <?php echo $currentPage == 'employees.php' ? 'class="active"' : ''; ?>>
                <i data-lucide="users"></i>
                Employees
            </a>
        </li>
        <li>
            <a data-permission="attendance.self" href="attendance.php" <?php echo $currentPage == 'attendance.php' ? 'class="active"' : ''; ?>>
                <i data-lucide="clock"></i>
                Attendance
            </a>
        </li>
        <li>
            <a data-permission="attendance.self" href="work-updates.php" <?php echo $currentPage == 'work-updates.php' ? 'class="active"' : ''; ?>>
                <i data-lucide="clipboard-list"></i>
                Work Updates
            </a>
        </li>
        <li>
            <a data-permission="attendance.self" href="attendance-logs.php" <?php echo $currentPage == 'attendance-logs.php' ? 'class="active"' : ''; ?>>
                <i data-lucide="history"></i>
                Attendance Logs
            </a>
        </li>
        <li>
            <a data-permission="notifications.read" href="notifications.php" <?php echo $currentPage == 'notifications.php' ? 'class="active"' : ''; ?>>
                <i data-lucide="bell"></i>
                Notifications
                <span class="notification-badge" id="notifBadge">0</span>
            </a>
        </li>
        <li>
            <a data-permission="roles.manage" href="../admin/roles.php" <?php echo $currentPage == 'roles.php' ? 'class="active"' : ''; ?>>
                <i data-lucide="shield-check"></i>
                Roles & Permissions
            </a>
        </li>
        <li>
            <a data-permission="notes.self" href="notes.php" <?php echo $currentPage == 'notes.php' ? 'class="active"' : ''; ?>>
                <i data-lucide="message-square"></i>
                Notes
            </a>
        </li>
        <li>
            <a data-permission="profile.self" href="profile.php" <?php echo $currentPage == 'profile.php' ? 'class="active"' : ''; ?>>
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
<script src="../assets/js/common.js"></script>
<script src="../assets/js/role-sidebar.js"></script>
<script src="../assets/js/ui-access-controls.js?v=20260904"></script>
