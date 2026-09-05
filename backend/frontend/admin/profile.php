<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Profile - META MINDS PVT LTD</title>
    <link rel="stylesheet" href="../assets/css/style.css"><link rel="icon" type="image/png" href="../assets/images/meta_minds_logo.png">
    <script src="https://unpkg.com/lucide@latest"></script>
    <script src="../assets/js/common.js"></script>
</head>
<body><div class="dashboard">
<?php include 'sidebar.php'; ?>
<main class="main-content"><div class="top-bar"><h1>My Profile</h1><div class="user-info"><div class="user-avatar">A</div><span>Admin</span></div></div>
<div id="alertContainer"></div>
<section class="card" style="max-width:620px"><div class="card-header"><h2 class="card-title">Administrator details</h2></div>
<form id="profileForm" style="padding:1.5rem"><div class="form-group"><label class="form-label">Role</label><input class="form-control" value="Administrator" readonly></div><div class="form-group"><label class="form-label">Phone number</label><input id="adminPhone" class="form-control" maxlength="10" required></div><div class="form-group"><label class="form-label">Account created</label><input id="adminCreated" class="form-control" readonly></div><button class="btn btn-primary" type="submit">Save changes</button></form>
</section>
<section class="card" style="max-width:620px;margin-top:1.5rem"><div class="card-header"><h2 class="card-title">Change password</h2></div><form id="passwordForm" style="padding:1.5rem"><div class="form-group"><label class="form-label">Current Password</label><input id="currentPassword" type="password" class="form-control" required></div><div class="form-group"><label class="form-label">New Password</label><input id="newPassword" type="password" class="form-control" minlength="8" required><small>At least 8 characters, including a letter and number.</small></div><div class="form-group"><label class="form-label">Confirm New Password</label><input id="confirmPassword" type="password" class="form-control" required></div><button class="btn btn-primary" type="submit">Change password</button></form></section></main></div><script src="../assets/js/admin-profile.js"></script></body></html>
