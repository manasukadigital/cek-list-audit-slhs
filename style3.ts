import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace the accordion styled buttons
content = content.replace(/<div className="inline-block bg-\[#F15A24\] text-white font-bold px-5 py-2 rounded-full text-sm md:text-base border-2 border-white group-hover:bg-\[#d94c1c\] transition-colors[^"]*">/g, '<div className="text-xl md:text-2xl font-serif font-bold text-[#003d79] border-l-4 border-[#F15A24] pl-4 group-hover:text-[#F15A24] transition-colors">');
content = content.replace(/<div className="text-\[#001F3F\] font-bold text-lg md:text-xl">/g, '<div className="text-xl md:text-2xl font-serif font-bold text-[#003d79] border-l-4 border-[#F15A24] pl-4 group-hover:text-[#F15A24] transition-colors">');

// Update the chevron icon color
content = content.replace(/ChevronDown className="w-6 h-6 text-\[#001F3F\]/g, 'ChevronDown className="w-6 h-6 text-[#003d79]');
content = content.replace(/ChevronUp className="w-6 h-6 text-\[#001F3F\]/g, 'ChevronUp className="w-6 h-6 text-[#003d79]');

fs.writeFileSync('src/App.tsx', content);

console.log("Replaced successfully!");
