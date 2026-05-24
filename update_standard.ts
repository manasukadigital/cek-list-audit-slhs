import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `<section className="bg-white rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-200/60 p-8 md:p-10 mb-8 overflow-hidden text-center">
          <h2 className="text-xl font-serif font-bold text-[#003d79] mb-4">Indikator Standar Laik Higiene Sanitasi (Kemenkes)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-left">
            <div className={\`p-4 rounded-xl border transition-all \${golongan === 'A' ? 'bg-gradient-to-r from-[#003d79] to-[#001F3F] text-white shadow-md' : 'bg-slate-50 border-slate-200 opacity-70'}\`}>
              <div className="font-bold mb-1">Golongan A</div>
              <div className="text-sm">Skor Minimal: 70</div>
            </div>
            <div className={\`p-4 rounded-xl border transition-all \${golongan === 'B' ? 'bg-gradient-to-r from-[#003d79] to-[#001F3F] text-white shadow-md' : 'bg-slate-50 border-slate-200 opacity-70'}\`}>
              <div className="font-bold mb-1">Golongan B</div>
              <div className="text-sm">Skor Minimal: 83</div>
            </div>
            <div className={\`p-4 rounded-xl border transition-all \${golongan === 'C' ? 'bg-gradient-to-r from-[#003d79] to-[#001F3F] text-white shadow-md' : 'bg-slate-50 border-slate-200 opacity-70'}\`}>
              <div className="font-bold mb-1">Golongan C</div>
              <div className="text-sm">Skor Minimal: 92</div>
            </div>
          </div>

          <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center">
            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Skor Anda Sementara</div>
            <div className="text-6xl font-serif font-bold text-[#003d79] mb-4">{finalScore}</div>
            
            {(() => {
              const targetScore = golongan === 'C' ? 92 : golongan === 'B' ? 83 : 70;
              const isPassing = finalScore >= targetScore;
              
              if (progressStats.answered === 0) {
                return <div className="text-slate-500 font-medium">Mulai isi kuesioner untuk melihat status Anda</div>;
              }
              
              return isPassing ? (
                <div className="px-5 py-2 bg-green-100 text-green-700 font-bold rounded-full border border-green-200 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  MEMENUHI STANDAR GOLONGAN {golongan} (BAIK)
                </div>
              ) : (
                <div className="px-5 py-2 bg-red-100 text-red-700 font-bold rounded-full border border-red-200 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  BELUM MEMENUHI KETENTUAN (KURANG)
                </div>
              );
            })()}
            
            <div className="text-sm font-medium text-slate-500 mt-4 text-center">
              Target skor laik higiene golongan {golongan} adalah {golongan === 'C' ? 92 : golongan === 'B' ? 83 : 70}.
              <br/>Total penalti Anda saat ini: <span className="font-bold text-[#F15A24]">{totalPenalty}</span>
            </div>
          </div>
        </section>`;

const newStr = `<section className="bg-white rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-200/60 p-8 md:p-10 mb-8 overflow-hidden text-center">
          <h2 className="text-xl font-serif font-bold text-[#003d79] mb-4">Indikator Keputusan Dinkes</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-left">
            <div className={\`p-4 rounded-xl border transition-all \${golongan === 'A' ? 'bg-gradient-to-r from-[#003d79] to-[#001F3F] text-white shadow-md' : 'bg-slate-50 border-slate-200 opacity-70'}\`}>
              <div className="font-bold mb-1">Golongan A</div>
              <div className="text-sm opacity-90">Skor Minimal: 75</div>
            </div>
            <div className={\`p-4 rounded-xl border transition-all \${golongan === 'B' ? 'bg-gradient-to-r from-[#003d79] to-[#001F3F] text-white shadow-md' : 'bg-slate-50 border-slate-200 opacity-70'}\`}>
              <div className="font-bold mb-1">Golongan B</div>
              <div className="text-sm opacity-90">Skor Minimal: 80</div>
            </div>
            <div className={\`p-4 rounded-xl border transition-all \${golongan === 'C' ? 'bg-gradient-to-r from-[#003d79] to-[#001F3F] text-white shadow-md' : 'bg-slate-50 border-slate-200 opacity-70'}\`}>
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
                <div className={\`px-5 py-2 font-bold rounded-full border flex items-center gap-2 \${statusColor}\`}>
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
          </div>
        </section>`;

if (content.indexOf("Indikator Standar Laik Higiene Sanitasi (Kemenkes)") !== -1) {
  content = content.replace(targetStr, newStr);
  fs.writeFileSync('src/App.tsx', content);
  console.log("Updated standard score format.");
} else {
  console.log("Not found.");
}
