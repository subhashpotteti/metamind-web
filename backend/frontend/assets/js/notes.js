// Admin Notes JavaScript
let currentUserId = null;
let allNotes = [];

// Load user data from localStorage
document.addEventListener('DOMContentLoaded', function() {
    // Admin uses 'adminUser' key
    const userData = localStorage.getItem('adminUser');
    console.log('User data from localStorage (adminUser):', userData);
    
    if (userData) {
        try {
            const user = JSON.parse(userData);
            console.log('Parsed user:', user);
            currentUserId = user.id;
            console.log('Current user ID:', currentUserId);
        } catch (e) {
            console.error('Error parsing user data:', e);
        }
    }
    
    if (!currentUserId) {
        console.error('No user ID found, redirecting to login');
        window.location.href = 'login.php';
        return;
    }
    
    loadNotes();
    loadEmployees();
    loadNotificationCount();
    lucide.createIcons();
});

// Load all notes for admin
async function loadNotes() {
    try {
        console.log('Loading notes for user ID:', currentUserId);
        const response = await fetch(`../../backend/api/notes.php?action=get_notes&user_id=${currentUserId}`);
        console.log('Response status:', response.status);
        
        const responseText = await response.text();
        console.log('Raw response text:', responseText);
        
        if (!responseText.trim()) {
            console.error('Empty response from server');
            showError('Server returned empty response');
            return;
        }
        
        let result;
        try {
            result = JSON.parse(responseText);
        } catch (parseError) {
            console.error('JSON parse error:', parseError);
            console.error('Response text:', responseText);
            showError('Invalid server response');
            return;
        }
        
        console.log('API response:', result);
        
        if (result.success) {
            allNotes = result.notes;
            displayNotes(allNotes);
        } else {
            console.error('API error:', result.message);
            showError(result.message || 'Failed to load notes');
        }
    } catch (error) {
        console.error('Error loading notes:', error);
        showError('Error loading notes: ' + error.message);
    }
}

// Load employees dropdown
async function loadEmployees() {
    try {
        console.log('Loading employees...');
        const response = await fetch('../../backend/api/notes.php?action=get_employees');
        console.log('Employees response status:', response.status);
        
        const responseText = await response.text();
        console.log('Employees raw response:', responseText);
        
        if (!responseText.trim()) {
            console.error('Empty response from employees API');
            return;
        }
        
        let result;
        try {
            result = JSON.parse(responseText);
        } catch (parseError) {
            console.error('JSON parse error in employees:', parseError);
            console.error('Response text:', responseText);
            return;
        }
        
        console.log('Employees API response:', result);
        
        if (result.success) {
            const select = document.getElementById('employeeSelect');
            if (!select) {
                console.error('Employee select element not found');
                return;
            }
            
            select.innerHTML = '<option value="">Select an employee...</option>';
            
            if (result.employees && result.employees.length > 0) {
                result.employees.forEach(emp => {
                    const option = document.createElement('option');
                    option.value = emp.id;
                    option.textContent = `${emp.full_name} (${emp.employee_code})`;
                    select.appendChild(option);
                });
                console.log('Loaded', result.employees.length, 'employees');
            } else {
                console.log('No employees found');
                select.innerHTML = '<option value="">No employees available</option>';
            }
        } else {
            console.error('Employees API error:', result.message);
        }
    } catch (error) {
        console.error('Error loading employees:', error);
    }
}

// Display notes
function displayNotes(notes) {
    const container = document.getElementById('notesList');
    
    if (notes.length === 0) {
        container.innerHTML = '<div class="empty-state">No notes found</div>';
        return;
    }
    
    container.innerHTML = `
        <div class="notes-container">
            ${notes.map(note => createNoteCard(note)).join('')}
        </div>
    `;
    
    lucide.createIcons();
}

// Create note card HTML
function createNoteCard(note) {
    const isFromAdmin = note.sender_type === 'admin';
    const isRead = note.is_read;
    const senderName = note.sender_name || 'Unknown';
    const receiverName = note.receiver_name || 'Unknown';
    const subject = note.subject || '(No subject)';
    const message = note.message;
    const createdAt = new Date(note.created_at).toLocaleString();
    
    // Get sender photo path - fix double uploads issue
    const senderPhoto = note.sender_photo ? note.sender_photo.replace(/^uploads\//, '') : null;
    const senderPhotoUrl = senderPhoto ? `../../backend/uploads/${senderPhoto}` : null;
    const senderInitial = senderName.charAt(0).toUpperCase();
    
    return `
        <div class="note-card ${isRead ? 'read' : 'unread'}" onclick="viewNote(${note.id})">
            <div class="note-header">
                <div class="note-sender">
                    <strong>${isFromAdmin ? 'From: Admin' : 'From: ' + senderName}</strong>
                    <span class="note-badge ${isFromAdmin ? 'badge-admin' : 'badge-employee'}">${isFromAdmin ? 'Admin' : 'Employee'}</span>
                </div>
                <div class="note-time">${createdAt}</div>
            </div>
            <div class="note-subject">${subject}</div>
            <div class="note-preview">${message.substring(0, 100)}${message.length > 100 ? '...' : ''}</div>
            ${!isRead ? '<div class="unread-indicator"></div>' : ''}
        </div>
    `;
}

// View note details
async function viewNote(noteId) {
    const note = allNotes.find(n => n.id === noteId);
    if (!note) return;
    
    // Mark as read if not already
    if (!note.is_read) {
        await markAsRead(noteId);
        note.is_read = true;
        displayNotes(allNotes);
    }
    
    const senderName = note.sender_name || 'Unknown';
    const receiverName = note.receiver_name || 'Unknown';
    const subject = note.subject || '(No subject)';
    const message = note.message;
    const createdAt = new Date(note.created_at).toLocaleString();
    
    // Get photos - fix double uploads issue
    const senderPhoto = note.sender_photo ? note.sender_photo.replace(/^uploads\//, '') : null;
    const receiverPhoto = note.receiver_photo ? note.receiver_photo.replace(/^uploads\//, '') : null;
    const senderPhotoUrl = senderPhoto ? `../../backend/uploads/${senderPhoto}` : null;
    const receiverPhotoUrl = receiverPhoto ? `../../backend/uploads/${receiverPhoto}` : null;
    const senderInitial = senderName.charAt(0).toUpperCase();
    const receiverInitial = receiverName.charAt(0).toUpperCase();
    
    const details = `
        <div class="note-details">
            <div class="detail-row">
                <strong>From:</strong> ${note.sender_type === 'admin' ? 'Admin' : senderName}
            </div>
            <div class="detail-row">
                <strong>To:</strong> ${note.receiver_type === 'admin' ? 'Admin' : receiverName}
            </div>
            <div class="detail-row">
                <strong>Subject:</strong> ${subject}
            </div>
            <div class="detail-row">
                <strong>Date:</strong> ${createdAt}
            </div>
            <div class="detail-message">
                <strong>Message:</strong>
                <p>${message}</p>
            </div>
            <div class="note-actions">
                <button class="btn btn-danger" onclick="deleteNote(${note.id})">Delete</button>
                <button class="btn btn-secondary" onclick="closeViewModal()">Close</button>
            </div>
        </div>
    `;
    
    document.getElementById('noteDetails').innerHTML = details;
    document.getElementById('viewModal').style.display = 'block';
}

// Mark note as read
async function markAsRead(noteId) {
    try {
        const response = await fetch('../../backend/api/notes.php', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'mark_read', note_id: noteId })
        });
        const result = await response.json();
        return result.success;
    } catch (error) {
        console.error('Error marking note as read:', error);
        return false;
    }
}

// Delete note
async function deleteNote(noteId) {
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'This note will be permanently deleted',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, delete it'
    });
    
    if (!result.isConfirmed) return;
    
    try {
        const response = await fetch(`../../backend/api/notes.php?note_id=${noteId}`, {
            method: 'DELETE'
        });
        const result = await response.json();
        
        if (result.success) {
            Swal.fire({
                icon: 'success',
                title: 'Deleted',
                text: 'Note has been deleted',
                confirmButtonColor: '#10b981'
            });
            closeViewModal();
            loadNotes();
        } else {
            showError('Failed to delete note');
        }
    } catch (error) {
        console.error('Error deleting note:', error);
        showError('Error deleting note');
    }
}

// Compose note modal
function openComposeModal() {
    document.getElementById('composeModal').style.display = 'block';
    document.getElementById('composeForm').reset();
}

function closeComposeModal() {
    document.getElementById('composeModal').style.display = 'none';
}

function closeViewModal() {
    document.getElementById('viewModal').style.display = 'none';
}

// Handle compose form submission
document.getElementById('composeForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const employeeId = document.getElementById('employeeSelect').value;
    const subject = document.getElementById('noteSubject').value;
    const message = document.getElementById('noteMessage').value;
    
    if (!employeeId || !message) {
        Swal.fire({
            icon: 'error',
            title: 'Validation Error',
            text: 'Please select an employee and enter a message',
            confirmButtonColor: '#ef4444'
        });
        return;
    }
    
    const btnText = document.getElementById('composeBtnText');
    const btnSpinner = document.getElementById('composeBtnSpinner');
    
    btnText.style.display = 'none';
    btnSpinner.style.display = 'inline-block';
    
    try {
        const response = await fetch('../../backend/api/notes.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'create_note',
                sender_id: currentUserId,
                receiver_id: parseInt(employeeId),
                sender_type: 'admin',
                receiver_type: 'employee',
                subject: subject,
                message: message
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Note sent successfully',
                confirmButtonColor: '#10b981'
            });
            closeComposeModal();
            loadNotes();
        } else {
            showError(result.message || 'Failed to send note');
        }
    } catch (error) {
        console.error('Error sending note:', error);
        showError('Error sending note');
    } finally {
        btnText.style.display = 'inline';
        btnSpinner.style.display = 'none';
    }
});

// Load notification count
async function loadNotificationCount() {
    try {
        const response = await fetch(`../../backend/api/notifications.php?action=get_count&user_id=${currentUserId}`);
        const result = await response.json();
        
        if (result.success) {
            const count = result.count || 0;
            const badge = document.getElementById('notifBadge');
            const dot = document.getElementById('notifDot');
            
            if (badge) badge.textContent = count;
            if (dot) dot.style.display = count > 0 ? 'block' : 'none';
        }
    } catch (error) {
        console.error('Error loading notification count:', error);
    }
}

// Show error message
function showError(message) {
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message,
        confirmButtonColor: '#ef4444'
    });
}

// Close modals when clicking outside
window.onclick = function(event) {
    const composeModal = document.getElementById('composeModal');
    const viewModal = document.getElementById('viewModal');
    
    if (event.target === composeModal) {
        closeComposeModal();
    }
    if (event.target === viewModal) {
        closeViewModal();
    }
};
