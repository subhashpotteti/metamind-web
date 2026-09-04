document.addEventListener('DOMContentLoaded', async () => {
    const employee = JSON.parse(localStorage.getItem('employeeData') || 'null');
    const user = JSON.parse(localStorage.getItem('employeeUser') || localStorage.getItem('adminUser') || 'null');
    if (!user) { window.location.href = location.pathname.includes('/admin/') ? 'login.php' : 'login.php'; return; }
    const name = employee?.full_name || 'Admin';
    document.getElementById('userName').textContent = name;
    document.getElementById('userAvatar').textContent = name.charAt(0).toUpperCase();
    lucide.createIcons();
    const container = document.getElementById('workUpdatesList');
    try {
        const response = await fetch('../../backend/api/work_updates.php?limit=100');
        const data = await response.json();
        if (!data.success) throw new Error(data.message || 'Unable to load work updates.');
        container.innerHTML = data.updates.length ? data.updates.map(update => `<article style="padding:1rem 0;border-bottom:1px solid var(--gray-200)"><div style="display:flex;justify-content:space-between;gap:1rem"><strong>${escapeHtml(update.full_name)}</strong><small style="color:var(--gray-500)">${formatDate(update.created_at)}</small></div><small style="color:var(--gray-500)">${escapeHtml(update.designation || '')}${update.department ? ' · ' + escapeHtml(update.department) : ''}</small><p style="white-space:pre-wrap;margin:.5rem 0 0">${escapeHtml(update.work_update)}</p></article>`).join('') : empty('No work updates have been submitted yet.');
    } catch (error) { container.innerHTML = empty(error.message); }
});
function empty(message) { return `<p style="color:var(--gray-500);margin:0">${escapeHtml(message)}</p>`; }
function escapeHtml(value) { const node = document.createElement('div'); node.textContent = value || ''; return node.innerHTML; }
function formatDate(value) { return new Date(value.replace(' ', 'T')).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); }
