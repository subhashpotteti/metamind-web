<?php
require_once '../../backend/config/auth.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Role Permissions - META MINDS PVT LTD</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <link rel="icon" type="image/png" href="../assets/images/meta_minds_logo.png">
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        .roles-container {
            background: white;
            border-radius: 8px;
            padding: 24px;
            margin-top: 20px;
        }

        .role-selector {
            margin-bottom: 24px;
            padding: 16px;
            background: #f8f9fa;
            border-radius: 6px;
        }

        .role-selector label {
            display: block;
            font-weight: 600;
            margin-bottom: 8px;
            color: #333;
        }

        .role-selector select {
            width: 100%;
            max-width: 400px;
            padding: 10px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            background: white;
        }

        .permissions-container {
            margin-top: 24px;
            padding-top: 24px;
            border-top: 1px solid #e0e0e0;
        }

        .permissions-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 16px;
            border-bottom: 2px solid #e0e0e0;
        }

        .permissions-header h3 {
            margin: 0;
            font-size: 18px;
            color: #333;
        }

        .permissions-header button {
            padding: 10px 20px;
            background: #4a90e2;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 600;
        }

        .permissions-header button:hover {
            background: #357abd;
        }

        .permissions-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 20px;
        }

        .permission-group {
            background: #f8f9fa;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            padding: 16px;
        }

        .permission-group h4 {
            margin: 0 0 12px 0;
            font-size: 14px;
            font-weight: 600;
            color: #4a90e2;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .permission-item {
            display: flex;
            align-items: center;
            padding: 8px 0;
            cursor: pointer;
            transition: background 0.2s;
        }

        .permission-item:hover {
            background: rgba(74, 144, 226, 0.1);
            border-radius: 4px;
            padding-left: 8px;
            padding-right: 8px;
            margin: 0 -8px;
        }

        .permission-item input[type="checkbox"] {
            margin-right: 10px;
            width: 18px;
            height: 18px;
            cursor: pointer;
        }

        .permission-item span {
            font-size: 14px;
            color: #555;
        }

        .alert {
            padding: 12px 16px;
            margin-bottom: 16px;
            border-radius: 4px;
            font-size: 14px;
        }

        .alert-success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }

        .alert-error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
    </style>
</head>
<body>
    <div class="dashboard">
        <?php include 'sidebar.php'; ?>
        
        <main class="main-content">
            <div class="top-bar">
                <h1>Role Permissions</h1>
                <div class="user-info">
                    <div class="notification-icon" onclick="window.location.href='notifications.php'">
                        <i data-lucide="bell"></i>
                        <span class="notification-dot" id="notifDot"></span>
                    </div>
                    <div class="user-avatar">A</div>
                    <span>Admin</span>
                </div>
            </div>
            
            <div id="alertContainer"></div>

            <section class="content-section">
                <div class="section-header">
                    <h2>Manage Role Permissions</h2>
                    <p>Configure access rights for different user roles in the system.</p>
                </div>

                <div class="roles-container">
                    <div class="role-selector">
                        <label for="roleSelect">Select Role:</label>
                        <select id="roleSelect" onchange="loadRolePermissions()">
                            <option value="">-- Select Role --</option>
                            <option value="ceo">CEO</option>
                            <option value="manager">Manager</option>
                            <option value="hr">HR</option>
                            <option value="frontend_tl">Frontend Team Lead</option>
                            <option value="backend_tl">Backend Team Lead</option>
                            <option value="frontend_employee">Frontend Employee</option>
                            <option value="backend_employee">Backend Employee</option>
                            <option value="frontend_intern">Frontend Intern</option>
                            <option value="backend_intern">Backend Intern</option>
                        </select>
                    </div>

                    <div id="permissionsContainer" class="permissions-container" style="display: none;">
                        <div class="permissions-header">
                            <h3>Permissions for <span id="selectedRoleName"></span></h3>
                            <button class="btn btn-primary" onclick="savePermissions()">Save Permissions</button>
                        </div>

                        <div class="permissions-grid">
                            <!-- Dashboard -->
                            <div class="permission-group">
                                <h4>Dashboard</h4>
                                <label class="permission-item">
                                    <input type="checkbox" class="permission-checkbox" value="dashboard.view">
                                    <span>View Dashboard</span>
                                </label>
                            </div>

                            <!-- Attendance -->
                            <div class="permission-group">
                                <h4>Attendance</h4>
                                <label class="permission-item">
                                    <input type="checkbox" class="permission-checkbox" value="attendance.self">
                                    <span>Self Attendance</span>
                                </label>
                                <label class="permission-item">
                                    <input type="checkbox" class="permission-checkbox" value="attendance.read">
                                    <span>Read Attendance</span>
                                </label>
                                <label class="permission-item">
                                    <input type="checkbox" class="permission-checkbox" value="attendance.create">
                                    <span>Create Attendance</span>
                                </label>
                                <label class="permission-item">
                                    <input type="checkbox" class="permission-checkbox" value="attendance.update">
                                    <span>Update Attendance</span>
                                </label>
                                <label class="permission-item">
                                    <input type="checkbox" class="permission-checkbox" value="attendance.delete">
                                    <span>Delete Attendance</span>
                                </label>
                            </div>

                            <!-- Leaves -->
                            <div class="permission-group">
                                <h4>Leaves</h4>
                                <label class="permission-item">
                                    <input type="checkbox" class="permission-checkbox" value="leaves.self">
                                    <span>Self Leaves</span>
                                </label>
                                <label class="permission-item">
                                    <input type="checkbox" class="permission-checkbox" value="leaves.read">
                                    <span>Read Leaves</span>
                                </label>
                                <label class="permission-item">
                                    <input type="checkbox" class="permission-checkbox" value="leaves.create">
                                    <span>Create Leaves</span>
                                </label>
                                <label class="permission-item">
                                    <input type="checkbox" class="permission-checkbox" value="leaves.update">
                                    <span>Update Leaves</span>
                                </label>
                                <label class="permission-item">
                                    <input type="checkbox" class="permission-checkbox" value="leaves.delete">
                                    <span>Delete Leaves</span>
                                </label>
                            </div>

                            <!-- Notes -->
                            <div class="permission-group">
                                <h4>Notes</h4>
                                <label class="permission-item">
                                    <input type="checkbox" class="permission-checkbox" value="notes.self">
                                    <span>Self Notes</span>
                                </label>
                                <label class="permission-item">
                                    <input type="checkbox" class="permission-checkbox" value="notes.read">
                                    <span>Read Notes</span>
                                </label>
                                <label class="permission-item">
                                    <input type="checkbox" class="permission-checkbox" value="notes.create">
                                    <span>Create Notes</span>
                                </label>
                                <label class="permission-item">
                                    <input type="checkbox" class="permission-checkbox" value="notes.update">
                                    <span>Update Notes</span>
                                </label>
                                <label class="permission-item">
                                    <input type="checkbox" class="permission-checkbox" value="notes.delete">
                                    <span>Delete Notes</span>
                                </label>
                            </div>

                            <!-- Projects -->
                            <div class="permission-group">
                                <h4>Projects</h4>
                                <label class="permission-item">
                                    <input type="checkbox" class="permission-checkbox" value="projects.read">
                                    <span>Read Projects</span>
                                </label>
                                <label class="permission-item">
                                    <input type="checkbox" class="permission-checkbox" value="projects.create">
                                    <span>Create Projects</span>
                                </label>
                                <label class="permission-item">
                                    <input type="checkbox" class="permission-checkbox" value="projects.update">
                                    <span>Update Projects</span>
                                </label>
                                <label class="permission-item">
                                    <input type="checkbox" class="permission-checkbox" value="projects.delete">
                                    <span>Delete Projects</span>
                                </label>
                            </div>

                            <!-- Employees -->
                            <div class="permission-group">
                                <h4>Employees</h4>
                                <label class="permission-item">
                                    <input type="checkbox" class="permission-checkbox" value="employees.read">
                                    <span>Read Employees</span>
                                </label>
                                <label class="permission-item">
                                    <input type="checkbox" class="permission-checkbox" value="employees.create">
                                    <span>Create Employees</span>
                                </label>
                                <label class="permission-item">
                                    <input type="checkbox" class="permission-checkbox" value="employees.update">
                                    <span>Update Employees</span>
                                </label>
                                <label class="permission-item">
                                    <input type="checkbox" class="permission-checkbox" value="employees.delete">
                                    <span>Delete Employees</span>
                                </label>
                            </div>

                            <!-- Revenue -->
                            <div class="permission-group">
                                <h4>Revenue</h4>
                                <label class="permission-item">
                                    <input type="checkbox" class="permission-checkbox" value="revenue.read">
                                    <span>Read Revenue</span>
                                </label>
                                <label class="permission-item">
                                    <input type="checkbox" class="permission-checkbox" value="revenue.create">
                                    <span>Create Revenue</span>
                                </label>
                                <label class="permission-item">
                                    <input type="checkbox" class="permission-checkbox" value="revenue.update">
                                    <span>Update Revenue</span>
                                </label>
                                <label class="permission-item">
                                    <input type="checkbox" class="permission-checkbox" value="revenue.delete">
                                    <span>Delete Revenue</span>
                                </label>
                            </div>

                            <!-- Requests -->
                            <div class="permission-group">
                                <h4>Requests</h4>
                                <label class="permission-item">
                                    <input type="checkbox" class="permission-checkbox" value="requests.read">
                                    <span>Read Requests</span>
                                </label>
                                <label class="permission-item">
                                    <input type="checkbox" class="permission-checkbox" value="requests.update">
                                    <span>Update Requests</span>
                                </label>
                            </div>

                            <!-- Notifications -->
                            <div class="permission-group">
                                <h4>Notifications</h4>
                                <label class="permission-item">
                                    <input type="checkbox" class="permission-checkbox" value="notifications.self">
                                    <span>Self Notifications</span>
                                </label>
                                <label class="permission-item">
                                    <input type="checkbox" class="permission-checkbox" value="notifications.read">
                                    <span>Read Notifications</span>
                                </label>
                                <label class="permission-item">
                                    <input type="checkbox" class="permission-checkbox" value="notifications.create">
                                    <span>Create Notifications</span>
                                </label>
                                <label class="permission-item">
                                    <input type="checkbox" class="permission-checkbox" value="notifications.update">
                                    <span>Update Notifications</span>
                                </label>
                                <label class="permission-item">
                                    <input type="checkbox" class="permission-checkbox" value="notifications.delete">
                                    <span>Delete Notifications</span>
                                </label>
                            </div>

                            <!-- Tasks -->
                            <div class="permission-group">
                                <h4>Tasks</h4>
                                <label class="permission-item">
                                    <input type="checkbox" class="permission-checkbox" value="tasks.read">
                                    <span>Read Tasks</span>
                                </label>
                                <label class="permission-item">
                                    <input type="checkbox" class="permission-checkbox" value="tasks.create">
                                    <span>Create Tasks</span>
                                </label>
                                <label class="permission-item">
                                    <input type="checkbox" class="permission-checkbox" value="tasks.update">
                                    <span>Update Tasks</span>
                                </label>
                                <label class="permission-item">
                                    <input type="checkbox" class="permission-checkbox" value="tasks.delete">
                                    <span>Delete Tasks</span>
                                </label>
                            </div>

                            <!-- Profile -->
                            <div class="permission-group">
                                <h4>Profile</h4>
                                <label class="permission-item">
                                    <input type="checkbox" class="permission-checkbox" value="profile.self">
                                    <span>Self Profile</span>
                                </label>
                            </div>

                            <!-- Roles Management -->
                            <div class="permission-group">
                                <h4>Roles Management</h4>
                                <label class="permission-item">
                                    <input type="checkbox" class="permission-checkbox" value="roles.manage">
                                    <span>Manage Roles</span>
                                </label>
                            </div>

                            <!-- Full Access -->
                            <div class="permission-group">
                                <h4>System</h4>
                                <label class="permission-item">
                                    <input type="checkbox" class="permission-checkbox" value="*">
                                    <span>Full Access (*)</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </div>

    <script>
        // Initialize icons
        lucide.createIcons();

        // Load role permissions when page loads
        document.addEventListener('DOMContentLoaded', function() {
            loadAllRolePermissions();
        });

        function loadAllRolePermissions() {
            fetch('../../backend/api/admin.php?action=get_role_permissions')
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        window.allRolePermissions = data.roles;
                    }
                })
                .catch(error => console.error('Error loading permissions:', error));
        }

        function loadRolePermissions() {
            const role = document.getElementById('roleSelect').value;
            if (!role) {
                document.getElementById('permissionsContainer').style.display = 'none';
                return;
            }

            document.getElementById('selectedRoleName').textContent = role.replace('_', ' ').toUpperCase();
            document.getElementById('permissionsContainer').style.display = 'block';

            // Uncheck all checkboxes first
            document.querySelectorAll('.permission-checkbox').forEach(checkbox => {
                checkbox.checked = false;
            });

            // Load permissions for selected role
            if (window.allRolePermissions && window.allRolePermissions[role]) {
                window.allRolePermissions[role].forEach(permission => {
                    const checkbox = document.querySelector(`.permission-checkbox[value="${permission}"]`);
                    if (checkbox) {
                        checkbox.checked = true;
                    }
                });
            }
        }

        function savePermissions() {
            const role = document.getElementById('roleSelect').value;
            if (!role) {
                showAlert('Please select a role first', 'error');
                return;
            }

            const permissions = [];
            document.querySelectorAll('.permission-checkbox:checked').forEach(checkbox => {
                permissions.push(checkbox.value);
            });

            fetch('../../backend/api/admin.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'save_role_permissions',
                    role: role,
                    permissions: permissions
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text().then(text => {
                    try {
                        return JSON.parse(text);
                    } catch (e) {
                        throw new Error(`Invalid JSON response: ${text.substring(0, 200)}...`);
                    }
                });
            })
            .then(data => {
                if (data.success) {
                    showAlert(data.message + ' Users will need to re-login for changes to take effect.', 'success');
                    loadAllRolePermissions(); // Refresh cached permissions
                } else {
                    showAlert(data.message, 'error');
                }
            })
            .catch(error => {
                showAlert('Error saving permissions: ' + error.message, 'error');
                console.error('Full error:', error);
            });
        }

        function showAlert(message, type) {
            const alertContainer = document.getElementById('alertContainer');
            const alert = document.createElement('div');
            alert.className = `alert alert-${type}`;
            alert.textContent = message;
            alertContainer.appendChild(alert);

            setTimeout(() => {
                alert.remove();
            }, 5000);
        }
    </script>
</body>
</html>
