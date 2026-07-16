// ╔══════════════════════════════════════════════════════════╗
// ║     POS ENTERPRISE — CONFIGURATION                      ║
// ║  Linear-style dark theme · multi-branch · multi-role    ║
// ║  + Light theme support with theme toggle                ║
// ╚═══════════════════════════════════════════════════════════╝

const DESIGN = {
    colors: {
        // Dark theme (default)
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
    colorsLight: {
        // Light theme
        'bg-page':         '#f3f4f6',
        'bg-panel':        '#ffffff',
        'bg-surface':      '#ffffff',
        'bg-hover':        '#f0f0f5',
        'bg-elevated':     '#ffffff',
        'text-primary':    '#111111',
        'text-secondary':  '#374151',
        'text-tertiary':   '#6b7280',
        'text-quaternary': '#9ca3af',
        'text-on-brand':   '#ffffff',
        'accent':          '#5a59e0',
        'accent-hover':    '#6d6bff',
        'success':         '#16a34a',
        'warning':         '#d97706',
        'error':           '#dc2626',
        'border':          'rgba(0,0,0,0.12)',
        'border-subtle':   'rgba(0,0,0,0.06)',
    },
    typography: {
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        fontFamilyMono: "'JetBrains Mono', ui-monospace, monospace",
    },
    cssVars() {
        const theme = this.colors;
        return Object.entries(theme)
            .map(([k, v]) => `--pos-${k}: ${v};`)
            .join('\n  ');
    },
    cssVarsLight() {
        const theme = this.colorsLight;
        return Object.entries(theme)
            .map(([k, v]) => `--pos-${k}: ${v};`)
            .join('\n  ');
    },
};

function getThemeColors() {
    return window._posDarkMode !== false ? DESIGN.colors : DESIGN.colorsLight;
}

// ─────────────────────────────────────────────────────────────
// CONFIG — Store & App Settings
// ─────────────────────────────────────────────────────────────
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

    // Firebase — isi dari Console → Project Settings → Web App
    // Demo mode (index.html?demo=1) tidak butuh Firebase config valid
    firebase: {
        apiKey:            '***',
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

// ─────────────────────────────────────────────────────────────
// THEME VARIANTS (color accents)
// ─────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────
// THEME / DARK MODE UTILITIES
// ─────────────────────────────────────────────────────────────
function initTheme() {
    // Check localStorage for preference
    const saved = localStorage.getItem('pos-darkMode');
    if (saved !== null) {
        window._posDarkMode = saved === 'true';
    } else {
        window._posDarkMode = true; // default dark
    }
}

function setDarkMode(on) {
    window._posDarkMode = on;
    localStorage.setItem('pos-darkMode', String(on));
    injectThemeCSS();
}

function toggleDarkMode() {
    setDarkMode(!window._posDarkMode);
}

function applyThemeCSS() {
    injectThemeCSS();
}

function injectThemeCSS() {
    const t = getTheme();
    const colors = getThemeColors();
    const hex = t.hex;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const style = document.createElement('style');
    style.id = 'theme-overrides';
    style.textContent = `
:root {
  --pos-bg-page: ${colors['bg-page']};
  --pos-bg-panel: ${colors['bg-panel']};
  --pos-bg-surface: ${colors['bg-surface']};
  --pos-bg-hover: ${colors['bg-hover']};
  --pos-bg-elevated: ${colors['bg-elevated']};
  --pos-text-primary: ${colors['text-primary']};
  --pos-text-secondary: ${colors['text-secondary']};
  --pos-text-tertiary: ${colors['text-tertiary']};
  --pos-text-muted: ${colors['text-quaternary']};
  --pos-accent: ${hex};
  --pos-accent-hover: ${t.hexHover};
  --pos-success: ${colors.success};
  --pos-warning: ${colors.warning};
  --pos-error: ${colors.error};
  --pos-border: ${colors.border};
  --pos-border-subtle: ${colors['border-subtle']};
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

// Firebase init lives in index.html / login.html so demo mode (?demo=1)
// can skip auth entirely without needing real credentials.