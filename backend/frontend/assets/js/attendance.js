// Attendance Management JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const adminUser = localStorage.getItem('adminUser');
    if (!adminUser) {
        window.location.href = 'login.php';
        return;
    }
    
    // Initialize Lucide icons
    lucide.createIcons();
    
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('attendanceFromDate').value = today;
    document.getElementById('attendanceToDate').value = today;
    
    // Load data
    loadAttendance();
    loadNotificationCount();
    
    // Real-time updates
    setInterval(() => {
        loadAttendance();
        loadNotificationCount();
    }, 30000);
});

async function loadAttendance() {
    const fromDate = document.getElementById('attendanceFromDate').value;
    const toDate = document.getElementById('attendanceToDate').value;

    if (!fromDate || !toDate || fromDate > toDate) {
        document.getElementById('attendanceTableBody').innerHTML = '<tr><td colspan="7" style="text-align: center;">Please select a valid date range</td></tr>';
        return;
    }
    
    try {
        const response = await fetch(`../../backend/api/admin.php?action=get_attendance&from_date=${encodeURIComponent(fromDate)}&to_date=${encodeURIComponent(toDate)}`);
        const data = await response.json();
        
        if (data.success) {
            const tbody = document.getElementById('attendanceTableBody');
            
            if (data.attendance.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No attendance records found</td></tr>';
                return;
            }
            
            tbody.innerHTML = data.attendance.map(record => `
                <tr>
                    <td>${record.full_name}</td>
                    <td>${record.department}</td>
                    <td>${record.designation}</td>
                    <td>${formatAttendanceTime(record.check_in_time)}</td>
                    <td>${formatAttendanceTime(record.check_out_time)}</td>
                    <td>${record.checkout_reason || '—'}</td>
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
    const time = value.includes(' ') ? value.split(' ')[1] : value;
    const [hour = 0, minute = 0, second = 0] = time.split(':').map(Number);
    return new Date(2000, 0, 1, hour, minute, second).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
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
