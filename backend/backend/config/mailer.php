<?php
/* SMTP Configuration - Edit these values to enable email sending */
$smtp_config = [
    'host' => 'smtp.gmail.com',           // SMTP server host
    'port' => 587,                          // SMTP port (587 for TLS, 465 for SSL)
    'username' => 'metamindshr@gmail.com',  // SMTP username (usually your email)
    'password' => 'jaoz esjn rguz ieyp',     // SMTP password (use app-specific password for Gmail)
    'encryption' => 'tls',                 // 'tls' or 'ssl'
    'from_email' => 'metamindshr@gmail.com', // From email address
    'from_name' => 'META MINDS HR'          // From name
];

/* Configure SMTP outside source control with META_MINDS_SMTP_HOST, _PORT,
 * _USERNAME, _PASSWORD, _ENCRYPTION (tls/ssl), and META_MINDS_MAIL_FROM. */
function meta_minds_send_email($to, $subject, $html) {
    global $smtp_config;
    
    // Try environment variables first, then use config array
    $host = getenv('META_MINDS_SMTP_HOST') ?: $smtp_config['host'];
    $username = getenv('META_MINDS_SMTP_USERNAME') ?: $smtp_config['username'];
    $password = getenv('META_MINDS_SMTP_PASSWORD') ?: $smtp_config['password'];
    $from = getenv('META_MINDS_MAIL_FROM') ?: $smtp_config['from_email'];
    $from_name = getenv('META_MINDS_MAIL_FROM_NAME') ?: $smtp_config['from_name'];
    $port = (int)(getenv('META_MINDS_SMTP_PORT') ?: $smtp_config['port']);
    $encryption = strtolower(getenv('META_MINDS_SMTP_ENCRYPTION') ?: $smtp_config['encryption']);
    
    // Log SMTP configuration for debugging
    error_log("SMTP Config - Host: $host, Port: $port, User: $username, Encryption: $encryption");
    
    // Check if SMTP is configured
    if ($host === 'smtp.gmail.com' && $username === 'your-email@gmail.com') {
        error_log("SMTP not configured - using placeholder values");
        return ['success' => false, 'message' => 'SMTP not configured. Please edit backend/config/mailer.php with your SMTP credentials.'];
    }
    
    if (!$host || !$username || !$password) {
        error_log("SMTP credentials missing");
        return ['success' => false, 'message' => 'SMTP is not configured on this server.'];
    }
    
    // Check if OpenSSL is available for TLS/SSL
    if ($encryption === 'tls' || $encryption === 'ssl') {
        if (!extension_loaded('openssl')) {
            error_log("OpenSSL extension not loaded - required for TLS/SSL");
            return ['success' => false, 'message' => 'OpenSSL extension is required for TLS/SSL but is not loaded.'];
        }
    }
    
    error_log("Attempting SMTP connection to $host:$port");
    $socket = @stream_socket_client(($encryption === 'ssl' ? 'ssl://' : 'tcp://') . "$host:$port", $errno, $error, 12);
    if (!$socket) {
        error_log("SMTP connection failed: $error (errno: $errno)");
        return ['success' => false, 'message' => "SMTP connection failed: $error (Error code: $errno)"];
    }
    stream_set_timeout($socket, 12);
    $read = function () use ($socket) { $response = ''; while (($line = fgets($socket, 515)) !== false) { $response .= $line; if (preg_match('/^\d{3} /', $line)) break; } return $response; };
    $command = function ($line, $expected) use ($socket, $read) { fwrite($socket, "$line\r\n"); $response = $read(); return preg_match('/^(' . $expected . ')/m', $response) ? null : $response; };
    $failure = preg_match('/^220/m', $read()) ? null : 'SMTP greeting failed';
    if ($failure) error_log("SMTP greeting failed");
    if (!$failure) $failure = $command('EHLO metaminds.local', '250');
    if ($failure) error_log("EHLO failed: $failure");
    if (!$failure && $encryption === 'tls') { 
        $failure = $command('STARTTLS', '220'); 
        if ($failure) error_log("STARTTLS failed: $failure");
        if (!$failure && !stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
            $failure = 'Unable to enable TLS'; 
            error_log("TLS enable failed");
        }
        if (!$failure) $failure = $command('EHLO metaminds.local', '250');
        if ($failure) error_log("Post-TLS EHLO failed: $failure");
    }
    if (!$failure) $failure = $command('AUTH LOGIN', '334');
    if ($failure) error_log("AUTH LOGIN failed: $failure");
    if (!$failure) $failure = $command(base64_encode($username), '334');
    if ($failure) error_log("Username auth failed: $failure");
    if (!$failure) $failure = $command(base64_encode($password), '235');
    if ($failure) error_log("Password auth failed: $failure");
    if (!$failure) $failure = $command("MAIL FROM:<$from>", '250');
    if ($failure) error_log("MAIL FROM failed: $failure");
    if (!$failure) $failure = $command("RCPT TO:<$to>", '250');
    if ($failure) error_log("RCPT TO failed: $failure");
    if (!$failure) $failure = $command('DATA', '354');
    if ($failure) error_log("DATA command failed: $failure");
    if (!$failure) {
        $headers = "From: $from_name <$from>\r\nTo: <$to>\r\nSubject: =?UTF-8?B?" . base64_encode($subject) . "?=\r\nMIME-Version: 1.0\r\nContent-Type: text/html; charset=UTF-8\r\nContent-Transfer-Encoding: base64";
        fwrite($socket, $headers . "\r\n\r\n" . chunk_split(base64_encode($html)) . "\r\n.\r\n");
        $failure = preg_match('/^250/m', $read()) ? null : 'SMTP refused the message';
        if ($failure) error_log("Message delivery failed: $failure");
    }
    @fwrite($socket, "QUIT\r\n"); fclose($socket);
    
    if ($failure) {
        error_log("SMTP delivery failed: " . trim($failure));
        return ['success' => false, 'message' => 'SMTP delivery failed: ' . trim($failure)];
    } else {
        error_log("Email sent successfully to $to");
        return ['success' => true];
    }
}
?>
