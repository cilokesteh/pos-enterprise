# POS Enterprise — Cloud Functions

## Fungsi

`onCreateUserProfile` — trigger setiap ada dokumen baru di `ent-users`:

1. Admin buat user lewat form Settings → User
2. Firestore `ent-users` terisi (name, email, password, role, branchId)
3. Cloud Function jalan → **Auth user dibuat otomatis**
4. Password dihapus dari Firestore, ditambah `uid` biar nyambung

`onDeleteUserProfile` — trigger pas user dihapus dari Firestore → Auth user ikut dihapus.

## Deploy

```bash
# Prasyarat
npm install -g firebase-tools
firebase login
cd /home/ubuntu/pos-enterprise/functions
npm install
cd ..

# Deploy
firebase deploy --only functions

# Konfigurasi collection name (opsional, default = ent-users)
firebase functions:config:set pos.users_collection="ent-users"
firebase deploy --only functions
```

## Notes

- Password minimal 6 karakter, disimpan sementara di Firestore lalu dihapus setelah Auth dibuat
- Cloud Function perlu **Firebase Blaze plan** (pay-as-you-go, free tier cukup untuk skala UMKM)
- Kalau belum ada `firebase.json`, jalanin `firebase init functions` dulu