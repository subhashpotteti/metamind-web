# META MINDS PVT LTD - HR Management System

A comprehensive HR management system with admin and employee panels, featuring registration management, attendance tracking, and email notifications.

## Features

### Admin Panel
- **Dashboard**: Real-time statistics on employees, pending requests, and attendance
- **Registration Management**: View, approve, or reject employee registration requests
- **Employee Management**: View all approved employees with their details
- **Attendance Tracking**: Monitor daily attendance records for all employees
- **Email Notifications**: Automatic email notifications for registration status changes

### Employee Panel
- **Registration**: Comprehensive registration form with live photo upload
- **Dashboard**: Real-time clock, check-in/check-out functionality
- **Attendance History**: View personal attendance records
- **Profile Management**: View and manage personal profile information
- **Email Notifications**: Receive email updates on registration status

### Key Features
- **Ultra-Premium UI**: Modern, responsive design with gradient backgrounds and smooth animations
- **Real-Time Validation**: Instant form validation with error messages
- **Photo Upload**: Drag-and-drop photo upload with preview
- **Attendance Management**: Check-in/check-out with automatic time tracking
- **Email Notifications**: Hostinger mail format for professional email communication
- **Secure Authentication**: Phone number and password-based login
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

### Backend
- **PHP**: Server-side logic and API endpoints
- **MySQL**: Database management
- **RESTful API**: JSON-based API for frontend communication

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Custom ultra-premium styling with CSS variables
- **JavaScript (Vanilla)**: Client-side logic and API interactions
- **LocalStorage**: Session management

## Installation

### Prerequisites
- XAMPP/WAMP/MAMP (or any PHP server with MySQL)
- PHP 7.4 or higher
- MySQL 5.7 or higher
- Modern web browser

### Setup Instructions

1. **Clone/Download the Project**
   ```bash
   Copy the project files to: C:\xampp\htdocs\meta_camp\
   ```

2. **Database Setup**
   - Open phpMyAdmin (http://localhost/phpmyadmin)
   - Create a new database named `meta_minds_hrm`
   - Import the SQL schema from `backend/config/schema.sql`
   - Or run the SQL commands manually from the schema file

3. **Configure Database Connection**
   - Open `backend/config/database.php`
   - Update the database credentials if needed:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_USER', 'root');
   define('DB_PASS', '');
   define('DB_NAME', 'meta_minds_hrm');
   ```

4. **Configure Email Settings**
   - Open `backend/api/register.php` and `backend/api/admin.php`
   - Uncomment the `mail()` function calls to enable actual email sending
   - Update the email configuration in the PHP `mail()` function parameters
   - For Hostinger mail, configure your SMTP settings in php.ini

5. **Set File Permissions**
   - Ensure the `backend/uploads` directory has write permissions
   - On Windows, this is usually automatic
   - On Linux/Mac: `chmod 755 backend/uploads`

6. **Start the Server**
   - Start Apache and MySQL from XAMPP control panel
   - Access the application via browser

## Default Credentials

### Admin Account
- **Phone**: 9999999999
- **Password**: admin123

### Employee Account
- Employees must register first through the registration form
- After registration, wait for admin approval
- Once approved, login with registered phone and password

## Access URLs

### Admin Panel
- **Login**: http://localhost/meta_camp/frontend/admin/login.html
- **Dashboard**: http://localhost/meta_camp/frontend/admin/dashboard.html

### Employee Panel
- **Login**: http://localhost/meta_camp/frontend/employee/login.html
- **Registration**: http://localhost/meta_camp/frontend/employee/register.html
- **Dashboard**: http://localhost/meta_camp/frontend/employee/dashboard.html

## Project Structure

```
meta_camp/
├── backend/
│   ├── api/
│   │   ├── login.php           # User authentication
│   │   ├── register.php        # Employee registration
│   │   ├── upload.php          # Photo upload
│   │   ├── attendance.php      # Attendance management
│   │   └── admin.php           # Admin operations
│   ├── config/
│   │   ├── database.php       # Database connection
│   │   └── schema.sql         # Database schema
│   └── uploads/               # Uploaded photos
├── frontend/
│   ├── admin/
│   │   ├── login.html         # Admin login page
│   │   └── dashboard.html     # Admin dashboard
│   ├── employee/
│   │   ├── login.html         # Employee login page
│   │   ├── register.html      # Employee registration
│   │   └── dashboard.html     # Employee dashboard
│   └── assets/
│       ├── css/
│       │   └── style.css      # Ultra-premium styles
│       ├── js/
│       │   ├── admin-login.js
│       │   ├── admin-dashboard.js
│       │   ├── employee-login.js
│       │   ├── employee-register.js
│       │   └── employee-dashboard.js
│       └── images/             # Static images
└── README.md
```

## Database Schema

### Tables
- **users**: User authentication (phone, password, role)
- **employees**: Approved employee details
- **registration_requests**: Pending registration requests
- **attendance**: Employee attendance records
- **email_logs**: Email notification logs

## API Endpoints

### Authentication
- `POST /backend/api/login.php` - User login

### Registration
- `POST /backend/api/register.php` - Submit registration
- `POST /backend/api/upload.php` - Upload photo

### Attendance
- `POST /backend/api/attendance.php` - Check-in/Check-out
- `GET /backend/api/attendance.php?employee_id=X` - Get attendance records

### Admin
- `GET /backend/api/admin.php?action=get_dashboard_stats` - Dashboard statistics
- `GET /backend/api/admin.php?action=get_requests` - Pending requests
- `GET /backend/api/admin.php?action=get_all_requests` - All requests
- `GET /backend/api/admin.php?action=get_employees` - All employees
- `GET /backend/api/admin.php?action=get_attendance&date=X` - Attendance records
- `POST /backend/api/admin.php` - Approve/Reject requests

## Email Configuration

To enable email notifications:

1. **Configure PHP Mail**
   - Edit `php.ini` file
   - Set SMTP settings for your email provider

2. **For Hostinger Mail**
   ```ini
   SMTP = smtp.hostinger.com
   smtp_port = 587
   sendmail_from = noreply@metaminds.com
   ```

3. **Uncomment Mail Functions**
   - In `backend/api/register.php` and `backend/api/admin.php`
   - Uncomment the `mail()` function calls at the bottom of email functions

## Features in Detail

### Real-Time Validation
- Phone number validation (10 digits)
- Email format validation
- Password strength validation
- Age validation (18-65 years)
- Required field validation
- Instant error feedback

### Attendance System
- Check-in with timestamp
- Check-out with timestamp
- Automatic total hours calculation
- Daily attendance tracking
- Attendance history view

### Registration Workflow
1. Employee fills registration form
2. Uploads live photo
3. Submits registration
4. Email sent to admin and employee
5. Admin reviews request
6. Admin approves/rejects
7. Email notification sent
8. Employee can login if approved

## Security Features
- Password hashing using PHP's `password_hash()`
- SQL injection prevention using prepared statements
- XSS protection through proper output encoding
- Session-based authentication
- Role-based access control

## Customization

### Logo
- Replace the SVG logo in HTML files with your company logo
- Update logo dimensions in CSS if needed

### Colors
- Modify CSS variables in `frontend/assets/css/style.css`:
  ```css
  :root {
      --primary: #667eea;
      --secondary: #764ba2;
      /* ... other colors */
  }
  ```

### Email Templates
- Edit email HTML in `backend/api/register.php` and `backend/api/admin.php`
- Customize the email body, subject, and styling

## Troubleshooting

### Database Connection Error
- Verify MySQL is running
- Check database credentials in `database.php`
- Ensure database `meta_minds_hrm` exists

### Photo Upload Not Working
- Check `backend/uploads` directory permissions
- Verify PHP file upload settings in `php.ini`
- Ensure `upload_max_filesize` and `post_max_size` are sufficient

### Email Not Sending
- Verify SMTP configuration in `php.ini`
- Check if `mail()` function is enabled
- Uncomment the `mail()` function calls in PHP files
- Test with a simple PHP mail script

### Login Issues
- Clear browser localStorage
- Verify user exists in database
- Check password hash matches
- Ensure user role is correct

## Browser Compatibility
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Opera

## Support
For issues or questions, please contact the development team.

## License
© 2026 META MINDS PVT LTD. All rights reserved.
