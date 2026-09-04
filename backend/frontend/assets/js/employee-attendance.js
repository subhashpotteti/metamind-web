// Employee Attendance History JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const employeeUser = localStorage.getItem('employeeUser');
    const employeeData = localStorage.getItem('employeeData');
    
    if (!employeeUser || !employeeData) {
        window.location.href = 'login.php';
        return;
    }
    
    const employee = JSON.parse(employeeData);
    
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Set user info
    document.getElementById('userName').textContent = employee.full_name;
    document.getElementById('userAvatar').textContent = employee.full_name.charAt(0).toUpperCase();
    
    // Set current month
    const now = new Date();
    document.getElementById('attendanceMonth').value = now.toISOString().slice(0, 7);
    
    // Load attendance
    loadAttendance();
    loadNotificationCount();
    
    // Real-time updates
    setInterval(() => {
        loadNotificationCount();
    }, 30000);
});

async function loadAttendance() {
    const employeeData = JSON.parse(localStorage.getItem('employeeData'));
    const month = document.getElementById('attendanceMonth').value;
    
    try {
        const response = await fetch(`../../backend/api/employee.php?action=get_attendance_history&employee_id=${employeeData.id}&month=${month}`);
        const data = await response.json();
        
        if (data.success) {
            const tbody = document.getElementById('attendanceTableBody');
            
            if (data.attendance.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No attendance records found</td></tr>';
                return;
            }
            
            tbody.innerHTML = data.attendance.map(record => `
                <tr>
                    <td>${formatDate(record.date)}</td>
                    <td>${formatAttendanceTime(record.check_in_time)}</td>
                    <td>${formatAttendanceTime(record.check_out_time)}</td>
                    <td>${record.total_hours ? record.total_hours + 'h' : '0h'}</td>
                    <td><span class="badge badge-${record.status}">${record.status}</span></td>
                </tr>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading attendance:', error);
    }
}

function formatAttendanceTime(value) {
    if (!value) return '--:--';
    const raw = value.includes(' ') ? value.split(' ')[1] : value;
    const [hour = 0, minute = 0, second = 0] = raw.split(':').map(Number);
    return new Date(2000, 0, 1, hour, minute, second).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
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

function logout() {
    localStorage.removeItem('employeeUser');
    localStorage.removeItem('employeeData');
    window.location.href = 'login.php';
}
