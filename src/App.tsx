import React, { useState, useMemo, useEffect } from 'react';
import { FileText, Calculator, AlertTriangle, CheckCircle2, XCircle, LogOut, ChevronDown, ChevronUp } from 'lucide-react';
import { checklistData, Golongan } from './data';
import { db, auth, signInWithGoogle, logout, handleFirestoreError, OperationType } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { exportToWord } from './exportUtils';

const IS_PREVIEW = false; // Set false jika akan di-deploy ke Apps Script asli
const GAS_URL = "https://script.google.com/macros/s/AKfycbxf3ThL0mB1IC6U9gWD7-odpmnK_dZSkJIyXJws2FE-HAos2y4SEGAxw9ZkOfSfY8yl/exec";

type Answer = 'YA' | 'TIDAK';

const ProgresivoLogo = () => (
  <svg viewBox="0 0 280 60" className="h-10 w-auto" xmlns="http://www.w3.org/2000/svg">
    {/* Icon */}
    <g transform="translate(0, 5)">
      {/* Box */}
      <rect x="2" y="2" width="46" height="46" rx="8" fill="none" stroke="#F15A24" strokeWidth="3"/>
      
      {/* Left Orange Bar */}
      <path d="M 8 40 L 20 28 L 20 40 L 14 46 Z" fill="#F15A24" />
      
      {/* Middle Yellow Bar */}
      <path d="M 18 28 L 30 16 L 30 40 L 24 46 Z" fill="#F7931E" />
      
      {/* Right Blue Bar */}
      <path d="M 28 16 L 40 4 L 40 40 L 34 46 Z" fill="#003d79" />
    </g>
    
    {/* Text */}
    <text x="60" y="32" fontFamily="sans-serif" fontWeight="900" fontSize="26" fill="#001F3F" letterSpacing=".5">PROGRESIVO</text>
    <text x="62" y="47" fontFamily="sans-serif" fontWeight="700" fontSize="11" fill="#001F3F" letterSpacing="4.5">CONSULTING</text>
    
    {/* Bottom Orange Line */}
    <line x1="60" y1="53" x2="250" y2="53" stroke="#F15A24" strokeWidth="2"/>
  </svg>
);

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [namaSPPG, setNamaSPPG] = useState('');
  const [alamatSPPG, setAlamatSPPG] = useState('');
  const [namaAuditor, setNamaAuditor] = useState('');
  const [tanggalEvaluasi, setTanggalEvaluasi] = useState('');
  const [golongan, setGolongan] = useState<Golongan>('A');
  
  // State for answers. Key is item ID, value is 'YA' or 'TIDAK'
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [labResultAir, setLabResultAir] = useState(false);
  const [labResultMakanan, setLabResultMakanan] = useState(false);
  const [kesimpulan, setKesimpulan] = useState('');
  const [namaPemeriksa, setNamaPemeriksa] = useState('');
  const [namaPengelola, setNamaPengelola] = useState('');
  const [expandedSubsections, setExpandedSubsections] = useState<Record<string, boolean>>({
    [checklistData[0]?.subsections[0]?.id]: true // Expand the first subsection by default
  });

  const [expandedInfoSections, setExpandedInfoSections] = useState<Record<string, boolean>>({
    '3.1': false,
    '3.2': false,
    '3.3-3.5': false,
    '3.6': false,
    '3.7': false,
    '3.8': false,
    '3.9': false,
    '3.10-3.12': false,
    '3.13': false
  });

  const toggleInfoSection = (section: string) => {
    setExpandedInfoSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleSubsection = (subId: string) => {
    setExpandedSubsections(prev => ({
      ...prev,
      [subId]: !prev[subId]
    }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAnswerChange = (id: string, value: Answer) => {
    setAnswers(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Calculate penalties
  const penaltyStats = useMemo(() => {
    let total = 0;
    let critical = 0;
    let major = 0;
    let minor = 0;
    const criticalItems: { id: string; kriteria: string; }[] = [];
    const majorItems: { id: string; kriteria: string; }[] = [];
    const minorItems: { id: string; kriteria: string; }[] = [];
    
    checklistData.forEach(section => {
      section.subsections.forEach(sub => {
        sub.items.forEach(item => {
          if (item.penalties && answers[item.id] === 'TIDAK') {
            const penalty = item.penalties[golongan];
            if (typeof penalty === 'number') {
              total += penalty;
              if (penalty === 3) {
                critical++;
                criticalItems.push({ id: item.id, kriteria: item.kriteria });
              }
              else if (penalty === 2) {
                major++;
                majorItems.push({ id: item.id, kriteria: item.kriteria });
              }
              else if (penalty === 1) {
                minor++;
                minorItems.push({ id: item.id, kriteria: item.kriteria });
              }
            }
          }
        });
      });
    });
    return { total, critical, major, minor, criticalItems, majorItems, minorItems };
  }, [answers, golongan]);

  const totalPenalty = penaltyStats.total;

  const maxPenalty = useMemo(() => {
    if (golongan === 'A') return 349;
    if (golongan === 'B') return 403;
    return 407;
  }, [golongan]);

  const finalScoreNum = useMemo(() => {
    return Math.max(0, 100 - ((totalPenalty / maxPenalty) * 100));
  }, [totalPenalty, maxPenalty]);
  
  const finalScore = finalScoreNum.toFixed(2);

  // Calculate completeness
  const progressStats = useMemo(() => {
    let totalQuestions = 0;
    let answered = 0;
    checklistData.forEach(section => {
      section.subsections.forEach(sub => {
        sub.items.forEach(item => {
          if (item.penalties) {
            totalQuestions++;
            if (answers[item.id]) answered++;
          }
        });
      });
    });
    return {
      totalQuestions,
      answered,
      isComplete: totalQuestions > 0 && answered === totalQuestions
    };
  }, [answers]);

  const handleSubmit = async () => {
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
        ? `Audit Selesai dan Berhasil Disimpan ${IS_PREVIEW ? '(Mode Preview)' : 'ke Database'}!\nSkor Akhir: ${finalScore}/100`
        : `Progress Audit Berhasil Disimpan ${IS_PREVIEW ? '(Mode Preview)' : 'ke Database'}!\nSkor Sementara: ${finalScore}/100`;
        
      alert(message);
      // Reset form
      setNamaSPPG('');
      setAlamatSPPG('');
      setNamaAuditor('');
      setTanggalEvaluasi('');
      setAnswers({});
      setLabResultAir(false);
      setLabResultMakanan(false);
      setKesimpulan('');
      setNamaPemeriksa('');
      setNamaPengelola('');
      setGolongan('A');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'audits');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">
        Memuat...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-200/60 max-w-md w-full text-center border border-slate-100">
          <FileText className="w-16 h-16 text-[#F15A24] mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Audit Laik Higiene</h2>
          <p className="text-slate-600 mb-8">Silakan login menggunakan akun Google untuk mengakses formulir audit.</p>
          <button 
            onClick={signInWithGoogle}
            className="w-full bg-[#003d79] text-white font-semibold py-3 px-4 rounded-lg hover:bg-[#002f5e] transition shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-200/60"
          >
            Login dengan Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-800 font-sans pb-32 selection:bg-[#003d79] selection:text-white relative"><div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-[#003d79]/5 to-transparent pointer-events-none"></div>
      {/* Top Header */}
      <header className="bg-white/70 backdrop-blur-xl text-slate-800 shadow-[0_4px_30px_rgba(0,0,0,0.03)] sticky top-0 z-50 border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <ProgresivoLogo />
            <div className="hidden md:block border-l-2 border-slate-200 pl-4">
              <h1 className="text-sm font-serif font-bold text-[#003d79] tracking-widest uppercase leading-tight">
                Checklist Pemenuhan Persyaratan<br/>
                Sertifikasi Laik Higiene dan Sanitasi
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-slate-50 px-4 py-1.5 rounded-full border border-blue-100">
              <Calculator className="w-4 h-4 mr-2 text-[#F15A24]" />
              <div className="flex flex-col items-end leading-tight">
                <span className="text-[10px] font-medium text-[#003d79]">Total Ketidaksesuaian: {totalPenalty}</span>
                <div className="flex items-baseline text-slate-800">
                  <span className="text-sm font-medium mr-1">Skor:</span>
                  <span className="font-bold text-lg">{finalScore}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={logout}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors flex items-center"
              title="Logout"
            >
              <LogOut className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#003d79] to-[#001F3F] rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-10 md:p-14 mb-10 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#F15A24] rounded-full mix-blend-multiply filter blur-[80px] opacity-40 translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#F7931E] rounded-full mix-blend-multiply filter blur-[80px] opacity-30 -translate-x-1/3 translate-y-1/3"></div>
          
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight leading-[1.1] text-shadow-sm mb-6">
              Sertifikasi Laik Higiene <br className="hidden sm:block"/> dan Sanitasi
            </h2>
            <p className="text-slate-300 text-lg md:text-xl font-medium tracking-wide">
              Pedoman Keamanan Pangan & Pemenuhan Gizi
            </p>
          </div>
        </section>

        {/* 3.1 Section */}
        <section className="bg-white rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-200/60 p-8 md:p-10 mb-8 relative overflow-hidden">
          <div className="relative z-10 w-full text-left">
            <button
              onClick={() => toggleInfoSection('3.1')}
              className="w-full flex items-center justify-between text-left group"
            >
              <div className="text-xl md:text-2xl font-serif font-bold text-[#003d79] border-l-4 border-[#F15A24] pl-4 group-hover:text-[#F15A24] transition-colors">
                3.1. Persyaratan Acuan
              </div>
              {expandedInfoSections['3.1'] ? (
                <ChevronUp className="w-6 h-6 text-[#003d79] ml-4 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-6 h-6 text-[#003d79] ml-4 flex-shrink-0" />
              )}
            </button>

            {expandedInfoSections['3.1'] && (
              <div className="mt-6 animation-fade-in">
                <p className="text-slate-700 mb-5 text-lg">
                  Persyaratan acuan Standar Sertifikat Laik Higiene Sanitasi mencakup:
                </p>

                <ol className="list-decimal list-outside ml-5 space-y-4 text-slate-600 leading-relaxed md:text-lg">
                  <li className="pl-2">
                    Undang-Undang Nomor 17 Tahun 2023 tentang Kesehatan (Lembaran Negara Republik Indonesia Tahun 2023 Nomor 105, Tambahan Lembaran Negara Republik Indonesia Nomor 6887);
                  </li>
                  <li className="pl-2">
                    Peraturan Pemerintah Nomor 5 Tahun 2021 tentang Penyelenggaraan Perizinan Berusaha Berbasis Risiko (Lembaran Negara Republik Indonesia Tahun 2021 Nomor 15, Tambahan Lembaran Negara Republik Indonesia Nomor 6617);
                  </li>
                  <li className="pl-2">
                    Peraturan Pemerintah Nomor 28 Tahun 2024 tentang Peraturan Pelaksanaan Undang-Undang Nomor 17 Tahun 2023 tentang Kesehatan (Lembaran Negara Republik Indonesia Tahun 2024 Nomor 135, Tambahan Lembaran Negara Republik Indonesia Nomor 6952); dan
                  </li>
                  <li className="pl-2">
                    Peraturan Menteri Kesehatan Republik Indonesia Nomor 17 Tahun 2024 tentang Perubahan Kedua atas Peraturan Menteri Kesehatan Nomor 14 Tahun 2021 tentang Standar Kegiatan Usaha dan Produk pada Penyelenggaraan Perizinan Berusaha Berbasis Risiko Sektor Kesehatan lampiran F;
                  </li>
                </ol>
              </div>
            )}
          </div>
        </section>

        {/* Tahapan Sertifikasi Info */}
        <section className="bg-[white] rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-200/60 p-8 md:p-10 mb-8 relative overflow-hidden">
          <div className="relative z-10 w-full text-left">
            <button
              onClick={() => toggleInfoSection('3.2')}
              className="w-full flex items-center justify-between text-left group"
            >
              <div className="text-xl md:text-2xl font-serif font-bold text-[#003d79] border-l-4 border-[#F15A24] pl-4 group-hover:text-[#F15A24] transition-colors">
                3.2. Tahapan Sertifikasi Laik Higiene dan Sanitasi
              </div>
              {expandedInfoSections['3.2'] ? (
                <ChevronUp className="w-6 h-6 text-[#003d79] ml-4 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-6 h-6 text-[#003d79] ml-4 flex-shrink-0" />
              )}
            </button>

            {expandedInfoSections['3.2'] && (
              <div className="columns-1 md:columns-2 gap-8 text-[#001F3F] text-sm md:text-base leading-relaxed mt-6">
                <p className="mb-5">
                  Alur sertifikasi SLHS (Sertifikat Laik Hygiene Sanitasi) untuk Jasa Boga Golongan B dimulai dengan pemohon mengajukan permohonan kepada Dinas Kesehatan setempat, dilampiri dengan persyaratan administratif seperti fotokopi KTP, dan formulir permohonan. Selanjutnya, petugas Dinas Kesehatan akan melakukan kunjungan inspeksi ke lokasi jasa boga untuk menilai kelayakan sanitasi, kebersihan lingkungan, dan mengambil sampel air dan makanan. Hasil penilaian dan sampel akan dianalisis, dan jika memenuhi syarat, sertifikat SLHS akan diterbitkan. Jika tidak memenuhi syarat, pemohon akan diminta untuk melakukan perbaikan dan permohonan diulang.
                </p>

                <ol className="list-decimal list-outside ml-5 space-y-4">
                  <li className="pl-2 break-inside-avoid">
                    <span className="font-semibold block mb-1">Pemohon Ajukan Permohonan:</span>
                    Pemohon mengajukan permohonan sertifikasi SLHS kepada Kepala Dinas Kesehatan Kabupaten/Kota setempat.
                  </li>
                  <li className="pl-2 break-inside-avoid">
                    <span className="font-semibold block mb-1">Verifikasi Berkas:</span>
                    Petugas Dinas Kesehatan akan memverifikasi kelengkapan berkas permohonan.
                  </li>
                  <li className="pl-2 break-inside-avoid">
                    <span className="font-semibold block mb-1">Kunjungan dan Inspeksi:</span>
                    Tim Dinas Kesehatan melakukan kunjungan ke lokasi jasa boga untuk menilai kebersihan lingkungan, pengambilan sampel air dan makanan, serta pemeriksaan kesehatan karyawan.
                  </li>
                  <li className="pl-2 break-inside-avoid">
                    <span className="font-semibold block mb-1">Uji Laboratorium:</span>
                    Sampel air dan makanan yang diambil akan diuji di laboratorium untuk memastikan keamanannya.
                  </li>
                  <li className="pl-2 break-inside-avoid">
                    <span className="font-semibold block mb-1">Penerbitan Sertifikat (Jika Memenuhi Syarat):</span>
                    Jika hasil inspeksi dan uji laboratorium memenuhi syarat, sertifikat SLHS akan diterbitkan.
                  </li>
                  <li className="pl-2 break-inside-avoid">
                    <span className="font-semibold block mb-1">Perbaikan (Jika Tidak Memenuhi Syarat):</span>
                    Jika hasil inspeksi dan uji laboratorium tidak memenuhi syarat, pemohon akan diberikan saran perbaikan dan proses sertifikasi harus diulang.
                  </li>
                  <li className="pl-2 break-inside-avoid">
                    <span className="font-semibold block mb-1">Penandatanganan:</span>
                    Sertifikat Laik Hygiene Sanitasi akan ditandatangani oleh Kepala Dinas Kesehatan setelah melalui beberapa tahap paraf, seperti Kepala Seksi Kesehatan Lingkungan, Kepala Bidang Kesehatan Masyarakat, dan Sekretaris Dinas Kesehatan.
                  </li>
                </ol>
              </div>
            )}
          </div>
        </section>

        {/* 3.3 to 3.5 sections */}
        <section className="bg-[white] rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-200/60 p-8 md:p-10 mb-8 relative overflow-hidden">
          <div className="relative z-10 w-full text-left space-y-8">
            <button
              onClick={() => toggleInfoSection('3.3-3.5')}
              className="w-full flex items-center justify-between text-left group"
            >
              <div className="text-xl md:text-2xl font-serif font-bold text-[#003d79] border-l-4 border-[#F15A24] pl-4 group-hover:text-[#F15A24] transition-colors">
                3.3 - 3.5. Penilaian & Prosedur Administratif
              </div>
              {expandedInfoSections['3.3-3.5'] ? (
                <ChevronUp className="w-6 h-6 text-[#003d79] ml-4 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-6 h-6 text-[#003d79] ml-4 flex-shrink-0" />
              )}
            </button>

            {expandedInfoSections['3.3-3.5'] && (
              <div className="space-y-8 mt-6">
                <div>
                  <div className="inline-block bg-[#F15A24] text-white font-bold px-5 py-2 rounded-full mb-4 text-sm md:text-base border-2 border-white">
                    3.3. Jenis Kegiatan Penilaian Kesesuaian
                  </div>
                  <p className="text-[#001F3F] md:text-lg leading-relaxed ml-2">
                    Penilaian kesesuaian untuk memperoleh Sertifikat Laik Higiene Sanitasi (SLHS) dilakukan oleh Dinas Kesehatan Kabupaten/Kota atau otoritas kesehatan terkait.
                  </p>
                </div>

                <div>
                  <div className="inline-block bg-[#F15A24] text-white font-bold px-5 py-2 rounded-full mb-4 text-sm md:text-base border-2 border-white">
                    3.4. Penerapan Kegiatan Penilaian Kesesuaian Pada SPPG
                  </div>
                  <div className="text-[#001F3F] md:text-lg leading-relaxed ml-2">
                    <p className="mb-3">
                      Penerapan Skema Penilaian Kesesuaian bagi SPPG dilakukan dengan mempertimbangkan kondisi SPPG yang mencakup:
                    </p>
                    <ol className="list-[lower-alpha] list-outside ml-6 space-y-2">
                      <li className="pl-2">ruang lingkup dan lokasi SPPG;</li>
                      <li className="pl-2">jumlah personel;</li>
                      <li className="pl-2">risiko ketidaksesuaian;</li>
                      <li className="pl-2">kompleksitas Proses;</li>
                      <li className="pl-2">kompleksitias produksi; dan/atau</li>
                      <li className="pl-2">kompleksitas layanan.</li>
                    </ol>
                  </div>
                </div>

                <div>
                  <div className="inline-block bg-[#F15A24] text-white font-bold px-5 py-2 rounded-full mb-4 text-sm md:text-base border-2 border-white">
                    3.5. Prosedur Administratif Pengajuan permohonan Sertifikasi Laik Higiene Sanitasi
                  </div>
                  <div className="text-[#001F3F] md:text-lg leading-relaxed ml-2 space-y-6">
                    <p>
                      Prosedur Adiministrative pelaksanaan Standar Sertifikat Laik Higiene Sanitasi pada Satuan Pelayanan Pemenuhan Gizi (SPPG) dengan KBLI 56290 Penyediaan Jasa Boga sesuai dengan Peraturan Menteri Kesehatan Republik Indonesia Nomor 17 Tahun 2024 tentang Perubahan Kedua atas Peraturan Menteri Kesehatan Nomor 14 Tahun 2021 tentang Standar Kegiatan Usaha dan Produk pada Penyelenggaraan Perizinan Berusaha Berbasis Risiko Sektor Kesehatan lampiran F bagian Persyaratan Umum Usaha.
                    </p>
                    <div>
                      <h4 className="font-bold text-xl mb-3">3.5.1. Seleksi Sertifikasi Laik Higiene Sanitasi</h4>
                      <p>
                        Dinas Kesehatan yang berwenang harus memastikan bahwa informasi yang diperoleh dari pengajuan permohonan SLHS oleh SPPG telah lengkap dan memenuhi persyaratan sesuai Formulir Inspeksi Kesehatan Lingkungan (IKL) dan ketentuan dalam Peraturan Menteri Kesehatan Republik Indonesia Nomor 17 Tahun 2024 tentang Perubahan Kedua atas Peraturan Menteri Kesehatan Nomor 14 Tahun 2021 tentang Standar Kegiatan Usaha dan Produk pada Penyelenggaraan Perizinan Berusaha Berbasis Risiko Sektor Kesehatan lampiran F.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-bold text-xl mb-3">3.5.2. Determinasi Sertifikasi Laik Higiene Sanitasi</h4>
                      <p>
                        Pelaksanaan determinasi atau verifikasi lapangan terhadap permohonan Sertifikat Laik Higiene Sanitasi (SLHS) untuk SPPG dilakukan oleh Dinas Kesehatan melalui inspeksi sarana dan evaluasi pemenuhan persyaratan berdasarkan Formulir Inspeksi Kesehatan Lingkungan (IKL), sebagaimana tercantum dalam Peraturan Menteri Kesehatan Republik Indonesia Nomor 17 Tahun 2024 tentang Perubahan Kedua atas Peraturan Menteri Kesehatan Nomor 14 Tahun 2021 tentang Standar Kegiatan Usaha dan Produk pada Penyelenggaraan Perizinan Berusaha Berbasis Risiko Sektor Kesehatan lampiran F.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-bold text-xl mb-3">3.5.3. Tinjauan Sertifikasi Laik Higiene Sanitasi</h4>
                      <p>
                        Tinjauan terhadap hasil inspeksi dan verifikasi kesehatan lingkungan dilakukan oleh tim penilai dari dinas kesehatan untuk menetapkan rekomendasi penerbitan Sertifikat Laik Higiene Sanitasi, sebagaimana dijelaskan dalam Peraturan Menteri Kesehatan Republik Indonesia Nomor 17 Tahun 2024 tentang Perubahan Kedua atas Peraturan Menteri Kesehatan Nomor 14 Tahun 2021 tentang Standar Kegiatan Usaha dan Produk pada Penyelenggaraan Perizinan Berusaha Berbasis Risiko Sektor Kesehatan lampiran F.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-bold text-xl mb-3">3.5.4. Penetapan Keputusan Sertifikasi Laik Higiene Sanitasi</h4>
                      <p className="mb-4">
                        Penetapan keputusan Sertifikasi Laik Higiene Sanitasi dilakukan oleh pejabat Dinas Kesehatan Kabupaten/Kota berdasarkan hasil pemeriksaan administrasi dan lapangan yang tertuang dalam Berita Acara Tim Pemeriksa atau Tim Validasi. Keputusan tersebut didasarkan pada tiga komponen utama, yaitu hasil inspeksi kesehatan lingkungan, hasil laboratorium, serta bukti pelatihan higiene sanitasi oleh pengelola, penanggung jawab, dan/atau penjamah.
                      </p>
                      <p>
                        Berdasarkan hasil tersebut, Dinas Kesehatan menetapkan apakah tempat pengelolaan pangan direkomendasikan atau tidak direkomendasikan untuk memperoleh Sertifikat Laik Higiene Sanitasi. Keputusan tersebut dituangkan secara resmi dalam Surat Rekomendasi Penerbitan Sertifikat Laik Higiene Sanitasi dan menjadi dasar penerbitan atau penolakan sertifikat.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-bold text-xl mb-3">3.5.5. Bukti Kesesuaian Sertifikasi Laik Higiene Sanitasi</h4>
                      <p>
                        Bukti kesesuaian bagi Tempat Pengelolaan Pangan (TPP) yang telah memenuhi persyaratan diberikan dalam bentuk Sertifikat Laik Higiene Sanitasi (SLHS) sebagaimana tercantum dalam Peraturan Menteri Kesehatan Republik Indonesia Nomor 17 Tahun 2024 tentang Perubahan Kedua atas Peraturan Menteri Kesehatan Nomor 14 Tahun 2021 tentang Standar Kegiatan Usaha dan Produk pada Penyelenggaraan Perizinan Berusaha Berbasis Risiko Sektor Kesehatan lampiran F. Sertifikat ini diterbitkan oleh Dinas Kesehatan Kabupaten/Kota berdasarkan hasil verifikasi administrasi dan inspeksi lapangan yang tertuang dalam berita acara penilaian kesesuaian. Format sertifikat memuat informasi identitas TPP, nama dan alamat pengelola atau penanggung jawab, serta ditandatangani oleh Kepala Dinas Kesehatan dan distempel instansi. Dalam dokumen resmi disebutkan bahwa masa berlaku Sertifikat Laik Higiene Sanitasi adalah selama 3 (tiga) tahun sejak tanggal diterbitkan.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 3.6 Section */}
        <section className="bg-[white] rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-200/60 p-8 md:p-10 mb-8 relative overflow-hidden">
          <div className="relative z-10 w-full text-left">
            <button
              onClick={() => toggleInfoSection('3.6')}
              className="w-full flex items-center justify-between text-left group"
            >
              <div className="text-xl md:text-2xl font-serif font-bold text-[#003d79] border-l-4 border-[#F15A24] pl-4 group-hover:text-[#F15A24] transition-colors">
                3.6. Pemeliharaan Sertifikasi Laik Higiene Sanitasi
              </div>
              {expandedInfoSections['3.6'] ? (
                <ChevronUp className="w-6 h-6 text-[#003d79] ml-4 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-6 h-6 text-[#003d79] ml-4 flex-shrink-0" />
              )}
            </button>

            {expandedInfoSections['3.6'] && (
              <div className="mt-6 animation-fade-in text-[#001F3F] md:text-lg leading-relaxed space-y-6">
                <p>
                  Pemeliharaan Sertifikat Laik Higiene Sanitasi (SLHS) dilakukan melalui pengawasan dan pembinaan oleh Dinas Kesehatan Kabupaten/Kota sebagaimana diatur dalam Peraturan Menteri Kesehatan Republik Indonesia Nomor 17 Tahun 2024 tentang Perubahan Kedua atas Peraturan Menteri Kesehatan Nomor 14 Tahun 2021 tentang Standar Kegiatan Usaha dan Produk pada Penyelenggaraan Perizinan Berusaha Berbasis Risiko Sektor Kesehatan lampiran F. Pengawasan dilakukan secara berkala atau insidental melalui Inspeksi Kesehatan Lingkungan (IKL) oleh petugas sanitarian yang telah dilatih. Bila ditemukan ketidaksesuaian berat, Dinas Kesehatan dapat merekomendasikan pencabutan SLHS. Selain itu, pembinaan dilakukan melalui pelatihan teknis dan bimbingan untuk memastikan pemenuhan standar higiene dan sanitasi oleh pelaku usaha.
                </p>
                <div>
                  <h4 className="font-bold text-xl mb-3">3.6.1 Sertifikasi SLHS Ulang</h4>
                  <p>
                    Sertifikasi ulang Sertifikat Laik Higiene Sanitasi (SLHS) dilakukan oleh Dinas Kesehatan Kabupaten/Kota sesuai dengan ketentuan peraturan perundang-undangan yang berlaku.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 3.7 Section */}
        <section className="bg-[white] rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-200/60 p-8 md:p-10 mb-8 relative overflow-hidden">
          <div className="relative z-10 w-full text-left">
            <button
              onClick={() => toggleInfoSection('3.7')}
              className="w-full flex items-center justify-between text-left group"
            >
              <div className="text-xl md:text-2xl font-serif font-bold text-[#003d79] border-l-4 border-[#F15A24] pl-4 group-hover:text-[#F15A24] transition-colors">
                3.7. Evaluasi khusus Sertifikat Laik Higiene Sanitasi
              </div>
              {expandedInfoSections['3.7'] ? (
                <ChevronUp className="w-6 h-6 text-[#003d79] ml-4 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-6 h-6 text-[#003d79] ml-4 flex-shrink-0" />
              )}
            </button>

            {expandedInfoSections['3.7'] && (
              <div className="mt-6 animation-fade-in text-[#001F3F] md:text-lg leading-relaxed">
                <p>
                  Evaluasi khusus dilakukan oleh Dinas Kesehatan sebagai tindak lanjut atas temuan atau pengaduan masyarakat terhadap Tempat Pengelolaan Pangan (TPP) yang telah memiliki Sertifikat Laik Higiene Sanitasi (SLHS). Berdasarkan Peraturan Menteri Kesehatan Republik Indonesia Nomor 17 Tahun 2024 tentang Perubahan Kedua atas Peraturan Menteri Kesehatan Nomor 14 Tahun 2021 tentang Standar Kegiatan Usaha dan Produk pada Penyelenggaraan Perizinan Berusaha Berbasis Risiko Sektor Kesehatan lampiran F, apabila dalam evaluasi ditemukan pelanggaran berat atau ketidaksesuaian yang berdampak terhadap kesehatan masyarakat, Kepala Dinas Kesehatan dapat merekomendasikan pencabutan SLHS kepada instansi penerbit dan menyampaikan laporan kepada pembina usaha (Bagian C angka 6). Evaluasi dilakukan melalui inspeksi kesehatan lingkungan dan dapat disertai tindakan pembinaan atau sanksi administratif sesuai ketentuan peraturan perundang-undangan.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* 3.8 Section */}
        <section className="bg-[white] rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-200/60 p-8 md:p-10 mb-8 relative overflow-hidden">
          <div className="relative z-10 w-full text-left">
            <button
              onClick={() => toggleInfoSection('3.8')}
              className="w-full flex items-center justify-between text-left group"
            >
              <div className="text-xl md:text-2xl font-serif font-bold text-[#003d79] border-l-4 border-[#F15A24] pl-4 group-hover:text-[#F15A24] transition-colors">
                3.8. Ketentuan Penambahan dan pengurangan Sertifikat Laik Higiene Sanitasi
              </div>
              {expandedInfoSections['3.8'] ? (
                <ChevronUp className="w-6 h-6 text-[#003d79] ml-4 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-6 h-6 text-[#003d79] ml-4 flex-shrink-0" />
              )}
            </button>

            {expandedInfoSections['3.8'] && (
              <div className="mt-6 animation-fade-in text-[#001F3F] md:text-lg leading-relaxed">
                <p>
                  Perubahan jenis usaha, kategori, atau data teknis seperti alamat, klasifikasi jasa boga (Golongan A/B/C), atau jenis TPP dapat ditindaklanjuti dengan permohonan baru atau pembaruan dokumen melalui Dinas Kesehatan dan DPMPTSP setempat, disertai verifikasi ulang melalui Inspeksi Kesehatan Lingkungan (IKL) sebagaimana tercantum dalam Peraturan Menteri Kesehatan Republik Indonesia Nomor 17 Tahun 2024 tentang Perubahan Kedua atas Peraturan Menteri Kesehatan Nomor 14 Tahun 2021 tentang Standar Kegiatan Usaha dan Produk pada Penyelenggaraan Perizinan Berusaha Berbasis Risiko Sektor Kesehatan lampiran F.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* 3.9 Section */}
        <section className="bg-[white] rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-200/60 p-8 md:p-10 mb-8 relative overflow-hidden">
          <div className="relative z-10 w-full text-left">
            <button
              onClick={() => toggleInfoSection('3.9')}
              className="w-full flex items-center justify-between text-left group"
            >
              <div className="text-xl md:text-2xl font-serif font-bold text-[#003d79] border-l-4 border-[#F15A24] pl-4 group-hover:text-[#F15A24] transition-colors">
                3.9. Pembekuan dan Pencabutan Sertifikat kesesuaian Laik Higiene Sanitasi
              </div>
              {expandedInfoSections['3.9'] ? (
                <ChevronUp className="w-6 h-6 text-[#003d79] ml-4 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-6 h-6 text-[#003d79] ml-4 flex-shrink-0" />
              )}
            </button>

            {expandedInfoSections['3.9'] && (
              <div className="mt-6 animation-fade-in text-[#001F3F] md:text-lg leading-relaxed">
                <p>
                  Berdasarkan Peraturan Menteri Kesehatan Republik Indonesia Nomor 17 Tahun 2024 tentang Perubahan Kedua atas Peraturan Menteri Kesehatan Nomor 14 Tahun 2021 tentang Standar Kegiatan Usaha dan Produk pada Penyelenggaraan Perizinan Berusaha Berbasis Risiko Sektor Kesehatan lampiran F, Kepala Dinas Kesehatan Kabupaten/Kota atau otoritas kesehatan berwenang dapat memberikan rekomendasi pencabutan SLHS apabila hasil pengawasan atau inspeksi menunjukkan adanya ketidaksesuaian berat terhadap standar higiene dan sanitasi. Ketidaksesuaian ini dapat berasal dari pelanggaran berulang, penolakan untuk diawasi, atau temuan pengaduan masyarakat yang terverifikasi.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* 3.10 - 3.12 Section */}
        <section className="bg-[white] rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-200/60 p-8 md:p-10 mb-8 relative overflow-hidden">
          <div className="relative z-10 w-full text-left">
            <button
              onClick={() => toggleInfoSection('3.10-3.12')}
              className="w-full flex items-center justify-between text-left group"
            >
              <div className="text-xl md:text-2xl font-serif font-bold text-[#003d79] border-l-4 border-[#F15A24] pl-4 group-hover:text-[#F15A24] transition-colors">
                3.10 - 3.12. Keluhan, Informasi Publik & Transfer Sertifikasi
              </div>
              {expandedInfoSections['3.10-3.12'] ? (
                <ChevronUp className="w-6 h-6 text-[#003d79] ml-4 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-6 h-6 text-[#003d79] ml-4 flex-shrink-0" />
              )}
            </button>

            {expandedInfoSections['3.10-3.12'] && (
              <div className="space-y-8 mt-6">
                <div>
                  <div className="inline-block bg-[#F15A24] text-white font-bold px-5 py-2 rounded-full mb-4 text-sm md:text-base border-2 border-white">
                    3.10. Keluhan dan Banding Sertifikasi Laik Higiene Sanitasi
                  </div>
                  <p className="text-[#001F3F] md:text-lg leading-relaxed ml-2">
                    Pelaku usaha atau masyarakat dapat menyampaikan keluhan atau pengaduan atas pelaksanaan pengawasan dan penerbitan Sertifikat Laik Higiene Sanitasi (SLHS) melalui saluran resmi Dinas Kesehatan Kabupaten/Kota atau otoritas kesehatan terkait. Berdasarkan Peraturan Menteri Kesehatan Republik Indonesia Nomor 17 Tahun 2024 tentang Perubahan Kedua atas Peraturan Menteri Kesehatan Nomor 14 Tahun 2021 tentang Standar Kegiatan Usaha dan Produk pada Penyelenggaraan Perizinan Berusaha Berbasis Risiko Sektor Kesehatan lampiran F, saluran pengaduan dapat disampaikan melalui hotline, nomor telepon, media sosial, atau surat elektronik sesuai kewenangan masing-masing otoritas.
                  </p>
                </div>

                <div>
                  <div className="inline-block bg-[#F15A24] text-white font-bold px-5 py-2 rounded-full mb-4 text-sm md:text-base border-2 border-white">
                    3.11. Informasi Publik Sertifikat Laik Higiene Sanitasi
                  </div>
                  <p className="text-[#001F3F] md:text-lg leading-relaxed ml-2">
                    Tempat Pengelolaan Pangan (TPP) yang telah memperoleh Sertifikat Laik Higiene Sanitasi (SLHS) diwajibkan mencantumkan informasi SLHS di lokasi usaha, kemasan produk, atau media promosi yang mudah terlihat oleh masyarakat. Selain itu, TPP yang menggunakan tempat atau kemasan pangan wajib mencantumkan logo, nomor SLHS, dan/atau barcode pada wadah pangan sebagaimana diatur dalam Peraturan Menteri Kesehatan Republik Indonesia Nomor 17 Tahun 2024 tentang Perubahan Kedua atas Peraturan Menteri Kesehatan Nomor 14 Tahun 2021 tentang Standar Kegiatan Usaha dan Produk pada Penyelenggaraan Perizinan Berusaha Berbasis Risiko Sektor Kesehatan lampiran F.
                  </p>
                </div>

                <div>
                  <div className="inline-block bg-[#F15A24] text-white font-bold px-5 py-2 rounded-full mb-4 text-sm md:text-base border-2 border-white">
                    3.12. Transfer Sertifikasi
                  </div>
                  <div className="text-[#001F3F] md:text-lg leading-relaxed ml-2">
                    <p className="mb-3">
                      Transfer Sertifikat Laik Higiene Sanitasi (SLHS) dapat dilakukan dalam hal tertentu, yaitu apabila:
                    </p>
                    <ol className="list-[lower-alpha] list-outside ml-6 space-y-2">
                      <li className="pl-2">Dinas Kesehatan yang menerbitkan Sertifikat SLHS tidak memperpanjang akreditasi atau status akreditasinya dicabut; atau</li>
                      <li className="pl-2">Adanya kebutuhan administratif sesuai ketentuan peraturan perundang-undangan yang berlaku.</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 3.13 Section */}
        <section className="bg-[white] rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-200/60 p-8 md:p-10 mb-8 relative overflow-hidden">
          <div className="relative z-10 w-full text-left">
            <button
              onClick={() => toggleInfoSection('3.13')}
              className="w-full flex items-center justify-between text-left group"
            >
              <div className="text-xl md:text-2xl font-serif font-bold text-[#003d79] border-l-4 border-[#F15A24] pl-4 group-hover:text-[#F15A24] transition-colors">
                3.13. Penggunaan Logo Bukti Kesesuaian
              </div>
              {expandedInfoSections['3.13'] ? (
                <ChevronUp className="w-6 h-6 text-[#003d79] ml-4 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-6 h-6 text-[#003d79] ml-4 flex-shrink-0" />
              )}
            </button>

            {expandedInfoSections['3.13'] && (
              <div className="mt-6 animation-fade-in text-[#001F3F] md:text-lg leading-relaxed">
                <p>
                  Tempat Pengelolaan Pangan (TPP) yang telah memperoleh Sertifikat Laik Higiene Sanitasi (SLHS) diwajibkan mencantumkan logo dan nomor SLHS serta/atau barcode pada tempat usaha, kemasan pangan, atau media promosi. Hal ini bertujuan untuk memberikan informasi yang mudah diakses kepada konsumen serta meningkatkan transparansi dan kepercayaan publik terhadap keamanan pangan. Ketentuan ini tertuang dalam Peraturan Menteri Kesehatan Republik Indonesia Nomor 17 Tahun 2024 tentang Perubahan Kedua atas Peraturan Menteri Kesehatan Nomor 14 Tahun 2021 tentang Standar Kegiatan Usaha dan Produk pada Penyelenggaraan Perizinan Berusaha Berbasis Risiko Sektor Kesehatan lampiran F.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Info Form Card */}
        <section className="bg-white rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-200/60 border border-slate-200 p-6 mb-8 transform transition-all hover:shadow-md">
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
            <h2 className="text-2xl font-serif font-bold text-[#001F3F]">Informasi Fasilitas</h2>
            {IS_PREVIEW && (
              <button
                type="button"
                onClick={() => {
                  setNamaSPPG("SPPG Simulasi Jaya");
                  setAlamatSPPG("Jl. Mawar No. 123, Bandung");
                  setNamaAuditor("Dimas Auditor");
                  setTanggalEvaluasi(new Date().toISOString().split('T')[0]);
                  setNamaPemeriksa("Andi Pemeriksa");
                  setNamaPengelola("Budi Pengelola");
                  setGolongan("B");
                  setLabResultAir(true);
                  setLabResultMakanan(true);
                  alert("Data simulasi berhasil diisi!");
                }}
                className="bg-[#F15A24] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#d94a1a] transition-colors shadow-sm"
              >
                Isi Data Simulasi
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 text-left">
              <label className="block text-sm font-medium text-slate-700">Nama SPPG</label>
              <input 
                type="text" 
                value={namaSPPG}
                onChange={(e) => setNamaSPPG(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-[24px] bg-slate-50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-[#003d79] focus:border-[#003d79] transition-colors"
                placeholder="Masukkan Nama SPPG"
              />
            </div>
            <div className="space-y-2 text-left">
              <label className="block text-sm font-medium text-slate-700">Tanggal Evaluasi</label>
              <input 
                type="date" 
                value={tanggalEvaluasi}
                onChange={(e) => setTanggalEvaluasi(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-[24px] bg-slate-50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-[#003d79] focus:border-[#003d79] transition-colors"
              />
            </div>
            <div className="space-y-2 md:col-span-2 text-left">
              <label className="block text-sm font-medium text-slate-700">Alamat SPPG</label>
              <textarea 
                value={alamatSPPG}
                onChange={(e) => setAlamatSPPG(e.target.value)}
                rows={2}
                className="w-full px-4 py-2 border border-slate-200 rounded-[24px] bg-slate-50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-[#003d79] focus:border-[#003d79] transition-colors resize-none"
                placeholder="Masukkan Alamat Lengkap"
              />
            </div>
            <div className="space-y-2 md:col-span-2 text-left">
              <label className="block text-sm font-medium text-slate-700">Nama Pemeriksa</label>
              <input 
                type="text" 
                value={namaAuditor}
                onChange={(e) => setNamaAuditor(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-[24px] bg-slate-50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-[#003d79] focus:border-[#003d79] transition-colors"
                placeholder="Masukkan Nama Pemeriksa"
              />
            </div>
            <div className="space-y-3 md:col-span-2 text-left pt-2 border-t border-slate-100">
              <label className="block text-sm font-medium text-slate-700 mb-1">Golongan SPPG</label>
              <div className="flex gap-4">
                {(['A', 'B', 'C'] as Golongan[]).map((gol) => (
                  <label key={gol} className="flex items-center cursor-pointer group">
                    <input 
                      type="radio" 
                      name="golongan" 
                      value={gol} 
                      checked={golongan === gol}
                      onChange={(e) => setGolongan(e.target.value as Golongan)}
                      className="w-4 h-4 text-[#003d79] border-slate-300 focus:ring-[#003d79]"
                    />
                    <span className={`ml-2 text-sm font-medium group-hover:text-[#003d79] transition-colors ${golongan === gol ? 'text-[#003d79]' : 'text-slate-600'}`}>
                      Golongan {gol}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Form Checklist */}
        <div className="space-y-8">
          {checklistData.map((section) => (
            <div key={section.id} className="bg-white rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-200/60 border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-[#003d79] to-[#001F3F] border-b border-transparent px-8 py-5 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-serif font-bold text-white tracking-wide">{section.name}</h2>
                </div>
                
                {/* Count filled properties */}
                <div className="text-sm font-medium text-white/80 border border-white/20 bg-white/10 px-3 py-1 rounded-full">
                  {Object.keys(answers).filter(id => section.subsections.some(sub => sub.items.some(item => item.id === id))).length} terjawab
                </div>
              </div>
              
              <div className="divide-y divide-slate-100">
                {section.subsections.map((sub) => (
                  <div key={sub.id} className="border-b last:border-b-0 border-slate-100">
                    <div 
                      className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors gap-2"
                      onClick={() => toggleSubsection(sub.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-full ${expandedSubsections[sub.id] ? 'bg-blue-50 text-[#003d79]' : 'bg-slate-200 text-slate-500'}`}>
                          {expandedSubsections[sub.id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                        <h3 className="text-md font-semibold text-[#003d79]">{sub.name}</h3>
                      </div>
                      <div className="text-sm font-medium text-slate-500 md:ml-auto ml-10">
                        {sub.items.filter(item => answers[item.id]).length} / {sub.items.length} terjawab
                      </div>
                    </div>
                    
                    {expandedSubsections[sub.id] && (
                      <div className="p-6 pt-2 space-y-4">
                        {sub.items.map((item) => (
                          <div 
                            key={item.id} 
                            className={`flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-lg border ${
                              answers[item.id] ? 'bg-white border-[#003d79]/20 shadow-sm' : 'bg-slate-50/50 border-slate-200 hover:border-slate-300 transition-colors'
                            } ${item.isSubItem ? 'md:ml-8 border-l-4 border-l-[#003d79]/20' : ''}`}
                          >
                            <div className="flex-1 flex gap-3 text-left">
                              <span className="font-medium text-slate-500 min-w-[24px]">
                                {item.no}.
                              </span>
                              <span className={`text-sm ${!item.penalties ? 'font-semibold text-slate-800' : 'text-slate-700'}`}>
                                {item.kriteria}
                              </span>
                            </div>
                            
                            {item.penalties && (
                              <div className="flex items-center shrink-0 justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                                 <div className="flex bg-slate-100 p-1 rounded-md">
                                  <button
                                    onClick={() => handleAnswerChange(item.id, 'YA')}
                                    className={`flex items-center px-3 py-1.5 rounded text-sm font-medium transition-all ${
                                      answers[item.id] === 'YA' 
                                        ? 'bg-[#1A4B4B] text-white shadow-sm' 
                                        : 'text-slate-600 hover:bg-slate-200'
                                    }`}
                                  >
                                    <CheckCircle2 className="w-4 h-4 mr-1.5" />
                                    Terpenuhi
                                  </button>
                                  <button
                                    onClick={() => handleAnswerChange(item.id, 'TIDAK')}
                                    className={`flex items-center px-3 py-1.5 rounded text-sm font-medium transition-all ${
                                      answers[item.id] === 'TIDAK' 
                                        ? 'bg-[#F15A24] text-white shadow-sm' 
                                        : 'text-slate-600 hover:bg-slate-200'
                                    }`}
                                  >
                                    <XCircle className="w-4 h-4 mr-1.5" />
                                    Tidak
                                  </button>
                                </div>
                                <div className="flex flex-col items-center justify-center w-12 h-12 rounded-full bg-slate-50 border border-slate-200 shrink-0">
                                  <span className="text-xs text-slate-400 font-medium leading-none">Nilai</span>
                                  <span className="font-bold text-slate-700 leading-none mt-1">
                                    {item.penalties[golongan]}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Tambahan Catatan Lain */}
        <section className="bg-white rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-200/60 border border-slate-200 mt-8 overflow-hidden">
          <div className="bg-gradient-to-r from-[#003d79] to-[#001F3F] px-8 py-5 flex items-center shadow-sm">
<h2 className="text-xl font-serif font-bold text-white tracking-wide">F Catatan Lain (Persyaratan Mendapatkan Sertifikat)</h2>
          </div>
          <div className="p-6 space-y-4 text-left">
            <p className="text-sm text-slate-600 mb-4 font-medium italic border-b border-slate-100 pb-4">
              1. Hasil analisis pangan di laboratorium yang sudah terakreditasi KAN atau laboratorium yang ditetapkan Pemerintah Daerah.
              <br/>(catatan: jika hasil analisis dikeluarkan oleh laboratorium yang tidak sesuai ketentuan maka, hasil dianggap tidak sesuai dengan persyaratan)
            </p>
            
            <label className="flex items-start gap-3 cursor-pointer group">
              <input 
                type="checkbox"
                checked={labResultAir}
                onChange={(e) => setLabResultAir(e.target.checked)}
                className="mt-1 w-5 h-5 text-[#003d79] rounded border-slate-300 focus:ring-[#003d79]"
              />
              <div>
                <span className="text-sm font-semibold text-slate-700 group-hover:text-[#003d79] transition-colors">
                  a. Hasil E. coli untuk sampel air minum memenuhi persyaratan
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group pb-2">
              <input 
                type="checkbox"
                checked={labResultMakanan}
                onChange={(e) => setLabResultMakanan(e.target.checked)}
                className="mt-1 w-5 h-5 text-[#003d79] rounded border-slate-300 focus:ring-[#003d79]"
              />
              <div>
                <span className="text-sm font-semibold text-slate-700 group-hover:text-[#003d79] transition-colors">
                  b. Hasil E. coli untuk sampel makanan memenuhi persyaratan
                </span>
              </div>
            </label>
            
          </div>
        </section>

        {/* Kesimpulan & Tanda Tangan */}
        <section className="bg-white rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-200/60 border border-slate-200 mt-8 mb-24 overflow-hidden">
          <div className="p-6 space-y-6 text-left">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Kesimpulan:</label>
              <textarea
                value={kesimpulan}
                onChange={(e) => setKesimpulan(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-slate-200 rounded-[24px] bg-slate-50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-[#003d79] focus:border-[#003d79] transition-colors bg-slate-50 hover:bg-white"
                placeholder="Tuliskan kesimpulan hasil audit..."
              />
            </div>

          </div>
        </section>

        {/* Scoring Standard & Result */}
        <section className="bg-white rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-200/60 p-8 md:p-10 mb-8 overflow-hidden text-center">
          <h2 className="text-xl font-serif font-bold text-[#003d79] mb-4">Indikator Keputusan Dinkes</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-left">
            <div className={`p-4 rounded-xl border transition-all ${golongan === 'A' ? 'bg-gradient-to-r from-[#003d79] to-[#001F3F] text-white shadow-md' : 'bg-slate-50 border-slate-200 opacity-70'}`}>
              <div className="font-bold mb-1">Golongan A</div>
              <div className="text-sm opacity-90">Skor Minimal: 75</div>
            </div>
            <div className={`p-4 rounded-xl border transition-all ${golongan === 'B' ? 'bg-gradient-to-r from-[#003d79] to-[#001F3F] text-white shadow-md' : 'bg-slate-50 border-slate-200 opacity-70'}`}>
              <div className="font-bold mb-1">Golongan B</div>
              <div className="text-sm opacity-90">Skor Minimal: 80</div>
            </div>
            <div className={`p-4 rounded-xl border transition-all ${golongan === 'C' ? 'bg-gradient-to-r from-[#003d79] to-[#001F3F] text-white shadow-md' : 'bg-slate-50 border-slate-200 opacity-70'}`}>
              <div className="font-bold mb-1">Golongan C</div>
              <div className="text-sm opacity-90">Skor Minimal: 85</div>
            </div>
          </div>

          <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center">
            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Skor Anda Sementara</div>
            <div className="text-6xl font-serif font-bold text-[#003d79] mb-4">{finalScore}</div>
            
            {(() => {
              const targetScore = golongan === 'C' ? 85 : golongan === 'B' ? 80 : 75;
              
              if (progressStats.answered === 0) {
                return <div className="text-slate-500 font-medium">Mulai isi kuesioner untuk melihat status Anda</div>;
              }

              let resultStatus = '';
              let statusColor = '';
              let StatusIcon = CheckCircle2;
              
              if (penaltyStats.critical > 0) {
                resultStatus = 'TIDAK LULUS (Ditemukan Pelanggaran Kritis)';
                statusColor = 'bg-red-100 text-red-700 border-red-200';
                StatusIcon = XCircle;
              } else if (!labResultAir || !labResultMakanan) {
                resultStatus = 'TIDAK LULUS (Uji Lab Tidak Memenuhi Syarat)';
                statusColor = 'bg-red-100 text-red-700 border-red-200';
                StatusIcon = XCircle;
              } else if (parseFloat(finalScore) < targetScore) {
                resultStatus = 'TIDAK LULUS (Skor Kurang)';
                statusColor = 'bg-red-100 text-red-700 border-red-200';
                StatusIcon = AlertTriangle;
              } else if (totalPenalty === 0) {
                resultStatus = 'LULUS (Memenuhi Semua Standar)';
                statusColor = 'bg-green-100 text-green-700 border-green-200';
                StatusIcon = CheckCircle2;
              } else {
                resultStatus = 'LULUS BERSYARAT (Ada Temuan Minor/Mayor)';
                statusColor = 'bg-yellow-100 text-yellow-800 border-yellow-200';
                StatusIcon = AlertTriangle;
              }
              
              return (
                <div className={`px-5 py-2 font-bold rounded-full border flex items-center gap-2 ${statusColor}`}>
                  <StatusIcon className="w-5 h-5" />
                  {resultStatus}
                </div>
              );
            })()}
            
            <div className="text-sm font-medium text-slate-500 mt-4 text-center">
              Target skor laik higiene golongan {golongan} adalah {golongan === 'C' ? 85 : golongan === 'B' ? 80 : 75}.
              <div className="flex justify-center gap-4 mt-2">
                <span className="font-medium text-slate-700">Pelanggaran Kritis (Skor 3): <span className="font-bold text-red-600">{penaltyStats.critical}</span></span>
                <span className="font-medium text-slate-700">Mayor (Skor 2): <span className="font-bold text-orange-500">{penaltyStats.major}</span></span>
                <span className="font-medium text-slate-700">Minor (Skor 1): <span className="font-bold text-yellow-600">{penaltyStats.minor}</span></span>
              </div>
            </div>

            {(penaltyStats.criticalItems.length > 0 || penaltyStats.majorItems.length > 0 || penaltyStats.minorItems.length > 0) && (
              <div className="mt-6 w-full text-left">
                {penaltyStats.criticalItems.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-bold text-red-700 mb-2 flex items-center gap-2 text-sm">
                      <XCircle className="w-5 h-5" />
                      Pelanggaran Kritis (Skor 3) - Wajib Diperbaiki Segera
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700 bg-red-50 p-4 rounded-xl border border-red-100">
                      {penaltyStats.criticalItems.map(item => (
                        <li key={item.id}>{item.kriteria}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {penaltyStats.majorItems.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-bold text-[#F15A24] mb-2 flex items-center gap-2 text-sm">
                      <AlertTriangle className="w-5 h-5" />
                      Temuan Mayor (Skor 2) - Buat Catatan Perbaikan
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700 bg-orange-50 p-4 rounded-xl border border-orange-100">
                      {penaltyStats.majorItems.map(item => (
                        <li key={item.id}>{item.kriteria}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {penaltyStats.minorItems.length > 0 && (
                  <div>
                    <h4 className="font-bold text-yellow-600 mb-2 flex items-center gap-2 text-sm">
                      <AlertTriangle className="w-5 h-5" />
                      Temuan Minor (Skor 1) - Perhatian
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700 bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                      {penaltyStats.minorItems.map(item => (
                        <li key={item.id}>{item.kriteria}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

      </main>

      <footer className="text-center py-6 text-sm text-slate-500 pb-32">
        IT Support &amp; Design Development: Dede Hery Suryana
      </footer>

      {/* Fixed bottom navigation/status */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] p-4 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Progress Pengisian</span>
                <span className="text-xs font-bold text-[#003d79]">{progressStats.answered} / {progressStats.totalQuestions}</span>
              </div>
              <div className="w-48 md:w-64 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#003d79] transition-all duration-500 ease-out"
                  style={{ width: `${progressStats.totalQuestions === 0 ? 0 : (progressStats.answered / progressStats.totalQuestions) * 100}%` }}
                />
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              className="px-8 py-3.5 rounded-full font-serif font-bold text-base transition-all border-2 border-[#003d79] bg-white text-[#003d79] hover:bg-slate-50 focus:ring-4 focus:ring-blue-100 opacity-100"
              onClick={() => {
                const labAirText = labResultAir ? 'Memenuhi Syarat' : 'Tidak Memenuhi Syarat / Tidak Ada';
                const labMakananText = labResultMakanan ? 'Memenuhi Syarat' : 'Tidak Memenuhi Syarat / Tidak Ada';
                
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

              }}
            >
              Export ke Word (DOCX)
            </button>
            <button 
              className={`px-8 py-3.5 rounded-full font-serif font-bold text-base transition-all focus:ring-4 focus:ring-blue-100 ${
                !isSubmitting
                  ? 'bg-[#F15A24] text-white hover:bg-[#d94c1c] shadow-[0_8px_20px_rgba(241,90,36,0.25)] hover:-translate-y-0.5' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
              }`}
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan Audit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
