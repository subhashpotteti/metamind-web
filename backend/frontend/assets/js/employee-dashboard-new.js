// Employee Dashboard Overview JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const employeeUser = localStorage.getItem('employeeUser');
    const employeeData = localStorage.getItem('employeeData');
    
    if (!employeeUser || !employeeData) {
        window.location.href = 'login.php';
        return;
    }
    
    const user = JSON.parse(employeeUser);
    const employee = JSON.parse(employeeData);
    
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Set user info
    document.getElementById('userName').textContent = employee.full_name;
    document.getElementById('userAvatar').textContent = employee.full_name.charAt(0).toUpperCase();
    document.getElementById('welcomeMessage').textContent = `${getGreeting()}, ${employee.full_name.split(' ')[0]}`;
    document.getElementById('employeeRole').textContent = [employee.designation, employee.department].filter(Boolean).join(' · ') || 'Your workspace is ready.';
    
    // Update time
    updateTime();
    setInterval(updateTime, 1000);
    
    // Load today's attendance
    loadTodayAttendance();
    loadDashboardOverview();
    loadNotificationCount();
    
    // Real-time updates
    setInterval(() => {
        loadTodayAttendance();
        loadDashboardOverview();
        loadNotificationCount();
    }, 30000);
});

let employeeAttendanceChart;

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
}

function updateTime() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    document.getElementById('currentTime').textContent = timeStr;
    document.getElementById('currentDate').textContent = dateStr;
}

async function loadTodayAttendance() {
    const employeeData = JSON.parse(localStorage.getItem('employeeData'));
    const today = new Date().toISOString().split('T')[0];
    
    try {
        const response = await fetch(`../../backend/api/employee.php?action=get_today_attendance&employee_id=${employeeData.id}&date=${today}`);
        const data = await response.json();
        
        if (data.success && data.attendance) {
            const attendance = data.attendance;
            const sessionOpen = Boolean(attendance.check_in_time && !attendance.check_out_time);
            
            if (attendance.check_in_time) {
                document.getElementById('todayCheckIn').textContent = attendance.check_in_time.split(' ')[1];
                document.getElementById('checkInBtn').disabled = sessionOpen;
                document.getElementById('statusText').textContent = 'Checked In';
                document.getElementById('summaryStatus').textContent = 'Checked in';
            }
            
            if (attendance.check_out_time) {
                document.getElementById('todayCheckOut').textContent = attendance.check_out_time.split(' ')[1];
                document.getElementById('checkOutBtn').disabled = true;
                document.getElementById('statusText').textContent = 'Checked Out';
                document.getElementById('summaryStatus').textContent = 'Day complete';
            } else if (sessionOpen) {
                document.getElementById('checkOutBtn').disabled = false;
            }
            
            const totalHours = attendance.day_total_hours || attendance.total_hours || 0;
            document.getElementById('todayHours').textContent = totalHours + 'h';
            document.getElementById('todayHoursMetric').textContent = totalHours + 'h';
            document.getElementById('workdayHint').textContent = sessionOpen ? 'Your workday is in progress' : 'Start another session when you are ready';
        } else {
            document.getElementById('checkInBtn').disabled = false;
            document.getElementById('checkOutBtn').disabled = true;
            document.getElementById('summaryStatus').textContent = 'Not started';
            document.getElementById('todayHoursMetric').textContent = '0h';
        }
    } catch (error) {
        console.error('Error loading attendance:', error);
    }
}

async function loadDashboardOverview() {
    const employee = JSON.parse(localStorage.getItem('employeeData'));
    if (!employee) return;
    try {
        const response = await fetch(`../../backend/api/employee.php?action=get_dashboard_overview&employee_id=${employee.id}`);
        const data = await response.json();
        if (!data.success) return;
        const overview = data.overview;
        const presentDays = overview.attendance.reduce((sum, item) => sum + item.value, 0);
        document.getElementById('weeklyAttendance').textContent = `${presentDays} ${presentDays === 1 ? 'day' : 'days'}`;
        document.getElementById('leaveRequests').textContent = overview.leave.total_requests;
        document.getElementById('pendingLeaves').textContent = overview.leave.pending_requests;
        document.getElementById('approvedLeaveDays').textContent = overview.leave.approved_days_this_month;
        document.getElementById('leaveStatusHint').textContent = overview.leave.pending_requests ? `${overview.leave.pending_requests} awaiting approval` : 'No pending requests';
        renderAttendanceChart(overview.attendance);
    } catch (error) {
        console.error('Error loading employee overview:', error);
    }
}

function renderAttendanceChart(items) {
    const canvas = document.getElementById('employeeAttendanceChart');
    if (!canvas || typeof Chart === 'undefined') return;
    if (employeeAttendanceChart) employeeAttendanceChart.destroy();
    employeeAttendanceChart = new Chart(canvas.getContext('2d'), {
        type: 'bar',
        data: {
            labels: items.map(item => item.label),
            datasets: [{ data: items.map(item => item.value), backgroundColor: items.map(item => item.value ? '#667eea' : '#e2e8f0'), borderRadius: 6, borderSkipped: false }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { callbacks: { label: context => context.raw ? 'Present' : 'No record' } } },
            scales: { x: { grid: { display: false }, border: { display: false } }, y: { display: false, beginAtZero: true, max: 1.2 } }
        }
    });
}

async function checkIn() {
    const employeeData = JSON.parse(localStorage.getItem('employeeData'));
    
    try {
        const response = await fetch('../../backend/api/employee.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'check_in',
                employee_id: employeeData.id
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Checked in successfully', 'success');
            loadTodayAttendance();
        } else {
            showAlert(data.message || 'Failed to check in', 'error');
        }
    } catch (error) {
        showAlert('Network error. Please try again.', 'error');
    }
}

async function checkOut() {
    const employeeData = JSON.parse(localStorage.getItem('employeeData'));
    
    try {
        const response = await fetch('../../backend/api/employee.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'check_out',
                employee_id: employeeData.id
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Checked out successfully', 'success');
            loadTodayAttendance();
        } else {
            showAlert(data.message || 'Failed to check out', 'error');
        }
    } catch (error) {
        showAlert('Network error. Please try again.', 'error');
    }
}

async function loadNotificationCount() {
    const employeeUser = JSON.parse(localStorage.getItem('employeeUser'));
    if (!employeeUser) return;
    
    try {
        const response = await fetch(`../../backend/api/notifications.php?action=get_unread_count&user_id=${employeeUser.id}`);
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
    localStorage.removeItem('employeeUser');
    localStorage.removeItem('employeeData');
    window.location.href = 'login.php';
}
