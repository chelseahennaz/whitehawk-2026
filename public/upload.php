<?php
/**
 * Hawks FC 2026 — Secure Image Upload Handler for IONOS
 * 
 * Accepts multipart/form-data POST requests with an image file.
 * Authentication: Requires a valid Supabase admin session (JWT token).
 */

require_once __DIR__ . '/auth-helper.php';

// Security headers & CORS
setCorsHeaders();
handlePreflight();
requirePost();
checkRateLimit();

// Verify the user is an authenticated admin
$admin_email = verifyAdminSession();

// Configuration
$upload_dir = __DIR__ . '/uploads/';
$allowed_types = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
$max_size = 5 * 1024 * 1024; // 5MB limit

// Create uploads directory if it doesn't exist
if (!file_exists($upload_dir)) {
    mkdir($upload_dir, 0755, true);
}

// Validate file existence
if (!isset($_FILES['image'])) {
    http_response_code(400);
    echo json_encode(['error' => 'No image file provided']);
    exit();
}

$file = $_FILES['image'];

// Validate successful upload
if ($file['error'] !== UPLOAD_ERR_OK) {
    http_response_code(500);
    echo json_encode(['error' => 'File upload error code: ' . $file['error']]);
    exit();
}

// Validate file type using finfo (reads actual file bytes, not just the extension)
$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime_type = $finfo->file($file['tmp_name']);

if (!in_array($mime_type, $allowed_types)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid file type: ' . $mime_type . '. Only JPG, PNG, WEBP, and SVG are allowed.']);
    exit();
}

// Validate file size
if ($file['size'] > $max_size) {
    http_response_code(400);
    echo json_encode(['error' => 'File too large. Max size: 5MB.']);
    exit();
}

// Map MIME type to safe extension (ignore whatever extension the client sent)
$mime_to_ext = [
    'image/jpeg'    => 'jpg',
    'image/png'     => 'png',
    'image/webp'    => 'webp',
    'image/svg+xml' => 'svg',
];
$extension = $mime_to_ext[$mime_type] ?? 'bin';

// Generate a completely server-side filename (no client input used)
$new_filename = 'img_' . time() . '_' . bin2hex(random_bytes(6)) . '.' . $extension;
$target_path = $upload_dir . $new_filename;

// Move file to target directory
if (move_uploaded_file($file['tmp_name'], $target_path)) {
    // Construct the public URL
    $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
    $host = $_SERVER['HTTP_HOST'];
    $url = $protocol . "://" . $host . "/uploads/" . $new_filename;
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'url' => $url,
        'filename' => $new_filename,
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to move uploaded file. Check directory permissions.']);
}
?>
