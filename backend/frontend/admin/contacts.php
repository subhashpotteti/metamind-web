<?php
require_once '../../backend/config/auth.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Messages - META MINDS PVT LTD</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <link rel="icon" type="image/png" href="../assets/images/meta_minds_logo.png">
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body>
<div class="dashboard">
    <?php include 'sidebar.php'; ?>
    <main class="main-content">
        <div class="top-bar">
            <h1>Contact Messages</h1>
            <div class="user-info"><div class="user-avatar">A</div><span>Admin</span></div>
        </div>
        <div id="alertContainer"></div>
        <section class="card">
            <div class="card-header"><h2 class="card-title">Website Enquiries</h2></div>
            <div class="table-container">
                <table>
                    <thead><tr><th>Date</th><th>Name</th><th>Email</th><th>Phone</th><th>Company</th><th>Service</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody id="contactsTableBody"><tr><td colspan="8" style="text-align:center">Loading...</td></tr></tbody>
                </table>
            </div>
        </section>
    </main>
</div>
<div class="modal" id="contactModal">
    <div class="modal-content" style="max-width:720px">
        <div class="modal-header"><h3>Contact Message</h3><button class="modal-close" onclick="closeContactModal()">&times;</button></div>
        <div id="contactModalBody" style="padding:1.5rem"></div>
    </div>
</div>
<script src="../assets/js/contacts.js"></script>
</body>
</html>
