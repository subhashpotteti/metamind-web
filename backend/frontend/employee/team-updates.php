<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Team Updates - META MINDS PVT LTD</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <link rel="icon" type="image/png" href="../assets/images/meta_minds_logo.png">
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body>
    <div class="dashboard">
        <?php include 'sidebar.php'; ?>
        <main class="main-content">
            <div class="top-bar"><h1>Team Updates</h1><div class="user-info"><div class="user-avatar" id="userAvatar">U</div><span id="userName">User</span></div></div>
            <section class="card">
                <div class="card-header"><div><p class="card-kicker">Completed work</p><h2 class="card-title">Work Updates</h2></div></div>
                <div id="workUpdatesList"><div class="loading">Loading work updates...</div></div>
            </section>
            <section class="card" id="attendance-logs" style="margin-top:1.5rem">
                <div class="card-header"><div><p class="card-kicker">Attendance audit trail</p><h2 class="card-title">Check-ins and check-outs</h2></div></div>
                <div id="attendanceLogsList"><div class="loading">Loading attendance logs...</div></div>
            </section>
        </main>
    </div>
    <script src="../assets/js/team-updates.js?v=20260904"></script>
</body>
</html>
