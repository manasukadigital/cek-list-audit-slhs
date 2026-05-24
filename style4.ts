import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Update Hero Title
content = content.replace(/font-extrabold text-white tracking-tight leading-\[1.1\]/g, 'font-serif font-bold text-white tracking-tight leading-[1.1] text-shadow-sm');

// Adjust the top header (with the app title) to look sleeker
content = content.replace(/className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4"/g, 'className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6"');
content = content.replace(/className="text-sm font-bold text-\[#003d79\] tracking-wide uppercase leading-tight"/g, 'className="text-sm font-serif font-bold text-[#003d79] tracking-widest uppercase leading-tight"');

// Fix border radius on cards to be slightly sharper and cleaner for an editorial look, 
// using rounded-2xl or rounded-3xl but we stick to rounded-[24px] for modern sleekness.
content = content.replace(/rounded-\[20px\]/g, 'rounded-[24px]');

// Find all list numbers and make them prettier with playfair font
// Actually, let's keep the content legible with Sans

fs.writeFileSync('src/App.tsx', content);

console.log("Replaced successfully!");
