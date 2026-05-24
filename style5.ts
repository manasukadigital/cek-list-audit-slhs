import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// The row background
content = content.replace(
  /answers\[item.id\] === 'TIDAK' \? 'bg-red-50 border-red-200'[\s\S]*?: 'bg-white border-slate-200'/g,
  "answers[item.id] ? 'bg-white border-[#003d79]/20 shadow-sm' : 'bg-slate-50/50 border-slate-200 hover:border-slate-300 transition-colors'"
);

// The YES button selected state
content = content.replace(
  /'bg-green-600 text-white shadow-\[0_2px_10px_rgba\(0,0,0,0.04\)\] border border-slate-200\/60'/g,
  "'bg-[#1A4B4B] text-white shadow-sm'"
);

// The NO button selected state
content = content.replace(
  /'bg-red-600 text-white shadow-\[0_2px_10px_rgba\(0,0,0,0.04\)\] border border-slate-200\/60'/g,
  "'bg-[#F15A24] text-white shadow-sm'"
);

// Form inputs sleekness
content = content.replace(
  /className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-slate-50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-\[#003d79\] focus:border-\[#003d79\] transition-colors"/g,
  'className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50/50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-[#003d79]/20 focus:border-[#003d79] transition-all outline-none"'
);

// Textarea
content = content.replace(
  /className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-slate-50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-\[#003d79\] focus:border-\[#003d79\] transition-colors resize-none"/g,
  'className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50/50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-[#003d79]/20 focus:border-[#003d79] transition-all outline-none resize-none"'
);

// Label text refinements
content = content.replace(
  /className="block text-sm font-medium text-slate-700 mb-1\.5"/g,
  'className="block text-sm font-semibold tracking-wide text-slate-800 mb-2"'
);

// Checklist labels
content = content.replace(
  /className="ml-2 text-sm text-slate-600"/g,
  'className="ml-2 text-sm font-medium text-slate-600"'
);

fs.writeFileSync('src/App.tsx', content);

console.log("Replaced successfully!");
