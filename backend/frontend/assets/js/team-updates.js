document.addEventListener('DOMContentLoaded', () => {
    const employee = JSON.parse(localStorage.getItem('employeeData') || 'null');
    const user = JSON.parse(localStorage.getItem('employeeUser') || 'null');
    if (!employee || !user) { window.location.href = 'login.php'; return; }
    document.getElementById('userName').textContent = employee.full_name;
    document.getElementById('userAvatar').textContent = employee.full_name.charAt(0).toUpperCase();
    lucide.createIcons();
    loadWorkUpdates();
    loadAttendanceLogs();
});

async function loadWorkUpdates() {
    const container = document.getElementById('workUpdatesList');
    try {
        const response = await fetch('../../backend/api/work_updates.php?limit=100');
        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        container.innerHTML = data.updates.length ? data.updates.map(update => `<article class="card" style="box-shadow:none;border:1px solid var(--gray-200);margin:.75rem 0;padding:1rem"><strong>${escapeHtml(update.full_name)}</strong><small style="float:right;color:var(--gray-500)">${formatDate(update.created_at)}</small><div style="color:var(--gray-500);font-size:.875rem;margin-top:.25rem">${escapeHtml(update.designation || '')}${update.department ? ' · ' + escapeHtml(update.department) : ''}</div><p style="white-space:pre-wrap;margin:.75rem 0 0">${escapeHtml(update.work_update)}</p></article>`).join('') : empty('No work updates have been submitted yet.');
    } catch (error) { container.innerHTML = empty(error.message || 'Unable to load work updates.'); }
}

async function loadAttendanceLogs() {
    const container = document.getElementById('attendanceLogsList');
    try {
        const response = await fetch('../../backend/api/attendance_logs.php?limit=100');
        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        container.innerHTML = data.logs.length ? data.logs.map(log => `<article style="display:flex;justify-content:space-between;gap:1rem;border-bottom:1px solid var(--gray-200);padding:1rem 0"><div><strong>${escapeHtml(log.full_name)}</strong><div style="color:var(--gray-500);font-size:.875rem">${escapeHtml(log.designation || '')}${log.department ? ' · ' + escapeHtml(log.department) : ''}</div></div><div style="text-align:right"><strong>${log.action === 'check_in' ? 'Check in' : 'Check out'}</strong><div style="color:var(--gray-500);font-size:.875rem">${formatDate(log.action_time)}${log.reason ? ' · ' + escapeHtml(log.reason) : ''}</div></div></article>`).join('') : empty('No attendance activity has been recorded yet.');
    } catch (error) { container.innerHTML = empty(error.message || 'Unable to load attendance logs.'); }
}

function empty(message) { return `<p style="color:var(--gray-500);margin:0">${escapeHtml(message)}</p>`; }
function escapeHtml(value) { const node = document.createElement('div'); node.textContent = value || ''; return node.innerHTML; }
function formatDate(value) { return new Date(value.replace(' ', 'T')).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); }
