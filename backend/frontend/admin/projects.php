<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Projects - META MINDS PVT LTD</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <link rel="icon" type="image/png" href="../assets/images/meta_minds_logo.png">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body>
    <div class="dashboard">
        <?php include 'sidebar.php'; ?>`n`n        <main class="main-content">
            <div class="top-bar">
                <h1>Projects Management</h1>
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
            
            <!-- Stats Cards -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon primary">
                        <i data-lucide="folder"></i>
                    </div>
                    <div class="stat-info">
                        <h3 id="totalProjects">0</h3>
                        <p>Total Projects</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon success">
                        <i data-lucide="play-circle"></i>
                    </div>
                    <div class="stat-info">
                        <h3 id="activeProjects">0</h3>
                        <p>Active Projects</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon warning">
                        <i data-lucide="check-circle"></i>
                    </div>
                    <div class="stat-info">
                        <h3 id="completedProjects">0</h3>
                        <p>Completed</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon danger">
                        <i data-lucide="dollar-sign"></i>
                    </div>
                    <div class="stat-info">
                        <h3 id="totalBudget">₹0</h3>
                        <p>Total Budget</p>
                    </div>
                </div>
            </div>
            
            <!-- Projects Table -->
            <div class="card">
                <div class="card-header">
                    <h2 class="card-title">All Projects</h2>
                    <button class="btn btn-primary" onclick="openProjectModal()">
                        <i data-lucide="plus"></i>
                        New Project
                    </button>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Project</th>
                                <th>Client</th>
                                <th>Status</th>
                                <th>Priority</th>
                                <th>Progress</th>
                                <th>Budget</th>
                                <th>Team</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="projectsTableBody">
                            <tr>
                                <td colspan="8" style="text-align: center;">Loading...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    </div>
    
    <!-- Project Modal -->
    <div class="modal" id="projectModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="projectModalTitle">New Project</h3>
                <button class="modal-close" onclick="closeProjectModal()">&times;</button>
            </div>
            <form id="projectForm">
                <input type="hidden" id="projectId">
                <div class="form-group">
                    <label class="form-label">Project Name *</label>
                    <input type="text" class="form-control" id="projectName" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Description</label>
                    <textarea class="form-control" id="projectDescription" rows="3"></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">Client Name</label>
                    <input type="text" class="form-control" id="clientName">
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label class="form-label">Start Date</label>
                        <input type="date" class="form-control" id="startDate">
                    </div>
                    <div class="form-group">
                        <label class="form-label">End Date</label>
                        <input type="date" class="form-control" id="endDate">
                    </div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label class="form-label">Budget (₹)</label>
                        <input type="number" class="form-control" id="projectBudget">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Progress (%)</label>
                        <input type="number" class="form-control" id="projectProgress" min="0" max="100" value="0">
                    </div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label class="form-label">Status</label>
                        <select class="form-control" id="projectStatus">
                            <option value="planning">Planning</option>
                            <option value="in_progress">In Progress</option>
                            <option value="on_hold">On Hold</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Priority</label>
                        <select class="form-control" id="projectPriority">
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </select>
                    </div>
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%;">Save Project</button>
            </form>
        </div>
    </div>
    
    <script src="../assets/js/projects.js"></script>
</body>
</html>


