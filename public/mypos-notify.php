<?php
/**
 * myPOS IPC Notification Handler (Webhook)
 * Whitehawk FC Shop
 *
 * myPOS POSTs the payment result to this URL after every transaction
 * (successful, declined, or cancelled). We verify the signature and
 * can use this to update order status in a database if needed.
 */

define('PRIVATE_KEY_PATH', __DIR__ . '/keys/store_private_key.pem');
define('PUBLIC_CERT_PATH', __DIR__ . '/keys/store_public_cert.pem');

// Respond with HTTP 200 immediately so myPOS knows we received the notification.
// Process the result after.
$data = $_POST;

if (empty($data)) {
    http_response_code(400);
    exit();
}

// Extract signature before verifying
$receivedSignature = base64_decode($data['Signature'] ?? '');
unset($data['Signature']);

// Re-build the signed string (same order as what myPOS signed)
$signatureData = base64_encode(implode('-', array_values($data)));

// Verify using the PUBLIC key in our certificate
$pubCertPem = file_get_contents(PUBLIC_CERT_PATH);
$pubKey     = openssl_pkey_get_public($pubCertPem);

$verified = openssl_verify($signatureData, $receivedSignature, $pubKey, OPENSSL_ALGO_SHA256);

if ($verified === 1) {
    $status  = $data['OrderStatus'] ?? 'unknown';
    $orderId = $data['OrderID']     ?? 'unknown';
    $amount  = $data['Amount']      ?? '0.00';

    // Log the result (you can replace this with a database write)
    $logLine = date('Y-m-d H:i:s') . " | Order: {$orderId} | Status: {$status} | Amount: £{$amount}" . PHP_EOL;
    file_put_contents(__DIR__ . '/mypos_orders.log', $logLine, FILE_APPEND | LOCK_EX);
}

http_response_code(200);
echo 'OK';
