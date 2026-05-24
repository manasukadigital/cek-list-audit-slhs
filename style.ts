import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Colors
content = content.replace(/#1A4B4B/g, '#001F3F'); // Dark navy text
content = content.replace(/bg-\\[#1A4B4B\\]/g, 'bg-[#003d79]'); // Hero bg
content = content.replace(/#EAF3DE/g, 'white');
content = content.replace(/#00A79D/g, '#F15A24'); // brand-orange
content = content.replace(/#008A82/g, '#d94c1c'); // darker orange hover
content = content.replace(/bg-indigo-600/g, 'bg-[#003d79]'); // buttons
content = content.replace(/hover:bg-indigo-700/g, 'hover:bg-[#002f5e]');
content = content.replace(/text-indigo-600/g, 'text-[#003d79]');
content = content.replace(/text-indigo-700/g, 'text-[#003d79]');
content = content.replace(/text-indigo-500/g, 'text-[#F15A24]'); // icons to orange
content = content.replace(/bg-indigo-50/g, 'bg-slate-50');
content = content.replace(/bg-indigo-100/g, 'bg-blue-50');
content = content.replace(/border-indigo-200/g, 'border-blue-100');
content = content.replace(/text-indigo-900/g, 'text-slate-800');
content = content.replace(/focus:ring-indigo-500/g, 'focus:ring-[#003d79]');
content = content.replace(/focus:border-indigo-500/g, 'focus:border-[#003d79]');

// Form styles
content = content.replace(/border-indigo-200/g, 'border-blue-100');
content = content.replace(/border-slate-300 rounded-lg/g, 'border-slate-200 rounded-xl bg-slate-50 hover:bg-white focus:bg-white');
content = content.replace(/shadow-lg/g, 'shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-200/60');
content = content.replace(/shadow-sm/g, 'shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-200/60');

// Component styles
content = content.replace(/rounded-2xl/g, 'rounded-[20px]');
content = content.replace(/rounded-xl/g, 'rounded-[20px]');

fs.writeFileSync('src/App.tsx', content);

console.log("Replaced successfully!");
