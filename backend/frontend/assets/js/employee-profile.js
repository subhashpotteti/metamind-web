// Employee Profile JavaScript
let isEditMode = false;

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
    
    // Load profile
    loadProfile();
    loadNotificationCount();
    
    // Real-time updates
    setInterval(() => {
        loadNotificationCount();
    }, 30000);
});

function loadProfile() {
    const employeeData = JSON.parse(localStorage.getItem('employeeData'));
    
    if (isEditMode) {
        loadEditProfile(employeeData);
    } else {
        loadViewProfile(employeeData);
    }
}

function loadViewProfile(employeeData) {
    const profileContent = document.getElementById('profileContent');
    profileContent.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 2rem;">
            <div style="text-align: center;">
                ${employeeData.photo ? `<img src="../../backend/${employeeData.photo}" style="width: 150px; height: 150px; border-radius: 50%; object-fit: cover; border: 4px solid var(--gray-200); margin-bottom: 1rem;">` : '<div class="user-avatar" style="width: 150px; height: 150px; font-size: 3rem; margin: 0 auto 1rem;">?</div>'}
                <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem;">${employeeData.full_name}</h3>
                <p style="color: var(--gray-500);">${employeeData.designation}</p>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                <div>
                    <p style="color: var(--gray-500); font-size: 0.875rem; margin-bottom: 0.25rem;">Employee ID</p>
                    <p style="font-weight: 600;">EMP-${employeeData.id}</p>
                </div>
                <div>
                    <p style="color: var(--gray-500); font-size: 0.875rem; margin-bottom: 0.25rem;">Email</p>
                    <p style="font-weight: 600;">${employeeData.email}</p>
                </div>
                <div>
                    <p style="color: var(--gray-500); font-size: 0.875rem; margin-bottom: 0.25rem;">Phone</p>
                    <p style="font-weight: 600;">${employeeData.phone}</p>
                </div>
                <div>
                    <p style="color: var(--gray-500); font-size: 0.875rem; margin-bottom: 0.25rem;">Date of Birth</p>
                    <p style="font-weight: 600;">${employeeData.date_of_birth || 'N/A'}</p>
                </div>
                <div>
                    <p style="color: var(--gray-500); font-size: 0.875rem; margin-bottom: 0.25rem;">Gender</p>
                    <p style="font-weight: 600;">${employeeData.gender || 'N/A'}</p>
                </div>
                <div>
                    <p style="color: var(--gray-500); font-size: 0.875rem; margin-bottom: 0.25rem;">Department</p>
                    <p style="font-weight: 600;">${employeeData.department}</p>
                </div>
                <div>
                    <p style="color: var(--gray-500); font-size: 0.875rem; margin-bottom: 0.25rem;">Designation</p>
                    <p style="font-weight: 600;">${employeeData.designation}</p>
                </div>
                <div>
                    <p style="color: var(--gray-500); font-size: 0.875rem; margin-bottom: 0.25rem;">Joining Date</p>
                    <p style="font-weight: 600; color: var(--gray-600);">${employeeData.joining_date || 'N/A'}</p>
                </div>
                <div>
                    <p style="color: var(--gray-500); font-size: 0.875rem; margin-bottom: 0.25rem;">Salary</p>
                    <p style="font-weight: 600; color: var(--gray-600);">₹${employeeData.salary ? employeeData.salary.toLocaleString() : 'N/A'}</p>
                </div>
                <div>
                    <p style="color: var(--gray-500); font-size: 0.875rem; margin-bottom: 0.25rem;">Status</p>
                    <span class="badge badge-${employeeData.status}">${employeeData.status}</span>
                </div>
                <div style="grid-column: span 2;">
                    <p style="color: var(--gray-500); font-size: 0.875rem; margin-bottom: 0.25rem;">Address</p>
                    <p style="font-weight: 600;">${employeeData.address || 'N/A'}</p>
                </div>
                <div>
                    <p style="color: var(--gray-500); font-size: 0.875rem; margin-bottom: 0.25rem;">City</p>
                    <p style="font-weight: 600;">${employeeData.city || 'N/A'}</p>
                </div>
                <div>
                    <p style="color: var(--gray-500); font-size: 0.875rem; margin-bottom: 0.25rem;">State</p>
                    <p style="font-weight: 600;">${employeeData.state || 'N/A'}</p>
                </div>
                <div>
                    <p style="color: var(--gray-500); font-size: 0.875rem; margin-bottom: 0.25rem;">Pincode</p>
                    <p style="font-weight: 600;">${employeeData.pincode || 'N/A'}</p>
                </div>
            </div>
        </div>
    `;
    lucide.createIcons();
}

function loadEditProfile(employeeData) {
    const profileContent = document.getElementById('profileContent');
    profileContent.innerHTML = `
        <form id="profileForm" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
            <div>
                <label class="form-label">Employee ID</label>
                <input type="text" class="form-control" value="EMP-${employeeData.id}" disabled style="background: var(--gray-100);">
            </div>
            <div>
                <label class="form-label">Email</label>
                <input type="email" class="form-control" value="${employeeData.email}" disabled style="background: var(--gray-100);">
            </div>
            <div>
                <label class="form-label">Phone *</label>
                <input type="tel" id="editPhone" class="form-control" value="${employeeData.phone}" required>
            </div>
            <div>
                <label class="form-label">Date of Birth</label>
                <input type="date" id="editDateOfBirth" class="form-control" value="${employeeData.date_of_birth || ''}">
            </div>
            <div>
                <label class="form-label">Gender</label>
                <select id="editGender" class="form-control">
                    <option value="">Select Gender</option>
                    <option value="male" ${employeeData.gender === 'male' ? 'selected' : ''}>Male</option>
                    <option value="female" ${employeeData.gender === 'female' ? 'selected' : ''}>Female</option>
                    <option value="other" ${employeeData.gender === 'other' ? 'selected' : ''}>Other</option>
                </select>
            </div>
            <div>
                <label class="form-label">Department</label>
                <input type="text" class="form-control" value="${employeeData.department}" disabled style="background: var(--gray-100);">
            </div>
            <div>
                <label class="form-label">Designation</label>
                <input type="text" class="form-control" value="${employeeData.designation}" disabled style="background: var(--gray-100);">
            </div>
            <div>
                <label class="form-label">Joining Date</label>
                <input type="date" class="form-control" value="${employeeData.joining_date || ''}" disabled style="background: var(--gray-100);">
            </div>
            <div>
                <label class="form-label">Salary</label>
                <input type="text" class="form-control" value="${employeeData.salary ? employeeData.salary.toLocaleString() : 'N/A'}" disabled style="background: var(--gray-100);">
            </div>
            <div>
                <label class="form-label">Status</label>
                <input type="text" class="form-control" value="${employeeData.status}" disabled style="background: var(--gray-100);">
            </div>
            <div style="grid-column: span 2;">
                <label class="form-label">Address</label>
                <textarea id="editAddress" class="form-control" rows="2">${employeeData.address || ''}</textarea>
            </div>
            <div>
                <label class="form-label">City</label>
                <input type="text" id="editCity" class="form-control" value="${employeeData.city || ''}">
            </div>
            <div>
                <label class="form-label">State</label>
                <input type="text" id="editState" class="form-control" value="${employeeData.state || ''}">
            </div>
            <div>
                <label class="form-label">Pincode</label>
                <input type="text" id="editPincode" class="form-control" value="${employeeData.pincode || ''}">
            </div>
            <div style="grid-column: span 2; display: flex; gap: 1rem; margin-top: 1rem;">
                <button type="submit" class="btn btn-primary">
                    <i data-lucide="save" style="width: 16px; height: 16px;"></i>
                    Save Changes
                </button>
                <button type="button" class="btn btn-secondary" onclick="toggleEditMode()">
                    <i data-lucide="x" style="width: 16px; height: 16px;"></i>
                    Cancel
                </button>
            </div>
        </form>
    `;
    
    // Add form submit handler
    document.getElementById('profileForm').addEventListener('submit', saveProfile);
    
    lucide.createIcons();
}

function toggleEditMode() {
    isEditMode = !isEditMode;
    const editBtn = document.getElementById('editProfileBtn');
    
    if (isEditMode) {
        editBtn.innerHTML = '<i data-lucide="x" style="width: 16px; height: 16px;"></i> Cancel Edit';
        editBtn.classList.remove('btn-primary');
        editBtn.classList.add('btn-secondary');
    } else {
        editBtn.innerHTML = '<i data-lucide="edit" style="width: 16px; height: 16px;"></i> Edit Profile';
        editBtn.classList.remove('btn-secondary');
        editBtn.classList.add('btn-primary');
    }
    
    loadProfile();
}

async function saveProfile(event) {
    event.preventDefault();
    
    const employeeData = JSON.parse(localStorage.getItem('employeeData'));
    
    const profileData = {
        action: 'update_profile',
        employee_id: employeeData.id,
        phone: document.getElementById('editPhone').value,
        date_of_birth: document.getElementById('editDateOfBirth').value,
        gender: document.getElementById('editGender').value,
        address: document.getElementById('editAddress').value,
        city: document.getElementById('editCity').value,
        state: document.getElementById('editState').value,
        pincode: document.getElementById('editPincode').value
    };
    
    // Validate phone
    if (!/^[0-9]{10}$/.test(profileData.phone)) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid Phone',
            text: 'Phone number must be 10 digits',
            confirmButtonColor: '#ef4444'
        });
        return;
    }
    
    // Validate pincode
    if (profileData.pincode && !/^[0-9]{6}$/.test(profileData.pincode)) {
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
        const response = await fetch('../../backend/api/employee.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profileData)
        });
        
        const data = await response.json();
        
        // Hide loader
        document.getElementById('pageLoader').classList.remove('active');
        
        if (data.success) {
            // Update local storage
            employeeData.phone = profileData.phone;
            employeeData.date_of_birth = profileData.date_of_birth;
            employeeData.gender = profileData.gender;
            employeeData.address = profileData.address;
            employeeData.city = profileData.city;
            employeeData.state = profileData.state;
            employeeData.pincode = profileData.pincode;
            localStorage.setItem('employeeData', JSON.stringify(employeeData));
            
            Swal.fire({
                icon: 'success',
                title: 'Profile Updated',
                text: 'Your profile has been updated successfully',
                confirmButtonColor: '#667eea'
            });
            
            toggleEditMode();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: data.message || 'Failed to update profile',
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
