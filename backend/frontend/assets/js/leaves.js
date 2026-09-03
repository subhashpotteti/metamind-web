// Leave Requests Management JavaScript
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
    loadLeaveStats();
    loadLeaveRequests();
    loadNotificationCount();
    
    // Real-time updates
    setInterval(() => {
        loadLeaveStats();
        loadLeaveRequests();
        loadNotificationCount();
    }, 30000);
});

async function loadLeaveStats() {
    try {
        const response = await fetch('../../backend/api/leave.php?action=get_leave_stats');
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('pendingRequests').textContent = data.stats.pending_requests;
            document.getElementById('approvedThisMonth').textContent = data.stats.approved_this_month;
        }
    } catch (error) {
        console.error('Error loading leave stats:', error);
    }
}

async function loadLeaveRequests() {
    try {
        const response = await fetch('../../backend/api/leave.php?action=get_leave_requests');
        const data = await response.json();
        
        if (data.success) {
            const tbody = document.getElementById('leavesTableBody');
            
            if (data.requests.length === 0) {
                tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">No leave requests found</td></tr>';
                return;
            }
            
            tbody.innerHTML = data.requests.map(request => `
                <tr>
                    <td>
                        <div style="font-weight: 600;">${request.full_name}</div>
                        <div style="font-size: 0.8rem; color: var(--gray-500);">${request.designation}</div>
                    </td>
                    <td>${request.department}</td>
                    <td><span class="badge badge-${request.leave_type}">${formatLeaveType(request.leave_type)}</span></td>
                    <td>${formatDate(request.start_date)} - ${formatDate(request.end_date)}</td>
                    <td>${request.total_days} day(s)</td>
                    <td>${request.reason || 'N/A'}</td>
                    <td><span class="badge badge-${request.status}">${request.status}</span></td>
                    <td>
                        ${request.status === 'pending' ? `
                            <button class="btn btn-success btn-sm" onclick="approveLeave(${request.id})">
                                <i data-lucide="check" style="width: 16px; height: 16px;"></i>
                            </button>
                            <button class="btn btn-danger btn-sm" onclick="rejectLeave(${request.id})">
                                <i data-lucide="x" style="width: 16px; height: 16px;"></i>
                            </button>
                        ` : `
                            <button class="btn btn-secondary btn-sm" onclick="viewLeave(${request.id})">
                                <i data-lucide="eye" style="width: 16px; height: 16px;"></i>
                            </button>
                        `}
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

async function approveLeave(leaveId) {
    const { value: notes } = await Swal.fire({
        title: 'Approve Leave Request',
        input: 'textarea',
        inputLabel: 'Admin Notes (Optional)',
        inputPlaceholder: 'Enter any notes...',
        showCancelButton: true,
        confirmButtonText: 'Approve',
        confirmButtonColor: '#10b981',
        cancelButtonColor: '#667eea'
    });
    
    // Show loader
    const pageLoader = document.getElementById('pageLoader');
    if (pageLoader && pageLoader.classList) {
        pageLoader.classList.add('active');
    }
    
    try {
        const response = await fetch('../../backend/api/leave.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'approve_leave',
                leave_id: leaveId,
                admin_notes: notes || ''
            })
        });
        
        const data = await response.json();
        
        // Hide loader
        if (pageLoader && pageLoader.classList) {
            pageLoader.classList.remove('active');
        }
        
        if (data.success) {
            Swal.fire({
                icon: 'success',
                title: 'Leave Approved',
                text: 'Leave request has been approved and emails have been sent.',
                confirmButtonColor: '#10b981'
            });
            loadLeaveRequests();
            loadLeaveStats();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Approval Failed',
                text: data.message || 'Failed to approve leave',
                confirmButtonColor: '#ef4444'
            });
        }
    } catch (error) {
        if (pageLoader && pageLoader.classList) {
            pageLoader.classList.remove('active');
        }
        Swal.fire({
            icon: 'error',
            title: 'Network Error',
            text: 'Please try again.',
            confirmButtonColor: '#ef4444'
        });
    }
}

async function rejectLeave(leaveId) {
    const { value: notes } = await Swal.fire({
        title: 'Reject Leave Request',
        input: 'textarea',
        inputLabel: 'Rejection Reason',
        inputPlaceholder: 'Enter the reason for rejection...',
        inputValidator: (value) => {
            if (!value) {
                return 'Please provide a rejection reason';
            }
        },
        showCancelButton: true,
        confirmButtonText: 'Reject',
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#667eea'
    });
    
    if (!notes) return;
    
    // Show loader
    const pageLoader = document.getElementById('pageLoader');
    if (pageLoader && pageLoader.classList) {
        pageLoader.classList.add('active');
    }
    
    try {
        const response = await fetch('../../backend/api/leave.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'reject_leave',
                leave_id: leaveId,
                admin_notes: notes
            })
        });
        
        const data = await response.json();
        
        // Hide loader
        if (pageLoader && pageLoader.classList) {
            pageLoader.classList.remove('active');
        }
        
        if (data.success) {
            Swal.fire({
                icon: 'success',
                title: 'Leave Rejected',
                text: 'Leave request has been rejected and email has been sent.',
                confirmButtonColor: '#667eea'
            });
            loadLeaveRequests();
            loadLeaveStats();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Rejection Failed',
                text: data.message || 'Failed to reject leave',
                confirmButtonColor: '#ef4444'
            });
        }
    } catch (error) {
        if (pageLoader && pageLoader.classList) {
            pageLoader.classList.remove('active');
        }
        Swal.fire({
            icon: 'error',
            title: 'Network Error',
            text: 'Please try again.',
            confirmButtonColor: '#ef4444'
        });
    }
}

async function viewLeave(leaveId) {
    try {
        const response = await fetch('../../backend/api/leave.php?action=get_leave_requests');
        const data = await response.json();
        
        if (data.success) {
            const request = data.requests.find(r => r.id === leaveId);
            
            if (request) {
                const modalBody = document.getElementById('leaveModalBody');
                modalBody.innerHTML = `
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div>
                            <p style="color: var(--gray-500); font-size: 0.875rem;">Employee</p>
                            <p style="font-weight: 600;">${request.full_name}</p>
                        </div>
                        <div>
                            <p style="color: var(--gray-500); font-size: 0.875rem;">Department</p>
                            <p style="font-weight: 600;">${request.department}</p>
                        </div>
                        <div>
                            <p style="color: var(--gray-500); font-size: 0.875rem;">Leave Type</p>
                            <p style="font-weight: 600;">${formatLeaveType(request.leave_type)}</p>
                        </div>
                        <div>
                            <p style="color: var(--gray-500); font-size: 0.875rem;">Duration</p>
                            <p style="font-weight: 600;">${formatDate(request.start_date)} - ${formatDate(request.end_date)}</p>
                        </div>
                        <div>
                            <p style="color: var(--gray-500); font-size: 0.875rem;">Total Days</p>
                            <p style="font-weight: 600;">${request.total_days} day(s)</p>
                        </div>
                        <div>
                            <p style="color: var(--gray-500); font-size: 0.875rem;">Status</p>
                            <span class="badge badge-${request.status}">${request.status}</span>
                        </div>
                        <div style="grid-column: span 2;">
                            <p style="color: var(--gray-500); font-size: 0.875rem;">Reason</p>
                            <p style="font-weight: 600;">${request.reason || 'N/A'}</p>
                        </div>
                        ${request.admin_notes ? `
                            <div style="grid-column: span 2;">
                                <p style="color: var(--gray-500); font-size: 0.875rem;">Admin Notes</p>
                                <p style="font-weight: 600;">${request.admin_notes}</p>
                            </div>
                        ` : ''}
                    </div>
                `;
                
                document.getElementById('leaveModal').classList.add('active');
            }
        }
    } catch (error) {
        showAlert('Error loading leave details', 'error');
    }
}

function closeLeaveModal() {
    document.getElementById('leaveModal').classList.remove('active');
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
