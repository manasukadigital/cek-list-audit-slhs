import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldHeader = `<h2 className="text-2xl font-serif font-bold text-[#001F3F] mb-6 border-b border-slate-100 pb-4">Informasi Fasilitas</h2>`;
const newHeader = `<div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
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
          </div>`;

content = content.replace(oldHeader, newHeader);

fs.writeFileSync('src/App.tsx', content);
