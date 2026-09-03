// Employee Dashboard JavaScript
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
    
    // Update user info
    document.getElementById('userName').textContent = employee.full_name;
    document.getElementById('userAvatar').textContent = employee.full_name.charAt(0).toUpperCase();
    
    // Update time
    updateTime();
    setInterval(updateTime, 1000);
    
    // Load today's attendance
    loadTodayAttendance();
    
    // Load attendance history
    loadAttendanceHistory();
    
    // Load profile
    loadProfile();
});

function updateTime() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
    const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    document.getElementById('currentTime').textContent = timeStr;
    document.getElementById('currentDate').textContent = dateStr;
}

function showSection(section) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
    
    // Show selected section
    document.getElementById(section + 'Section').style.display = 'block';
    
    // Update active nav
    document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));
    event.target.closest('a').classList.add('active');
    
    // Update page title
    const titles = {
        'dashboard': 'Dashboard',
        'attendance': 'Attendance History',
        'profile': 'My Profile'
    };
    document.getElementById('pageTitle').textContent = titles[section];
}

async function loadTodayAttendance() {
    const employeeData = JSON.parse(localStorage.getItem('employeeData'));
    
    try {
        const response = await fetch(`../../backend/api/attendance.php?employee_id=${employeeData.id}`);
        const data = await response.json();
        
        if (data.success && data.today) {
            const today = data.today;
            const sessionOpen = Boolean(today.check_in_time && !today.check_out_time);
            
            if (today.check_in_time) {
                document.getElementById('todayCheckIn').textContent = today.check_in_time.split(' ')[1];
                document.getElementById('checkInBtn').disabled = sessionOpen;
                document.getElementById('statusText').textContent = 'Checked In';
            }
            
            if (today.check_out_time) {
                document.getElementById('todayCheckOut').textContent = today.check_out_time.split(' ')[1];
                document.getElementById('checkOutBtn').disabled = true;
                document.getElementById('statusText').textContent = 'Checked Out';
            } else if (sessionOpen) {
                document.getElementById('checkOutBtn').disabled = false;
            }
            
            if (today.day_total_hours || today.total_hours) {
                document.getElementById('todayHours').textContent = (today.day_total_hours || today.total_hours) + 'h';
            }
        }
    } catch (error) {
        console.error('Error loading today\'s attendance:', error);
    }
}

async function loadAttendanceHistory() {
    const employeeData = JSON.parse(localStorage.getItem('employeeData'));
    
    try {
        const response = await fetch(`../../backend/api/attendance.php?employee_id=${employeeData.id}`);
        const data = await response.json();
        
        if (data.success && data.attendance) {
            const tbody = document.getElementById('attendanceTableBody');
            
            if (data.attendance.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No attendance records found</td></tr>';
                return;
            }
            
            tbody.innerHTML = data.attendance.map(record => `
                <tr>
                    <td>${new Date(record.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</td>
                    <td>${record.check_in_time ? record.check_in_time.split(' ')[1] : '--:--'}</td>
                    <td>${record.check_out_time ? record.check_out_time.split(' ')[1] : '--:--'}</td>
                    <td>${record.total_hours ? record.total_hours + 'h' : '0h'}</td>
                    <td><span class="badge badge-${record.status}">${record.status}</span></td>
                </tr>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading attendance history:', error);
    }
}

function loadProfile() {
    const employeeData = JSON.parse(localStorage.getItem('employeeData'));
    
    const profileContent = document.getElementById('profileContent');
    profileContent.innerHTML = `
        <div style="text-align: center; margin-bottom: 2rem;">
            ${employeeData.photo ? `<img src="../../backend/${employeeData.photo}" style="width: 150px; height: 150px; border-radius: 50%; object-fit: cover; border: 4px solid var(--gray-200);">` : '<div class="user-avatar" style="width: 150px; height: 150px; font-size: 3rem; margin: 0 auto;">?</div>'}
            <h2 style="margin-top: 1rem; color: var(--gray-800);">${employeeData.full_name}</h2>
            <p style="color: var(--gray-500);">${employeeData.designation}</p>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
            <div>
                <p style="color: var(--gray-500); font-size: 0.875rem; margin-bottom: 0.25rem;">Employee ID</p>
                <p style="font-weight: 600; color: var(--gray-800);">#EMP${String(employeeData.id).padStart(4, '0')}</p>
            </div>
            <div>
                <p style="color: var(--gray-500); font-size: 0.875rem; margin-bottom: 0.25rem;">Email</p>
                <p style="font-weight: 600; color: var(--gray-800);">${employeeData.email}</p>
            </div>
            <div>
                <p style="color: var(--gray-500); font-size: 0.875rem; margin-bottom: 0.25rem;">Phone</p>
                <p style="font-weight: 600; color: var(--gray-800);">${employeeData.phone}</p>
            </div>
            <div>
                <p style="color: var(--gray-500); font-size: 0.875rem; margin-bottom: 0.25rem;">Department</p>
                <p style="font-weight: 600; color: var(--gray-800);">${employeeData.department}</p>
            </div>
            <div>
                <p style="color: var(--gray-500); font-size: 0.875rem; margin-bottom: 0.25rem;">Date of Birth</p>
                <p style="font-weight: 600; color: var(--gray-800);">${employeeData.date_of_birth}</p>
            </div>
            <div>
                <p style="color: var(--gray-500); font-size: 0.875rem; margin-bottom: 0.25rem;">Gender</p>
                <p style="font-weight: 600; color: var(--gray-800);">${employeeData.gender}</p>
            </div>
            <div>
                <p style="color: var(--gray-500); font-size: 0.875rem; margin-bottom: 0.25rem;">Joining Date</p>
                <p style="font-weight: 600; color: var(--gray-800);">${employeeData.joining_date}</p>
            </div>
            <div>
                <p style="color: var(--gray-500); font-size: 0.875rem; margin-bottom: 0.25rem;">Status</p>
                <span class="badge badge-${employeeData.status}">${employeeData.status}</span>
            </div>
            ${employeeData.address ? `
                <div style="grid-column: span 2;">
                    <p style="color: var(--gray-500); font-size: 0.875rem; margin-bottom: 0.25rem;">Address</p>
                    <p style="font-weight: 600; color: var(--gray-800);">${employeeData.address}</p>
                </div>
            ` : ''}
            ${employeeData.city || employeeData.state || employeeData.pincode ? `
                <div style="grid-column: span 2;">
                    <p style="color: var(--gray-500); font-size: 0.875rem; margin-bottom: 0.25rem;">Location</p>
                    <p style="font-weight: 600; color: var(--gray-800;">${employeeData.city || ''}${employeeData.city && employeeData.state ? ', ' : ''}${employeeData.state || ''} ${employeeData.pincode || ''}</p>
                </div>
            ` : ''}
        </div>
    `;
}

async function checkIn() {
    const employeeData = JSON.parse(localStorage.getItem('employeeData'));
    
    try {
        const response = await fetch('../../backend/api/attendance.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'check_in',
                employee_id: employeeData.id
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Checked in successfully at ' + data.check_in_time, 'success');
            document.getElementById('checkInBtn').disabled = true;
            document.getElementById('checkOutBtn').disabled = false;
            document.getElementById('statusText').textContent = 'Checked In';
            document.getElementById('todayCheckIn').textContent = data.check_in_time;
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
        const response = await fetch('../../backend/api/attendance.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'check_out',
                employee_id: employeeData.id
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Checked out successfully. Total hours: ' + data.total_hours, 'success');
            document.getElementById('checkOutBtn').disabled = true;
            document.getElementById('statusText').textContent = 'Checked Out';
            document.getElementById('todayCheckOut').textContent = data.check_out_time;
            document.getElementById('todayHours').textContent = data.total_hours + 'h';
            loadTodayAttendance();
            loadAttendanceHistory();
        } else {
            showAlert(data.message || 'Failed to check out', 'error');
        }
    } catch (error) {
        showAlert('Network error. Please try again.', 'error');
    }
}

function logout() {
    localStorage.removeItem('employeeUser');
    localStorage.removeItem('employeeData');
    window.location.href = 'login.php';
}

function showAlert(message, type) {
    const alertContainer = document.getElementById('alertContainer');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} fade-in`;
    alert.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
            ${type === 'success' 
                ? '<polyline points="20 6 9 17 4 12"></polyline>' 
                : '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>'
            }
        </svg>
        ${message}
    `;
    alertContainer.innerHTML = '';
    alertContainer.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 5000);
}
