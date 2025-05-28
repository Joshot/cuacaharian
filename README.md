# 🌤️ Cuaca Harian

**Cuaca Harian** adalah aplikasi cuaca modern berbasis web yang dibangun dengan **React + TypeScript + Vite**. Aplikasi ini memungkinkan pengguna untuk mencari cuaca kota, melihat prakiraan 5 hari ke depan, menyimpan kota favorit, dan menggunakan aplikasi secara offline berkat fitur **PWA**.

---

## 🔗 Link Penting

* 🌐 **Live demo**: [https://cuacaharian.netlify.app](https://cuacaharian.netlify.app)
* 🛠️ **Repo GitHub**: [https://github.com/Joshot/cuacaharian](https://github.com/Joshot/cuacaharian)

---

## 📅 Cara Install & Jalankan

1. **Clone project-nya**

   ```bash
   git clone https://github.com/Joshot/cuacaharian.git
   cd cuacaharian
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Siapkan file `.env`**
   Buat file `.env` di root project:

   ```
   VITE_API_KEY=masukkan_api_key_kamu_dari_openweathermap
   ```

4. **Jalankan aplikasi di mode development**

   ```bash
   npm run dev
   ```

   Buka di browser: [http://localhost:5173](http://localhost:5173)

---

## 🌟 Fitur Utama

* 🔍 Cari cuaca kota beserta negara dan tampilkan kondisi sekarang (temperatur, kelembapan, kecepatan angin, feels like).
* 🗖️ Prakiraan cuaca 5 hari ke depan (min/max temperatur & kondisi).
* ⭐ Simpan dan hapus kota favorit dengan **localStorage**.
* ⚙️ Dapat diakses **offline**, menyimpan data cuaca sebelumnya dan memberi peringatan jika data kedaluwarsa.
* 🖥️ Tampilan **responsif** dan **aksesibel** (dengan ARIA dan keyboard navigation).
* 🛍️ Support **PWA**, bisa di-install seperti aplikasi native (dengan **service worker**).
* ⚠️ Penanganan error & loading menggunakan **SweetAlert2** dan spinner.

---