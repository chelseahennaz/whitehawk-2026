<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Payment Cancelled – Whitehawk FC Shop</title>
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
      background: #fef2f2;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 2rem;
    }

    .icon-wrap svg { width: 40px; height: 40px; color: #dc2626; }

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

    p { color: #6b7280; font-size: 0.95rem; line-height: 1.6; }

    .btn-group { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 2rem; }

    .btn {
      display: inline-block;
      background: #8e160b; color: #fff;
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 13px; font-weight: 700;
      letter-spacing: 0.12em; text-transform: uppercase;
      text-decoration: none; border-radius: 8px;
      padding: 0.85rem 2rem;
      transition: background 0.2s;
    }
    .btn:hover { background: #7a1109; }

    .btn-ghost {
      display: inline-block;
      background: transparent; color: #6b7280;
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 12px; font-weight: 700;
      letter-spacing: 0.12em; text-transform: uppercase;
      text-decoration: none;
      padding: 0.85rem 2rem;
      border: 1px solid #e5e7eb; border-radius: 8px;
      transition: border-color 0.2s, color 0.2s;
    }
    .btn-ghost:hover { color: #111; border-color: #aaa; }

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
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </div>

    <span class="badge">Whitehawk FC Shop</span>

    <h1>Payment Cancelled</h1>
    <p>No payment was taken. Your cart is still saved — head back to the shop to complete your order whenever you're ready.</p>

    <div class="btn-group">
      <a href="/shop" class="btn">Return to Shop ›</a>
      <a href="/" class="btn-ghost">Back to Whitehawk FC</a>
    </div>
  </div>

</body>
</html>
