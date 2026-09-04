document.addEventListener('DOMContentLoaded', async () => {
  lucide.createIcons();
  const admin = JSON.parse(localStorage.getItem('adminUser') || 'null');
  if (!admin) { location.href = 'login.php'; return; }
  const response = await fetch(`../../backend/api/admin.php?action=get_admin_profile&admin_id=${admin.id}`);
  const data = await response.json();
  if (!data.success) return showAlert(data.message || 'Could not load profile', 'error');
  adminProfile = data.admin;
  document.getElementById('adminPhone').value = adminProfile.phone || '';
  document.getElementById('adminCreated').value = adminProfile.created_at || '';
});
let adminProfile;
document.getElementById('profileForm').addEventListener('submit', async event => {
  event.preventDefault(); const phone = document.getElementById('adminPhone').value.trim();
  if (!/^\d{10}$/.test(phone)) return showAlert('Enter a valid 10-digit phone number.', 'error');
  const response = await fetch('../../backend/api/admin.php', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'update_admin_profile',admin_id:adminProfile.id,phone})});
  const data = await response.json(); if (data.success) { const user=JSON.parse(localStorage.getItem('adminUser')); user.phone=phone; localStorage.setItem('adminUser',JSON.stringify(user)); } showAlert(data.message, data.success ? 'success' : 'error');
});
function showAlert(message, type) { const box=document.getElementById('alertContainer'); box.innerHTML=`<div class="alert alert-${type}">${message}</div>`; setTimeout(()=>box.innerHTML='',4000); }
