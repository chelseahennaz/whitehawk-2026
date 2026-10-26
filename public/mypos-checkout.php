<?php
/**
 * myPOS IPC (Internet Payment Checkout) Handler
 * Whitehawk FC Shop
 *
 * Receives a JSON POST from the React cart drawer, builds a signed
 * myPOS IPC Purchase request, and outputs a self-submitting HTML form
 * that redirects the customer to the myPOS hosted payment page.
 *
 * Docs: https://developers.mypos.com/en/doc/ipc
 */

// ─── CORS ────────────────────────────────────────────────────────────────────
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// ─── CONFIGURATION ──────────────────────────────────────────────────────────
// !! Fill these in from your myPOS Merchant Dashboard before going live !!
define('MYPOS_SID',        '1425995');      // Store ID
define('MYPOS_WALLET',     '40977681150'); // Wallet / Account number
define('MYPOS_KEY_INDEX',  4);                    // Key index from API pack
define('MYPOS_CURRENCY',   826);                  // ISO 4217 numeric — 826 = GBP
define('MYPOS_IPC_VERSION','1.4');
define('MYPOS_LANG',       'EN');

// Production checkout URL:
define('MYPOS_URL', 'https://www.mypos.com/vmp/checkout/');

// Paths
define('PRIVATE_KEY_PATH', __DIR__ . '/keys/store_private_key.pem');

// Return URLs (must be HTTPS in production)
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host     = $_SERVER['HTTP_HOST'];
$base     = $protocol . '://' . $host;
define('URL_OK',     $base . '/mypos-success.php');
define('URL_CANCEL', $base . '/mypos-cancel.php');
define('URL_NOTIFY', $base . '/mypos-notify.php');

// ─── READ CART FROM REQUEST BODY ────────────────────────────────────────────
$input = json_decode(file_get_contents('php://input'), true);

if (empty($input['items']) || !is_array($input['items'])) {
    http_response_code(400);
    echo json_encode(['error' => 'No cart items provided']);
    exit();
}

$cartItems = $input['items'];
$numItems  = count($cartItems);

// ─── BUILD CART ITEM PARAMETERS ─────────────────────────────────────────────
// myPOS IPC uses Article_1, Quantity_1, Price_1, Amount_1, Currency_1 etc.
$itemParams = [];
$grandTotal = 0.00;

foreach ($cartItems as $idx => $item) {
    $n         = $idx + 1;
    $unitPrice = round((float)$item['price'], 2);
    $qty       = max(1, (int)($item['quantity'] ?? 1));
    $lineTotal = round($unitPrice * $qty, 2);
    $grandTotal += $lineTotal;

    // Sanitise article name (max 127 chars, alphanumeric + space)
    $articleName = substr(preg_replace('/[^a-zA-Z0-9 \-_]/', '', $item['name']), 0, 127);
    if ($item['size'] && strtolower($item['size']) !== 'one size') {
        $articleName .= ' (' . $item['size'] . ')';
        $articleName = substr($articleName, 0, 127);
    }

    $itemParams["Article_{$n}"]  = $articleName;
    $itemParams["Quantity_{$n}"] = $qty;
    $itemParams["Price_{$n}"]    = number_format($unitPrice, 2, '.', '');
    $itemParams["Amount_{$n}"]   = number_format($lineTotal, 2, '.', '');
    $itemParams["Currency_{$n}"] = MYPOS_CURRENCY;
}

$grandTotal = number_format($grandTotal, 2, '.', '');

// Generate a unique Order ID
$orderId = 'WHF-' . strtoupper(substr(uniqid(), -8));

// Capture optional email for order tracking
$email = $input['email'] ?? '';
// Log order creation with email for auditing
file_put_contents(__DIR__ . '/mypos_orders.log', date('Y-m-d H:i:s') . " | Order: {$orderId} | Email: {$email}\n", FILE_APPEND | LOCK_EX);

// ─── BUILD FULL PARAMETER ARRAY (IPC order matters for signature) ────────────
$params = array_merge([
    'IPCmethod'    => 'IPCPurchase',
    'IPCVersion'   => MYPOS_IPC_VERSION,
    'IPClang'      => MYPOS_LANG,
    'SID'          => MYPOS_SID,
    'WalletNumber' => MYPOS_WALLET,
    'KeyIndex'     => MYPOS_KEY_INDEX,
    'Amount'       => $grandTotal,
    'IPCmethod'     => 'IPCPurchase',
    'IPCVersion'    => MYPOS_IPC_VERSION,
    'IPClang'       => MYPOS_LANG,
    'SID'           => MYPOS_SID,
    'WalletNumber'  => MYPOS_WALLET,
    'KeyIndex'      => MYPOS_KEY_INDEX,
    'Amount'        => $grandTotal,
    'Currency'      => MYPOS_CURRENCY,
    'OrderID'       => $orderId,
    'URL_OK'        => URL_OK,
    'URL_Cancel'    => URL_CANCEL,
    'URL_Notify'    => URL_NOTIFY,
    'CartItems'     => $numItems,
    'CustomerEmail' => $email,
], $itemParams);

// ─── SIGN THE REQUEST ────────────────────────────────────────────────────────
$privateKeyPem = file_get_contents(PRIVATE_KEY_PATH);
if (!$privateKeyPem) {
    http_response_code(500);
    echo json_encode(['error' => 'Checkout configuration error (key missing)']);
    exit();
}

$privateKey = openssl_pkey_get_private($privateKeyPem);
if (!$privateKey) {
    http_response_code(500);
    echo json_encode(['error' => 'Checkout configuration error (key invalid)']);
    exit();
}

// Concatenate all parameter VALUES with '-', base64 encode, then sign with SHA-256
$signatureData = base64_encode(implode('-', array_values($params)));
$signature     = '';
openssl_sign($signatureData, $signature, $privateKey, OPENSSL_ALGO_SHA256);
$params['Signature'] = base64_encode($signature);

// ─── OUTPUT: Return the checkout URL + params for React to POST ──────────────
// We return JSON so the React front-end can show a loading state then redirect.
// The frontend builds a hidden form and submits it so the browser does a real POST
// to myPOS (required — myPOS will not accept GET redirects).

header('Content-Type: application/json');
echo json_encode([
    'url'    => MYPOS_URL,
    'params' => $params,
    'order'  => $orderId,
]);
