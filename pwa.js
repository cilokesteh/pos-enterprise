// POS Enterprise — PWA bootstrap
(function () {
  if (typeof CONFIG === 'undefined') return;

  const theme = (typeof getTheme === 'function' ? getTheme() : { hex: '#7170ff' });
  const name = CONFIG.storeName || 'POS Enterprise';

  const manifest = {
    name: name,
    short_name: name.slice(0, 12),
    description: 'Toko HP · POS Enterprise',
    start_url: './index.html',
    display: 'standalone',
    background_color: '#08090a',
    theme_color: theme.hex || '#7170ff',
    orientation: 'any',
    icons: [
      { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: 'icons/icon-192-maskable.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: 'icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };

  const blob = new Blob([JSON.stringify(manifest)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  let link = document.querySelector('link[rel="manifest"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'manifest';
    document.head.appendChild(link);
  }
  link.href = url;

  // Theme color meta
  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'theme-color';
    document.head.appendChild(meta);
  }
  meta.content = '#08090a';

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js?v=6').catch(() => {});
    });
  }
})();
