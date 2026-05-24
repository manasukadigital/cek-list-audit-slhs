import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, BorderStyle, WidthType, AlignmentType, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import { checklistData } from './data';

export const exportToWord = async (
  namaSPPG: string,
  alamatSPPG: string,
  namaAuditor: string,
  tanggalEvaluasi: string,
  golongan: string,
  answers: Record<string, string>,
  finalScore: string,
  totalPenalty: number,
  labAirText: string,
  labMakananText: string,
  kesimpulan: string,
  namaPemeriksa: string,
  namaPengelola: string,
  resultStatus: string
) => {
  const tableRows: TableRow[] = [];
  
  // Header Row
  tableRows.push(
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph({ text: "No", alignment: AlignmentType.CENTER })], width: { size: 10, type: WidthType.PERCENTAGE } }),
        new TableCell({ children: [new Paragraph({ text: "Kriteria", alignment: AlignmentType.CENTER })], width: { size: 60, type: WidthType.PERCENTAGE } }),
        new TableCell({ children: [new Paragraph({ text: "Bobot Penyimpangan", alignment: AlignmentType.CENTER })], width: { size: 15, type: WidthType.PERCENTAGE } }),
        new TableCell({ children: [new Paragraph({ text: "Jawaban", alignment: AlignmentType.CENTER })], width: { size: 15, type: WidthType.PERCENTAGE } })
      ]
    })
  );

  checklistData.forEach(section => {
    // Section Header
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: section.name, bold: true })]
              })
            ],
            columnSpan: 4,
            shading: { fill: "D9D9D9" }
          })
        ]
      })
    );

    section.subsections.forEach(sub => {
      // Subsection Header
      tableRows.push(
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: sub.name, bold: true, italics: true })]
                })
              ],
              columnSpan: 4,
              shading: { fill: "F2F2F2" }
            })
          ]
        })
      );

      sub.items.forEach(item => {
        let bobot = "-";
        if (item.penalties) {
          const val = item.penalties[golongan as keyof typeof item.penalties];
          if (val && val !== 'NA') {
            bobot = val.toString();
          }
        }
        
        tableRows.push(
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ text: item.no })] }),
              new TableCell({ children: [new Paragraph({ text: item.kriteria })] }),
              new TableCell({ children: [new Paragraph({ text: bobot, alignment: AlignmentType.CENTER })] }),
              new TableCell({ children: [new Paragraph({ text: answers[item.id] || "Belum Terjawab", alignment: AlignmentType.CENTER })] })
            ]
          })
        );
      });
    });
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: "Laporan Audit Sertifikasi Laik Higiene Sanitasi",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({ text: `Nama SPPG: ${namaSPPG}` }),
          new Paragraph({ text: `Alamat: ${alamatSPPG}` }),
          new Paragraph({ text: `Nama Auditor: ${namaAuditor}` }),
          new Paragraph({ text: `Tanggal Evaluasi: ${tanggalEvaluasi}` }),
          new Paragraph({ text: `Golongan: ${golongan}` }),
          new Paragraph({ text: "" }),
          new Paragraph({ text: `Total Ketidaksesuaian: ${totalPenalty}`, bold: true }),
          new Paragraph({ text: `Skor Akhir: ${finalScore}/100`, bold: true }),
          new Paragraph({ text: "" }),
          new Table({
            rows: tableRows,
            width: { size: 100, type: WidthType.PERCENTAGE }
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "F. Catatan Lain (Persyaratan Mendapatkan Sertifikat)",
            heading: HeadingLevel.HEADING_2
          }),
          new Paragraph({ text: `1. Hasil analisis air minum di laboratorium: ${labAirText}` }),
          new Paragraph({ text: `2. Hasil analisis pangan di laboratorium: ${labMakananText}` }),
          new Paragraph({ text: "" }),
          new Paragraph({ text: `Status Keputusan: ${resultStatus}`, bold: true }),
          new Paragraph({ text: "" }),
          new Paragraph({ text: "Catatan Kesimpulan / Tindak Lanjut Auditor:", bold: true }),
          new Paragraph({ text: kesimpulan || "-" }),
          new Paragraph({ text: "" }),
          new Paragraph({ text: `Nama Pemeriksa: ${namaPemeriksa}` }),
          new Paragraph({ text: `Nama Pengelola: ${namaPengelola}` })
        ]
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Audit_Higiene_${namaSPPG.replace(/\s+/g, '_')}_${tanggalEvaluasi}.docx`);
};
