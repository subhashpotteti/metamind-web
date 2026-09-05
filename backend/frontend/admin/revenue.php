<?php
require_once '../../backend/config/auth.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Revenue - META MINDS PVT LTD</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <link rel="icon" type="image/png" href="../assets/images/meta_minds_logo.png">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body>
    <div class="dashboard">
        <?php include 'sidebar.php'; ?>`n`n        <main class="main-content">
            <div class="top-bar">
                <h1>Revenue Management</h1>
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
            
            <!-- Stats Cards -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon success">
                        <i data-lucide="trending-up"></i>
                    </div>
                    <div class="stat-info">
                        <h3 id="totalRevenue">₹0</h3>
                        <p>Total Revenue</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon warning">
                        <i data-lucide="clock"></i>
                    </div>
                    <div class="stat-info">
                        <h3 id="pendingRevenue">₹0</h3>
                        <p>Pending</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon primary">
                        <i data-lucide="file-text"></i>
                    </div>
                    <div class="stat-info">
                        <h3 id="invoiceSent">₹0</h3>
                        <p>Invoices Sent</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon danger">
                        <i data-lucide="calendar"></i>
                    </div>
                    <div class="stat-info">
                        <h3 id="thisMonthRevenue">₹0</h3>
                        <p>This Month</p>
                    </div>
                </div>
            </div>
            
            <!-- Revenue Chart -->
            <div class="card">
                <div class="card-header">
                    <h2 class="card-title">Monthly Revenue Trend</h2>
                </div>
                <div style="padding: 1.5rem;">
                    <canvas id="revenueChart" height="100"></canvas>
                </div>
            </div>
            
            <!-- Revenue Table -->
            <div class="card">
                <div class="card-header">
                    <h2 class="card-title">Revenue Records</h2>
                    <button class="btn btn-primary" onclick="openRevenueModal()">
                        <i data-lucide="plus"></i>
                        Add Revenue
                    </button>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Project</th>
                                <th>Description</th>
                                <th>Type</th>
                                <th>Amount</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="revenueTableBody">
                            <tr>
                                <td colspan="6" style="text-align: center;">Loading...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    </div>
    
    <!-- Revenue Modal -->
    <div class="modal" id="revenueModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="revenueModalTitle">Add Revenue</h3>
                <button class="modal-close" onclick="closeRevenueModal()">&times;</button>
            </div>
            <form id="revenueForm">
                <input type="hidden" id="revenueId">
                <div class="form-group">
                    <label class="form-label">Project</label>
                    <select class="form-control" id="revenueProject">
                        <option value="">Select Project</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Amount (₹) *</label>
                    <input type="number" class="form-control" id="revenueAmount" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Type</label>
                    <select class="form-control" id="revenueType">
                        <option value="payment_received">Payment Received</option>
                        <option value="invoice_sent">Invoice Sent</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Description</label>
                    <input type="text" class="form-control" id="revenueDescription">
                </div>
                <div class="form-group">
                    <label class="form-label">Date *</label>
                    <input type="date" class="form-control" id="revenueDate" required>
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%;">Save Revenue</button>
            </form>
        </div>
    </div>
    <div class="modal" id="revenueViewModal"><div class="modal-content"><div class="modal-header"><h3>Revenue Details</h3><button class="modal-close" onclick="document.getElementById('revenueViewModal').classList.remove('active')">&times;</button></div><div id="revenueViewBody" style="padding:1.5rem"></div></div></div>
    
    <script src="../assets/js/revenue.js"></script>
</body>
</html>


