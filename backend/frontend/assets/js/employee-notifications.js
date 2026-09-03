// Employee Notifications JavaScript
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
    
    // Load notifications
    loadNotifications();
    
    // Real-time updates
    setInterval(() => {
        loadNotifications();
    }, 30000);
});

async function loadNotifications() {
    const employeeUser = JSON.parse(localStorage.getItem('employeeUser'));
    if (!employeeUser) return;
    
    try {
        const response = await fetch(`../../backend/api/notifications.php?action=get_notifications&user_id=${employeeUser.id}`);
        const data = await response.json();
        
        if (data.success) {
            const container = document.getElementById('notificationsList');
            
            if (data.notifications.length === 0) {
                container.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--gray-500);">No notifications</div>';
                return;
            }
            
            container.innerHTML = data.notifications.map(notif => `
                <div class="notification-item ${notif.is_read ? 'read' : 'unread'}" onclick="markAsRead(${notif.id}, '${notif.link || ''}')">
                    <div class="notification-icon ${getNotificationIconClass(notif.type)}">
                        <i data-lucide="${getNotificationIcon(notif.type)}"></i>
                    </div>
                    <div class="notification-content">
                        <div class="notification-title">${notif.title}</div>
                        <div class="notification-message">${notif.message}</div>
                        <div class="notification-time">${formatTime(notif.created_at)}</div>
                    </div>
                    ${!notif.is_read ? '<div class="notification-dot"></div>' : ''}
                </div>
            `).join('');
            
            lucide.createIcons();
            
            // Update badge
            const unreadCount = data.notifications.filter(n => !n.is_read).length;
            if (unreadCount > 0) {
                document.getElementById('notifBadge').textContent = unreadCount;
                document.getElementById('notifBadge').style.display = 'block';
                document.getElementById('notifDot').style.display = 'block';
            } else {
                document.getElementById('notifBadge').style.display = 'none';
                document.getElementById('notifDot').style.display = 'none';
            }
        }
    } catch (error) {
        console.error('Error loading notifications:', error);
    }
}

function getNotificationIcon(type) {
    const icons = {
        'info': 'info',
        'success': 'check-circle',
        'warning': 'alert-triangle',
        'error': 'alert-circle',
        'leave': 'calendar',
        'attendance': 'clock',
        'project': 'briefcase'
    };
    return icons[type] || 'bell';
}

function getNotificationIconClass(type) {
    const classes = {
        'info': 'primary',
        'success': 'success',
        'warning': 'warning',
        'error': 'danger',
        'leave': 'warning',
        'attendance': 'primary',
        'project': 'success'
    };
    return classes[type] || 'primary';
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return Math.floor(diff / 60000) + ' min ago';
    if (diff < 86400000) return Math.floor(diff / 3600000) + ' hours ago';
    if (diff < 604800000) return Math.floor(diff / 86400000) + ' days ago';
    
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

async function markAsRead(notificationId, link) {
    try {
        const response = await fetch(`../../backend/api/notifications.php?action=mark_as_read&notification_id=${notificationId}`);
        const data = await response.json();
        
        if (data.success) {
            loadNotifications();
            if (link) {
                window.location.href = link;
            }
        }
    } catch (error) {
        console.error('Error marking as read:', error);
    }
}

async function markAllAsRead() {
    const employeeUser = JSON.parse(localStorage.getItem('employeeUser'));
    if (!employeeUser) return;
    
    try {
        const response = await fetch(`../../backend/api/notifications.php?action=mark_all_as_read&user_id=${employeeUser.id}`);
        const data = await response.json();
        
        if (data.success) {
            showAlert('All notifications marked as read', 'success');
            loadNotifications();
        }
    } catch (error) {
        showAlert('Failed to mark all as read', 'error');
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
