let contactMessages = [];

document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('adminUser')) { window.location.href = 'login.php'; return; }
    lucide.createIcons();
    loadContacts();
});

async function loadContacts() {
    const body = document.getElementById('contactsTableBody');
    try {
        const response = await fetch('../../backend/api/contact.php');
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.message || 'Unable to load contact messages.');
        contactMessages = data.contacts || [];
        body.innerHTML = contactMessages.length ? contactMessages.map(contact => `<tr><td>${formatDate(contact.created_at)}</td><td><strong>${escapeHtml(contact.name)}</strong></td><td><a href="mailto:${escapeHtml(contact.email)}">${escapeHtml(contact.email)}</a></td><td>${escapeHtml(contact.phone)}</td><td>${escapeHtml(contact.company || 'N/A')}</td><td>${escapeHtml(contact.service || 'General enquiry')}</td><td><span class="badge badge-${escapeHtml(contact.status)}">${escapeHtml(contact.status)}</span></td><td><button class="btn btn-secondary btn-sm" onclick="viewContact(${contact.id})" title="View"><i data-lucide="eye" style="width:16px;height:16px"></i></button></td></tr>`).join('') : '<tr><td colspan="8" style="text-align:center">No contact messages found.</td></tr>';
        lucide.createIcons();
    } catch (error) {
        body.innerHTML = `<tr><td colspan="8" style="text-align:center;color:#dc2626">${escapeHtml(error.message)}</td></tr>`;
    }
}

function viewContact(id) {
    const contact = contactMessages.find(item => Number(item.id) === Number(id));
    if (!contact) return;
    document.getElementById('contactModalBody').innerHTML = `<div class="info-grid"><div class="info-item"><label>Name</label><span>${escapeHtml(contact.name)}</span></div><div class="info-item"><label>Email</label><span><a href="mailto:${escapeHtml(contact.email)}">${escapeHtml(contact.email)}</a></span></div><div class="info-item"><label>Phone</label><span>${escapeHtml(contact.phone)}</span></div><div class="info-item"><label>Company</label><span>${escapeHtml(contact.company || 'N/A')}</span></div><div class="info-item"><label>Service</label><span>${escapeHtml(contact.service || 'General enquiry')}</span></div><div class="info-item"><label>Submitted</label><span>${formatDate(contact.created_at)}</span></div><div class="info-item full-width"><label>Message</label><span style="white-space:pre-wrap">${escapeHtml(contact.message)}</span></div></div>`;
    document.getElementById('contactModal').classList.add('active');
}

function closeContactModal() { document.getElementById('contactModal').classList.remove('active'); }
function escapeHtml(value) { const node = document.createElement('div'); node.textContent = value || ''; return node.innerHTML; }
function formatDate(value) { return new Date(String(value).replace(' ', 'T')).toLocaleString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }); }
