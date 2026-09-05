document.addEventListener('DOMContentLoaded', async () => {
    const user = JSON.parse(localStorage.getItem('employeeUser') || localStorage.getItem('adminUser') || 'null');
    if (!user) { window.location.href = 'login.php'; return; }
    const container = document.getElementById('attendanceLogsList');
    const employees = await fetch('../../backend/api/admin.php?action=get_employees').then(r => r.json());
    if (employees.success) {
        document.getElementById('logEmployee').innerHTML = '<option value="">All Employees</option>' + employees.employees.map(e => `<option value="${e.id}">${escapeHtml(e.full_name)}</option>`).join('');
        const departments = [...new Set(employees.employees.map(e => e.department).filter(Boolean))];
        document.getElementById('logDepartment').innerHTML += departments.map(d => `<option>${escapeHtml(d)}</option>`).join('');
    }
    ['logFromDate','logToDate','logEmployee','logDepartment','logCheckIn','logCheckOut'].forEach(id => document.getElementById(id).addEventListener('change', loadLogs));
    document.getElementById('resetLogFilters').addEventListener('click', () => { ['logFromDate','logToDate'].forEach(id => document.getElementById(id).value=''); ['logEmployee','logDepartment'].forEach(id => document.getElementById(id).value=''); ['logCheckIn','logCheckOut'].forEach(id => document.getElementById(id).checked=false); loadLogs(); });
    loadLogs();
    async function loadLogs() {
        const params = new URLSearchParams({limit:'100',from_date:document.getElementById('logFromDate').value,to_date:document.getElementById('logToDate').value,employee_id:document.getElementById('logEmployee').value,department:document.getElementById('logDepartment').value,check_in:document.getElementById('logCheckIn').checked?'1':'',check_out:document.getElementById('logCheckOut').checked?'1':''});
        container.innerHTML = '<div class="loading">Loading attendance logs...</div>';
        const data = await fetch('../../backend/api/attendance_logs.php?' + params).then(r => r.json());
        if (!data.success) { container.innerHTML = empty(data.message); return; }
        container.innerHTML = data.logs.length ? data.logs.map(log => `<article style="display:flex;justify-content:space-between;gap:1rem;padding:1rem 0;border-bottom:1px solid var(--gray-200)"><div><strong>${escapeHtml(log.full_name)}</strong><div style="color:var(--gray-500);font-size:.875rem">${escapeHtml(log.designation || '')}${log.department ? ' · ' + escapeHtml(log.department) : ''}</div></div><div style="text-align:right"><strong style="color:${log.action === 'check_in' ? '#059669' : '#dc2626'}">${log.action === 'check_in' ? 'Check in' : 'Check out'}</strong><div style="color:var(--gray-500);font-size:.875rem">${formatDate(log.action_time)}${log.reason ? ' · ' + escapeHtml(log.reason) : ''}</div></div></article>`).join('') : empty('No attendance activity has been recorded yet.');
    }
});
function empty(message) { return `<p style="color:var(--gray-500);margin:0">${escapeHtml(message)}</p>`; }
function escapeHtml(value) { const node = document.createElement('div'); node.textContent = value || ''; return node.innerHTML; }
function formatDate(value) { return new Date(value.replace(' ', 'T')).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); }
