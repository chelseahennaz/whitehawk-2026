<?php
// A simple proxy to safely bypass CORS for the Football Web Pages API
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: FWP-API-Key, Accept, Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request from React
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get the requested endpoint path
$endpoint = isset($_GET['endpoint']) ? $_GET['endpoint'] : '';
if (!$endpoint) {
    http_response_code(400);
    echo json_encode(['error' => 'No endpoint provided']);
    exit();
}

// --- Server-side caching ---
// Cache FWP responses for 60 seconds to reduce load on FWP and speed up repeat requests.
// Strip the client-side cache-buster param (_t=...) so the cache key is stable.
$cacheEndpoint = preg_replace('/[&?]_t=\d+/', '', $endpoint);
$cacheDir = sys_get_temp_dir() . '/fwp_cache';
if (!is_dir($cacheDir)) {
    @mkdir($cacheDir, 0755, true);
}
$cacheFile = $cacheDir . '/' . md5($cacheEndpoint) . '.json';
$cacheTTL = 60; // seconds

if (file_exists($cacheFile) && (time() - filemtime($cacheFile)) < $cacheTTL) {
    // Serve from cache
    echo file_get_contents($cacheFile);
    exit();
}

$targetUrl = "https://api.footballwebpages.co.uk/v2/" . ltrim($endpoint, '/');

$headers = [];
// Automatically forward the API Key if the client provided it
if (isset($_SERVER['HTTP_FWP_API_KEY'])) {
    $headers[] = "FWP-API-Key: " . $_SERVER['HTTP_FWP_API_KEY'];
}
$headers[] = "Accept: application/json";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $targetUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 8);         // Hard timeout: 8 seconds
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 4);   // Connection timeout: 4 seconds

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if (curl_errno($ch)) {
    // If the live call fails but we have a stale cache, serve it
    if (file_exists($cacheFile)) {
        echo file_get_contents($cacheFile);
    } else {
        http_response_code(502);
        echo json_encode(['error' => 'FWP API unreachable: ' . curl_error($ch)]);
    }
} else if ($httpCode >= 200 && $httpCode < 300) {
    // Success — cache the response and serve it
    @file_put_contents($cacheFile, $response);
    echo $response;
} else {
    // Non-success HTTP status — serve stale cache if available
    if (file_exists($cacheFile)) {
        echo file_get_contents($cacheFile);
    } else {
        http_response_code($httpCode);
        echo $response;
    }
}

curl_close($ch);
?>
