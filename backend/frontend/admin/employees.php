<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Employees - META MINDS PVT LTD</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <link rel="icon" type="image/png" href="../assets/images/meta_minds_logo.png">
    <script src="https://unpkg.com/lucide@latest"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>
<body>
    <div class="dashboard">
        <?php include 'sidebar.php'; ?>`n`n        <main class="main-content">
            <div class="top-bar">
                <h1>Employees</h1>
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
            
            <div class="card">
                <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
                    <h2 class="card-title">All Employees</h2>
                    <button class="btn btn-primary" onclick="openAddEmployeeModal()">
                        <i data-lucide="plus" style="width: 16px; height: 16px;"></i>
                        Add Employee
                    </button>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Photo</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Department</th>
                                <th>Designation</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="employeesTableBody">
                            <tr>
                                <td colspan="8" style="text-align: center;">Loading...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    </div>
    
    <!-- Page Loader -->
    <div id="pageLoader" class="page-loader">
        <div class="loader-spinner"></div>
        <p>Processing...</p>
    </div>
    
    <!-- Add Employee Modal -->
    <div class="modal" id="addEmployeeModal">
        <div class="modal-content" style="max-width: 800px;">
            <div class="modal-header">
                <h3>Add Employee</h3>
                <button class="modal-close" onclick="closeAddEmployeeModal()">&times;</button>
            </div>
            <form id="addEmployeeForm" style="padding: 2rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div>
                    <label class="form-label">Full Name *</label>
                    <input type="text" id="addFullName" class="form-control" required>
                </div>
                <div>
                    <label class="form-label">Email *</label>
                    <input type="email" id="addEmail" class="form-control" required>
                </div>
                <div>
                    <label class="form-label">Phone *</label>
                    <input type="tel" id="addPhone" class="form-control" required>
                </div>
                <div>
                    <label class="form-label">Password *</label>
                    <input type="password" id="addPassword" class="form-control" required>
                </div>
                <div>
                    <label class="form-label">Department *</label>
                    <input type="text" id="addDepartment" class="form-control" required>
                </div>
                <div>
                    <label class="form-label">Designation *</label>
                    <input type="text" id="addDesignation" class="form-control" required>
                </div>
                <div>
                    <label class="form-label">Salary</label>
                    <input type="number" id="addSalary" class="form-control">
                </div>
                <div>
                    <label class="form-label">Joining Date</label>
                    <input type="date" id="addJoiningDate" class="form-control">
                </div>
                <div>
                    <label class="form-label">Date of Birth</label>
                    <input type="date" id="addDateOfBirth" class="form-control">
                </div>
                <div>
                    <label class="form-label">Gender</label>
                    <select id="addGender" class="form-control">
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div style="grid-column: span 2;">
                    <label class="form-label">Address</label>
                    <textarea id="addAddress" class="form-control" rows="2"></textarea>
                </div>
                <div>
                    <label class="form-label">City</label>
                    <input type="text" id="addCity" class="form-control">
                </div>
                <div>
                    <label class="form-label">State</label>
                    <input type="text" id="addState" class="form-control">
                </div>
                <div>
                    <label class="form-label">Pincode</label>
                    <input type="text" id="addPincode" class="form-control">
                </div>
                <div>
                    <label class="form-label">Status</label>
                    <select id="addStatus" class="form-control">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
                <div style="grid-column: span 2; display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1rem;">
                    <button type="button" class="btn btn-secondary" onclick="closeAddEmployeeModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Add Employee</button>
                </div>
            </form>
        </div>
    </div>
    
    <!-- View Employee Modal -->
    <div class="modal" id="viewEmployeeModal">
        <div class="modal-content" style="max-width: 900px; max-height: 90vh;">
            <div class="modal-header">
                <h3>Employee Details</h3>
                <button class="modal-close" onclick="closeViewEmployeeModal()">&times;</button>
            </div>
            <div id="viewEmployeeBody" style="padding: 2rem;"></div>
        </div>
    </div>
    
    <!-- Edit Employee Modal -->
    <div class="modal" id="editEmployeeModal">
        <div class="modal-content" style="max-width: 800px;">
            <div class="modal-header">
                <h3>Edit Employee</h3>
                <button class="modal-close" onclick="closeEditEmployeeModal()">&times;</button>
            </div>
            <form id="editEmployeeForm" style="padding: 2rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <input type="hidden" id="editEmployeeId">
                <div>
                    <label class="form-label">Full Name *</label>
                    <input type="text" id="editFullName" class="form-control" required>
                </div>
                <div>
                    <label class="form-label">Email *</label>
                    <input type="email" id="editEmail" class="form-control" required>
                </div>
                <div>
                    <label class="form-label">Phone *</label>
                    <input type="tel" id="editPhone" class="form-control" required>
                </div>
                <div>
                    <label class="form-label">Department *</label>
                    <input type="text" id="editDepartment" class="form-control" required>
                </div>
                <div>
                    <label class="form-label">Designation *</label>
                    <input type="text" id="editDesignation" class="form-control" required>
                </div>
                <div>
                    <label class="form-label">Salary</label>
                    <input type="number" id="editSalary" class="form-control">
                </div>
                <div>
                    <label class="form-label">Joining Date</label>
                    <input type="date" id="editJoiningDate" class="form-control">
                </div>
                <div>
                    <label class="form-label">Date of Birth</label>
                    <input type="date" id="editDateOfBirth" class="form-control">
                </div>
                <div>
                    <label class="form-label">Gender</label>
                    <select id="editGender" class="form-control">
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div style="grid-column: span 2;">
                    <label class="form-label">Address</label>
                    <textarea id="editAddress" class="form-control" rows="2"></textarea>
                </div>
                <div>
                    <label class="form-label">City</label>
                    <input type="text" id="editCity" class="form-control">
                </div>
                <div>
                    <label class="form-label">State</label>
                    <input type="text" id="editState" class="form-control">
                </div>
                <div>
                    <label class="form-label">Pincode</label>
                    <input type="text" id="editPincode" class="form-control">
                </div>
                <div>
                    <label class="form-label">Status</label>
                    <select id="editStatus" class="form-control">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
                <div style="grid-column: span 2; display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1rem;">
                    <button type="button" class="btn btn-secondary" onclick="closeEditEmployeeModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Update Employee</button>
                </div>
            </form>
        </div>
    </div>
    
    <!-- Photo Preview Modal -->
    <div class="modal" id="photoModal">
        <div class="modal-content photo-modal-content">
            <div class="modal-header">
                <h3>Photo Preview</h3>
                <button class="modal-close" onclick="closePhotoModal()">&times;</button>
            </div>
            <div id="photoModalBody" style="text-align: center; padding: 2rem;">
                <img id="previewImage" src="" alt="Employee Photo" style="max-width: 100%; max-height: 500px; border-radius: 8px; object-fit: contain;">
            </div>
        </div>
    </div>
    
    <script src="../assets/js/employees.js"></script>
</body>
</html>


