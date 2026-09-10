const fs = require('fs');

let code = fs.readFileSync('src/views/BookDetail.tsx', 'utf8');

const colorMap = {
  '#0c6780': 'primary',
  '#87ceeb': 'primary-container',
  '#005870': 'on-primary-container',
  '#705d00': 'secondary',
  '#fcd400': 'secondary-container',
  '#6e5c00': 'on-secondary-container',
  '#006e1c': 'tertiary',
  '#76da75': 'tertiary-container',
  '#005f17': 'on-tertiary-container',
  '#fefccf': 'background', // Or surface
  '#1d1d03': 'on-background',
  '#e6e5b9': 'surface-variant',
  '#3f484c': 'on-surface-variant',
  '#eceabe': 'surface-container-high',
  '#f8f6c9': 'surface-container-low',
  '#f2f0c4': 'surface-container',
  '#e9c400': 'secondary-fixed-dim',
  '#ba1a1a': 'error',
  '#ffdad6': 'error-container'
};

for (const [hex, name] of Object.entries(colorMap)) {
  // Replace direct uses like bg-[#0c6780] with bg-primary
  // using a regex to catch prefixes (bg, text, border, ring, from, via, to, selection:bg, etc.)
  const regex = new RegExp(`\\[${hex}\\]`, 'gi');
  code = code.replace(regex, name);
  
  // also handle some cases where it might be lowercase/uppercase
}

// Some shadows have hardcoded rgba(12,103,128,x), which is the old primary rgb(12, 103, 128)
// Let's replace those with standard shadow colors from our theme, or just use magic-shadow
code = code.replace(/rgba\(12,\s*103,\s*128,\s*[\d.]+\)/g, 'rgba(0, 229, 255, 0.2)');

fs.writeFileSync('src/views/BookDetail.tsx', code);
console.log('Colors replaced!');
