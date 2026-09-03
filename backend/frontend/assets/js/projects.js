// Projects Management JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const adminUser = localStorage.getItem('adminUser');
    if (!adminUser) {
        window.location.href = 'login.php';
        return;
    }
    
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Load data
    loadProjectStats();
    loadProjects();
    loadNotificationCount();
    
    // Real-time updates
    setInterval(() => {
        loadProjectStats();
        loadProjects();
        loadNotificationCount();
    }, 30000); // Update every 30 seconds
});

async function loadProjectStats() {
    try {
        const response = await fetch('../../backend/api/projects.php?action=get_project_stats');
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('totalProjects').textContent = data.stats.total_projects;
            document.getElementById('activeProjects').textContent = data.stats.active_projects;
            document.getElementById('completedProjects').textContent = data.stats.completed_projects;
            document.getElementById('totalBudget').textContent = '₹' + (data.stats.total_budget || 0).toLocaleString();
        }
    } catch (error) {
        console.error('Error loading project stats:', error);
    }
}

async function loadProjects() {
    try {
        const response = await fetch('../../backend/api/projects.php?action=get_projects');
        const data = await response.json();
        
        if (data.success) {
            const tbody = document.getElementById('projectsTableBody');
            
            if (data.projects.length === 0) {
                tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">No projects found</td></tr>';
                return;
            }
            
            tbody.innerHTML = data.projects.map(project => `
                <tr>
                    <td>
                        <div style="font-weight: 600;">${project.name}</div>
                        <div style="font-size: 0.8rem; color: var(--gray-500);">${project.description || 'No description'}</div>
                    </td>
                    <td>${project.client_name || 'N/A'}</td>
                    <td><span class="badge badge-${project.status}">${formatStatus(project.status)}</span></td>
                    <td><span class="badge badge-${project.priority}">${project.priority}</span></td>
                    <td>
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <div style="flex: 1; background: var(--gray-200); border-radius: 10px; height: 8px; overflow: hidden;">
                                <div style="width: ${project.progress}%; background: ${getProgressColor(project.progress)}; height: 100%;"></div>
                            </div>
                            <span style="font-size: 0.8rem;">${project.progress}%</span>
                        </div>
                    </td>
                    <td>₹${(project.budget || 0).toLocaleString()}</td>
                    <td>${project.team_size || 0} members</td>
                    <td>
                        <button class="btn btn-secondary btn-sm" onclick="editProject(${project.id})">
                            <i data-lucide="edit-2" style="width: 16px; height: 16px;"></i>
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="deleteProject(${project.id})">
                            <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
            
            lucide.createIcons();
        }
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

function formatStatus(status) {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function getProgressColor(progress) {
    if (progress >= 75) return '#10b981';
    if (progress >= 50) return '#3b82f6';
    if (progress >= 25) return '#f59e0b';
    return '#ef4444';
}

function openProjectModal() {
    document.getElementById('projectModalTitle').textContent = 'New Project';
    document.getElementById('projectForm').reset();
    document.getElementById('projectId').value = '';
    document.getElementById('projectModal').classList.add('active');
}

function closeProjectModal() {
    document.getElementById('projectModal').classList.remove('active');
}

function editProject(projectId) {
    fetch(`../../backend/api/projects.php?action=get_project_details&project_id=${projectId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const project = data.project;
                document.getElementById('projectModalTitle').textContent = 'Edit Project';
                document.getElementById('projectId').value = project.id;
                document.getElementById('projectName').value = project.name;
                document.getElementById('projectDescription').value = project.description || '';
                document.getElementById('clientName').value = project.client_name || '';
                document.getElementById('startDate').value = project.start_date || '';
                document.getElementById('endDate').value = project.end_date || '';
                document.getElementById('projectBudget').value = project.budget || '';
                document.getElementById('projectProgress').value = project.progress || 0;
                document.getElementById('projectStatus').value = project.status;
                document.getElementById('projectPriority').value = project.priority;
                document.getElementById('projectModal').classList.add('active');
            }
        });
}

async function deleteProject(projectId) {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
        const response = await fetch('../../backend/api/projects.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'delete_project',
                project_id: projectId
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Project deleted successfully', 'success');
            loadProjects();
            loadProjectStats();
        } else {
            showAlert(data.message || 'Failed to delete project', 'error');
        }
    } catch (error) {
        showAlert('Network error. Please try again.', 'error');
    }
}

document.getElementById('projectForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const projectId = document.getElementById('projectId').value;
    const action = projectId ? 'update_project' : 'create_project';
    
    const projectData = {
        action: action,
        name: document.getElementById('projectName').value,
        description: document.getElementById('projectDescription').value,
        client_name: document.getElementById('clientName').value,
        start_date: document.getElementById('startDate').value,
        end_date: document.getElementById('endDate').value,
        budget: parseFloat(document.getElementById('projectBudget').value) || 0,
        progress: parseInt(document.getElementById('projectProgress').value) || 0,
        status: document.getElementById('projectStatus').value,
        priority: document.getElementById('projectPriority').value
    };
    
    if (projectId) {
        projectData.id = parseInt(projectId);
    }
    
    try {
        const response = await fetch('../../backend/api/projects.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(projectData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert(projectId ? 'Project updated successfully' : 'Project created successfully', 'success');
            closeProjectModal();
            loadProjects();
            loadProjectStats();
        } else {
            showAlert(data.message || 'Failed to save project', 'error');
        }
    } catch (error) {
        showAlert('Network error. Please try again.', 'error');
    }
});

async function loadNotificationCount() {
    const adminUser = JSON.parse(localStorage.getItem('adminUser'));
    if (!adminUser) return;
    
    try {
        const response = await fetch(`../../backend/api/notifications.php?action=get_unread_count&user_id=${adminUser.id}`);
        const data = await response.json();
        
        if (data.success && data.count > 0) {
            document.getElementById('notifBadge').textContent = data.count;
            document.getElementById('notifBadge').style.display = 'block';
            document.getElementById('notifDot').style.display = 'block';
        } else {
            document.getElementById('notifBadge').style.display = 'none';
            document.getElementById('notifDot').style.display = 'none';
        }
    } catch (error) {
        console.error('Error loading notification count:', error);
    }
}

function showAlert(message, type) {
    const alertContainer = document.getElementById('alertContainer');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} fade-in`;
    alert.innerHTML = `
        <i data-lucide="${type === 'success' ? 'check-circle' : 'alert-circle'}" style="width: 20px; height: 20px;"></i>
        ${message}
    `;
    alertContainer.innerHTML = '';
    alertContainer.appendChild(alert);
    lucide.createIcons();
    
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

function logout() {
    localStorage.removeItem('adminUser');
    window.location.href = 'login.php';
}
