import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldSubmitBlock = `  const handleSubmit = async () => {
    if (!user) {
      alert("Harap login terlebih dahulu.");
      return;
    }

    if (!namaSPPG || !alamatSPPG || !tanggalEvaluasi || !namaAuditor) {
      alert("Harap lengkapi Informasi Fasilitas.");
      return;
    }

    setIsSubmitting(true);
    try {
      const auditsRef = collection(db, 'audits');
      await addDoc(auditsRef, {
        namaSPPG,
        alamatSPPG,
        namaAuditor,
        tanggalEvaluasi,
        golongan,
        answers,
        totalPenalty,
        finalScore,
        labResultAir,
        labResultMakanan,
        kesimpulan,
        namaPemeriksa,
        namaPengelola,
        userId: user.uid,
        createdAt: serverTimestamp()
      });
      
      const message = progressStats.isComplete 
        ? \`Audit Selesai dan Berhasil Disimpan!\\nSkor Akhir: \${finalScore}/100\`
        : \`Progress Audit Berhasil Disimpan!\\nSkor Sementara: \${finalScore}/100\`;
        
      alert(message);`;

const newSubmitBlock = `  const handleSubmit = async () => {
    // Optional login check, commented out for standalone GAS form
    // if (!user) {
    //   alert("Harap login terlebih dahulu.");
    //   return;
    // }

    if (!namaSPPG || !alamatSPPG || !tanggalEvaluasi || !namaAuditor) {
      alert("Harap lengkapi Informasi Fasilitas.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        waktu_submit: new Date().toISOString(),
        namaSPPG,
        alamatSPPG,
        namaAuditor,
        tanggalEvaluasi,
        golongan,
        totalPenalty,
        finalScore,
        labResultAir: labResultAir ? 'Memenuhi Syarat' : 'Tidak Memenuhi Syarat',
        labResultMakanan: labResultMakanan ? 'Memenuhi Syarat' : 'Tidak Memenuhi Syarat',
        kesimpulan,
        namaPemeriksa,
        namaPengelola,
        total_pelanggaran_kritis: penaltyStats.critical,
        total_temuan_mayor: penaltyStats.major,
      };

      if (!IS_PREVIEW) {
        // Send to Google Sheets via Apps Script Web App
        await fetch(GAS_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });
      }

      // Also save to Firebase if needed (kept for compatibility)
      if (user) {
        const auditsRef = collection(db, 'audits');
        await addDoc(auditsRef, {
          ...payload,
          answers,
          userId: user.uid,
          createdAt: serverTimestamp()
        });
      }
      
      const message = progressStats.isComplete 
        ? \`Audit Selesai dan Berhasil Disimpan \${IS_PREVIEW ? '(Mode Preview)' : 'ke Database'}!\\nSkor Akhir: \${finalScore}/100\`
        : \`Progress Audit Berhasil Disimpan \${IS_PREVIEW ? '(Mode Preview)' : 'ke Database'}!\\nSkor Sementara: \${finalScore}/100\`;
        
      alert(message);`;

content = content.replace(oldSubmitBlock, newSubmitBlock);

fs.writeFileSync('src/App.tsx', content);
