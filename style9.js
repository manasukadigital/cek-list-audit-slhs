const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

const standardHtml = `
          {/* Scoring Standard & Result */}
          <div className="mb-8 p-6 bg-[#003d79]/5 border border-[#003d79]/20 rounded-2xl">
            <h3 className="text-lg font-serif font-bold text-[#003d79] mb-4">Indikator Standar Laik Higiene Sanitasi (Kemenkes)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className={\`p-4 rounded-xl border \${golongan === 'A' ? 'bg-[#003d79] text-white shadow-md' : 'bg-white border-slate-200'}\`}>
                <div className="font-bold mb-1">Golongan A</div>
                <div className="text-sm opacity-90">Skor Minimal: 70</div>
              </div>
              <div className={\`p-4 rounded-xl border \${golongan === 'B' ? 'bg-[#003d79] text-white shadow-md' : 'bg-white border-slate-200'}\`}>
                <div className="font-bold mb-1">Golongan B</div>
                <div className="text-sm opacity-90">Skor Minimal: 83</div>
              </div>
              <div className={\`p-4 rounded-xl border \${golongan === 'C' ? 'bg-[#003d79] text-white shadow-md' : 'bg-white border-slate-200'}\`}>
                <div className="font-bold mb-1">Golongan C</div>
                <div className="text-sm opacity-90">Skor Minimal: 92</div>
              </div>
            </div>

            <div className="p-5 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col items-center">
              <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Skor Anda Saat Ini</div>
              <div className="text-5xl font-serif font-bold text-[#001F3F] mb-4">{finalScore}</div>
              {(() => {
                const targetScore = golongan === 'C' ? 92 : golongan === 'B' ? 83 : 70;
                const isPassing = finalScore >= targetScore;
                
                if (progressStats.answered === 0) {
                  return <div className="text-slate-500 font-medium">Mulai isi kuesioner untuk melihat status Anda</div>;
                }
                
                return isPassing ? (
                  <div className="px-5 py-2 bg-green-100 text-green-700 font-bold rounded-full border border-green-200 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    MEMENUHI STANDAR {golongan} (BAIK)
                  </div>
                ) : (
                  <div className="px-5 py-2 bg-red-100 text-red-700 font-bold rounded-full border border-red-200 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    BELUM MEMENUHI STANDAR {golongan} (KURANG)
                  </div>
                );
              })()}
              <div className="text-sm font-medium text-slate-500 mt-4 text-center">
                Maksimal pengurangan (penalti) yang diperbolehkan untuk golongan {golongan} adalah {100 - (golongan === 'C' ? 92 : golongan === 'B' ? 83 : 70)}.
                <br/>Total penalti Anda saat ini: <span className="font-bold text-[#F15A24]">{totalPenalty}</span>
              </div>
            </div>
          </div>
`;

// Insert it right before the Summary Stats which is before the Export button.
const targetLine = "Progress: {progressStats.answered} / {progressStats.totalQuestions} pertanyaan wajib terjawab";

if (content.includes(targetLine)) {
  const parts = content.split("</div>\n          </div>");
  // The structure at the end of the form is:
  //         <div className="text-slate-500 text-sm mb-4">
  //           Progress: {progressStats.answered} / {progressStats.totalQuestions} pertanyaan wajib terjawab
  //         </div>
  //       </div>
  //       
  //       <div className="flex flex-col sm:flex-row gap-3">
  
  // Actually, I can just use string replacement on a unique block
  content = content.replace(
    /        <div className="text-slate-500 text-sm mb-4">\s*Progress: \{progressStats.answered\} \/ \{progressStats.totalQuestions\} pertanyaan wajib terjawab\s*<\/div>\s*<\/div>/g,
    `        <div className="text-slate-500 text-sm mb-4">\n          Progress: {progressStats.answered} / {progressStats.totalQuestions} pertanyaan wajib terjawab\n        </div>\n      </div>\n\n` + standardHtml
  );
  fs.writeFileSync('src/App.tsx', content);
  console.log('Successfully inserted standard HTML.');
} else {
  console.log('Search string not found.');
}
