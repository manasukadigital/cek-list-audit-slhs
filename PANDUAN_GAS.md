# Panduan Integrasi Google Apps Script (Sertifikasi Laik Higiene)

Aplikasi Asesment SLHS SPPG React telah diperbarui untuk mendukung mode penyampaian form ke ekosistem **Google Workspace APIs** (Google Sheets) via API kustom (`Code.gs`), sekaligus memenuhi preferensi format data untuk simulasi.

Ikuti panduan ini langkah demi langkah untuk mengintegrasikannya dengan Akun Google Drive (Google Sheets) Anda.

---

### Tahap 1: Setup Spreadsheet & Google Apps Script
1. Buka browser dan pergi ke **[Google Sheets](https://sheets.google.com)**.
2. Buat *"Blank Spreadsheet"* (Spreadsheet Kosong) baru dan beri nama, misalnya: `Data Audit SLHS SPPG`.
3. Dari dalam Google Sheets tersebut, pada menu navigasi atas, klik **Extensions > Apps Script** (Ekstensi > Apps Script).
4. Sebuah halaman editor Apps Script (`Code.gs`) akan terbuka.
5. Hapus semua kode bawaan `function myFunction() {}`.
6. **Copy semua kode** dari file `Code.gs` yang ada di dokumen root sistem ini (atau kode backend saya) dan tempel/paste ke dalam editor.
7. Simpan file (Ikon **Save** atau `Ctrl+S` / `Cmd+S`).

---

### Tahap 2: Menyiapkan Database Otomatis (Otorisasi 1x Klik)
Anda wajib menjalankan inisialisasi agar Apps Script membuat kolom-kolom yang sesuai dan mengunci baris atas (*Freeze Baris Pertama*).

1. Di dalam Apps Script Editor, perhatikan *Dropdown* Menu Fungsi terletak di samping tombol **Run** (Jalankan). 
2. Ubah/Pilih fungsi yang akan dijalankan ke **`setupDatabase`**.
3. Klik tombol **Run** (Jalankan).
4. Google akan memunculkan pop-up _"Authorization required"_ (Izin diperlukan).
5. Klik **Review permissions** > **Pilih Akun Gmail Anda** > klik **Advanced** (Lanjutan) di kiri bawah > klik **Go to Untitled project (unsafe)** > Lalu klik **Allow** (Izinkan).
6. Script akan berjalan. Silakan cek kembali tab Google Sheets Anda. Sheet bernama `Data_Sertifikasi` otomatis dibuat, diwarnai biru, dengan kolom-kolom rapi siap menampung post payload.

---

### Tahap 3: Deployment menjadi Web App
Inilah tahap yang paling penting untuk merepresentasikan Apps Script Anda menjadi API publik:

1. Di sudut kanan atas Apps Script Editor Anda, temukan tombol biru besar **Deploy** lalu klik **New deployment**.
2. Pilih tipe: **Web app** (ikon gigi roda kecil > centang Web App).
3. Isi deskripsi (misalnya: `API V1 Submit Forms`).
4. **Perhatikan Konfigurasi Ini (WAJIB)**:
   - *Execute as*: **Me** (`email_anda@gmail.com`)
   - *Who has access*: **Anyone** (Siapa Saja) 
   *(Ini wajib agar request mode `no-cors` dari aplikasi UI frontend kita yang melintasi domain bisa masuk dan diizinkan menulis row secara otomatis tanpa mengharuskan pengguna API login ke akun script).*
5. Klik **Deploy**.
6. Akan muncul "Deployment successfully updated" dan Anda akan mendapatkan URL **Web app**. Salin URL (*Copy*) panjang yang tertera (biasanya berakhiran `.../exec`).

---

### Tahap 4: Menempelkan Endpoint ke Front-End
1. Di dalam source code Front-end Anda (dalam React Web App: `src/App.tsx`), di baris atas Anda akan menemukan variabel konfigurasi:

```javascript
const IS_PREVIEW = true; // Atau false 
const GAS_URL = "URL_DEPLOY_GAS_ANDA_DISINI";
```

2. Pastikan menempel (paste) URL web app Anda yang disalin dari langkah ke-3 pada variabel `GAS_URL`.
3. Bila sudah siap dipakai ke level asli, ubah `const IS_PREVIEW = false;`.
4. Selesai! Web aplikasi Anda sudah mandiri dan backend terkunci secara harmonis pada mode Serverless dengan ekosistem Google Workspace APIs Anda.
