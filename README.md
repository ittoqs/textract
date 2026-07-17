# TexTract: Universal Web Scraper - Browser Extension

Ekstensi browser minimalis (Manifest V3) serbaguna yang dirancang untuk mengambil data dari halaman web mana pun, baik situs statis biasa maupun aplikasi web dinamis yang menggunakan sistem penyaringan bertingkat (*cascading filters* seperti Provinsi → Kabupaten → Desa).

## ✨ Fitur Utama
- **Cross-Platform:** Kompatibel penuh dengan Google Chrome, Mozilla Firefox, Microsoft Edge, Brave, dan browser berbasis Chromium lainnya.
- **Dukungan Web Statis:** Cukup masukkan CSS Selectors (id, class, tag HTML) untuk menarik teks instan.
- **Dukungan Web Dinamis:** Menyediakan kolom eksekusi JavaScript Asinkron kustom untuk mensimulasikan interaksi klik, pemilihan dropdown, dan penanganan jeda tunggu (*delay parsing*).
- **Multi-Format Output:** Hasil ekstraksi otomatis diunduh secara bersamaan dalam format `.json` dan `.txt`.

## 📂 Struktur Repositori
Proyek ini dibangun menggunakan struktur arsitektur ekstensi paling ramping:
- `manifest.json` : File konfigurasi dan perizinan API ekstensi.
- `popup.html` : Desain antarmuka pengguna panel kontrol.
- `popup.js` : Otak penanganan injeksi skrip ke tab aktif browser.

## 🚀 Cara Pemasangan di Browser Lokal

### Google Chrome / Chromium-based:
1. Unduh atau klon repositori folder ini.
2. Buka Chrome dan akses alamat `chrome://extensions/`.
3. Aktifkan **Developer Mode** di pojok kanan atas.
4. Klik tombol **Load Unpacked** di kiri atas, lalu arahkan ke folder tempat Anda menyimpan berkas ini.

### Mozilla Firefox:
1. Buka Firefox dan akses alamat `about:debugging#/runtime/this-firefox`.
2. Klik tombol **Load Temporary Add-on...**.
3. Pilih file `manifest.json` dari folder proyek ini.

## 💡 Contoh Penggunaan Skrip Kustom (Web Dinamis Bertingkat)
Jika Anda menghadapi situs dinamis yang memerlukan perulangan otomatis pada drop-down (misalnya data wilayah), Anda dapat menempelkan contoh logika asinkron berikut ke dalam kotak kolom **Skrip Otomatisasi Kustom** di ekstensi:

```javascript
const selProv = document.querySelector('#provinsi');
const selKab = document.querySelector('#kabupaten');
let data = [];

for (let prov of selProv.options) {
  if (!prov.value) continue;
  selProv.value = prov.value;
  selProv.dispatchEvent(new Event('change', { bubbles: true }));
  await delay(2000); // fungsi delay bawaan ekstensi

  for (let kab of selKab.options) {
    if (!kab.value) continue;
    data.push({ provinsi: prov.text, kabupaten: kab.text });
  }
}
return data; // Wajib mengembalikan nilai (return) variabel data agar terunduh otomatis
