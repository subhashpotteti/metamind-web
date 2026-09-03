// Admin Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const adminUser = localStorage.getItem('adminUser');
    if (!adminUser) {
        window.location.href = 'login.php';
        return;
    }
    
    // Load dashboard stats
    loadDashboardStats();
    
    // Set today's date for attendance
    document.getElementById('attendanceDate').value = new Date().toISOString().split('T')[0];
    
    // Load initial data
    loadRequests('pending');
});

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
        'requests': 'Registration Requests',
        'employees': 'Employees',
        'attendance': 'Attendance'
    };
    document.getElementById('pageTitle').textContent = titles[section];
    
    // Load section data
    if (section === 'dashboard') {
        loadDashboardStats();
    } else if (section === 'requests') {
        loadRequests('pending');
    } else if (section === 'employees') {
        loadEmployees();
    } else if (section === 'attendance') {
        loadAttendance();
    }
}

async function loadDashboardStats() {
    try {
        const response = await fetch('../../backend/api/admin.php?action=get_dashboard_stats');
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
                            <button class="btn btn-success btn-sm" onclick="approveRequest(${request.id})">Approve</button>
                            <button class="btn btn-danger btn-sm" onclick="rejectRequest(${request.id})">Reject</button>
                            <button class="btn btn-secondary btn-sm" onclick="viewRequest(${request.id})">View</button>
                        ` : `
                            <button class="btn btn-secondary btn-sm" onclick="viewRequest(${request.id})">View</button>
                        `}
                    </td>
                </tr>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading requests:', error);
    }
}

async function loadEmployees() {
    try {
        const response = await fetch('../../backend/api/admin.php?action=get_employees');
        const data = await response.json();
        
        if (data.success) {
            const tbody = document.getElementById('employeesTableBody');
            
            if (data.employees.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No employees found</td></tr>';
                return;
            }
            
            tbody.innerHTML = data.employees.map(employee => `
                <tr>
                    <td>
                        ${employee.photo ? `<img src="../../backend/${employee.photo}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; cursor: pointer;" onclick="openPhotoPreview('../../backend/${employee.photo}')">` : '<div class="user-avatar" style="width: 40px; height: 40px; font-size: 0.9rem;">?</div>'}
                    </td>
                    <td>${employee.full_name}</td>
                    <td>${employee.email}</td>
                    <td>${employee.phone}</td>
                    <td>${employee.department}</td>
                    <td>${employee.designation}</td>
                    <td><span class="badge badge-${employee.status}">${employee.status}</span></td>
                </tr>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading employees:', error);
    }
}

async function loadAttendance() {
    const date = document.getElementById('attendanceDate').value;
    
    try {
        const response = await fetch(`../../backend/api/admin.php?action=get_attendance&date=${date}`);
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
                    <td>${record.check_in_time ? record.check_in_time.split(' ')[1] : '--:--'}</td>
                    <td>${record.check_out_time ? record.check_out_time.split(' ')[1] : '--:--'}</td>
                    <td>${record.total_hours ? record.total_hours + 'h' : '0h'}</td>
                    <td><span class="badge badge-${record.status}">${record.status}</span></td>
                </tr>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading attendance:', error);
    }
}

async function approveRequest(requestId) {
    const employeeCode = prompt('Enter Employee ID for this employee:');
    
    if (!employeeCode) {
        showAlert('Employee ID is required', 'error');
        return;
    }
    
    const notes = prompt('Enter any notes (optional):');
    
    try {
        const response = await fetch('../../backend/api/admin.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'approve_request',
                request_id: requestId,
                employee_code: employeeCode,
                admin_notes: notes || ''
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert(data.message || 'Registration Successful', 'success');
            loadRequests('pending');
            loadDashboardStats();
        } else {
            showAlert(data.message || 'Failed to approve request', 'error');
        }
    } catch (error) {
        console.error('Approval error:', error);
        showAlert('Network error. Please try again. ' + error.message, 'error');
    }
}

async function rejectRequest(requestId) {
    const notes = prompt('Enter rejection reason:');
    
    if (!notes) {
        showAlert('Please provide a rejection reason', 'error');
        return;
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
        
        if (data.success) {
            showAlert('Request rejected successfully', 'success');
            loadRequests('pending');
            loadDashboardStats();
        } else {
            showAlert(data.message || 'Failed to reject request', 'error');
        }
    } catch (error) {
        showAlert('Network error. Please try again.', 'error');
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

function logout() {
    localStorage.removeItem('adminUser');
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
