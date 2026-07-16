// ╔══════════════════════════════════════════════════════════╗
// ║     POS ENTERPRISE — CONFIGURATION                      ║
// ║  Linear-style dark theme · multi-branch · multi-role    ║
// ╚══════════════════════════════════════════════════════════╝

const DESIGN = {
    colors: {
        'bg-page':         '#08090a',
        'bg-panel':        '#0f1011',
        'bg-surface':      '#191a1b',
        'bg-hover':        '#28282c',
        'bg-elevated':     '#1a1b1e',
        'text-primary':    '#f7f8f8',
        'text-secondary':  '#d0d6e0',
        'text-tertiary':   '#8a8f98',
        'text-quaternary': '#62666d',
        'text-on-brand':   '#ffffff',
        'accent':          '#7170ff',
        'accent-hover':    '#828fff',
        'success':         '#27a644',
        'warning':         '#f5a623',
        'error':           '#f87171',
        'border':          'rgba(255,255,255,0.08)',
        'border-subtle':   'rgba(255,255,255,0.05)',
    },
    typography: {
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        fontFamilyMono: "'JetBrains Mono', ui-monospace, monospace",
    },
    cssVars() {
        return Object.entries(this.colors)
            .map(([k, v]) => `--pos-${k}: ${v};`)
            .join('\n  ');
    },
};

// Firebase — isi dari Console → Project Settings → Web App
const CONFIG = {
    storeName:    'POS Enterprise',
    storeJargon:  'Solusi Bisnis Terpadu',
    storeAddress: 'Jl. Contoh Bisnis No. 1, Jakarta',
    storeHours:   'Senin - Sabtu: 08.00 - 21.00 WIB',
    storeWA:      '08xx-xxxx-xxxx',
    storeIG:      '@pos_enterprise',
    storeWebsite: 'pos-enterprise.com',

    theme: 'enterprise',
    branchId: null,
    branchName: '',

    firebase: {
        apiKey:            'YOUR_API_KEY',
        authDomain:        'pos-enterprise.firebaseapp.com',
        projectId:         'pos-enterprise',
        storageBucket:     'pos-enterprise.firebasestorage.app',
        messagingSenderId: 'YOUR_SENDER_ID',
        appId:             'YOUR_APP_ID',
    },

    receipt: {
        width: 80,
        showFooter: true,
        showKasir: true,
        footerText: 'Terima kasih atas kunjungan Anda',
    },

    tax: { enabled: true, default: 0, name: 'PPN' },
    paymentMethods: ['cash', 'qris', 'transfer', 'card', 'split'],
    maxSplitMethods: 3,

    // Firestore collection names
    collections: {
        products:     'ent-products',
        transactions: 'ent-transactions',
        users:        'ent-users',
        branches:     'ent-branches',
        auditLogs:    'ent-audit',
    },

    adminHint: {
        email: 'admin@pos-enterprise.com',
        password: 'demo1234',
    },

    features: {
        multiBranch: true,
        roles: true,
        inventory: true,
        reports: true,
        auditTrail: true,
    },
};

const THEMES = {
    enterprise: {
        primary: 'indigo',
        hex: '#7170ff',
        hexHover: '#828fff',
        bg: '#5e6ad2',
        label: 'Enterprise',
        borderRadius: '6px',
    },
    navy: {
        primary: 'blue',
        hex: '#3b82f6',
        hexHover: '#60a5fa',
        bg: '#1e40af',
        label: 'Navy',
        borderRadius: '6px',
    },
    slate: {
        primary: 'slate',
        hex: '#64748b',
        hexHover: '#94a3b8',
        bg: '#334155',
        label: 'Slate',
        borderRadius: '6px',
    },
};

function getTheme() {
    return THEMES[CONFIG.theme] || THEMES.enterprise;
}

function injectThemeCSS() {
    const t = getTheme();
    const hex = t.hex;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const style = document.createElement('style');
    style.id = 'theme-overrides';
    style.textContent = `
:root {
  --pos-bg-page: ${DESIGN.colors['bg-page']};
  --pos-bg-panel: ${DESIGN.colors['bg-panel']};
  --pos-bg-surface: ${DESIGN.colors['bg-surface']};
  --pos-bg-hover: ${DESIGN.colors['bg-hover']};
  --pos-text-primary: ${DESIGN.colors['text-primary']};
  --pos-text-secondary: ${DESIGN.colors['text-secondary']};
  --pos-text-tertiary: ${DESIGN.colors['text-tertiary']};
  --pos-text-muted: ${DESIGN.colors['text-quaternary']};
  --pos-accent: ${hex};
  --pos-accent-hover: ${t.hexHover};
  --pos-success: ${DESIGN.colors.success};
  --pos-warning: ${DESIGN.colors.warning};
  --pos-error: ${DESIGN.colors.error};
  --pos-border: ${DESIGN.colors.border};
  --pos-border-subtle: ${DESIGN.colors['border-subtle']};
  --pos-radius: ${t.borderRadius};
}
.bg-accent { background-color: ${hex} !important; }
.bg-accent-hover:hover { background-color: ${t.hexHover} !important; }
.text-accent { color: ${hex} !important; }
.border-accent { border-color: ${hex} !important; }
.focus-accent:focus { border-color: ${hex} !important; outline: none; box-shadow: 0 0 0 2px rgba(${r},${g},${b},0.25); }
.bg-accent-soft { background-color: rgba(${r},${g},${b},0.15) !important; }
`;
    document.head.appendChild(style);
}
