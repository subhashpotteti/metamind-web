document.addEventListener('DOMContentLoaded', () => {
    const employee = JSON.parse(localStorage.getItem('employeeData') || 'null');
    const user = JSON.parse(localStorage.getItem('employeeUser') || 'null');
    if (!employee || !user) { window.location.href = 'login.php'; return; }
    document.getElementById('userName').textContent = employee.full_name || 'Employee';
    document.getElementById('userAvatar').textContent = (employee.full_name || 'E').charAt(0).toUpperCase();
    const dateInput = document.getElementById('workUpdateDate');
    dateInput.value = new Date().toISOString().slice(0, 10);
    dateInput.addEventListener('change', loadUpdates);
    loadUpdates();
    async function loadUpdates() {
        const container = document.getElementById('workUpdatesList');
        container.innerHTML = '<div class="loading">Loading work updates...</div>';
        try {
            const params = new URLSearchParams({ employee_id: employee.id, date: dateInput.value, limit: '100' });
            const data = await fetch('../../backend/api/work_updates.php?' + params).then(response => response.json());
            if (!data.success) throw new Error(data.message || 'Unable to load work updates.');
            container.innerHTML = data.updates.length ? data.updates.map(update => `<article style="padding:1rem 0;border-bottom:1px solid var(--gray-200)"><small style="color:var(--gray-500)">${formatDate(update.work_date || update.created_at)}</small><p style="white-space:pre-wrap;margin:.5rem 0 0">${escapeHtml(update.work_update)}</p></article>`).join('') : empty('No work updates for this date.');
        } catch (error) { container.innerHTML = empty(error.message); }
    }
});
function empty(message) { return `<p style="color:var(--gray-500);margin:0">${escapeHtml(message)}</p>`; }
function escapeHtml(value) { const node = document.createElement('div'); node.textContent = value || ''; return node.innerHTML; }
function formatDate(value) { return new Date(String(value).replace(' ', 'T')).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }); }
