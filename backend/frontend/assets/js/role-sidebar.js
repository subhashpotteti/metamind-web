// The server returns the effective permission set at login. Navigation is built
// from that set so users only see pages they may open.
document.addEventListener('DOMContentLoaded', () => {
    applyPermissions();
});

function applyPermissions() {
    const stored = localStorage.getItem('employeeUser') || localStorage.getItem('adminUser');
    if (!stored) return;
    
    const userData = JSON.parse(stored);
    const permissions = userData.permissions || [];
    const designation = userData.designation || '';
    
    console.log('Applying permissions for designation:', designation);
    console.log('User permissions:', permissions);
    
    const can = permission => permissions.includes('*') || permissions.includes(permission);
    
    document.querySelectorAll('[data-permission]').forEach(link => {
        const requiredPermission = link.dataset.permission;
        const hasAccess = can(requiredPermission);
        
        console.log(`Checking ${requiredPermission}: ${hasAccess ? 'GRANTED' : 'DENIED'}`);
        
        if (!hasAccess) {
            link.closest('li').style.display = 'none';
        } else {
            link.closest('li').style.display = 'block';
        }
    });
}

// Function to refresh permissions from server
function refreshPermissions() {
    return fetch('../../backend/api/admin.php?action=get_role_permissions')
        .then(response => response.json())
        .then(data => {
            if (data.success && data.roles) {
                // Update localStorage with new permissions
                const stored = localStorage.getItem('employeeUser') || localStorage.getItem('adminUser');
                if (stored) {
                    const userData = JSON.parse(stored);
                    const roleKey = userData.designation || '';
                    if (data.roles[roleKey]) {
                        userData.permissions = data.roles[roleKey];
                        const storageKey = localStorage.getItem('employeeUser') ? 'employeeUser' : 'adminUser';
                        localStorage.setItem(storageKey, JSON.stringify(userData));
                        applyPermissions();
                        return true;
                    }
                }
            }
            return false;
        })
        .catch(error => {
            console.error('Error refreshing permissions:', error);
            return false;
        });
}
