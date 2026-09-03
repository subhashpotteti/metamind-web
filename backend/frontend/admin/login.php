<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login - META MINDS PVT LTD</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <link rel="icon" type="image/png" href="../assets/images/meta_minds_logo.png">
</head>
<body>
    <div class="login-page">
        <div class="login-container">
            <div class="logo-container">
                <img class="company-logo company-logo-auth" src="../assets/images/meta_minds_logo.png" alt="META MINDS PVT LTD">
            </div>
            
            <div class="login-header">
                <h2>Admin Login</h2>
                <p>Access your admin dashboard</p>
            </div>
            
            <form id="loginForm">
                <div class="form-group">
                    <label class="form-label">Phone Number</label>
                    <input type="tel" class="form-control" id="phone" placeholder="Enter your phone number" maxlength="10" autocomplete="tel" required>
                    <div class="error-message" id="phoneError"></div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Password</label>
                    <input type="password" class="form-control" id="password" placeholder="Enter your password" autocomplete="current-password" required>
                    <div class="error-message" id="passwordError"></div>
                </div>
                
                <div id="alertContainer"></div>
                
                <button type="submit" class="btn btn-primary btn-lg" style="width: 100%;">
                    <span id="btnText">Login</span>
                    <span id="btnSpinner" class="spinner" style="display: none;"></span>
                </button>
            </form>
            
            <div style="text-align: center; margin-top: 1.5rem;">
                <a href="../employee/login.php" style="color: var(--primary); text-decoration: none; font-weight: 500;">Employee Login</a>
            </div>
        </div>
    </div>
    
    <script src="../assets/js/admin-login.js"></script>
</body>
</html>

