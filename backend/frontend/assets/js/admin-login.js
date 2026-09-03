// Admin Login JavaScript
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const phoneInput = document.getElementById('phone');
    const passwordInput = document.getElementById('password');
    const btnText = document.getElementById('btnText');
    const btnSpinner = document.getElementById('btnSpinner');

    // Real-time validation
    phoneInput.addEventListener('input', function () {
        validatePhone(this.value);
    });

    passwordInput.addEventListener('input', function () {
        validatePassword(this.value);
    });

    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const phone = phoneInput.value.trim();
        const password = passwordInput.value.trim();

        // Validate
        const phoneValid = validatePhone(phone);
        const passwordValid = validatePassword(password);

        if (!phoneValid || !passwordValid) {
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
                body: JSON.stringify({
                    identifier: phone,
                    password: password,
                    role: 'admin'
                })
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

            // const data = await response.json();

            if (data.success) {
                if (data.user.role === 'admin') {
                    localStorage.setItem('adminUser', JSON.stringify(data.user));
                    showAlert('Login successful! Redirecting...', 'success');
                    setTimeout(() => {
                        window.location.href = 'dashboard.php';
                    }, 1000);
                } else {
                    showAlert('Access denied. Admin only.', 'error');
                }
            } else {
                showAlert(data.message || 'Login failed', 'error');
            }
        } catch (error) {
            console.error('Admin login error:', error);

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

function validatePhone(phone) {
    const phoneError = document.getElementById('phoneError');
    const phoneInput = document.getElementById('phone');

    if (!phone) {
        phoneError.textContent = 'Phone number is required';
        phoneError.classList.add('show');
        phoneInput.classList.add('error');
        return false;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
        phoneError.textContent = 'Phone number must be 10 digits';
        phoneError.classList.add('show');
        phoneInput.classList.add('error');
        return false;
    }

    phoneError.textContent = '';
    phoneError.classList.remove('show');
    phoneInput.classList.remove('error');
    phoneInput.classList.add('success');
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
