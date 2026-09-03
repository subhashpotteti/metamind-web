<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Check for photo upload
    if (isset($_FILES['photo'])) {
        $file = $_FILES['photo'];
        $field_name = 'photo';
    } 
    // Check for document upload
    elseif (isset($_FILES['file'])) {
        $file = $_FILES['file'];
        $field_name = 'file';
    } 
    else {
        echo json_encode(['success' => false, 'message' => 'No file uploaded']);
        exit;
    }
    
    // Validate file
    $allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
    $max_size = 5 * 1024 * 1024; // 5MB
    
    if (!in_array($file['type'], $allowed_types)) {
        echo json_encode(['success' => false, 'message' => 'Invalid file type. Only JPG, PNG, GIF, and PDF allowed']);
        exit;
    }
    
    if ($file['size'] > $max_size) {
        echo json_encode(['success' => false, 'message' => 'File size too large. Maximum 5MB allowed']);
        exit;
    }
    
    // Generate unique filename
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid() . '_' . time() . '.' . $extension;
    $upload_path = '../uploads/' . $filename;
    
    // Create uploads directory if it doesn't exist
    if (!is_dir('../uploads')) {
        mkdir('../uploads', 0777, true);
    }
    
    if (move_uploaded_file($file['tmp_name'], $upload_path)) {
        echo json_encode([
            'success' => true,
            'message' => 'File uploaded successfully',
            'filename' => $filename,
            'file_path' => 'uploads/' . $filename,
            'path' => 'uploads/' . $filename
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to upload file']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>
