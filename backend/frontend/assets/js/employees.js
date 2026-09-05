// Employees Management JavaScript
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
    loadEmployees();
    loadNotificationCount();
    
    // Real-time updates
    setInterval(() => {
        loadEmployees();
        loadNotificationCount();
    }, 30000);
    
    // Add form submit handler
    document.getElementById('addEmployeeForm').addEventListener('submit', addEmployee);
    document.getElementById('editEmployeeForm').addEventListener('submit', updateEmployee);
});

async function loadEmployees() {
    try {
        const response = await fetch('../../backend/api/admin.php?action=get_employees');
        const data = await response.json();
        
        if (data.success) {
            const tbody = document.getElementById('employeesTableBody');
            
            if (data.employees.length === 0) {
                tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">No employees found</td></tr>';
                return;
            }
            
            tbody.innerHTML = data.employees.map(employee => {
                // Fix photo path - remove 'uploads/' prefix if it exists
                const photoPath = employee.photo ? employee.photo.replace(/^uploads\//, '') : null;
                const photoUrl = photoPath ? `../../backend/uploads/${photoPath}` : null;
                
                return `
                <tr>
                    <td>
                        ${photoUrl ? `<img src="${photoUrl}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; cursor: pointer;" onclick="openPhotoPreview('${photoUrl}')">` : '<div class="user-avatar" style="width: 40px; height: 40px; font-size: 0.9rem;">?</div>'}
                    </td>
                    <td>${employee.full_name}</td>
                    <td>${employee.email}</td>
                    <td>${employee.phone}</td>
                    <td>${employee.department}</td>
                    <td>${employee.designation}</td>
                    <td><span class="badge badge-${employee.status}">${employee.status}</span></td>
                    <td>
                        <button class="btn btn-secondary btn-sm" onclick="viewEmployee(${employee.id})">
                            <i data-lucide="eye" style="width: 16px; height: 16px;"></i>
                        </button>
                        <button class="btn btn-primary btn-sm" onclick="editEmployee(${employee.id})">
                            <i data-lucide="edit" style="width: 16px; height: 16px;"></i>
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="deleteEmployee(${employee.id})">
                            <i data-lucide="trash" style="width: 16px; height: 16px;"></i>
                        </button>
                    </td>
                </tr>
            `}).join('');
            
            lucide.createIcons();
        }
    } catch (error) {
        console.error('Error loading employees:', error);
    }
}

function openAddEmployeeModal() {
    document.getElementById('addEmployeeForm').reset();
    document.getElementById('addEmployeeModal').classList.add('active');
}

function closeAddEmployeeModal() {
    document.getElementById('addEmployeeModal').classList.remove('active');
}

async function addEmployee(event) {
    event.preventDefault();
    
    const employeeData = {
        action: 'add_employee',
        full_name: document.getElementById('addFullName').value,
        email: document.getElementById('addEmail').value,
        phone: document.getElementById('addPhone').value,
        password: document.getElementById('addPassword').value,
        department: document.getElementById('addDepartment').value,
        designation: document.getElementById('addDesignation').value,
        salary: document.getElementById('addSalary').value,
        joining_date: document.getElementById('addJoiningDate').value,
        date_of_birth: document.getElementById('addDateOfBirth').value,
        gender: document.getElementById('addGender').value,
        address: document.getElementById('addAddress').value,
        city: document.getElementById('addCity').value,
        state: document.getElementById('addState').value,
        pincode: document.getElementById('addPincode').value,
        status: document.getElementById('addStatus').value
    };
    
    // Validate phone
    if (!/^[0-9]{10}$/.test(employeeData.phone)) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid Phone',
            text: 'Phone number must be 10 digits',
            confirmButtonColor: '#ef4444'
        });
        return;
    }
    
    // Validate pincode if provided
    if (employeeData.pincode && !/^[0-9]{6}$/.test(employeeData.pincode)) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid Pincode',
            text: 'Pincode must be 6 digits',
            confirmButtonColor: '#ef4444'
        });
        return;
    }
    
    // Show loader
    document.getElementById('pageLoader').classList.add('active');
    
    try {
        const response = await fetch('../../backend/api/admin.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(employeeData)
        });
        
        const data = await response.json();
        
        // Hide loader
        document.getElementById('pageLoader').classList.remove('active');
        
        if (data.success) {
            Swal.fire({
                icon: 'success',
                title: 'Employee Added',
                text: 'Employee has been added successfully',
                confirmButtonColor: '#667eea'
            });
            closeAddEmployeeModal();
            loadEmployees();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Add Failed',
                text: data.message || 'Failed to add employee',
                confirmButtonColor: '#ef4444'
            });
        }
    } catch (error) {
        document.getElementById('pageLoader').classList.remove('active');
        Swal.fire({
            icon: 'error',
            title: 'Network Error',
            text: 'Please try again',
            confirmButtonColor: '#ef4444'
        });
    }
}

async function viewEmployee(employeeId) {
    try {
        const response = await fetch(`../../backend/api/admin.php?action=get_employee_details&employee_id=${employeeId}`);
        const data = await response.json();
        
        if (data.success) {
            const employee = data.employee;
            const viewBody = document.getElementById('viewEmployeeBody');
            
            // Helper function to check if file exists and create URL
            const getFileUrl = (filename) => {
                if (!filename) return null;
                // Remove 'uploads/' prefix if it already exists in the filename
                const cleanFilename = filename.replace(/^uploads\//, '');
                return `../../backend/uploads/${cleanFilename}`;
            };
            
            // Helper function to render document section
            const renderDocument = (label, filename, key) => {
                let files = filename;
                if (typeof files === 'string' && files.trim().startsWith('{')) {
                    try { files = Object.values(JSON.parse(files)); } catch (_) { files = [filename]; }
                }
                if (!Array.isArray(files)) files = [files];
                const previews = files.filter(Boolean).map(file => {
                    const url = getFileUrl(file);
                    if (!url) return '';
                    const isPdf = /\.pdf($|\?)/i.test(url);
                    return `<div style="margin-top:.5rem"><a href="${url}" target="_blank" class="doc-link">Open ${label}</a>${isPdf ? `<iframe title="${label}" src="${url}#toolbar=0" style="display:block;width:100%;height:220px;border:1px solid #e2e8f0;border-radius:6px;margin-top:.5rem"></iframe>` : `<img src="${url}" alt="${label}" style="display:block;width:100%;max-height:220px;object-fit:contain;border:1px solid #e2e8f0;border-radius:6px;margin-top:.5rem" loading="lazy">`}</div>`;
                }).join('');
                return previews ? `<div class="doc-item"><p style="color: var(--gray-500); font-size: 0.875rem;">${label}</p>${previews}</div>` : '';
            };

            const educationLabel = (key) => {
                const labels = { tenth: '10th', tenth_certificate: '10th', intermediate: 'Inter', intermediate_certificate: 'Inter', diploma: 'Diploma', diploma_certificate: 'Diploma', degree: 'Degree', degree_certificate: 'Degree', btech: 'B.Tech', btech_certificate: 'B.Tech' };
                const normalized = String(key).toLowerCase().replace(/[^a-z0-9_]/g, '');
                return labels[normalized] || String(key).replace(/_/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase());
            };
            const renderEducationDocuments = (value) => {
                if (!value) return '';
                let records = value;
                if (typeof records === 'string') { try { records = JSON.parse(records); } catch (_) { records = {}; } }
                if (!records || typeof records !== 'object') return '';
                return Object.entries(records).filter(([, file]) => file).map(([level, file]) => renderDocument(`Open ${educationLabel(level)} Education Documents`, file, level)).join('');
            };

            const displayLabel = (key) => String(key).replace(/_/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase());
            const displayValue = (key, value) => {
                if (value === null || value === undefined || value === '') return 'N/A';
                if (typeof value === 'object') return Object.entries(value).map(([childKey, childValue]) => `<div><strong>${displayLabel(childKey)}:</strong> ${displayValue(childKey, childValue)}</div>`).join('');
                if (typeof value === 'string' && value.trim().startsWith('{')) {
                    try { return displayValue(key, JSON.parse(value)); } catch (_) { /* display as regular text */ }
                }
                return String(value).replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
            };
            const displayedFields = new Set([
                'id', 'user_id', 'user_phone', 'phone', 'employee_code', 'full_name', 'email', 'date_of_birth', 'gender', 'blood_group',
                'address', 'city', 'state', 'district', 'pincode', 'department', 'designation', 'joining_date', 'salary', 'experience_level',
                'status', 'aadhaar_number', 'pan_number', 'emergency_contact_name', 'emergency_contact_relationship', 'emergency_contact_number',
                'company_name', 'company_contact', 'photo', 'signature', 'aadhaar_front', 'aadhaar_back', 'pan_front', 'education_docs',
                'experience_letter', 'pay_slip', 'offer_letter'
            ]);
            const documentFields = Object.entries(employee).filter(([key, value]) => value && /(?:photo|signature|document|_docs|_front|_back|_letter|pay_slip)/i.test(key));
            const additionalFields = Object.entries(employee).filter(([key]) => !displayedFields.has(key) && !documentFields.some(([documentKey]) => documentKey === key));
            
            viewBody.innerHTML = `
                <div class="employee-profile-view">
                    <!-- Profile Header -->
                    <div class="profile-header">
                        <div class="profile-photo-section">
                            ${employee.photo ? 
                                `<img src="${getFileUrl(employee.photo)}" class="profile-photo" alt="${employee.full_name}" onclick="openPhotoPreview('${getFileUrl(employee.photo)}')">` : 
                                '<div class="profile-photo-placeholder">' + (employee.full_name || 'E').charAt(0).toUpperCase() + '</div>'
                            }
                            <h3 class="profile-name">${employee.full_name}</h3>
                            <p class="profile-designation">${employee.designation || 'N/A'}</p>
                            <span class="badge badge-${employee.status}">${employee.status}</span>
                        </div>
                    </div>
                    
                    <!-- Personal Information -->
                    <div class="profile-section">
                        <h4 class="section-title">Personal Information</h4>
                        <div class="info-grid">
                            <div class="info-item">
                                <label>Employee ID</label>
                                <span>EMP-${employee.id}</span>
                            </div>
                            <div class="info-item">
                                <label>Employee Code</label>
                                <span>${employee.employee_code || 'N/A'}</span>
                            </div>
                            <div class="info-item">
                                <label>Full Name</label>
                                <span>${employee.full_name}</span>
                            </div>
                            <div class="info-item">
                                <label>Email Address</label>
                                <span>${employee.email || 'N/A'}</span>
                            </div>
                            <div class="info-item">
                                <label>Mobile Number</label>
                                <span>${employee.phone || 'N/A'}</span>
                            </div>
                            <div class="info-item">
                                <label>Date of Birth</label>
                                <span>${employee.date_of_birth || 'N/A'}</span>
                            </div>
                            <div class="info-item">
                                <label>Gender</label>
                                <span>${employee.gender || 'N/A'}</span>
                            </div>
                            <div class="info-item">
                                <label>Blood Group</label>
                                <span>${employee.blood_group || 'N/A'}</span>
                            </div>
                            <div class="info-item full-width">
                                <label>Address</label>
                                <span>${employee.address || 'N/A'}</span>
                            </div>
                            <div class="info-item">
                                <label>City</label>
                                <span>${employee.city || 'N/A'}</span>
                            </div>
                            <div class="info-item">
                                <label>State</label>
                                <span>${employee.state || 'N/A'}</span>
                            </div>
                            <div class="info-item">
                                <label>District</label>
                                <span>${employee.district || 'N/A'}</span>
                            </div>
                            <div class="info-item">
                                <label>Pincode</label>
                                <span>${employee.pincode || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Employment Information -->
                    <div class="profile-section">
                        <h4 class="section-title">Employment Information</h4>
                        <div class="info-grid">
                            <div class="info-item">
                                <label>Department</label>
                                <span>${employee.department || 'N/A'}</span>
                            </div>
                            <div class="info-item">
                                <label>Designation</label>
                                <span>${employee.designation || 'N/A'}</span>
                            </div>
                            <div class="info-item">
                                <label>Joining Date</label>
                                <span>${employee.joining_date || 'N/A'}</span>
                            </div>
                            <div class="info-item">
                                <label>Salary</label>
                                <span>₹${employee.salary ? Number(employee.salary).toLocaleString() : 'N/A'}</span>
                            </div>
                            <div class="info-item">
                                <label>Experience Level</label>
                                <span>${employee.experience_level || 'N/A'}</span>
                            </div>
                            <div class="info-item">
                                <label>Employment Status</label>
                                <span class="badge badge-${employee.status}">${employee.status}</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- ID Proofs -->
                    <div class="profile-section">
                        <h4 class="section-title">ID Proofs</h4>
                        <div class="id-proofs-grid">
                            ${renderDocument('Aadhaar Front', employee.aadhaar_front, 'aadhaar_front')}
                            ${renderDocument('Aadhaar Back', employee.aadhaar_back, 'aadhaar_back')}
                            ${renderDocument('PAN Card Front', employee.pan_front, 'pan_front')}
                            ${employee.aadhaar_number ? `
                                <div class="info-item">
                                    <label>Aadhaar Number</label>
                                    <span>${employee.aadhaar_number}</span>
                                </div>
                            ` : ''}
                            ${employee.pan_number ? `
                                <div class="info-item">
                                    <label>PAN Number</label>
                                    <span>${employee.pan_number}</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    <!-- Documents -->
                    <div class="profile-section">
                        <h4 class="section-title">Documents</h4>
                        <div class="documents-grid">
                            ${renderEducationDocuments(employee.education_docs)}
                            ${renderDocument('Experience Letter', employee.experience_letter, 'experience_letter')}
                            ${renderDocument('Pay Slip', employee.pay_slip, 'pay_slip')}
                            ${renderDocument('Offer Letter', employee.offer_letter, 'offer_letter')}
                            ${renderDocument('Signature', employee.signature, 'signature')}
                        </div>
                    </div>
                    
                    <!-- Emergency Contact -->
                    <div class="profile-section">
                        <h4 class="section-title">Emergency Contact</h4>
                        <div class="info-grid">
                            <div class="info-item">
                                <label>Contact Name</label>
                                <span>${employee.emergency_contact_name || 'N/A'}</span>
                            </div>
                            <div class="info-item">
                                <label>Relationship</label>
                                <span>${employee.emergency_contact_relationship || 'N/A'}</span>
                            </div>
                            <div class="info-item">
                                <label>Contact Number</label>
                                <span>${employee.emergency_contact_number || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Previous Employment (if any) -->
                    ${employee.company_name ? `
                    <div class="profile-section">
                        <h4 class="section-title">Previous Employment</h4>
                        <div class="info-grid">
                            <div class="info-item">
                                <label>Company Name</label>
                                <span>${employee.company_name}</span>
                            </div>
                            <div class="info-item">
                                <label>Company Contact</label>
                                <span>${employee.company_contact || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                    ` : ''}
                    
                    <!-- NDA Information (if any) -->
                    
                </div>
            `;

            // if (documentFields.length) {
            //     viewBody.querySelector('.employee-profile-view').insertAdjacentHTML('beforeend', `<div class="profile-section"><h4 class="section-title">All Available Documents</h4><div class="documents-grid">${documentFields.map(([key, value]) => renderDocument(displayLabel(key), value, key)).join('')}</div></div>`);
            // }
            if (additionalFields.length) {
                viewBody.querySelector('.employee-profile-view').insertAdjacentHTML('beforeend', `<div class="profile-section"><h4 class="section-title">Additional Employee Information</h4><div class="info-grid">${additionalFields.map(([key, value]) => `<div class="info-item"><label>${displayLabel(key)}</label><span>${displayValue(key, value)}</span></div>`).join('')}</div></div>`);
            }
            
            document.getElementById('viewEmployeeModal').classList.add('active');
            lucide.createIcons();
        }
    } catch (error) {
        console.error('Error loading employee details:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load employee details',
            confirmButtonColor: '#ef4444'
        });
    }
}

function closeViewEmployeeModal() {
    document.getElementById('viewEmployeeModal').classList.remove('active');
}

async function editEmployee(employeeId) {
    try {
        const response = await fetch(`../../backend/api/admin.php?action=get_employee_details&employee_id=${employeeId}`);
        const data = await response.json();
        
        if (data.success) {
            const employee = data.employee;
            document.getElementById('editEmployeeId').value = employee.id;
            document.getElementById('editFullName').value = employee.full_name;
            document.getElementById('editEmail').value = employee.email;
            document.getElementById('editPhone').value = employee.phone;
            document.getElementById('editDepartment').value = employee.department;
            document.getElementById('editDesignation').value = employee.designation;
            document.getElementById('editSalary').value = employee.salary || '';
            document.getElementById('editJoiningDate').value = employee.joining_date || '';
            document.getElementById('editDateOfBirth').value = employee.date_of_birth || '';
            document.getElementById('editGender').value = employee.gender || '';
            document.getElementById('editAddress').value = employee.address || '';
            document.getElementById('editCity').value = employee.city || '';
            document.getElementById('editState').value = employee.state || '';
            document.getElementById('editPincode').value = employee.pincode || '';
            document.getElementById('editStatus').value = employee.status;
            
            document.getElementById('editEmployeeModal').classList.add('active');
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load employee details',
            confirmButtonColor: '#ef4444'
        });
    }
}

function closeEditEmployeeModal() {
    document.getElementById('editEmployeeModal').classList.remove('active');
}

async function updateEmployee(event) {
    event.preventDefault();
    
    const employeeData = {
        action: 'update_employee',
        employee_id: document.getElementById('editEmployeeId').value,
        full_name: document.getElementById('editFullName').value,
        email: document.getElementById('editEmail').value,
        phone: document.getElementById('editPhone').value,
        department: document.getElementById('editDepartment').value,
        designation: document.getElementById('editDesignation').value,
        salary: document.getElementById('editSalary').value,
        joining_date: document.getElementById('editJoiningDate').value,
        date_of_birth: document.getElementById('editDateOfBirth').value,
        gender: document.getElementById('editGender').value,
        address: document.getElementById('editAddress').value,
        city: document.getElementById('editCity').value,
        state: document.getElementById('editState').value,
        pincode: document.getElementById('editPincode').value,
        status: document.getElementById('editStatus').value
    };
    
    // Validate phone
    if (!/^[0-9]{10}$/.test(employeeData.phone)) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid Phone',
            text: 'Phone number must be 10 digits',
            confirmButtonColor: '#ef4444'
        });
        return;
    }
    
    // Validate pincode if provided
    if (employeeData.pincode && !/^[0-9]{6}$/.test(employeeData.pincode)) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid Pincode',
            text: 'Pincode must be 6 digits',
            confirmButtonColor: '#ef4444'
        });
        return;
    }
    
    // Show loader
    document.getElementById('pageLoader').classList.add('active');
    
    try {
        const response = await fetch('../../backend/api/admin.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(employeeData)
        });
        
        const data = await response.json();
        
        // Hide loader
        document.getElementById('pageLoader').classList.remove('active');
        
        if (data.success) {
            Swal.fire({
                icon: 'success',
                title: 'Employee Updated',
                text: 'Employee has been updated successfully',
                confirmButtonColor: '#667eea'
            });
            closeEditEmployeeModal();
            loadEmployees();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: data.message || 'Failed to update employee',
                confirmButtonColor: '#ef4444'
            });
        }
    } catch (error) {
        document.getElementById('pageLoader').classList.remove('active');
        Swal.fire({
            icon: 'error',
            title: 'Network Error',
            text: 'Please try again',
            confirmButtonColor: '#ef4444'
        });
    }
}

async function deleteEmployee(employeeId) {
    const { value: isConfirmed } = await Swal.fire({
        title: 'Delete Employee',
        text: 'Are you sure you want to delete this employee? This action cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#667eea',
        confirmButtonText: 'Yes, delete it!'
    });
    
    if (!isConfirmed) return;
    
    // Show loader
    document.getElementById('pageLoader').classList.add('active');
    
    try {
        const response = await fetch('../../backend/api/admin.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'delete_employee',
                employee_id: employeeId
            })
        });
        
        const data = await response.json();
        
        // Hide loader
        document.getElementById('pageLoader').classList.remove('active');
        
        if (data.success) {
            Swal.fire({
                icon: 'success',
                title: 'Employee Deleted',
                text: 'Employee has been deleted successfully',
                confirmButtonColor: '#667eea'
            });
            loadEmployees();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Delete Failed',
                text: data.message || 'Failed to delete employee',
                confirmButtonColor: '#ef4444'
            });
        }
    } catch (error) {
        document.getElementById('pageLoader').classList.remove('active');
        Swal.fire({
            icon: 'error',
            title: 'Network Error',
            text: 'Please try again',
            confirmButtonColor: '#ef4444'
        });
    }
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

function logout() {
    localStorage.removeItem('adminUser');
    window.location.href = 'login.php';
}
