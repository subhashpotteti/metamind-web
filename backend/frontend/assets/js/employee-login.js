// Employee Login JavaScript
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const identifierInput = document.getElementById('identifier');
    const passwordInput = document.getElementById('password');
    const btnText = document.getElementById('btnText');
    const btnSpinner = document.getElementById('btnSpinner');

    // Real-time validation
    identifierInput.addEventListener('input', function () {
        validateIdentifier(this.value);
    });

    passwordInput.addEventListener('input', function () {
        validatePassword(this.value);
    });

    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const identifier = identifierInput.value.trim();
        const password = passwordInput.value.trim();

        // Validate
        const identifierValid = validateIdentifier(identifier);
        const passwordValid = validatePassword(password);

        if (!identifierValid || !passwordValid) {
            showAlert('Please fix the errors before submitting', 'error');
            return;
        }

        // Show loading
        btnText.style.display = 'none';
        btnSpinner.style.display = 'inline-block';

        try {
            const response = await fetch('../../backend/api/login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ identifier, password, role: 'employee' })
            });

            const responseText = await response.text();

            let data;

            try {
                data = JSON.parse(responseText);
            } catch (parseError) {
                console.error('Invalid API response:', responseText);
                throw new Error(
                    `Server returned invalid response. HTTP ${response.status}`
                );
            }

            if (!response.ok) {
                console.error('Login API error:', response.status, data);
                throw new Error(
                    data.message || `Server error: HTTP ${response.status}`
                );
            }

            if (data.success) {
                if (data.user.role === 'employee') {
                    if (!data.employee) {
                        showAlert('No registration found. Please complete your registration first.', 'warning');
                    } else if (data.employee.from_request || data.employee.status === 'pending') {
                        showAlert('Your registration is pending approval. Please wait for admin approval.', 'warning');
                    } else if (data.employee.status === 'approved') {
                        localStorage.setItem('employeeUser', JSON.stringify(data.user));
                        localStorage.setItem('employeeData', JSON.stringify(data.employee));
                        // All approved employee designations use the employee workspace.
                        // Only accounts authenticated through the admin login can open the admin panel.
                        localStorage.removeItem('adminUser');
                        showAlert('Login successful! Redirecting...', 'success');
                        setTimeout(() => {
                            window.location.href = 'dashboard.php';
                        }, 1000);
                    } else if (data.employee.status === 'rejected') {
                        showAlert('Your registration has been rejected. Please contact admin.', 'error');
                    } else {
                        showAlert('Account not found. Please register first.', 'error');
                    }
                } else {
                    showAlert('Access denied. Employee login only.', 'error');
                }
            } else {
                showAlert(data.message || 'Login failed', 'error');
            }
        } catch (error) {
            console.error('Employee login error:', error);

            showAlert(
                error.message || 'Unable to connect to the server.',
                'error'
            );
        } finally {
        btnText.style.display = 'inline';
        btnSpinner.style.display = 'none';
    }
});
});

function validateIdentifier(identifier) {
    const identifierError = document.getElementById('identifierError');
    const identifierInput = document.getElementById('identifier');

    if (!identifier) {
        identifierError.textContent = 'Employee ID is required';
        identifierError.classList.add('show');
        identifierInput.classList.add('error');
        return false;
    }

    identifierError.textContent = '';
    identifierError.classList.remove('show');
    identifierInput.classList.remove('error');
    identifierInput.classList.add('success');
    return true;
}

function validatePassword(password) {
    const passwordError = document.getElementById('passwordError');
    const passwordInput = document.getElementById('password');

    if (!password) {
        passwordError.textContent = 'Password is required';
        passwordError.classList.add('show');
        passwordInput.classList.add('error');
        return false;
    }

    if (password.length < 6) {
        passwordError.textContent = 'Password must be at least 6 characters';
        passwordError.classList.add('show');
        passwordInput.classList.add('error');
        return false;
    }

    passwordError.textContent = '';
    passwordError.classList.remove('show');
    passwordInput.classList.remove('error');
    passwordInput.classList.add('success');
    return true;
}

function showAlert(message, type) {
    const alertContainer = document.getElementById('alertContainer');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} fade-in`;
    alert.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
            ${type === 'success'
            ? '<polyline points="20 6 9 17 4 12"></polyline>'
            : type === 'warning'
                ? '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>'
                : '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>'
        }
        </svg>
        ${message}
    `;
    alertContainer.innerHTML = '';
    alertContainer.appendChild(alert);

    setTimeout(() => {
        alert.remove();
    }, 5000);
}
