document.addEventListener('DOMContentLoaded', async () => {
    const employee = JSON.parse(localStorage.getItem('employeeData') || 'null');
    const user = JSON.parse(localStorage.getItem('employeeUser') || localStorage.getItem('adminUser') || 'null');
    if (!user) { window.location.href = 'login.php'; return; }
    const name = employee?.full_name || 'Admin';
    document.getElementById('userName').textContent = name;
    document.getElementById('userAvatar').textContent = name.charAt(0).toUpperCase();
    lucide.createIcons();
    const container = document.getElementById('attendanceLogsList');
    try {
        const response = await fetch('../../backend/api/attendance_logs.php?limit=100');
        const data = await response.json();
        if (!data.success) throw new Error(data.message || 'Unable to load attendance logs.');
        container.innerHTML = data.logs.length ? data.logs.map(log => `<article style="display:flex;justify-content:space-between;gap:1rem;padding:1rem 0;border-bottom:1px solid var(--gray-200)"><div><strong>${escapeHtml(log.full_name)}</strong><div style="color:var(--gray-500);font-size:.875rem">${escapeHtml(log.designation || '')}${log.department ? ' · ' + escapeHtml(log.department) : ''}</div></div><div style="text-align:right"><strong style="color:${log.action === 'check_in' ? '#059669' : '#dc2626'}">${log.action === 'check_in' ? 'Check in' : 'Check out'}</strong><div style="color:var(--gray-500);font-size:.875rem">${formatDate(log.action_time)}${log.reason ? ' · ' + escapeHtml(log.reason) : ''}</div></div></article>`).join('') : empty('No attendance activity has been recorded yet.');
    } catch (error) { container.innerHTML = empty(error.message); }
});
function empty(message) { return `<p style="color:var(--gray-500);margin:0">${escapeHtml(message)}</p>`; }
function escapeHtml(value) { const node = document.createElement('div'); node.textContent = value || ''; return node.innerHTML; }
function formatDate(value) { return new Date(value.replace(' ', 'T')).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); }
