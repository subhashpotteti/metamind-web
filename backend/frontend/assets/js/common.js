// Common JavaScript functions for all pages

function logout() {
    // Clear localStorage
    localStorage.removeItem('adminUser');
    localStorage.removeItem('employeeUser');
    localStorage.removeItem('employeeData');
    
    // Redirect to appropriate login page
    const currentPath = window.location.pathname;
    if (currentPath.includes('/admin/')) {
        window.location.href = 'login.php';
    } else {
        window.location.href = 'login.php';
    }
}

// Initialize Lucide icons if available
if (typeof lucide !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        lucide.createIcons();
    });
}
