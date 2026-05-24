import fs from 'fs';

let content = fs.readFileSync('src/exportUtils.ts', 'utf8');

// modify signature
content = content.replace(
  "namaPengelola: string",
  "namaPengelola: string,\n  resultStatus: string"
);

// add to document
content = content.replace(
  /new Paragraph\({ text: "Kesimpulan \/ Tindak Lanjut:", bold: true }\),/g,
  `new Paragraph({ text: \`Status Keputusan: \${resultStatus}\`, bold: true }),
          new Paragraph({ text: "" }),
          new Paragraph({ text: "Catatan Kesimpulan / Tindak Lanjut Auditor:", bold: true }),`
);

fs.writeFileSync('src/exportUtils.ts', content);

// Update App.tsx caller
let appContent = fs.readFileSync('src/App.tsx', 'utf8');

// Find the exportToWord call
const oldExportCall = `exportToWord(namaSPPG, alamatSPPG, namaAuditor, tanggalEvaluasi, golongan, answers, finalScore, totalPenalty, labAirText, labMakananText, kesimpulan, namaPemeriksa, namaPengelola);`;
const newExportCall = `
                let statusKeputusan = '';
                const baseTargetScore = golongan === 'C' ? 85 : golongan === 'B' ? 80 : 75;
                if (penaltyStats.critical > 0) {
                  statusKeputusan = 'TIDAK LULUS (Ditemukan Pelanggaran Kritis)';
                } else if (!labResultAir || !labResultMakanan) {
                  statusKeputusan = 'TIDAK LULUS (Uji Lab Tidak Memenuhi Syarat)';
                } else if (parseFloat(finalScore) < baseTargetScore) {
                  statusKeputusan = 'TIDAK LULUS (Skor Kurang)';
                } else if (totalPenalty === 0) {
                  statusKeputusan = 'LULUS (Memenuhi Semua Standar)';
                } else {
                  statusKeputusan = 'LULUS BERSYARAT (Ada Temuan Minor/Mayor)';
                }
                exportToWord(namaSPPG, alamatSPPG, namaAuditor, tanggalEvaluasi, golongan, answers, finalScore, totalPenalty, labAirText, labMakananText, kesimpulan, namaPemeriksa, namaPengelola, statusKeputusan);
`;
appContent = appContent.replace(oldExportCall, newExportCall);

fs.writeFileSync('src/App.tsx', appContent);
console.log('Export code updated');
