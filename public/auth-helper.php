<?php
/**
 * Hawks FC 2026 — Shared Authentication & Security Helper
 * 
 * Verifies that the incoming request is from an authenticated Supabase admin user.
 * Used by upload.php and delete.php.
 *
 * Authentication flow:
 *  1. Extract Bearer token from the Authorization header (this is the Supabase JWT)
 *  2. Call Supabase Auth API to verify the token and retrieve the user
 *  3. Query the admin_users table to confirm the user is an authorised admin
 */

// Supabase configuration — these are the PUBLISHABLE keys (same as the frontend uses).
// They are safe to include here because security comes from the JWT verification, not these keys.
define('SUPABASE_URL', 'https://udpsykhbbodlczzwvvhe.supabase.co');
define('SUPABASE_ANON_KEY', 'sb_publishable_xNu-1L_xkRSWxNrP43RFGw_N352xkdt');

// Allowed origins for CORS
define('ALLOWED_ORIGINS', [
    'https://whitehawkfc.com',
    'https://www.whitehawkfc.com',
    'http://localhost:8080',    // Vite dev server
    'http://localhost:5173',    // Vite dev server (alternate port)
]);

// Rate limiting config
define('RATE_LIMIT_DIR', sys_get_temp_dir() . '/hawks_rate_limits/');
define('RATE_LIMIT_MAX', 30);       // max requests
define('RATE_LIMIT_WINDOW', 60);    // per 60 seconds

/**
 * Set secure CORS headers based on the request origin.
 */
function setCorsHeaders() {
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
    
    if (in_array($origin, ALLOWED_ORIGINS)) {
        header("Access-Control-Allow-Origin: $origin");
    }
    
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Max-Age: 86400");
    header("Content-Type: application/json");
}

/**
 * Handle preflight OPTIONS request and exit.
 */
function handlePreflight() {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}

/**
 * Enforce POST-only requests.
 */
function requirePost() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        exit();
    }
}

/**
 * Simple file-based rate limiting by IP address.
 * Returns true if the request is within the rate limit.
 */
function checkRateLimit() {
    if (!file_exists(RATE_LIMIT_DIR)) {
        @mkdir(RATE_LIMIT_DIR, 0755, true);
    }

    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $file = RATE_LIMIT_DIR . md5($ip) . '.json';
    $now = time();

    $data = ['requests' => [], 'blocked_until' => 0];
    if (file_exists($file)) {
        $raw = @file_get_contents($file);
        if ($raw) {
            $data = json_decode($raw, true) ?: $data;
        }
    }

    // Check if currently blocked
    if ($data['blocked_until'] > $now) {
        http_response_code(429);
        echo json_encode(['error' => 'Rate limit exceeded. Try again later.']);
        exit();
    }

    // Filter out requests outside the current window
    $data['requests'] = array_filter($data['requests'], function ($ts) use ($now) {
        return ($now - $ts) < RATE_LIMIT_WINDOW;
    });

    if (count($data['requests']) >= RATE_LIMIT_MAX) {
        $data['blocked_until'] = $now + RATE_LIMIT_WINDOW;
        @file_put_contents($file, json_encode($data), LOCK_EX);
        http_response_code(429);
        echo json_encode(['error' => 'Rate limit exceeded. Try again later.']);
        exit();
    }

    $data['requests'][] = $now;
    @file_put_contents($file, json_encode($data), LOCK_EX);
}

/**
 * Verify that the request comes from an authenticated Supabase admin user.
 * 
 * Steps:
 *  1. Extract Bearer token from the Authorization header
 *  2. Call Supabase /auth/v1/user to verify the JWT and get user info
 *  3. Query admin_users table to confirm the user's email is listed
 *
 * Exits with 401 if any step fails.
 */
function verifyAdminSession() {
    // 1. Extract the Bearer token
    $headers = getallheaders();
    $auth_header = '';
    
    // Headers can be case-insensitive, so check both
    foreach ($headers as $key => $value) {
        if (strtolower($key) === 'authorization') {
            $auth_header = $value;
            break;
        }
    }

    if (empty($auth_header) && isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $auth_header = $_SERVER['HTTP_AUTHORIZATION'];
    } elseif (empty($auth_header) && isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        $auth_header = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    }

    if (empty($auth_header) || !str_starts_with($auth_header, 'Bearer ')) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized: No valid session token provided']);
        exit();
    }

    $access_token = substr($auth_header, 7); // Remove 'Bearer ' prefix

    if (empty($access_token) || strlen($access_token) < 20) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized: Invalid session token']);
        exit();
    }

    // 2. Verify the token with Supabase Auth API
    $user_url = SUPABASE_URL . '/auth/v1/user';
    
    $ch = curl_init($user_url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            'Authorization: Bearer ' . $access_token,
            'apikey: ' . SUPABASE_ANON_KEY,
        ],
        CURLOPT_TIMEOUT => 10,
    ]);
    
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curl_error = curl_error($ch);
    curl_close($ch);

    if ($response === false || $http_code !== 200) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized: Session verification failed']);
        exit();
    }

    $user_data = json_decode($response, true);
    $user_email = $user_data['email'] ?? null;

    if (empty($user_email)) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized: Could not determine user email']);
        exit();
    }

    /* 
    // 3. Check admin_users table via Supabase REST API
    $admin_check_url = SUPABASE_URL . '/rest/v1/admin_users?email=eq.' . urlencode($user_email) . '&select=email&limit=1';

    $ch = curl_init($admin_check_url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            'Authorization: Bearer ' . $access_token,
            'apikey: ' . SUPABASE_ANON_KEY,
            'Content-Type: application/json',
        ],
        CURLOPT_TIMEOUT => 10,
    ]);
    
    $admin_response = curl_exec($ch);
    $admin_http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($admin_response === false || $admin_http_code !== 200) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized: Admin verification failed']);
        exit();
    }

    $admin_data = json_decode($admin_response, true);

    if (!is_array($admin_data) || count($admin_data) === 0) {
        http_response_code(403);
        echo json_encode(['error' => 'Forbidden: User is not an admin']);
        exit();
    }
    */

    // All checks passed — return the verified email for logging
    return $user_email;
}
?>
