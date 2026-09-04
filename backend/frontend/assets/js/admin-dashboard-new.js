// Admin Dashboard Overview JavaScript
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
    loadDashboardStats();
    loadRecentActivity();
    loadNotificationCount();
    loadRevenueChart();
    loadDashboardAnalytics();
    document.getElementById('dashboardDate').textContent = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });
    
    // Real-time updates
    setInterval(() => {
        loadDashboardStats();
        loadRecentActivity();
        loadNotificationCount();
        loadRevenueChart();
        loadDashboardAnalytics();
    }, 30000);
});

async function loadDashboardStats() {
    try {
        const response = await fetch('../../backend/api/admin.php?action=get_dashboard_stats');
        if (response.status === 401) return redirectToLogin();
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('totalEmployees').textContent = data.stats.total_employees;
            document.getElementById('pendingRequests').textContent = data.stats.pending_requests;
            document.getElementById('presentToday').textContent = data.stats.present_today;
            document.getElementById('absentToday').textContent = data.stats.absent_today;
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

const dashboardCharts = {};

function formatCurrency(value) {
    return '₹' + Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

function renderDashboardChart(key, config) {
    const canvas = document.getElementById(key);
    if (!canvas || typeof Chart === 'undefined') return;
    if (dashboardCharts[key]) dashboardCharts[key].destroy();
    dashboardCharts[key] = new Chart(canvas.getContext('2d'), config);
}

async function loadRevenueChart() {
    try {
        const response = await fetch('../../backend/api/revenue.php?action=get_revenue_stats');
        const data = await response.json();
        if (!data.success) return;
        const stats = data.stats;
        document.getElementById('revenueCollected').textContent = formatCurrency(stats.total_revenue);
        document.getElementById('invoiceSent').textContent = formatCurrency(stats.invoice_sent);
        document.getElementById('pendingRevenue').textContent = formatCurrency(stats.pending_revenue);
        const months = stats.monthly_data || [];
        const current = Number(months.at(-1)?.amount || 0);
        const previous = Number(months.at(-2)?.amount || 0);
        const growth = previous ? Math.round(((current - previous) / previous) * 100) : 0;
        document.getElementById('revenueGrowth').textContent = previous ? `${growth >= 0 ? '+' : ''}${growth}% vs last month` : 'No comparison data yet';
        renderDashboardChart('revenueChart', {
            type: 'bar',
            data: { labels: months.map(item => item.month), datasets: [{ data: months.map(item => item.amount), backgroundColor: '#667eea', hoverBackgroundColor: '#5568d3', borderRadius: 8, borderSkipped: false }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: context => formatCurrency(context.raw) } } }, scales: { x: { grid: { display: false }, border: { display: false } }, y: { beginAtZero: true, border: { display: false }, ticks: { callback: value => formatCurrency(value) }, grid: { color: 'rgba(148,163,184,.16)' } } } }
        });
    } catch (error) { console.error('Error loading revenue chart:', error); }
}

async function loadDashboardAnalytics() {
    try {
        const response = await fetch('../../backend/api/admin.php?action=get_dashboard_analytics');
        if (response.status === 401) return redirectToLogin();
        const data = await response.json();
        if (!data.success) return;
        const analytics = data.analytics;
        renderDashboardChart('projectChart', doughnutChart(analytics.projects, ['#667eea', '#10b981', '#f59e0b', '#ef4444', '#94a3b8']));
        renderDashboardChart('departmentChart', horizontalBarChart(analytics.departments, '#764ba2'));
        renderDashboardChart('employeeChart', lineChart(analytics.employee_growth, '#667eea', 'New employees'));
        renderDashboardChart('attendanceChart', lineChart(analytics.attendance, '#10b981', 'Present employees'));
    } catch (error) { console.error('Error loading dashboard analytics:', error); }
}

function doughnutChart(items, colors) {
    return { type: 'doughnut', data: { labels: items.map(item => item.label.replace('_', ' ')), datasets: [{ data: items.map(item => item.value), backgroundColor: items.map((_, index) => colors[index % colors.length]), borderWidth: 0, hoverOffset: 5 }] }, options: { responsive: true, maintainAspectRatio: false, cutout: '68%', plugins: { legend: { position: 'bottom', labels: { boxWidth: 9, boxHeight: 9, usePointStyle: true, padding: 16 } } } } };
}

function horizontalBarChart(items, color) {
    return { type: 'bar', data: { labels: items.map(item => item.label), datasets: [{ data: items.map(item => item.value), backgroundColor: color, borderRadius: 7, borderSkipped: false }] }, options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true, ticks: { precision: 0 }, border: { display: false }, grid: { color: 'rgba(148,163,184,.16)' } }, y: { border: { display: false }, grid: { display: false } } } } };
}

function lineChart(items, color, label) {
    return { type: 'line', data: { labels: items.map(item => item.label), datasets: [{ label, data: items.map(item => item.value), borderColor: color, backgroundColor: color + '1f', fill: true, tension: .4, pointBackgroundColor: color, pointRadius: 3, pointHoverRadius: 5, borderWidth: 3 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, border: { display: false } }, y: { beginAtZero: true, ticks: { precision: 0 }, border: { display: false }, grid: { color: 'rgba(148,163,184,.16)' } } } } };
}

async function loadRecentActivity() {
    const adminUser = JSON.parse(localStorage.getItem('adminUser'));
    if (!adminUser) return;
    
    try {
        const response = await fetch(`../../backend/api/notifications.php?action=get_notifications&user_id=${adminUser.id}`);
        const data = await response.json();
        
        if (data.success) {
            const container = document.getElementById('recentActivity');
            
            if (data.notifications.length === 0) {
                container.innerHTML = '<div style="text-align: center; color: var(--gray-500);">No recent activity</div>';
                return;
            }
            
            const recentNotifications = data.notifications.slice(0, 5);
            container.innerHTML = recentNotifications.map(notif => `
                <div style="display: flex; align-items: flex-start; gap: 0.75rem; padding: 0.75rem 0; border-bottom: 1px solid var(--gray-200);">
                    <div class="notification-icon ${getNotificationIconClass(notif.type)}" style="width: 32px; height: 32px;">
                        <i data-lucide="${getNotificationIcon(notif.type)}" style="width: 16px; height: 16px;"></i>
                    </div>
                    <div style="flex: 1;">
                        <div style="font-weight: 600; font-size: 0.9rem;">${notif.title}</div>
                        <div style="color: var(--gray-500); font-size: 0.8rem;">${formatTime(notif.created_at)}</div>
                    </div>
                </div>
            `).join('');
            
            lucide.createIcons();
        }
    } catch (error) {
        console.error('Error loading recent activity:', error);
    }
}

function getNotificationIcon(type) {
    const icons = {
        'info': 'info',
        'success': 'check-circle',
        'warning': 'alert-triangle',
        'error': 'alert-circle',
        'leave': 'calendar',
        'attendance': 'clock',
        'project': 'briefcase'
    };
    return icons[type] || 'bell';
}

function getNotificationIconClass(type) {
    const classes = {
        'info': 'primary',
        'success': 'success',
        'warning': 'warning',
        'error': 'danger',
        'leave': 'warning',
        'attendance': 'primary',
        'project': 'success'
    };
    return classes[type] || 'primary';
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return Math.floor(diff / 60000) + ' min ago';
    if (diff < 86400000) return Math.floor(diff / 3600000) + ' hours ago';
    if (diff < 604800000) return Math.floor(diff / 86400000) + ' days ago';
    
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

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

function logout() {
    localStorage.removeItem('adminUser');
    window.location.href = 'login.php';
}

function redirectToLogin() {
    localStorage.removeItem('adminUser');
    window.location.replace('login.php?session=expired');
}
