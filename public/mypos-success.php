<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Payment Successful – Whitehawk FC Shop</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;900&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Inter', sans-serif;
      background: #f8f9fa;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .card {
      background: #fff;
      border-radius: 24px;
      box-shadow: 0 8px 48px rgba(0,0,0,0.10);
      max-width: 480px;
      width: 100%;
      padding: 3rem 2.5rem;
      text-align: center;
      border: 1px solid #eee;
    }

    .icon-wrap {
      width: 80px; height: 80px;
      background: #dcfce7;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 2rem;
    }

    .icon-wrap svg { width: 40px; height: 40px; color: #16a34a; }

    .badge {
      display: inline-block;
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 11px; font-weight: 700;
      letter-spacing: 0.15em; text-transform: uppercase;
      color: #8e160b; background: #fef2f0;
      border: 1px solid #fecaca;
      border-radius: 999px; padding: 4px 14px;
      margin-bottom: 1.25rem;
    }

    h1 {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 2.25rem; font-weight: 900;
      text-transform: uppercase; letter-spacing: -0.02em;
      color: #111; margin-bottom: 0.75rem;
    }

    p { color: #6b7280; font-size: 0.95rem; line-height: 1.6; margin-bottom: 0.5rem; }

    .order-box {
      background: #f8f9fa; border-radius: 12px;
      padding: 1rem 1.5rem; margin: 1.75rem 0;
      border: 1px solid #e5e7eb;
    }
    .order-box small { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; color: #9ca3af; }
    .order-box strong { display: block; font-family: 'Barlow Condensed', sans-serif; font-size: 1.5rem; font-weight: 700; color: #111; margin-top: 2px; }

    .btn {
      display: inline-block;
      background: #8e160b; color: #fff;
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 13px; font-weight: 700;
      letter-spacing: 0.12em; text-transform: uppercase;
      text-decoration: none; border-radius: 8px;
      padding: 0.85rem 2rem; margin-top: 0.5rem;
      transition: background 0.2s;
    }
    .btn:hover { background: #7a1109; }

    .logo-bar {
      display: flex; align-items: center; justify-content: center;
      gap: 0.5rem; margin-bottom: 2.5rem;
    }
    .logo-bar img { height: 48px; }
  </style>
</head>
<body>

  <div class="card">
    <div class="logo-bar">
      <img src="/favicon.ico" alt="Whitehawk FC" onerror="this.style.display='none'">
    </div>

    <div class="icon-wrap">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 6L9 17l-5-5"/>
      </svg>
    </div>

    <span class="badge">Whitehawk FC Shop</span>

    <h1>Payment Confirmed!</h1>
    <p>Thank you for supporting the Hawks. Your order has been received and payment processed successfully via myPOS.</p>
    <p style="margin-top:0.5rem">You'll receive a receipt to your email shortly.</p>

    <?php
      $orderId = htmlspecialchars($_GET['OrderID'] ?? $_POST['OrderID'] ?? '');
      if ($orderId):
    ?>
    <div class="order-box">
      <small>Order Reference</small>
      <strong><?= $orderId ?></strong>
    </div>
    <?php endif; ?>

    <a href="/" class="btn">Back to Whitehawk FC ›</a>
  </div>

</body>
</html>
