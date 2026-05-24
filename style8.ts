import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Final submit button styling
content = content.replace(
  /className=\{`px-6 py-2\.5 rounded-lg font-medium text-sm transition-all focus:ring-4 focus:ring-blue-100 \$\{/g,
  'className={`px-8 py-3.5 rounded-full font-serif font-bold text-base transition-all focus:ring-4 focus:ring-blue-100 ${'
);

// Final submit button colors
content = content.replace(
  /'bg-\[#003d79\] text-white hover:bg-\[#002f5e\] shadow-md'/g,
  "'bg-[#F15A24] text-white hover:bg-[#d94c1c] shadow-[0_8px_20px_rgba(241,90,36,0.25)] hover:-translate-y-0.5'"
);
content = content.replace(
  /'bg-slate-100 text-slate-400 cursor-not-allowed'/g,
  "'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'"
);

// Simpan text adjustments
content = content.replace(
  /Simpan \& Hitung Hasil/g,
  'Kirim Laporan & Hitung Hasil'
);

fs.writeFileSync('src/App.tsx', content);

console.log("Replaced successfully!");
