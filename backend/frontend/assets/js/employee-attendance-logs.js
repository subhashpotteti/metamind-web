document.addEventListener('DOMContentLoaded', () => {
    const employee = JSON.parse(localStorage.getItem('employeeData') || 'null');
    const user = JSON.parse(localStorage.getItem('employeeUser') || 'null');
    if (!employee || !user) { window.location.href = 'login.php'; return; }
    document.getElementById('userName').textContent = employee.full_name || 'Employee';
    document.getElementById('userAvatar').textContent = (employee.full_name || 'E').charAt(0).toUpperCase();
    const dateInput = document.getElementById('logDate');
    dateInput.value = new Date().toISOString().slice(0, 10);
    dateInput.addEventListener('change', loadLogs);
    loadLogs();
    async function loadLogs() {
        const container = document.getElementById('attendanceLogsList');
        container.innerHTML = '<div class="loading">Loading attendance logs...</div>';
        try {
            const params = new URLSearchParams({ employee_id: employee.id, date: dateInput.value, limit: '100' });
            const data = await fetch('../../backend/api/attendance_logs.php?' + params).then(response => response.json());
            if (!data.success) throw new Error(data.message || 'Unable to load attendance logs.');
            container.innerHTML = data.logs.length ? data.logs.map(log => `<article style="display:flex;justify-content:space-between;gap:1rem;padding:1rem 0;border-bottom:1px solid var(--gray-200)"><div><strong>${escapeHtml(log.action === 'check_in' ? 'Check in' : 'Check out')}</strong>${log.reason ? `<div style="color:var(--gray-500);font-size:.875rem">${escapeHtml(log.reason)}</div>` : ''}</div><div style="text-align:right;color:var(--gray-500);font-size:.875rem">${formatDate(log.action_time)}</div></article>`).join('') : empty('No attendance activity for this date.');
        } catch (error) { container.innerHTML = empty(error.message); }
    }
});
function empty(message) { return `<p style="color:var(--gray-500);margin:0">${escapeHtml(message)}</p>`; }
function escapeHtml(value) { const node = document.createElement('div'); node.textContent = value || ''; return node.innerHTML; }
function formatDate(value) { return new Date(String(value).replace(' ', 'T')).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }); }
