// Employee Leave Requests JavaScript
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
    
    // Load leave requests
    loadLeaveRequests();
    loadNotificationCount();
    
    // Real-time updates
    setInterval(() => {
        loadLeaveRequests();
        loadNotificationCount();
    }, 30000);
    
    // Calculate days when dates change
    document.getElementById('startDate').addEventListener('change', calculateDays);
    document.getElementById('endDate').addEventListener('change', calculateDays);
});

async function loadLeaveRequests() {
    const employeeData = JSON.parse(localStorage.getItem('employeeData'));
    
    try {
        const response = await fetch(`../../backend/api/leave.php?action=get_employee_leaves&employee_id=${employeeData.id}`);
        const data = await response.json();
        
        if (data.success) {
            const tbody = document.getElementById('leavesTableBody');
            
            if (data.requests.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No leave requests found</td></tr>';
                return;
            }
            
            tbody.innerHTML = data.requests.map(request => `
                <tr>
                    <td><span class="badge badge-${request.leave_type}">${formatLeaveType(request.leave_type)}</span></td>
                    <td>${formatDate(request.start_date)} - ${formatDate(request.end_date)}</td>
                    <td>${request.total_days} day(s)</td>
                    <td>${request.reason || 'N/A'}</td>
                    <td><span class="badge badge-${request.status}">${request.status}</span></td>
                    <td>
                        <button class="btn btn-secondary btn-sm" onclick="viewLeave(${request.id})">
                            <i data-lucide="eye" style="width: 16px; height: 16px;"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
            
            lucide.createIcons();
        }
    } catch (error) {
        console.error('Error loading leave requests:', error);
    }
}

function formatLeaveType(type) {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function calculateDays() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        document.getElementById('totalDays').value = diffDays;
    }
}

function openLeaveModal() {
    document.getElementById('leaveForm').reset();
    document.getElementById('leaveModal').classList.add('active');
}

function closeLeaveModal() {
    document.getElementById('leaveModal').classList.remove('active');
}

async function viewLeave(leaveId) {
    const employeeData = JSON.parse(localStorage.getItem('employeeData'));
    
    try {
        const response = await fetch(`../../backend/api/leave.php?action=get_employee_leaves&employee_id=${employeeData.id}`);
        const data = await response.json();
        
        if (data.success) {
            const request = data.requests.find(r => r.id === leaveId);
            
            if (request) {
                alert(`
Leave Type: ${formatLeaveType(request.leave_type)}
Duration: ${formatDate(request.start_date)} - ${formatDate(request.end_date)}
Total Days: ${request.total_days}
Reason: ${request.reason || 'N/A'}
Status: ${request.status}
${request.admin_notes ? `Admin Notes: ${request.admin_notes}` : ''}
                `);
            }
        }
    } catch (error) {
        alert('Error loading leave details');
    }
}

document.getElementById('leaveForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const employeeData = JSON.parse(localStorage.getItem('employeeData'));
    
    const leaveData = {
        action: 'request_leave',
        employee_id: employeeData.id,
        leave_type: document.getElementById('leaveType').value,
        start_date: document.getElementById('startDate').value,
        end_date: document.getElementById('endDate').value,
        total_days: parseInt(document.getElementById('totalDays').value),
        reason: document.getElementById('leaveReason').value
    };
    
    // Show loader
    document.getElementById('pageLoader').classList.add('active');
    
    try {
        const response = await fetch('../../backend/api/leave.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(leaveData)
        });
        
        const data = await response.json();
        
        // Hide loader
        document.getElementById('pageLoader').classList.remove('active');
        
        if (data.success) {
            Swal.fire({
                icon: 'success',
                title: 'Leave Request Submitted',
                text: 'Your leave request has been submitted successfully and emails have been sent.',
                confirmButtonColor: '#667eea'
            });
            closeLeaveModal();
            loadLeaveRequests();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: data.message || 'Failed to submit leave request',
                confirmButtonColor: '#ef4444'
            });
        }
    } catch (error) {
        document.getElementById('pageLoader').classList.remove('active');
        Swal.fire({
            icon: 'error',
            title: 'Network Error',
            text: 'Please try again.',
            confirmButtonColor: '#ef4444'
        });
    }
});

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
