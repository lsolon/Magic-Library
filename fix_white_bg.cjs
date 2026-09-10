const fs = require('fs');
const path = require('path');

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let code = fs.readFileSync(fullPath, 'utf8');
      
      // Fix background whites
      code = code.replace(/bg-white\/\d+/g, 'bg-surface-container-high/60');
      code = code.replace(/bg-white(?!\/)/g, 'bg-surface-container-low');
      
      // Fix background variants
      code = code.replace(/text-white(?!\/)/g, 'text-on-surface');
      code = code.replace(/border-white(?!\/)/g, 'border-primary/50');
      
      // Some text that might be dark needs to be light
      // We already mapped standard colors, but let's check for any hardcoded # colors left
      code = code.replace(/#1d1d03/gi, 'var(--color-on-background)');
      
      fs.writeFileSync(fullPath, code);
    }
  }
}

processDirectory('src/views');
processDirectory('src/components');
console.log('White backgrounds replaced!');
