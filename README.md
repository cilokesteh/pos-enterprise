# POS Enterprise

Point of Sale **profesional** untuk perusahaan / multi-cabang.
Beda dari master-pos (gaya UMKM) — ini Linear-style dark, dense, role-based.

## Fitur

| Fitur | Detail |
|-------|--------|
| **Kasir** | Product grid, cart, cash / QRIS / transfer / split |
| **Produk** | CRUD + Harga Beli (modal) + SKU + kategori |
| **Laporan** | Omzet, Modal, **Profit**, filter tanggal, export Excel |
| **Multi-role** | admin · manager · kasir |
| **Multi-cabang** | Branch list + assign user ke cabang |
| **Audit trail** | Log aksi ke `ent-audit` |
| **Struk** | Print thermal + PDF + share WA |
| **PWA** | Installable, offline shell |

## Design

- Background `#08090a` / panel `#0f1011` / surface `#191a1b`
- Accent indigo `#7170ff` (Linear-style)
- Font Inter
- Sidebar navigation (bukan header-only)

## Setup Firebase

1. Buat project di [Firebase Console](https://console.firebase.google.com)
2. Enable **Authentication** → Email/Password
3. Buat user admin
4. Buat **Firestore** database
5. Rules (production):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

6. Isi `config.js` → `CONFIG.firebase` dengan config Web App

### Collection names

- `ent-products`
- `ent-transactions`
- `ent-users`
- `ent-branches`
- `ent-audit`

### Index Firestore

Untuk laporan, buat composite index:
- Collection: `ent-transactions`
- Fields: `createdAt` Ascending

(atau biarkan Firebase link error bikin index otomatis)

### User profile

Setelah Auth user dibuat, tambah dokumen di `ent-users`:

```json
{
  "name": "Admin HQ",
  "email": "admin@perusahaan.com",
  "role": "admin",
  "branchId": null,
  "createdAt": 1710000000000
}
```

Roles:
- **admin** — full (kasir, produk, laporan, settings)
- **manager** — kasir, produk, laporan
- **kasir** — kasir only

## Deploy Cloudflare Pages

```bash
# dari folder pos-enterprise
npx wrangler pages deploy . --project-name=pos-enterprise
# atau hubungkan repo ke CF Pages, production branch: main
```

## File structure

```
pos-enterprise/
├── config.js      # design + firebase + store settings
├── index.html     # SPA: kasir / produk / laporan / settings
├── login.html
├── pwa.js
├── sw.js
└── README.md
```

## Perbedaan vs master-pos (UMKM)

| | UMKM (master-pos) | Enterprise |
|--|-------------------|------------|
| Layout | Header + 2 kolom | Sidebar + 3 panel |
| Theme | Emerald/zinc rounded | Linear dark indigo |
| Role | Single admin | admin/manager/kasir |
| Cabang | Tidak | Multi-branch |
| SKU | Tidak | Ada |
| Profit | Optional | Built-in + Excel |
| Audit | Tidak | ent-audit |

## Catatan

- Jangan commit API key production ke repo publik (atau batasi domain di Firebase)
- Bump `CACHE` di `sw.js` setiap deploy
- Struk **tidak** menampilkan harga modal
