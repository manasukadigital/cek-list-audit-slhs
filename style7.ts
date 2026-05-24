import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Fix the checklist headers
content = content.replace(
  /className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between"/g,
  'className="bg-gradient-to-r from-[#003d79] to-[#001F3F] border-b border-transparent px-8 py-5 flex items-center justify-between shadow-sm"'
);

// We need to change the header text to white inside these blocks
content = content.replace(
  /<h2 className="text-lg font-serif font-bold text-slate-800">\{section.name\}<\/h2>/g,
  '<h2 className="text-xl font-serif font-bold text-white tracking-wide">{section.name}</h2>'
);

content = content.replace(
  /className="text-sm font-medium text-slate-500"/g,
  'className="text-sm font-medium text-white/80 border border-white/20 bg-white/10 px-3 py-1 rounded-full"'
);

// Fix the "Informasi Fasilitas" header
content = content.replace(
  /className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-2">Informasi/g,
  'className="text-2xl font-serif font-bold text-[#001F3F] mb-6 border-b border-slate-100 pb-4">Informasi'
);

// Fix "F Catatan Lain" header
content = content.replace(
  /className="bg-slate-50 border-b border-slate-200 px-6 py-4">[\s\n]*<h2 className="text-lg font-serif font-bold text-slate-800">/g,
  'className="bg-gradient-to-r from-[#003d79] to-[#001F3F] px-8 py-5 flex items-center shadow-sm">\n<h2 className="text-xl font-serif font-bold text-white tracking-wide">'
);

fs.writeFileSync('src/App.tsx', content);

console.log("Replaced successfully!");
