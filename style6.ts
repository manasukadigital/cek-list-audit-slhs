import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Global background and selection color
content = content.replace(
  /<div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-32">/g,
  '<div className="min-h-screen bg-[#FAFAFA] text-slate-800 font-sans pb-32 selection:bg-[#003d79] selection:text-white relative"><div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-[#003d79]/5 to-transparent pointer-events-none"></div>'
);

// Header frosted glass
content = content.replace(
  /<header className="bg-white text-slate-800 shadow-md sticky top-0 z-50 border-b border-slate-200">/g,
  '<header className="bg-white/70 backdrop-blur-xl text-slate-800 shadow-[0_4px_30px_rgba(0,0,0,0.03)] sticky top-0 z-50 border-b border-white/20">'
);

// Add styling to Checklist Section Headers to make them premium
content = content.replace(
  /className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center"/g,
  'className="p-5 bg-gradient-to-r from-[#003d79] to-[#001F3F] border-b border-transparent flex justify-between items-center"'
);

// Checklist section title colors (they were text-slate-800, now white because of the bg)
content = content.replace(
  /className="text-lg font-bold text-slate-800"/g,
  'className="text-lg font-serif font-bold text-slate-800"'
);

// We need to target the section headers inside the mapping specifically
content = content.replace(
  /<h2 className="text-lg font-serif font-bold text-slate-800">{cat\.name}<\/h2>/g,
  '<h2 className="text-xl font-serif font-bold text-white tracking-wide">{cat.name}</h2>'
);
content = content.replace(
  /<h2 className="text-lg font-serif font-bold text-slate-800 uppercase tracking-wider">{cat\.name}<\/h2>/g,
  '<h2 className="text-xl font-serif font-bold text-white uppercase tracking-wider">{cat.name}</h2>'
);

fs.writeFileSync('src/App.tsx', content);

console.log("Replaced successfully!");
