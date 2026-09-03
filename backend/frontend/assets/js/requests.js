// Registration Requests Management JavaScript
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
    loadRequests('pending');
    loadNotificationCount();
    document.getElementById('approvalForm').addEventListener('submit', submitApproval);
    
    // Real-time updates
    setInterval(() => {
        loadRequests('pending');
        loadNotificationCount();
    }, 30000);
});

async function loadRequests(filter) {
    try {
        const action = filter === 'pending' ? 'get_requests' : 'get_all_requests';
        const response = await fetch(`../../backend/api/admin.php?action=${action}`);
        const data = await response.json();
        
        if (data.success) {
            const tbody = document.getElementById('requestsTableBody');
            
            if (data.requests.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No requests found</td></tr>';
                return;
            }
            
            tbody.innerHTML = data.requests.map(request => `
                <tr>
                    <td>
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            ${request.photo ? `<img src="../../backend/${request.photo}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; cursor: pointer;" onclick="openPhotoPreview('../../backend/${request.photo}')">` : '<div class="user-avatar" style="width: 40px; height: 40px; font-size: 0.9rem;">?</div>'}
                            <span>${request.full_name}</span>
                        </div>
                    </td>
                    <td>${request.email}</td>
                    <td>${request.phone}</td>
                    <td>${request.department}</td>
                    <td>${request.designation}</td>
                    <td><span class="badge badge-${request.status}">${request.status}</span></td>
                    <td>
                        ${request.status === 'pending' ? `
                            <button class="btn btn-success btn-sm" onclick="openApprovalModal(${request.id})">Approve</button>
                            <button class="btn btn-danger btn-sm" onclick="rejectRequest(${request.id})">Reject</button>
                            <button class="btn btn-secondary btn-sm" onclick="viewRequest(${request.id})">View</button>
                        ` : `
                            <button class="btn btn-secondary btn-sm" onclick="viewRequest(${request.id})">View</button>
                        `}
                    </td>
                </tr>
            `).join('');
            
            lucide.createIcons();
        }
    } catch (error) {
        console.error('Error loading requests:', error);
    }
}

function openApprovalModal(requestId) {
    document.getElementById('approvalRequestId').value = requestId;
    document.getElementById('approvalEmployeeCode').value = '';
    document.getElementById('approvalNotes').value = '';
    document.getElementById('approvalModal').classList.add('active');
    document.getElementById('approvalEmployeeCode').focus();
}

function closeApprovalModal() {
    document.getElementById('approvalModal').classList.remove('active');
}

async function submitApproval(event) {
    event.preventDefault();
    const requestId = document.getElementById('approvalRequestId').value;
    const employeeCode = document.getElementById('approvalEmployeeCode').value.trim();
    const notes = document.getElementById('approvalNotes').value.trim();

    if (!/^[A-Za-z0-9_-]{3,50}$/.test(employeeCode)) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid Employee ID',
            text: 'Enter a valid Employee ID (3–50 letters, numbers, hyphens or underscores).',
            confirmButtonColor: '#667eea'
        });
        return;
    }

    // Show loader
    const pageLoader = document.getElementById('pageLoader');
    if (pageLoader && pageLoader.classList) {
        pageLoader.classList.add('active');
    }

    try {
        const response = await fetch('../../backend/api/admin.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'approve_request',
                request_id: requestId,
                employee_code: employeeCode,
                admin_notes: notes
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Hide loader
        if (pageLoader && pageLoader.classList) {
            pageLoader.classList.remove('active');
        }
        
        if (data.success) {
            Swal.fire({
                icon: 'success',
                title: 'Registration Successful',
                text: data.message || 'Employee has been approved and emails have been sent.',
                confirmButtonColor: '#667eea'
            });
            closeApprovalModal();
            loadRequests('pending');
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Approval Failed',
                text: data.message || 'Failed to approve request',
                confirmButtonColor: '#ef4444'
            });
        }
    } catch (error) {
        console.error('Approval error:', error);
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

async function rejectRequest(requestId) {
    const { value: notes } = await Swal.fire({
        title: 'Reject Request',
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
        const response = await fetch('../../backend/api/admin.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'reject_request',
                request_id: requestId,
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
                title: 'Request Rejected',
                text: 'The registration request has been rejected and email has been sent.',
                confirmButtonColor: '#667eea'
            });
            loadRequests('pending');
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Rejection Failed',
                text: data.message || 'Failed to reject request',
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

async function viewRequest(requestId) {
    try {
        const response = await fetch('../../backend/api/admin.php?action=get_all_requests');
        const data = await response.json();
        
        if (data.success) {
            const request = data.requests.find(r => r.id === requestId);
            
            if (request) {
                const modalBody = document.getElementById('modalBody');
                modalBody.innerHTML = `
                    <div style="text-align: center; margin-bottom: 1.5rem;">
                        ${request.photo ? `<img src="../../backend/${request.photo}" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 4px solid var(--gray-200);">` : '<div class="user-avatar" style="width: 120px; height: 120px; font-size: 2.5rem; margin: 0 auto;">?</div>'}
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div>
                            <p style="color: var(--gray-500); font-size: 0.875rem;">Full Name</p>
                            <p style="font-weight: 600;">${request.full_name}</p>
                        </div>
                        <div>
                            <p style="color: var(--gray-500); font-size: 0.875rem;">Email</p>
                            <p style="font-weight: 600;">${request.email}</p>
                        </div>
                        <div>
                            <p style="color: var(--gray-500); font-size: 0.875rem;">Phone</p>
                            <p style="font-weight: 600;">${request.phone}</p>
                        </div>
                        <div>
                            <p style="color: var(--gray-500); font-size: 0.875rem;">Date of Birth</p>
                            <p style="font-weight: 600;">${request.date_of_birth}</p>
                        </div>
                        <div>
                            <p style="color: var(--gray-500); font-size: 0.875rem;">Gender</p>
                            <p style="font-weight: 600;">${request.gender}</p>
                        </div>
                        <div>
                            <p style="color: var(--gray-500); font-size: 0.875rem;">Department</p>
                            <p style="font-weight: 600;">${request.department}</p>
                        </div>
                        <div>
                            <p style="color: var(--gray-500); font-size: 0.875rem;">Designation</p>
                            <p style="font-weight: 600;">${request.designation}</p>
                        </div>
                        <div>
                            <p style="color: var(--gray-500); font-size: 0.875rem;">Expected Salary</p>
                            <p style="font-weight: 600;">₹${request.expected_salary || 'N/A'}</p>
                        </div>
                        <div style="grid-column: span 2;">
                            <p style="color: var(--gray-500); font-size: 0.875rem;">Address</p>
                            <p style="font-weight: 600;">${request.address || 'N/A'}</p>
                        </div>
                        <div>
                            <p style="color: var(--gray-500); font-size: 0.875rem;">City</p>
                            <p style="font-weight: 600;">${request.city || 'N/A'}</p>
                        </div>
                        <div>
                            <p style="color: var(--gray-500); font-size: 0.875rem;">State</p>
                            <p style="font-weight: 600;">${request.state || 'N/A'}</p>
                        </div>
                        <div style="grid-column: span 2;">
                            <p style="color: var(--gray-500); font-size: 0.875rem;">Status</p>
                            <span class="badge badge-${request.status}">${request.status}</span>
                        </div>
                        ${request.admin_notes ? `
                            <div style="grid-column: span 2;">
                                <p style="color: var(--gray-500); font-size: 0.875rem;">Admin Notes</p>
                                <p style="font-weight: 600;">${request.admin_notes}</p>
                            </div>
                        ` : ''}
                    </div>
                `;
                
                document.getElementById('requestModal').classList.add('active');
            }
        }
    } catch (error) {
        showAlert('Error loading request details', 'error');
    }
}

function closeModal() {
    document.getElementById('requestModal').classList.remove('active');
}

function openPhotoPreview(photoUrl) {
    const previewImage = document.getElementById('previewImage');
    previewImage.src = photoUrl;
    document.getElementById('photoModal').classList.add('active');
}

function closePhotoModal() {
    document.getElementById('photoModal').classList.remove('active');
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
