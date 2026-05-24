/**
 * Konfigurasi Database - Ganti dengan Nama Sheet yang Anda inginkan
 */
const SHEET_NAME = 'Data_Sertifikasi';

/**
 * Handle HTTP GET - Berguna jika Anda me-load HTML web app 
 * (Untuk React Standalone akan dirender dari hosting lain, tapi kita siapkan)
 */
function doGet(e) {
  return HtmlService.createHtmlOutput('<h1>Sistem Audit SLHS SPPG - Backend Active</h1> <p>Gunakan endpoint ini untuk metode POST.</p>');
}

/**
 * Handle HTTP POST - Menerima Payload JSON dari aplikasi Frontend 
 */
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({ 
        status: "error", 
        message: "Sheet tidak ditemukan. Jalankan fungsi setupDatabase() terlebih dahulu." 
      }))
      .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Parse the incoming JSON data
    let payload;
    try {
      payload = JSON.parse(e.postData.contents);
    } catch(err) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Invalid JSON format" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Baca headers dari baris pertama untuk mencocokkan data
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    // Susun array data baru sesuai urutan kolom header
    const newRow = headers.map(header => {
      // Pastikan tipe object (seperti json strings atau object answers) tidak error, di-convert ke string
      let val = payload[header] || ""; 
      if (typeof val === 'object') {
        val = JSON.stringify(val);
      }
      return val;
    });
    
    // Tambahkan baris baru ke paling bawah
    sheet.appendRow(newRow);
    
    // Berikan respons sukses
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "success", 
      message: "Data berhasil disimpan"
    }))
    .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "error", 
      message: error.message 
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * FUNGSI SETUP DATABASE
 * Jalankan fungsi ini SATU KALI dari Apps Script Editor untuk menyiapkan kolom struktur tabel
 */
function setupDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  // Jika sheet belum ada, buat baru
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  } else {
    // Jika sudah ada, hapus semua isinya (Hati-hati jika data penting)
    sheet.clear();
  }
  
  // Tentukan kolom Header 
  // Pastikan Keys sesuai dengan properti JSON yang di-POST dari Frontend
  const headers = [
    "waktu_submit", 
    "namaSPPG", 
    "alamatSPPG", 
    "namaAuditor",
    "tanggalEvaluasi",
    "namaPemeriksa",
    "namaPengelola",
    "golongan",
    "totalPenalty",
    "total_pelanggaran_kritis",
    "total_temuan_mayor",
    "finalScore",
    "labResultAir",
    "labResultMakanan",
    "kesimpulan",
    "answers"  // Data raw array/string jawaban form 
  ];
  
  // Masukkan ke baris Pertama
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Formatting Header: Background warna, Freeze Panes, Bold
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight("bold");
  headerRange.setBackground("#003d79"); // Warna biru tua progresivo
  headerRange.setFontColor("#ffffff");
  sheet.setFrozenRows(1);
  
  // Otomatis ubah ukuran kolom agar pas
  sheet.autoResizeColumns(1, headers.length);
  
  // Set default format Text
  sheet.getRange(1, 1, sheet.getMaxRows(), headers.length).setNumberFormat("@");
  
  Logger.log("Berhasil! Database Sheet '" + SHEET_NAME + "' berhasil disiapkan dan siap menerima data.");
}
