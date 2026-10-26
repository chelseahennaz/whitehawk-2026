<?php
/**
 * Hawks FC 2026 — Secure Image Deletion Handler for IONOS
 * 
 * Accepts POST requests with a filename to delete.
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

// Get JSON input
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, TRUE);

if (!isset($input['filename']) || empty(trim($input['filename']))) {
    http_response_code(400);
    echo json_encode(['error' => 'No filename provided']);
    exit();
}

$filename = trim($input['filename']);

// Basic security check to prevent obvious directory traversal attempts
if (strpos($filename, '..') !== false || strpos($filename, '/') !== false || strpos($filename, '\\') !== false) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid filename']);
    exit();
}

$upload_dir = realpath(__DIR__ . '/uploads');

if (!$upload_dir) {
    // If the uploads directory doesn't exist, there's nothing to delete
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'File not found, assumed deleted']);
    exit();
}

// Construct the full path and get the realpath
$target_path = $upload_dir . DIRECTORY_SEPARATOR . $filename;
$real_target_path = realpath($target_path);

// Security Check: Make sure the file exists and is actually inside the uploads directory
if ($real_target_path && strpos($real_target_path, $upload_dir) === 0) {
    if (unlink($real_target_path)) {
        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'File deleted successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete file. Check permissions.']);
    }
} else {
    // Return 200 even if not found to handle idempotency (e.g. double clicks, retries)
    // and don't reveal existence/non-existence of files outside the directory.
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'File not found, assumed deleted']);
}
?>
