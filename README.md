# Letterboxd Level

Website fun untuk mengelompokkan user berdasarkan jumlah film yang sudah ditonton.

## Penting: versi gratis ini tidak melakukan scraping Letterboxd

Letterboxd saat ini menyediakan API secara selektif/by request dan Terms of Use melarang penggunaan robot, spider, scraper, atau automated data gathering kecuali diizinkan. Karena itu repo ini sengaja memakai input jumlah film secara manual.

Alur:
1. User buka profil Letterboxd.
2. Lihat angka **Films**.
3. Masukkan username + jumlah Films ke website.
4. Website menentukan kelompok.

Dengan demikian project ini bisa langsung dipasang di Vercel tanpa API key atau database.

## Jalankan lokal

```bash
npm install
npm run dev
```

Buka http://localhost:3000

## Deploy ke Vercel

1. Upload folder ini ke GitHub.
2. Buka Vercel dan import repository tersebut.
3. Framework akan terdeteksi sebagai Next.js.
4. Klik Deploy.
5. Tidak perlu environment variable.

## Mengubah kelompok

Edit array `GROUPS` di `app/checker.tsx`.

## Kalau nanti mendapat akses API resmi

Buat route server-side seperti `app/api/check/route.ts`, lalu panggil API resmi Letterboxd dari server. Jangan menaruh credential API di client-side atau variabel `NEXT_PUBLIC_*`.
