// Revenue Management JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const adminUser = localStorage.getItem('adminUser');
    if (!adminUser) {
        window.location.href = 'login.php';
        return;
    }
    
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Load data
    loadRevenueStats();
    loadRevenue();
    loadProjectsForDropdown();
    loadNotificationCount();
    
    // Real-time updates
    setInterval(() => {
        loadRevenueStats();
        loadRevenue();
        loadNotificationCount();
    }, 30000);
});

let revenueChart = null;

async function loadRevenueStats() {
    try {
        const response = await fetch('../../backend/api/revenue.php?action=get_revenue_stats');
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('totalRevenue').textContent = '₹' + (data.stats.total_revenue || 0).toLocaleString();
            document.getElementById('pendingRevenue').textContent = '₹' + (data.stats.pending_revenue || 0).toLocaleString();
            document.getElementById('invoiceSent').textContent = '₹' + (data.stats.invoice_sent || 0).toLocaleString();
            document.getElementById('thisMonthRevenue').textContent = '₹' + (data.stats.this_month_revenue || 0).toLocaleString();
            
            // Update chart
            updateChart(data.stats.monthly_data);
        }
    } catch (error) {
        console.error('Error loading revenue stats:', error);
    }
}

async function loadRevenue() {
    try {
        const response = await fetch('../../backend/api/revenue.php?action=get_revenue');
        const data = await response.json();
        
        if (data.success) {
            const tbody = document.getElementById('revenueTableBody');
            
            if (data.revenue.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No revenue records found</td></tr>';
                return;
            }
            
            tbody.innerHTML = data.revenue.map(rev => `
                <tr>
                    <td>${formatDate(rev.date)}</td>
                    <td>${rev.project_name || 'N/A'}</td>
                    <td>${rev.description || 'N/A'}</td>
                    <td><span class="badge badge-${rev.type}">${formatRevenueType(rev.type)}</span></td>
                    <td style="font-weight: 600;">₹${rev.amount.toLocaleString()}</td>
                    <td>
                        <button class="btn btn-secondary btn-sm" onclick="viewRevenue(${rev.id})" title="View"><i data-lucide="eye" style="width:16px;height:16px;"></i></button>
                        <button class="btn btn-primary btn-sm" onclick="editRevenue(${rev.id})" title="Edit"><i data-lucide="edit-2" style="width:16px;height:16px;"></i></button>
                        <button class="btn btn-danger btn-sm" onclick="deleteRevenue(${rev.id})">
                            <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
            
            lucide.createIcons();
        }
    } catch (error) {
        console.error('Error loading revenue:', error);
    }
}

async function viewRevenue(id) {
    const response = await fetch(`../../backend/api/revenue.php?action=get_revenue`); const data = await response.json();
    const rev = data.revenue?.find(item => Number(item.id) === Number(id)); if (!rev) return;
    document.getElementById('revenueViewBody').innerHTML = `<div class="info-grid"><div class="info-item"><label>Record ID</label><span>#${rev.id}</span></div><div class="info-item"><label>Date</label><span>${formatDate(rev.date)}</span></div><div class="info-item"><label>Project</label><span>${rev.project_name || 'N/A'}</span></div><div class="info-item"><label>Type</label><span>${formatRevenueType(rev.type)}</span></div><div class="info-item"><label>Amount</label><span>₹${Number(rev.amount).toLocaleString()}</span></div><div class="info-item full-width"><label>Description</label><span>${rev.description || 'N/A'}</span></div></div>`;
    document.getElementById('revenueViewModal').classList.add('active');
}

async function editRevenue(id) {
    const response = await fetch(`../../backend/api/revenue.php?action=get_revenue`); const data = await response.json();
    const rev = data.revenue?.find(item => Number(item.id) === Number(id)); if (!rev) return;
    document.getElementById('revenueModalTitle').textContent = 'Edit Revenue'; document.getElementById('revenueId').value = rev.id;
    document.getElementById('revenueProject').value = rev.project_id || ''; document.getElementById('revenueAmount').value = rev.amount;
    document.getElementById('revenueType').value = rev.type; document.getElementById('revenueDescription').value = rev.description || ''; document.getElementById('revenueDate').value = rev.date;
    document.getElementById('revenueModal').classList.add('active');
}

async function loadProjectsForDropdown() {
    try {
        const response = await fetch('../../backend/api/projects.php?action=get_projects');
        const data = await response.json();
        
        if (data.success) {
            const select = document.getElementById('revenueProject');
            select.innerHTML = '<option value="">Select Project</option>';
            data.projects.forEach(project => {
                select.innerHTML += `<option value="${project.id}">${project.name}</option>`;
            });
        }
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

function updateChart(monthlyData) {
    const ctx = document.getElementById('revenueChart').getContext('2d');
    
    if (revenueChart) {
        revenueChart.destroy();
    }
    
    revenueChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: monthlyData.map(d => d.month),
            datasets: [{
                label: 'Revenue',
                data: monthlyData.map(d => d.amount),
                backgroundColor: 'rgba(102, 126, 234, 0.8)',
                borderColor: 'rgba(102, 126, 234, 1)',
                borderWidth: 1,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₹' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatRevenueType(type) {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function openRevenueModal() {
    document.getElementById('revenueModalTitle').textContent = 'Add Revenue';
    document.getElementById('revenueForm').reset();
    document.getElementById('revenueId').value = '';
    document.getElementById('revenueDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('revenueModal').classList.add('active');
}

function closeRevenueModal() {
    document.getElementById('revenueModal').classList.remove('active');
}

async function deleteRevenue(revenueId) {
    if (!confirm('Are you sure you want to delete this revenue record?')) return;
    
    try {
        const response = await fetch('../../backend/api/revenue.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'delete_revenue',
                revenue_id: revenueId
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Revenue deleted successfully', 'success');
            loadRevenue();
            loadRevenueStats();
        } else {
            showAlert(data.message || 'Failed to delete revenue', 'error');
        }
    } catch (error) {
        showAlert('Network error. Please try again.', 'error');
    }
}

document.getElementById('revenueForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const revenueData = {
        action: document.getElementById('revenueId').value ? 'update_revenue' : 'add_revenue',
        project_id: document.getElementById('revenueProject').value || null,
        amount: parseFloat(document.getElementById('revenueAmount').value),
        type: document.getElementById('revenueType').value,
        description: document.getElementById('revenueDescription').value,
        date: document.getElementById('revenueDate').value
    };
    if (revenueData.action === 'update_revenue') revenueData.id = parseInt(document.getElementById('revenueId').value);
    
    try {
        const response = await fetch('../../backend/api/revenue.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(revenueData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Revenue added successfully', 'success');
            closeRevenueModal();
            loadRevenue();
            loadRevenueStats();
        } else {
            showAlert(data.message || 'Failed to add revenue', 'error');
        }
    } catch (error) {
        showAlert('Network error. Please try again.', 'error');
    }
});

async function loadNotificationCount() {
    const adminUser = JSON.parse(localStorage.getItem('adminUser'));
    if (!adminUser) return;
    
    try {
        const response = await fetch(`../../backend/api/notifications.php?action=get_unread_count&user_id=${adminUser.id}`);
        const data = await response.json();
        
        if (data.success && data.count > 0) {
            document.getElementById('notifBadge').textContent = data.count;
            document.getElementById('notifBadge').style.display = 'block';
            document.getElementById('notifDot').style.display = 'block';
        } else {
            document.getElementById('notifBadge').style.display = 'none';
            document.getElementById('notifDot').style.display = 'none';
        }
    } catch (error) {
        console.error('Error loading notification count:', error);
    }
}

function showAlert(message, type) {
    const alertContainer = document.getElementById('alertContainer');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} fade-in`;
    alert.innerHTML = `
        <i data-lucide="${type === 'success' ? 'check-circle' : 'alert-circle'}" style="width: 20px; height: 20px;"></i>
        ${message}
    `;
    alertContainer.innerHTML = '';
    alertContainer.appendChild(alert);
    lucide.createIcons();
    
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

function logout() {
    localStorage.removeItem('adminUser');
    window.location.href = 'login.php';
}
