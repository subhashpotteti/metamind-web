// UI convenience layer: API endpoints remain the security authority.
// This hides navigation and CRUD controls the current role cannot use, including
// controls added later by page-specific render functions.
document.addEventListener('DOMContentLoaded', () => {
    applyUiPermissions(document);
    installTableFilters();
    new MutationObserver(records => {
        records.forEach(record => record.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) applyUiPermissions(node);
        }));
    }).observe(document.body, { childList: true, subtree: true });
});

function currentPermissions() {
    try {
        const stored = localStorage.getItem('employeeUser') || localStorage.getItem('adminUser');
        return stored ? JSON.parse(stored).permissions || [] : [];
    } catch (_) { return []; }
}

function canUse(permission) {
    const permissions = currentPermissions();
    return permissions.includes('*') || permissions.includes(permission);
}

const actionPermissions = [
    [/\b(openAddEmployeeModal|addEmployee)\b/, 'employees.create'],
    [/\b(editEmployee|saveEmployee|updateEmployee)\b/, 'employees.update'],
    [/\bdeleteEmployee\b/, 'employees.delete'],
    [/\b(openProjectModal|createProject)\b/, 'projects.create'],
    [/\b(editProject|updateProject)\b/, 'projects.update'],
    [/\bdeleteProject\b/, 'projects.delete'],
    [/\b(openRevenueModal|createRevenue)\b/, 'revenue.create'],
    [/\b(editRevenue|updateRevenue)\b/, 'revenue.update'],
    [/\bdeleteRevenue\b/, 'revenue.delete'],
    [/\b(openComposeModal|createNote)\b/, 'notes.create'],
    [/\b(editNote|updateNote)\b/, 'notes.update'],
    [/\bdeleteNote\b/, 'notes.delete'],
    [/\b(openLeaveModal|requestLeave)\b/, 'leaves.create'],
    [/\b(approveLeave|rejectLeave|updateLeave)\b/, 'leaves.update'],
    [/\bdeleteLeave\b/, 'leaves.delete'],
    [/\b(openApprovalModal|approveRequest|rejectRequest)\b/, 'requests.update'],
    [/\b(checkIn|createAttendance)\b/, 'attendance.create'],
    [/\b(checkOut|updateAttendance)\b/, 'attendance.update'],
    [/\bdeleteAttendance\b/, 'attendance.delete'],
    [/\b(markAllAsRead)\b/, 'notifications.update'],
    [/\b(markAsRead)\b/, 'notifications.self'],
    [/\bsavePermissions\b/, 'roles.manage']
];

function requiredPermission(element) {
    if (element.dataset.permission) return element.dataset.permission;
    const handler = element.getAttribute('onclick') || '';
    const match = actionPermissions.find(([pattern]) => pattern.test(handler));
    return match ? match[1] : null;
}

function applyUiPermissions(root) {
    const elements = [];
    if (root.matches?.('[data-permission], [onclick]')) elements.push(root);
    root.querySelectorAll?.('[data-permission], [onclick]').forEach(element => elements.push(element));
    elements.forEach(element => {
        const permission = requiredPermission(element);
        if (!permission || canUse(permission)) return;
        const item = element.closest('li') || element;
        item.style.display = 'none';
        item.setAttribute('aria-hidden', 'true');
    });
}

function installTableFilters() {
    document.querySelectorAll('.table-container table').forEach((table, index) => {
        if (table.dataset.quickFilterReady) return;
        table.dataset.quickFilterReady = 'true';
        const filter = document.createElement('input');
        filter.type = 'search';
        filter.className = 'form-control table-quick-filter';
        filter.placeholder = 'Search records...';
        filter.setAttribute('aria-label', 'Search table records');
        filter.style.cssText = 'width:min(320px,100%);margin:0 0 1rem auto;display:block;';
        filter.addEventListener('input', () => {
            const search = filter.value.trim().toLowerCase();
            table.querySelectorAll('tbody tr').forEach(row => {
                row.style.display = !search || row.textContent.toLowerCase().includes(search) ? '' : 'none';
            });
        });
        table.closest('.table-container').before(filter);
    });
}
