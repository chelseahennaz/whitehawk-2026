<?php
/**
 * Social Media Crawler Meta Tag Handler
 * 
 * Detects Twitter/Facebook/LinkedIn crawlers and serves proper OG tags
 * with the post's featured image from Supabase, so shared links
 * show the correct preview card.
 */

// Supabase config
$supabaseUrl = 'https://udpsykhbbodlczzwvvhe.supabase.co';
$supabaseKey = 'sb_publishable_xNu-1L_xkRSWxNrP43RFGw_N352xkdt';

// Get the requested URI
$requestUri = $_SERVER['REQUEST_URI'] ?? '';

// Extract the slug from /news/{slug}
$slug = '';
if (preg_match('#^/news/([a-zA-Z0-9\-_]+)#', $requestUri, $matches)) {
    $slug = $matches[1];
}

// If no slug found, serve the default index.html
if (empty($slug)) {
    serveIndex();
    exit;
}

// Fetch post data from Supabase
$post = fetchPost($supabaseUrl, $supabaseKey, $slug);

if (!$post) {
    serveIndex();
    exit;
}

// Build the meta tags and serve them
$title = htmlspecialchars($post['title'] ?? 'Whitehawk FC', ENT_QUOTES, 'UTF-8');
$excerpt = htmlspecialchars($post['excerpt'] ?? 'Welcome to the official Whitehawk Football Club website.', ENT_QUOTES, 'UTF-8');
$imageUrl = $post['image_url'] ?? '';
$postUrl = 'https://whitehawkfc.com/news/' . $slug;
$siteName = 'Whitehawk FC | Official Website';

// Read index.html and inject OG tags
$indexHtml = file_get_contents(__DIR__ . '/index.html');

// Build replacement meta tags
$metaTags = <<<HTML
    <title>{$title} | Whitehawk FC</title>
    <meta name="description" content="{$excerpt}">
    <meta name="author" content="Whitehawk FC" />

    <meta property="og:type" content="article" />
    <meta property="og:title" content="{$title}" />
    <meta property="og:description" content="{$excerpt}" />
    <meta property="og:url" content="{$postUrl}" />
    <meta property="og:site_name" content="{$siteName}" />
HTML;

if (!empty($imageUrl)) {
    $safeImage = htmlspecialchars($imageUrl, ENT_QUOTES, 'UTF-8');
    $metaTags .= <<<HTML

    <meta property="og:image" content="{$safeImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
HTML;
}

$metaTags .= <<<HTML

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@WhitehawkFC" />
    <meta name="twitter:title" content="{$title}" />
    <meta name="twitter:description" content="{$excerpt}" />
HTML;

if (!empty($imageUrl)) {
    $safeImage = htmlspecialchars($imageUrl, ENT_QUOTES, 'UTF-8');
    $metaTags .= <<<HTML

    <meta name="twitter:image" content="{$safeImage}" />
HTML;
}

$metaTags .= "\n    <link rel=\"icon\" type=\"image/png\" href=\"/favicon.png\" />";

// Remove existing OG, Twitter, title, and description tags
$output = preg_replace('/<meta property="og:[^>]+>/i', '', $indexHtml);
$output = preg_replace('/<meta name="twitter:[^>]+>/i', '', $output);
$output = preg_replace('/<title>.*?<\/title>/i', '', $output);
$output = preg_replace('/<meta name="description"[^>]+>/i', '', $output);

// Inject our new dynamic tags right before </head>
$output = str_replace('</head>', $metaTags . "\n</head>", $output);

header('Content-Type: text/html; charset=UTF-8');
echo $output;
exit;

/**
 * Fetch post from Supabase REST API
 */
function fetchPost($url, $key, $slug) {
    $apiUrl = $url . '/rest/v1/posts?slug=eq.' . urlencode($slug) . '&select=title,excerpt,image_url,slug&limit=1';
    
    $opts = [
        'http' => [
            'method' => 'GET',
            'header' => "apikey: {$key}\r\nAuthorization: Bearer {$key}\r\nContent-Type: application/json\r\n",
            'timeout' => 5,
        ],
    ];
    
    $context = stream_context_create($opts);
    $response = @file_get_contents($apiUrl, false, $context);
    
    if ($response === false) {
        return null;
    }
    
    $data = json_decode($response, true);
    
    if (is_array($data) && count($data) > 0) {
        return $data[0];
    }
    
    return null;
}

/**
 * Serve the default index.html for non-post pages
 */
function serveIndex() {
    $indexPath = __DIR__ . '/index.html';
    if (file_exists($indexPath)) {
        header('Content-Type: text/html; charset=UTF-8');
        readfile($indexPath);
    } else {
        http_response_code(404);
        echo 'Not found';
    }
}
